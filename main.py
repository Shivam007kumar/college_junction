from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.feature_selection import SelectFromModel
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['collegejunction']  # Replace with your database name

# Load data from MongoDB collections (cap1, cap2, cap3)
def load_data_from_mongodb():
    cap1 = pd.DataFrame(list(db.cap1.find()))
    cap2 = pd.DataFrame(list(db.cap2.find()))
    cap3 = pd.DataFrame(list(db.cap3.find()))
    df = pd.concat([cap1, cap2, cap3], ignore_index=True)
    return df

# Fetch college details from the 'colleges' collection
def fetch_college_details(college_name):
    college = db.colleges.find_one({"college_name": college_name})
    if college:
        return {
            "college_name": college.get("college_name", ""),
            "branches": college.get("branches", []),
            "rating": college.get("rating", 0),
            "photo": college.get("photo", ""),
            "map": college.get("map", ""),
        }
    else:
        return None

# Preprocess data
def preprocess_data(df):
    numeric_cols = df.select_dtypes(include=['number']).columns
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())
    df['college_and_branch'] = df['college_and_branch'].fillna('Unknown - Unknown')
    df['college_and_branch'] = df['college_and_branch'].str.replace(r'\s*-\s*', ' - ', regex=True)
    split_data = df['college_and_branch'].str.split(' - ', expand=True)
    if split_data.shape[1] != 2:
        split_data = split_data.fillna('Unknown')
        split_data = split_data.iloc[:, :2]
    df[['college', 'branch']] = split_data
    label_encoder = LabelEncoder()
    df['college_encoded'] = label_encoder.fit_transform(df['college'])
    df['branch_encoded'] = label_encoder.fit_transform(df['branch'])
    X = df.drop(['general_open', 'college_and_branch', 'college', 'branch'], axis=1)
    X = X.select_dtypes(include=['number'])
    y = df['general_open']
    scaler = StandardScaler()
    X = scaler.fit_transform(X)
    return X, y, scaler, label_encoder

# Train models
def train_models(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    selector = SelectFromModel(RandomForestRegressor(n_estimators=100, random_state=42))
    selector.fit(X_train, y_train)
    X_train_selected = selector.transform(X_train)
    X_test_selected = selector.transform(X_test)
    rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_model.fit(X_train_selected, y_train)
    xgb_model = XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42)
    xgb_model.fit(X_train_selected, y_train)
    return rf_model, xgb_model, selector

# Predict colleges based on user input
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        user_percentile = data['percentile']
        user_location = data['location']
        user_section = data['section']
        user_round = data['round']

        df = load_data_from_mongodb()
        X, y, scaler, label_encoder = preprocess_data(df)
        rf_model, xgb_model, selector = train_models(X, y)

        section_mapping = {
            'open': 'general_open',
            'obc': 'other_backward_class',
            'sc': 'scheduled_caste',
            'st': 'scheduled_tribe'
        }
        section_column = section_mapping.get(user_section.lower(), 'general_open')

        filtered_colleges = df[df['college'].str.contains(user_location, case=False, na=False)]
        percentile_range = 5
        filtered_colleges = filtered_colleges[
            (filtered_colleges[section_column] >= user_percentile - percentile_range) &
            (filtered_colleges[section_column] <= user_percentile + percentile_range)
        ]
        if 'round' in df.columns:
            filtered_colleges = filtered_colleges[filtered_colleges['round'] == user_round]

        if not filtered_colleges.empty:
            X_filtered = filtered_colleges.drop(['general_open', 'college_and_branch', 'college', 'branch'], axis=1)
            X_filtered = X_filtered.select_dtypes(include=['number'])
            X_filtered = scaler.transform(X_filtered)
            X_filtered_selected = selector.transform(X_filtered)

            rf_filtered_predictions = rf_model.predict(X_filtered_selected)
            xgb_filtered_predictions = xgb_model.predict(X_filtered_selected)

            filtered_colleges['rf_predicted_cutoff'] = rf_filtered_predictions
            filtered_colleges['xgb_predicted_cutoff'] = xgb_filtered_predictions

            results = []
            for _, row in filtered_colleges.iterrows():
                college_name = row['college']
                college_details = fetch_college_details(college_name)
                if college_details:
                    results.append({
                        "_id": str(row.get("_id", "")),
                        "college": college_name,
                        "branch": row['branch'],
                        "cutoff": row[section_column],
                        "rf_predicted_cutoff": row['rf_predicted_cutoff'],
                        "xgb_predicted_cutoff": row['xgb_predicted_cutoff'],
                        "photo": college_details.get("photo", ""),
                        "rating": college_details.get("rating", 0),
                    })

            return jsonify(results)
        else:
            return jsonify({"message": "No colleges found matching your criteria."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fetch college details
@app.route('/api/colleges/<college_id>', methods=['GET'])
def get_college_details(college_id):
    try:
        college = db.colleges.find_one({"_id": ObjectId(college_id)})
        if college:
            return jsonify({
                "college_name": college.get("college_name", ""),
                "branches": college.get("branches", []),
                "rating": college.get("rating", 0),
                "photo": college.get("photo", ""),
                "map": college.get("map", ""),
            })
        else:
            return jsonify({"error": "College not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)