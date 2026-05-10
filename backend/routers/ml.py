from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import joblib
import json
import database
import models

router = APIRouter(prefix="/api/ml", tags=["Machine Learning"])

try:
    model = joblib.load('real_estate_model.joblib')
    scaler = joblib.load('scaler.joblib')
    with open('feature_columns.json', 'r') as f:
        feature_columns = json.load(f)
except Exception as e:
    print(f"⚠️ Warning: ML files not found. Error: {e}")
    model, scaler, feature_columns = None, None, None

# --- Updated Schema to include ALL features ---
class PredictionInput(BaseModel):
    askingPrice: Optional[int] = None 
    city: str
    location: str
    sqft: int
    bhk: int
    bathrooms: int
    balcony: int
    parking: bool
    furnishing: str
    age: int
    amenities: List[str] = []
    type: str = 'Apartment'  # <--- Default value
    status: str = 'For Sale'  # <--- Default value

class FeatureImportance(BaseModel):
    feature: str
    importance: float
    impact: str

class PredictionResult(BaseModel):
    predictedPrice: int
    confidenceScore: int
    priceRange: Dict[str, int]
    bestAlternatives: List[Any] = [] 
    dealReason: Optional[str] = None 
    featureImportance: List[FeatureImportance]
    explanation: str

@router.post("/predict", response_model=PredictionResult)
def predict_price(data: PredictionInput, db: Session = Depends(database.get_db)):
    if not model or not scaler or not feature_columns:
        raise HTTPException(status_code=500, detail="ML Model not initialized.")

    # 1. Prepare data mapping 1:1 with the new training script
    input_data = {
        'sqft': [data.sqft],
        'bhk': [data.bhk],
        'bathrooms': [data.bathrooms],
        'balcony': [data.balcony],
        'age': [data.age],
        'parking': [1 if data.parking else 0],
        'amenities_count': [len(data.amenities)] # Count the array
    }
    
    # Process One-Hot Encoded Categories
    for col in feature_columns:
        if col.startswith('city_'):
            input_data[col] = [1 if data.city == col.replace('city_', '') else 0]
        elif col.startswith('furnishing_'):
            input_data[col] = [1 if data.furnishing == col.replace('furnishing_', '') else 0]
        elif col.startswith('type_'):
            input_data[col] = [1 if data.type == col.replace('type_', '') else 0]
        elif col.startswith('status_'):
            input_data[col] = [1 if data.status == col.replace('status_', '') else 0]
            
    df_input = pd.DataFrame(input_data)
    for col in feature_columns:
        if col not in df_input.columns:
            df_input[col] = 0
    df_input = df_input[feature_columns]

    # 2. Predict
    X_scaled = scaler.transform(df_input)
    final_price = int(model.predict(X_scaled)[0])

    # 3. Extract 100% of Feature Importances
    importances = model.feature_importances_
    feature_impacts = []
    
    # Helper to calculate and append weights
    def append_weight(feat_name, display_name, is_positive):
        if feat_name in feature_columns:
            idx = feature_columns.index(feat_name)
            weight = round(float(importances[idx] * 100), 1)
            if weight > 0.0: # Keep ALL features that had any impact
                feature_impacts.append({
                    "feature": display_name, 
                    "importance": weight, 
                    "impact": "positive" if is_positive else "negative"
                })

    # Direct numerical features
    append_weight('sqft', 'Square Footage', True)
    append_weight('bhk', 'Number of Bedrooms', True)
    append_weight('bathrooms', 'Number of Bathrooms', True)
    append_weight('balcony', 'Balconies', True)
    append_weight('age', 'Property Age', False) # Age usually drops price
    append_weight('parking', 'Parking Availability', data.parking)
    append_weight('amenities_count', f'Amenities ({len(data.amenities)} total)', len(data.amenities) > 0)
    
    # Active categorical features
    append_weight(f'city_{data.city}', f'City ({data.city})', True)
    append_weight(f'type_{data.type}', f'Type ({data.type})', data.type in ['Villa', 'Penthouse'])
    append_weight(f'status_{data.status}', f'Market Status ({data.status})', data.status == 'For Sale')
    append_weight(f'furnishing_{data.furnishing}', f'Furnishing ({data.furnishing})', data.furnishing != 'Unfurnished')

    # Sort descending
    feature_impacts = sorted(feature_impacts, key=lambda x: x["importance"], reverse=True)

    # 4. Generate Explainability text & fetch Alternatives
    deal_reason = "Analysis complete."
    if data.askingPrice:
        diff = ((data.askingPrice - final_price) / final_price) * 100
        if diff > 5: deal_reason = f"Overpriced by {abs(int(diff))}%. AI valuation is lower."
        elif diff < -5: deal_reason = f"Great Deal! Underpriced by {abs(int(diff))}%. "
        else: deal_reason = "Fairly Priced according to AI."

    alts = db.query(models.Property).filter(models.Property.city == data.city, models.Property.bhk == data.bhk).limit(3).all()
    real_alts = [{"id": p.id, "title": p.title, "price": p.price, "location": p.location, "image": p.image, "bhk": p.bhk, "sqft": p.sqft} for p in alts]

    return {
        "predictedPrice": final_price,
        "confidenceScore": int(min(max(95 - (data.age * 0.2), 80), 98)), 
        "priceRange": {"min": int(final_price * 0.90), "max": int(final_price * 1.10)},
        "bestAlternatives": real_alts,
        "dealReason": deal_reason,
        "featureImportance": feature_impacts, # ALL features returned, no slicing
        "explanation": f"The Random Forest AI analyzed all {len(feature_impacts)} provided parameters."
    }