angular.module('controller.webpage.container.widget.date', [])
    .directive('widgetDate', ['DataService', 'APP_CONFIG', function (DataService, APP_CONFIG) {
        return {
            restrict: 'EA',
            templateUrl: '/app/controller/widget/datepicker/widget.date.tpl.html',
            replace: false,
            scope: {
            },
            link: function (scope, element, attrs) {
            	var currWidgetId = attrs.id;
            	DataService.getWidgetDetailById(currWidgetId).then(function (response) {
            		var data = response.plain();
            		scope.attConfigs = data.attConfigs;
            		scope.id = currWidgetId;
            		if(attrs.initvalue){
                		scope.initvalue = attrs.initvalue;
            		}else {
            			scope.initvalue = "";
            		}
            		for(index in data.attConfigs){
                		var currAttConfig = data.attConfigs[index];
            			var currAttConfigType = currAttConfig.type;
            			if(currAttConfigType == "label"){
            				scope.label = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "name"){
            				scope.name = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "width"){
            				scope.width = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "height"){
            				scope.height = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "regular"){
            				scope.regular = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "format"){
            				scope.format = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "type"){
            				scope.type = currAttConfig.attValue;
            			}
            		}
                	var elm = $('input', $(element));
                	//设置默认类型值
            		if(!scope.type){
            			scope.type = "datetimepicker"
            		}
            		if(!scope.format){
                		if(scope.type == "datetimepicker"){
                			scope.format == "yyyy-mm-dd hh:ii:ss";
                		}else{
                			scope.format == "yyyy-mm-dd";
                		}
            		}
            		//设置默认格式并创建控件
            		if(scope.type == "datetimepicker"){
                		if(!scope.format){
                			scope.format == "yyyy-mm-dd hh:ii:ss";
                		}
                    	elm.datetimepicker({
                    		language:  'zh',
                    	    format: scope.format,
                    	    autoclose: true
                    	});
            		}else{
                		if(!scope.format){
                			scope.format == "yyyy-mm-dd";
                		}
                    	elm.datepicker({
                    		language:  'zh',
                    	    format: scope.format,
                    	    autoclose: true
                    	});
            		}
            	});
            }
        };
    }])
;