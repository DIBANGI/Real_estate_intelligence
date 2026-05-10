from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import auth, properties, ml, market, chat, profile

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Real Estate Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(properties.router)
app.include_router(ml.router)
app.include_router(market.router)
app.include_router(chat.router)
app.include_router(profile.router)

@app.get("/")
def root():
    return {"message": "AI Real Estate API is running"}