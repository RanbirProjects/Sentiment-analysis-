# Sentiment Analysis MERN Project

This project is a full-stack sentiment analysis app using MERN (MongoDB, Express, React, Node.js) and a Python microservice for deep learning sentiment analysis (RoBERTa).
Welcome page 
![5A74EB99-C469-4BE4-8CEF-154A23479B9F](https://github.com/user-attachments/assets/909eeada-667b-4d93-b120-43146137a1f9)
Analysis History
![255BC4F6-C073-4DD6-A075-1144981D9DA2](https://github.com/user-attachments/assets/153436b2-c7f6-4505-bb21-c1f06b6216aa)
AboutSentiment analysis
![999FC8A7-2E00-40FF-AC20-B022747AE0E7](https://github.com/user-attachments/assets/ab2b0d2b-ee29-47ef-9534-9f2802e4969a)



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
