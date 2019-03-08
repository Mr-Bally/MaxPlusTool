import matplotlib.pyplot as plt
import networkx as nx
import numpy as np
import json
import os
from PIL import Image
import time

def getDirectedGraph():
    removeOldFile()
    generateGraph()

def generateGraph():
    npMatrix = getMatrixData()
    A = np.matrix(npMatrix)
    DG = nx.from_numpy_matrix(A, create_using=nx.MultiDiGraph)

    options = {
        'node_color': 'red',
        'node_size': 100,
        'width': 3,
    }
    pos = nx.circular_layout(DG)
    labels = getStationLabels()
    i = iter(labels)
    labels = dict(zip(i, i))
    plt.clf()
    plt.subplot(222)
    nx.draw_networkx_labels(DG, pos, labels, font_size=8, font_color='b')
    nx.draw_circular(DG, **options)
    plt.tight_layout()
    plt.savefig('./static/matrixGraph', bbox_inches='tight')
    plt.close()

def getMatrixData():
    with open("./data/matrixData.json", 'r') as f:
        rawData = f.read()
        datastore = json.loads(rawData)
        f.close()
    matrixData = datastore[0]['matrixData']
    dictLength = len(matrixData)
    order = []
    for x in range(0, dictLength):
        order.append(str(x))

    npMatrix = np.array([matrixData[i] for i in order])
    return npMatrix

def getStationLabels():
    with open("./data/matrixData.json", 'r') as f:
        rawData = f.read()
        datastore = json.loads(rawData)
        f.close()
    stationData = datastore[1]['stationData']

    stationList = []
    for key, value in stationData.items():
        stationList.append(int(key))
        stationList.append(value)

    return stationList

def removeOldFile():
    strFile = "./static/matrixGraph.png"	   
    if os.path.isfile(strFile):	    
        os.remove(strFile)

def getRawMatrix():
    with open("./data/matrixData.json", 'r') as f:
        rawData = f.read()
        datastore = json.loads(rawData)
        f.close()
    rawMatrix = datastore[2]['matrixInput']

    return rawMatrix

def getScheduleData(): 
    with open("./data/schedule.json", 'r') as f:
        rawData = f.read()
        datastore = json.loads(rawData)
        f.close()

    return datastore

def getDelayMatrix(): 
    with open("./data/delayMatrix.json", 'r') as f:
        rawData = f.read()
        datastore = json.loads(rawData)
        f.close()
    if datastore == {}:
        return datastore
    matrixData = datastore[1]['matrixJson']
    dictLength = len(matrixData)
    order = []
    for x in range(0, dictLength):
        order.append(str(x))

    npMatrix = np.array([matrixData[i] for i in order])
    return npMatrix

def getResults(): 
    with open("./data/results.json", 'r') as f:
        rawData = f.read()
        datastore = json.loads(rawData)
        f.close()

    return datastore

def removeOldMatrices():
    with open("./data/results.json", 'w') as r:
        r.write('{}')
    with open("./data/schedule.json", 'w') as s:
        s.write('{}')
    with open("./data/delayMatrix.json", 'w') as d:
        d.write('{}')

def getEpsMatrix():     
    with open("./data/matrixData.json", 'r') as f:
        rawData = f.read()
        datastore = json.loads(rawData)
        f.close()
    matrixData = datastore[3]['epsMatrix']
    return matrixData

def getExpoVal():
    with open("./data/delayMatrix.json", 'r') as f:
        rawData = f.read()
        datastore = json.loads(rawData)
        f.close()
    return datastore[0]['expo']

