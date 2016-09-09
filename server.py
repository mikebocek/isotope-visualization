from flask import Flask, render_template, jsonify
import json


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('decay_chain.html')

@app.route('/isotope_data')
def isotope_data():
    with open('element_data_with_decays.json') as f:
        return json.dumps(json.load(f))

@app.route('/decay_chains')
def decay_data():
    with open('decay_chains.json') as f:
        return json.dumps(json.load(f))

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
