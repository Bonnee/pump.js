function main($scope) {
	console.log("Loading Acquifer...");

	//var Moment;
	$.getScript($scope.$state.current.path + "moment.min.js", function() {
		//Moment = moment;
		console.log("what a moment");

		$scope.getHours = function(n) {
			console.log("hours");
			var total = 0;

			var temp;
			for (var i = 0; i < $scope.data.data["pump" + n].length; i++) {
				var value = $scope.data.data["pump" + n][i];
				if (value) {
					if (value[1] == 1) {
						temp = new Date(value[0])
					} else if (value[1] == 0) {
						total += new Date(value[0]).getTime() - temp.getTime();
					}
				} else {
					total += new Date().getTime() - temp.getTime();
				}
			}

			console.log(n + ": " + moment.duration(total));
			return moment.duration(total).humanize();
		}

		$scope.$apply();
	});


	$('#pump').on('show.bs.modal', function(e) {
		var id = e.relatedTarget.dataset.id;

		$("#hours").text($scope.getHours(id));
		// Do some stuff w/ it.
	});



	/* ---------- DATA MANAGEMENT ---------- */
	function lastDate() { // Returns the last date in the series
		return $scope.data.data.level[$scope.data.data.level.length - 1][0];
	}

	function setDates() { // Parses the levels and sets the Date object
		for (var i = 0; i < $scope.data.data.level.length; i++) {
			$scope.data.data.level[i][0] = new Date($scope.data.data.level[i][0]);
		}
	}

	$scope.update = function() { // Updates the data
		$scope.refresh(function(data) {
			if (data) {
				$scope.data = data;
				setDates();

				levelChart.updateOptions({
					file: $scope.data.data.level
				});
				$scope.zoom(0);
			}
		});
	}

	// Checks if n# pump is running
	$scope.isRunning = function(n) {
		return $scope.data.data["pump" + n][$scope.data.data["pump" + n].length - 1][1] == 1;
	}

	/* ---------- ZOOM ---------- */
	var zoomed = 86400;
	$scope.isZoomed = function(range) {
		return range == zoomed;
	}

	$scope.zoom = function zoom(range) {
		var w = levelChart.xAxisRange()

		var updatedRange;
		if (range == 0)
			updatedRange = [Date.parse(lastDate()) - (w[1] - w[0]), Date.parse(lastDate())];
		else {
			updatedRange = [w[1] - range * 1000, w[1]];
			zoomed = range;
		}

		levelChart.updateOptions({
			dateWindow: updatedRange

		});
	}

	/* ---------- READY ---------- */
	function ready() {

		// Set pumps annotations
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
		setInterval($scope.update, 120000);
		console.log('done.');
	}

	/* ---------- CHART ---------- */

	setDates();
	var range = [new Date().setDate(lastDate().getDate() - 1), lastDate()];

	var levelChart; // The chart object
	$.getScript($scope.$state.current.path + "dygraph-combined.js", function() {
		levelChart = new Dygraph(document.getElementById("levelChart"), $scope.data.data.level, {
			labels: ['Time', 'Level'],
			valueRange: [108, 28],
			legend: 'always',
			animatedZooms: true,
			color: '#337ab7',
			ylabel: 'Level [cm]',
			dateWindow: range
		});

		levelChart.ready(ready);
	});
}
