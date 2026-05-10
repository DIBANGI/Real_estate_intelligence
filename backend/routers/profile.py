from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models, database

router = APIRouter(prefix="/api/profile", tags=["Profile"])

class ProfileData(BaseModel):
    email: str
    name: str
    targetCity: str
    targetBhk: str
    maxBudget: str

@router.post("/")
def save_profile(data: ProfileData, db: Session = Depends(database.get_db)):
    # Check if user already has a profile
    profile = db.query(models.UserProfile).filter(models.UserProfile.email == data.email).first()
    
    if not profile:
        profile = models.UserProfile(email=data.email)
        db.add(profile)
    
    # Update the values
    profile.name = data.name
    profile.target_city = data.targetCity
    profile.target_bhk = data.targetBhk
    profile.max_budget = data.maxBudget
    
    db.commit()
    return {"message": "Profile saved to database successfully!"}

@router.get("/{email}")
def get_profile(email: str, db: Session = Depends(database.get_db)):
    profile = db.query(models.UserProfile).filter(models.UserProfile.email == email).first()
    if profile:
        return {
            "name": profile.name,
            "email": profile.email,
            "targetCity": profile.target_city,
            "targetBhk": profile.target_bhk,
            "maxBudget": profile.max_budget
        }
    return None