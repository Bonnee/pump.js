function main(data, $scope) {
	console.log("Loading Acquifer...");

	data = JSON.parse(JSON.stringify(data));
	$scope.data = data;

	$.getScript("//dygraphs.com/1.1.1/dygraph-combined.js", function() {

		for (var i = 0; i < $scope.data.data.level.length; i++) {
			$scope.data.data.level[i][0] = new Date($scope.data.data.level[i][0]);
		}

		/*data.data.pump1.forEach(function(value, key) {
			chartData.push([new Date(value.timestamp), , value.value * 100]);
		});*/

		var levelChart = new Dygraph(document.getElementById("levelChart"), $scope.data.data.level, {
			labels: ["Time", "Level"],
			valueRange: [108, 28],
			legend: 'always',
			animatedZooms: true,
		});
	});
}
