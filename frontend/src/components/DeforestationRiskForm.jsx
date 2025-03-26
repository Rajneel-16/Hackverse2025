import React, { useState } from "react";

const DeforestationRiskForm = () => {
  const [data, setData] = useState({
    Land_Use_Type: "",
    Rainfall_mm: "",
    Avg_Temperature_C: "",
    Human_Activity_Index: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    setResult(null); 
    try {
      if (!data.Land_Use_Type || !data.Rainfall_mm || !data.Avg_Temperature_C || !data.Human_Activity_Index) {
        alert("Please fill in all fields!");
        return;
      }

      const formattedData = {
        Land_Use_Type: parseInt(data.Land_Use_Type, 10),
        Rainfall_mm: parseFloat(data.Rainfall_mm),
        Avg_Temperature_C: parseFloat(data.Avg_Temperature_C),
        Human_Activity_Index: parseFloat(data.Human_Activity_Index),
      };

      const response = await fetch("http://127.0.0.1:5000/predict/deforestation-risk", {
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
    <div>
      <h1>Deforestation Risk Prediction</h1>
      <form onSubmit={handleSubmit}>
        <select name="Land_Use_Type" onChange={handleChange} value={data.Land_Use_Type}>
          <option value="">Select Land Use Type</option>
          <option value="0">Urban</option>
          <option value="1">Agriculture</option>
          <option value="2">Industrial</option>
        </select>
        <input
          type="number"
          name="Rainfall_mm"
          placeholder="Rainfall (mm)"
          onChange={handleChange}
          value={data.Rainfall_mm}
          step="0.1"
        />
        <input
          type="number"
          name="Avg_Temperature_C"
          placeholder="Average Temperature (°C)"
          onChange={handleChange}
          value={data.Avg_Temperature_C}
          step="0.1"
        />
        <input
          type="number"
          name="Human_Activity_Index"
          placeholder="Human Activity Index (0-1)"
          onChange={handleChange}
          value={data.Human_Activity_Index}
          step="0.01"
        />
        <button type="submit">Predict</button>
      </form>
      {result && <p>Predicted Forest Loss: {result.forest_loss}%</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};

export default DeforestationRiskForm;