google.charts.load('current', {
    'packages': ['corechart', 'gauge']
});

var ws = new WebSocket('ws://' + location.host + ':8080', 'echo-protocol');

var Current;

ws.onopen = function (e) {
    console.log("Connected.");
    google.charts.setOnLoadCallback(load);
}

ws.onmessage = function (data) {
    msg = JSON.parse(data.data);
    msg.data = JSON.parse(msg.data);

    if (msg.id == 'req') {
        console.log(msg.data[msg.data.length - 1]);
        Current.draw(msg.data[msg.data.length - 1]);

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
    } else if (msg.id = 'upd') {
        Current.refresh(msg.data);
    }
};

ws.onclose = function (e) {
    alert("Connection lost.");
    location.reload();
};

function load() {
    getChartData();

    Current = new function () {
        this.table = "";
        this.options = {};
        this.chart = "";
        this.formatter = "";

        this.draw = function (data) {
            table = new google.visualization.arrayToDataTable([
         ['Label', 'Value'], ['Level', parseFloat(data[1])]]);

            formatter = new google.visualization.NumberFormat({
                suffix: 'cm'
                , pattern: '#.##'
            });

            formatter.format(table, 1);

            options = {
                width: '100%'
                , height: '100%'
                , redFrom: 30
                , redTo: 0
                , yellowFrom: 40
                , yellowTo: 30
                , minorTicks: 5
                , max: 0
                , min: 108
            , };

            chart = new google.visualization.Gauge($('#currentChart').get(0));
            chart.draw(table, options);
            $('#currentText').text(new Date(data[0]).toLocaleString());
        };

        this.refresh = function (data) {
            table = new google.visualization.arrayToDataTable([
         ['Label', 'Value'], ['Level', parseFloat(data[1])]]);
            formatter.format(table, 1);
            chart.draw(table, options);
            $('#currentText').text(new Date(data[0]).toLocaleString());
        };
    }
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