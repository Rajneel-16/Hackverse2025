import React, { useState } from "react";

const DeforestationRiskForm = () => {
  const [data, setData] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/predict/deforestation-risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    setResult(result);
  };

  return (
    <div>
      <h1>Deforestation Risk Prediction</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="Land_Use_Type" onChange={handleChange} placeholder="Land Use Type" />
        <input type="number" name="Rainfall_mm" onChange={handleChange} placeholder="Rainfall (mm)" />
        <input type="number" name="Avg_Temperature_C" onChange={handleChange} placeholder="Average Temperature (°C)" />
        <input type="number" name="Human_Activity_Index" onChange={handleChange} placeholder="Human Activity Index" />
        <button type="submit">Predict</button>
      </form>
      {result && <p>Forest Loss: {result.forest_loss}%</p>}
    </div>
  );
};

export default DeforestationRiskForm;