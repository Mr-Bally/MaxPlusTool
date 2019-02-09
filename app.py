from flask import Flask, request, jsonify, render_template, url_for
from graph import getDirectedGraph, getMatrixData, getStationLabels, getRawMatrix
import json
import time

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/network', methods=['GET','POST'])
def network():
    url = url_for('static', filename='matrixGraph.png', t=time.time())
    if request.method == "POST":
        with open('./data/matrixData.json', 'w') as outfile:
            json.dump(request.get_json(force=True), outfile)
        
        getDirectedGraph()
        return url
    
    return render_template('network.html', url=url, matrixData=getMatrixData(), stationData=getStationLabels())

@app.route('/schedule')
def schedule():
    url = url_for('static', filename='matrixGraph.png', t=time.time())
    return render_template('schedule.html', url=url, stationData=getStationLabels(), matrixData=getRawMatrix())

@app.route('/summary')
def summary():
    return render_template('summary.html')

@app.route('/delays', methods=['GET','POST'])
def delays():
    if request.method == "POST":
        with open('./data/delayMatrix.json', 'w') as outfile:
            json.dump(request.get_json(force=True), outfile)
        return 'Success'
    url = url_for('static', filename='matrixGraph.png', t=time.time())
    return render_template('delays.html', url=url, rawMatrix=getRawMatrix())

@app.route('/results')
def results():
    return render_template('summary.html')