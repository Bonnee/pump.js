function main($scope) {
	console.log("Loading Acquifer...");
	$scope.date = new Date();
	$.getScript($scope.$state.current.path + "moment.min.js", function () {

		// If bDate is equal to eDate it only returns the time
		$scope.getDateFormat = function (bDate, eDate) {
			var beginDate = new Date(bDate);
			var endDate = new Date(eDate);

			if (beginDate.getDate() == endDate.getDate())
				return 'HH:mm:ss';
			else
				return 'dd/MM/yy HH:mm';
		}

		$scope.getTime = function (n) {
			var total = 0;

			var temp;
			for (var i = 0; i < $scope.data.data["pump" + n].length; i++) {
				var value = $scope.data.data["pump" + n][i];

				if (value[1] == 1) {
					temp = new Date(value[0]);
					if (!($scope.data.data["pump" + n][i + 1]))
						total += new Date().getTime() - temp.getTime();
				} else if (value[1] == 0) {
					total += new Date(value[0]).getTime() - temp.getTime();
				}
			}

			return moment.duration(total);
		}

		$scope.getCycles = function (n) {
			var total = 0;

			for (var i = 0; i < $scope.data.data["pump" + n].length; i++) {
				var value = $scope.data.data["pump" + n][i];

				if (value[1] == 0) {
					total += 1;
				}
			}
			return total;
		}

		$scope.pumpInfo = function () {
			var info = [];

			for (var n = 1; n <= 2; n++) {
				var time = $scope.getTime(n);
				var cycles = $scope.getCycles(n);
				var avgTime = moment.duration(time / cycles);

				info.push([
					{
						desc: "Working time",
						value: moment.utc(time.asMilliseconds()).format('HH:mm:ss')
				},
					{
						desc: "Power cycles",
						value: cycles
				}, {
						desc: "Average power on time",
						value: moment.utc(avgTime.asMilliseconds()).format('mm:ss')
				}
			]);
			}

			return info;
		}

		$scope.pumpStat = $scope.pumpInfo();

		$scope.$apply();
	});

	$scope.setSel = function (n) {
		$scope.selN = n;
	}

	/*$('#pump').on('show.bs.modal', function(e) {
		//$scope.selN = e.relatedTarget.dataset.id;
	});*/



	/* ---------- DATA MANAGEMENT ---------- */
	function lastDate() { // Returns the last date in the series
		return $scope.data.data.level[$scope.data.data.level.length - 1][0];
	}

	function setDates() { // Parses the levels and sets the Date object
		for (var i = 0; i < $scope.data.data.level.length; i++) {
			$scope.data.data.level[i][0] = new Date($scope.data.data.level[i][0]);
		}
	}

	$scope.update = function () { // Updates the data
		$scope.refresh(function (data) {
			if (data) {
				$scope.data = data;
				setDates();

				levelChart.updateOptions({
					file: $scope.data.data.level
				});
				annotations();
				$scope.zoom(0);
				$scope.pumpStat = $scope.pumpInfo();
			}
		});
	}

	// Checks if n# pump is running
	$scope.isRunning = function (n) {
		return $scope.data.data["pump" + n][$scope.data.data["pump" + n].length - 1][1] == 1;
	}

	/* ---------- ZOOM ---------- */
	var zoomed = 86400;
	$scope.isZoomed = function (range) {
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
		annotations();

		setInterval($scope.update, 120000);
		console.log('done.');
	}

	function annotations() {
		var ann = [];

		if ($scope.data.data.pump1) {
			$scope.data.data.pump1.forEach(function (value, key) {
				var state = value[1] == 1 ? "on" : "off";
				ann.push(getAnn('Level', Date.parse(value[0]), "1", "pump1 " + state, "1st Pump " + state));
			});
		}

		if ($scope.data.data.pump2) {
			$scope.data.data.pump2.forEach(function (value, key) {
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
	}

	/* ---------- CHART ---------- */

	setDates();
	var range = [new Date().setDate(lastDate().getDate() - 1), lastDate()];

	var levelChart; // The chart object
	$.getScript($scope.$state.current.path + "dygraph-combined.js", function () {
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
