import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('analyze');

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setResult(data);
      fetchHistory();
    } catch (err) {
      setResult({ error: 'Failed to analyze sentiment.' });
    }
    setLoading(false);
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:5000/history');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.log('Could not fetch history');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getSentimentColor = (label) => {
    switch (label?.toLowerCase()) {
      case 'positive': return '#4caf50';
      case 'negative': return '#f44336';
      case 'neutral': return '#2196f3';
      default: return '#757575';
    }
  };

  const getSentimentIcon = (label) => {
    switch (label?.toLowerCase()) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const getSentimentDescription = (label, score) => {
    const confidence = (score * 100).toFixed(1);
    switch (label?.toLowerCase()) {
      case 'positive':
        if (confidence >= 90) return 'Very Strong Positive';
        if (confidence >= 80) return 'Strong Positive';
        if (confidence >= 70) return 'Moderate Positive';
        return 'Slight Positive';
      case 'negative':
        if (confidence >= 90) return 'Very Strong Negative';
        if (confidence >= 80) return 'Strong Negative';
        if (confidence >= 70) return 'Moderate Negative';
        return 'Slight Negative';
      case 'neutral':
        if (confidence >= 90) return 'Very Neutral';
        if (confidence >= 80) return 'Strong Neutral';
        if (confidence >= 70) return 'Moderate Neutral';
        return 'Slight Neutral';
      default:
        return 'Unknown Sentiment';
    }
  };

  // Prepare chart data
  const getChartData = () => {
    const sentimentCounts = history.reduce((acc, item) => {
      const label = item.label?.toLowerCase() || 'unknown';
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});

    return [
      { name: 'Positive', value: sentimentCounts.positive || 0, color: '#4caf50' },
      { name: 'Negative', value: sentimentCounts.negative || 0, color: '#f44336' },
      { name: 'Neutral', value: sentimentCounts.neutral || 0, color: '#2196f3' }
    ];
  };

  const getConfidenceData = () => {
    return history.slice(0, 10).map((item, index) => ({
      name: `Analysis ${index + 1}`,
      confidence: (item.score * 100).toFixed(1),
      sentiment: item.label
    }));
  };

  const getTrendData = () => {
    return history.slice(0, 15).reverse().map((item, index) => ({
      name: `#${index + 1}`,
      score: (item.score * 100).toFixed(1),
      sentiment: item.label
    }));
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>🤖 Sentiment Analysis AI</h1>
          <p>Advanced emotion detection powered by RoBERTa</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="tabs">
        <button 
          className={`tab ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
        >
          📝 Analyze Text
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📊 History
        </button>
        <button 
          className={`tab ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          ℹ️ About
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'analyze' && (
          <div className="analyze-section">
            <div className="hero-section">
              <div className="hero-text">
                <h2>Discover the Emotion Behind Your Words</h2>
                <p>Our advanced AI analyzes text to understand sentiment, emotions, and opinions with remarkable accuracy.</p>
              </div>
              <div className="hero-image">
                <div className="image-placeholder">
                  <span>🧠</span>
                  <p>AI-Powered Analysis</p>
                </div>
              </div>
            </div>

            <div className="analysis-form">
              <div className="input-group">
                <label>Enter your text to analyze:</label>
                <textarea
                  rows={6}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Try: 'I love this amazing product!' or 'This service is terrible and disappointing.'"
                  className="text-input"
                />
              </div>
              
              <button 
                onClick={analyze} 
                disabled={loading || !text.trim()}
                className="analyze-btn"
              >
                {loading ? '🔍 Analyzing...' : '🚀 Analyze Sentiment'}
              </button>

              {result && (
                <div className="result-card">
                  {result.error ? (
                    <div className="error-message">
                      <span>❌ {result.error}</span>
                    </div>
                  ) : (
                    <div className="sentiment-result">
                      <div className="sentiment-icon">
                        {getSentimentIcon(result.label)}
                      </div>
                      <div className="sentiment-details">
                        <h3>Analysis Result</h3>
                        <p className="sentiment-label" style={{ color: getSentimentColor(result.label) }}>
                          {result.label?.toUpperCase()}
                        </p>
                        <p className="sentiment-score">
                          Confidence: {(result.score * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <div className="history-header">
              <h2>📊 Analysis History</h2>
              <div className="history-stats">
                <div className="stat-item">
                  <span className="stat-number">{history.length}</span>
                  <span className="stat-label">Total Analyses</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {history.filter(item => item.label?.toLowerCase() === 'positive').length}
                  </span>
                  <span className="stat-label">Positive</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {history.filter(item => item.label?.toLowerCase() === 'negative').length}
                  </span>
                  <span className="stat-label">Negative</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {history.filter(item => item.label?.toLowerCase() === 'neutral').length}
                  </span>
                  <span className="stat-label">Neutral</span>
                </div>
              </div>
            </div>
            
            <div className="history-grid">
              {history.length === 0 ? (
                <div className="empty-history">
                  <span>📝</span>
                  <p>No analyses yet. Start by analyzing some text!</p>
                  <button 
                    onClick={() => setActiveTab('analyze')}
                    className="analyze-now-btn"
                  >
                    🚀 Start Analyzing
                  </button>
                </div>
              ) : (
                history.map((item, idx) => (
                  <div key={item._id || idx} className="history-card">
                    <div className="history-card-header">
                      <div className="history-timestamp">
                        <span className="time-icon">🕒</span>
                        <span className="time-text">{formatDate(item.createdAt)}</span>
                      </div>
                      <div className="history-id">#{history.length - idx}</div>
                    </div>
                    
                    <div className="history-content">
                      <div className="history-text-section">
                        <h4 className="text-label">Analyzed Text:</h4>
                        <p className="history-text">{item.text}</p>
                      </div>
                      
                      <div className="sentiment-analysis-section">
                        <div className="sentiment-main">
                          <div className="sentiment-icon-large">
                            {getSentimentIcon(item.label)}
                          </div>
                          <div className="sentiment-details-main">
                            <h3 className="sentiment-title">
                              {getSentimentDescription(item.label, item.score)}
                            </h3>
                            <div className="sentiment-badge-large" style={{ backgroundColor: getSentimentColor(item.label) }}>
                              {item.label?.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="confidence-section">
                          <div className="confidence-bar">
                            <div className="confidence-fill" 
                                 style={{ 
                                   width: `${(item.score * 100).toFixed(1)}%`,
                                   backgroundColor: getSentimentColor(item.label)
                                 }}>
                            </div>
                          </div>
                          <span className="confidence-text">
                            Confidence: {(item.score * 100).toFixed(1)}%
                          </span>
                        </div>
                        
                        <div className="sentiment-insights">
                          <div className="insight-item">
                            <span className="insight-icon">🎯</span>
                            <span className="insight-text">
                              {item.score >= 0.9 ? 'Very High Confidence' : 
                               item.score >= 0.8 ? 'High Confidence' :
                               item.score >= 0.7 ? 'Moderate Confidence' : 'Low Confidence'}
                            </span>
                          </div>
                          <div className="insight-item">
                            <span className="insight-icon">📊</span>
                            <span className="insight-text">
                              {item.text.length} characters analyzed
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="about-section">
            <div className="about-content">
              <div className="about-hero">
                <h2>About Sentiment Analysis</h2>
                <p>Understanding emotions in text has never been easier</p>
              </div>
              
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">🤖</div>
                  <h3>AI-Powered</h3>
                  <p>Uses state-of-the-art RoBERTa model for accurate sentiment detection</p>
                  <div className="feature-details">
                    <h4>Technical Details:</h4>
                    <ul>
                      <li>Based on RoBERTa (Robustly Optimized BERT Pretraining Approach)</li>
                      <li>Trained on 58M tweets for social media sentiment</li>
                      <li>Fine-tuned for 3-class classification (Positive, Negative, Neutral)</li>
                      <li>Uses transformer architecture with 125M parameters</li>
                      <li>Contextual understanding of language nuances</li>
                    </ul>
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">⚡</div>
                  <h3>Real-time</h3>
                  <p>Get instant results with our fast and responsive API</p>
                  <div className="feature-details">
                    <h4>Performance Features:</h4>
                    <ul>
                      <li>Average response time: &lt; 500ms</li>
                      <li>Asynchronous processing for multiple requests</li>
                      <li>Optimized model loading and inference</li>
                      <li>CPU-optimized for accessibility</li>
                      <li>Scalable microservice architecture</li>
                    </ul>
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">📊</div>
                  <h3>Detailed Analysis</h3>
                  <p>Receive confidence scores and detailed sentiment breakdowns</p>
                  <div className="feature-details">
                    <h4>Analysis Capabilities:</h4>
                    <ul>
                      <li>Confidence scores from 0-100%</li>
                      <li>Handles negation and sarcasm</li>
                      <li>Context-aware sentiment detection</li>
                      <li>Multi-language support (English optimized)</li>
                      <li>Emotion intensity measurement</li>
                    </ul>
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">💾</div>
                  <h3>History Tracking</h3>
                  <p>Keep track of all your previous analyses for reference</p>
                  <div className="feature-details">
                    <h4>Data Management:</h4>
                    <ul>
                      <li>Persistent storage with MongoDB</li>
                      <li>In-memory fallback for reliability</li>
                      <li>Timestamp tracking for all analyses</li>
                      <li>Export capabilities for data analysis</li>
                      <li>Privacy-focused data handling</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              {history.length > 0 && (
                <div className="charts-section">
                  <h3>📈 Analysis Insights</h3>
                  <div className="charts-grid">
                    <div className="chart-card">
                      <h4>Sentiment Distribution</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={getChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                      <h4>Confidence Scores</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={getConfidenceData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="confidence" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="chart-card full-width">
                      <h4>Sentiment Trend</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={getTrendData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              <div className="tech-stack">
                <h3>Technology Stack</h3>
                <div className="tech-badges">
                  <span className="tech-badge">React</span>
                  <span className="tech-badge">Node.js</span>
                  <span className="tech-badge">Express</span>
                  <span className="tech-badge">MongoDB</span>
                  <span className="tech-badge">Python</span>
                  <span className="tech-badge">FastAPI</span>
                  <span className="tech-badge">RoBERTa</span>
                  <span className="tech-badge">Transformers</span>
                  <span className="tech-badge">Recharts</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
