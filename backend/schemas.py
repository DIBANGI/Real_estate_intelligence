from pydantic import BaseModel
from typing import List, Optional

class SendOTPRequest(BaseModel):
    email: str # Changed

class VerifyOTPRequest(BaseModel):
    email: str # Changed
    otp_code: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: str # Changed
    name: Optional[str] = None

    class Config:
        from_attributes = True

class PropertyBase(BaseModel):
    id: str
    title: str
    location: str
    city: str
    price: int
    sqft: int
    bhk: int
    bathrooms: int
    balcony: int
    parking: bool
    furnishing: str
    age: int
    amenities: List[str]
    image: str
    lat: float
    lng: float
    type: str # Map frontend 'type' to backend 'property_type'
    status: str
    rating: float

class PropertyResponse(PropertyBase):
    class Config:
        from_attributes = True
        populate_by_name = True

class MetadataResponse(BaseModel):
    cities: List[str]
    locations: dict
    amenities: List[str]