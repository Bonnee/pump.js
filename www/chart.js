// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

var dataPath = "log.csv";
var values;


google.charts.setOnLoadCallback(setInterval(getData(dataPath, function(data) { values = $.csv.toArrays(data); drawChart(); }), 10000));

function drawChart() {
	var data = new google.visualization.DataTable();
	

	$.each(values, function (i, row) {
		data.addColumn(new Date(row[0]));
		data.addRow(parseFloat(row[1]));
	});
        
    var options = {
		title: 'Company Performance',
		hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
		vAxis: {minValue: 0}
	};

	var chart = new google.visualization.AreaChart(document.getElementById('chartArea'));
	chart.draw(data, options);
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
