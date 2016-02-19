var dataPath = "log.csv";

google.charts.setOnLoadCallback(function() { parse(); setInterval(parse, 60000) }); 

function parse() {
	getData(dataPath, function(a) { 
		drawChart($.csv.toArrays(a));
	})
}

function drawChart(data) {
	drawHistory(data);
	drawCurrent(data);
}

function drawHistory(data) {
	var table = new google.visualization.DataTable();
	table.addColumn('datetime', 'Time');
	table.addColumn('number', 'Level');

	$.each(data, function (i, row) {
		table.addRow([new Date(row[0]), parseFloat(row[1])]);
	});

	var options = {
		title: 'Level History',
		hAxis: {title: 'Date',  titleTextStyle: {color: '#333'}},
		vAxis: {minValue: 0, maxValue: 30}
	};

	var chart = new google.visualization.AreaChart(document.getElementById('historyChart'));
	chart.draw(table, options);
}

function drawCurrent(data) {
	var table =google.visualization.arrayToDataTable([
          ['Dinosaur', 'Length'],
          ['Acrocanthosaurus (top-spined lizard)', data[data.length-1,1]]]);

        var options = {
          title: 'Water Level [cm]',
          legend: { position: 'none' },
	  vAxis: {maxValue: 30, minValue:0}
        }; 
	var chart = new google.visualization.Histogram(document.getElementById('currentChart'));
	chart.draw(table, options);
}


function getData (url, action) {
	var req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.onreadystatechange = function() {
		if(req.readyState == 4) {
			if(req.status == 200) {
				action(req.responseText);
			}
		}
	};
	req.send(null);
}