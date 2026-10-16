import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Icebreaker AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # LLM Settings
    OPENAI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    LLM_PROVIDER: str = "auto"  # 'openai', 'groq', 'gemini', or 'auto' (falls back to smart heuristic)
    OPENAI_MODEL: str = "gpt-4o-mini"
    GROQ_MODEL: str = "llama-3.1-70b-versatile"
    
    # Persistence (Optional Supabase)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*",
    ]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"

settings = Settings()
