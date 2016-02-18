var dataPath = "log.csv"

google.charts.setOnLoadCallback( function() {
	getData(dataPath, function(a) { 
		drawChart($.csv.toArrays(a));
	})
});



function drawChart(data) {
	var table = new google.visualization.DataTable();

	table.addColumn('datetime', 'Time');
	table.addColumn('number', 'Level');

	$.each(data, function (i, row) {
		table.addRow([new Date(row[0]), parseFloat(row[1])]);
	});
        
    var options = {
		title: 'Water Level',
		hAxis: {title: 'Date',  titleTextStyle: {color: '#333'}},
		vAxis: {minValue: 0}
	};

	var chart = new google.visualization.AreaChart(document.getElementById('chartArea'));
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


