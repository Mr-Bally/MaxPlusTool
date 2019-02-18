$("#inputMatrix").click(function () {
    var found = getMatrixInput();
    if (checkInput(found)) {
        addStations(found.length);
    } else {
        window.alert("Please ensure you have entered a valid matrix");
    }

});

function getMatrixInput() {
    var matrix = $.trim($('#matrixInput').val());
    var regex = /\[((EPS|\d+)\,?)+\]/gm;
    return matrix.match(regex);
}

$("#saveButton").click(function () {
    var matrixInput = getMatrixInput();
    var stationData = getStationNames();
    if (checkInput(matrixInput)) {
        var epsMatrix = getMatrixInput();
        var matrixData = finaliseMatrix(matrixInput)
        var allData = [{ matrixData }, { stationData }, { matrixInput }, { epsMatrix }];
        var jsonData = JSON.stringify(allData);
        postJson(jsonData);
    }
});

function addStations(count) {
    var totalRows = $('#nameTable tr').length;
    if (count < totalRows) {
        var toRemove = totalRows - count;
        for (x = (toRemove - 1); x < toRemove; x++) {
            var row = $("#nameTable").find("tr").last();
            row.remove();
        }
    } else {
        for (i = totalRows; i < count; i++) {
            $("<tr id='row'" + count + "><td>" + (i + 1) + "</td><td><input type='textbox' value='" + (i + 1) + "'/></td></tr> ").appendTo("#nameTable");
        }
    }
}

function checkInput(matches) {
    var rowCount = matches.length;
    var regex = /(EPS|\d+)/gm;
    for (y = 0; y < rowCount; y++) {
        var rowMatches = matches[y].match(regex);
        if (rowMatches.length !== rowCount) {
            return false;
        }
    }
    return true;
}

function getStationNames() {
    var table = $('#nameTable tr');
    var data = new Array;
    data = {};
    for (var i = 0; i < table.length; i++) {
        var inputVal = table[i].cells[1].firstChild.value;
        if (inputVal === "") {
            inputVal = (i+1).toString();
        }
        data[i] = inputVal;
    }
    return data;
}

function postJson(json) {
    var getUrl = window.location.href;
    $.ajax({
        url: getUrl,
        type: "POST",
        dataType: 'text',
        data: json,
        success: function (result) {
            displayGraph(result);
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function finaliseMatrix(matrixData) {
    var final = new Array();
    final = {};
    for (var x = 0; x < matrixData.length; x++) {
        var newRow = matrixData[x].replace("EPS", "0");
        final[x]=JSON.parse(newRow);
    }
    return final;
}

function displayGraph(url) { 
    $('#graphDiv').html('<img src='+url+'/>')
}

$( document ).ready(function() {
    var matrixData = $('#matrixData').val();
    addExistingMatrix(matrixData);
    var stationData = $('#stationData').val();
    addExistingStaionNames(stationData);
});

function addExistingMatrix(matrix) {
    var res = matrix.replace(/'/g, "\"");
    var dataArray = JSON.parse(res);
    var final = '';
    $.each(dataArray, function( index, value ) {
        final= final + value +'\n'
    });
    $('#matrixInput').val(final);
}

function addExistingStaionNames(names) {
    var stations = names.match(/\'.+?\'/gm) 
    $.each(stations, function( index, value ) {
        stations[index] = value.replace(/[']/g, "")
    });
    for (var i = 0; i < stations.length; i++) {
        $("<tr id='row'" + i + "><td>" + (i+1) + "</td><td><input type='textbox' value='" + stations[i] + "'/></td></tr> ").appendTo("#nameTable");
    }
}