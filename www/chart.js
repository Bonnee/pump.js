// Load the Visualization API and the corechart package.


var dataPath = "log.csv";

window.onload = function(){
	
	google.charts.load('current', {'packages':['corechart']});
	
	getData(dataPath, function(d) { google.charts.setOnLoadCallback(drawChart($.csv.toArrays(d))); } );
	//google.charts.setOnLoadCallback(drawChart(data));
}

function drawChart(data) {
	console.log(data);
	
	var table = new google.visualization.DataTable();

	$.each(data, function (i, row) {
		console.log(row[0]+"  -  "+row[1]);
		table.addColumn('datetime', 'Time');
		table.addColumn('float', 'Level');
		table.addRow(new Date(row[0]), parseFloat(row[1]));
	});
        
    var options = {
		title: 'Company Performance',
		hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
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
