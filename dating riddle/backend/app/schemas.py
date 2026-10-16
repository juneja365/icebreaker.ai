from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ----------------- Safety & Respect Guard -----------------
class SafetyReport(BaseModel):
    is_safe: bool = True
    respect_score: int = Field(default=98, ge=0, le=100)
    pressure_level: str = "low"  # low, moderate, high
    feedback: str = "Low-pressure, respectful, and open-ended."
    flags: List[str] = Field(default_factory=list)
    positive_tags: List[str] = Field(
        default_factory=lambda: ["Consensual", "Natural Hook", "Easy to Answer"]
    )

class SafetyCheckRequest(BaseModel):
    text: str
    context: Optional[str] = None

# ----------------- 1. Context-Aware Icebreakers -----------------
class IcebreakerRequest(BaseModel):
    setting: str = Field(..., description="E.g., college, instagram, dating, teammate, stranger, custom")
    situation: str = Field(..., description="Specific context of the encounter or profile")
    vibe: str = Field(default="chill", description="chill, funny, confident, thoughtful, playful")
    target_details: Optional[str] = Field(None, description="Interests, outfit, bio snippet, shared experience")
    user_persona: Optional[str] = Field(None, description="User's natural communication style")

class IcebreakerOption(BaseModel):
    id: str
    style: str  # "Casual & Low-Pressure", "Funny & Witty", "Confident & Direct", etc.
    text: str
    why_it_works: str  # Psychological explanation of why this hooks natural interest
    respect_score: int = 98
    follow_up_tip: str

class IcebreakerResponse(BaseModel):
    setting: str
    situation_analysis: str
    options: List[IcebreakerOption]
    safety_assessment: SafetyReport
    provider_used: str = "smart_ai"

# ----------------- 2. Reply Coach -----------------
class ReplyCoachRequest(BaseModel):
    received_message: str = Field(..., description="The message the other person sent")
    conversation_context: Optional[str] = Field(None, description="Background or past messages")
    desired_intent: Optional[str] = Field(
        default="keep_vibe", 
        description="keep_vibe, ask_out, playful_banter, deepen_convo, low_pressure_exit"
    )
    vibe: Optional[str] = "chill"

class ReplyCoachOption(BaseModel):
    id: str
    label: str  # e.g., "The Playful Callback", "The Curious Question", "The Bold Move"
    text: str
    subtext: str  # What impression this message leaves
    momentum_rating: str  # "High engagement", "Easy reply", "Flirty banter"

class ReplyCoachResponse(BaseModel):
    intent_detected: str
    subtext_analysis: str
    replies: List[ReplyCoachOption]
    safety_assessment: SafetyReport
    provider_used: str = "smart_ai"

# ----------------- 3. Conversation Rescue -----------------
class RescueRequest(BaseModel):
    last_messages: str = Field(..., description="Recent dry messages, e.g. 'Them: haha yeah'")
    stall_reason: str = Field(
        default="one_word_answer", 
        description="one_word_answer, ghosted_2_days, dead_end_topic, awkward_silence"
    )
    vibe: Optional[str] = "chill"

class RescueStrategy(BaseModel):
    id: str
    approach: str  # "Graceful Topic Pivot", "Witty Callback", "Low-Stakes Visual/Meme Ping"
    text: str
    rationale: str

class RescueResponse(BaseModel):
    stall_diagnosis: str
    strategies: List[RescueStrategy]
    coach_tip: str
    safety_assessment: SafetyReport
    provider_used: str = "smart_ai"

# ----------------- 4. Style Tuner & Natural Rewriter -----------------
class RewriteRequest(BaseModel):
    message: str = Field(..., description="Draft message to adjust")
    target_tone: str = Field(..., description="chill, funny, confident, thoughtful, playful, concise")
    slang_level: Optional[str] = Field(default="universal", description="universal, gen_z, minimal")

class RewriteResponse(BaseModel):
    original: str
    rewritten: str
    explanation: str
    safety_assessment: SafetyReport
    provider_used: str = "smart_ai"

