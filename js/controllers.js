var roomController=angular.module('roomController',[]);

// 日照灯控制器
roomController.controller('lampContrl',['$scope','List','$rootScope',
	function ($scope,List,$rootScope){
		$scope.lowLight=150;
		$scope.highLight=500;
		$scope.lamp=List;
		$scope.lampNightMode = false;
			console.log($rootScope.roomLight+"1");


		//将用户日照灯设置信息存入localstorage
		$scope.setLampData= function(){
			var data = new Object;
			data.lowLight= $scope.lowLight;
			data.hightLight = $scope.highLight;
			data.lampNightMode = $scope.lampNightMode;
			var str = JSON.stringify(data);
			localStorage.setItem("lampData",str);
		}

		//从localstorage中读取日照灯设置信息
		$scope.getLampData = function(){
			if(localStorage.getItem("lampData")){
				var str = localStorage.getItem("lampData");
				var data = JSON.parse(str);
				$scope.lowLight=data.lowLight;
				$scope.highLight=data.hightLight;
				$scope.lampNightMode = data.lampNightMode;
			}else{
				console.log("localstorage中未找到日照灯信息");
			}
		}

		$scope.getLampData();//读取设置信息

		$scope.$watch('highLight',function(newValue,oldValue){

			if($scope.highLight<$scope.lowLight){
				$rootScope.invokeTooltip2("设置的最高光照强度不能低于最低光照强度");
				$scope.highLight = oldValue;	
			}
		},true);

		$scope.$watch('lowLight',function(newValue,oldValue){
			if($scope.highLight<$scope.lowLight){
				$rootScope.invokeTooltip2("设置的最低光照强度不能高于最高光照强度");
				$scope.lowLight = oldValue;
			}
		},true);

		//将最低光照和最高光照设为默认值
		$scope.defaultLamp = function(){
			$scope.lowLight=150;
			$scope.highLight=500;
		}

		//根据id关闭某盏灯
		$scope.closeLamp= function(id){
			angular.forEach($scope.lamp,function(item){
				if(item.id==id && item.contrl){
					item.status=false;
					item.light=0;
				}
					
			});
		}
		// 关闭所有日照灯
		$scope.closeAllLamp = function(){
			angular.forEach($scope.lamp, function(item){
				if(item.contrl){
					item.status = false;
					item.light = 0;
				}
				
			})
		}
		//打开某盏日照灯
		$scope.openLamp= function(id){
			angular.forEach($scope.lamp,function(item){
				if(item.id==id && item.contrl){
					item.status=true;
					item.light=$scope.lowLight;
				}
					
			});
		}
		//打开所有日照灯
		$scope.openAllLamp = function(){
			angular.forEach($scope.lamp, function(item){
				if(item.contrl){
					item.status=true;
					item.light=$scope.lowLight;
				}
			})
		}
		//打开或关闭日照灯
		$scope.openOrClose=function(id){
				angular.forEach($scope.lamp,function(item){
				if(item.id==id){
					if(item.status){
						item.light=0;
					}else{
						item.light=$scope.lowLight;
					}
					
				}
					
			});
				return true;
		}

		// 根据光照强度检查日照灯模块
		$scope.checkLamp= function(){
			var openList = [];
			var closeList = [];

			angular.forEach($scope.lamp,function(item){
	
				if($rootScope.roomLight<$scope.lowLight){//室内光照低于最低光照
					if(!item.status&& item.contrl){						
						openList.push(item.id);						
						$scope.openLamp(item.id);
					}
				}
				if($rootScope.roomLight>$scope.highLight){//室内光照高于最高光照
					if(item.status&& item.contrl){						
						$scope.closeLamp(item.id);
					}
				}
				if(item.status&&item.light<$scope.lowLight){//日照灯开启时，光照小于最低光照
					item.light=$scope.lowLight;
				}
				if(item.light>$scope.highLight){
					item.light=$scope.highLight;
				}		
			});

			if(openList.length>0){
				var openStr="室内光照过暗，日照灯"+openList.join(',')+"已打开";
				$rootScope.invokeTooltip(openStr);
			}
			if(closeList.length>0){
				var closeStr="室内光照过强，日照灯"+closeList.join(',')+"已关闭";
				$rootScope.invokeTooltip(closeStr);
			}
			

		}


		// 日照灯夜间模式
		$scope.checkLampNight = function(start,end){
			var startHour= start.getHours();
			var startMinute= start.getMinutes();
			var endHour= end.getHours();
			var endMinute = end.getMinutes();

			var today = new Date();

			if(today.getHours()==startHour&&today.getMinutes()==startMinute&&0<=today.getSeconds()&&today.getSeconds()<3){
				$scope.closeAllLamp();
			}
			if(today.getHours()==endHour&&today.getMinutes()==endMinute&&0<=today.getSeconds()&&today.getSeconds()<3){
				$scope.openAllLamp();
			}
		}



		setInterval(function(){
			$scope.$apply(function(){
				$scope.setLampData();//存储信息
				$scope.checkLamp();
				if($scope.lampNightMode){
					if($rootScope.nightStart&&$rootScope.nightEnd){
						$scope.checkLampNight($rootScope.nightStart,$rootScope.nightEnd);
					}else{
						$rootScope.invokeTooltip2('请到“系统设置”设置夜间区间！');
						$scope.lampNightMode =false;
					}
					
				}
				
			});
		},3000);

	}


]);



