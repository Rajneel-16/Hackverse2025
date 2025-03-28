import requests
from flask import jsonify
import rasterio
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report
import joblib
import os
import warnings
from rasterio.errors import NotGeoreferencedWarning

# Suppress warnings
warnings.filterwarnings("ignore", category=NotGeoreferencedWarning)
warnings.filterwarnings("ignore", category=UserWarning)

# Configuration
WEATHER_API_KEY = "aa0131acb8f484d2c06b2476881d7e75"
SENTINEL_HUB_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ3dE9hV1o2aFJJeUowbGlsYXctcWd4NzlUdm1hX3ZKZlNuMW1WNm5HX0tVIn0.eyJleHAiOjE3NDMxMjc5MTMsImlhdCI6MTc0MzEyNDMxMywianRpIjoiMzkxZDk2ODYtOTE3Mi00MDg5LTk4ZDEtZjA0YTIyOTkwMjEyIiwiaXNzIjoiaHR0cHM6Ly9zZXJ2aWNlcy5zZW50aW5lbC1odWIuY29tL2F1dGgvcmVhbG1zL21haW4iLCJzdWIiOiI0ZTg3Y2U2Ny0xZTA0LTQ3NzEtOGNlNC05ZjhhMmRjMDNmMTciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiI5ODY1ZDcxNi02YjQ0LTQ5OTUtOGQ1Zi0wYjQ2MDMwZjQ3ODMiLCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImNsaWVudEhvc3QiOiIzNS4yMzguMzAuMjA4IiwicGxfcHJvamVjdCI6IjhkOGE0OWE1LWJjYzktNGJhOC04YmYyLTI1NGU1YWY2Y2ExNiIsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC05ODY1ZDcxNi02YjQ0LTQ5OTUtOGQ1Zi0wYjQ2MDMwZjQ3ODMiLCJjbGllbnRBZGRyZXNzIjoiMzUuMjM4LjMwLjIwOCIsImFjY291bnQiOiI4ZDhhNDlhNS1iY2M5LTRiYTgtOGJmMi0yNTRlNWFmNmNhMTYiLCJwbF93b3Jrc3BhY2UiOiJkOTU0OWM3Mi00OGU0LTQyZGMtOWY3Ni0wZDk1NDk3YTQyNzMiLCJjbGllbnRfaWQiOiI5ODY1ZDcxNi02YjQ0LTQ5OTUtOGQ1Zi0wYjQ2MDMwZjQ3ODMifQ.ALNp9OsNMqru0dEd8wPYKsWqZTu4X6TbgE4FQsf5Zw16nlU5W_90DHdsSEvm7aLbxoTnHVqvFqEB360IA1jBNE0eOFK8FbNDj397r-X6LpsLtQmnLOlPML3oQlroFRU7I1-JKM1GcvmtM-ilBa3jL96H196Giux9ND57M2Lca9Gvws6VDFJnPewHiKd-0jhVBxxBV0tBijCWiEsLTCFXh1x3HUhyl1CBWIxJz6EAO7gbknvtyI-Ni5eLT-LlmYf1_O1gdyBdKN9_RPzj9nbQeS5hf9LTdAV75olyT3LuqvOP-MCc6E6p_yV6u-Xfm8wdLWK1WM2jfXHKzxzHuFF-7g"
MODEL_PATH = "deforestation_model.pkl"
DATA_PATH = "data/deforestation_dataset.csv"