# ----------------- 5. Dating Profile Bio Maker -----------------
class BioRequest(BaseModel):
    platform: str = Field(default="hinge", description="hinge, tinder, bumble, instagram")
    archetype: str = Field(default="witty_storyteller", description="witty_storyteller, mysterious_adventurer, lowkey_relatable, ambitious_creative")
    interests: str = Field(..., description="Hobbies, passions, favorite spots")
    hot_take: Optional[str] = Field(None, description="A funny or quirky controversial opinion")
    vibe: Optional[str] = "playful"

class BioOption(BaseModel):
    id: str
    archetype: str
    headline_or_prompt: str
    content: str
    hook_strategy: str

class BioResponse(BaseModel):
    platform: str
    options: List[BioOption]
    profile_tips: List[str]
    safety_assessment: SafetyReport
    provider_used: str = "smart_ai"

# ----------------- 6. Screenshot / Vision Analysis -----------------
class ScreenshotAnalysisRequest(BaseModel):
    image_data: Optional[str] = Field(None, description="Base64 encoded image or simulated upload identifier")
    screenshot_type: str = Field(default="instagram_story", description="instagram_story, dating_profile, chat_thread")
    user_note: Optional[str] = Field(None, description="Optional note from user about what they see")

class ScreenshotAnalysisResponse(BaseModel):
    detected_elements: List[str]
    detected_vibe: str
    suggested_openers: List[IcebreakerOption]
    delivery_tip: str
    safety_assessment: SafetyReport
    provider_used: str = "smart_ai"

# ----------------- 7. Delivery & Timing Coach -----------------
class DeliveryAdviceRequest(BaseModel):
    message: str
    relationship_stage: str = "just_matched" # just_matched, talking_few_days, planning_date
    time_received: Optional[str] = None

class DeliveryAdviceResponse(BaseModel):
    timing_recommendation: str
    delivery_score: int
    voice_note_suggestion: Optional[str]
    dos_and_donts: List[str]
    safety_assessment: SafetyReport

# ----------------- 8. Riddle 2: What Was Meant (The Gap Decoder) -----------------
class RealityInterpretation(BaseModel):
    label: str  # "The Overwhelmed Reality", "The Hesitant/Conflict-Avoidant Reality", "The Low-Energy Reality"
    likelihood: str
    explanation: str
    signs: List[str]

class GapBridgeOption(BaseModel):
    id: str
    style: str  # "Low-Pressure Clarifier", "Playful Disarm", "Graceful Space Giver"
    text: str
    why_it_bridges: str

class WhatWasMeantRequest(BaseModel):
    ambiguous_phrase: str = Field(..., description="E.g. 'Fine.', 'Maybe', 'I'll see', a slow reply, or a changed plan")
    context_signals: Optional[str] = Field(None, description="Behavioral clues: response delay, punctuation, cancelled plan")
    anxiety_guess: Optional[str] = Field(None, description="What the user fears it means: 'They are mad at me / losing interest'")

class WhatWasMeantResponse(BaseModel):
    ambiguous_phrase: str
    gap_risk_score: int  # 0 to 100 percentage of interpretation gap risk
    projection_diagnosis: str  # Explains why each guess feels like a fact
    possible_realities: List[RealityInterpretation]
    gap_bridges: List[GapBridgeOption]
    riddle_insight: str  # Psychological takeaway from the riddle
    safety_assessment: SafetyReport
    provider_used: str = "smart_ai"

# ----------------- Scenarios & Feedback -----------------
class Scenario(BaseModel):
    id: str
    title: str
    badge: str
    setting: str
    situation: str
    vibe: str
    target_details: Optional[str] = None
    received_message: Optional[str] = None
    stall_reason: Optional[str] = None
    recommended_tool: str  # "icebreaker", "reply_coach", "rescue", "rewrite", "bio_maker", "screenshot_scan", "what_was_meant"


class UserFeedbackRequest(BaseModel):
    tool_type: str
    prompt_context: Dict[str, Any]
    chosen_text: str
    rating: int  # 1 to 5
    notes: Optional[str] = None

class FavoriteItem(BaseModel):
    id: Optional[str] = None
    tool_type: str
    text_content: str
    tag: Optional[str] = "Saved"
    metadata: Optional[Dict[str, Any]] = None


