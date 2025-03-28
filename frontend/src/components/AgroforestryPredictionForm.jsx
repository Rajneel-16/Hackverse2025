import React, { useState } from "react";
import { motion } from "framer-motion";
import "./AgroforestryPredictionForm.css";

const AgroforestryPredictionForm = () => {
  // Client-side crop database
  const cropDatabase = [
    {
      name: "Coffee",
      idealPH: { min: 6, max: 6.5 },
      waterNeeds: 700,
      shadeTolerance: 8,
      compatibleTrees: ["Leucaena leucocephala", "Inga edulis"],
      benefits: [
        "High nitrogen fixation",
        "Excellent shade compatibility",
        "Optimal water usage"
      ]
    },
    {
      name: "Cacao",
      idealPH: { min: 6, max: 7 },
      waterNeeds: 1500,
      shadeTolerance: 9,
      compatibleTrees: ["Gliricidia sepium", "Erythrina poeppigiana"],
      benefits: [
        "Deep root system",
        "High biodiversity support",
        "Excellent canopy"
      ]
    },
    {
      name: "Black Pepper",
      idealPH: { min: 5.5, max: 6.5 },
      waterNeeds: 1200,
      shadeTolerance: 7,
      compatibleTrees: ["Grevillea robusta", "Casuarina equisetifolia"],
      benefits: [
        "Vertical growth habit",
        "Good wind protection",
        "Moderate water use"
      ]
    },
    {
      name: "Vanilla",
      idealPH: { min: 6, max: 7.5 },
      waterNeeds: 2000,
      shadeTolerance: 8,
      compatibleTrees: ["Gliricidia sepium", "Leucaena leucocephala"],
      benefits: [
        "Vining growth pattern",
        "High-value crop",
        "Requires strong support trees"
      ]
    }
  ];

  // Region-based default data
  const regionData = {
    "Central Valley, California": {
      pH: 6.5,
      moistureLevel: 65,
      co2Absorption: 12.5,
      growthRate: 7,
      shadeToleranceTree: 8,
      shadeToleranceCrop: 6,
      waterRequirement: 850,
      yield: 7.5
    },
    "Punjab, India": {
      pH: 7.2,
      moistureLevel: 70,
      co2Absorption: 10.8,
      growthRate: 8,
      shadeToleranceTree: 7,
      shadeToleranceCrop: 5,
      waterRequirement: 1200,
      yield: 8.2
    },
    "Default": {
      pH: 6.8,
      moistureLevel: 60,
      co2Absorption: 11.5,
      growthRate: 6,
      shadeToleranceTree: 7,
      shadeToleranceCrop: 5,
      waterRequirement: 1000,
      yield: 7.0
    }
  };

  const [data, setData] = useState({
    pH: "",
    moistureLevel: "",
    co2Absorption: "",
    growthRate: "",
    shadeToleranceTree: "",
    shadeToleranceCrop: "",
    waterRequirement: "",
    yield: "",
  });
  
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState("");
  const [activeTab, setActiveTab] = useState("form");

  // Mock location detection
  const detectLocation = () => {
    setIsSubmitting(true);
    setError(null);
    
    setTimeout(() => {
      const mockLocations = [
        "Central Valley, California",
        "Punjab, India",
        "Default"
      ];
      setLocation(mockLocations[Math.floor(Math.random() * mockLocations.length)]);
      setIsSubmitting(false);
    }, 1500);
  };

  // Auto-fill based on location
  const autoFillData = () => {
    if (location && regionData[location]) {
      setData(regionData[location]);
    } else {
      setData(regionData["Default"]);
    }
  };

  // Client-side prediction logic
  const calculateRecommendations = () => {
    if (!validateInputs()) {
      throw new Error("Invalid input values detected");
    }

    const scoredCrops = cropDatabase.map(crop => {
      let score = 100;
      
      // pH scoring (20% weight)
      if (data.pH < crop.idealPH.min || data.pH > crop.idealPH.max) {
        score -= 20;
      } else {
        const optimalPH = (crop.idealPH.min + crop.idealPH.max) / 2;
        score -= Math.abs(data.pH - optimalPH) * 4;
      }
      
      // Water requirement scoring (30% weight)
      const waterDifference = Math.abs(data.waterRequirement - crop.waterNeeds);
      score -= Math.min(30, waterDifference / 50);
      
      // Shade tolerance scoring (20% weight)
      score -= Math.abs(data.shadeToleranceCrop - crop.shadeTolerance) * 2;
      
      // Yield potential scoring (15% weight)
      score += (data.yield - 5) * 1.5;
      
      // Growth rate scoring (15% weight)
      score += (data.growthRate - 5) * 1.5;
      
      return {
        ...crop,
        compatibilityScore: Math.max(0, Math.min(100, Math.round(score)))
      };
    });

    // Sort by score and pick top 3
    const topMatches = scoredCrops
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 3);

    return {
      topMatches,
      bestMatch: topMatches[0],
      calculationMethod: "Client-side weighted algorithm"
    };
  };

  const validateInputs = () => {
    return (
      data.pH >= 0 && data.pH <= 14 &&
      data.moistureLevel >= 0 && data.moistureLevel <= 100 &&
      data.waterRequirement > 0
    );
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const recommendations = calculateRecommendations();
      
      setResult({
        bestTree: recommendations.bestMatch.compatibleTrees[0],
        bestCrop: recommendations.bestMatch.name,
        compatibilityScore: recommendations.bestMatch.compatibilityScore,
        benefits: recommendations.bestMatch.benefits,
        allOptions: recommendations.topMatches,
        calculationMethod: recommendations.calculationMethod
      });
      
      setActiveTab("results");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="agroforestry-container">
      <div className="agroforestry-background"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="agroforestry-form-container"
      >
        <h1 className="agroforestry-title">
          <span>Smart Agroforestry</span> Planner
        </h1>
        <p className="agroforestry-subtitle">
          Dynamic recommendations powered by client-side intelligence
        </p>

        <div className="automation-options">
          <button 
            className="auto-detect-btn"
            onClick={detectLocation}
            disabled={isSubmitting}
          >
            {location ? `📍 ${location}` : (isSubmitting ? "Detecting..." : "Auto-Detect Location")}
          </button>
          
          {location && (
            <button 
              className="auto-fill-btn"
              onClick={autoFillData}
              disabled={isSubmitting}
            >
              Load Regional Defaults
            </button>
          )}
          
          <button 
            className="sample-button"
            onClick={() => {
              setData(regionData["Central Valley, California"]);
              setLocation("Central Valley, California");
            }}
          >
            Load California Sample
          </button>
        </div>

        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === "form" ? "active" : ""}`}
            onClick={() => setActiveTab("form")}
          >
            Input Parameters
          </button>
          <button 
            className={`tab-button ${activeTab === "results" ? "active" : ""}`}
            onClick={() => setActiveTab("results")}
            disabled={!result}
          >
            Recommendations
          </button>
        </div>

        {activeTab === "form" ? (
          <form onSubmit={handleSubmit} className="agroforestry-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Soil pH Level</label>
                <input 
                  type="number" 
                  name="pH" 
                  onChange={handleChange} 
                  value={data.pH} 
                  step="0.1" 
                  min="0" 
                  max="14"
                  placeholder="6.0 - 7.5 ideal"
                  required
                />
                <div className="input-decoration">
                  <div className="ph-indicator" style={{ 
                    backgroundColor: data.pH ? 
                      `hsl(${((14 - data.pH) / 14) * 120}, 70%, 50%)` : '#ccc'
                  }}></div>
                </div>
              </div>

              <div className="form-group">
                <label>Moisture Level (%)</label>
                <input 
                  type="number" 
                  name="moistureLevel" 
                  onChange={handleChange} 
                  value={data.moistureLevel} 
                  step="1"
                  min="0"
                  max="100"
                  placeholder="40-70% typical"
                  required
                />
                <div className="input-decoration">
                  <div className="moisture-bar" style={{ 
                    width: data.moistureLevel ? `${data.moistureLevel}%` : '0%'
                  }}></div>
                </div>
              </div>

              <div className="form-group">
                <label>CO₂ Absorption Potential (kg/year)</label>
                <input 
                  type="number" 
                  name="co2Absorption" 
                  onChange={handleChange} 
                  value={data.co2Absorption} 
                  step="0.1"
                  min="0"
                  placeholder="10-15 typical"
                  required
                />
                <div className="input-decoration">
                  <div className="co2-icon">🌱</div>
                </div>
              </div>

              <div className="form-group">
                <label>Growth Rate Index (1-10)</label>
                <input 
                  type="number" 
                  name="growthRate" 
                  onChange={handleChange} 
                  value={data.growthRate} 
                  step="0.1"
                  min="1"
                  max="10"
                  placeholder="1 (slow) to 10 (fast)"
                  required
                />
                <div className="input-decoration">
                  <div className="growth-meter" style={{ 
                    width: data.growthRate ? `${data.growthRate * 10}%` : '0%'
                  }}></div>
                </div>
              </div>

              <div className="form-group">
                <label>Tree Shade Tolerance (1-10)</label>
                <input 
                  type="number" 
                  name="shadeToleranceTree" 
                  onChange={handleChange} 
                  value={data.shadeToleranceTree} 
                  step="0.1"
                  min="1"
                  max="10"
                  placeholder="1 (low) to 10 (high)"
                  required
                />
                <div className="input-decoration">
                  <div className="shade-icon">🌳</div>
                </div>
              </div>

              <div className="form-group">
                <label>Crop Shade Tolerance (1-10)</label>
                <input 
                  type="number" 
                  name="shadeToleranceCrop" 
                  onChange={handleChange} 
                  value={data.shadeToleranceCrop} 
                  step="0.1"
                  min="1"
                  max="10"
                  placeholder="1 (low) to 10 (high)"
                  required
                />
                <div className="input-decoration">
                  <div className="shade-icon">🌾</div>
                </div>
              </div>

              <div className="form-group">
                <label>Water Requirement (mm/year)</label>
                <input 
                  type="number" 
                  name="waterRequirement" 
                  onChange={handleChange} 
                  value={data.waterRequirement} 
                  step="10"
                  min="0"
                  placeholder="500-1500 typical"
                  required
                />
                <div className="input-decoration">
                  <div className="water-drop">💧</div>
                </div>
              </div>

              <div className="form-group">
                <label>Expected Yield Index (1-10)</label>
                <input 
                  type="number" 
                  name="yield" 
                  onChange={handleChange} 
                  value={data.yield} 
                  step="0.1"
                  min="1"
                  max="10"
                  placeholder="1 (low) to 10 (high)"
                  required
                />
                <div className="input-decoration">
                  <div className="yield-icon">📈</div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <motion.button 
                type="submit" 
                className="submit-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="spinner"></div>
                ) : (
                  "Generate Recommendations"
                )}
              </motion.button>
            </div>
          </form>
        ) : (
          <div className="results-tab">
            {result && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="results-container"
              >
                <div className="result-header">
                  <h2>Optimal Agroforestry System</h2>
                  <div className="compatibility-score">
                    {result.compatibilityScore}% Match
                  </div>
                </div>
                
                <div className="result-cards">
                  <div className="result-card tree-card">
                    <div className="card-icon">🌴</div>
                    <h3>Recommended Tree</h3>
                    <p className="recommendation">{result.bestTree}</p>
                  </div>
                  
                  <div className="result-card crop-card">
                    <div className="card-icon">🌱</div>
                    <h3>Recommended Crop</h3>
                    <p className="recommendation">{result.bestCrop}</p>
                  </div>
                </div>

                <div className="benefits-section">
                  <h3>System Benefits</h3>
                  <ul>
                    {result.benefits.map((benefit, index) => (
                      <li key={index}>
                        <span className="check-icon">✓</span> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="other-options">
                  <h3>Other Good Options</h3>
                  <div className="options-grid">
                    {result.allOptions.slice(1).map((option, index) => (
                      <div key={index} className="option-card">
                        <h4>{option.name}</h4>
                        <p>With {option.compatibleTrees[0]}</p>
                        <div className="option-score">
                          {option.compatibilityScore}% match
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="calculation-method">
                  <small>Calculation: {result.calculationMethod}</small>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="error-message"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AgroforestryPredictionForm;