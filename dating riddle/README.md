# 🧊 Icebreaker AI — Turn Awkward Silences Into Natural Conversations

> **Build Night Pitch Edition** 🔥  
> *The AI conversational assistant that helps you start and sustain natural, personalized, low-pressure conversations instead of sending a boring "Hey, what's up?".*

---

## 🌟 The 4 Core AI Tools + Safety Guard

### 1. 🎯 Context-Aware Icebreakers
- **Select your channel:** College / Campus, Instagram Stories, Dating App Matches, or New Teammates.
- **Describe the context:** Enter observations, shared classes, or bio hooks.
- **Choose your vibe:** Chill & Natural, Funny & Witty, Confident & Direct, or Thoughtful.
- **Structured output:** Generates 3 distinct messages with conversational psychology breakdowns (*"Why it works"*), copy buttons, and phone previews.

### 2. 💬 Reply Coach
- **Paste received texts:** E.g., *"Honestly ended up baking banana bread at 2am and watching true crime docs haha"*.
- **Select your conversational intent:** Keep the vibe going, pivot to a real-life meetup, playful banter, or deepen rapport.
- **Subtext analysis:** Understand what their message signaled and pick the optimal reply route.

### 3. 🚨 Conversation Rescue
- **Revive stalled chats:** One-word replies (*"lol"*, *"nice"*, *"yeah"*), sudden 48-hour radio silence, or expired topics.
- **Zero-guilt resuscitation:** Avoids needy double-texts; deploys visual hooks, flattering recommendations, and playful hypotheticals.

### 4. 🪄 Tone Tuner & Style Rewriter
- **Personal style matching:** Transform stiff, overly formal, or hesitant drafts into relaxed, charming texts.
- **One-click adjustments:** Chill, Confident (strips apologies/timidity), Witty, or Ultra-Concise.

### 5. 🧩 Riddle 2 Flagship: "What Was Meant" (The Gap Decoder)
*Directly solving Build Night Riddle 2: "Two people can use the same words and mean different things. 'Fine.' 'Maybe.' 'I'll see.' A slow reply, a quiet moment, a plan that changes without explanation. Each person fills the gap with a guess, and each guess feels like a fact."*
- **The Gap Risk Gauge:** Measures the interpretation risk of brief, ambiguous texts (0–100%).
- **3 Plausible Realities:** Replaces anxious worst-case assumptions with realistic perspectives (The Exhaustion Reality, The Hesitant Reality, The Neutral Reality).
- **Bridge The Gap Responses:** Generates graceful, low-pressure responses that defuse unspoken tension without guilt or blame.

### 6. 🛡️ Respectful Conversation Guard (Judge Favorite)
- **Anti-Creep & Anti-Manipulation Filter:** Real-time scoring (0–100) assessing boundary respect and low-pressure phrasing.
- **Safety Flags:** Detects pushy, guilt-tripping (*"why aren't you replying?"*), or manipulative language and provides healthy alternatives.

### 7. 📱 Interactive Phone Chat Simulator
- Live iMessage & Instagram DM mockup frame to see exactly how any generated message looks as a sent chat bubble before hitting send!


---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Highlights |
|---|---|---|
| **Frontend** | React 18 + TypeScript + Vite | Tailwind CSS, Lucide Icons, Glassmorphism design |
| **Backend** | Python 3.11 + FastAPI + Pydantic v2 | Strict JSON validation, CORS middleware, RESTful endpoints |
| **AI Layer** | OpenAI / Groq / Anthropic + Heuristic Fallback | Zero-latency fallback engine ensures 100% demo uptime |
| **Persistence** | Supabase (Optional) / In-Memory Store | Event analytics, favorites persistence, session history |
| **Deployment** | Vercel (Frontend) + Render/Docker (Backend) | Dockerfile & `docker-compose.yml` included |

---

## 🚀 How to Run in 1 Click

### Option 1: Instant Zero-Install Preview (Double-Click!)
Want to see the full UI and demo it right this second without installing anything?
- Double-click `demo-preview/index.html` in Windows Explorer or open it in Google Chrome / Microsoft Edge.
- It includes all 4 tools, the Phone Simulator, Judge Demo Presets, and interactive generation!

### Option 2: 1-Click Windows Launcher (Full App)
Double-click `start_all.bat` in the project root:
```cmd
start_all.bat
```
This automatically boots:
- The FastAPI backend on `http://127.0.0.1:8000`
- The React + Vite frontend on `http://localhost:5173`
- Opens your default web browser automatically!

### Option 3: Manual Startup

**1. Backend:**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation (Swagger UI) is available at: `http://127.0.0.1:8000/docs`

**2. Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### Option 4: Docker Compose
```bash
docker-compose up --build
```

---

## 🏆 How to Pitch to Build Night Judges

When demonstrating this project to judges, follow this 2-minute live demo script:

1. **The Hook (15s):**  
   *"Every day, millions of people get stuck staring at a blank screen or sending 'Hey, what's up?' that gets ignored. Icebreaker AI turns real-life context into natural, low-pressure conversations."*

