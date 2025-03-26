import React, { useState } from 'react';

const LandSuitabilityForm = () => {
  const [data, setData] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/predict/land-suitability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    setResult(result);
  };

  return (
    <div>
      <h1>Land Suitability Prediction</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="latitude" onChange={handleChange} placeholder="Latitude" />
        <input type="text" name="longitude" onChange={handleChange} placeholder="Longitude" />
        <input type="text" name="soil_type" onChange={handleChange} placeholder="Soil Type" />
        <button type="submit">Predict</button>
      </form>
      {result && <p>Suitability Score: {result.suitability_score}</p>}
    </div>
  );
};

export default LandSuitabilityForm;