import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from xgboost import XGBRegressor

# Load and train the models
data = pd.read_csv('data/tree_species_survival.csv')
X = data[['species', 'region', 'growth_rate']]
y = data[['co2_absorption', 'survival_probability']]
encoder = OneHotEncoder(sparse_output=False)
X_encoded = encoder.fit_transform(X[['species', 'region']])
X_processed = pd.concat([pd.DataFrame(X_encoded), X[['growth_rate']].reset_index(drop=True)], axis=1)
X_train, _, y_train, _ = train_test_split(X_processed, y, test_size=0.2, random_state=42)
co2_model = XGBRegressor(n_estimators=100, random_state=42).fit(X_train, y_train['co2_absorption'])
survival_model = XGBRegressor(n_estimators=100, random_state=42).fit(X_train, y_train['survival_probability'])

def predict_species(data):
    input_data = pd.DataFrame([data])
    encoded_input = encoder.transform(input_data[['species', 'region']])
    processed_input = pd.concat([pd.DataFrame(encoded_input), input_data[['growth_rate']].reset_index(drop=True)], axis=1)
    co2 = co2_model.predict(processed_input)[0]
    survival = survival_model.predict(processed_input)[0]
    return {"co2_absorption": co2, "survival_probability": survival}