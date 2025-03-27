import React, { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './DeforestationRiskForm.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DeforestationRiskForm = () => {
  const [data, setData] = useState({
    Land_Use_Type: "",
    Rainfall_mm: "",
    Avg_Temperature_C: "",
    Human_Activity_Index: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapDegradation, setMapDegradation] = useState(0); // Corrected this line
  const [chartData, setChartData] = useState(null);
  const [forestHealth, setForestHealth] = useState(100);

  const landUseTypes = [
    { value: 0, label: "Urban", color: "#8B4513", icon: "🏙️", riskWeight: 0.7 },
    { value: 1, label: "Agriculture", color: "#FFD700", icon: "🌾", riskWeight: 0.5 },
    { value: 2, label: "Industrial", color: "#A9A9A9", icon: "🏭", riskWeight: 0.9 }
  ];

  useEffect(() => {
    if (result) {
      const newForestHealth = 100 - result.forest_loss;
      setForestHealth(newForestHealth);

      const targetDegradation = result.forest_loss;
      const duration = 2000;
      const steps = 50;
      const increment = targetDegradation / steps;
      
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetDegradation) {
          current = targetDegradation;
          clearInterval(timer);
        }
        setMapDegradation(current);
      }, duration / steps);

      prepareChartData();
      return () => clearInterval(timer);
    }
  }, [result]);

  const prepareChartData = () => {
    const selectedLandUse = landUseTypes.find(type => type.value.toString() === data.Land_Use_Type);
    
    const newChartData = {
      labels: [...landUseTypes.map(type => type.label), 'Rainfall', 'Temperature', 'Human Activity'],
      datasets: [{
        label: 'Normalized Risk Factors',
        data: [
          ...landUseTypes.map(type => 
            type.label === selectedLandUse?.label ? result.forest_loss/100 : Math.random() * 0.3
          ),
          data.Rainfall_mm/1000,
          data.Avg_Temperature_C/50,
          data.Human_Activity_Index
        ],
        backgroundColor: [
          ...landUseTypes.map(type => 
            type.label === selectedLandUse?.label ? '#ff6384' : type.color
          ),
          '#36a2eb',
          '#ffce56',
          '#4bc0c0'
        ],
        borderColor: [
          ...landUseTypes.map(type => 
            type.label === selectedLandUse?.label ? '#c2185b' : '#333'
          ),
          '#0d47a1',
          '#ff8f00',
          '#00897b'
        ],
        borderWidth: 1
      }]
    };

    setChartData(newChartData);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Deforestation Risk Factors',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += Math.round(context.parsed.y * 100) + '%';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          callback: function(value) {
            return (value * 100) + '%';
          }
        }
      }
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
    setMapDegradation(0);
    setChartData(null);
    
    try {
      if (!data.Land_Use_Type || !data.Rainfall_mm || !data.Avg_Temperature_C || !data.Human_Activity_Index) {
        throw new Error("Please fill in all fields!");
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockRiskCalculation = () => {
        const selectedLandUse = landUseTypes.find(type => type.value.toString() === data.Land_Use_Type);
        const baseRisk = selectedLandUse ? selectedLandUse.riskWeight * 40 : 20;
        const tempRisk = data.Avg_Temperature_C > 28 ? 20 : 10;
        const activityRisk = data.Human_Activity_Index * 30;
        const rainfallModifier = data.Rainfall_mm < 100 ? 10 : -5;
        
        return Math.min(baseRisk + tempRisk + activityRisk + rainfallModifier, 100);
      };

      const mockResult = {
        forest_loss: mockRiskCalculation(),
        timestamp: new Date().toISOString()
      };

      setResult(mockResult);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevel = (percentage) => {
    if (percentage < 20) return { level: "Low", color: "#4CAF50" };
    if (percentage < 50) return { level: "Moderate", color: "#FFC107" };
    if (percentage < 80) return { level: "High", color: "#FF9800" };
    return { level: "Critical", color: "#F44336" };
  };

  const selectedLandUse = landUseTypes.find(type => type.value.toString() === data.Land_Use_Type);

  return (
    <div className="deforestation-app">
      <div className="background-overlay"></div>
      
      <div className="deforestation-container">
        <div className="deforestation-header">
          <h1>Deforestation Risk Assessment</h1>
          <p>Predict forest loss based on environmental and human factors</p>
        </div>

        <div className="deforestation-content">
          <form onSubmit={handleSubmit} className="deforestation-form">
            <div className="form-group">
              <label>Land Use Type</label>
              <div className="land-use-options">
                {landUseTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`land-use-option ${data.Land_Use_Type === type.value.toString() ? 'active' : ''}`}
                    onClick={() => setData({...data, Land_Use_Type: type.value.toString()})}
                    style={{ borderColor: type.color }}
                  >
                    <span className="land-use-icon">{type.icon}</span>
                    {type.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Rainfall (mm/year)</label>
              <input
                type="number"
                name="Rainfall_mm"
                placeholder="Enter annual rainfall"
                onChange={handleChange}
                value={data.Rainfall_mm}
                className="form-input"
                step="0.1"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Average Temperature (°C)</label>
              <input
                type="number"
                name="Avg_Temperature_C"
                placeholder="Enter average temperature"
                onChange={handleChange}
                value={data.Avg_Temperature_C}
                className="form-input"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label>Human Activity Index (0-1)</label>
              <div className="slider-container">
                <input
                  type="range"
                  name="Human_Activity_Index"
                  min="0"
                  max="1"
                  step="0.01"
                  onChange={handleChange}
                  value={data.Human_Activity_Index}
                  className="slider-input"
                  required
                />
                <span className="slider-value">{data.Human_Activity_Index || 0}</span>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                "Assess Risk"
              )}
            </button>
          </form>

          <div className="visualization-area">
            <div className="forest-visualization">
              <div 
                className="forest-cover-box"
                style={{
                  backgroundColor: `hsl(${forestHealth * 0.4}, 80%, 40%)`,
                  opacity: forestHealth / 100,
                  transform: `scale(${0.7 + (forestHealth / 100 * 0.3)})`,
                  filter: `brightness(${0.7 + (forestHealth / 100 * 0.3)})`
                }}
              >
                <div className="tree-pattern"></div>
              </div>
              <div className="risk-label">
                {result ? `Forest Health: ${forestHealth}%` : "Submit to assess forest health"}
              </div>
            </div>

            {chartData && (
              <div className="risk-chart-container">
                <Bar 
                  data={chartData} 
                  options={chartOptions} 
                  className="risk-chart"
                />
              </div>
            )}
          </div>
        </div>

        <div className={`deforestation-result ${result ? 'show' : ''}`}>
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
                <h3>Risk Assessment Results</h3>
              </div>
              
              <div className="result-metrics">
                <div className="metric">
                  <span className="metric-label">Predicted Forest Loss</span>
                  <span 
                    className="metric-value"
                    style={{ color: getRiskLevel(result.forest_loss).color }}
                  >
                    {result.forest_loss}%
                  </span>
                </div>
                
                <div className="risk-level">
                  <span className="risk-label">Risk Level:</span>
                  <span 
                    className="risk-value"
                    style={{ 
                      backgroundColor: getRiskLevel(result.forest_loss).color,
                      boxShadow: `0 0 10px ${getRiskLevel(result.forest_loss).color}`
                    }}
                  >
                    {getRiskLevel(result.forest_loss).level}
                  </span>
                </div>
              </div>

              <div className="key-factors">
                <h4>Key Contributing Factors</h4>
                <div className="factor">
                  <span className="factor-label">Land Use:</span>
                  <span className="factor-value">
                    {selectedLandUse?.icon} {selectedLandUse?.label}
                  </span>
                </div>
                <div className="factor">
                  <span className="factor-label">Human Activity:</span>
                  <span className="factor-value">
                    {Math.round(data.Human_Activity_Index * 100)}/100
                  </span>
                </div>
              </div>
              
              <div className="result-footer">
                <p>Consider conservation strategies for {selectedLandUse?.label.toLowerCase()} areas</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeforestationRiskForm;