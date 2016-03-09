var ws = new WebSocket('ws://arduino.local:8080', 'echo-protocol');
ws.onopen = function(e) { ws.send("Hello World"); }
ws.onmessage = function(evt) { alert(evt.data) };

window.onload = function() {
    
    //google.charts.load('current', {packages: ['corechart']});
}