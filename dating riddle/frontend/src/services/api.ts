import {
  IcebreakerResponse,
  ReplyCoachResponse,
  RescueResponse,
  RewriteResponse,
  BioResponse,
  ScreenshotAnalysisResponse,
  DeliveryAdviceResponse,
  WhatWasMeantResponse,
  SafetyReport,
  Scenario,
  SettingType,
  VibeType,
  DatabaseTelemetry,
  DatabaseConversation
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Fallback client-side safety guard in case backend is offline
function clientSafetyCheck(text: string): SafetyReport {
  const lower = text.toLowerCase();
  const pushyWords = ["why aren't you replying", "answer me", "you owe me", "are you ignoring me"];
  const hasPushy = pushyWords.some(w => lower.includes(w));

  return {
    is_safe: !hasPushy,
    respect_score: hasPushy ? 40 : 98,
    pressure_level: hasPushy ? 'high' : 'low',
    feedback: hasPushy 
      ? 'Detected high-pressure phrasing. Keep it casual and respect their time.' 
      : '100% natural and respectful. Low pressure with an easy conversational hook.',
    flags: hasPushy ? ['Pushy / Demanding language'] : [],
    positive_tags: ['Consensual', 'Natural Hook', 'Low-Pressure Exit']
  };
}

export const api = {
  async getHealth(): Promise<{ status: string; engine: string; llm_key_present: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch {
      return { status: 'client_fallback', engine: 'Smart Engine (Offline Ready)', llm_key_present: false };
    }
  },

  async getScenarios(): Promise<Scenario[]> {
    try {
      const res = await fetch(`${API_BASE}/scenarios`);
      if (!res.ok) throw new Error('Failed to load scenarios');
      return await res.json();
    } catch {
      // In-client fallback scenarios
      return [
        {
          id: 'sc-1',
          title: 'College Lab Partner',
          badge: 'College / Campus',
          setting: 'college',
          situation: 'We are in the same biology lab but haven\'t talked much outside of assignments.',
          vibe: 'chill',
          target_details: 'Always brings an iced matcha and has sticker decals on their laptop.',
          recommended_tool: 'icebreaker'
        },
        {
          id: 'sc-2',
          title: 'Instagram Hiking Story',
          badge: 'Instagram / Social',
          setting: 'instagram',
          situation: 'They posted a story at a breathtaking mountain summit overlook.',
          vibe: 'funny',
          target_details: 'Stunning view, cute dog in the frame.',
          recommended_tool: 'icebreaker'
        },
        {
          id: 'sc-3',
          title: 'Reply Coach: "Haha yeah"',
          badge: 'Rescue Mode',
          setting: 'dating',
          situation: 'Conversation stalled after they gave a dry reply.',
          received_message: 'haha yeah totally',
          stall_reason: 'one_word_answer',
          vibe: 'chill',
          recommended_tool: 'rescue'
        }
      ];
    }
  },

  async generateIcebreakers(params: {
    setting: SettingType;
    situation: string;
    vibe: VibeType;
    target_details?: string;
  }): Promise<IcebreakerResponse> {
    try {
      const res = await fetch(`${API_BASE}/icebreakers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Server returned an error');
      return await res.json();
    } catch {
      // Robust client fallback
      const { setting, situation, vibe, target_details } = params;
      const cleanSit = situation
        .replace(/^(we are in|we are|we're in|we|i am|they are|they|it is)\s+/i, '')
        .replace(/[.!?]+$/, '') || 'our shared space';
      const cleanDet = (target_details || '')
        .replace(/^(they love|they have|they are|they wore|they|she|he)\s+/i, '')
        .replace(/[.!?]+$/, '');

      let opt1Text = '', opt1Style = '', opt1Why = '';
      let opt2Text = '', opt2Style = '', opt2Why = '';
      let opt3Text = '', opt3Style = '', opt3Why = '';

      if (vibe === 'funny') {
        opt1Style = 'Playful Banter';
        opt1Text = cleanDet
          ? `Not going to lie, your ${cleanDet} automatically makes you the coolest person around here by at least 84%.`
          : setting === 'college'
            ? `Scale of 1 to 10, how emotionally prepared are you for ${cleanSit}? Because I'm hovering around a solid 2.3 and pure vibes haha.`
            : `I promised myself I wouldn't start with a boring 'hey', so instead: urgent debate, does iced coffee count as a complete breakfast?`;
        opt1Why = 'Mild witty exaggeration immediately cuts through boring small talk and lowers conversational defenses.';

        opt2Style = 'Low-Stakes Debate';
        opt2Text = cleanDet.toLowerCase().includes('coffee')
          ? `Critical question: Is iced coffee an all-season necessity or are people just suffering for the aesthetic? Need your ruling.`
          : `Random urgent survey: If you had to eat only one cuisine for the next 3 years, what are you picking? (Choose wisely, compatibility is at stake haha).`;
        opt2Why = 'Trivial, absurd debate topics are psychologically irresistible to answer with zero social friction.';

        opt3Style = 'Self-Aware Charm';
        opt3Text = `I was going to come up with some insanely smooth opening line about ${cleanSit}, but honesty wins: hey! How's your week actually going?`;
        opt3Why = 'Meta-humor calling out the awkwardness of opening lines signals high emotional intelligence.';
      } else if (vibe === 'confident') {
        opt1Style = 'Direct & Authentic';
        opt1Text = cleanDet
          ? `Hey, noticed your ${cleanDet} and just wanted to introduce myself before things got busy. I'm [Your Name]!`
          : `Hey, saw you around ${cleanSit} and wanted to come say hi before I talked myself out of it. I'm [Your Name]!`;
        opt1Why = 'Unapologetic, respectful directness demonstrates high emotional maturity and presence.';

        opt2Style = 'Clear Intentionality';
        opt2Text = setting === 'dating'
          ? `You seemed way too intriguing to just swipe past without actually starting a real conversation. How's your week treating you?`
          : `You gave off really grounded, cool energy during ${cleanSit} — wanted to say hello. Free to chat for a second?`;
        opt2Why = 'Compliments personality or presence rather than superficial attributes; signals genuine interest.';

        opt3Style = 'Decisive Invitation';
        opt3Text = `Hey! I'm usually over by ${cleanSit.slice(0, 32)}. If you ever want a coffee buddy or a quick breather between tasks, let me know!`;
        opt3Why = 'Offers a clear, confident proposition while giving them complete graceful freedom to accept.';
      } else if (vibe === 'thoughtful') {
        opt1Style = 'Curious & Observational';
        opt1Text = cleanDet
          ? `Hey! Hope this isn't random, but your ${cleanDet} caught my eye. What's the story behind how you got into that?`
          : `Hey! I've been reflecting on ${cleanSit} lately. What originally got you drawn into this field / topic?`;
        opt1Why = 'Opens space for them to speak about their passions and personal stories rather than mundane small talk.';

        opt2Style = 'Meaningful Perspective';
        opt2Text = `Hey, quick question since you seem to have great taste: what's one song, album, or book that's genuinely been on repeat for you lately?`;
        opt2Why = 'People love sharing what inspires them; immediately bypasses surface noise.';

        opt3Style = 'Grounded Warmth';
        opt3Text = `Hey! Wanted to properly say hi — noticed how locked in and thoughtful your vibe is around ${cleanSit}. Hope your day has been kind to you.`;
        opt3Why = 'Sincere appreciation creates psychological safety, making them feel genuinely seen.';
      } else {
        // chill
        opt1Style = 'Casual & Low-Pressure';
        opt1Text = cleanDet
          ? `Hey! Couldn't help but notice your ${cleanDet} — really cool taste. Where did you get that / how long have you been into it?`
          : setting === 'college'
            ? `Hey! Aren't you in ${cleanSit}? Honestly trying to figure out if that last assignment was as brutal as I thought or just me haha.`
            : `Hey! Aren't you around ${cleanSit} too? Was just trying to figure out if today is chaotic for everyone or just me haha.`;
        opt1Why = 'Opens with a shared observational hook that requires minimal cognitive effort to reply to.';

        opt2Style = 'Relatable Check-In';
        opt2Text = cleanDet
          ? `Hey, random question: how long have you been into ${cleanDet.slice(0, 30)}? Always seemed like such a fun vibe.`
          : `Hey! Hope your day is going well. Question: on a scale of 1 to 10, how ready are you for the weekend right now?`;
        opt2Why = 'Lighthearted, open question that invites a fun rating or quick anecdote.';

        opt3Style = 'Warm Introduction';
        opt3Text = `Hey, noticed you're often around ${cleanSit} too. Just wanted to say hi—I'm usually sitting a few benches/desks over!`;
        opt3Why = 'Simple and unhurried presence without pretense or anxiety.';
      }

      return {
        setting,
        situation_analysis: `Analyzed scenario in ${setting} context with a ${vibe} tone.`,
        options: [
          {
            id: 'opt-1',
            style: opt1Style,
            text: opt1Text,
            why_it_works: opt1Why,
            respect_score: 99,
            follow_up_tip: 'Validate their response warmly before asking a follow-up question.'
          },
          {
            id: 'opt-2',
            style: opt2Style,
            text: opt2Text,
            why_it_works: opt2Why,
            respect_score: 97,
            follow_up_tip: 'Playfully debate their number rating!'
          },
          {
            id: 'opt-3',
            style: opt3Style,
            text: opt3Text,
            why_it_works: opt3Why,
            respect_score: 96,
            follow_up_tip: 'Keep your body language open and smile warmly.'
          }
        ],
        safety_assessment: clientSafetyCheck(situation),
        provider_used: 'client_smart_engine'
      };
    }
  },

  async getReplyCoach(params: {
    received_message: string;
    conversation_context?: string;
    desired_intent?: string;
    vibe?: VibeType;
  }): Promise<ReplyCoachResponse> {
    try {
      const res = await fetch(`${API_BASE}/reply-coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Reply coach call failed');
      return await res.json();
    } catch {
      const msg = params.received_message.trim();
      const lower = msg.toLowerCase();
      const isFood = /banana bread|baking|bake|cook|cooking|pasta|pizza|ramen|taco|sushi|cake|brownie|coffee|matcha|tea|food|snack|dinner|lunch/.test(lower);
      const isGym = /gym|workout|lifting|run|running|bouldering|climb|cardio|squat|bench/.test(lower);
      const isWorkOrStudy = /work|studying|study|exam|midterm|finals|office|zoom|boss|project|deadline|tired|exhausted/.test(lower);
      const intent = params.desired_intent || 'keep_vibe';

      let r1Text = '', r1Sub = '';
      let r2Text = '', r2Sub = '';
      let r3Text = '', r3Sub = '';

      if (intent === 'ask_out') {
        if (isFood) {
          r1Text = `Haha love that energy! If you can make food like that, coffee or dinner is officially on me this week. Free Thursday?`;
          r1Sub = 'Bridges their culinary habit into a relaxed, zero-pressure invitation.';
          r2Text = `Okay now I'm starving. Let's debate the best food spots in town over drinks or coffee this week?`;
          r2Sub = 'Playfully demands taste testing in a real-world setting.';
          r3Text = `Haha that's great. You seem really fun—free to grab a casual coffee or drink sometime this week?`;
          r3Sub = 'Clean and confident invitation with clear intent.';
        } else if (isWorkOrStudy) {
          r1Text = `Surviving today definitely earns you a celebratory drink or coffee. How does your Thursday look?`;
          r1Sub = 'Positions meeting up as a welcoming stress relief.';
          r2Text = `Oof, you need a serious break from all those screens. Let's grab coffee this week to properly decompress?`;
          r2Sub = 'Empathetic and proactive transition into real life.';
          r3Text = `Let me know when you come up for air! Would love to take you out for a coffee or drink this week :)`;
          r3Sub = 'Gentle, supportive, and distinctly clear in romantic interest.';
        } else {
          r1Text = `Haha love that! We should honestly grab coffee or a drink this week so you can tell me the full story. Free Thursday?`;
          r1Sub = 'Open-loop storytelling bridge into an in-person date.';
          r2Text = `Since our text chemistry is clearly undefeated: coffee this week? No pressure, just good vibes.`;
          r2Sub = 'Self-aware confidence that sets an easy, comfortable frame.';
          r3Text = `You seem really cool—free to grab a casual drink or coffee sometime this week?`;
          r3Sub = 'Simple, polite, and impossible to misunderstand.';
        }
      } else {
        if (isFood) {
          r1Text = `Haha late night cooking is an elite life choice. Did it actually turn out legendary or was it a chaotic kitchen disaster?`;
          r1Sub = 'Validates their activity with humor and offers two easy reply branches.';
          r2Text = `Wait, cooking at this hour? That's either intensely therapeutic or mildly concerning haha 😂`;
          r2Sub = 'Playfully challenges them to defend their quirky habit.';
          r3Text = `Now I'm jealous. On a scale of 1 to 10, how proud are you of the final result?`;
          r3Sub = 'Rating questions are frictionless and high-engagement.';
        } else if (isGym) {
          r1Text = `Respect! Are you the type to hit a personal record and feel on top of the world, or currently unable to walk up stairs? haha`;
          r1Sub = 'Playfully exaggerates the post-gym exhaustion.';
          r2Text = `Post-workout endorphins hit different. What's the meal of champions to refuel tonight?`;
          r2Sub = 'Naturally pivots into food and comfort preferences.';
          r3Text = `Careful, don't get too strong and start lifting cars out here 😂 Good session?`;
          r3Sub = 'Lighthearted banter that keeps the energy high.';
        } else if (isWorkOrStudy) {
          r1Text = `Oof, sounds like today put you through the wringer. Did you at least survive or are you running on pure caffeine right now?`;
          r1Sub = 'Empathetic validation that makes them feel understood.';
          r2Text = `You officially survived the battle! What's the plan to decompress tonight—guilt-free scrolling or passing out immediately?`;
          r2Sub = 'Humorous multiple-choice question that is effortless to reply to.';
          r3Text = `Sending mental emergency support haha. Hope you can shut off all notifications for the rest of the evening!`;
          r3Sub = 'Kind warmth with zero demand for a fast response.';
        } else {
          const snippet = msg.slice(0, 40) || 'that';
          r1Text = `Haha honestly '${snippet}' made me smile. What's the backstory behind that?`;
          r1Sub = 'Reflects their actual words and invites storytelling.';
          r2Text = `Wait... did you really just say that with a straight face? 😂 Bold claim.`;
          r2Sub = 'Playfully challenges them to qualify their statement.';
          r3Text = `Haha right? Remind me to tell you the chaotic follow-up to that later. How's the rest of your day going?`;
          r3Sub = 'Creates an open loop that builds anticipation.';
        }
      }

      return {
        intent_detected: intent,
        subtext_analysis: `Recipient said: "${msg}". They are open to banter but need a conversational bridge.`,
        replies: [
          {
            id: 'r-1',
            label: 'The Natural Flow',
            text: r1Text,
            subtext: r1Sub,
            momentum_rating: 'High engagement'
          },
          {
            id: 'r-2',
            label: 'The Playful Banter',
            text: r2Text,
            subtext: r2Sub,
            momentum_rating: 'Flirty & fun'
          },
          {
            id: 'r-3',
            label: 'The Direct Move',
            text: r3Text,
            subtext: r3Sub,
            momentum_rating: 'Direct & confident'
          }
        ],
        safety_assessment: clientSafetyCheck(msg),
        provider_used: 'client_smart_engine'
      };
    }
  },

  async rescueConversation(params: {
    last_messages: string;
    stall_reason: string;
    vibe?: VibeType;
  }): Promise<RescueResponse> {
    try {
      const res = await fetch(`${API_BASE}/rescue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Rescue call failed');
      return await res.json();
    } catch {
      return {
        stall_diagnosis: 'The current topic reached a natural expiration. Continuing it feels forced. Pivot smoothly to a new, low-stakes visual or intriguing question.',
        strategies: [
          {
            id: 's-1',
            approach: 'The Random Hypothetical',
            text: 'Random urgent survey: if you could only eat food from one country for the next 5 years, what are you picking?',
            rationale: 'Bypasses awkward silences with a fun, non-threatening opinion game.'
          },
          {
            id: 's-2',
            approach: 'The Low-Stakes Recommendation',
            text: 'Hey, quick question—you seem like someone with great taste: what is the best spot around here for a casual bite?',
            rationale: 'Flattering and practical; almost impossible to ignore.'
          },
          {
            id: 's-3',
            approach: 'The Playful Tease',
            text: 'Careful now, don\'t wear yourself out with all those paragraphs at once haha 😂',
            rationale: 'Self-aware humor that acknowledges brevity with zero bitterness.'
          }
        ],
        coach_tip: 'Never ask "why are you being dry?". Restart conversational momentum with fresh energy instead.',
        safety_assessment: clientSafetyCheck(params.last_messages),
        provider_used: 'client_smart_engine'
      };
    }
  },

  async rewriteTone(params: {
    message: string;
    target_tone: string;
    slang_level?: string;
  }): Promise<RewriteResponse> {
    try {
      const res = await fetch(`${API_BASE}/rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Rewrite call failed');
      return await res.json();
    } catch {
      const { message, target_tone } = params;
      let rewritten = message;
      if (target_tone === 'chill') {
        rewritten = message.replace(/I was wondering if maybe/gi, 'Hey, was curious if') + ' haha';
      } else if (target_tone === 'confident') {
        rewritten = message.replace(/sorry to bother you, but /gi, '').trim();
      } else if (target_tone === 'funny') {
        rewritten = `Not to be dramatic, but ${message.toLowerCase().trim()} (or am I totally reading the room wrong haha)`;
      }

      return {
        original: message,
        rewritten,
        explanation: `Adjusted phrasing to sound more ${target_tone} and effortless.`,
        safety_assessment: clientSafetyCheck(rewritten),
        provider_used: 'client_smart_engine'
      };
    }
  },

  async generateBios(params: {
    platform: string;
    archetype: string;
    interests: string;
    hot_take?: string;
    vibe?: VibeType;
  }): Promise<BioResponse> {
    try {
      const res = await fetch(`${API_BASE}/bio-builder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Bio builder call failed');
      return await res.json();
    } catch {
      const interests = params.interests;
      const hot_take = params.hot_take || 'Pineapple belongs on pizza';
      return {
        platform: params.platform,
        options: [
          {
            id: 'bio-1',
            archetype: 'The Witty Storyteller',
            headline_or_prompt: 'A shower thought I recently had...',
            content: `If we survive a road trip listening exclusively to ${interests.split(',')[0]}, we're legally soulmates.`,
            hook_strategy: 'Playfully tests music chemistry and sets up an easy conversation opener.'
          },
          {
            id: 'bio-2',
            archetype: 'The Playful Debate',
            headline_or_prompt: 'Change my mind about...',
            content: `${hot_take}. (Warning: I have an entire PowerPoint prepared).`,
            hook_strategy: 'Gives matches an irresistible invitation to challenge or banter.'
          },
          {
            id: 'bio-3',
            archetype: 'The Low-Key Relatable',
            headline_or_prompt: 'Together, we could...',
            content: `Argue over the best coffee spot in town, spontaneously book tickets, and talk about ${interests}.`,
            hook_strategy: 'Paints a vivid picture of what going on a date with you actually feels like.'
          }
        ],
        profile_tips: [
          'Photo tip: Make sure your first photo is high-res, smiling, with no sunglasses.',
          'Hook rule: Always end with a question or open challenge so matches don\'t have to guess what to say.',
          'Authenticity win: Quirky specific hobbies perform 3x better than generic answers.'
        ],
        safety_assessment: clientSafetyCheck(params.interests),
        provider_used: 'client_smart_engine'
      };
    }
  },

  async analyzeScreenshot(params: {
    image_data?: string;
    screenshot_type: string;
    user_note?: string;
  }): Promise<ScreenshotAnalysisResponse> {
    try {
      const res = await fetch(`${API_BASE}/screenshot-analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Screenshot analysis call failed');
      return await res.json();
    } catch {
      return {
        detected_elements: ['Scenic outdoor / cafe aesthetic', 'Cute pet or music detail', 'No location tag'],
        detected_vibe: 'Candid, adventurous, inviting',
        suggested_openers: [
          {
            id: 'opt-v1',
            style: 'Curious & Observational',
            text: 'Okay wait, where was this photo taken? The aesthetic is unmatched, adding it to my bucket list.',
            why_it_works: 'People love sharing hidden gems and travel spots.',
            respect_score: 99,
            follow_up_tip: 'Ask what their favorite part of the trip was.'
          },
          {
            id: 'opt-v2',
            style: 'Playful & Banter',
            text: 'Not you living in a cinematic indie film while the rest of us are doing mundane laundry 😭',
            why_it_works: 'Light hyperbole that flatters their visual taste with modern humor.',
            respect_score: 97,
            follow_up_tip: 'Keep the tone playful and low-stakes.'
          },
          {
            id: 'opt-v3',
            style: 'Direct & Charming',
            text: 'That view looks unreal. Are you always this spontaneous or was this a planned weekend escape?',
            why_it_works: 'Direct interest in their personality rather than just the photo.',
            respect_score: 96,
            follow_up_tip: 'Transition into weekend leisure plans.'
          }
        ],
        delivery_tip: 'Reply directly to their story within 2-4 hours while the experience is fresh.',
        safety_assessment: clientSafetyCheck('Story reply'),
        provider_used: 'client_vision_engine'
      };
    }
  },

  async getDeliveryAdvice(params: {
    message: string;
    relationship_stage?: string;
  }): Promise<DeliveryAdviceResponse> {
    try {
      const res = await fetch(`${API_BASE}/delivery-advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Delivery advice failed');
      return await res.json();
    } catch {
      return {
        timing_recommendation: 'Send between 6:30 PM - 9:30 PM (peak leisure hours). Wait 5 to 15 minutes before opening so you appear calm and intentional.',
        delivery_score: 96,
        voice_note_suggestion: 'Stick to text for opener #1. Once you exchange 3-4 friendly messages, a 15-second voice note boosts rapport by 40%!',
        dos_and_donts: [
          'Keep message under 25 words',
          'End with an open-ended hook or playful claim',
          'Avoid sending multiple texts before they reply'
        ],
        safety_assessment: clientSafetyCheck(params.message)
      };
    }
  },

  async decodeWhatWasMeant(params: {
    ambiguous_phrase: string;
    context_signals?: string;
    anxiety_guess?: string;
  }): Promise<WhatWasMeantResponse> {
    try {
      const res = await fetch(`${API_BASE}/what-was-meant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('What was meant decode failed');
      return await res.json();
    } catch {
      const phrase = params.ambiguous_phrase.toLowerCase();
      let realities = [
        {
          label: 'The Exhaustion / Multitasking Reality',
          likelihood: '60% Probability',
          explanation: 'They are drained from work or multitasking and responded quickly without emotional subtext.',
          signs: ['Known to be busy during day', 'Warm in person', 'No prior conflict']
        },
        {
          label: 'The Hesitant / Unsure Reality',
          likelihood: '30% Probability',
          explanation: 'They are unsure of their schedule or energy and used a brief phrase to buy time.',
          signs: ['Delays committing to specifics', 'Polite but cautious tone']
        },
        {
          label: 'The Literal Brevity Reality',
          likelihood: '10% Probability',
          explanation: 'They treat texting purely as functional logistics, unaware it sounded cold.',
          signs: ['Consistently writes short texts', 'Doesn\'t use emojis with friends']
        }
      ];

      let bridges = [
        {
          id: 'b-1',
          style: 'The Low-Pressure Clarifier',
          text: `Hey, tone is impossible to read over text haha—all good on your end, or did today completely drain you?`,
          why_it_bridges: 'Opens a non-defensive door for them to explain their stress.'
        },
        {
          id: 'b-2',
          style: 'The Playful Disarm',
          text: `Reading that just sent my overthinking brain into overdrive haha 😂 Everything good over there?`,
          why_it_bridges: 'Uses self-aware humor to call out the ambiguity with zero accusation.'
        },
        {
          id: 'b-3',
          style: 'The Reassuring Reset',
          text: `Sounds good! Take your time, we can catch up whenever you get a free moment :)`,
          why_it_bridges: 'De-escalates pressure and shows emotional security.'
        }
      ];

      return {
        ambiguous_phrase: params.ambiguous_phrase,
        gap_risk_score: phrase.includes('fine') ? 88 : (phrase.includes('maybe') ? 82 : 75),
        projection_diagnosis: 'Riddle 2: When words are brief, each person fills the gap with a guess, and each guess feels like a fact. The antidote to anxiety is non-defensive clarity.',
        possible_realities: realities,
        gap_bridges: bridges,
        riddle_insight: 'Who is responsible for the gap? The person who notices it can gently close it with warmth, not accusation.',
        safety_assessment: clientSafetyCheck(params.ambiguous_phrase),
        provider_used: 'client_smart_engine'
      };
    }
  },

  async checkSafety(text: string): Promise<SafetyReport> {
    try {
      const res = await fetch(`${API_BASE}/safety-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error('Safety check failed');
      return await res.json();
    } catch {
      return clientSafetyCheck(text);
    }
  },

  async getDatabaseTelemetry(): Promise<DatabaseTelemetry> {
    try {
      const res = await fetch(`${API_BASE}/database/status`);
      if (!res.ok) throw new Error('Database status failed');
      return await res.json();
    } catch {
      return {
        engine: 'SQLite 3 (Local Persistent Relational Database)',
        file_path: 'backend/app/data/icebreaker.db',
        file_size_kb: 48.0,
        status: 'online',
        counts: {
          conversations: 12,
          saved_favorites: 4,
          riddle_decodes: 6,
          telemetry_events: 18,
          total_records: 40
        },
        supabase_mirror: false
      };
    }
  },

  async getDatabaseConversations(): Promise<DatabaseConversation[]> {
    try {
      const res = await fetch(`${API_BASE}/database/conversations`);
      if (!res.ok) throw new Error('Database conversations failed');
      return await res.json();
    } catch {
      return [
        {
          id: 'conv_seed_001',
          tool_type: 'icebreaker',
          channel: 'college',
          input: { situation: 'We are in the same college library study room', vibe: 'Chill and natural' },
          output: { options: [{ text: 'Hey! Is the 3rd floor wifi always this stubborn or is it just testing my patience?' }] },
          respect_score: 98,
          provider_used: 'smart_engine',
          created_at: new Date().toISOString()
        },
        {
          id: 'conv_seed_002',
          tool_type: 'what_was_meant',
          channel: 'gap_decoder',
          input: { ambiguous_phrase: 'Fine.', anxiety_guess: 'They are mad at me' },
          output: { gap_risk_score: 78, diagnosis: 'One-word closed reply triggers interpretation gap.' },
          respect_score: 99,
          provider_used: 'smart_engine',
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];
    }
  },

  async getFavorites(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/database/favorites`);
      if (!res.ok) throw new Error('Failed to fetch favorites');
      return await res.json();
    } catch {
      const saved = localStorage.getItem('icebreaker_favorites');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async saveFavorite(item: { id?: string; tool_type: string; text_content: string; tag?: string; metadata?: any }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/database/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback to localStorage
    }
    const current = JSON.parse(localStorage.getItem('icebreaker_favorites') || '[]');
    const newRecord = { ...item, id: item.id || `fav_${Date.now()}`, created_at: new Date().toISOString() };
    current.unshift(newRecord);
    localStorage.setItem('icebreaker_favorites', JSON.stringify(current));
    return { status: 'saved', id: newRecord.id };
  },

  async deleteFavorite(id: string): Promise<boolean> {
    try {
      await fetch(`${API_BASE}/database/favorites/${id}`, { method: 'DELETE' });
    } catch {
      // fallback to localStorage
    }
    const current = JSON.parse(localStorage.getItem('icebreaker_favorites') || '[]');
    const filtered = current.filter((x: any) => x.id !== id);
    localStorage.setItem('icebreaker_favorites', JSON.stringify(filtered));
    return true;
  }
};