// 饮水机控制器
roomController.controller('waterContrl',['$scope','$rootScope',
	function($scope,$rootScope){
		$scope.waterContrl= true;
		$scope.waterStatus=true;
		$scope.heatingStatus="加热中";//加热中、已停止加热、保温中

		$scope.closingTime=null;
		$scope.workingTime=null;
		$scope.keepWater = 40;
		$scope.workMode = false;
		$scope.saturday = false;
		$scope.sunday = false;
 		$scope.waterNightMode = false;

 		//将用户饮水机设置信息存入localstorage
		$scope.setWaterData= function(){
			var data = new Object;
			data.closingTime=$scope.closingTime;
			data.workingTime=$scope.workingTime;
			data.keepWater=$scope.keepWater;
			data.workMode=$scope.workMode;
			data.saturday=$scope.saturday;
			data.sunday=$scope.sunday;
			data.waterNightMode = $scope.waterNightMode;
			var str = JSON.stringify(data);
			localStorage.setItem("WaterData",str);
		}

		//从localstorage中读取饮水机设置信息
		$scope.getWaterData = function(){
			if(localStorage.getItem("WaterData")){
				var str = localStorage.getItem("WaterData");
				var data = JSON.parse(str);
				$scope.keepWater=data.keepWater;
				$scope.saturday=data.saturday;
				$scope.sunday=data.sunday;
				$scope.workMode = data.workMode;
				$scope.waterNightMode = data.waterNightMode;
				if(data.closingTime){
					var closing=new Date(data.closingTime);
					$scope.closingTime=closing;
				}
				if(data.workingTime){
					var working=new Date(data.workingTime);
					$scope.workingTime=working;
				}
				

			}else{
				console.log("localstorage中未找到饮水机信息");
			}
		}
		$scope.getWaterData();



 		$scope.setDrinkWater = function(){
 			$scope.keepWater = $rootScope.drinkWater;
 		}

 		$scope.setTeaWater = function(){
 			$scope.keepWater = $rootScope.teaWater;
 		}

		$scope.openWater = function(){
			$scope.waterStatus=true;
			$scope.checkWater();
		}

		$scope.closeWater = function(){
			$scope.waterStatus=false;
			$scope.heatingStatus="已停止加热";
		}

		$scope.waterOpenOrClose=function(){//关闭和打开饮水机
			if($scope.waterStatus){
				$scope.heatingStatus="已停止加热";
			}else{
				if(parseInt($scope.keepWater)>parseInt($rootScope.waterTemp)){
					$scope.heatingStatus="加热中";
				}else{
					$scope.heatingStatus="保温中";
				}
			}
		}
		//自动检测
		$scope.checkWater = function(){

			if($scope.waterStatus){

				if(parseInt($scope.keepWater)>parseInt($rootScope.waterTemp)){
					$scope.heatingStatus="加热中";
				}else{
					$scope.heatingStatus="保温中";
				}
			}		 
		}
		//工作模式时间检查
		$scope.checkTime= function(){
			var today= new Date();
			if(today.getDay()!==6 && today.getDay()!==7 || today.getDay()==6&&$scope.saturday || today.getDay()==7&& $scope.sunday){ //周一至周五工作模式时间检查、周六和周日是否勾选
				if($scope.closingTime){
					if($scope.closingTime.getHours()==today.getHours()&&$scope.closingTime.getMinutes()==today.getMinutes()&&0<=today.getSeconds()&&today.getSeconds()<3){
						$scope.openWater();
					}
				}
				if($scope.workingTime){
					if($scope.workingTime.getHours()==today.getHours()&&$scope.workingTime.getMinutes()==today.getMinutes()&&0<=today.getSeconds()&&today.getSeconds()<3){
						$scope.closeWater();
					}
				}
				
			}
		}



		// 饮水机的夜间模式
		$scope.checkWaterNight = function(start,end){
			var startHour= start.getHours();
			var startMinute= start.getMinutes();
			var endHour= end.getHours();
			var endMinute = end.getMinutes();

			var today = new Date();
			if(today.getHours()==startHour&&today.getMinutes()==startMinute&&0<=today.getSeconds()&&today.getSeconds()<3){//开始点饮水机自动关闭
				$scope.closeWater();
			}
			//开始点到凌晨技术点如何饮水机被打开，则只加热一次，到保温就立即关闭饮水机
			if(today.getHours()>=startHour&&today.getMinutes()>=endHour||today.getHours()<=startMinute&&today.getMinutes()<=endMinute){
				if($scope.heatingStatus=="保温中"){
					$scope.closeWater();
				}
			}
			if(today.getHours()==endHour&&today.getMinutes()==endMinute&&0<=today.getSeconds()&&today.getSeconds()<3){   //结束点饮水机自动打开
				$scope.openWater();
			}

		}

		//每隔5s自动检测
		setInterval(function(){

			$scope.$apply( //执行检测函数，并进行脏检查
			function(){
				$scope.setWaterData();
				$scope.checkWater();
				if($scope.workMode){ //检查是否勾选工作模式
					if($scope.waterContrl){
						$scope.checkTime();
					}
				}

				if($scope.waterNightMode){//检查是否勾选夜间模式
					if($rootScope.nightStart && $rootScope.nightEnd){
						if($scope.waterContrl){
							$scope.checkWaterNight($rootScope.nightStart,$rootScope.nightEnd);
						}						
					}else{
						$rootScope.invokeTooltip2('请到“系统设置”设置夜间区间！');
						$scope.waterNightMode = false;
					}
				}
				
			});
			
		},3000);



	}]


);


