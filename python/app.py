from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

def load_data():
    file_path = "Dengue Risk Colombo.xlsx"
    df = pd.read_excel(file_path)
    data_list = df.to_dict(orient="records")
    return {
        "title": "Dengue Risk in Colombo District during 2013 to 2018",
        "xAxisLabel": "Year-Week",
        "yAxisLabel": "Dengue Risk",
        "data": data_list
    }

def load_data_with_cases():
    file_path = "Dengue Risk Colombo with dng cases.xlsx"
    df = pd.read_excel(file_path)
    data_list = df.to_dict(orient="records")
    return {
        "title": "Dengue Risk in Colombo by Week",
        "xAxisLabel": "Year-Week",
        "yAxisLabel": "Dengue Cases",
        "categoryKey": "riskLevel",
        "categoryColors": {
            "low": "green",
            "medium": "orange",
            "high": "red"
        },
        "data": data_list
    }

@app.route("/dengue_risk", methods=["GET"])
def dengue_risk():
    return jsonify(load_data())

@app.route("/dengue_risk_with_cases", methods=["GET"])
def dengue_risk_with_cases():
    return jsonify(load_data_with_cases())

if __name__ == "__main__":
    app.run(debug=True, port=8080)
