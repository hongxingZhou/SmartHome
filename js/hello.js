var mymodule=angular.module('helloangular',[]);

mymodule.controller('hello',['$scope',
	function ($scope){
		$scope.greeting={
			text:'hello'
		};
	}
]);

