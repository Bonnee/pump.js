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
    google.charts.load('current', {
        packages: ['corechart']
    });

}

function getChartData() {
    console.log('Requesting current data')
    ws.send('levHistory');
}

function drawChart(dataTable, chart, options) {

    chart.draw(dataTable, options);
}