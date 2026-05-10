from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
import models, database
import re

router = APIRouter(prefix="/api/chat", tags=["AI Chatbot"])

class ChatRequest(BaseModel):
    message: str
    context: Dict = {} # NEW: The bot will receive its previous memory

class ChatResponse(BaseModel):
    reply: str
    properties: List[Any] = []
    new_context: Dict = {} # NEW: The bot will send back its updated memory

def extract_intent(text: str, current_context: dict):
    text = text.lower()
    
    # Start with the previous memory, or default to empty
    intent = current_context.copy() if current_context else {"city": None, "bhk": None, "max_price": None, "status": "For Sale", "limit": 3}
    intent["limit"] = 3 # Reset limit to 3 for each new query unless specified otherwise

    # 1. HANDLE NEGATION FIRST (e.g., "not in mumbai")
    negated_cities = re.findall(r'(?:not in|outside|no|except)\s+([a-z]+)', text)
    for nc in negated_cities:
        if intent.get("city") and intent["city"].lower() == nc:
            intent["city"] = None # Erase it from memory
        text = text.replace(nc, "") # Remove the negated word from text so it doesn't get picked up below
    
    # 2. Extract City
    cities = ['mumbai', 'bangalore', 'delhi', 'hyderabad', 'pune', 'chennai', 'kolkata', 'ahmedabad']
    for city in cities:
        if city in text:
            intent["city"] = city.capitalize()
            break
            
    # 3. Extract BHK
    bhk_match = re.search(r'(\d+)\s*(?:bhk|bed|bedroom)', text)
    if bhk_match:
        intent["bhk"] = int(bhk_match.group(1))
        
    # 4. Extract Budget
    budget_match = re.search(r'(?:under|below|budget|max).+?(\d+(?:\.\d+)?)\s*(cr|crore|lakh|l)', text)
    if not budget_match:
        budget_match = re.search(r'(\d+(?:\.\d+)?)\s*(cr|crore|lakh|l)', text)
        
    if budget_match:
        value = float(budget_match.group(1))
        unit = budget_match.group(2)
        if unit in ['cr', 'crore']:
            intent["max_price"] = int(value * 10000000)
        elif unit in ['lakh', 'l']:
            intent["max_price"] = int(value * 100000)

    # 5. Extract Status
    if 'rent' in text or 'lease' in text:
        intent["status"] = "For Rent"
    elif 'sale' in text or 'buy' in text:
        intent["status"] = "For Sale"
        
    # 6. Extract Limit
    limit_match = re.search(r'\b(\d+)\s+(?:options|properties|results|matches|houses|apartments|villas|choices)\b', text)
    if limit_match:
        intent["limit"] = min(int(limit_match.group(1)), 20)
    else:
        top_match = re.search(r'\btop\s+(\d+)\b', text)
        if top_match:
            intent["limit"] = min(int(top_match.group(1)), 20)
            
    return intent

@router.post("/", response_model=ChatResponse)
def chat_with_ai(request: ChatRequest, db: Session = Depends(database.get_db)):
    intent = extract_intent(request.message, request.context)
    query = db.query(models.Property)
    
    filters_applied = []
    if intent["city"]:
        query = query.filter(models.Property.city == intent["city"])
        filters_applied.append(f"in {intent['city']}")
    if intent["bhk"]:
        query = query.filter(models.Property.bhk == intent["bhk"])
        filters_applied.append(f"{intent['bhk']} BHK")
    if intent["status"]:
        query = query.filter(models.Property.status == intent["status"])
        filters_applied.append(f"{intent['status'].lower()}")
    if intent["max_price"]:
        query = query.filter(models.Property.price <= intent["max_price"])
        formatted_price = f"₹{intent['max_price']/10000000}Cr" if intent['max_price'] >= 10000000 else f"₹{intent['max_price']/100000}L"
        filters_applied.append(f"under {formatted_price}")

    results = query.order_by(models.Property.price.desc()).limit(intent["limit"]).all()
    
    if not filters_applied:
        reply = "Hello! I'm your AI Real Estate Concierge. Tell me what you're looking for, such as: 'Find me a 3 BHK in Bangalore under 2 Cr'."
    elif len(results) > 0:
        filter_str = " ".join(filters_applied)
        if len(results) < intent["limit"]:
            reply = f"I could only find {len(results)} options {filter_str}. Here they are:"
        else:
            reply = f"Here are {len(results)} excellent options {filter_str} for you:"
    else:
        filter_str = " ".join(filters_applied)
        reply = f"I couldn't find any matches {filter_str} at the moment. Try adjusting your budget or exploring a different city!"

    properties_data = []
    for p in results:
        properties_data.append({
            "id": p.id, "title": p.title, "price": p.price, "location": p.location, "city": p.city,
            "image": p.image, "bhk": p.bhk, "sqft": p.sqft, "status": p.status, "type": p.property_type
        })

    # Return the new context back to the frontend so it remembers for the next message
    return {"reply": reply, "properties": properties_data, "new_context": intent}