import React, { useState } from "react";

const TreeSpeciesForm = () => {
  const [data, setData] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/predict/tree-species", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    setResult(result);
  };

  return (
    <div>
      <h1>Tree Species Survival Prediction</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="species" onChange={handleChange} placeholder="Species" />
        <input type="text" name="region" onChange={handleChange} placeholder="Region" />
        <input type="number" name="growth_rate" onChange={handleChange} placeholder="Growth Rate" />
        <button type="submit">Predict</button>
      </form>
      {result && (
        <div>
          <p>CO2 Absorption: {result.co2_absorption}</p>
          <p>Survival Probability: {result.survival_probability}</p>
        </div>
      )}
    </div>
  );
};

export default TreeSpeciesForm;