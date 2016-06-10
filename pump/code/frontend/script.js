function main(data, $scope) {
	console.log("Loading Acquifer...");

	$scope.data = data;

	$.getScript("http://momentjs.com/downloads/moment.js", function() {
		$.getScript("//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.min.js", function() {
			var ctx = $("#myChart");

			var x = [];
			var y = [];

			console.log($scope);

			data.data.level.forEach(function(value, key) {
				x.push(value.timestamp);
				y.push(value.value);
			});

			console.log(x);

			var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: x,
					datasets: [
						{
							label: 'Level [cm]',
							data: y,
							backgroundColor: 'rgba(54, 162, 235, 0.2)',
							borderColor: 'rgba(54, 162, 235, 1)',
							borderWidth: 1
                }
            ]
				},
				options: {
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true
							}
          }],
						xAxes: [{
							type: 'time'
						}]
					}
				}
			});
		});
	});
}
