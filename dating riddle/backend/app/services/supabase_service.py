import logging
from typing import Dict, Any, List, Optional
from app.config import settings

logger = logging.getLogger(__name__)

class SupabaseService:
    _client = None
    _memory_store: List[Dict[str, Any]] = []

    @classmethod
    def get_client(cls):
        if cls._client is None and settings.SUPABASE_URL and settings.SUPABASE_KEY:
            try:
                from supabase import create_client
                cls._client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                logger.info("Supabase client initialized successfully.")
            except Exception as e:
                logger.warning(f"Could not initialize Supabase: {e}. Using in-memory store.")
        return cls._client

    @classmethod
    async def save_session_event(cls, event_type: str, payload: Dict[str, Any]) -> bool:
        """
        Saves a generated message or interaction to Supabase table 'icebreaker_events'
        or in-memory cache if Supabase is unconfigured.
        """
        client = cls.get_client()
        record = {
            "event_type": event_type,
            "payload": payload,
        }
        if client:
            try:
                client.table("icebreaker_events").insert(record).execute()
                return True
            except Exception as e:
                logger.error(f"Failed to insert into Supabase: {e}")
        
        # In-memory fallback
        cls._memory_store.append(record)
        if len(cls._memory_store) > 100:
            cls._memory_store.pop(0)
        return True

    @classmethod
    def get_recent_events(cls, limit: int = 20) -> List[Dict[str, Any]]:
        client = cls.get_client()
        if client:
            try:
                res = client.table("icebreaker_events").select("*").order("created_at", desc=True).limit(limit).execute()
                return res.data
            except Exception as e:
                logger.warning(f"Supabase read error: {e}")
        return cls._memory_store[-limit:]
