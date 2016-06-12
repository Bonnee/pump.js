function main(data, $scope) {
	console.log("Loading Acquifer...");

	$scope.data = data;

	$.getScript("//dygraphs.com/1.1.1/dygraph-combined.js", function() {

		var chartData = [];

		data.data.level.forEach(function(value, key) {
			chartData.push([new Date(value.timestamp), value.value]);
		});

		/*data.data.pump1.forEach(function(value, key) {
			chartData.push([new Date(value.timestamp), , value.value * 100]);
		});*/

		console.log(chartData);

		var levelChart = new Dygraph(document.getElementById("levelChart"), chartData, {
			labels: ["Time", "Level"],
			valueRange: [108, 28],
			legend: 'always',
			animatedZooms: true,
		});
	});
}
