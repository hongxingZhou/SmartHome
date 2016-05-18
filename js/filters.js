var roomFilters=angular.module('roomFilters', []);


//city选择过滤器
roomFilters.filter('cityFilter',function(){
	return function(data,parent){
		var filterData = [];
		angular.forEach(data,function(city){
			if(city.parent==parent){
				filterData.push(city);
			}
		});
		return filterData;
	}
});
	