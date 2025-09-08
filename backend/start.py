#!/usr/bin/env python

import os
import sys
import uvicorn
from pathlib import Path

sys.path.append(str(Path(__file__).parent))

if __name__ == "__main__":
    port =int(os.getenv("PORT", 8001))
    host = os.getenv("HOST", "0.0.0.0")
    
    print(f"Starting server on {host}:{port}")
    print(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")
    print(f"API Key: {os.getenv('GOOGLE_API_KEY')}")
    print(f"Swagger UI: http://{host}:{port}/docs")
    print(f"Redoc: http://{host}:{port}/redoc")
    print(f"OpenAPI JSON: http://{host}:{port}/openapi.json")


    uvicorn.run("main:app", host=host, port=port, reload=True, log_level="info")