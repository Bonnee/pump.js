google.charts.load('current', {
    'packages': ['corechart']
});

var ws = new WebSocket('ws://' + location.host + ':8080', 'echo-protocol');

ws.onopen = function (e) {
    console.log("Connected.");
    google.charts.setOnLoadCallback(load);
}

ws.onmessage = function (e) {
    console.log(JSON.parse(e.data))
};

ws.onclose = function (e) {
    console.log("Connection lost.")
}

function load() {
    getChartData();
    var data = ["2016-03-13T13:13:19+0100", "77.79\r"];
    drawChart(data, new google.visualization.ColumnChart($('#currentLevel').get(0)))
}

function getChartData() {
    console.log('Requesting current data')
    ws.send('levHistory');
}

function drawChart(data, chart, options) {
    var table = google.visualization.arrayToDataTable(data);

    chart.draw(table, options);
}