google.charts.load('current', {
    'packages': ['corechart']
});

var ws = new WebSocket('ws://' + location.host + ':8080', 'echo-protocol');

ws.onopen = function (e) {
    console.log("Connected.");
    google.charts.setOnLoadCallback(load);
}

ws.onmessage = function (data) {
    msg = JSON.parse(data.data);
    msg.data = JSON.parse(msg.data);

    if (msg.id == 'req') {
        /*drawChart(msg.data[JSON.parse(msg.data).length], new google.visualization.ColumnChart($('#currentLevel').get(0)))*/

        $('#currentLevel').html('<h1>' + parseFloat(msg.data[msg.data.length - 1][1]) + 'cm</h1>');

        drawChart(msg.data, new google.visualization.LineChart($('#historyLevel').get(0)), {
            vAxis: {
                direction: -1
                , viewWindow: {
                    max: 108
                    , min: 0
                }
            }
            , curveType: 'function'
        })
    } else
        $('#currentLevel').html('<h1>' + parseFloat(msg.data[1]) + 'cm</h1>');
};

ws.onclose = function (e) {
    console.log("Connection lost.")
}

function load() {
    getChartData();
}

function getChartData() {
    console.log('Requesting current data')
    ws.send('levHistory');
}

function drawChart(data, chart, options) {
    console.log("Plotting chart");
    var table = new google.visualization.DataTable();
    table.addColumn('datetime', 'Date');
    table.addColumn('number', 'Level');

    data = data;

    for (var i = 0; i < data.length; i++) {
        table.addRows([[new Date(data[i][0]), parseFloat(data[i][1])]]);
    }

    chart.draw(table, options);
}