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
        $("<tr id='row'" + i + "><td>" + i + "</td><td>" + stations[i] + "</td></tr>").appendTo("#stationTable");
    }
}

function addInputRow() {
    $("<tr><td><input type='textbox'/></td><td><input type='textbox'/></td><td><input type='checkbox'></input></td></tr> ").appendTo("#nameTable");
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