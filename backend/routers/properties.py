from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas, database

router = APIRouter(prefix="/api/properties", tags=["Properties"])

@router.get("/metadata", response_model=schemas.MetadataResponse)
def get_metadata():
    # This provides the dynamic dropdown data for your frontend filters
    return {
        "cities": ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'],
        "locations": {
            "Mumbai": ['Bandra', 'Andheri', 'Juhu', 'Worli', 'Powai', 'Malad', 'Borivali', 'Thane'],
            "Bangalore": ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Jayanagar', 'BTM Layout', 'Marathahalli'],
            # Add others as needed
        },
        "amenities": ['Swimming Pool', 'Gym', 'Clubhouse', 'Security', 'Power Backup', 'Lift', 'Garden', 'Playground', 'Visitor Parking', 'CCTV', 'Jogging Track', 'Indoor Games']
    }

@router.get("/", response_model=List[schemas.PropertyResponse])
def get_properties(
    db: Session = Depends(database.get_db),
    city: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    bhk: Optional[int] = None,
    # Map Bounding Box Coordinates (Top-Right and Bottom-Left corners)
    ne_lat: Optional[float] = None,
    ne_lng: Optional[float] = None,
    sw_lat: Optional[float] = None,
    sw_lng: Optional[float] = None,
    limit: int = 200 # <--- ADDED LIMIT HERE (Defaults to 200 to match the map)
):
    query = db.query(models.Property)

    # Standard Filters
    if city:
        query = query.filter(models.Property.city == city)
    if min_price:
        query = query.filter(models.Property.price >= min_price)
    if max_price:
        query = query.filter(models.Property.price <= max_price)
    if bhk:
        query = query.filter(models.Property.bhk == bhk)

    # Google Maps Viewport Filter: Only return properties visible on the user's screen
    if ne_lat and sw_lat and ne_lng and sw_lng:
        query = query.filter(
            models.Property.lat <= ne_lat,
            models.Property.lat >= sw_lat,
            models.Property.lng <= ne_lng,
            models.Property.lng >= sw_lng
        )

    # Apply the limit before calling .all()
    properties = query.limit(limit).all()
    
    # Map 'property_type' back to 'type' for the frontend
    for p in properties:
        p.type = p.property_type 

    return properties

@router.get("/{property_id}", response_model=schemas.PropertyResponse)
def get_property(property_id: str, db: Session = Depends(database.get_db)):
    prop = db.query(models.Property).filter(models.Property.id == property_id).first()
    if prop:
        prop.type = prop.property_type
    return prop