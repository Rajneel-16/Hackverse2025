import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LandingPage.css';
import heroVideo from '../assets/forest_background.mov'; 

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [stats, setStats] = useState({
    treesPlanted: 0,
    carbonReduced: 0,
    areaCovered: 0
  });

  const features = [
    {
      title: "Land Suitability Analysis",
      description: "Discover optimal locations for planting based on soil, climate, and terrain",
      icon: "🌱",
      path: "/land-suitability"
    },
    {
      title: "Tree Species Recommender",
      description: "Find perfect tree species for your specific environmental conditions",
      icon: "🌳",
      path: "/tree-species"
    },
    {
      title: "Deforestation Risk Assessment",
      description: "Predict and prevent forest loss with AI-powered risk analysis",
      icon: "🛡️",
      path: "/deforestation-risk"
    },
    {
      title: "Carbon Sequestration Calculator",
      description: "Measure your environmental impact through carbon capture potential",
      icon: "♻️",
      path: "/carbon-sequestration"
    },
    {
      title: "Agroforestry Planning",
      description: "Design sustainable agricultural systems integrated with trees",
      icon: "🌾",
      path: "/agroforestry"
    }
  ];

  const testimonials = [
    {
      quote: "This platform helped us increase our reforestation success rate by 40%",
      author: "GreenEarth Initiative",
      role: "Environmental NGO"
    },
    {
      quote: "The most comprehensive forestry analysis tools I've ever used",
      author: "Dr. Priya Sharma",
      role: "Forest Ecologist"
    },
    {
      quote: "Revolutionizing how we approach sustainable land management",
      author: "EcoFarm Co-op",
      role: "Agricultural Collective"
    }
  ];

  const forestData = {
    labels: ['2010', '2015', '2020', '2023'],
    coverage: [65, 62, 58, 55],
    carbon: [120, 115, 105, 95]
  };

  useEffect(() => {
    const targetStats = {
      treesPlanted: 12453,
      carbonReduced: 5420,
      areaCovered: 328
    };

    const duration = 3000;
    const steps = 100;
    const increment = {
      trees: targetStats.treesPlanted / steps,
      carbon: targetStats.carbonReduced / steps,
      area: targetStats.areaCovered / steps
    };

    let current = { trees: 0, carbon: 0, area: 0 };
    const timer = setInterval(() => {
      current.trees += increment.trees;
      current.carbon += increment.carbon;
      current.area += increment.area;

      if (current.trees >= targetStats.treesPlanted) {
        current = targetStats;
        clearInterval(timer);
      }

      setStats({
        treesPlanted: Math.floor(current.trees),
        carbonReduced: Math.floor(current.carbon),
        areaCovered: Math.floor(current.area)
      });
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="video-background">
          <video autoPlay loop muted playsInline>
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="video-overlay"></div>
        </div>
        
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            Transforming Land Management with <span>AI</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hero-subtitle"
          >
            Advanced analytics for sustainable forestry and agriculture
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button 
              className="cta-button"
              onClick={() => navigate("/land-suitability")}
            >
              Explore Tools
            </button>
          </motion.div>
        </div>
        <div className="hero-visual">
          <div className="earth-globe"></div>
          <div className="data-points">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="data-point" style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                animationDelay: `${i * 0.2}s`
              }}></div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-card">
          <h3>Trees Planted</h3>
          <div className="stat-number">{stats.treesPlanted.toLocaleString()}+</div>
          <div className="stat-icon">🌲</div>
        </div>
        <div className="stat-card">
          <h3>Carbon Reduced (tons)</h3>
          <div className="stat-number">{stats.carbonReduced.toLocaleString()}+</div>
          <div className="stat-icon">☁️</div>
        </div>
        <div className="stat-card">
          <h3>Area Covered (km²)</h3>
          <div className="stat-number">{stats.areaCovered.toLocaleString()}+</div>
          <div className="stat-icon">🗺️</div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Our Powerful Tools</h2>
        <p className="section-subtitle">Everything you need for intelligent land management</p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card"
              whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              onClick={() => navigate(feature.path)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="feature-arrow">→</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="data-section">
        <h2 className="section-title">Forest Health Insights</h2>
        <div className="data-visualization">
          <div className="chart-container">
            <div className="chart">
              {forestData.labels.map((year, i) => (
                <div key={year} className="chart-bar-container">
                  <div 
                    className="chart-bar coverage" 
                    style={{ height: `${forestData.coverage[i]}%` }}
                  ></div>
                  <div 
                    className="chart-bar carbon" 
                    style={{ height: `${forestData.carbon[i]}%` }}
                  ></div>
                  <div className="chart-label">{year}</div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color coverage"></div>
                <span>Forest Coverage (%)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color carbon"></div>
                <span>Carbon Storage Index</span>
              </div>
            </div>
          </div>
          <div className="data-text">
            <h3>Tracking Environmental Changes</h3>
            <p>
              Our monitoring shows concerning trends in forest coverage but also highlights 
              opportunities for intervention. With proper management, we can reverse these trends.
            </p>
            <button className="secondary-button" onClick={() => navigate("/deforestation-risk")}>
              Learn About Prevention
            </button>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2 className="section-title">Trusted by Environmental Leaders</h2>
        <div className="testimonials-carousel">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`testimonial-slide ${index === activeSlide ? 'active' : ''}`}
            >
              <div className="testimonial-content">
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="carousel-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === activeSlide ? 'active' : ''}`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <h2>Ready to Transform Your Land Management?</h2>
        <p>Join hundreds of organizations making data-driven environmental decisions</p>
        <div className="cta-buttons">
          <button className="cta-button" onClick={() => navigate("/land-suitability")}>
            Get Started
          </button>
          <button className="outline-button">
            Request Demo
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;