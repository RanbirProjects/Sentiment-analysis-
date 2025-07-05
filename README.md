# Sentiment Analysis MERN Project

This project is a full-stack sentiment analysis app using MERN (MongoDB, Express, React, Node.js) and a Python microservice for deep learning sentiment analysis (RoBERTa).

## Structure
- `backend/` — Node.js/Express API
- `frontend/` — React app
- `model-service/` — Python FastAPI microservice (RoBERTa)

## Quick Start

### 1. Start MongoDB
Make sure MongoDB is running locally (default URI: `mongodb://localhost:27017/sentiment`).

### 2. Start the Model Microservice
```
cd model-service
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. Start the Backend
```
cd backend
npm install
node index.js
```

### 4. Start the Frontend
```
cd frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
# Sentiment-analysis-
