import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LandSuitabilityForm from "./components/LandSuitabilityForm";
import TreeSpeciesForm from "./components/TreeSpeciesForm";
import DeforestationRiskForm from "./components/DeforestationRiskForm";
import CarbonSequestrationForm from "./components/Carbon_Sequestration";
import AgroforestryPredictionForm from "./components/AgroforestryPredictionForm";
import DeforestationRiskAssessment from "./components/DeforestationRiskAssessment";
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-main-div">
        <Routes>
          {/* Default route to render LandingPage */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/land-suitability" element={<LandSuitabilityForm />} />
          <Route path="/tree-species" element={<TreeSpeciesForm />} />
          <Route path="/deforestation-risk" element={<DeforestationRiskForm />} />
          <Route path="/carbon-sequestration" element={<CarbonSequestrationForm />} />
          <Route path="/agroforestry" element={<AgroforestryPredictionForm />} />
          <Route path="/deforestation-risk-assessment" element={<DeforestationRiskAssessment />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;