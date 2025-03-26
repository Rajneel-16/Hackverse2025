import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Load and train the model
land_suitability = pd.read_csv('data/land_suitability.csv')
le = LabelEncoder()
land_suitability['soil_type'] = le.fit_transform(land_suitability['soil_type'])
X = land_suitability.drop(columns=['suitability_score'])
y = land_suitability['suitability_score']
X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

def predict_land_suitability(data):
    df = pd.DataFrame([data])
    prediction = model.predict(df)
    return {"suitability_score": prediction[0]}