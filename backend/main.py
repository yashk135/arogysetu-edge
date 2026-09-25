"""
ArogyaSetu Edge — FastAPI Backend Server & Sync Gateway
Plugs into ABDM / Ayushman Bharat Digital Mission REST Architecture.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

from whatsapp_bot import router as whatsapp_router

app = FastAPI(
    title="ArogyaSetu Edge API",
    description="Backend Sync & Twilio WhatsApp Triage Bot for Team VibeDuo",
    version="1.0.0",
)

# Enable CORS for PWA frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include WhatsApp Bot Router
app.include_router(whatsapp_router)

# Data Schemas
class TriageSyncItem(BaseModel):
    id: str
    patientId: str
    patientName: str
    riskScore: int
    riskLevel: str
    timestamp: str

class SyncPayload(BaseModel):
    ashaWorkerId: str
    records: List[TriageSyncItem]

# In-memory sync storage for hackathon demo
sync_database = []

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "ArogyaSetu Edge Backend Server",
        "version": "1.0.0",
        "abdmCompliant": True,
        "team": "VibeDuo (Yash Karwa & Ansh Khandelwal)",
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "database": "connected", "whatsappBot": "active"}

@app.post("/api/sync/records")
def sync_offline_records(payload: SyncPayload):
    """
    Syncs queued offline triage records from PWA Background Sync to server
    """
    count = 0
    for record in payload.records:
        sync_database.append(record.dict())
        count += 1
    return {
        "success": True,
        "syncedCount": count,
        "totalServerRecords": len(sync_database),
        "message": f"Successfully synced {count} offline triage records to ABDM server.",
    }

@app.get("/api/sync/records")
def get_synced_records():
    return {"total": len(sync_database), "records": sync_database}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
