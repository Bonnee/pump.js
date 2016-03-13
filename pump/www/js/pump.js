var ws = new WebSocket('ws://' + location.host + ':8080', 'echo-protocol');
ws.onopen = function(e) { console.log("Connected."); load(); }
ws.onmessage = function(e) { console.log(JSON.parse(e.data)) };

var cha = C$();

function load() {
    getChartData();
    google.charts.load('current', {packages: ['corechart']});
    
}

function getChartData() {
    console.log('Requesting current data')
    ws.send('levHistory');
}