2. **Open the Judge Demos Drawer (30s):**  
   - Click **"Judge Demos"** in the top navigation.
   - Select **"College Lecture Crush"**.
   - Show how the backend analyzes the setting and outputs 3 psychologically grounded options (*Casual*, *Funny*, *Confident*).
   - Point to the **"Why it works"** note explaining the conversational psychology.

3. **Show the Phone Simulator (20s):**  
   - Tap the smartphone icon on an opener.
   - Switch between **iMessage** and **Instagram DM** views to show how authentic it looks.

4. **Show Conversation Rescue & Reply Coach (30s):**  
   - Switch to **Reply Coach** and test the banana bread text.
   - Switch to **Rescue** and show how it handles the dreaded *"haha yeah"*.

5. **Highlight the Respectful Conversation Guard (25s):**  
   - Emphasize that unlike reckless AI text generators or toxic pickup artist tools, Icebreaker AI features a built-in safety guard that enforces respectful, consensual, non-pushy communication.

---

## 🧪 Evaluation Benchmark

Inspect `eval/evaluation_benchmark.json` to view the evaluation test cases used to evaluate message brevity, pressure ratings, and safety guard interception.

---

## 🌐 Deployment Ready

- **Frontend Deployment (Vercel):**  
  Deploy the `frontend/` folder directly to Vercel with zero config (uses included `frontend/vercel.json`).
- **Backend Deployment (Render / Railway):**  
  Deploy the `backend/` folder using `render.yaml` or `backend/Dockerfile`.
- **Environment Configuration:**  
  Copy `backend/.env.example` to `backend/.env` and optionally set `OPENAI_API_KEY`, `GROQ_API_KEY`, or `SUPABASE_URL`. *(Note: The app runs seamlessly even without an external key thanks to its smart contextual heuristic engine!)*


PROMPTS RIDDLE 1:

Icebreaker AI — Turn awkward silences into natural conversations
The core idea: a user tells the AI a little about someone they want to talk to, and it helps them start a natural, personalized conversation rather than sending a boring “Hey, what's up?”
1. The features I'd build
1. Context-aware icebreakers
The user enters the situation, such as meeting someone at college, replying to an Instagram story, or talking to a new teammate.
The AI generates three opening messages: casual, funny, and confident.
2. Reply Coach
The user pastes a message they've received. AI suggests natural replies that keep the conversation going without sounding robotic.
3. Conversation Rescue
When a conversation goes dry, the AI suggests relevant follow-up questions, topic changes, or ways to continue naturally.
4. Personal style matching
Choose a style—funny, chill, thoughtful, or playful—and get messages that sound more like you.
5. Respectful Conversation Guard
Detect pushy, manipulative, or inappropriate suggestions and encourage respectful communication without pressuring the other person.
2. What the actual app could look like
Icebreaker AI
Your next conversation starts here.
Where are you talking?
At college / campus
Instagram / social media
Someone I'm interested in
New teammate / stranger
Describe the situationWe are in the same college but haven't talked much.
Choose your vibe
Chill and natural
Funny and witty
Confident
Thoughtful and meaningful
Generate icebreakersInteractive prototype: generates suggestions in the next chat response. A deployed version would connect to an AI API.
3. The tech stack I'd recommend
Since you're learning programming and want to compete seriously at Build Night, I'd use:
Part	Technology
Frontend	React + TypeScript
Styling	Tailwind CSS
Backend	Python + FastAPI
AI	LLM API for contextual message generation
Database	Supabase
Hosting	Vercel + a backend host
You don't need to master all these technologies before starting. Build one working feature first.
4. How to make it stand out to judges
Your event evaluates the actual AI implementation, backend/API design, security, usability, and public live hosting. So build this flow:
1. User enters a real conversation scenario.
2. Your backend sends structured context to the AI.
3. AI returns three distinct suggestions in a predictable format.
4. User chooses a suggestion and asks for a more natural rewrite.
5. The app remembers the chosen tone within that session.
Add a small evaluation set of example scenarios to demonstrate that the suggestions are relevant, varied, and respectful. Don't just show that an API returns text—show that your system improves the user's ability to start a conversation.Bro, let's build Icebreaker AI into a complete Build Night project, not just a basic demo. 🔥
I've handed the project off to ChatGPT Work, where the full multi-file app can be created and tested.
What we're building
1. Premium frontend
A polished, responsive interface with smooth interactions, conversation cards, tone selection, and copy buttons.
2. Four AI tools
Context-aware icebreakers, Reply Coach, Conversation Rescue, and personalized writing styles.
3. Real backend
Python FastAPI, an LLM API integration, and Supabase-ready configuration for optional persistence.
4. Build Night preparation
Setup instructions, environment templates, deployment guidance, safety checks, and sample AI evaluation scenarios.
What you need to know
- AI API key: You'll need your own key to enable real AI-generated responses.
- Hosting: We'll prepare the app for deployment; a public URL still requires completing the deployment.
- Judging: We'll prioritize a working core flow, a polished UI, meaningful AI integration, and a convincing demo.
Open your Icebreaker AI project in Work
The goal is to give you something you can actually demonstrate to judges and explain confidently—not merely a design that looks impressive. create everything