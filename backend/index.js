const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// In-memory storage as fallback when MongoDB is not available
let inMemoryHistory = [];

// MongoDB model
const analysisSchema = new mongoose.Schema({
  text: String,
  label: String,
  score: Number,
  createdAt: { type: Date, default: Date.now }
});
const Analysis = mongoose.model('Analysis', analysisSchema);

// Connect to MongoDB with error handling
mongoose.connect('mongodb://localhost:27017/sentiment', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.log('MongoDB connection failed, using in-memory storage:', err.message);
});

// Analyze endpoint
app.post('/analyze', async (req, res) => {
  const { text } = req.body;
  try {
    // Call Python model microservice
    const response = await axios.post('http://localhost:8000/analyze', { text });
    const { label, score } = response.data;
    
    // Save to MongoDB if available, otherwise use in-memory
    try {
      const analysis = new Analysis({ text, label, score });
      await analysis.save();
    } catch (dbError) {
      // Fallback to in-memory storage
      inMemoryHistory.unshift({ text, label, score, createdAt: new Date() });
      if (inMemoryHistory.length > 50) inMemoryHistory.pop(); // Keep only last 50
    }
    
    res.json({ text, label, score });
  } catch (err) {
    res.status(500).json({ error: 'Analysis failed', details: err.message });
  }
});

// History endpoint
app.get('/history', async (req, res) => {
  try {
    // Try to get from MongoDB first
    const history = await Analysis.find().sort({ createdAt: -1 }).limit(20);
    res.json(history);
  } catch (dbError) {
    // Fallback to in-memory storage
    res.json(inMemoryHistory.slice(0, 20));
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 