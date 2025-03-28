import React, { useState, useEffect } from "react";
import './TreeSpeciesForm.css';

const TreeSpeciesForm = () => {
  // Enhanced Species Database with more species and regions
  const speciesDatabase = {
    // Mountainous species
    "Blue Spruce": {
      co2Absorption: 28.5,
      baseSurvivalRate: 0.85,
      tips: [
        "Plant in well-drained soil",
        "Space trees 5-6m apart",
        "Drought resistant once established",
        "Prefers pH 6.0-7.5"
      ],
      regions: ["Mountainous"],
      growthRate: 45,
      companionPlants: ["Ferns", "Rhododendrons", "Blueberries"],
      temperature: "Cool (10-20°C)",
      rainfall: "High (1000-2000mm)",
      soilType: "Loamy",
      elevation: "500-3000m",
      benefits: ["Erosion control", "Wildlife habitat", "Windbreak"]
    },
    "Douglas Fir": {
      co2Absorption: 32.1,
      baseSurvivalRate: 0.78,
      tips: [
        "Prefers acidic soil (pH 5-6)",
        "Needs full sunlight",
        "Susceptible to root rot in wet soils",
        "Plant in early spring"
      ],
      regions: ["Mountainous"],
      growthRate: 60,
      companionPlants: ["Salal", "Huckleberry", "Oregon Grape"],
      temperature: "Cool (5-18°C)",
      rainfall: "High (1200-2500mm)",
      soilType: "Loamy",
      elevation: "500-2500m",
      benefits: ["Timber production", "Carbon sequestration", "Wildlife shelter"]
    },
    "Alpine Larch": {
      co2Absorption: 25.8,
      baseSurvivalRate: 0.82,
      tips: [
        "Cold-hardy species",
        "Tolerates poor soil",
        "Avoid urban pollution",
        "Needs good drainage"
      ],
      regions: ["Mountainous"],
      growthRate: 30,
      companionPlants: ["Bearberry", "Lingonberry", "Alpine Azalea"],
      temperature: "Cold (0-15°C)",
      rainfall: "Moderate (800-1500mm)",
      soilType: "Rocky",
      elevation: "1000-3000m",
      benefits: ["Soil stabilization", "Alpine ecosystem support", "Winter hardy"]
    },

    // Tropical species
    "Teak": {
      co2Absorption: 42.7,
      baseSurvivalRate: 0.88,
      tips: [
        "Requires full sunlight",
        "Needs 1,500-2,000mm annual rainfall",
        "Grows best in sandy loam soils",
        "Resistant to termites"
      ],
      regions: ["Tropical"],
      growthRate: 120,
      companionPlants: ["Turmeric", "Ginger", "Cardamom"],
      temperature: "Warm (25-35°C)",
      rainfall: "Very High (2000-4000mm)",
      soilType: "Clay",
      elevation: "0-1000m",
      benefits: ["High-quality timber", "Soil improvement", "Durable wood"]
    },
    "Mahogany": {
      co2Absorption: 38.2,
      baseSurvivalRate: 0.82,
      tips: [
        "Thrives in 25-35°C temperatures",
        "Plant at beginning of rainy season",
        "Monitor for shoot borers",
        "Deep taproot makes it drought resistant"
      ],
      regions: ["Tropical"],
      growthRate: 110,
      companionPlants: ["Coffee", "Cacao", "Vanilla"],
      temperature: "Warm (22-30°C)",
      rainfall: "High (1500-3000mm)",
      soilType: "Loamy",
      elevation: "0-800m",
      benefits: ["Premium timber", "Biodiversity support", "Long lifespan"]
    },
    "Rain Tree": {
      co2Absorption: 36.5,
      baseSurvivalRate: 0.85,
      tips: [
        "Fast-growing shade tree",
        "Tolerates various soil types",
        "Nitrogen-fixing properties",
        "Excellent for agroforestry"
      ],
      regions: ["Tropical"],
      growthRate: 130,
      companionPlants: ["Pepper", "Cinnamon", "Nutmeg"],
      temperature: "Warm (20-30°C)",
      rainfall: "High (1500-3500mm)",
      soilType: "Various",
      elevation: "0-1200m",
      benefits: ["Shade provider", "Soil enrichment", "Livestock fodder"]
    },

    // Arid species
    "Acacia": {
      co2Absorption: 29.8,
      baseSurvivalRate: 0.91,
      tips: [
        "Extremely drought tolerant",
        "Fixes nitrogen in soil",
        "Thorns protect from herbivores",
        "Grows in poor soils"
      ],
      regions: ["Arid"],
      growthRate: 40,
      companionPlants: ["Agave", "Prickly Pear", "Desert Marigold"],
      temperature: "Hot (30-45°C)",
      rainfall: "Low (<500mm)",
      soilType: "Sandy",
      elevation: "0-500m",
      benefits: ["Desertification control", "Livestock fodder", "Soil improvement"]
    },
    "Date Palm": {
      co2Absorption: 31.5,
      baseSurvivalRate: 0.85,
      tips: [
        "Needs hot summers",
        "Tolerates saline soil",
        "Requires deep watering",
        "Produces fruit in 4-8 years"
      ],
      regions: ["Arid"],
      growthRate: 35,
      companionPlants: ["Olive", "Pomegranate", "Fig"],
      temperature: "Hot (25-40°C)",
      rainfall: "Very Low (<300mm)",
      soilType: "Sandy",
      elevation: "0-300m",
      benefits: ["Food production", "Shade provider", "Oasis ecosystem"]
    },
    "Mesquite": {
      co2Absorption: 27.3,
      baseSurvivalRate: 0.87,
      tips: [
        "Deep-rooted drought survivor",
        "Fixates nitrogen",
        "Provides excellent firewood",
        "Tolerates alkaline soils"
      ],
      regions: ["Arid"],
      growthRate: 45,
      companionPlants: ["Jojoba", "Yucca", "Desert Willow"],
      temperature: "Hot (20-40°C)",
      rainfall: "Low (200-500mm)",
      soilType: "Sandy",
      elevation: "0-1500m",
      benefits: ["Erosion control", "Livestock forage", "Carbon sequestration"]
    },

    // Temperate species
    "Oak": {
      co2Absorption: 34.2,
      baseSurvivalRate: 0.80,
      tips: [
        "Slow-growing but long-lived",
        "Provides excellent wildlife habitat",
        "Tolerates various soil types",
        "Plant in fall or early spring"
      ],
      regions: ["Temperate"],
      growthRate: 50,
      companionPlants: ["Hazel", "Hawthorn", "Wild Cherry"],
      temperature: "Moderate (10-25°C)",
      rainfall: "Moderate (600-1500mm)",
      soilType: "Loamy",
      elevation: "0-2000m",
      benefits: ["Biodiversity hotspot", "Durable timber", "Carbon storage"]
    },
    "Maple": {
      co2Absorption: 28.7,
      baseSurvivalRate: 0.83,
      tips: [
        "Beautiful fall colors",
        "Tolerates urban pollution",
        "Prefers slightly acidic soil",
        "Good for syrup production"
      ],
      regions: ["Temperate"],
      growthRate: 55,
      companionPlants: ["Dogwood", "Serviceberry", "Witch Hazel"],
      temperature: "Moderate (5-25°C)",
      rainfall: "Moderate (700-1200mm)",
      soilType: "Loamy",
      elevation: "0-1500m",
      benefits: ["Ornamental value", "Syrup production", "Urban adaptation"]
    },
    "Beech": {
      co2Absorption: 30.1,
      baseSurvivalRate: 0.78,
      tips: [
        "Prefers well-drained soil",
        "Excellent shade tree",
        "Slow to establish",
        "Beautiful smooth bark"
      ],
      regions: ["Temperate"],
      growthRate: 40,
      companionPlants: ["Holly", "Yew", "Hornbeam"],
      temperature: "Cool (5-20°C)",
      rainfall: "Moderate (800-1600mm)",
      soilType: "Loamy",
      elevation: "0-1800m",
      benefits: ["Wildlife food source", "Quality timber", "Long lifespan"]
    },

    // Boreal species
    "Black Spruce": {
      co2Absorption: 24.7,
      baseSurvivalRate: 0.89,
      tips: [
        "Cold climate specialist",
        "Wet soil tolerant",
        "Slow growth",
        "Important for paper production"
      ],
      regions: ["Boreal"],
      growthRate: 25,
      companionPlants: ["Blueberry", "Lingonberry", "Labrador Tea"],
      temperature: "Cold (-10 to 15°C)",
      rainfall: "Moderate (400-1000mm)",
      soilType: "Peaty",
      elevation: "300-1000m",
      benefits: ["Bog ecosystem support", "Wildlife habitat", "Cold adaptation"]
    },
    "Tamarack": {
      co2Absorption: 26.2,
      baseSurvivalRate: 0.84,
      tips: [
        "Deciduous conifer",
        "Tolerates wet conditions",
        "Beautiful golden fall color",
        "Good for wetland restoration"
      ],
      regions: ["Boreal"],
      growthRate: 30,
      companionPlants: ["Bog Rosemary", "Leatherleaf", "Cotton Grass"],
      temperature: "Cold (-15 to 20°C)",
      rainfall: "Moderate (500-900mm)",
      soilType: "Peaty",
      elevation: "200-800m",
      benefits: ["Wetland stabilization", "Seasonal interest", "Wildlife support"]
    }
  };

  // Region characteristics
  const regionCharacteristics = {
    "Mountainous": {
      description: "High elevation regions with cool temperatures and variable rainfall",
      challenges: ["Steep slopes", "Thin soils", "Temperature extremes"]
    },
    "Tropical": {
      description: "Warm, humid regions near the equator with abundant rainfall",
      challenges: ["Pests/diseases", "Soil leaching", "Deforestation pressure"]
    },
    "Arid": {
      description: "Dry regions with limited rainfall and high temperatures",
      challenges: ["Water scarcity", "Soil salinity", "Extreme heat"]
    },
    "Temperate": {
      description: "Moderate climate regions with distinct seasons",
      challenges: ["Urbanization", "Invasive species", "Climate variability"]
    },
    "Boreal": {
      description: "Northern forests with long winters and short growing seasons",
      challenges: ["Permafrost", "Low decomposition", "Climate change impacts"]
    }
  };

  const analyzeLocation = (locationName, region) => {
    const keywords = {
      mountain: ["himalaya", "alps", "rocky", "andes", "peak", "ridge", "summit"],
      dry: ["sahara", "gobi", "desert", "arid", "dune", "wasteland"],
      coastal: ["beach", "coast", "island", "peninsula", "shore", "bay"],
      urban: ["city", "town", "metro", "urban", "suburb"],
      river: ["river", "creek", "delta", "floodplain", "valley"]
    };

    let adjustments = {
      microclimate: "Standard",
      specialNotes: [],
      survivalBonus: 0,
      waterAvailability: "Normal",
      soilCondition: "Typical"
    };
    
    // Elevation effects
    if (keywords.mountain.some(k => locationName.toLowerCase().includes(k))) {
      adjustments.microclimate = "Mountain";
      adjustments.specialNotes.push("High elevation adaptation (+5% survival)");
      adjustments.survivalBonus += 0.05;
      adjustments.waterAvailability = "Variable (glacial/snowmelt)";
    } 
    // Arid conditions
    else if (keywords.dry.some(k => locationName.toLowerCase().includes(k))) {
      adjustments.microclimate = "Arid";
      adjustments.specialNotes.push("Low water availability (-3% survival)");
      adjustments.survivalBonus -= 0.03;
      adjustments.waterAvailability = "Low";
      adjustments.soilCondition = "Dry/Sandy";
    }
    // Coastal effects
    else if (keywords.coastal.some(k => locationName.toLowerCase().includes(k))) {
      adjustments.microclimate = "Coastal";
      adjustments.specialNotes.push("Salt spray tolerance considered");
      adjustments.soilCondition = "Sandy/Saline";
    }
    // Urban effects
    else if (keywords.urban.some(k => locationName.toLowerCase().includes(k))) {
      adjustments.microclimate = "Urban";
      adjustments.specialNotes.push("Urban heat island effect (-7% survival)");
      adjustments.survivalBonus -= 0.07;
      adjustments.soilCondition = "Compacted/Disturbed";
    }
    // Riverine effects
    else if (keywords.river.some(k => locationName.toLowerCase().includes(k))) {
      adjustments.microclimate = "Riparian";
      adjustments.specialNotes.push("Periodic flooding adaptation (+3% survival)");
      adjustments.survivalBonus += 0.03;
      adjustments.waterAvailability = "Abundant";
      adjustments.soilCondition = "Alluvial";
    }

    return adjustments;
  };

  const [data, setData] = useState({ 
    region: "",
    locationName: "",
    selectedSpecies: ""
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suitableSpecies, setSuitableSpecies] = useState([]);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const speciesForRegion = Object.keys(speciesDatabase).filter(
      species => speciesDatabase[species].regions.includes(data.region)
    );
    setSuitableSpecies(speciesForRegion);
    handleGenerateResult();
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    
    if (e.target.name === "region") {
      const speciesForRegion = Object.keys(speciesDatabase).filter(
        species => speciesDatabase[species].regions.includes(e.target.value)
      );
      setSuitableSpecies(speciesForRegion);
      setData(prev => ({ ...prev, selectedSpecies: speciesForRegion[0] || "" }));
      setResult(null);
    }
  };

  const handleGenerateResult = () => {
    if (!data.region || !data.locationName || !data.selectedSpecies) return;
    
    const speciesInfo = speciesDatabase[data.selectedSpecies];
    const locationAnalysis = analyzeLocation(data.locationName, data.region);
    
    const survivalRate = Math.min(0.95, 
      Math.max(0.6, speciesInfo.baseSurvivalRate + (locationAnalysis.survivalBonus || 0))
    );
    
    setResult({
      species: data.selectedSpecies,
      location: data.locationName,
      region: data.region,
      co2Absorption: speciesInfo.co2Absorption,
      survivalProbability: survivalRate,
      tips: speciesInfo.tips,
      growthRate: speciesInfo.growthRate,
      waterNeeds: speciesInfo.waterNeeds,
      temperature: speciesInfo.temperature,
      rainfall: speciesInfo.rainfall,
      soilType: speciesInfo.soilType,
      elevation: speciesInfo.elevation,
      benefits: speciesInfo.benefits,
      compatiblePlants: speciesInfo.companionPlants,
      locationAnalysis,
      regionInfo: regionCharacteristics[data.region]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      handleGenerateResult();
    } catch (err) {
      setError("Analysis failed. Please try again.");
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
          setTimeout(() => {
            setVisibleBubbles([]);
            setCurrentIndex(0);
          }, 2500);
        }
      }, 3000);

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
              animation: `floatUp 0.8s ease-out forwards`
            }}
          >
            <span className="bubble-emoji">{bubble.emoji}</span>
            <p>{bubble.content}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="background-overlay"></div>
      <TreeInfoBubbles />
      
      <div className="form-container">
        <div className="heading">
          <h1>Tree Species Advisor</h1>
          <p>Optimal tree recommendations based on location and environmental factors</p>
        </div>
        
        <div className="user-input">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Location Name</label>
              <input
                type="text"
                name="locationName"
                onChange={handleChange}
                value={data.locationName}
                placeholder="e.g. Himalayan Foothills, Coastal California"
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Region Type</label>
              <select 
                name="region" 
                onChange={handleChange} 
                value={data.region} 
                className="form-input"
                required
              >
                <option value="">Select Region Type</option> {/* Added this line */}
                <option value="Mountainous">Mountainous</option>
                <option value="Tropical">Tropical</option>
                <option value="Arid">Arid</option>
                <option value="Temperate">Temperate</option>
                <option value="Boreal">Boreal</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Recommended Species</label>
              <select
                name="selectedSpecies"
                onChange={handleChange}
                value={data.selectedSpecies}
                className="form-input"
                disabled={!data.region} // Disabled when no region selected
                required
              >
                <option value="">{data.region ? "Select Species" : "First select region type"}</option>
                {suitableSpecies.map(species => (
                  <option key={species} value={species}>{species}</option>
                ))}
              </select>
              {data.region && (
                <p className="info-text">
                  Showing {suitableSpecies.length} species suitable for {data.region.toLowerCase()} regions
                </p>
              )}
            </div>
            
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                "Analyze Species Performance"
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
                <h3>Analysis for {result.location}</h3>
              </div>
              
              <div className="tabs">
                <button 
                  className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
                <button 
                  className={`tab-button ${activeTab === 'environment' ? 'active' : ''}`}
                  onClick={() => setActiveTab('environment')}
                >
                  Environment
                </button>
                <button 
                  className={`tab-button ${activeTab === 'companions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('companions')}
                >
                  Companion Plants
                </button>
              </div>
              
              {activeTab === 'details' && (
                <div className="tab-content active">
                  <div className="species-highlight">
                    <span className="species-name">{result.species}</span>
                    <span className="species-region">{result.region} Region</span>
                  </div>
                  
                  <div className="result-metrics">
                    <div className="metric">
                      <span className="metric-label">CO₂ Absorption</span>
                      <span className="metric-value">{result.co2Absorption.toFixed(1)} kg/year</span>
                    </div>
                    
                    <div className="metric">
                      <span className="metric-label">Growth Rate</span>
                      <span className="metric-value">{result.growthRate} cm/year</span>
                    </div>
                    
                    <div className="metric">
                      <span className="metric-label">Survival Probability</span>
                      <span className="metric-value">
                        {(result.survivalProbability * 100).toFixed(1)}%
                        <div className="probability-bar">
                          <div 
                            className="probability-fill" 
                            style={{ width: `${result.survivalProbability * 100}%` }}
                          ></div>
                        </div>
                      </span>
                    </div>
                  </div>
                  
                  <div className="species-tips">
                    <h4>🌿 Growing Tips:</h4>
                    <ul>
                      {result.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {activeTab === 'environment' && (
                <div className="tab-content active">
                  <div className="environment-section">
                    <h4>Environmental Conditions</h4>
                    <div className="environment-grid">
                      <div className="environment-card">
                        <span className="env-icon">🌡️</span>
                        <div>
                          <p className="env-label">Temperature</p>
                          <p className="env-value">{result.temperature}</p>
                        </div>
                      </div>
                      <div className="environment-card">
                        <span className="env-icon">💧</span>
                        <div>
                          <p className="env-label">Rainfall</p>
                          <p className="env-value">{result.rainfall}</p>
                        </div>
                      </div>
                      <div className="environment-card">
                        <span className="env-icon">🌱</span>
                        <div>
                          <p className="env-label">Soil Type</p>
                          <p className="env-value">{result.soilType}</p>
                        </div>
                      </div>
                      <div className="environment-card">
                        <span className="env-icon">⛰️</span>
                        <div>
                          <p className="env-label">Elevation</p>
                          <p className="env-value">{result.elevation}</p>
                        </div>
                      </div>
                    </div>
                    
                    {result.locationAnalysis.specialNotes.length > 0 && (
                      <div className="location-notes">
                        <h5>Location Insights</h5>
                        <ul>
                          {result.locationAnalysis.specialNotes.map((note, i) => (
                            <li key={i}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="ecological-benefits">
                      <h4>Ecological Benefits</h4>
                      <ul>
                        {result.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'companions' && (
                <div className="tab-content active">
                  <div className="companion-plants-section">
                    <h4>Compatible Companion Plants</h4>
                    <p className="companion-subtitle">These plants grow well with {result.species}:</p>
                    
                    <div className="companion-plants-grid">
                      {result.compatiblePlants.map((plant, index) => (
                        <div key={index} className="companion-plant-card">
                          <div className="plant-check">✔</div>
                          <div className="plant-name">{plant}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="companion-benefits">
                      <div className="benefit-tip">
                        <span className="tip-icon">💡</span>
                        <p>Planting companions increases biodiversity and improves ecosystem health.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="result-footer">
                <p>Recommendation generated for {result.location} ({result.region} region)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreeSpeciesForm;