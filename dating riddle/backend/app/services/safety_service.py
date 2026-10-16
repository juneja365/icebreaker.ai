import re
from typing import Tuple, List
from app.schemas import SafetyReport

# High-risk patterns: manipulative, pushy, guilt-tripping, or boundary-violating phrasing
PUSHY_PATTERNS = [
    (r"\bwhy (didn\'t|didnt|aren\'t|arent|havent|haven\'t) you (reply|text|answer)\b", "Guilt-tripping about response time"),
    (r"\bare you ignoring me\b", "Accusatory / high-pressure escalation"),
    (r"\byou owe me\b", "False entitlement or obligation"),
    (r"\banswer me\b", "Demanding / pushy command"),
    (r"\bif you liked me you would\b", "Emotional manipulation / guilt"),
    (r"\bwhy do girls always\b|\bwhy do guys always\b", "Generalizing frustration / resentful framing"),
    (r"\byou\'re not like other (girls|guys)\b", "Backhanded compliment / negging trope"),
    (r"\bsend (nudes|pic)\b|\bshow me your\b", "Unsolicited sexual pressure"),
    (r"\bi saw where you live\b|\bfollowed you to\b", "Creepy / stalker-like boundary violation"),
    (r"\bi guess i\'m not good enough\b", "Passive-aggressive guilt trip"),
    (r"\bplaying hard to get\b", "Ignoring boundary / non-consensual assumption"),
]

POSITIVE_PATTERNS = [
    (r"\bno pressure\b|\bno worries if\b", "Explicit Low-Pressure"),
    (r"\bwhenever you get a chance\b", "Respects Time"),
    (r"\bcurious what you think\b|\bwhat was your take\b", "Genuine Curiosity"),
    (r"\bhope you have a great\b", "Polite & Casual"),
    (r"\bhaha\b|\blol\b", "Lighthearted Vibe"),
]

def analyze_respect_and_safety(text: str, context: str = "") -> SafetyReport:
    """
    Evaluates text for pushiness, manipulation, and tone etiquette.
    Returns a structured SafetyReport with score, pressure level, and positive badges.
    """
    cleaned = text.lower().strip()
    flags: List[str] = []
    positive_tags: List[str] = []
    deductions = 0

    # Check pushy / manipulative patterns
    for pattern, reason in PUSHY_PATTERNS:
        if re.search(pattern, cleaned, re.IGNORECASE):
            flags.append(reason)
            deductions += 35

    # Check positive / respectful communication patterns
    for pattern, tag in POSITIVE_PATTERNS:
        if re.search(pattern, cleaned, re.IGNORECASE):
            if tag not in positive_tags:
                positive_tags.append(tag)

    if not positive_tags:
        positive_tags = ["Low-Pressure", "Conversational", "Respectful Tone"]

    score = max(10, 100 - deductions)
    is_safe = score >= 60

    if score >= 90:
        pressure_level = "low"
        feedback = "100% natural and respectful. Gives the other person an easy, low-pressure out while inviting genuine conversation."
    elif score >= 65:
        pressure_level = "moderate"
        feedback = "Generally acceptable, but make sure not to assume entitlement to a fast reply."
    else:
        pressure_level = "high"
        feedback = f"⚠️ Warning: We detected high-pressure or guilt-inducing phrasing: {', '.join(flags)}. Try keeping the tone casual and giving them space."

    return SafetyReport(
        is_safe=is_safe,
        respect_score=score,
        pressure_level=pressure_level,
        feedback=feedback,
        flags=flags,
        positive_tags=positive_tags,
    )
