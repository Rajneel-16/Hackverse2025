import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import KNeighborsRegressor

# Load and prepare the dataset
data_path = 'data/Carbon_Sequestration_Data.csv'
data = pd.read_csv(data_path)

# Encode Tree_Species
species_encoder = LabelEncoder()
data['Tree_Species_Encoded'] = species_encoder.fit_transform(data['Tree_Species'])

# Prepare features and target
X = data[['Tree_Species_Encoded', 'Age_Years', 'Biomass_kg']]
y = data['CO2_Absorption_kg_per_year']

# Train-test split and scaling
X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler().fit(X_train)
X_train_scaled = scaler.transform(X_train)

# Train the KNN model
knn = KNeighborsRegressor(n_neighbors=5).fit(X_train_scaled, y_train)

# Prediction function
def predict_co2_absorption(input_data):
    try:
        # Convert input data to DataFrame
        input_df = pd.DataFrame([input_data])
        # Scale the input data
        input_scaled = scaler.transform(input_df)
        # Predict CO2 absorption
        prediction = knn.predict(input_scaled)[0]
        return {"co2_absorption": round(prediction, 2)}
    except Exception as e:
        return {"error": str(e)}