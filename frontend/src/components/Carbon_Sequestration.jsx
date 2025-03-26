import React, { useState } from "react";

const CarbonSequestrationForm = () => {
  const [data, setData] = useState({
    Tree_Species_Encoded: "",
    Age_Years: "",
    Biomass_kg: "",
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
      if (!data.Tree_Species_Encoded || !data.Age_Years || !data.Biomass_kg) {
        alert("Please fill in all fields!");
        return;
      }

      const formattedData = {
        Tree_Species_Encoded: parseInt(data.Tree_Species_Encoded, 10),
        Age_Years: parseInt(data.Age_Years, 10),
        Biomass_kg: parseFloat(data.Biomass_kg),
      };

      const response = await fetch("http://127.0.0.1:5000/predict/carbon-sequestration", {
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
      <h1>Carbon Sequestration Prediction</h1>
      <form onSubmit={handleSubmit}>
        <select name="Tree_Species_Encoded" onChange={handleChange} value={data.Tree_Species_Encoded}>
          <option value="">Select Tree Species</option>
          <option value="0">Eucalyptus</option>
          <option value="1">Oak</option>
          <option value="2">Pine</option>
          <option value="3">Maple</option>
          <option value="4">Baobab</option>
        </select>
        <input
          type="number"
          name="Age_Years"
          placeholder="Age (Years)"
          onChange={handleChange}
          value={data.Age_Years}
        />
        <input
          type="number"
          name="Biomass_kg"
          placeholder="Biomass (kg)"
          onChange={handleChange}
          value={data.Biomass_kg}
          step="0.1"
        />
        <button type="submit">Predict</button>
      </form>
      {result && <p>Predicted CO2 Absorption: {result.co2_absorption} kg/year</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};

export default CarbonSequestrationForm;
