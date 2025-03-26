from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://34.88.15.232:3000"}})

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

def load_data_comparison():
    file_path = "Dengue Expected and Real Colombo.xlsx"
    df = pd.read_excel(file_path)
    data_list = df.to_dict(orient="records")
    return {
        "title": "Expected Dengue Data Vs. Real Dengue Data in Colombo 2018 - 2020",
        "xAxisLabel": "Year-Week",
        "yAxisLabel": "Dengue Cases",
        "categoryKey": "riskLevel",
        "legend": {
           "data1": "Expected Cases",
            "data2": "Real Cases"
         },
        "data": data_list
    }


@app.route("/dengue_risk", methods=["GET"])
def dengue_risk():
    return jsonify(load_data())

@app.route("/dengue_risk_with_cases", methods=["GET"])
def dengue_risk_with_cases():
    return jsonify(load_data_with_cases())


@app.route("/dengue_cases_comp", methods=["GET"])
def dengue_cases_comp():
    return jsonify(load_data_comparison())

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080)