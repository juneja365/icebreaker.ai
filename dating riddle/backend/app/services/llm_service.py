import json
import logging
from typing import Optional
from app.config import settings
from app.schemas import (
    IcebreakerRequest, IcebreakerResponse,
    ReplyCoachRequest, ReplyCoachResponse,
    RescueRequest, RescueResponse,
    RewriteRequest, RewriteResponse,
    BioRequest, BioResponse,
    ScreenshotAnalysisRequest, ScreenshotAnalysisResponse,
    DeliveryAdviceRequest, DeliveryAdviceResponse,
    WhatWasMeantRequest, WhatWasMeantResponse
)
from app.services.heuristic_engine import SmartHeuristicEngine
from app.services.safety_service import analyze_respect_and_safety

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are Icebreaker AI, the world-class conversation and dating coach.
Your mission is to help people start natural, engaging, personalized conversations without sounding awkward, robotic, pushy, or manipulative.

Core Guidelines:
1. Low Pressure: Never be demanding, guilt-tripping, or boundary-crossing.
2. Natural Hooks: Ground opening lines in shared context, genuine curiosity, or lighthearted banter.
3. Brevity: Sound like a real person texting on an iPhone, not a corporate email.
4. Output Format: ALWAYS reply in valid JSON adhering precisely to the requested schema.
"""

class LLMService:
    @classmethod
    def _has_openai_key(cls) -> bool:
        return bool(settings.OPENAI_API_KEY and len(settings.OPENAI_API_KEY.strip()) > 10)

    @classmethod
    def _has_groq_key(cls) -> bool:
        return bool(settings.GROQ_API_KEY and len(settings.GROQ_API_KEY.strip()) > 10)

    @classmethod
    async def generate_icebreakers(cls, req: IcebreakerRequest) -> IcebreakerResponse:
        # Check if external LLM should be called
        if cls._has_openai_key() or cls._has_groq_key():
            try:
                # Attempt external LLM generation
                import openai
                api_key = settings.OPENAI_API_KEY or settings.GROQ_API_KEY
                base_url = "https://api.groq.com/openai/v1" if (not settings.OPENAI_API_KEY and settings.GROQ_API_KEY) else None
                model = settings.GROQ_MODEL if base_url else settings.OPENAI_MODEL

                client = openai.AsyncOpenAI(api_key=api_key, base_url=base_url)

                user_prompt = f"""Generate 3 distinct icebreakers for this situation:
Setting: {req.setting}
Situation: {req.situation}
Desired Vibe: {req.vibe}
Target Person Details: {req.target_details or 'None provided'}
User Persona: {req.user_persona or 'Casual'}

Return JSON matching this exact structure:
{{
  "setting": "{req.setting}",
  "situation_analysis": "One sentence explaining the conversational dynamic",
  "options": [
    {{
      "id": "1",
      "style": "Casual & Low-Pressure",
      "text": "The message to send",
      "why_it_works": "Psychological breakdown of why this engages the recipient",
      "respect_score": 98,
      "follow_up_tip": "Next move advice"
    }},
    {{
      "id": "2",
      "style": "Funny & Witty",
      "text": "The message to send",
      "why_it_works": "Why humor works here",
      "respect_score": 97,
      "follow_up_tip": "Next move advice"
    }},
    {{
      "id": "3",
      "style": "Confident & Direct",
      "text": "The message to send",
      "why_it_works": "Why confidence works here",
      "respect_score": 96,
      "follow_up_tip": "Next move advice"
    }}
  ]
}}"""
                response = await client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_prompt}
                    ],
                    response_format={"type": "json_object"} if "gpt-4" in model or "groq" in (base_url or "") else None,
                    temperature=0.75,
                )
                raw_json = response.choices[0].message.content
                data = json.loads(raw_json)
                safety = analyze_respect_and_safety(" ".join([opt["text"] for opt in data.get("options", [])]))
                
                return IcebreakerResponse(
                    setting=req.setting,
                    situation_analysis=data.get("situation_analysis", "Analyzed conversational opening."),
                    options=data.get("options", []),
                    safety_assessment=safety,
                    provider_used=f"llm_{model}"
                )
            except Exception as e:
                logger.warning(f"External LLM call failed ({str(e)}). Gracefully falling back to SmartHeuristicEngine.")
        
        # Default / Fallback
        return SmartHeuristicEngine.generate_icebreakers(req)

    @classmethod
    async def generate_reply_coach(cls, req: ReplyCoachRequest) -> ReplyCoachResponse:
        if cls._has_openai_key() or cls._has_groq_key():
            try:
                import openai
                api_key = settings.OPENAI_API_KEY or settings.GROQ_API_KEY
                base_url = "https://api.groq.com/openai/v1" if (not settings.OPENAI_API_KEY and settings.GROQ_API_KEY) else None
                model = settings.GROQ_MODEL if base_url else settings.OPENAI_MODEL

                client = openai.AsyncOpenAI(api_key=api_key, base_url=base_url)

                user_prompt = f"""They said: "{req.received_message}"
Context: {req.conversation_context or 'Recent exchange'}
Goal/Intent: {req.desired_intent}
Vibe: {req.vibe}

Generate 3 natural, compelling reply choices in JSON:
{{
  "intent_detected": "{req.desired_intent}",
  "subtext_analysis": "What their message actually signaled and why this approach works",
  "replies": [
    {{
      "id": "1",
      "label": "The Natural Flow",
      "text": "reply 1",
      "subtext": "what this signals",
      "momentum_rating": "High engagement"
    }},
    {{
      "id": "2",
      "label": "The Playful Pivot",
      "text": "reply 2",
      "subtext": "what this signals",
      "momentum_rating": "Flirty & Banter"
    }},
    {{
      "id": "3",
      "label": "The Direct Move",
      "text": "reply 3",
      "subtext": "what this signals",
      "momentum_rating": "High intent"
    }}
  ]
}}"""
                response = await client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.7,
                )
                data = json.loads(response.choices[0].message.content)
                safety = analyze_respect_and_safety(" ".join([r["text"] for r in data.get("replies", [])]))
                return ReplyCoachResponse(
                    intent_detected=data.get("intent_detected", req.desired_intent),
                    subtext_analysis=data.get("subtext_analysis", "Analyzed received message."),
                    replies=data.get("replies", []),
                    safety_assessment=safety,
                    provider_used=f"llm_{model}"
                )
            except Exception as e:
                logger.warning(f"Reply coach LLM failed ({str(e)}). Falling back to SmartHeuristicEngine.")

        return SmartHeuristicEngine.generate_reply_coach(req)

    @classmethod
    async def generate_rescue(cls, req: RescueRequest) -> RescueResponse:
        return SmartHeuristicEngine.generate_rescue(req)

    @classmethod
    async def rewrite_message(cls, req: RewriteRequest) -> RewriteResponse:
        return SmartHeuristicEngine.rewrite_message(req)

    @classmethod
    async def generate_bios(cls, req: BioRequest) -> BioResponse:
        return SmartHeuristicEngine.generate_bios(req)

    @classmethod
    async def analyze_screenshot(cls, req: ScreenshotAnalysisRequest) -> ScreenshotAnalysisResponse:
        return SmartHeuristicEngine.analyze_screenshot(req)

    @classmethod
    async def get_delivery_advice(cls, req: DeliveryAdviceRequest) -> DeliveryAdviceResponse:
        return SmartHeuristicEngine.get_delivery_advice(req)

    @classmethod
    async def decode_what_was_meant(cls, req: WhatWasMeantRequest) -> WhatWasMeantResponse:
        return SmartHeuristicEngine.decode_what_was_meant(req)


