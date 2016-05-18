var roomDirectives=angular.module('roomDirectives', []);
	
roomDirectives.directive('normal',function(){
	return{
		restrict:'E',
		template:'<div class="alert alert-info">信息：<span ng-transclude></span></div>',
		 transclude: true
	}
});
roomDirectives.directive('warning',function(){
	return{
		restrict:'E',
		template:'<div class="alert alert-warning">警告：<span ng-transclude></span></div>',
		 transclude: true
	}
});
roomDirectives.directive('danger',function(){
	return{
		restrict:'E',
		template:'<div class="alert alert-danger">错误：<span ng-transclude></span></div>',
		 transclude: true
	}
});

