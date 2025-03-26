import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import KNeighborsRegressor

# Load and train the model
data = pd.read_csv('data/Deforestation_Risk_Data.csv')
le = LabelEncoder()
data['Land_Use_Type'] = le.fit_transform(data['Land_Use_Type'])
X = data[['Land_Use_Type', 'Rainfall_mm', 'Avg_Temperature_C', 'Human_Activity_Index']]
y = data['Forest_Loss_%']
X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler().fit(X_train)
knn = KNeighborsRegressor(n_neighbors=5).fit(scaler.transform(X_train), y_train)

def predict_forest_loss(data):
    df = pd.DataFrame([data])
    scaled_data = scaler.transform(df)
    prediction = knn.predict(scaled_data)
    return {"forest_loss": prediction[0]}