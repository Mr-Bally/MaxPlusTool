$( document ).ready(function() {
    var resultData = $('#resultsData').val();
    populateResults(resultData);
});

function populateResults(results) {
    var objs = extractData(results)
    if (objs !== "{}") {
        objs.forEach(resultLine => {
            var routeString = formatRouteString(resultLine["route"])
            var allKeys = Object.keys(resultLine);
            allKeys.shift();
            var toAppend = "<tr><td>"+routeString+"</td>";
            $.each(allKeys, function(index, element) {
                toAppend = toAppend + "<td>"+ resultLine[element] + "</td>";
            });
            $(toAppend +"</tr> ").appendTo("#resultTable");
        });
    }
}

function extractData(data) {
    var res = data.replace(/'/g, "\"");
    var objs = JSON.parse(res);
    return objs;
}

function formatRouteString(route) {
    return route.toString().replace(/,/g,"-");
}