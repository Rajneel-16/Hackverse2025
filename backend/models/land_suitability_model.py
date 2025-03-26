import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_selection import SelectKBest, f_regression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import requests

# Load Dataset
data_path = 'data/land_suitability.csv'
land_suitability = pd.read_csv(data_path)

# Preprocessing: Handle Missing Values
numeric_columns = land_suitability.select_dtypes(include=['float64', 'int64']).columns
land_suitability[numeric_columns] = land_suitability[numeric_columns].fillna(land_suitability[numeric_columns].mean())

# Encode categorical column
le = LabelEncoder()
land_suitability['soil_type'] = le.fit_transform(land_suitability['soil_type'])

# Feature Selection
X = land_suitability.drop(columns=['suitability_score'])
y = land_suitability['suitability_score']
selector = SelectKBest(score_func=f_regression, k=5)
X_new = selector.fit_transform(X, y)

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluation
def evaluate_model():
    y_pred = model.predict(X_test)
    return {
        "r2_score": r2_score(y_test, y_pred),
        "mean_absolute_error": mean_absolute_error(y_test, y_pred)
    }

# Prediction Function
def predict_suitability(data):
    try:
        # Fetch weather data
        avg_temp, rainfall = get_weather(data['latitude'], data['longitude'])
        
        # Add weather data to input
        data['avg_temp'] = int(avg_temp)
        data['rainfall'] = int(rainfall)
        
        # Convert input to DataFrame
        input_df = pd.DataFrame([data])
        
        # Define the required feature order as per model training
        required_columns = ['latitude', 'longitude', 'soil_type', 'rainfall', 'avg_temp', 'tree_cover']
        
        # Reorder DataFrame columns to match training data
        input_df = input_df[required_columns]
        
        # Predict suitability
        prediction = model.predict(input_df)[0]
        return {"predicted_suitability": round(prediction, 2), "obtained_temp": avg_temp, "obtained_rainfall": rainfall}
    except Exception as e:
        return {"error": str(e)}

# API Weather Integration
def get_weather(lat, lon):
    API_KEY = "aa0131acb8f484d2c06b2476881d7e75"
    response = requests.get(
        f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    )
    if response.status_code == 200:
        data = response.json()
        avg_temp = data.get("main", {}).get("temp", 25)
        rainfall = data.get("main", {}).get("humidity", 50)
        return avg_temp, rainfall
    else:
        return 25, 50