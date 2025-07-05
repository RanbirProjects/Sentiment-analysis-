# Backend API

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start MongoDB locally (default URI: `mongodb://localhost:27017/sentiment`).
3. Start the server:
   ```bash
   node index.js
   ```

## Endpoints
- `POST /analyze` — Analyze sentiment of text
- `GET /history` — Get recent analyses 