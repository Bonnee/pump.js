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
        drawCurrent(msg.data[msg.data.length - 1]);

        drawChart(msg.data, new google.visualization.LineChart($('#historyLevel').get(0)), {
            vAxis: {
                direction: -1
                , viewWindow: {
                    max: 108
                    , min: 0
                }
            }
            , legend: 'none'
            , curveType: 'function'
        })
    } else
        drawCurrent(msg.data);
};

ws.onclose = function (e) {
    console.log("Connection lost.")
}

function drawCurrent(data) {
    console.log(data);
    drawChart([[data, [data[1]]]]
        , new google.visualization.ColumnChart($('#currentChart').get(0)), {
            legend: 'none'
            , vAxis: {
                direction: -1
                , viewWindow: {
                    max: 108
                    , min: 0
                }
            }
            , hAxis: {
                textPosition: 'none'
            }
        , });

    $('#currentText').text(new Date(msg.data[msg.data.length - 1][0]).toLocaleString());
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