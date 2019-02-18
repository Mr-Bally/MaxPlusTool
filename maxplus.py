from dataService import getMatrixData, getDelayMatrix, getScheduleData
import datetime as dt
import numpy as np
import json

#matrix = np.empty([2,2])
#stationsLastExited = []

def runMaxPlus():
    setMatrix()
    setLastExited()

    print(matrix)
    schedule = getOrderedSchedule()
    scheduleLine = []
    for x in range(0, len(schedule)):
        scheduleLine.append(runRoute(schedule[x]))
    saveResults(scheduleLine)

def getOrderedSchedule():
    schedule = getScheduleData()
    for x in range(0, len(schedule)):
        split = schedule[x][0].split(":")
        time = dt.datetime(2000, 1, 1, int(split[0]), int(split[1]))
        schedule[x][0] = time
    sortedArray = sorted(schedule, key=lambda x: (x[0]))
    return sortedArray

def runRoute(scheduleLine):
    time = scheduleLine[0]
    route = list(map(int, scheduleLine[1].split()))

    routeTimes = {"route": route, "startTime": str(time.time())[0:5]}
    for x in range(0, len(route)-1):
        stepNum = 's' + str(x+1)
        val = matrix.item(route[x], route[x+1])
        time = time + dt.timedelta(minutes=val)
        routeTimes[stepNum + "Arrival"] = str(time.time())[0:5]
        max = returnMax(time, stationsLastExited[x+1])
        stationsLastExited[x+1] = max + getStationOffSet()
        time = stationsLastExited[x+1]
        routeTimes[stepNum + "Departure"] = str(time.time())[0:5]
    return routeTimes

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

def setMatrix():
    global matrix
    matrix = np.array(getMatrixData())
    delayMatrix = np.array(getDelayMatrix())
    if matrix.shape == delayMatrix.shape:
        matrix = np.add(matrix, delayMatrix)
