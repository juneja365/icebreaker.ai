import os
import json
from pathlib import Path
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.schemas import (
    IcebreakerRequest, IcebreakerResponse,
    ReplyCoachRequest, ReplyCoachResponse,
    RescueRequest, RescueResponse,
    RewriteRequest, RewriteResponse,
    SafetyCheckRequest, SafetyReport,
    BioRequest, BioResponse,
    ScreenshotAnalysisRequest, ScreenshotAnalysisResponse,
    DeliveryAdviceRequest, DeliveryAdviceResponse,
    WhatWasMeantRequest, WhatWasMeantResponse,
    UserFeedbackRequest, FavoriteItem
)
from app.services.llm_service import LLMService
from app.services.safety_service import analyze_respect_and_safety
from app.services.supabase_service import SupabaseService
from app.database import (
    init_db,
    log_conversation,
    log_riddle_decode,
    save_favorite_record,
    get_recent_conversations,
    get_all_favorites,
    delete_favorite_record,
    get_database_telemetry
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Icebreaker AI API — Contextual conversation opener, reply coach, conversation rescuer, and respect guard."
)

@app.on_event("startup")
def on_startup():
    init_db()


# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SCENARIOS_PATH = Path(__file__).parent / "data" / "scenarios.json"

@app.get("/")
def read_root():
    return {
        "app": "Icebreaker AI",
        "status": "online",
        "version": settings.VERSION,
        "docs": "/docs",
        "motto": "Turn awkward silences into natural conversations"
    }

@app.get("/api/health")
def health_check():
    has_openai = bool(settings.OPENAI_API_KEY)
    has_groq = bool(settings.GROQ_API_KEY)
    has_supabase = bool(settings.SUPABASE_URL and settings.SUPABASE_KEY)
    
    active_engine = "OpenAI GPT-4o-mini" if has_openai else ("Groq LLaMA-3.1" if has_groq else "Smart Heuristic Engine (Zero-Latency)")

    return {
        "status": "healthy",
        "engine": active_engine,
        "llm_key_present": has_openai or has_groq,
        "supabase_connected": has_supabase,
        "version": settings.VERSION
    }

@app.get("/api/scenarios")
def get_scenarios():
    if SCENARIOS_PATH.exists():
        with open(SCENARIOS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@app.post("/api/icebreakers", response_model=IcebreakerResponse)
async def create_icebreakers(req: IcebreakerRequest):
    try:
        response = await LLMService.generate_icebreakers(req)
        # Log to local persistent SQLite Database
        log_conversation(
            tool_type="icebreaker",
            channel=req.setting,
            input_data=req.model_dump(),
            output_data=response.model_dump(),
            respect_score=98,
            provider=response.provider_used
        )
        # Optional mirror to Supabase
        await SupabaseService.save_session_event("icebreaker_generated", {
            "setting": req.setting,
            "vibe": req.vibe,
            "options_count": len(response.options)
        })
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Icebreaker generation error: {str(e)}"
        )

@app.post("/api/reply-coach", response_model=ReplyCoachResponse)
async def reply_coach(req: ReplyCoachRequest):
    try:
        response = await LLMService.generate_reply_coach(req)
        log_conversation(
            tool_type="reply_coach",
            channel="received_message",
            input_data=req.model_dump(),
            output_data=response.model_dump(),
            respect_score=97,
            provider=response.provider_used
        )
        await SupabaseService.save_session_event("reply_coached", {
            "intent": req.desired_intent,
            "vibe": req.vibe
        })
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Reply coach error: {str(e)}"
        )

@app.post("/api/rescue", response_model=RescueResponse)
async def rescue_conversation(req: RescueRequest):
    try:
        response = await LLMService.generate_rescue(req)
        log_conversation(
            tool_type="rescue",
            channel="stalled_chat",
            input_data=req.model_dump(),
            output_data=response.model_dump(),
            respect_score=99,
            provider=response.provider_used
        )
        await SupabaseService.save_session_event("conversation_rescued", {
            "stall_reason": req.stall_reason
        })
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Rescue error: {str(e)}"
        )

@app.post("/api/rewrite", response_model=RewriteResponse)
async def rewrite_tone(req: RewriteRequest):
    try:
        response = await LLMService.rewrite_message(req)
        log_conversation(
            tool_type="rewrite",
            channel="tone_tuner",
            input_data=req.model_dump(),
            output_data=response.model_dump(),
            respect_score=98,
            provider="smart_engine"
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Rewrite error: {str(e)}"
        )

