var ws = new WebSocket('ws://' + location.host + ':8080', 'echo-protocol');
ws.onopen = function(e) { console.log("Connected.") }
ws.onmessage = function(e) { console.log(e.data) };

window.onload = function() {
    
    //google.charts.load('current', {packages: ['corechart']});
}