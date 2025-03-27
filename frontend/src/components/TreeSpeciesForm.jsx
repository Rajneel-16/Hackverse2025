import React, { useState } from "react";
import './TreeSpeciesForm.css';

const TreeSpeciesForm = () => {
  const [data, setData] = useState({ species: "", region: "", growth_rate: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    setResult(null); // Reset result state
    try {
      if (!data.species || !data.region || !data.growth_rate) {
        alert("Please fill in all fields!");
        return;
      }

      const formattedData = {
        species: data.species.trim(),
        region: data.region.trim(),
        growth_rate: parseFloat(data.growth_rate),
      };

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
    }
  };

  return (
    <div className="main-div">
      <div className="heading"><h1>Tree Species Survival Prediction</h1></div>
      <div className="user-input">
        <form onSubmit={handleSubmit}>
          <select name="species" onChange={handleChange} value={data.species}>
            <option value="">Select Species</option>
            <option value="Teak">Teak</option>
            <option value="Oak">Oak</option>
            <option value="Mahogany">Mahogany</option>
            <option value="Bamboo">Bamboo</option>
          </select>
          <select name="region" onChange={handleChange} value={data.region}>
            <option value="">Select Region</option>
            <option value="Mountainous">Mountainous</option>
            <option value="Tropical">Tropical</option>
            <option value="Arid">Arid</option>
          </select>
          <input
            type="number"
            name="growth_rate"
            onChange={handleChange}
            placeholder="Growth Rate"
            value={data.growth_rate}
            step="0.1"
          />
          <button type="submit">Predict</button>
        </form>
      </div>
      <div className="model-output">
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {result && (
          <div>
            <p>CO2 Absorption: {result.co2_absorption.toFixed(2)}</p>
            <p>Survival Probability: {result.survival_probability.toFixed(3)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeSpeciesForm;