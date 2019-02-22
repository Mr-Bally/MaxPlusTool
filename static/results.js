$( document ).ready(function() {
    var resultData = $('#resultsData').val();
    populateResults(resultData);
});

function populateResults(results) {
    var objs = extractData(results);
    var lineNum = 0;
    if (objs !== "{}") {
        var routeNum = 0;
        objs.forEach(route => {
            routeNum++;
            var timeIndex = 0;
            for(var x = 0; x < route.route.length-1; x++) {
                addInputRow();
                lineNum++;
                var tableData = $('#resultTable tr:last');
                var times = Object.values(route.routeTimes);
                tableData[0].cells[0].innerHTML = lineNum;
                tableData[0].cells[1].innerHTML = routeNum;
                tableData[0].cells[2].innerHTML = getLineSegment(route.route[x], route.route[x+1]);
                tableData[0].cells[3].innerHTML = getStation(route.route[x]);
                tableData[0].cells[4].innerHTML = getStation(route.route[x+1]);
                tableData[0].cells[5].innerHTML = times[timeIndex];
                tableData[0].cells[6].innerHTML = times[timeIndex+1];
                tableData[0].cells[7].innerHTML = getOffset(times[timeIndex+1],times[timeIndex+2]);
                tableData[0].cells[8].innerHTML = times[timeIndex+2];
                timeIndex = timeIndex + 2; 
            }
        });
    }
}
function getStation(stationId) {
    var stationData = $('#stationData').val();
    var stations = getStationValues(extractData(stationData));
    return stations[stationId];
}

function getStationValues(stationData) {
    var toReturn = [];
    for (var x = 1; x < stationData.length; x += 2) {
        toReturn.push(stationData[x]);
    }
    return toReturn;
}

function extractData(data) {
    var res = data.replace(/'/g, "\"");
    var objs = JSON.parse(res);
    return objs;
}

function formatRouteString(route) {
    return route.toString().replace(/,/g,"-");
}

function addInputRow() {
    $("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr> ").appendTo("#resultTable");
}

function getOffset(timeOne, timeTwo) {
    var regex = /\d{2}/gm;
    var timeArrOne = timeOne.match(regex);
    var timeArrTwo = timeTwo.match(regex);
    var timeOneTotal = (parseInt(timeArrOne[0]) * 60) + parseInt(timeArrOne[1]);
    var timeTwoTotal = (parseInt(timeArrTwo[0]) * 60) + parseInt(timeArrTwo[1]);
    return timeTwoTotal - timeOneTotal;
}

function getLineSegment(stationOne, stationTwo) {
    var stationData = $('#stationData').val();
    var stations = getStationValues(extractData(stationData));
    var matrix = createMatrix(stations.length);
    return matrix[stationOne][stationTwo];
}

function createMatrix(size) {
    var matrix = [];
    var value = 0;
    for(var i=0; i < size; i++) {
        var newArray = []
        for(var y = 0; y < size; y++) {
            newArray.push(value);
            value++;
        }
        matrix.push(newArray);
    }
    return matrix;
}