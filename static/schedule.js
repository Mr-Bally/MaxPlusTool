$(document).ready(function () {
    var stationData = $('#stationData').val();
    var scheduleData = $('#scheduleData').val();
    populateStationTable(stationData);
    if (scheduleData !== "{}") {
        populateSchedule(scheduleData);
    }
    addInputRow();
});

function populateStationTable(stationData) {
    var stations = stationData.match(/\'.+?\'/gm)
    $.each(stations, function (index, value) {
        stations[index] = value.replace(/[']/g, "")
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
        if (checkBox.length === 1) {
            $(this).remove();
        }
    });
});

$("#saveButton").click(function () {
    var input = getScheduleInput();
    if (checkInput(input)) {
        var getUrl = window.location.href;
        var json = finaliseInput(input);
        $.ajax({
            url: getUrl,
            type: "POST",
            dataType: 'text',
            data: json,
            success: function (result) {
                console.log(result);
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
        return;
    }
    alert("Please enter a valid route and time");
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
    var result = true;
    jQuery.each(input, function (index, pair) {
        if (!(checkTime(pair[0]) && checkStations(pair[1]))) {
            result = false;
        }
    });
    return result;
}

function checkTime(time) {
    var regex = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/;
    return regex.test(time);
}

function checkStations(stations) {
    if (checkStationsExist(stations)) {
        return checkRouteIsValid(stations);
    }
    return false;
}

function checkStationsExist(stationList) {
    var result = true
    if (stationList === "") {
        result = false;
    }
    var stationInts = $.map(stationList.split(' '), function (value) {
        return parseInt(value, 10);
    });
    var stationIds = getStationIds();

    jQuery.each(stationInts, function (index, value) {
        if (jQuery.inArray(value, stationIds) === -1) {
            result = false;
        }
    });
    return result;
}

function getStationIds() {
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
    jQuery.each(matrixRows, function (index, row) {
        matrixRowsArray[index] = row.split(",");
    });
    return checkRouteRow(routeArray, matrixRowsArray);
}

function checkRouteRow(route, matrix) {
    for (var x = 0; x < route.length - 1; x++) {
        if (matrix[route[x]][route[x + 1]] === "EPS") {
            return false;
        }
    }
    return true;
}

function finaliseInput(input) {
    var data = new Array();
    for (var x = 0; x < input.length; x++) {
        var index = x.toString();
        data[index] = input[x];
    }
    var json = { data };
    return JSON.stringify(data, null, 5);
}

function populateSchedule(scheduleData) {
    var schedule = scheduleData.match(/\'.+?\'/gm)
    $.each(schedule, function (index, value) {
        schedule[index] = value.replace(/[']/g, "")
    });
    for (var i = 0; i < schedule.length; i = i + 2) {
        $("<tr><td><input type='textbox' placeholder='e.g. 14:50' class='timeInput' value='" + schedule[i] + "'/></td><td><input type='textbox' placeholder='e.g. 2 4 5 1' class='stationInput' value='" + schedule[i + 1] + "'/></td><td><input type='checkbox'></input></td></tr> ").appendTo("#nameTable");
    }
}