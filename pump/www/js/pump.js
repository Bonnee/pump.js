var ws = new WebSocket('ws://' + location.host + ':8080', 'echo-protocol');
ws.onopen = function(e) { console.log("Connected."); load(); }
ws.onmessage = function(e) { console.log(e.data) };

function load() {
    google.charts.load('current', {packages: ['corechart']});
}

function getChartData() {
    ws.send("current");
}