// 空调控制器
roomController.controller('airConditionContrl',['$scope','$http','$rootScope',
	function($scope,$http,$rootScope){
		$scope.keepTemp = 20;
		$scope.mode = 3;//1加热、2制冷、3--
		$scope.lowTemp = 11;
		$scope.highTemp	= 32;
		$scope.airConditionStatus = false;
		$scope.airConditionContrl = true;
 		$scope.airNightMode = false;

 		//将用户空调设置信息存入localstorage
		$scope.setAirConditionData= function(){
			var data = new Object;
			data.keepTemp = $scope.keepTemp;
			data.lowTemp = $scope.lowTemp;
			data.highTemp = $scope.highTemp;
			data.airNightMode = $scope.airNightMode;
			var str = JSON.stringify(data);
			localStorage.setItem("AirConditionData",str);
		}

		//从localstorage中读取空调设置信息
		$scope.getAirConditionData = function(){
			if(localStorage.getItem("AirConditionData")){
				var str = localStorage.getItem("AirConditionData");
				var data = JSON.parse(str);
				$scope.keepTemp = data.keepTemp;
				$scope.lowTemp = data.lowTemp;
				$scope.highTemp = data.highTemp;
				$scope.airNightMode = data.airNightMode;
			}else{
				console.log("localstorage中未找到空调信息");
			}
		}
		$scope.getAirConditionData();


 		$scope.setSummer = function(){
 			$scope.lowTemp = $rootScope.summerLowTemp;
			$scope.highTemp	= $rootScope.summerHighTemp;
 		}

 		$scope.setWinter = function(){
 			$scope.lowTemp = $rootScope.winterLowTemp;
			$scope.highTemp	= $rootScope.winterHighTemp;
 		}

 		$scope.setRisistant = function(){
 			$scope.lowTemp = $rootScope.resistantLowTemp;
			$scope.highTemp	= $rootScope.resistantHighTemp;
 		}

		$scope.$watch('keepTemp',function(newValue,oldValue){
			if($scope.highTemp<$scope.keepTemp){
				$rootScope.invokeTooltip2("设置的保持室温不能大于设置的最高室温");
				$scope.keepTemp = oldValue;
			}
			if($scope.keepTemp<$scope.lowTemp){
				$rootScope.invokeTooltip2("设置的保持室温不能小于设置的最低室温");
				$scope.keepTemp = oldValue;			
			}
		},true);

		$scope.$watch('lowTemp',function(newValue,oldValue){
			if($scope.highTemp<$scope.lowTemp){
				$rootScope.invokeTooltip2("设置的最低室温不能高于最高室温");
				$scope.lowTemp = oldValue;
			}
			if($scope.lowTemp>$scope.keepTemp){
				$scope.keepTemp = $scope.lowTemp;
			}
		},true);

		$scope.$watch('highTemp',function(newValue,oldValue){
			if($scope.highTemp<$scope.lowTemp){
				$rootScope.invokeTooltip2("设置的最高室温不能低于最低室温");
				$scope.highTemp = oldValue;
			}
			if($scope.highTemp<$scope.keepTemp){
				$scope.keepTemp = $scope.highTemp;
			}
		},true);

		$scope.openAirCondition = function(){
			$scope.airConditionStatus = true;
			$scope.checkAirCondition();
		}

		$scope.closeAirCondition = function(){
			$scope.airConditionStatus = false;
			$scope.mode = 3;//加热、制冷、--
		}

		$scope.airConditionOpenOrClose = function(){
			if($scope.airConditionStatus){
				$scope.mode = 3;//加热、制冷、--
			}else{
				if($rootScope.roomTemp<$scope.keepTemp){
					$scope.mode = 1;
				} else{
					$scope.mode = 2;
				}
			}
		}

		$scope.checkNightAirCondition = function(start,end){
			var startHour= start.getHours();
			var startMinute= start.getMinutes();
			var endHour= end.getHours();
			var endMinute = end.getMinutes();
			var today = new Date();			
			if(today.getHours()>startHour || today.getHours()==startHour&&today.getMinutes()>=startMinute) {
				if(today.getHours()<endHour || today.getHours()==endHour&&today.getMinutes()<endMinute){
					$scope.openAirCondition();
				}	
			}
			if(today.getHours()==endHour&&today.getMinutes()==endMinute&&0<=today.getSeconds()&&today.getSeconds()<3){
				$scope.closeAirCondition();
			}
		}
		$scope.checkAirCondition = function(){

			if(!$scope.airConditionStatus){

				if($scope.lowTemp>$rootScope.roomTemp){//最低温度大于室温，空调自动开启
					$scope.airConditionStatus = true;
					$scope.mode = 1;
					$rootScope.invokeTooltip("室内温度过低，空调已经打开！");

				}
				if($scope.highTemp<$rootScope.roomTemp){//最高温度小于室温，空调自动打开
					$scope.airConditionStatus = true;
					$scope.mode = 2;
					$rootScope.invokeTooltip("室内温度过高，空调已经打开！");

				}
			}else if($rootScope.roomTemp<$scope.keepTemp){
				$scope.mode = 1;
			} else{
				$scope.mode = 2;
			}
		}

		setInterval(function(){
			$scope.$apply(function(){
				$scope.setAirConditionData();
				if($scope.airConditionContrl){
					$scope.checkAirCondition();
				}
				if($scope.airNightMode){
					if($rootScope.nightStart && $rootScope.nightEnd){
						if($scope.airConditionContrl){
							$scope.checkNightAirCondition($rootScope.nightStart,$rootScope.nightEnd);
						}
					}else{
						$rootScope.invokeTooltip2('请到“系统设置”设置夜间区间！');
						$scope.airNightMode = false;
					}
				}
			});
		},3000);




	}]


);


