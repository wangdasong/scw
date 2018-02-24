angular.module('controller.webpage.container.widget.select', [])
    .directive('widgetSelect', ['DataService', 'APP_CONFIG', function (DataService) {
        return {
            restrict: 'EA',
            templateUrl: '/app/controller/widget/select/widget.select.tpl.html',
            replace: false,
            scope: {
            },
            link: function (scope, element, attrs) {
            	var currWidgetId = attrs.id;
            	DataService.getWidgetDetailById(currWidgetId).then(function (response) {
            		var data = response.plain();
            		scope.labelValue = "";
            		scope.attConfigs = data.attConfigs;
            		scope.elements = data.elements;
            		scope.id = currWidgetId;
            		scope.initvalue = attrs.initvalue;
        			scope.queryCondition = {};
        			scope.cascadeFuc = null;
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
            			if(currAttConfigType == "queryKey"){
            				scope.queryKey = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "type"){
            				scope.type = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "serviceName"){
            				scope.serviceName = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "cascade"){
            				if(currAttConfig.attValue){
            					scope.cascade = eval('('+currAttConfig.attValue+')');
                        		scope.cascadeFuc = function(){
                        			var currValue = $("#select" + currWidgetId).val();
                        			var dataStr = "{id:'" + scope.cascade.id + "',queryCondition:{" + scope.cascade.queryKey + ":'" +currValue+ "'}}";
                        			var dataObj = eval('(' + dataStr + ')');
            						scope.$emit('doAction', {actionName:'widget.reload.options', d:dataObj});
                        		};
            				}
            			}
            			if(currAttConfigType == "queryCondition"){
            				if(currAttConfig.attValue){
                				scope.queryCondition = eval('('+currAttConfig.attValue+')');
            				}
            			}
            		}
        			scope.changeValue = function(){
        				var selectOption = $("#select" + currWidgetId + ">option:selected");
        				if(selectOption){
                			$("#selectLabel" + currWidgetId).val(selectOption.text().replace("请选择","").trim());
        				}
            			if(scope.cascadeFuc){
            				scope.cascadeFuc();
            			}
        			}
            		//有数据源的控件，根据数据源读取选项信息
            		if(scope.serviceName != null){
            			var reloadOptions = function(queryCondition){
            					if(scope.queryKey){
                  					var maxElementLength = 10;
                    				DataService.findDataSrcList(scope.serviceName, queryCondition).then(function (response){
                    					$("#select" + currWidgetId).selectpicker({
                    						dropuAuto : false
                    					});
                      					var optionList = response.plain();
                      					$("#div" + currWidgetId).find(".bootstrap-select").css("padding-left","0");
                      					$("#div" + currWidgetId).find(".bootstrap-select").css("padding-right","0");
                      					$("#div" + currWidgetId).find(".bootstrap-select .btn").css("padding-top","5px");
                      					$("#div" + currWidgetId).find(".bootstrap-select .btn").css("padding-bottom","5px");
                      					$("#div" + currWidgetId).find(".bootstrap-select .btn").css("line-height","16.8px");
                      					$("#div" + currWidgetId).find(".bootstrap-select .btn").css("border-width","1px");
                      					var loading = false;
	                  					$("#div" + currWidgetId).find(".bootstrap-select .form-control").bind("input propertychange", function () {
	                  						if(loading){
	                  							return;
	                  						}
	                  						var inputValue = this.value;
	                  						if(inputValue == null){
	                  							inputValue == ""
	                  						}
	                  						queryCondition = $.extend(true, queryCondition, eval("({" + scope.queryKey +":'" + inputValue + "'})"));
	                  						DataService.findDataSrcList(scope.serviceName, queryCondition).then(function (response){
	                          					var optionList = response.plain();
	                          					if(optionList == null || optionList.length == 0 ){
	                          						scope.elements = [];
	                          					}else{
	                              					var elementLength = maxElementLength;
	                              					if(optionList.length < elementLength){
	                              						elementLength = optionList.length;
	                              					}
	                      							var elements = new Array(elementLength);
	                              					for(var i = 0; i < elementLength; i ++ ){
	                              						var currElement = {};
	                              						currElement.id = optionList[i].id;
	                              						currElement.label = optionList[i].label;
	                              						currElement.value = optionList[i].value;
	                                      				if(currElement.value  == scope.initvalue){
	                                  						currElement.selected = true;
	                                      				}else{
	                                      					currElement.selected = false;
	                                      				}
	                              						elements[i] = currElement;
	                              					}
	                              					scope.elements = elements;
	                          					}
                            					scope.$apply();
                            					if(scope.changeValue){
                                					scope.changeValue();
                            					}
                          						scope.queryValue = inputValue;
                          						loading = true;
                              					$("#select" + currWidgetId).selectpicker('render');
                                                $("#select" + currWidgetId).selectpicker('refresh');
                                                loading = false;
	                  						});
	                  					});
                      					var elementLength = maxElementLength;
                      					if(optionList.length < elementLength){
                      						elementLength = optionList.length;
                      					}
	                					var elements = new Array(elementLength);
	                  					for(var i = 0; i < elementLength; i ++ ){
	                						var currElement = {};
	                						currElement.id = optionList[i].id;
	                						currElement.label = optionList[i].label;
	                						currElement.value = optionList[i].value;
	                        				if(currElement.value  == scope.initvalue){
	                    						currElement.selected = true;
	                        				}else{
	                        					currElement.selected = false;
	                        				}
	                						elements[i] = currElement;
	                					}
	                					scope.elements = elements;
	                					scope.$apply();
	                  					$("#select" + currWidgetId).selectpicker('render');
	                                    $("#select" + currWidgetId).selectpicker('refresh');
                  						loading = false;
              						});
                					
            					}else{
                    				DataService.findDataSrcList(scope.serviceName, queryCondition).then(function (response){
	                					var optionList = response.plain();
	                					var elements = new Array(optionList.length);
	                					for(var i = 0; i < optionList.length; i ++ ){
	                						var currElement = {};
	                						currElement.id = optionList[i].id;
	                						currElement.label = optionList[i].label;
	                						currElement.value = optionList[i].value;
	                        				if(currElement.value  == scope.initvalue){
	                    						currElement.selected = true;
	                        				}else{
	                        					currElement.selected = false;
	                        				}
	                        				elements[i] = currElement;
	                					}
	                					scope.elements = elements;
	                					scope.$apply();
                    					if(scope.changeValue){
                        					scope.changeValue();
                    					}
                    				});
            					}
            			}
            			reloadOptions(scope.queryCondition);

                		scope.$on("widget.reload.options",function(e, data){
                			if(data.id == currWidgetId){
                				scope.queryCondition = $.extend(true, scope.queryCondition, data.queryCondition);
                				reloadOptions(scope.queryCondition);
                			}
                		});
            			
                		scope.$on("widget.reload.initvalue",function(e, data){
                			for(var i = 0; i < scope.elements.length; i ++ ){
                				if(scope.elements[i].value == scope.initvalue){
                					scope.elements[i].selected = true;
                					if(scope.changeValue){
                    					scope.changeValue();
                					}
                				}
                			}
                    		scope.$apply();
                		});
        			//无数据源的控件，根据自己的元素渲染选项信息
            		}else{
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
                        				$("#element"+currEleAttConfig.belongId).html(currElementLabel);
                        			}
                        			if(currEleAttConfigType == "value"){
                        				currElementValue = currEleAttConfig.attValue;
                        				if(currElementValue == scope.initvalue){
                        					$("#element"+currEleAttConfig.belongId).attr("selected", true);
                        				}
                        				$("#element"+currEleAttConfig.belongId).val(currElementValue);
                        			}
                    			}
                			});            			
                		}
            		}
            	});
            }
        };
    }])
;

