from flask import Flask, request, jsonify
from models.land_suitability_model import predict_land_suitability
from models.tree_species_survival_model import predict_species
from models.deforestation_risk_model import predict_forest_loss

app = Flask(__name__)

@app.route('/predict/land-suitability', methods=['POST'])
def land_suitability():
    data = request.json
    result = predict_land_suitability(data)
    return jsonify(result)

@app.route('/predict/tree-species', methods=['POST'])
def tree_species():
    data = request.json
    result = predict_species(data)
    return jsonify(result)

@app.route('/predict/deforestation-risk', methods=['POST'])
def deforestation_risk():
    data = request.json
    result = predict_forest_loss(data)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)