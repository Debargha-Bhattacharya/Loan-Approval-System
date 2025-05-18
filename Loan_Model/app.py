from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle as pk
import os

app = Flask(__name__)
CORS(app)

model = pk.load(open('model.pkl', 'rb'))
scaler = pk.load(open('scaler.pkl', 'rb'))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received data:", data)  # Debug print
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        # Convert string values to appropriate types
        grad_s = 0 if data.get('grad') == 'Graduated' else 1
        emp_s = 0 if data.get('self_emp') == 'No' else 1
        
        # Create DataFrame for prediction
        pred_data = pd.DataFrame([[
            int(data.get('no_of_dep', 0)),
            grad_s,
            emp_s,
            float(data.get('Annual_Income', 0)),
            float(data.get('Loan_Amount', 0)),
            float(data.get('Loan_Dur', 0)),
            float(data.get('Cibil', 300)),
            float(data.get('Assets', 0))
        ]], columns=[
            'no_of_dependents',
            'education',
            'self_employed',
            'income_annum',
            'loan_amount',
            'loan_term',
            'cibil_score',
            'Assets'
        ])
        
        pred_data = scaler.transform(pred_data)
        prediction = model.predict(pred_data)
        
        return jsonify({'prediction': bool(prediction[0])})
        
    except Exception as e:
        print(f"Error in predict route: {str(e)}")  # Add logging
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)