//系统设置控制器
roomController.controller('settingContrl',['$scope','cityData','$rootScope',
	function($scope,cityData,$rootScope){
	$scope.cityShow = false;
	$scope.cityList = cityData;

	 //将用户夜间区间设置信息存入localstorage
	$scope.setNightData= function(){
		var data = new Object;
		data.nightStart=$scope.nightStart;
		data.nightEnd=$scope.nightEnd;
		var str = JSON.stringify(data);
		localStorage.setItem("NightData",str);
	}


	//恢复出厂设置
	$scope.reset = function(){
		localStorage.clear();
		location.reload();
		localStorage.setItem("num",6);
	}



	//显示城市列表
	$scope.cityToggle = function(){
		$scope.cityShow = !$scope.cityShow;
	}
	//获取页面中选择的城市名称
	$scope.getCity= function(id){
		var c = $rootScope.localCity;
		angular.forEach($scope.cityList,function(city){
			if(city.id==id){
				c = city.name;
			}
		});
		return c;
	}
	//确定城市
	$scope.submitCity = function(){
		$rootScope.localCity = $scope.getCity($scope.city);
		$scope.cityShow = !$scope.cityShow;
		$rootScope.getWeather($rootScope.localCity);
	}


	$scope.setNight = function(start,end){
		
		if(start instanceof Date){
			$rootScope.nightStart = start;
		}else{
			console.log("error:start not Date");
		}
		if(end instanceof  Date){
			$rootScope.nightEnd = end;
		}else{
			console.log("error:end not Date");
		}
		
	}


	$scope.submitNightRange = function(){
		if($scope.nightStart&&$scope.nightEnd){
			$scope.setNight($scope.nightStart,$scope.nightEnd);
			$scope.setNightData();
			$rootScope.invokeTooltip2("设置成功!");
		}else{
			$rootScope.invokeTooltip2("请设置时间!");
		}
	}

	$scope.saveAll =  function(){
		$rootScope.drinkWater = $scope.drinkWater;
		$rootScope.teaWater = $scope.teaWater;

		$rootScope.summerLowTemp = $scope.summerLowTemp;
 		$rootScope.summerHighTemp = $scope.summerHighTemp;
 		$rootScope.winterLowTemp = $scope.winterLowTemp;
 		$rootScope.winterHighTemp = $scope.winterHighTemp;
 		$rootScope.resistantLowTemp = $scope.resistantLowTemp;
 		$rootScope.resistantHighTemp = $scope.resistantHighTemp;

 		$rootScope.invokeTooltip2("保存成功！");

 		var data = new Object;
 		data.drinkWater = $scope.drinkWater;
 		data.teaWater = $scope.teaWater;
 		data.summerLowTemp = $scope.summerLowTemp;
 		data.summerHighTemp = $scope.summerHighTemp;
 		data.winterLowTemp = $scope.winterLowTemp;
 		data.winterHighTemp = $scope.winterHighTemp;
 		data.resistantLowTemp = $scope.resistantLowTemp;
 		data.resistantHighTemp = $scope.resistantHighTemp;
 		var str = JSON.stringify(data);

 		localStorage.setItem("defaultData",str);
	}

}]);

