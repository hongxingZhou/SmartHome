var roomFactories=angluar.module('roomFactories',[]);


roomFactories.factory('List',function(){
	return[{
			id:"001",
			status:true,
			light:260,
			contrl:'自动',
		},
		{
			id:'002',
			status:true,
			light:300,
			contrl:'手动',
		},
		{
			id:'003',
			status:false,
			light:0,
			contrl:'手动',

		}];
});


roomFactories.factory('cityData',function(){
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
});