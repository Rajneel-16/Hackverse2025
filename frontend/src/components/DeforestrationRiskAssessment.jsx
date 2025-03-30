import React, { useState } from "react";
import axios from "axios";

const DeforestationRiskAssessment = () => {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_URL}/deforestation-risk`, {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      });
      setResult(response.data);
    } catch (err) {
      setError("An error occurred while fetching the risk assessment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-100 rounded-xl shadow-md">
      <h1 className="text-xl font-bold text-center mb-4">Deforestation Risk Assessment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Latitude:</label>
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Longitude:</label>
          <input
            type="text"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Loading..." : "Assess Risk"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {result && (
        <div className="mt-4 p-4 bg-white rounded shadow-md">
          <h2 className="text-lg font-bold">Assessment Result:</h2>
          {Object.entries(result).map(([key, value]) => (
            <p key={key}>
              <span className="font-medium">{key.replace(/_/g, " ")}:</span> {value}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeforestationRiskAssessment;