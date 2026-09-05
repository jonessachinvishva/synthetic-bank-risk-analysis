import sqlite3
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from pathlib import Path
from config import AUTH_DB_PATH, SYNTHETIC_DB_PATH

def init_auth_db():
    conn = sqlite3.connect(AUTH_DB_PATH)
    cur = conn.cursor()
    
    # Users table for terminal authentication
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        full_name TEXT,
        role TEXT DEFAULT 'Quant Analyst',
        created_at TEXT NOT NULL
    );
    """)
    
    # Scenario history table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS scenario_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        scenario_name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        inputs_json TEXT NOT NULL,
        predictions_json TEXT NOT NULL,
        changes_json TEXT NOT NULL,
        difficult_economy_prob REAL,
        economy_status INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    """)
    
    conn.commit()
    conn.close()

def get_auth_connection():
    conn = sqlite3.connect(AUTH_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_synthetic_db_connection():
    if not SYNTHETIC_DB_PATH.exists():
        raise FileNotFoundError(f"Synthetic database not found at {SYNTHETIC_DB_PATH}")
    conn = sqlite3.connect(SYNTHETIC_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn
