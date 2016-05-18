var smartHome=angular.module('smartHome',[
	'ui.router',
	'smartHomeControllers','smartHomeServices',
	'smartHomeFilters','smartHomeDirectives']);



smartHome.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("");
  //
  // Now set up the states
  $stateProvider
    .state('index', {
      url: "/index",
      view:	{
      	'':{
      		templateUrl: 'index.html'
      	},
      	'left@index':{
      		templateUrl: 'tpls/left.html'
      	},
      	'right@index':{
      		templateUrl: 'tpls/lamp.html'
      	}
      	
      }
      
    })
    });