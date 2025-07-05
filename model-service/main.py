from fastapi import FastAPI, Request
from pydantic import BaseModel
from transformers import pipeline
import uvicorn

app = FastAPI()

# Load sentiment analysis pipeline (using RoBERTa or similar model)
sentiment_pipeline = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment-latest")

class TextIn(BaseModel):
    text: str

@app.post("/analyze")
def analyze_sentiment(data: TextIn):
    result = sentiment_pipeline(data.text)
    return {"label": result[0]["label"], "score": result[0]["score"]}

# Uncomment to run directly
# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000) 