import React, { useState } from "react";
import axios from "axios";
import "./DeforestrationRiskAssessment.css";

const DeforestationRiskAssessment = () => {
  const [coordinates, setCoordinates] = useState({ lat: "", lon: "" });
  const [scanData, setScanData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoordinates(prev => ({ ...prev, [name]: value }));
  };

  const simulateSatelliteScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    simulateSatelliteScan();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_URL}/predict/deforestation-risk-assessment`, {
        latitude: coordinates.lat,
        longitude: coordinates.lon,
      });

      setTimeout(() => {
        setScanData({
          temperature: response.data.temperature,
          rainfall: response.data.rainfall,
          vegetationIndex: response.data.ndvi,
          riskLevel: response.data.risk_level,
          confidence: response.data.confidence,
          lastScanDate: new Date().toLocaleDateString(),
          satellite: "Sentinel-2B"
        });
      }, 3500);

    } catch (error) {
      console.error("Error fetching satellite data:", error);
      setIsScanning(false);
    }
  };

  return (
    <div className="satellite-monitoring">
      <div className="satellite-container">
        <header className="satellite-header">
          <h1>Satellite Monitoring System</h1>
          <p>Real-time deforestation tracking from space</p>
        </header>

        <div className="satellite-grid">
          <div className="control-panel">
            <h2 className="panel-header">
              <span className="mr-2">🛰️</span> Satellite Control
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="input-group">
                <label>Latitude</label>
                <input
                  type="number"
                  name="lat"
                  step="any"
                  value={coordinates.lat}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g. 12.9716"
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Longitude</label>
                <input
                  type="number"
                  name="lon"
                  step="any"
                  value={coordinates.lon}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g. 77.5946"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isScanning}
                className={`scan-button ${
                  isScanning ? "bg-blue-800 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isScanning ? (
                  <>
                    <span className="mr-2">Scanning...</span>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  "Initiate Satellite Scan"
                )}
              </button>
            </form>

            {isScanning && (
              <div className="scan-progress">
                <div className="flex justify-between text-sm mb-1">
                  <span>Scan Progress</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="data-panel">
            <h2 className="panel-header">
              <span className="mr-2">📡</span> Scan Results
            </h2>
            
            {isScanning && !scanData ? (
              <div className="loading-animation">
                <div className="radar">
                  <div className="radar-ring radar-ring-1"></div>
                  <div className="radar-ring radar-ring-2"></div>
                </div>
                <p className="text-blue-300">Receiving satellite data...</p>
              </div>
            ) : scanData ? (
              <div className="space-y-4">
                <div className="data-grid">
                  <div className="data-card">
                    <p className="data-label">Temperature</p>
                    <p className="data-value">{scanData.temperature}°C</p>
                  </div>
                  <div className="data-card">
                    <p className="data-label">Rainfall</p>
                    <p className="data-value">{scanData.rainfall} mm</p>
                  </div>
                  <div className="data-card">
                    <p className="data-label">Vegetation Index</p>
                    <p className="data-value">{scanData.vegetationIndex}</p>
                  </div>
                  <div className="data-card">
                    <p className="data-label">Confidence</p>
                    <p className="data-value">{scanData.confidence}</p>
                  </div>
                </div>
                
                <div className={`risk-indicator ${
                  scanData.riskLevel === "High" 
                    ? "bg-red-900 bg-opacity-50 border-red-500" 
                    : "bg-green-900 bg-opacity-50 border-green-500"
                }`}>
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Deforestation Risk</p>
                    <span className={`risk-tag ${
                      scanData.riskLevel === "High" ? "bg-red-500" : "bg-green-500"
                    }`}>
                      {scanData.riskLevel}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400">
                  <p>Last Scan: {scanData.lastScanDate}</p>
                  <p>Satellite: {scanData.satellite}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>Scan coordinates to view satellite data</p>
              </div>
            )}
          </div>
        </div>

        {scanData && (
          <div className="visualization-panel">
            <h2 className="panel-header">
              <span className="mr-2">🌍</span> Area Visualization
            </h2>
            <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Satellite imagery visualization would appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeforestationRiskAssessment;