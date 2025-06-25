from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models for Real Estate Platform
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password: str
    name: str
    role: str  # 'admin' or 'user'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    role: str = 'user'

class UserLogin(BaseModel):
    email: str
    password: str

class Video(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    thumbnail: str
    duration: str
    youtubeId: str
    match: str
    difficulty: str
    rating: float
    views: int
    releaseDate: str
    categoryId: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class VideoCreate(BaseModel):
    title: str
    description: str
    thumbnail: str
    duration: str
    youtubeId: str
    match: str
    difficulty: str
    rating: float
    views: int
    releaseDate: str
    categoryId: str

class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    icon: str
    videos: List[Video] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CategoryCreate(BaseModel):
    name: str
    icon: str

class Settings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    logoUrl: str = ""
    companyName: str = "Realty ONE Group Mexico"
    loginBackgroundUrl: str = ""
    bannerUrl: str = ""
    loginTitle: str = "Iniciar Sesión"
    loginSubtitle: str = "Accede a tu plataforma de capacitación inmobiliaria"
    theme: str = "dark"
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SettingsUpdate(BaseModel):
    logoUrl: Optional[str] = None
    companyName: Optional[str] = None
    loginBackgroundUrl: Optional[str] = None
    bannerUrl: Optional[str] = None
    loginTitle: Optional[str] = None
    loginSubtitle: Optional[str] = None
    theme: Optional[str] = None

class BannerVideo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    thumbnail: str
    youtubeId: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BannerVideoCreate(BaseModel):
    title: str
    description: str
    thumbnail: str
    youtubeId: str

# Legacy models for compatibility
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
