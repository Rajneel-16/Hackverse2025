import React, { useState, useEffect } from "react";
import './CarbonSequestrationForm.css';

const CarbonSequestrationForm = () => {
  const [data, setData] = useState({
    Tree_Species_Encoded: "",
    Age_Years: "",
    Biomass_kg: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFact, setActiveFact] = useState(0);

  const ecoFacts = [
    {
      title: "Forest Superpower",
      content: "1 acre of mature trees absorbs the CO₂ equivalent of driving 26,000 miles",
      icon: "🌲"
    },
    {
      title: "Carbon Champions",
      content: "The world's forests store about 400 gigatons of carbon",
      icon: "📊"
    },
    {
      title: "Age Matters",
      content: "Older trees absorb CO₂ at an accelerating rate as they mature",
      icon: "⏳"
    },
    {
      title: "Biomass Impact",
      content: "Every kg of tree biomass represents about 1.8kg of CO₂ absorbed",
      icon: "🌱"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFact((prev) => (prev + 1) % ecoFacts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const speciesCO2Details = {
    0: { 
      name: "Eucalyptus", 
      co2Fact: "Can absorb 5-10kg of CO₂ per year when mature",
      lifetimeCO2: "Absorbs ~1 ton of CO₂ over its lifetime"
    },
    1: { 
      name: "Oak", 
      co2Fact: "Mature oak can absorb up to 48lbs (22kg) of CO₂ per year",
      lifetimeCO2: "Stores ~5 tons of CO₂ over 200 years"
    },
    2: { 
      name: "Pine", 
      co2Fact: "Absorbs 10-15kg of CO₂ annually in optimal conditions",
      lifetimeCO2: "Sequesters ~2 tons of CO₂ over lifespan"
    },
    3: { 
      name: "Maple", 
      co2Fact: "Mature maple absorbs ~12kg of CO₂ per year",
      lifetimeCO2: "Stores ~3 tons of CO₂ over lifetime"
    },
    4: { 
      name: "Baobab", 
      co2Fact: "Can absorb over 100kg of CO₂ annually when mature",
      lifetimeCO2: "Stores 50+ tons of CO₂ over millennia"
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);
    
    try {
      if (!data.Tree_Species_Encoded || !data.Age_Years || !data.Biomass_kg) {
        throw new Error("Please fill in all fields!");
      }

      const formattedData = {
        Tree_Species_Encoded: parseInt(data.Tree_Species_Encoded, 10),
        Age_Years: parseInt(data.Age_Years, 10),
        Biomass_kg: parseFloat(data.Biomass_kg),
      };

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await fetch("http://127.0.0.1:5000/predict/carbon-sequestration", {
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

  return (
    <div className="carbon-app">
      <div className="background-overlay"></div>
      
      <div className="carbon-container">
        <div className="carbon-header">
          <h1>Carbon Sequestration Predictor</h1>
          <p>Calculate how much CO₂ your trees are absorbing</p>
        </div>

        <div className="carbon-content">
          <div className="carbon-facts">
            <div className="facts-carousel">
              {ecoFacts.map((fact, index) => (
                <div 
                  key={index}
                  className={`fact-card ${index === activeFact ? 'active' : ''}`}
                >
                  <div className="fact-icon">{fact.icon}</div>
                  <h3>{fact.title}</h3>
                  <p>{fact.content}</p>
                </div>
              ))}
            </div>
            <div className="carousel-dots">
              {ecoFacts.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === activeFact ? 'active' : ''}`}
                  onClick={() => setActiveFact(index)}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="carbon-form">
            <div className="form-group">
              <label>Tree Species</label>
              <select 
                name="Tree_Species_Encoded" 
                onChange={handleChange} 
                value={data.Tree_Species_Encoded}
                className="form-input"
                required
              >
                <option value="">Select Species</option>
                <option value="0">Eucalyptus</option>
                <option value="1">Oak</option>
                <option value="2">Pine</option>
                <option value="3">Maple</option>
                <option value="4">Baobab</option>
              </select>
            </div>

            <div className="form-group">
              <label>Age (Years)</label>
              <input
                type="number"
                name="Age_Years"
                placeholder="Enter tree age"
                onChange={handleChange}
                value={data.Age_Years}
                className="form-input"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Biomass (kg)</label>
              <input
                type="number"
                name="Biomass_kg"
                placeholder="Enter biomass"
                onChange={handleChange}
                value={data.Biomass_kg}
                className="form-input"
                step="0.1"
                min="0"
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                "Calculate CO₂ Absorption"
              )}
            </button>
          </form>
        </div>

        <div className={`carbon-result ${result ? 'show' : ''}`}>
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
                <h3>Carbon Sequestration Results</h3>
              </div>
              
              <div className="result-metrics">
                <div className="metric">
                  <span className="metric-label">Annual CO₂ Absorption</span>
                  <span className="metric-value">{result.co2_absorption} kg/year</span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Equivalent to</span>
                  <span className="metric-value">
                    {(result.co2_absorption / 0.404).toFixed(1)} miles driven
                    <div className="comparison-bar">
                      <div className="comparison-fill" style={{ width: `${Math.min(100, (result.co2_absorption / 20) * 100)}%` }}></div>
                    </div>
                  </span>
                </div>
              </div>

              <div className="co2-facts">
                <h4>🌳 {speciesCO2Details[data.Tree_Species_Encoded].name} CO₂ Facts</h4>
                <div className="co2-fact-item">
                  <span className="co2-fact-label">Annual Absorption:</span>
                  <span>{speciesCO2Details[data.Tree_Species_Encoded].co2Fact}</span>
                </div>
                <div className="co2-fact-item">
                  <span className="co2-fact-label">Lifetime Potential:</span>
                  <span>{speciesCO2Details[data.Tree_Species_Encoded].lifetimeCO2}</span>
                </div>
              </div>
              
              <div className="result-footer">
                <p>This {speciesCO2Details[data.Tree_Species_Encoded].name} is helping combat climate change!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarbonSequestrationForm;