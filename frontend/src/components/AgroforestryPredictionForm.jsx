import React, { useState } from "react";

const AgroforestryPredictionForm = () => {
  const [data, setData] = useState({
    pH: "",
    Moisture_Level: "",
    CO2_Absorption: "",
    Growth_Rate: "",
    Shade_Tolerance_Tree: "",
    Shade_Tolerance_Crop: "",
    Water_Requirement: "",
    Yield: "",
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
      if (Object.values(data).some((value) => value === "")) {
        alert("Please fill in all fields!");
        return;
      }

      const formattedData = {
        pH: parseFloat(data.pH),
        Moisture_Level: parseFloat(data.Moisture_Level),
        CO2_Absorption: parseFloat(data.CO2_Absorption),
        Growth_Rate: parseFloat(data.Growth_Rate),
        Shade_Tolerance_Tree: parseFloat(data.Shade_Tolerance_Tree),
        Shade_Tolerance_Crop: parseFloat(data.Shade_Tolerance_Crop),
        Water_Requirement: parseFloat(data.Water_Requirement),
        Yield: parseFloat(data.Yield),
      };

      const response = await fetch("http://127.0.0.1:5000/predict/agroforestry", {
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
      <h1>Agroforestry Prediction</h1>
      <form onSubmit={handleSubmit}>
        <input type="number" name="pH" placeholder="pH" onChange={handleChange} value={data.pH} step="0.1" />
        <input type="number" name="Moisture_Level" placeholder="Moisture Level" onChange={handleChange} value={data.Moisture_Level} step="0.1" />
        <input type="number" name="CO2_Absorption" placeholder="CO2 Absorption" onChange={handleChange} value={data.CO2_Absorption} step="0.1" />
        <input type="number" name="Growth_Rate" placeholder="Growth Rate" onChange={handleChange} value={data.Growth_Rate} step="0.1" />
        <input type="number" name="Shade_Tolerance_Tree" placeholder="Shade Tolerance (Tree)" onChange={handleChange} value={data.Shade_Tolerance_Tree} step="0.1" />
        <input type="number" name="Shade_Tolerance_Crop" placeholder="Shade Tolerance (Crop)" onChange={handleChange} value={data.Shade_Tolerance_Crop} step="0.1" />
        <input type="number" name="Water_Requirement" placeholder="Water Requirement" onChange={handleChange} value={data.Water_Requirement} step="0.1" />
        <input type="number" name="Yield" placeholder="Yield" onChange={handleChange} value={data.Yield} step="0.1" />
        <button type="submit">Predict</button>
      </form>
      {result && (
        <div>
          <p>Predicted Best Tree: {result.best_tree}</p>
          <p>Predicted Best Crop: {result.best_crop}</p>
        </div>
      )}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};

export default AgroforestryPredictionForm;