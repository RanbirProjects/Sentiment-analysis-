# Model Microservice

## Setup

1. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install fastapi uvicorn transformers torch
   ```
3. Run the service:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## Endpoint
- `POST /analyze` — Analyze sentiment of text 