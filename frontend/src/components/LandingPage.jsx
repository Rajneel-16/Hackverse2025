import React from "react";
import { Link } from "react-router-dom";
import './LandingPage.css'; // Add specific styles for the landing page if needed
import logo from '../assets/logo.png';

const LandingPage = () => {

  return (
    <div className="landing-page">
      <div className="landing-page-heading-div">
        <div style={{width:"15%"}}><img src={logo} alt="logo"/></div>
        <div style={{width:"85%"}}><h1>GreenSync</h1></div>
      </div>
      <div className="landing-page-description-div">
        <p>Welcome to the AI-based Reforestation Planning Tool! Select a tool from the navigation menu to get started!!</p>
      </div>
      <div className="links-div">
            <div>
            <Link to="/land-suitability" className="link-style"><p>Check Land Suitability</p></Link>
            <Link to="/tree-species" className="link-style"><p>Check Survival of Tree Species</p></Link>
            </div>
            <div>
            <Link to="/deforestation-risk" className="link-style"><p>Check Deforestation Risk</p></Link>
            <Link to="/carbon-sequestration" className="link-style"><p>Check Carbon Sequestration</p></Link>
            </div>
            <div>
            <Link to="/agroforestry" className="link-style"><p>Smart Agroforestry Planning</p></Link>
            <Link className="link-style"><p>Satellite Monitoring</p></Link>
            </div>
      </div>
    </div>
  );
};

export default LandingPage;