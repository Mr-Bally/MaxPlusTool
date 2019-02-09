$( document ).ready(function() {
    var stationData = $('#stationData').val();
    populateStationTable(stationData);
    addInputRow();
});

function populateStationTable(stationData) {
    var stations = stationData.match(/\'.+?\'/gm) 
    $.each(stations, function( index, value ) {
        stations[index]= value.replace(/[']/g, "")
    });
    for (var i = 0; i < stations.length; i++) {
        $("<tr id='row'" + i + "><td class='stationId'>" + i + "</td><td>" + stations[i] + "</td></tr>").appendTo("#stationTable");
    }
}

function addInputRow() {
    $("<tr><td><input type='textbox' placeholder='e.g. 14:50' class='timeInput'/></td><td><input type='textbox' placeholder='e.g. 2 4 5 1' class='stationInput'/></td><td><input type='checkbox'></input></td></tr> ").appendTo("#nameTable");
}

$("#addRowButton").click(function () {
    addInputRow()
});

$("#deleteButton").click(function () {
    $('#nameTable tr').each(function (index, row) {
        var row = $(row);
        var checkBox = row.find('input:checked');
        if (checkBox.length===1) {
            $(this).remove();
        }
    });
});

$("#saveButton").click(function () {
    var input = getScheduleInput();
    if(checkInput(input)) {
        //post json function
    }
});

function getScheduleInput() {
    var data = []
    $('#nameTable tr').each(function (index, row) {
        var row = $(row);
        var timeInput = $(row).find('.timeInput').val();
        var stationInput = $(row).find('.stationInput').val()
        data.push([timeInput, stationInput]);
    });
    return data;
}

function checkInput(input) {
    jQuery.each(input, function(index, pair) {
        if (!(checkTime(pair[0]) && checkStations(pair[1])))
        {
            return false;
        }
    });
    return true;
}

function checkTime(time) {
    var regex = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/;
    return regex.test(time);
}

function checkStations(stations) {
    if(checkStationsExist(stations)) {
        return checkRouteIsValid(stations);
    }
    return false;
}

function checkStationsExist(stationList) {
    var stationInts = $.map(stationList.split(' '), function(value){
        return parseInt(value, 10);
    });
    var stationIds = getStationIds();

    jQuery.each(stationInts, function(index, value) {
        if(jQuery.inArray(value, stationIds)===-1) {
            return false;
        }
    });
    return true;
}

function getStationIds(){
    var stationIdStrings = [];
    $('#stationTable tr').each(function (index, row) {
        stationIdStrings.push($(row).find('.stationId').html());
    });
    var stationIds = stationIdStrings.map(Number);
    return stationIds;
}

function checkRouteIsValid(route) {
    var routeArray = route.split(" ").map(Number);
    var matrix = $('#matrixData').val().slice(2);;
    var matrixRows = matrix.match(/((EPS|\d+)\,?)+/gm);
    var matrixRowsArray = [];
    jQuery.each(matrixRows, function(index, row) {
        matrixRowsArray[index] = row.split(",");
    });
    return checkRouteRow(routeArray, matrixRowsArray);
}

function checkRouteRow(route, matrix) {
    for(var x = 0; x < route.length; x++) {
        var from = matrix[route[x]][route[x]];
        var to = matrix[route[route[x+1]]];
    }
}
/*
0: (3) ["EPS", "1", "3"]
1: (3) ["1", "EPS", "3"]
2: (3) ["1", "2", "EPS"]

["2", "2"]
0: "2"
1: "2"

*/