import uuid
from typing import List, Dict, Any, Optional
from app.schemas import (
    IcebreakerRequest, IcebreakerResponse, IcebreakerOption,
    ReplyCoachRequest, ReplyCoachResponse, ReplyCoachOption,
    RescueRequest, RescueResponse, RescueStrategy,
    RewriteRequest, RewriteResponse,
    BioRequest, BioResponse, BioOption,
    ScreenshotAnalysisRequest, ScreenshotAnalysisResponse,
    DeliveryAdviceRequest, DeliveryAdviceResponse,
    WhatWasMeantRequest, WhatWasMeantResponse, RealityInterpretation, GapBridgeOption,
    SafetyReport
)
from app.services.safety_service import analyze_respect_and_safety

class SmartHeuristicEngine:
    """
    Intelligent contextual generator powered by conversational psychology frameworks.
    Acts as an instant, zero-latency generator and fallback when external LLM APIs are unavailable.
    """

    @classmethod
    def generate_icebreakers(cls, req: IcebreakerRequest) -> IcebreakerResponse:
        setting = req.setting.lower()
        situation = req.situation
        vibe = req.vibe.lower()
        details = req.target_details or ""

        # Context-specific templates and observational hooks
        if "college" in setting or "campus" in setting or "class" in setting:
            casual = f"Hey! Aren't you in that same lecture? Honestly trying to figure out if that last assignment was as brutal as I thought or if it was just me haha."
            funny = f"Scale of 1 to 10, how emotionally prepared are you for the midterm coming up? Because I'm currently hovering around a solid 2.3."
            confident = f"Hey, noticed you're always super locked in during class. Wanted to come say hi—I'm usually sitting a couple rows behind you."
            why_casual = "Uses a shared academic struggle as an instant bonding hook without feeling intrusive."
            why_funny = "Humor through mild self-deprecation lowers defenses and invites a playful, relatable reply."
            why_confident = "Direct and genuine compliment that signals confidence while respecting personal boundaries."

        elif "insta" in setting or "story" in setting or "social" in setting:
            casual = f"Okay wait, where was that photo taken? The aesthetic is so good, adding it to my bucket list immediately."
            funny = f"Not you living in a cinematic movie trailer while the rest of us are just running mundane errands 😭"
            confident = f"That story was way too cool not to drop a quick comment. Are you always this adventurous or is this special occasion content?"
            why_casual = "Story replies about places or food have an 80%+ response rate because people love sharing recommendations."
            why_funny = "Playfully elevates their content with a modern banter style that stands out from boring fire emojis."
            why_confident = "Engages directly with their personality rather than superficial appearances."

        elif "dating" in setting or "interest" in setting or "tinder" in setting or "hinge" in setting:
            if details:
                casual = f"Okay, your mention of {details.lower()} immediately caught my eye. What's the hot take I need to know about that?"
                funny = f"I feel like our entire compatibility hinges on whether you think pineapple belongs on pizza or if you take {details.lower()} way too seriously haha."
                confident = f"You seemed way too interesting to just swipe past without actually saying hi. How's your week treating you?"
            else:
                casual = f"Hey! Your profile gave off great energy. If you had to pick one favorite weekend activity to never give up, what's making the cut?"
                funny = f"I promised myself I wouldn't start with a generic 'hey', so instead: what's the weirdest hyperfixation you currently have?"
                confident = f"Honestly, your vibe is magnetic. Figured I'd take a chance and start a real conversation—how's your day going?"
            why_casual = "Prompts for a fun preference instead of an interview question."
            why_funny = "Banter-first approach immediately breaks out of standard dating app script fatigue."
            why_confident = "Unapologetic interest that demonstrates high conversational intent without being pushy."

        elif "team" in setting or "work" in setting or "coworker" in setting or "slack" in setting:
            casual = f"Hey! Just wanted to introduce myself since we're working together now. Hope onboarding isn't bombarding you with 400 open tabs!"
            funny = f"Welcome aboard! Rule #1: Nobody actually knows how half the internal tools work, so feel free to ask me anything anytime haha."
            confident = f"Hey, really excited to collaborate with you on this project. Let me know if you ever want to grab a quick coffee or sync up!"
            why_casual = "Low-friction peer welcome that breaks remote or corporate ice."
            why_funny = "Relatable workplace vulnerability that builds immediate psychological safety."
            why_confident = "Proactive and welcoming professional warmth."

        else:
            # Custom / General
            casual = f"Hey! Couldn't help but notice {details if details else 'the vibe here'}. Mind if I ask you a quick question about it?"
            funny = f"I was told starting a conversation with 'So... weather, huh?' is socially illegal, so I'm improvising: how's your day actually going?"
            confident = f"Hey! I saw you and just wanted to introduce myself before I talked myself out of it. I'm [Your Name]."
            why_casual = "Observational question that requires minimal cognitive effort to reply to."
            why_funny = "Self-aware meta-humor about the awkwardness of small talk."
            why_confident = "Raw authenticity that shows boldness while remaining polite."

        # Adapt based on selected vibe focus
        if vibe == "thoughtful":
            options = [
                IcebreakerOption(
                    id=str(uuid.uuid4())[:8],
                    style="Curious & Thoughtful",
                    text=f"Hey! I was thinking about what you mentioned regarding {situation[:40]}. What made you get into that initially?",
                    why_it_works="Opens space for them to speak about their passions rather than small talk.",
                    respect_score=99,
                    follow_up_tip="Listen actively to their story and validate their answer before sharing yours."
                ),
                IcebreakerOption(
                    id=str(uuid.uuid4())[:8],
                    style="Warm Observational",
                    text=casual,
                    why_it_works=why_casual,
                    respect_score=98,
                    follow_up_tip="Keep your reaction validating and supportive."
                ),
                IcebreakerOption(
                    id=str(uuid.uuid4())[:8],
                    style="Meaningful Perspective",
                    text=f"Hey, hope this isn't random, but you always have such great taste. What's something you've been reading or listening to on repeat lately?",
                    why_it_works="People love sharing what inspires them; it bypasses surface level noise.",
                    respect_score=97,
                    follow_up_tip="Pick one song or book they name and ask what they like most about it."
                )
            ]
        elif vibe == "funny":
            options = [
                IcebreakerOption(
                    id=str(uuid.uuid4())[:8],
                    style="Playful Banter",
                    text=funny,
                    why_it_works=why_funny,
                    respect_score=96,
                    follow_up_tip="Keep the banter going with light teasing, never make fun of anything personal."
                ),
                IcebreakerOption(
                    id=str(uuid.uuid4())[:8],
                    style="Low-Stakes Debate",
                    text=f"Quick urgent survey: Is iced coffee acceptable in freezing weather, or are people just suffering for the vibe? Need your ruling.",
                    why_it_works="Absurd, low-stakes debate topics ignite instant engagement with zero friction.",
                    respect_score=98,
                    follow_up_tip="Take the opposite side playfully regardless of what they answer!"
                ),
                IcebreakerOption(
                    id=str(uuid.uuid4())[:8],
                    style="Casual & Relatable",
                    text=casual,
                    why_it_works=why_casual,
                    respect_score=98,
                    follow_up_tip="Match their reply length and energy level."
                )
            ]
        else: # chill, confident or default
            options = [
                IcebreakerOption(
                    id=str(uuid.uuid4())[:8],
                    style="Casual & Low-Pressure",
                    text=casual,
                    why_it_works=why_casual,
                    respect_score=99,
                    follow_up_tip="If they give an open answer, follow up with an open-ended 'how come?'"
                ),
                IcebreakerOption(
                    id=str(uuid.uuid4())[:8],
                    style="Funny & Witty",
                    text=funny,
                    why_it_works=why_funny,
                    respect_score=97,
                    follow_up_tip="Use their response as a springboard into a shared story."
                ),
                IcebreakerOption(
                    id=str(uuid.uuid4())[:8],
                    style="Confident & Direct",
                    text=confident,
                    why_it_works=why_confident,
                    respect_score=96,
                    follow_up_tip="Maintain relaxed body language or warm emoji spacing."
                )
            ]

        safety = analyze_respect_and_safety(" ".join([opt.text for opt in options]))
        analysis = f"Context detected: {setting.title()}. Selected vibe '{vibe}'. Suggestions prioritize conversational momentum, zero-pressure hooks, and natural emotional resonance."

        return IcebreakerResponse(
            setting=setting,
            situation_analysis=analysis,
            options=options,
            safety_assessment=safety,
            provider_used="smart_heuristic_engine"
        )

    @classmethod
    def generate_reply_coach(cls, req: ReplyCoachRequest) -> ReplyCoachResponse:
        received = req.received_message.strip()
        intent = req.desired_intent or "keep_vibe"
        
        # Analyze received message brevity and tone
        is_short = len(received.split()) <= 4
        contains_haha = "haha" in received.lower() or "lol" in received.lower()

        if intent == "ask_out" or intent == "schedule_meetup":
            r1 = f"Haha love that. We should actually grab coffee or a drink this week so you can tell me the full story in person. How's your Thursday look?"
            r2 = f"Okay, you've convinced me. Are you free to grab food sometime soon? I know a great spot."
            r3 = f"Since we clearly have top-tier banter: let's grab boba/coffee sometime this week. No pressure, just good vibes."
            sub1 = "Clear romantic or friendly intent with a concrete day suggested."
            sub2 = "Enthusiastic and direct invitation."
            sub3 = "Playful and explicitly low-pressure."
        elif intent == "playful_banter":
            r1 = f"Wait... did you really just say that with a straight face? 😂 Bold claim."
            r2 = f"I'm giving that reply a solid 6/10. Points for speed, points deducted for mystery haha."
            r3 = f"Don't worry, your secret is safe with me. (Unless someone offers me high quality matcha)."
            sub1 = "Playful challenge that invites them to qualify themselves."
            sub2 = "Teasing rating system that turns texting into a game."
            sub3 = "Inside joke framing."
        elif intent == "deepen_convo":
            r1 = f"That makes total sense honestly. What got you into that in the first place?"
            r2 = f"I've always wondered about that. What's been your favorite memory with it so far?"
            r3 = f"Oh really? That's actually super rare to hear. Did someone inspire you or did you just stumble into it?"
            sub1 = "Validates their statement and asks about origin story."
            sub2 = "Evokes emotional, positive reminiscence."
            sub3 = "Expresses genuine curiosity with high conversational value."
        else: # keep_vibe
            if contains_haha or is_short:
                r1 = f"Haha right? Remind me to tell you the chaotic follow-up to that later. Did your day calm down at all?"
                r2 = f"Glad we agree on that at least haha. What else is on your radar this weekend?"
                r3 = f"Exactly! Speaking of which, have you checked out that new spot downtown yet?"
            else:
                r1 = f"Honestly 100% agreed with that. Especially the part about that being unexpected. How long has that been going on?"
                r2 = f"Haha that's actually hilarious. You definitely have good taste. Did that surprise you?"
                r3 = f"Love that perspective honestly. Makes me want to hear what you think about this: what would you have done instead?"
            sub1 = "Provides an open loop (tease of a story) plus an easy question."
            sub2 = "Validates their vibe and transitions into leisure topics."
            sub3 = "Active listening hook with smooth topic shift."

        options = [
            ReplyCoachOption(
                id=str(uuid.uuid4())[:8],
                label="The Natural Flow",
                text=r1,
                subtext=sub1,
                momentum_rating="High - Easy for them to reply"
            ),
            ReplyCoachOption(
                id=str(uuid.uuid4())[:8],
                label="The Playful Pivot",
                text=r2,
                subtext=sub2,
                momentum_rating="Flirty & engaging"
            ),
            ReplyCoachOption(
                id=str(uuid.uuid4())[:8],
                label="The Open-Ended Explorer",
                text=r3,
                subtext=sub3,
                momentum_rating="Deepens rapport smoothly"
            )
        ]

        safety = analyze_respect_and_safety(" ".join([opt.text for opt in options]))
        return ReplyCoachResponse(
            intent_detected=intent,
            subtext_analysis=f"Received: '{received}'. Detected tone: {'casual banter' if contains_haha else 'brief/reserved'}. Generated 3 balanced conversational routes.",
            replies=options,
            safety_assessment=safety,
            provider_used="smart_heuristic_engine"
        )

    @classmethod
    def generate_rescue(cls, req: RescueRequest) -> RescueResponse:
        stall = req.stall_reason.lower()
        last = req.last_messages

        if "one_word" in stall:
            diagnosis = "The other person gave a low-investment reply ('lol', 'yeah', 'nice'). Continuing the dead topic will feel like an interrogation. A graceful topic pivot is needed."
            s1 = RescueStrategy(
                id="res-1",
                approach="The Visual / Meme Hook",
                text="Saw this today and immediately thought of that thing you said earlier haha [send relatable photo/meme]",
                rationale="Changes the sensory medium from plain text to visual; zero cognitive pressure to reply."
            )
            s2 = RescueStrategy(
                id="res-2",
                approach="The Random Hypothetical",
                text="Random question of the day: if you had to move to another country tomorrow for 6 months, where are you boarding the flight to?",
                rationale="Bypasses boring small talk completely and injects fresh conversational dopamine."
            )
            s3 = RescueStrategy(
                id="res-3",
                approach="The Playful Callout",
                text="Careful now, don't exhaust yourself with all these paragraphs at once haha 😂",
                rationale="Light tease that flags the brevity with high humor and zero bitterness."
            )
            tip = "Never send a double question like 'why only one word?'. Instead, restart momentum with a fresh, vivid hook."

        elif "ghost" in stall or "2_days" in stall:
            diagnosis = "A 2-day pause often means they got busy or the conversation ran out of natural steam. Do NOT ask 'where did you go?'. Revive with a high-value, no-stress ping."
            s1 = RescueStrategy(
                id="res-1",
                approach="The Organic Callback",
                text="Hey! Hope your week didn't completely bury you in chaos. Did you ever end up going to that thing you mentioned?",
                rationale="Demonstrates you remember what they cared about without demanding an explanation for the delay."
            )
            s2 = RescueStrategy(
                id="res-2",
                approach="The Low-Stakes Recommendation",
                text="Hey, quick question—you seem like someone with great food taste: what's the best takeout spot around here for a busy night?",
                rationale="Flattering, practical question that anyone can answer in 10 seconds."
            )
            s3 = RescueStrategy(
                id="res-3",
                approach="The Clean Reset",
                text="Hey stranger! Just popping in to say I hope you're having an awesome week :)",
                rationale="Simple, warm, non-transactional greeting."
            )
            tip = "Give them an easy out. Acknowledging that people get busy shows high emotional maturity."

        else: # dead end or awkward silence
            diagnosis = "The topic naturally reached its conclusion. Small talk flatlined. Time for a vibrant new conversational thread."
            s1 = RescueStrategy(
                id="res-1",
                approach="The Curious Shift",
                text="Pivot question: what is the most surprisingly good movie or show you've watched recently? I need recommendations.",
                rationale="Pop-culture topics have universal appeal and lead to natural debate."
            )
            s2 = RescueStrategy(
                id="res-2",
                approach="The Weekend Plot",
                text="Random question—what's the highlight of your week looking like? Work or actually fun plans?",
                rationale="Gives them permission to share excitement or complain pleasantly."
            )
            s3 = RescueStrategy(
                id="res-3",
                approach="The Relatable Daily Vibe",
                text="Tell me you're having a more productive day than me, because my caffeine-to-accomplishment ratio is currently tragic haha",
                rationale="Self-deprecating humor breaks conversational stiffness."
            )
            tip = "Conversations naturally have ebbs and flows. Don't force dead topics; jump smoothly to a fresh branch."

        safety = analyze_respect_and_safety(" ".join([s.text for s in [s1, s2, s3]]))
        return RescueResponse(
            stall_diagnosis=diagnosis,
            strategies=[s1, s2, s3],
            coach_tip=tip,
            safety_assessment=safety,
            provider_used="smart_heuristic_engine"
        )

    @classmethod
    def rewrite_message(cls, req: RewriteRequest) -> RewriteResponse:
        msg = req.message.strip()
        tone = req.target_tone.lower()
        slang = req.slang_level or "universal"

        if "chill" in tone or "natural" in tone:
            rewritten = msg.replace("I was wondering if maybe", "Hey, was curious if")
            rewritten = rewritten.replace("Would you be interested in", "Down to")
            rewritten = rewritten.replace("Please let me know", "Let me know!")
            if not rewritten.endswith("haha") and not rewritten.endswith("!"):
                rewritten += " haha"
            explanation = "Removed formal hesitation phrases to create a relaxed, low-stakes tone."

        elif "funny" in tone or "witty" in tone:
            rewritten = f"Not to be dramatic, but {msg.lower().rstrip('.')} (or am I totally reading the room wrong haha)"
            explanation = "Added playful hyperbole and self-awareness to make it witty and disarming."

        elif "confident" in tone:
            # Strip timid qualifiers
            rewritten = msg.replace("Sorry to bother you, but ", "")
            rewritten = rewritten.replace("I know you're busy, but ", "")
            rewritten = rewritten.replace("maybe we could possibly", "let's")
            rewritten = rewritten.replace("if you don't mind", "")
            rewritten = rewritten.strip()
            explanation = "Stripped apologetic disclaimers. Direct, respectful, and self-assured."

        elif "thoughtful" in tone:
            rewritten = f"I've been thinking about what you mentioned earlier—{msg.rstrip('.')}. Really appreciate your perspective on that."
            explanation = "Framed with appreciation and deliberate reflection."

        elif "concise" in tone:
            # Shorten drastically
            words = msg.split()
            if len(words) > 10:
                rewritten = " ".join(words[:8]) + "..."
            else:
                rewritten = msg
            rewritten = rewritten.replace("I just wanted to reach out to say that", "")
            explanation = "Cut filler words to create a punchy, easy-to-read mobile text."

        else:
            rewritten = f"Hey! {msg}"
            explanation = "Enhanced with natural conversational punctuation."

        safety = analyze_respect_and_safety(rewritten)
        return RewriteResponse(
            original=msg,
            rewritten=rewritten,
            explanation=explanation,
            safety_assessment=safety,
            provider_used="smart_heuristic_engine"
        )

    @classmethod
    def generate_bios(cls, req: BioRequest) -> BioResponse:
        interests = req.interests
        hot_take = req.hot_take or "Pineapple definitely belongs on pizza"
        platform = req.platform.lower()

        if platform == "hinge":
            b1 = BioOption(
                id="bio-1",
                archetype="The Witty Storyteller",
                headline_or_prompt="A shower thought I recently had...",
                content=f"If we survive a road trip listening exclusively to {interests.split(',')[0] if ',' in interests else interests}, we're legally soulmates.",
                hook_strategy="Playfully tests music chemistry and sets up an easy conversation opener."
            )
            b2 = BioOption(
                id="bio-2",
                archetype="The Playful Debate",
                headline_or_prompt="Change my mind about...",
                content=f"{hot_take}. (Warning: I have an entire PowerPoint prepared).",
                hook_strategy="Gives matches an irresistible invitation to challenge or banter."
            )
            b3 = BioOption(
                id="bio-3",
                archetype="The Low-Key Relatable",
                headline_or_prompt="Together, we could...",
                content=f"Argue over the best coffee spot in town, spontaneously book tickets, and talk about {interests}.",
                hook_strategy="Paints a vivid picture of what going on a date with you actually feels like."
            )
        elif platform == "tinder":
            b1 = BioOption(
                id="bio-1",
                archetype="Short & Punchy",
                headline_or_prompt="Bio",
                content=f"Professional {interests.split(',')[0].strip() if ',' in interests else interests} enthusiast. {hot_take}. Swipe right if you can handle high-tier banter.",
                hook_strategy="Fast mobile scan with high personality density."
            )
            b2 = BioOption(
                id="bio-2",
                archetype="Two Truths & A Lie",
                headline_or_prompt="Bio",
                content=f"1. Obsessed with {interests}\n2. {hot_take}\n3. I've never had a good iced coffee\n(Guess the lie and drinks are on me).",
                hook_strategy="Gamified opening move that practically forces matches to message first."
            )
            b3 = BioOption(
                id="bio-3",
                archetype="The Spontaneous Adventurer",
                headline_or_prompt="Bio",
                content=f"Looking for someone to explore new spots with and aggressively debate {hot_take}. Let's see if the vibe matches.",
                hook_strategy="Clear intent with a low-pressure social filter."
            )
        else: # bumble or general
            b1 = BioOption(
                id="bio-1",
                archetype="Bumble Opening Move Hook",
                headline_or_prompt="Opening Question",
                content=f"First round is on me if you can beat my playlist for {interests}. What's your go-to anthem?",
                hook_strategy="Makes it effortless for women on Bumble to send the first message without thinking."
            )
            b2 = BioOption(
                id="bio-2",
                archetype="The Relatable Vibe",
                headline_or_prompt="About Me",
                content=f"Into {interests}. Mildly obsessed with finding the city's hidden gems. Will probably ask your hot take on {hot_take}.",
                hook_strategy="Warm, approachable, and invites recommendations."
            )
            b3 = BioOption(
                id="bio-3",
                archetype="The Direct Creative",
                headline_or_prompt="I'm known for...",
                content=f"Giving great book/music recs, taking mediocre candid photos, and defending {hot_take}.",
                hook_strategy="Self-aware humor that makes you stand out from generic profiles."
            )

        safety = analyze_respect_and_safety(" ".join([b.content for b in [b1, b2, b3]]))
        return BioResponse(
            platform=platform,
            options=[b1, b2, b3],
            profile_tips=[
                "Photo tip: Make sure your first photo is high-res, smiling, with no sunglasses.",
                "Hook rule: Always end with a question or open challenge so matches don't have to guess what to say.",
                "Authenticity win: Quirky specific hobbies perform 3x better than generic 'I love traveling & food'."
            ],
            safety_assessment=safety,
            provider_used="smart_heuristic_engine"
        )

    @classmethod
    def analyze_screenshot(cls, req: ScreenshotAnalysisRequest) -> ScreenshotAnalysisResponse:
        stype = req.screenshot_type.lower()
        note = req.user_note or ""

        if "story" in stype:
            elements = ["Scenic outdoor / cafe backdrop", "No location tag visible", "Candid aesthetic lighting"]
            vibe = "Aesthetic, adventurous, relaxed"
            o1 = IcebreakerOption(
                id="vision-1",
                style="Curious & Observational",
                text="Okay wait, where was this taken? The aesthetic is unmatched, adding it to my bucket list.",
                why_it_works="People love sharing hidden gems and travel spots.",
                respect_score=99,
                follow_up_tip="Ask what their favorite part of the trip was."
            )
            o2 = IcebreakerOption(
                id="vision-2",
                style="Playful & Cinematic",
                text="Not you living in a cinematic indie film while the rest of us are doing mundane laundry 😭",
                why_it_works="Light hyperbole that flatters their visual taste with modern humor.",
                respect_score=97,
                follow_up_tip="Keep the tone playful and low-stakes."
            )
            o3 = IcebreakerOption(
                id="vision-3",
                style="Direct & Charming",
                text="That view looks unreal. Are you always this spontaneous or was this a planned weekend escape?",
                why_it_works="Direct interest in their personality rather than just the photo.",
                respect_score=96,
                follow_up_tip="Transition into weekend leisure plans."
            )
            tip = "Reply directly to the story within 2-4 hours while the experience is fresh in their mind."

        elif "dating" in stype:
            elements = ["Quirky bio prompt detected", "Active outdoor/hobby photo", "Expressive smile"]
            vibe = "Playful banter, energetic, passionate"
            o1 = IcebreakerOption(
                id="vision-1",
                style="Direct Hook",
                text="I feel like our entire compatibility depends on whether your bio hot take is 100% serious haha.",
                why_it_works="Hooks directly into their stated prompt without being generic.",
                respect_score=98,
                follow_up_tip="Playfully disagree or agree with a twist."
            )
            o2 = IcebreakerOption(
                id="vision-2",
                style="Playful Curiosity",
                text="Okay, your profile gave off immaculate weekend energy. What's the backstory behind that photo?",
                why_it_works="Invites storytelling rather than a one-word answer.",
                respect_score=97,
                follow_up_tip="Listen actively to their answer."
            )
            o3 = IcebreakerOption(
                id="vision-3",
                style="The Bold Move",
                text="You seemed way too cool to just leave as a mutual match without saying hi. How's your week going?",
                why_it_works="Confident and upfront, breaks through dating app fatigue.",
                respect_score=96,
                follow_up_tip="Suggest moving to coffee if the banter flows for 4-5 exchanges."
            )
            tip = "Reference a specific detail from their photos to prove you actually paid attention."

        else: # Chat thread
            elements = ["Brief response received", "Pacing slowed down", "Friendly tone preserved"]
            vibe = "Casual, slightly distracted"
            o1 = IcebreakerOption(
                id="vision-1",
                style="Low-Stakes Bridge",
                text="Remind me to tell you the chaotic story behind that later haha. Did your week settle down?",
                why_it_works="Creates curiosity without demanding an instant essay.",
                respect_score=99,
                follow_up_tip="Keep it short and light."
            )
            o2 = IcebreakerOption(
                id="vision-2",
                style="The Visual Pivot",
                text="Saw this earlier and immediately thought of what you said yesterday 😂",
                why_it_works="Transitions into a sensory visual format to restart momentum.",
                respect_score=98,
                follow_up_tip="Send a funny relatable meme or photo."
            )
            o3 = IcebreakerOption(
                id="vision-3",
                style="The Direct Invitation",
                text="We have top-tier banter on text, but let's grab coffee this Thursday. Free around 6?",
                why_it_works="Capitalizes on rapport to move offline.",
                respect_score=96,
                follow_up_tip="If they're busy Thursday, ask what day works better."
            )
            tip = "Match their message length. Do not send 3 paragraphs to a 4-word text."

        safety = analyze_respect_and_safety(" ".join([o.text for o in [o1, o2, o3]]))
        return ScreenshotAnalysisResponse(
            detected_elements=elements,
            detected_vibe=vibe,
            suggested_openers=[o1, o2, o3],
            delivery_tip=tip,
            safety_assessment=safety,
            provider_used="smart_vision_engine"
        )

    @classmethod
    def get_delivery_advice(cls, req: DeliveryAdviceRequest) -> DeliveryAdviceResponse:
        stage = req.relationship_stage.lower()
        msg_len = len(req.message.split())

        if "just_matched" in stage:
            timing = "Send between 6:30 PM - 9:30 PM (peak leisure hours). Avoid sending within 10 seconds of matching—wait 5 to 15 minutes so you appear calm and intentional."
            voice = "Stick to text for the first 2-3 messages. Voice notes are powerful once banter is established, but can feel too forward as opening line #1."
            dos = [
                "Keep message under 25 words",
                "End with an open-ended question or playful statement",
                "Wait at least 5 minutes before sending first opener"
            ]
        elif "few_days" in stage:
            timing = "Match their response pacing roughly (1.0x to 1.5x their time). If they reply in 30 minutes, reply in 20-40 minutes. Avoid erratic 8-hour delays followed by instant replies."
            voice = "Ideal time for a 15-second voice note! A casual voice note showing laugh or vocal warmth increases attraction by 40%."
            dos = [
                "Keep voice notes under 25 seconds",
                "Tease them about an inside joke from earlier",
                "Start proposing a concrete meetup day"
            ]
        else: # planning date
            timing = "Direct and timely. When scheduling logistics, fast replies (within 10-15 minutes) signal high reliability and emotional maturity."
            voice = "Send a quick voice note saying: 'Hey! Looking forward to tomorrow. See you at 7 at [Spot]!' Sets a relaxed, confident tone."
            dos = [
                "Name a specific day and neighborhood",
                "Give an easy out: 'No worries if Thursday is packed, let me know when works'",
                "Confirm 3 hours before meetup"
            ]

        score = 95 if msg_len < 30 else 82
        safety = analyze_respect_and_safety(req.message)

        return DeliveryAdviceResponse(
            timing_recommendation=timing,
            delivery_score=score,
            voice_note_suggestion=voice,
            dos_and_donts=dos,
            safety_assessment=safety
        )

    @classmethod
    def decode_what_was_meant(cls, req: WhatWasMeantRequest) -> WhatWasMeantResponse:
        """
        Riddle 2: What Was Meant
        Decodes the gap between what was said and what was heard,
        dismantles the overthinking loop, and generates non-defensive bridge responses.
        """
        phrase = req.ambiguous_phrase.strip()
        phrase_lower = phrase.lower()
        signals = req.context_signals or ""
        anxiety = req.anxiety_guess or ""

        # Specific Riddle 2 scenarios: "Fine.", "Maybe.", "I'll see.", slow reply, changed plan
        if "fine" in phrase_lower:
            gap_risk = 88
            diagnosis = "The word 'Fine.' is the ultimate conversational Rorschach test. Without tone or facial cues, human psychology defaults to assuming passive aggression or hidden anger, even when the sender literally meant 'That works for me'."
            r1 = RealityInterpretation(
                label="The Exhaustion Reality (Most Common)",
                likelihood="60% Probability",
                explanation="They are multitasking, mentally drained from their day, or in a meeting. 'Fine.' was shorthand for 'Sounds good, moving on'.",
                signs=["Usually texts warmly when relaxed", "Busy work or school schedule today", "No prior argument"]
            )
            r2 = RealityInterpretation(
                label="The Unspoken Friction Reality",
                likelihood="30% Probability",
                explanation="They felt slightly overlooked, rushed, or disconnected by something prior, but lack the energy to articulate it directly.",
                signs=["Used a period unexpectedly", "Sudden shift from playful emojis to single words"]
            )
            r3 = RealityInterpretation(
                label="The Neutral Literal Reality",
                likelihood="10% Probability",
                explanation="They belong to a communication style that treats texting purely as logistics rather than emotional validation.",
                signs=["Consistently writes concise texts", "Warm and engaged in person despite blunt texting"]
            )

            b1 = GapBridgeOption(
                id="bridge-1",
                style="The Low-Pressure Pulse Check",
                text="Hey, tone is impossible to read over text haha—all good on your end, or did today completely drain you?",
                why_it_bridges="Gives them an easy, non-defensive door to share stress without feeling interrogated."
            )
            b2 = GapBridgeOption(
                id="bridge-2",
                style="The Playful Disarm",
                text="Reading 'Fine.' with a period just sent my imagination into panic mode haha 😂 Everything okay over there?",
                why_it_bridges="Uses light, self-aware humor to call out the ambiguity without blaming them."
            )
            b3 = GapBridgeOption(
                id="bridge-3",
                style="The Relaxed Reassurance",
                text="Sounds good! Go conquer your day, we can catch up properly later tonight :)",
                why_it_bridges="Doesn't over-index on the brevity; projects steady emotional security."
            )
            riddle_insight = "Who is responsible for the gap? Neither person lied, but silence and single words invite projection. The person who notices the gap can close it with warmth, not defensiveness."

        elif "maybe" in phrase_lower or "see" in phrase_lower:
            gap_risk = 82
            diagnosis = "'Maybe' and 'I'll see' trigger immediate anxious attachment. The receiver hears 'I don't care enough to prioritize you', while the sender often meant 'I am genuinely overwhelmed and hate disappointing people with broken promises'."
            r1 = RealityInterpretation(
                label="The Overwhelmed Scheduler",
                likelihood="55% Probability",
                explanation="They genuinely want to see you, but their calendar or energy is uncertain. They fear committing and having to cancel later.",
                signs=["Has unpredictable work/family obligations", "Follows through when plans are low friction"]
            )
            r2 = RealityInterpretation(
                label="The Polite Hesitation",
                likelihood="35% Probability",
                explanation="They are hesitant about the specific activity, timing, or vibe, but fear conflict or awkwardness if they say a direct 'no'.",
                signs=["Has been slow to propose alternative dates", "Keeps conversation pleasant but vague"]
            )
            r3 = RealityInterpretation(
                label="The Spontaneous Pacer",
                likelihood="10% Probability",
                explanation="They simply prefer deciding on the day of rather than booking plans 4 days in advance.",
                signs=["Lives spontaneously", "Texts last minute with high excitement"]
            )

            b1 = GapBridgeOption(
                id="bridge-1",
                style="The Explicit Low-Pressure Out",
                text="Totally no worries! Let's pencil it in loosely. Just shoot me a text Thursday afternoon if your schedule clears up—if not, zero stress.",
                why_it_bridges="Removes all performance pressure. People commit when they feel freedom, not obligation."
            )
            b2 = GapBridgeOption(
                id="bridge-2",
                style="The Alternative Pivot",
                text="No pressure at all! If a full dinner is hectic this week, we could always do a 30-min quick coffee or boba instead?",
                why_it_bridges="Lowers the commitment threshold if time was the barrier."
            )
            b3 = GapBridgeOption(
                id="bridge-3",
                style="The High-Value Autonomous Move",
                text="Sounds like a plan! Let me know by tomorrow eve so I can lock in my weekend plans. Hope your week goes smooth!",
                why_it_bridges="Demonstrates self-respect and clear scheduling boundaries without resentment."
            )
            riddle_insight = "When 'Maybe' appears, pressing for a certainty creates resistance. Giving explicit permission to say no paradoxically makes them want to say yes."

        elif "slow" in phrase_lower or "hours" in phrase_lower or "reply" in phrase_lower or "silence" in phrase_lower:
            gap_risk = 78
            diagnosis = "The Silent Gap: A delay in texting feels like an intentional withdrawal of affection. In reality, text reply speed is often 95% about the sender's chaotic environment and 5% about you."
            r1 = RealityInterpretation(
                label="The Contextual Blackout",
                likelihood="65% Probability",
                explanation="Work deadlines, driving, family emergencies, or simply zero emotional battery left to craft a thoughtful text.",
                signs=["Works intense hours", "Sends long or meaningful replies once they actually sit down"]
            )
            r2 = RealityInterpretation(
                label="The Distracted Loop",
                likelihood="25% Probability",
                explanation="Read the notification while walking, mentally replied, and forgot to actually hit send.",
                signs=["Known for ADHD or chaotic organization", "Warm in person"]
            )
            r3 = RealityInterpretation(
                label="The Natural Ebb",
                likelihood="10% Probability",
                explanation="Texting frequency naturally slows as a conversation matures; not every hour requires rapid-fire ping-pong.",
                signs=["Conversation has lasted several weeks", "Steady connection despite spaced texts"]
            )

            b1 = GapBridgeOption(
                id="bridge-1",
                style="The High-Value Patience Move",
                text="[Do Not Double Text Yet] Give it 24 hours. A delayed reply answered with calm patience signals top 1% emotional maturity.",
                why_it_bridges="Protects you from creating phantom tension before knowing the facts."
            )
            b2 = GapBridgeOption(
                id="bridge-2",
                style="The Fresh Hook (After 24h)",
                text="Hey! Hope the week didn't completely bury you in meetings haha. Did you survive that presentation?",
                why_it_bridges="Restarts momentum with genuine curiosity rather than an accusatory 'Did you forget me?'."
            )
            b3 = GapBridgeOption(
                id="bridge-3",
                style="The Low-Stakes Ping",
                text="Saw this meme and immediately thought of our debate earlier 😂 [Send funny image]",
                why_it_bridges="Zero-pressure visual hook that dissolves any awkwardness."
            )
            riddle_insight = "A delay is not a rejection until proven otherwise. Filling silence with insecure assumptions is what causes the connection to break."

        elif "plan" in phrase_lower or "raincheck" in phrase_lower or "cancel" in phrase_lower:
            gap_risk = 85
            diagnosis = "The Changed Plan Gap: When someone cancels or pivots, the mind hears: 'I don't value you'. The riddle asks: 'Nobody has lied, and something is already breaking.' How you handle a raincheck defines the trajectory of the connection."
            r1 = RealityInterpretation(
                label="The Genuine Life Ambush",
                likelihood="60% Probability",
                explanation="Sick, exhausted, family issue, or unexpected work fire. They feel guilty about letting you down.",
                signs=["Offered an explanation or expressed regret", "Has been reliable in the past"]
            )
            r2 = RealityInterpretation(
                label="Social Anxiety / Low Battery",
                likelihood="25% Probability",
                explanation="They wanted to go when they agreed, but as the time approached, introverted panic or exhaustion overwhelmed them.",
                signs=["Tends toward introversion", "Prefers 1-on-1 casual settings"]
            )
            r3 = RealityInterpretation(
                label="The Polished Exit",
                likelihood="15% Probability",
                explanation="Cancelling without offering an alternative date or raincheck window.",
                signs=["No alternative day offered ('let's do next week sometime' vs 'how about Tuesday?')"]
            )

            b1 = GapBridgeOption(
                id="bridge-1",
                style="The High-Emotional-Intelligence Bridge",
                text="No worries at all, life happens! Hope everything is okay on your end. Let me know when things settle down and we'll reschedule :)",
                why_it_bridges="Gracious and secure. Leaves the ball in their court with zero bitterness."
            )
            b2 = GapBridgeOption(
                id="bridge-2",
                style="The Warm Reciprocal Check",
                text="Totally understand! Thanks for letting me know ahead of time. Rest up tonight, and ping me next week when you're free!",
                why_it_bridges="Validates their communication while preserving healthy self-respect."
            )
            b3 = GapBridgeOption(
                id="bridge-3",
                style="The Concrete Counter (If they offered raincheck)",
                text="All good! Let's aim for next Tuesday or Wednesday instead. Let me know which works better for you.",
                why_it_bridges="Quickly tests if the interest was real with a concrete alternative date."
            )
            riddle_insight = "When plans change without explanation, reacting with grace is the ultimate test of character. It either unlocks deeper trust or quietly clarifies their investment."

        else:
            # Custom ambiguous phrase
            gap_risk = 75
            diagnosis = f"Detected ambiguous statement '{phrase}'. Each person fills the lack of vocal tonality with their own insecurities. Your fear treats a guess as a fact."
            r1 = RealityInterpretation(
                label="The Benign Context",
                likelihood="50% Probability",
                explanation="They intended it casually and have no idea it came across as cold, distant, or confusing.",
                signs=["Texting on the go", "Short sentences"]
            )
            r2 = RealityInterpretation(
                label="The Mismatched Communication Style",
                likelihood="35% Probability",
                explanation="They communicate literally and practically, while you communicate with relational subtext and emotional nuance.",
                signs=["Different texting rhythm", "Generational or background differences"]
            )
            r3 = RealityInterpretation(
                label="The Guarded Stance",
                likelihood="15% Probability",
                explanation="They are protecting their own boundaries and keeping emotional distance until trust is proven.",
                signs=["Reservations about moving too fast"]
            )

            b1 = GapBridgeOption(
                id="bridge-1",
                style="The Clarifying Question",
                text=f"Hey! Just to make sure we're on the same page about {phrase}—what was your thought on how we should handle that?",
                why_it_bridges="Clears ambiguity with straightforward curiosity."
            )
            b2 = GapBridgeOption(
                id="bridge-2",
                style="The Playful Call-In",
                text="You're being mysterious today haha! What's the master plan behind that?",
                why_it_bridges="Lighthearted banter that breaks stiffness."
            )
            b3 = GapBridgeOption(
                id="bridge-3",
                style="The Space-Giving Reset",
                text="No rush at all. Take your time, we can chat whenever you're free!",
                why_it_bridges="Releases pressure and builds psychological safety."
            )
            riddle_insight = "When what is said and what is heard come apart, the person who asks with genuine curiosity rather than accusation bridges the gap every single time."

        safety = analyze_respect_and_safety(phrase + " " + anxiety)
        return WhatWasMeantResponse(
            ambiguous_phrase=phrase,
            gap_risk_score=gap_risk,
            projection_diagnosis=diagnosis,
            possible_realities=[r1, r2, r3],
            gap_bridges=[b1, b2, b3],
            riddle_insight=riddle_insight,
            safety_assessment=safety,
            provider_used="smart_heuristic_engine"
        )


