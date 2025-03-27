import React, { useState, useEffect } from "react";
import './TreeSpeciesForm.css';

const TreeSpeciesForm = () => {
  const [data, setData] = useState({ species: "", region: "", growth_rate: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);
    
    try {
      if (!data.species || !data.region || !data.growth_rate) {
        throw new Error("Please fill in all fields!");
      }

      const formattedData = {
        species: data.species.trim(),
        region: data.region.trim(),
        growth_rate: parseFloat(data.growth_rate),
      };

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await fetch("http://127.0.0.1:5000/predict/tree-species", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      setResult(result);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const TreeInfoBubbles = () => {
    const [visibleBubbles, setVisibleBubbles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const infoBubbles = [
      {
        id: 1,
        content: "🌳 Mature trees absorb ~48 lbs of CO₂ annually and provide oxygen for 2 people",
        emoji: "🌳",
        position: { bottom: "10%", left: "5%" },
        color: "#e3f2fd"
      },
      {
        id: 2,
        content: "📈 Faster growth = more CO₂ absorption. Bamboo grows up to 91cm/day!",
        emoji: "📈",
        position: { bottom: "20%", right: "5%" },
        color: "#e8f5e9"
      },
      {
        id: 3,
        content: "🌲 Oak trees support 500+ wildlife species - more than any native tree",
        emoji: "🌲",
        position: { bottom: "30%", left: "8%" },
        color: "#fff8e1"
      },
      {
        id: 4,
        content: "💧 Right species selection can reduce water usage by 40% in dry regions",
        emoji: "💧",
        position: { bottom: "40%", right: "10%" },
        color: "#f3e5f5"
      },
      {
        id: 5,
        content: "🔄 Mixed species plantings have 25% higher survival than monocultures",
        emoji: "🔄",
        position: { bottom: "50%", left: "2%" },
        color: "#e0f7fa"
      },
      {
        id: 6,
        content: "🌱 Trees reduce urban temperatures by 2-8°C through shading and evapotranspiration",
        emoji: "🌱",
        position: { bottom: "60%", right: "2%" },
        color: "#fce4ec"
      }
    ];

    useEffect(() => {
      const timer = setInterval(() => {
        if (currentIndex < infoBubbles.length) {
          setVisibleBubbles(prev => [...prev, infoBubbles[currentIndex]]);
          setCurrentIndex(prev => prev + 1);
        } else {
          // Restart the sequence after all bubbles have appeared
          setTimeout(() => {
            setVisibleBubbles([]);
            setCurrentIndex(0);
          }, 2500);
        }
      }, 2500); // 2.5 second gap between bubbles

      return () => clearInterval(timer);
    }, [currentIndex]);

    return (
      <div className="info-bubbles-container">
        {visibleBubbles.map((bubble) => (
          <div 
            key={bubble.id}
            className="info-bubble"
            style={{
              left: bubble.position.left,
              right: bubble.position.right,
              bottom: bubble.position.bottom,
              backgroundColor: bubble.color,
              animation: `floatUp 1s ease-out forwards`
            }}
          >
            <span className="bubble-emoji">{bubble.emoji}</span>
            <p>{bubble.content}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderSpeciesTips = () => {
    switch(data.species) {
      case "Oak":
        return (
          <ul>
            <li>Plant in deep, well-drained soil</li>
            <li>Space trees 15-20m apart</li>
            <li>Prune in late winter to prevent oak wilt</li>
            <li>Acorns provide food for wildlife</li>
          </ul>
        );
      case "Teak":
        return (
          <ul>
            <li>Requires full sunlight</li>
            <li>Needs 1,500-2,000mm annual rainfall</li>
            <li>Grows best in sandy loam soils</li>
            <li>Resistant to termites and fungi</li>
          </ul>
        );
      case "Mahogany":
        return (
          <ul>
            <li>Thrives in 25-35°C temperatures</li>
            <li>Plant at beginning of rainy season</li>
            <li>Monitor for shoot borers</li>
            <li>Deep taproot makes it drought resistant</li>
          </ul>
        );
      case "Bamboo":
        return (
          <ul>
            <li>Plant rhizomes 1-2m apart</li>
            <li>Water frequently in first year</li>
            <li>Harvest mature culms at 3-5 years</li>
            <li>Excellent for erosion control</li>
          </ul>
        );
      default:
        return <p>Select a species to see specific growing tips</p>;
    }
  };

  return (
    <div className="app-container">
      <div className="background-overlay"></div>
      <TreeInfoBubbles />
      
      <div className="form-container">
        <div className="heading">
          <h1>Tree Species Survival Prediction</h1>
          <p>Discover survival probability and CO₂ absorption for different tree species</p>
        </div>
        
        <div className="user-input">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tree Species</label>
              <select 
                name="species" 
                onChange={handleChange} 
                value={data.species} 
                className="form-input"
                required
              >
                <option value="">Select Species</option>
                <option value="Teak">Teak</option>
                <option value="Oak">Oak</option>
                <option value="Mahogany">Mahogany</option>
                <option value="Bamboo">Bamboo</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Region</label>
              <select 
                name="region" 
                onChange={handleChange} 
                value={data.region} 
                className="form-input"
                required
              >
                <option value="">Select Region</option>
                <option value="Mountainous">Mountainous</option>
                <option value="Tropical">Tropical</option>
                <option value="Arid">Arid</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Growth Rate (cm/year)</label>
              <input
                type="number"
                name="growth_rate"
                onChange={handleChange}
                placeholder="Enter growth rate"
                value={data.growth_rate}
                step="0.1"
                className="form-input"
                min="0"
                required
              />
            </div>
            
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                "Predict Survival"
              )}
            </button>
          </form>
        </div>
        
        <div className={`model-output ${result ? 'show' : ''}`}>
          {error && (
            <div className="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p>{error}</p>
            </div>
          )}
          
          {result && (
            <div className="result-card">
              <div className="result-header">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <h3>Prediction Results</h3>
              </div>
              
              <div className="result-metrics">
                <div className="metric">
                  <span className="metric-label">CO₂ Absorption</span>
                  <span className="metric-value">{result.co2_absorption.toFixed(2)} kg/year</span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Survival Probability</span>
                  <span className="metric-value">
                    {(result.survival_probability * 100).toFixed(1)}%
                    <div className="probability-bar">
                      <div 
                        className="probability-fill" 
                        style={{ width: `${result.survival_probability * 100}%` }}
                      ></div>
                    </div>
                  </span>
                </div>
              </div>
              
              <div className="species-tips">
                <h4>🌿 {data.species} Growing Tips:</h4>
                {renderSpeciesTips()}
              </div>
              
              <div className="result-footer">
                <p>Recommended for {data.region} regions</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreeSpeciesForm;