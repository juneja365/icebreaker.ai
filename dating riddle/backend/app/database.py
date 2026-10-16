import sqlite3
import json
import os
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime

# Persistent database storage path
DB_DIR = Path(__file__).parent / "data"
DB_PATH = DB_DIR / "icebreaker.db"

def get_db_connection() -> sqlite3.Connection:
    DB_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes tables on startup if they don't already exist."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Conversations table (all generated openers, replies, rescues)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        tool_type TEXT NOT NULL,
        channel TEXT,
        input_payload TEXT NOT NULL,
        output_payload TEXT NOT NULL,
        respect_score INTEGER DEFAULT 98,
        provider_used TEXT DEFAULT 'smart_engine',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 2. Saved favorites table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS saved_favorites (
        id TEXT PRIMARY KEY,
        tool_type TEXT NOT NULL,
        text_content TEXT NOT NULL,
        tag TEXT,
        metadata TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 3. Riddle 2 decodes table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS riddle_decodes (
        id TEXT PRIMARY KEY,
        ambiguous_phrase TEXT NOT NULL,
        gap_risk_score INTEGER NOT NULL,
        diagnosis TEXT NOT NULL,
        selected_bridge TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 4. Feedback & telemetry table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS telemetry_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        event_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Seed baseline demonstration records if table is brand new
    cursor.execute("SELECT COUNT(*) FROM conversations")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO conversations (id, tool_type, channel, input_payload, output_payload, respect_score, provider_used)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            "conv_seed_001",
            "icebreaker",
            "college",
            json.dumps({"situation": "We are in the same college library study room", "vibe": "Chill and natural"}),
            json.dumps({"options": [{"id": "opt-1", "category": "Casual & Natural", "text": "Hey! Random question: is the 3rd floor wifi always this stubborn or is it just testing my patience?", "reasoning": "Shared environment observation with zero pressure."}]}),
            98,
            "smart_engine"
        ))
        cursor.execute("""
        INSERT INTO saved_favorites (id, tool_type, text_content, tag, metadata)
        VALUES (?, ?, ?, ?, ?)
        """, (
            "fav_seed_001",
            "icebreaker",
            "Hey! Random question: is the 3rd floor wifi always this stubborn or is it just testing my patience?",
            "Campus Library",
            json.dumps({"vibe": "Chill and natural"})
        ))
        cursor.execute("""
        INSERT INTO riddle_decodes (id, ambiguous_phrase, gap_risk_score, diagnosis, selected_bridge)
        VALUES (?, ?, ?, ?, ?)
        """, (
            "riddle_seed_001",
            "Fine.",
            78,
            "One-word closed response creates high ambiguity gap; high likelihood of cognitive overload rather than conflict.",
            "No rush at all! Let me know whenever things quiet down on your end."
        ))
        cursor.execute("""
        INSERT INTO telemetry_events (event_type, event_data)
        VALUES (?, ?)
        """, (
            "system_boot",
            json.dumps({"status": "initialized", "storage_target": "icebreaker.db", "tables": 4})
        ))

    conn.commit()
    conn.close()

# ----------------- Database Operations -----------------

def log_conversation(tool_type: str, channel: str, input_data: Any, output_data: Any, respect_score: int = 98, provider: str = "smart_engine") -> str:
    import uuid
    record_id = f"conv_{uuid.uuid4().hex[:10]}"
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO conversations (id, tool_type, channel, input_payload, output_payload, respect_score, provider_used)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            record_id,
            tool_type,
            channel,
            json.dumps(input_data if isinstance(input_data, dict) else str(input_data)),
            json.dumps(output_data if isinstance(output_data, dict) else str(output_data)),
            respect_score,
            provider
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[DB Error] log_conversation: {e}")
    return record_id

def log_riddle_decode(phrase: str, gap_score: int, diagnosis: str, selected_bridge: Optional[str] = None) -> str:
    import uuid
    record_id = f"riddle_{uuid.uuid4().hex[:10]}"
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO riddle_decodes (id, ambiguous_phrase, gap_risk_score, diagnosis, selected_bridge)
        VALUES (?, ?, ?, ?, ?)
        """, (record_id, phrase, gap_score, diagnosis, selected_bridge or ""))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[DB Error] log_riddle_decode: {e}")
    return record_id

def save_favorite_record(record_id: str, tool_type: str, text: str, tag: str, metadata: Optional[Dict[str, Any]] = None) -> bool:
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT OR REPLACE INTO saved_favorites (id, tool_type, text_content, tag, metadata)
        VALUES (?, ?, ?, ?, ?)
        """, (record_id, tool_type, text, tag, json.dumps(metadata or {})))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"[DB Error] save_favorite: {e}")
        return False

def get_recent_conversations(limit: int = 25) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, tool_type, channel, input_payload, output_payload, respect_score, provider_used, created_at 
    FROM conversations 
    ORDER BY created_at DESC 
    LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "tool_type": r["tool_type"],
            "channel": r["channel"],
            "input": json.loads(r["input_payload"]) if r["input_payload"].startswith("{") or r["input_payload"].startswith("[") else r["input_payload"],
            "output": json.loads(r["output_payload"]) if r["output_payload"].startswith("{") or r["output_payload"].startswith("[") else r["output_payload"],
            "respect_score": r["respect_score"],
            "provider_used": r["provider_used"],
            "created_at": r["created_at"]
        })
    return result

def get_all_favorites() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, tool_type, text_content, tag, metadata, created_at FROM saved_favorites ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [{
        "id": r["id"],
        "tool": r["tool_type"],
        "text": r["text_content"],
        "tag": r["tag"],
        "created_at": r["created_at"]
    } for r in rows]

def delete_favorite_record(favorite_id: str) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM saved_favorites WHERE id = ?", (favorite_id,))
    conn.commit()
    conn.close()
    return True

def get_database_telemetry() -> Dict[str, Any]:
    """Returns database size, file location, table counts and health status."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM conversations")
    conv_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM saved_favorites")
    fav_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM riddle_decodes")
    riddle_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM telemetry_events")
    telem_count = cursor.fetchone()[0]
    conn.close()

    db_size_bytes = DB_PATH.stat().st_size if DB_PATH.exists() else 0

    return {
        "engine": "SQLite 3 (Local Persistent Relational Database)",
        "file_path": str(DB_PATH.resolve()),
        "file_size_kb": round(db_size_bytes / 1024, 2),
        "status": "online",
        "counts": {
            "conversations": conv_count,
            "saved_favorites": fav_count,
            "riddle_decodes": riddle_count,
            "telemetry_events": telem_count,
            "total_records": conv_count + fav_count + riddle_count + telem_count
        },
        "supabase_mirror": bool(os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_KEY"))
    }
