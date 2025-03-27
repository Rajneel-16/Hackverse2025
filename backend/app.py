from flask import Flask, request, jsonify
from flask_cors import CORS  # Added CORS import
from models.land_suitability_model import predict_suitability as predict_land_suitability
from models.tree_species_survival_model import predict_species
from models.deforestation_risk_model import predict_forest_loss
from models.carbon_sequestration import predict_co2_absorption
from models.agroforestry_model import predict_agroforestry

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/predict/land-suitability', methods=['POST'])
def land_suitability():
    try:
        data = request.json
        print("/////// Received Data:", data)  # Log incoming data
        result = predict_land_suitability(data)
        print("/////// Prediction Result:", result)  # Log prediction result
        return jsonify(result)
    except Exception as e:
        print("/////// Error:", str(e))  # Log error details
        return jsonify({"error": str(e)}), 500

@app.route('/predict/tree-species', methods=['POST'])
def tree_species():
    try:
        data = request.json
        print("/////// Received Data:", data)  # Log incoming data
        result = predict_species(data)
        print("/////// Prediction Result:", result)  # Log prediction result
        return jsonify(result)
    except Exception as e:
        print("/////// Error:", str(e))  # Log error details
        return jsonify({"error": str(e)}), 500

@app.route('/predict/deforestation-risk', methods=['POST'])
def deforestation_risk():
    try:
        data = request.json
        print("/////// Received Data:", data)  # Log incoming data
        result = predict_forest_loss(data)
        print("/////// Prediction Result:", result)  # Log prediction result
        return jsonify(result)
    except Exception as e:
        print("/////// Error:", str(e))  # Log error details
        return jsonify({"error": str(e)}), 500
    
@app.route('/predict/carbon-sequestration', methods=['POST'])
def carbon_sequestration():
    try:
        data = request.json
        print("/////// Received Data:", data)  # Log incoming data
        result = predict_co2_absorption(data)
        print("/////// Prediction Result:", result)  # Log prediction result
        return jsonify(result)
    except Exception as e:
        print("/////// Error:", str(e))  # Log error details
        return jsonify({"error": str(e)}), 500
    
@app.route('/predict/agroforestry', methods=['POST'])
def agroforestry():
    try:
        data = request.json
        print("/////// Received Data:", data)  # Log incoming data
        result = predict_agroforestry(data)
        print("/////// Prediction Result:", result)  # Log prediction result
        return jsonify(result)
    except Exception as e:
        print("/////// Error:", str(e))  # Log error details
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)