import React, { useState } from "react";
import axios from "axios";
import "./LandSuitabilityForm.css";

const LandSuitabilityForm = () => {
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: ""
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapImage, setMapImage] = useState(null);

  const handleChange = (e) => {
    setCoordinates({
      ...coordinates,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setMapImage(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/predict/land-suitability",
        coordinates
      );

      setResult({
        suitability: response.data.predicted_suitability,
        temperature: response.data.obtained_temp,
        rainfall: response.data.obtained_rainfall,
        soilType: response.data.obtained_soil_type,
        treeCover: response.data.obtained_tree_cover,
        climateZone: response.data.climate_zone
      });

      // Generate a dynamic map visualization (mock)
      generateMapVisualization(
        coordinates.latitude,
        coordinates.longitude,
        response.data.predicted_suitability
      );
    } catch (error) {
      console.error("Error predicting land suitability:", error);
      alert("An error occurred while predicting land suitability.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateMapVisualization = (lat, lng, suitability) => {
    // This would be replaced with actual map API integration
    const suitabilityLevel = getSuitabilityLevel(suitability);
    setMapImage({
      url: `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=600x300&maptype=terrain&key=YOUR_API_KEY`,
      suitability: suitabilityLevel
    });
  };

  const getSuitabilityLevel = (score) => {
    if (score >= 80) return { level: "Excellent", color: "#4CAF50" };
    if (score >= 60) return { level: "Good", color: "#8BC34A" };
    if (score >= 40) return { level: "Moderate", color: "#FFC107" };
    if (score >= 20) return { level: "Poor", color: "#FF9800" };
    return { level: "Unsuitable", color: "#F44336" };
  };

  return (
    <div className="land-suitability-app">
      <div className="app-background"></div>
      
      <div className="suitability-container">
        <div className="suitability-header">
          <h1>Land Suitability Analyzer</h1>
          <p>Assess agricultural potential based on location data</p>
        </div>

        <div className="suitability-content">
          <form onSubmit={handleSubmit} className="suitability-form">
            <div className="form-group">
              <label>Coordinates</label>
              <div className="coordinate-inputs">
                <input
                  type="number"
                  name="latitude"
                  placeholder="Latitude"
                  value={coordinates.latitude}
                  onChange={handleChange}
                  step="any"
                  required
                />
                <input
                  type="number"
                  name="longitude"
                  placeholder="Longitude"
                  value={coordinates.longitude}
                  onChange={handleChange}
                  step="any"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                "Analyze Land"
              )}
            </button>
          </form>

          <div className="visualization-area">
            {mapImage ? (
              <div className="map-visualization">
                <div className="map-container">
                  <img 
                    src={mapImage.url} 
                    alt="Location map" 
                    className="map-image"
                  />
                  <div className="map-overlay">
                    <div className="suitability-indicator" 
                         style={{ backgroundColor: mapImage.suitability.color }}>
                      {mapImage.suitability.level}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="map-prompt">
                <p>Enter coordinates to visualize land suitability</p>
              </div>
            )}

            {result && (
              <div className="result-card">
                <div className="result-header">
                  <h3>Suitability Analysis</h3>
                  <div className="suitability-score" 
                       style={{ backgroundColor: getSuitabilityLevel(result.suitability).color }}>
                    {result.suitability}%
                  </div>
                </div>
                
                <div className="result-details">
                  <div className="detail-item">
                    <span className="detail-label">Climate Zone:</span>
                    <span className="detail-value">{result.climateZone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Avg Temperature:</span>
                    <span className="detail-value">{result.temperature}°C</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Rainfall:</span>
                    <span className="detail-value">{result.rainfall}mm</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Soil Type:</span>
                    <span className="detail-value">{result.soilType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tree Cover:</span>
                    <span className="detail-value">{result.treeCover}%</span>
                  </div>
                </div>

                <div className="recommendation">
                  <h4>Recommended Actions</h4>
                  <p>
                    {result.suitability >= 60
                      ? "This land is highly suitable for agriculture. Consider planting crops suitable for the climate zone."
                      : result.suitability >= 40
                      ? "This land has moderate suitability. Soil amendments and irrigation may improve productivity."
                      : "This land has limited suitability. Consider alternative uses or significant land improvement."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandSuitabilityForm;