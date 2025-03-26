import React, { useState } from "react";
import axios from "axios";

const LandSuitabilityForm = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [soilType, setSoilType] = useState("");
  const [treeCover, setTreeCover] = useState("");
  const [predictedSuitability, setPredictedSuitability] = useState(null);
  const [weatherResponse, setWeatherResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/predict/land-suitability", {
        latitude,
        longitude,
        soil_type: soilType,
        tree_cover: treeCover,
      });

      setPredictedSuitability(response.data.predicted_suitability);
      console.log(response.data.obtained_temp);
      console.log(response.data.obtained_rainfall);
      setWeatherResponse(response.data.weather_response);
    } catch (error) {
      console.error("Error predicting land suitability:", error);
      alert("An error occurred while predicting land suitability.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Land Suitability Prediction</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Latitude:</label>
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Longitude:</label>
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Soil Type:</label>
          <select
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Soil Type</option>
            <option value="0">Peaty</option>
            <option value="1">Loamy</option>
            <option value="2">Silty</option>
            <option value="3">Sandy</option>
            <option value="4">Clay</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tree Cover (%):</label>
          <input
            type="number"
            step="any"
            value={treeCover}
            onChange={(e) => setTreeCover(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
        >
          Predict Suitability
        </button>
      </form>

      {weatherResponse && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Weather API Response</h2>
          <p>Weather API response successfully received.</p>
          <p>Received Avg Temperature: {weatherResponse.avg_temp}°C</p>
          <p>Received Rainfall (Humidity): {weatherResponse.rainfall}%</p>
        </div>
      )}

      {predictedSuitability !== null && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Predicted Suitability Score</h2>
          <p>{predictedSuitability}</p>
          <p>{predictedSuitability["obtained_rainfall"]}</p>
        </div>
      )}
    </div>
  );
};

export default LandSuitabilityForm;