class DeforestationPredictor:
    def __init__(self):
        self.model = None
        self.load_or_train_model()
        self.ndvi_threshold = 0.6  # Threshold for dense vegetation
        self.probability_threshold = 0.7  # Only predict high risk if probability > 70%

    def load_dataset(self):
        """Load and validate the deforestation dataset"""
        try:
            df = pd.read_csv(DATA_PATH)

            # Data validation
            if len(df) != 2000:
                print(f"⚠️ Warning: Expected 2000 rows, got {len(df)}")

            print(f"✅ Loaded dataset with {len(df)} rows")
            print("Class distribution:\n", df["Deforestation_Risk"].value_counts())

            # Check for duplicates
            duplicates = df.duplicated().sum()
            if duplicates > 0:
                print(f"⚠️ Warning: Found {duplicates} duplicate rows")
                df = df.drop_duplicates()

            return df
        except Exception as e:
            print(f"❌ Error loading dataset: {e}")
            return None

    def train_model(self, df):
        """Train and validate the Random Forest model"""
        try:
            X = df[["NDVI", "Rainfall_mm", "Temperature_C"]]
            y = df["Deforestation_Risk"]

            # Cross-validation
            model = RandomForestClassifier(
                n_estimators=200,
                max_depth=10,
                min_samples_split=5,
                class_weight="balanced",
                random_state=42
            )

            cv_scores = cross_val_score(model, X, y, cv=5)
            print(f"Cross-validation scores: {cv_scores}")
            print(f"Mean accuracy: {cv_scores.mean():.2f}")

            # Final training
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )

            model.fit(X_train, y_train)

            # Feature importance
            self.plot_feature_importance(model, X.columns)

            # Evaluation
            y_pred = model.predict(X_test)
            print("\nModel Evaluation:")
            print(classification_report(y_test, y_pred))

            joblib.dump(model, MODEL_PATH)
            print(f"💾 Model saved to {MODEL_PATH}")
            return model
        except Exception as e:
            print(f"❌ Training error: {e}")
            return None

    def plot_feature_importance(self, model, feature_names):
        pass

    def load_or_train_model(self):
        """Load existing model or train new one"""
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                print("🔍 Loaded pre-trained model")
                return
            except Exception as e:
                print(f"❌ Failed to load model: {e}")

        df = self.load_dataset()
        if df is not None:
            self.model = self.train_model(df)

    def get_weather(self, lat, lon):
        """Fetch current weather data with timeout"""
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
        try:
            response = requests.get(url, timeout=10)
            if response.status_code != 200:
                raise ValueError(f"Weather API error: {response.text}")
            response = response.json()

            return {
                "Temperature": float(response["main"].get("temp", 25)),
                "Humidity": float(response["main"].get("humidity", 70)),
                "Rainfall": float(response.get("rain", {}).get("1h", 0))
            }
        except Exception as e:
            print(f"⛈️ Weather API error: {e}")
            return {"Temperature": 25, "Humidity": 70, "Rainfall": 0}

    def download_sentinel_images(self, lat, lon, size=0.01):
        """Download Sentinel-2 imagery with error handling"""
        url = "https://services.sentinel-hub.com/api/v1/process"

        coords = [
              [float(lon) - size, float(lat) - size],
              [float(lon) + size, float(lat) - size],
              [float(lon) + size, float(lat) + size],
              [float(lon) - size, float(lat) + size],
              [float(lon) - size, float(lat) - size]
        ]

        headers = {
            "Authorization": f"Bearer {SENTINEL_HUB_TOKEN}",
            "Content-Type": "application/json"
        }

        payload = {
            "input": {
                "bounds": {
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [coords]
                    }
                },
                "data": [{
                    "type": "sentinel-2-l2a",
                    "dataFilter": {
                        "mosaickingOrder": "leastRecent",
                        "maxCloudCoverage": 30
                    }
                }]
            },
            "output": {
                "width": 512,
                "height": 512,
                "responses": [{
                    "identifier": "default",
                    "format": {"type": "image/tiff"}
                }]
            },
            "evalscript": """
                //VERSION=3
                function setup() {
                    return {
                        input: ["B04", "B08", "SCL", "dataMask"],
                        output: { id: "default", bands: 2, sampleType: "FLOAT32" }
                    };
                }
                function evaluatePixel(sample) {
                    if (sample.SCL >= 8 && sample.SCL <= 10 || sample.dataMask == 0) {
                        return [NaN, NaN];
                    }
                    return [sample.B04, sample.B08];
                }
            """
        }

        try:
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            if response.status_code == 200:
                with open("sentinel_data.tif", "wb") as f:
                    f.write(response.content)
                return "sentinel_data.tif"
            print(f"🛰️ Sentinel Hub error: {response.text}")
            return None
        except Exception as e:
            print(f"❌ Download error: {e}")
            return None

    def calculate_ndvi(self, image_path):
        """Calculate NDVI with cloud masking"""
        try:
            with rasterio.open(image_path) as src:
                img_data = src.read()
                red = img_data[0].astype(np.float32)
                nir = img_data[1].astype(np.float32)

                ndvi = (nir - red) / (nir + red + 1e-6)
                valid_pixels = ~np.isnan(ndvi)
                if valid_pixels.sum() == 0:
                    return 0.5  # Default if no valid pixels
                return np.nanmean(ndvi[valid_pixels])
        except Exception as e:
            print(f"❌ NDVI calculation error: {e}")
            return 0.5

    def predict(self, lat, lon):
        """Make deforestation prediction with business rules"""
        if not self.model:
            return {"Error": "Model not available"}

        weather = self.get_weather(float(lat), float(lon))
        image_path = self.download_sentinel_images(lat, lon)

        if not image_path:
            return {"Error": "Image download failed"}

        ndvi = self.calculate_ndvi(image_path)

        # Create features DataFrame
        features = pd.DataFrame([[ndvi, weather["Rainfall"], weather["Temperature"]]], columns=["NDVI", "Rainfall_mm", "Temperature_C"])

        # Get model probability
        proba = self.model.predict_proba(features)[0][1]

        # Apply business rules
        if ndvi > self.ndvi_threshold:
            # Dense vegetation - override to low risk
            risk_level = "Low"
            confidence = f"{1 - proba:.1%}"
            note = "Dense vegetation area (NDVI > 0.6)"
        elif proba > self.probability_threshold:
            risk_level = "High"
            confidence = f"{proba:.1%}"
            note = "Model prediction"
        else:
            risk_level = "Low"
            confidence = f"{1 - proba:.1%}"
            note = "Model prediction"

        return {
            "coordinates": f"{lat:.4f}, {lon:.4f}",
            "ndvi": float(round(ndvi, 3)),
            "temperature": float(round(weather["Temperature"], 1)),
            "rainfall_mm": float(round(weather["Rainfall"], 1)),
            "risk_level": risk_level,
            "confidence": confidence,
            "note": note,
            "model_version": os.path.getmtime(MODEL_PATH) if os.path.exists(MODEL_PATH) else "N/A"
        }

def enhanced_deforestation_prediction(input):
    predictor = DeforestationPredictor()

    lat, lon = float(input['latitude']), float(input['longitude'])

    result = predictor.predict(lat,lon)

    return result