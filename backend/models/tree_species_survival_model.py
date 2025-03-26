import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from xgboost import XGBRegressor

# Load dataset and train models (do this once to optimize performance)
data = pd.read_csv('data/tree_species_survival.csv')

# Features and targets
X = data[['species', 'region', 'growth_rate']]
y = data[['co2_absorption', 'survival_probability']]

# One-hot encode categorical features
encoder = OneHotEncoder(sparse_output=False)
X_encoded = encoder.fit_transform(X[['species', 'region']])
X_processed = pd.concat([
    pd.DataFrame(X_encoded, columns=encoder.get_feature_names_out()),
    X[['growth_rate']].reset_index(drop=True)
], axis=1)

# Train-test split
co2_model = XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42)
survival_model = XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42)

co2_model.fit(X_processed, y['co2_absorption'])
survival_model.fit(X_processed, y['survival_probability'])

# Define mappings for encoded values
species_mapping = {value: value for value in data['species'].unique()}
region_mapping = {value: value for value in data['region'].unique()}

def predict_species(input_data):
    try:
        species = input_data['species']
        region = input_data['region']
        growth_rate = input_data['growth_rate']

        input_df = pd.DataFrame({
            'species': [species],
            'region': [region],
            'growth_rate': [growth_rate]
        })

        encoded_input = encoder.transform(input_df[['species', 'region']])
        processed_input = pd.concat([
            pd.DataFrame(encoded_input, columns=encoder.get_feature_names_out()),
            input_df[['growth_rate']].reset_index(drop=True)
        ], axis=1)

        co2_absorption = co2_model.predict(processed_input)[0]
        survival_probability = survival_model.predict(processed_input)[0]

        # Convert np.float32 to Python floats
        return {
            'co2_absorption': float(round(co2_absorption, 2)),
            'survival_probability': float(round(survival_probability, 2))
        }
    except Exception as e:
        return {"error": str(e)}