//电器控制器
roomController.controller('applianceContrl',['$scope','$rootScope',
	function($scope,$rootScope){
		//连接状态
		$scope.lampConn = true;
		$scope.waterConn = true;
		$scope.airConditionConn = false;
		//长时间使用警告
		$scope.lampOvertime = false;
		$scope.waterOvertime = true;
		$scope.airConditionOvertime = false;
		//error类型
		$scope.lampError = 1;//1网络连接故障 ,2日照灯故障
		$scope.waterError = 2 ;//1网络连接故障 2饮水机故障
		$scope.airError = 1 ; //1网络连接故障 2空调故障

		//将用户电器信息存入localstorage
		$scope.setAppData= function(){
			var data = new Object;
			data.lampConn=$scope.lampConn;
			data.waterConn=$scope.waterConn;
			data.airConditionConn=$scope.airConditionConn;
			data.lampOvertime=$scope.lampOvertime;
			data.waterOvertime=$scope.waterOvertime;
			data.airConditionOvertime=$scope.airConditionOvertime;
			data.lampError = $scope.lampError;
			data.waterError = $scope.waterError;
			data.airError = $scope.airError;
			var str = JSON.stringify(data);
			localStorage.setItem("AppData",str);
		}

		//从localstorage中读取电器信息
		$scope.getAppData = function(){
			if(localStorage.getItem("AppData")){
				var str = localStorage.getItem("AppData");
				var data = JSON.parse(str);
				$scope.lampConn=data.lampConn;
				$scope.waterConn=data.waterConn;
				$scope.airConditionConn=data.airConditionConn;
				$scope.lampOvertime=data.lampOvertime;
				$scope.waterOvertime = data.waterOvertime;
				$scope.airConditionOvertime = data.airConditionOvertime;
				$scope.lampError = data.lampError;
				$scope.waterError = data.waterError;
				$scope.airError = data.airError;
			}else{
				console.log("localstorage中未找到电器信息");
			}
		}
		$scope.getAppData();

		setInterval(function(){
			$scope.$apply(function(){
				$scope.setAppData();
			})
		},1000);


}]);

//传感器控制器
roomController.controller('sensorContrl',['$scope','$rootScope',
	function($scope,$rootScope){

		$scope.$watch("roomLight",function(newValue,oldValue){
			$rootScope.roomLight=newValue;
		},true);

		$scope.$watch("waterTemp",function(newValue,oldValue){
			$rootScope.waterTemp=newValue;
		},true);

		$scope.$watch("roomTemp",function(newValue,oldValue){
			$rootScope.roomTemp=newValue;
		},true);


}]);