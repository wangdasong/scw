angular.module('controller.webpage.container.widget.echart.basic', [])
    .directive('widgetEchartBasic', ['DataService', 'APP_CONFIG', function (DataService, APP_CONFIG) {
        return {
            restrict: 'EA',
            templateUrl: '/app/controller/widget/echart/widget.echart.basic.tpl.html',
            replace: false,
            scope: {
            },
            link: function (scope, element, attrs) {
            	var currWidgetId = attrs.id;
            	scope.id = currWidgetId;
            	scope.width = 12;
            	var drawChart = function(displayData){
        			var myChart = echarts.init(document.getElementById('main'));
    		        console.log(myChart);
    		        if(scope.type && scope.type != ""){
    		        	for(i = 0; i < displayData.series.length; i ++){
    		        		displayData.series[i].type = scope.type;
    		        		displayData.series[i].label = XXXXX;
    		        		displayData.series[i].name = displayData.legend[i];
    		        	}
    		        }
    		        // 指定图表的配置项和数据柱状图
    		        var option = {
    		            title: {
    		                text: scope.label
    		            },
    		            tooltip: {},
    		            legend: {
    		                data:displayData.legend
    		            },
    		            xAxis: {
    		                data: displayData.xAxis
    		            },
    		            yAxis: {},
    		            series: displayData.series
    		        };
    		        // 使用刚指定的配置项和数据显示图表。
    		        myChart.setOption(option);
            	}
 				scope.$on("charts.data.update",function (e, data){
 					if (data.id === scope.id) {
     					var d = data.d
     					drawChart(d);
 					}
 				});
            	DataService.getWidgetDetailById(currWidgetId).then(function (response) {
            		var data = response.plain();
            		scope.attConfigs = data.attConfigs;
            		scope.id = currWidgetId;

	        		for(index in data.attConfigs){
	            		var currAttConfig = data.attConfigs[index];
            			var currAttConfigType = currAttConfig.type;
            			if(currAttConfigType == "label"){
            				scope.label = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "name"){
            				scope.name = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "type"){
            				scope.type = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "width"){
            				scope.width = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "height"){
            				scope.height = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "initService"){
            				scope.serviceName = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "queryCondition"){
            				if(currAttConfig.attValue){
                				scope.queryCondition = eval('('+currAttConfig.attValue+')');
            				}
            			}
            			if(scope.serviceName && scope.serviceName !="" ){
                			DataService.findDataSrcList(scope.serviceName, queryCondition).then(function (response){
                				var displayData = response.plain();
                				drawChart(displayData);
                			});
            			}
	        		}

            });
        }
    }
}]);