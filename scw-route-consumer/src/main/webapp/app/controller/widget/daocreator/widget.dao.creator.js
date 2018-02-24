angular.module('controller.webpage.container.widget.daocreator', [])
    .directive('widgetDaocreator', ['DataService', 'APP_CONFIG', function (DataService) {
        return {
            restrict: 'EA',
            templateUrl: '/app/controller/widget/daocreator/widget.dao.creator.tpl.html',
            replace: false,
            scope: {
            },
            link: function (scope, element, attrs) {
            	var currWidgetId = attrs.id;
        		scope.id = currWidgetId;
        		scope.initvalue = attrs.initvalue;
            	DataService.getWidgetDetailById(currWidgetId).then(function (response) {
            		var data = response.plain();
            		scope.attConfigs = data.attConfigs;
            		scope.elements = data.elements;
        			scope.queryCondition = {};
            		for(index1 in data.attConfigs){
                		var currAttConfig = data.attConfigs[index1];
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
            			if(currAttConfigType == "type"){
            				scope.type = currAttConfig.attValue;
            			}
            		}
            		var hasActive = false;
            		for(i=0; i< data.elements.length; i ++ ){
            			var currElementId = data.elements[i].id;
            			var currElementValue, currElementLabel;
            			DataService.getAttConfigsByBelongId(currElementId).then(function (response){
            				eleAttConfigs = response.plain();
                			for(index2 in eleAttConfigs){
                				var currEleAttConfig = eleAttConfigs[index2];
                				var currEleAttConfigType = currEleAttConfig.type;
                    			if(currEleAttConfigType == "label"){
                    				currElementLabel = currEleAttConfig.attValue;
                    				$("#a"+currEleAttConfig.belongId).html(currElementLabel);
                    			}
                    			//value为容器ID
                    			if(currEleAttConfigType == "value"){
                    				currElementValue = currEleAttConfig.attValue;
                    				if(currElementValue == scope.initvalue){
                    					$("li[id='^li']").attr("class", "");
                    					$("div[id='^tab']").attr("class", "");
                    					$("#li"+currEleAttConfig.belongId).attr("class", "active");
                    					$("#tab"+currEleAttConfig.belongId).attr("class", "tab-pane in active");
                    				}else if(!hasActive){
                    					$("li[id='^li']").attr("class", "");
                    					$("div[id='^tab']").attr("class", "");
                    					$("#li"+currEleAttConfig.belongId).attr("class", "active");
                    					$("#tab"+currEleAttConfig.belongId).attr("class", "tab-pane in active");
                    					hasActive = true;
                    				}
                    			}
                			}
            			});            			
            		}
            	});
            }
        };
    }])
;
