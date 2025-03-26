import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LandSuitabilityForm from "./components/LandSuitabilityForm";
import TreeSpeciesForm from "./components/TreeSpeciesForm";
import DeforestationRiskForm from "./components/DeforestationRiskForm";
import CarbonSequestrationForm from "./components/Carbon_Sequestration";

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/land-suitability">Land Suitability</Link></li>
            <li><Link to="/tree-species">Tree Species Survival</Link></li>
            <li><Link to="/deforestation-risk">Deforestation Risk</Link></li>
            <li><Link to="/carbon-sequestration">Carbon Sequestration</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/land-suitability" element={<LandSuitabilityForm />} />
          <Route path="/tree-species" element={<TreeSpeciesForm />} />
          <Route path="/deforestation-risk" element={<DeforestationRiskForm />} />
          <Route path="/carbon-sequestration" element={<CarbonSequestrationForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;