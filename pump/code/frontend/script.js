angular.module('OsO').controller('device', function($scope) {
	$scope.max = 108;

	$scope.random = function() {
		var value = Math.floor(Math.random() * 100 + 1);

		$scope.level = value;
	};

	$scope.random();
});
