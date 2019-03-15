from dataService import getMatrixData, getDelayMatrix, getScheduleData, getExpoVal
import datetime as dt
import numpy as np
import json


def runMaxPlus(matrixData, delayMatrix, scheduleData, expoVal):
    global expo
    expo = expoVal
    setDelayMatrix(delayMatrix)
    setMatrix(matrixData, expo)
    setLastExited()

    schedule = getOrderedSchedule(scheduleData)
    scheduleLine = []
    for x in range(0, len(schedule)):
        scheduleLine.append(runRoute(schedule[x]))
    saveResults(scheduleLine)


def getOrderedSchedule(schedule):
    for x in range(0, len(schedule)):
        split = schedule[x][0].split(":")
        time = dt.datetime(2000, 1, 1, int(split[0]), int(split[1]))
        schedule[x][0] = time
    sortedArray = sorted(schedule, key=lambda x: (x[0]))
    return sortedArray


def runRoute(scheduleLine):
    time = scheduleLine[0]
    route = list(map(int, scheduleLine[1].split()))
    z = 0
    routeTimes = {str(z): str(time.time())[0:5]}
    z += 1
    for x in range(0, len(route)-1):
        val = getMatrixItem(x, route)
        time = time + dt.timedelta(minutes=val)
        routeTimes[str(z)] = str(time.time())[0:5]
        z += 1
        max = returnMax(time, stationsLastExited[x+1])
        stationsLastExited[x+1] = max + getStationOffSet()
        time = stationsLastExited[x+1]
        routeTimes[str(z)] = str(time.time())[0:5]
        z += 1
    allData = {"route": route, "routeTimes": routeTimes}
    return allData


def setLastExited():
    global stationsLastExited
    stationsLastExited = []
    for x in range(0, len(matrix)):
        stationsLastExited.append(dt.datetime(2000, 1, 1, 0, 0))


def getStationOffSet():
    return dt.timedelta(minutes=10)


def returnMax(a, b):
    if a.time() > b.time():
        return a
    return b


def saveResults(results):
    with open('./data/results.json', 'w') as outfile:
        data = json.dumps(results, indent=4, default=str)
        outfile.write(data)


def setMatrix(matrixData, expo):
    global matrix
    matrix = matrixData
    if expo == 0:
        if matrix.shape == delayMatrix.shape:
            matrix = np.add(matrix, delayMatrix)


def setDelayMatrix(delayMatrixData):
    global delayMatrix
    delayMatrix = delayMatrixData


def getMatrixItem(x, route):
    if expo == 0:
        # Return constant from delay matrix
        return matrix.item(route[x], route[x+1])
    else:
        # Generate delay using exponential distribution
        defVal = matrix.item(route[x], route[x+1])
        lambd = delayMatrix.item(route[x], route[x+1])
        y = np.exp(lambd)
        return y + defVal
