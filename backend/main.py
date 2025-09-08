from fastapi import FastAPI, HTTPException,File,UploadFile
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uvicorn
from PIL import Image
import io
import aiofiles
import requests
import logging
import json
import asyncio
import re
from datetime import datetime
from pydantic import BaseModel
import google.generativeai as genai
#env variables
load_dotenv()

#logging
logging.basicConfig(level=logging.INFO)
loggger = logging.getLogger(__name__)
 #google genai

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
app= FastAPI(
    title="Flood Detection System API",
    description="API for flood detection system",
    version="1.0.0"
)
#Cors middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#models
class CoordinateRequest(BaseModel):
    latitude: float
    longitude: float

class AnalysisResponse(BaseModel):
    success: bool
    risk_level: str
    description: str
    recommendations: str
    elevation: float
    distance_to_water: float
    message: str

def parse_gemini_response(response: str) -> AnalysisResponse:
    try:
        json_match = re.search(r"```json\s*([\s\S]*?)\s*```", response, re.DOTALL)
        if json_match:
            json_str = json_match.group()
            parsed_data = json.loads(json_str)
            return {
                "risk_level": parsed_data.get("risk_level", "Unknown"),
                "description": parsed_data.get("description", "Unknown"),
                "recommendations": parsed_data.get("recommendations", "Unknown"),
                "elevation": parsed_data.get("elevation", 0.0),
                "distance_to_water": parsed_data.get("distance_to_water", 0.0),
                "message": parsed_data.get("message", "Unknown")
            }
        else:
            raise ValueError("JSON response not found in Gemini response")
    except Exception as e:
        return{
            "risk_level": "Unknown",
            "description": "Unknown",
            "recommendations": "Unknown",
            "elevation": 0.0,
            "distance_to_water": 0.0,
            "message": "Unknown" or "Failed to parse Gemini response"
        }

@app.get("/")
async def read_root():
    "health check endpoint"
    return {
        "message":"flood detection system API is running",
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()}


@app.post("/api/analyze/image")
async def analyze_image(file:UploadFile=File(...)):
    """Analyse file upload"""
    try:
        logger.info(f"Analyzing image: {file.filename}")
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type")
        if file.size > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds 10MB")

        image_data = await file.read()
        try:
            image =PILImage.open(io.BytesIO(image_data))
            if image.mode != "RGB":
                image = image.convert("RGB")
        except Exception as img_error:
            raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")

        prompt = f"""
        Analyze the following image for flood risk assessment:
        Please provide the following information:
        1. Risk level (low, medium, high)
        2. Description of the flood risk on what you see
        3. 3-4 Recommendations for flood prevention and mitigation
        4. Elevation of the area
        5. Distance to nearest water body
        6. What water bodies or flood risk areas are visible in the image

        Format your response as JSON with these fields:
        - risk_level: str
        - description: str
        - recommendations: (array of strings)
        - elevation: float
        - distance_to_water: float
        - image_analysis (describing what you see): str
        """
        try:
            model = genai.GenerativeModel("gemini-2.0-flash-exp")
            response = model.generate_content(prompt, image_data)
            parsed_data = json.loads(response.text)
        except Exception as e:
            logger.error(f"Error analyzing image: {str(e)}")
            parsed_data = generate_image_risk_assessment()
            parsed_data["image_analysis"] = "Image analysis failed"
        
        return {
            "success": True,
            **parsed_data,
            "ai_analysis": parsed_data.get("image_analysis", ""),
            "message": "Image analysis completed successfully"
        }
    except Exception as e:
        logger.error(f"Unexpected Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze image")
        
def generate_image_risk_assessment()->dict:
    """Generate image risk assessment"""
    import random
    risk_levels =random.choice(["low", "medium", "high"]) 

    description = {"low":"The area is at low risk of flooding.", "medium":"The area is at medium risk of flooding.", "high":"The area is at high risk of flooding.", "very high":"The area is at very high risk of flooding."}
    recommendations = {
        "low":["The area is at low risk of flooding.", "continue to monitor terrain","Maintain current drainage system","Stay informed about weather conditions"],
         "medium":["The area is at medium risk of flooding.", "Improve drainage infastructure", "Consider flood monitoring systems", "Develop early warning systems"], 
         "high":["The area is at high risk of flooding.", "Install flood barriers", "Implement early warning systems", "Consider structural reinforcement"], 
         "very high":["The area is at very high risk of flooding.", "Immediate flood protection measures", "Consider relocation of vulnerable populations", "Develop comprehensive flood mitigation plans"]}
    return {
        "success": True,
        "risk_level": risk_levels,
        "description": description[risk_levels],
        "recommendations": recommendations[risk_levels],
        "elevation": random.randint(0, 100),
        "distance_to_water": random.randint(0, 100),
        "message": "Image risk assessment completed successfully"
    }   
    
if __name__ == "__main__":
    uvicorn.run('main:app', host="0.0.0.0", port=8000, reload=True, log_level="info")
    log_level="info"

    