import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import KNeighborsRegressor

# Load and prepare the dataset
data_path = 'data/Deforestation_Risk_Data.csv'
data = pd.read_csv(data_path)
data['Land_Use_Type'] = LabelEncoder().fit_transform(data['Land_Use_Type'])

# Prepare features and target
X = data[['Land_Use_Type', 'Rainfall_mm', 'Avg_Temperature_C', 'Human_Activity_Index']]
y = data['Forest_Loss_%']

# Train-test split and scaling
X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler().fit(X_train)
X_train_scaled = scaler.transform(X_train)

# Train the KNN model
knn = KNeighborsRegressor(n_neighbors=5).fit(X_train_scaled, y_train)

# Prediction function
def predict_forest_loss(input_data):
    try:
        # Convert input data to DataFrame
        input_df = pd.DataFrame([input_data])
        # Scale the input data
        input_scaled = scaler.transform(input_df)
        # Predict forest loss percentage
        prediction = knn.predict(input_scaled)[0]
        return {"forest_loss": round(prediction, 2)}
    except Exception as e:
        return {"error": str(e)}