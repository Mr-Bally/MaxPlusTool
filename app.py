from flask import Flask, request, jsonify, render_template, url_for, redirect
from dataService import getDirectedGraph, getStationLabels, getMatrixData, getRawMatrix, getScheduleData, getDelayMatrix, getResults, getEpsMatrix, getExpoVal
from maxplus import runMaxPlus
import json
import time
import numpy as np

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/network', methods=['GET', 'POST'])
def network():
    url = url_for('static', filename='matrixGraph.png', t=time.time())
    if request.method == "POST":
        savedata('./data/matrixData.json', request)
        getDirectedGraph()
        url = url_for('static', filename='matrixGraph.png', t=time.time())
        return url

    return render_template('network.html', url=url, matrixData=getEpsMatrix(), stationData=getStationLabels())


@app.route('/schedule', methods=['GET', 'POST'])
def schedule():
    if request.method == "POST":
        savedata('./data/schedule.json', request)
        return 'Success'

    url = url_for('static', filename='matrixGraph.png', t=time.time())
    return render_template('schedule.html', url=url, stationData=getStationLabels(), matrixData=getRawMatrix(), scheduleData=getScheduleData())


@app.route('/summary', methods=['GET', 'POST'])
def summary():
    if request.method == "POST":
        runMaxPlus(np.array(getMatrixData()), np.array(
            getDelayMatrix()), getScheduleData(), int(getExpoVal()))
        return '/results'
    url = url_for('static', filename='matrixGraph.png', t=time.time())
    return render_template('summary.html', url=url, regularMatrix=getEpsMatrix(), stationData=getStationLabels(), delayMatrix=getDelayMatrix(), scheduleData=getScheduleData())


@app.route('/delays', methods=['GET', 'POST'])
def delays():
    if request.method == "POST":
        savedata('./data/delayMatrix.json', request)
        return 'Success'
    url = url_for('static', filename='matrixGraph.png', t=time.time())
    return render_template('delays.html', url=url, rawMatrix=getRawMatrix(), delayMatrix=getDelayMatrix())


@app.route('/results')
def results():
    return render_template('results.html', resultsData=getResults(), stationData=getStationLabels())


def savedata(path, request):
    with open(path, 'w') as outfile:
        json.dump(request.get_json(force=True), outfile)
        outfile.close()
