from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_auth_db
from config import CORS_ORIGINS

from routers import (
    auth,
    historical,
    eda,
    timeseries,
    predict,
    logistic,
    synthetic,
    scenario,
    reports
)

app = FastAPI(
    title="Synthetic Bank Quantitative Analytics API",
    description="Backend Quantitative Terminal API for MSc Data Science Project",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if "*" not in CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_auth_db()

@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy",
        "service": "synthetic-bank-backend",
        "version": "1.0.0"
    }

app.include_router(auth.router)
app.include_router(historical.router)
app.include_router(eda.router)
app.include_router(timeseries.router)
app.include_router(predict.router)
app.include_router(logistic.router)
app.include_router(synthetic.router)
app.include_router(scenario.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "SYNTHETIC BANK — Quantitative Banking Simulation & Analytics",
        "version": "1.0.0",
        "endpoints": [
            "/health",
            "/api/auth",
            "/api/historical",
            "/api/eda",
            "/api/timeseries",
            "/api/predict",
            "/api/logistic",
            "/api/synthetic",
            "/api/scenario",
            "/api/reports"
        ]
    }
