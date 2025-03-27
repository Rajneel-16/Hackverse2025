# Updated Code: land_suitability_model.py

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_selection import SelectKBest, f_regression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import requests

# Load Dataset
land_suitability = pd.read_csv("data/land_suitability.csv")

# Preprocessing
numeric_columns = land_suitability.select_dtypes(include=['float64', 'int64']).columns
land_suitability[numeric_columns] = land_suitability[numeric_columns].fillna(land_suitability[numeric_columns].mean())

# Convert Categorical Column
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

# Evaluate Model
y_pred = model.predict(X_test)

# Soil type mapping
soil_type_mapping = {'Peaty': 0, 'Loamy': 1, 'Silty': 2, 'Sandy': 3, 'Clay': 4}

# Climate zones based on latitude
def get_climate_zone(lat):
    abs_lat = abs(lat)
    if abs_lat < 15: return 'tropical'
    elif abs_lat < 35: return 'subtropical'
    elif abs_lat < 55: return 'temperate'
    else: return 'boreal'

# Enhanced soil type estimation
def estimate_soil_type(lat, lon, elevation=0, humidity=50):
    # General rules by climate zone
    zone = get_climate_zone(lat)
    if zone == 'tropical':
        return 'Clay'  # Lateritic soils
    elif zone == 'subtropical':
        return 'Sandy' if humidity < 50 else 'Loamy'
    elif zone == 'temperate':
        return 'Loamy'
    else:  # boreal
        return 'Silty'

# Tree cover estimation
def estimate_tree_cover(lat, elevation=0, humidity=50):
    zone = get_climate_zone(lat)
    base_cover = {
        'tropical': 70,
        'subtropical': 45,
        'temperate': 50,
        'boreal': 30
    }[zone]

    base_cover *= (humidity / 50) if humidity < 50 else 1 + (humidity - 50)/100
    return min(100, max(0, int(base_cover)))

# Get elevation from Open-Elevation API
def get_elevation(lat, lon):
    try:
        response = requests.get(f"https://api.open-elevation.com/api/v1/lookup?locations={lat},{lon}", timeout=5)
        if response.status_code == 200:
            return response.json()['results'][0]['elevation']
    except:
        return 0  # Default to sea level if API fails

# Get weather data from OpenWeatherMap
def get_weather(lat, lon):
    API_KEY = "aa0131acb8f484d2c06b2476881d7e75"
    try:
        response = requests.get(
            f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric",
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            temp = data.get("main", {}).get("temp", 25)
            humidity = data.get("main", {}).get("humidity", 50)
            return temp, humidity
    except:
        pass
    return 25, 50

# Enhanced automated prediction
def enhanced_automated_prediction(data):
    lat = float(data['latitude'])
    lon = float(data['longitude'])

    elevation = get_elevation(lat, lon)
    temp, humidity = get_weather(lat, lon)
    soil_type = estimate_soil_type(lat, lon, elevation, humidity)
    tree_cover = estimate_tree_cover(lat, elevation, humidity)

    input_data = pd.DataFrame({
        'latitude': [lat],
        'longitude': [lon],
        'soil_type': [soil_type_mapping[soil_type]],
        'rainfall': [humidity],
        'avg_temp': [temp],
        'tree_cover': [tree_cover]
    })

    prediction = model.predict(input_data)[0]
    return {
        "predicted_suitability": prediction,
        "obtained_temp": temp,
        "obtained_rainfall": humidity,
        "obtained_soil_type": soil_type,
        "obtained_tree_cover": tree_cover,
        "climate_zone": get_climate_zone(lat)
    }