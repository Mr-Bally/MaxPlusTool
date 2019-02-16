$(document).ready(function () {
    var stationData = $('#stationData').val();
    var scheduleData = $('#scheduleData').val();
    var matrixData = $('#regularMatrix').val();
    var delayMatrix = $('#delayMatrix').val();
    populateStationTable(stationData);
    populateSchedule(scheduleData);
    populateMatrix('Regular matrix: ', matrixData);
    populateMatrix('Delay matrix: ', matrixData);
});

function populateStationTable(stationData) {
    var stations = stationData.match(/\'.+?\'/gm)
    $.each(stations, function (index, value) {
        stations[index] = value.replace(/[']/g, "")
    });
    for (var i = 0; i < stations.length; i++) {
        $("<tr><td>" + i + "</td><td>" + stations[i] + "</td></tr>").appendTo("#stationTable");
    }
}

function populateSchedule(scheduleData) {
    var schedules = scheduleData.match(/\'.+?\'/gm)
    $.each(schedules, function (index, value) {
        schedules[index] = value.replace(/[']/g, "")
    });
    for (var i = 0; i < schedules.length; i=i+2) {
        $("<tr><td>" + schedules[i] + "</td><td>" + schedules[i+1] + "</td></tr>").appendTo("#scheduleTable");
    }
}

function populateMatrix(title, matrix) {
    var found = matrix.match(/\[(\d+\s?)+\]/gm);
    var final = '';
    $.each(found, function( index, value ) {
        final= final + value.split(/[ ]+/).join(',') +'\n'
    });
    $("<p>" + title + final + "</p>").appendTo("#matrixDisplay");
}

$("#runButton").click(function () {
    var getUrl = window.location.href;
    $.ajax({
        url: getUrl,
        type: "POST",
        dataType: 'html',
        data: "Run",
        success: function (result) {
            window.location = result;
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
});