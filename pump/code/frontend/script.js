function main(data, $scope) {
	console.log("Loading Acquifer...");

	data = JSON.parse(JSON.stringify(data));
	$scope.data = data;

	var levelChart;
	var now = new Date();

	$.getScript($scope.$state.current.path + "dygraph-combined.js", function() {
		levelChart = new Dygraph(document.getElementById("levelChart"), $scope.data.data.level, {
			labels: ['Time', 'Level'],
			valueRange: [108, 28],
			legend: 'always',
			animatedZooms: true,
			color: '#337ab7',
			ylabel: 'Level [cm]',
			dateWindow: [new Date().setDate(now.getDate() - 1), now]
		});

		levelChart.ready(annotations);
	});

	for (var i = 0; i < $scope.data.data.level.length; i++) {
		$scope.data.data.level[i][0] = new Date($scope.data.data.level[i][0]);
	}


	function annotations() {
		var ann = [];

		if ($scope.data.data.pump1) {
			$scope.data.data.pump1.forEach(function(value, key) {
				var state = value[1] == 1 ? "on" : "off";
				ann.push(getAnn('Level', Date.parse(value[0]), "1", "pump1 " + state, "1st Pump " + state));
			});
		}

		if ($scope.data.data.pump2) {
			$scope.data.data.pump2.forEach(function(value, key) {
				var state = value[1] == 1 ? "on" : "off";
				ann.push(getAnn('Level', Date.parse(value[0]), "2", "pump2 " + state, "2nd Pump " + state));
			});
		}
		levelChart.setAnnotations(ann);

		function getAnn(series, x, shortText, cssClass, text) {
			return {
				series: series,
				x: x,
				shortText: shortText,
				cssClass: cssClass,
				text: text
			}
		}

		console.log('done.')
	}
}
