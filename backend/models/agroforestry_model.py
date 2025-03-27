# agroforestry_model.py

import numpy as np
import pandas as pd
import gc
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
import joblib

# Load datasets
dtype_spec = {
    "Region": "category",
    "pH": "float32",
    "Moisture_Level": "float32",
    "CO2_Absorption": "float32",
    "Growth_Rate": "float32",
    "Shade_Tolerance": "float32",
    "Water_Requirement": "float32",
    "Yield": "float32"
}

soil_data = pd.read_csv("data/soil_data.csv", usecols=["Region", "pH", "Moisture_Level"], dtype=dtype_spec)
tree_data = pd.read_csv("data/tree_species.csv", usecols=["Region", "Tree_Species", "CO2_Absorption", "Growth_Rate", "Shade_Tolerance"], dtype=dtype_spec)
crop_data = pd.read_csv("data/crop_species.csv", usecols=["Region", "Crop_Species", "Water_Requirement", "Yield", "Shade_Tolerance"], dtype=dtype_spec)

# Process datasets
soil_data = soil_data.drop_duplicates(subset=["Region"])
tree_data = tree_data.drop_duplicates(subset=["Region", "Tree_Species"])
crop_data = crop_data.drop_duplicates(subset=["Region", "Crop_Species"])

merged_data = soil_data.merge(tree_data, on="Region", how="inner").merge(
    crop_data, on="Region", how="inner", suffixes=("_tree", "_crop")
)

features = [
    "pH", "Moisture_Level", "CO2_Absorption", "Growth_Rate",
    "Shade_Tolerance_tree", "Shade_Tolerance_crop",
    "Water_Requirement", "Yield"
]

scaler = MinMaxScaler()
merged_data[features] = scaler.fit_transform(merged_data[features])

# Encode labels
tree_encoder = LabelEncoder()
crop_encoder = LabelEncoder()

merged_data["Tree_Label"] = tree_encoder.fit_transform(merged_data["Tree_Species"])
merged_data["Crop_Label"] = crop_encoder.fit_transform(merged_data["Crop_Species"])

# Balance dataset with SMOTE
smote = SMOTE(random_state=42)
X_balanced, y_tree_balanced = smote.fit_resample(merged_data[features], merged_data["Tree_Label"])
X_balanced, y_crop_balanced = smote.fit_resample(X_balanced, merged_data["Crop_Label"])

X_train, X_test, y_tree_train, y_tree_test, y_crop_train, y_crop_test = train_test_split(
    X_balanced, y_tree_balanced, y_crop_balanced, test_size=0.2, random_state=42, stratify=y_tree_balanced
)

# Train models
tree_model = XGBClassifier(n_estimators=50, max_depth=3, learning_rate=0.1, subsample=0.8, colsample_bytree=0.8, tree_method="hist", random_state=42)
crop_model = XGBClassifier(n_estimators=50, max_depth=3, learning_rate=0.1, subsample=0.8, colsample_bytree=0.8, tree_method="hist", random_state=42)

tree_model.fit(X_train, y_tree_train)
crop_model.fit(X_train, y_crop_train)

# Save models and encoders
joblib.dump(tree_model, "tree_model.pkl")
joblib.dump(crop_model, "crop_model.pkl")
joblib.dump(tree_encoder, "tree_encoder.pkl")
joblib.dump(crop_encoder, "crop_encoder.pkl")
joblib.dump(scaler, "scaler.pkl")

# Prediction function
def predict_agroforestry(data):
    tree_model = joblib.load("tree_model.pkl")
    crop_model = joblib.load("crop_model.pkl")
    tree_encoder = joblib.load("tree_encoder.pkl")
    crop_encoder = joblib.load("crop_encoder.pkl")
    scaler = joblib.load("scaler.pkl")

    input_features = np.array([[
        data["pH"], data["Moisture_Level"], data["CO2_Absorption"], data["Growth_Rate"],
        data["Shade_Tolerance_Tree"], data["Shade_Tolerance_Crop"],
        data["Water_Requirement"], data["Yield"]
    ]])

    scaled_features = scaler.transform(input_features)
    tree_prediction = tree_model.predict(scaled_features)
    crop_prediction = crop_model.predict(scaled_features)

    predicted_tree = tree_encoder.inverse_transform(tree_prediction)[0]
    predicted_crop = crop_encoder.inverse_transform(crop_prediction)[0]

    return {
        "best_tree": predicted_tree,
        "best_crop": predicted_crop
    }