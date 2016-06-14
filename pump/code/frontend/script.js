function main(data, $scope) {
	console.log("Loading Acquifer...");

	data = JSON.parse(JSON.stringify(data));
	$scope.data = data;

	$.getScript("//dygraphs.com/1.1.1/dygraph-combined.js", function() {

		for (var i = 0; i < $scope.data.data.level.length; i++) {
			$scope.data.data.level[i][0] = new Date($scope.data.data.level[i][0]);
		}

		var levelChart = new Dygraph(document.getElementById("levelChart"), $scope.data.data.level, {
			labels: ['Time', 'Level'],
			valueRange: [108, 28],
			legend: 'always',
			animatedZooms: true,
		});

		levelChart.ready(function() {
			var ann = [];

			console.log($scope.data.data.level[50][0]);
			ann.push({
				series: 'Level',
				x: new Date($scope.data.data.level[50][0]),
				shortText: 'P',
				text: 'Testo'
			});

			if ($scope.data.data.pump1) {
				$scope.data.data.pump1.forEach(function(value, key) {
					ann.push({
						series: 'Level',
						x: Date.parse(value[0]),
						shortText: "1"
					});
					if (value[1] == 1)
						ann[ann.length - 1].text = "1st Pump On";
					else
						ann[ann.length - 1].text = "1st Pump Off";
				});
			}

			if ($scope.data.data.pump2) {
				$scope.data.data.pump2.forEach(function(value, key) {
					ann.push({
						series: 'Level',
						x: Date.parse(value[0]),
						shortText: "2"
					});
					if (value[1] == 1)
						ann[ann.length].text = "2nd Pump On";
					else
						ann[ann.length].text = "2nd Pump Off";
				});
			}
			console.log(ann);
			levelChart.setAnnotations(ann);
		});
	});
}