@app.post("/api/bio-builder", response_model=BioResponse)
async def create_dating_bios(req: BioRequest):
    try:
        response = await LLMService.generate_bios(req)
        log_conversation(
            tool_type="bio_builder",
            channel=req.platform,
            input_data=req.model_dump(),
            output_data=response.model_dump(),
            respect_score=99,
            provider=response.provider_used
        )
        await SupabaseService.save_session_event("bio_generated", {
            "platform": req.platform,
            "archetype": req.archetype
        })
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Bio generation error: {str(e)}"
        )

@app.post("/api/screenshot-analyze", response_model=ScreenshotAnalysisResponse)
async def analyze_screenshot(req: ScreenshotAnalysisRequest):
    try:
        response = await LLMService.analyze_screenshot(req)
        log_conversation(
            tool_type="screenshot_scan",
            channel="visual_analyzer",
            input_data={"snippet": req.ocr_text_manual or req.context_notes},
            output_data=response.model_dump(),
            respect_score=96,
            provider=response.provider_used
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Screenshot analysis error: {str(e)}"
        )

@app.post("/api/delivery-advice", response_model=DeliveryAdviceResponse)
async def delivery_advice(req: DeliveryAdviceRequest):
    try:
        response = await LLMService.get_delivery_advice(req)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Delivery advice error: {str(e)}"
        )

@app.post("/api/what-was-meant", response_model=WhatWasMeantResponse)
async def decode_what_was_meant(req: WhatWasMeantRequest):
    try:
        response = await LLMService.decode_what_was_meant(req)
        # Log to riddle decodes table in SQLite
        log_riddle_decode(
            phrase=req.ambiguous_phrase,
            gap_score=response.gap_risk_score,
            diagnosis=response.projection_diagnosis,
            selected_bridge=response.gap_bridges[0].text if response.gap_bridges else ""
        )
        # Also log conversation event
        log_conversation(
            tool_type="what_was_meant",
            channel="gap_decoder",
            input_data=req.model_dump(),
            output_data=response.model_dump(),
            respect_score=100 - response.gap_risk_score,
            provider=response.provider_used
        )
        await SupabaseService.save_session_event("what_was_meant_decoded", {
            "ambiguous_phrase": req.ambiguous_phrase,
            "gap_risk": response.gap_risk_score
        })
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"What was meant decode error: {str(e)}"
        )

@app.post("/api/safety-check", response_model=SafetyReport)
def safety_check(req: SafetyCheckRequest):
    return analyze_respect_and_safety(req.text, req.context or "")

# ----------------- Database Inspection & Persistence Endpoints -----------------

@app.get("/api/database/status")
def database_status():
    """Returns database path, size in KB, engine type, and row counts across all tables."""
    return get_database_telemetry()

@app.get("/api/database/conversations")
def database_conversations(limit: int = 30):
    """Retrieves recent conversation generations stored in SQLite."""
    return get_recent_conversations(limit=limit)

@app.get("/api/database/favorites")
def database_favorites():
    """Retrieves all bookmarked openers, replies, and riddle bridges."""
    return get_all_favorites()

@app.post("/api/database/favorites")
def database_save_favorite(fav: FavoriteItem):
    """Persists a favorite suggestion directly to disk in icebreaker.db."""
    import uuid
    record_id = fav.id or f"fav_{uuid.uuid4().hex[:8]}"
    success = save_favorite_record(
        record_id=record_id,
        tool_type=fav.tool_type,
        text=fav.text_content,
        tag=fav.tag or "Saved",
        metadata=fav.metadata
    )
    if not success:
        raise HTTPException(status_code=500, detail="Failed to persist favorite to database")
    return {"status": "saved", "id": record_id}

@app.delete("/api/database/favorites/{fav_id}")
def database_delete_favorite(fav_id: str):
    """Removes a saved record from SQLite."""
    delete_favorite_record(fav_id)
    return {"status": "deleted", "id": fav_id}

@app.post("/api/feedback")
async def record_feedback(req: UserFeedbackRequest):
    await SupabaseService.save_session_event("user_feedback", req.model_dump())
    return {"status": "success", "message": "Feedback recorded for model evaluation benchmark."}

@app.get("/api/history")
def get_history():
    return SupabaseService.get_recent_events(limit=15)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

