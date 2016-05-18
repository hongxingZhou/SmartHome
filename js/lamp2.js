var roomModule=angular.module('roomModule',['ngRoute','roomController','roomFilters','roomDirectives']);

roomModule.config(function($routeProvider){
	$routeProvider.
	when('/',{
		// controller: lampContrl,
		templateUrl:'tpls/lamp.html'
	}).
	when('/lamp',{
		// controller: lampContrl,
		templateUrl:'tpls/lamp.html'
	}).
	when('/water',{
		// controller: waterContrl,
		templateUrl:'tpls/water.html'
	}).
	when('/aircondition',{
		// controller: airConditionContrl,
		templateUrl:'tpls/aircondition.html'
	}).
	when('/sensor',{
		// controller: sensorContrl,
		templateUrl:'tpls/sensor.html'
	}).
	when('/appliance',{
		// controller: applianceContrl,
		templateUrl:'tpls/appliance.html'
	}).
	when('/setting',{
		// controller: settingContrl,
		templateUrl:'tpls/setting.html'
	}).
	otherwise({
		redirectTo: '/lamp'
	})
});

roomModule.run(function($rootScope,$http) {
	$rootScope.num = 1;

 	$rootScope.mask = false;
 	$rootScope.mask2 = false;
 	$rootScope.review = false;

 	$rootScope.roomLight = 220;
 	$rootScope.waterTemp = 19;
 	$rootScope.roomTemp = 17;
 	$rootScope.saturday = false;
 	$rootScope.sunday = false;

 	$rootScope.localCity = "北京"; //默认城市

 	$rootScope.nightStart = null;
 	$rootScope.nightEnd = null;


 	//默认设置参数
 	$rootScope.drinkWater = 30;
 	$rootScope.teaWater = 80;
 	$rootScope.summerLowTemp = 23;
 	$rootScope.summerHighTemp = 28;
 	$rootScope.winterLowTemp = 18;
 	$rootScope.winterHighTemp = 25;
 	$rootScope.resistantLowTemp = 11;
 	$rootScope.resistantHighTemp = 32;

 	if(localStorage.getItem("num")){
 		$rootScope.num = localStorage.getItem("num");
 	}

 	//从localstorage中读取数据
 	if(localStorage.getItem("defaultData")){
 		var str = localStorage.getItem("defaultData");
 		var data = JSON.parse(str);
 		$rootScope.drinkWater = data.drinkWater;
		$rootScope.teaWater = data.teaWater;

		$rootScope.summerLowTemp = data.summerLowTemp;
 		$rootScope.summerHighTemp = data.summerHighTemp;
 		$rootScope.winterLowTemp = data.winterLowTemp;
 		$rootScope.winterHighTemp = data.winterHighTemp;
 		$rootScope.resistantLowTemp = data.resistantLowTemp;
 		$rootScope.resistantHighTemp = data.resistantHighTemp;
 	}
 	else{
 		console.log("未找到localStorage数据");
 	}
 	
 	if(!window.name){
        	// alert("第一次开这个窗口！name值"+ window.name);
        	$rootScope.first = true;
        	window.name = 'jiaju';
        
	}else{
        	$rootScope.first = false;

       		// alert('刷新操作 name值：'+ window.name);
	}

	//从localstorage中读取夜间区间设置信息
	$rootScope.getNightData = function(){
		if(localStorage.getItem("NightData")){
			var str = localStorage.getItem("NightData");
			var data = JSON.parse(str);
			if(data.nightStart)
				$rootScope.nightStart=new Date(data.nightStart);
		    if(data.nightEnd)
				$rootScope.nightEnd=new Date(data.nightEnd);
		}else{
			console.log("localstorage中未找到夜间区间信息");
		}
	}
	$rootScope.getNightData();
	
	$rootScope.changeNum=function(num){
		$rootScope.num=num;
		localStorage.setItem("num",num);
	}

 	//提示框调用
    $rootScope.invokeTooltip = function(txt){   	
    	if(!$rootScope.review){
    		$rootScope.mask  = true;
			document.getElementById('content').innerHTML = txt;
    	}
    	
    }
    // 提示框2调用
    $rootScope.invokeTooltip2 = function(txt){   	
    	$rootScope.mask2  = true;
		document.getElementById('content2').innerHTML = txt;    	
    }
    
    $rootScope.baidumap= function(){
    	// 百度地图API功能
 	var map = new BMap.Map("allmap");
	var point = new BMap.Point(116.331398,39.897445);
	map.centerAndZoom(point,12);
	function myFun(result){
		var cityName = result.name.replace('市','');
    	console.log(result.name);
    	$rootScope.setLocalCity(cityName);
    	$rootScope.getWeather(cityName);
	}
	var myCity = new BMap.LocalCity();
	myCity.get(myFun); 
    }
	$rootScope.baidumap();

	$rootScope.setLocalCity = function(city){
		$rootScope.localCity = city;
	}

	$rootScope.getWeather =function(city){
		$http({
			url:'http://apis.baidu.com/heweather/weather/free',
			method:'GET',
			params:{
				'city':city,
			},
			headers:{
				'apikey':'60a35f299e0cb5a697641f1738287343'
			}
		})
		.success(function(response) {
				console.log(response);
				console.log(response['HeWeather data service 3.0'][0]['status']);
				if(response['HeWeather data service 3.0'][0]['status'] == "ok"){
					$rootScope.todayLowTemp=response['HeWeather data service 3.0'][0]['daily_forecast'][0]['tmp']['min'];
					$rootScope.todayHighTemp=response['HeWeather data service 3.0'][0]['daily_forecast'][0]['tmp']['max'];
					$rootScope.nowTemp=response['HeWeather data service 3.0'][0]['now']['tmp'];
					$rootScope.nowCond=response['HeWeather data service 3.0'][0]['now']['cond']['txt'];
					console.log($rootScope.nowTemp);
					console.log($rootScope.nowCond);
					console.log($rootScope.todayLowTemp);
					console.log($rootScope.todayHighTemp);
				}
				
		})
		.error(function(response) {
				alert('网络出现问题，天气信息请求失败！');
				console.log(response);
		});
	}

});

roomModule.factory('List',function(){
	return[{
			id:"001",
			status:true,
			light:260,
			contrl:true, //true 为自动 false 为手动
		},
		{
			id:'002',
			status:true,
			light:300,
			contrl:true,
		},
		{
			id:'003',
			status:false,
			light:0,
			contrl:true,

		}];
});




roomModule.factory('cityData',function(){
	return[
		{id:1,parent:0,name:'上海'},
		{id:2,parent:1,name:'上海'},
		{id:3,parent:0,name:'湖南'},
		{id:4,parent:3,name:'长沙'},
		{id:5,parent:3,name:'常德'},
		{id:6,parent:3,name:'益阳'},
		{id:7,parent:3,name:'株洲'},
		{id:8,parent:3,name:'湘潭'},
		{id:9,parent:3,name:'沅江'},
		{id:10,parent:3,name:'郴州'},
		{id:11,parent:3,name:'衡阳'},
		{id:12,parent:3,name:'岳阳'},
		{id:13,parent:3,name:'张家界'},
		{id:14,parent:3,name:'邵阳'},
		{id:15,parent:3,name:'永州'},
		{id:16,parent:3,name:'怀化'},
		{id:17,parent:3,name:'娄底'}
	];
})

