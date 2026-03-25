"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routes import auth, upload, dashboard, decision, simulation, email_gen, reports

app = FastAPI(
    title="Fintech Decision Engine",
    description="AI-powered cash flow & financial decision system",
    version="1.0.0",
)

# Allow Next.js frontend on port 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(dashboard.router)
app.include_router(decision.router)
app.include_router(simulation.router)
app.include_router(email_gen.router)
app.include_router(reports.router)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/")
def root():
    return {"message": "Fintech Decision Engine API is running 🚀", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
