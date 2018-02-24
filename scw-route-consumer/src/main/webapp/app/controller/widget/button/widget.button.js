angular.module('controller.webpage.container.widget.button', [])
    .directive('widgetButton', ['DataService', 'APP_CONFIG', function (DataService) {
        return {
            restrict: 'EA',
            templateUrl: '/app/controller/widget/button/widget.button.tpl.html',
            replace: false,
            scope: {
            	serializeObject:'='
            },
            link: function (scope, element, attrs) {
            	var currWidgetId = attrs.id;
            	DataService.getWidgetDetailById(currWidgetId).then(function (response) {
            		var data = response.plain();
            		scope.attConfigs = data.attConfigs;
            		scope.id = currWidgetId;
    				scope.size = "";
    				scope.situation = "btn-info";
            		for(index in data.attConfigs){
                		var currAttConfig = data.attConfigs[index];
            			var currAttConfigType = currAttConfig.type;
            			if(currAttConfigType == "label"){
            				scope.label = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "width"){
            				scope.width = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "type"){
            				scope.type = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "size"){
            				var sizeStr = currAttConfig.attValue;
            				if(sizeStr == "large"){
                				scope.size = "btn-lg";
            				}else if(sizeStr == "small"){
                				scope.size = "btn-sm";
            				}else if(sizeStr == "mini"){
                				scope.size = "btn-xs";
            				}else if(sizeStr == "minier"){
                				scope.size = "btn-minier";
            				}else{
                				scope.size = "";
            				}
            			}
            			if(currAttConfigType == "situation"){
            				var situationStr = currAttConfig.attValue;
            				if(situationStr == "pink"){
                				scope.situation = "btn-pink";
            				}else if(situationStr == "warning"){
                				scope.situation = "btn-warning";
            				}else if(situationStr == "danger"){
                				scope.situation = "btn-danger";
            				}else if(situationStr == "inverse"){
                				scope.situation = "btn-inverse";
            				}else if(situationStr == "purple"){
            					scope.situation = "btn-purple";
            				}else if(situationStr == "grey"){
            					scope.situation = "btn-grey";
            				}else if(situationStr == "yellow"){
            					scope.situation = "btn-yellow";
            				}else if(situationStr == "light"){
            					scope.situation = "btn-light";
            				}else if(situationStr == "white"){
            					scope.situation = "btn-white";
            				}else{
                				scope.situation = "btn-info";	
            				}
            			}
            			if(currAttConfigType == "action"){
            				scope.action = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "input"){
            				scope.input = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "output"){
            				scope.output = currAttConfig.attValue;
            			}
            		}
            		var input = scope.input;
            		var output = scope.output;
            		var action = scope.action;
            		var inputType = "";
            		var outputType = "";
            		var inputId = "";
            		var outputId = null;
            		var outputServiceName = null;
            		var inputList = [];
            		if(input){
            			inputList = input.split(":");
            			inputType = inputList[0];
            			inputId = inputList[1];
            		}
            		var outputList = [];
            		if(output){
            			outputList = output.split(":");
            			outputType = outputList[0];
            			outputId = outputList[1];
            			outputServiceName = outputList[2];
            		}
            		var doButtonAction = function(){
                		
                		var inputData;
                		//如果输入是个容器（表单）
                		if(inputType == "container"){
                			//容器控件js校验
                			$("#container" + inputId).find("input").blur();
                			//判断容器是否有输入check失败的控件
                			var checkFailedObjects = $("#container" + inputId).find(".check-failed");
                			if(checkFailedObjects && checkFailedObjects.length > 0){
                				var msg = "页面输入验证错误：";
                				checkFailedObjects.each(function (index, domEle){
                					var currId = domEle.getAttribute("id");
                					currId = currId.substr(5);
                					var currLabel = $("#label"+ currId);
                					msg = msg + "\n" + domEle.getAttribute("placeholder");
            					});
                				alert(msg);
                				return;
                			}
                    		//取得父容器原有数据中的父页面数据
                    		var parentContainerId = $("#container" + inputId).attr("parentContainerId");
                            var parentData = null;
             				scope.$on("button.parentContainer.data",function (e, data){
             					if(data.srcDirID == parentContainerId){
             						parentData = data.d.parentData;
             					}
             				});
             				scope.$emit('getCurrConditionObject', {srcDirName:'button.parentContainer.data', srcDirID:parentContainerId});
                    		scope.$on('widgetButton.searchData', function(event, data){
                    			if(data.srcDirID == currWidgetId){
                    				var parentDataObj = eval("(" + parentData + ")");
                    				if(parentDataObj){
                        				inputData = $.extend(true, data.d, parentDataObj);
                    				}else{
                    					inputData = data.d;
                    				}
                    			}
                    		});
                    		scope.$emit('getSerializeObject', {type:inputType, id:inputId, srcDirName:'widgetButton.searchData',srcDirID:currWidgetId});
                    		
                		//如果输入是个datatable，取得选中行ID
                		}else if(inputType == "datatable"){
                			//取得父容器原有数据中的父页面数据
                    		var parentContainerId = $("#" + inputId).attr("parentContainerId");
                            var parentData = null;
             				scope.$on("button.parentContainer.data",function (e, data){
             					if(data.srcDirID == parentContainerId){
             						parentData = data.d.parentData;
             					}
             				});
             				scope.$emit('getCurrConditionObject', {srcDirName:'button.parentContainer.data', srcDirID:parentContainerId});
                    		//取得datatable选中数据ID
                    		var selectedIds;
             				scope.$on("widgetButton.selectedIds",function (e, data){
             					if(data.callbackDirID == currWidgetId){
             						selectedIds = data.d;
             					}
             				});
             				//取得当前检索条件
             				scope.$emit('transportWidgetDataForEachOther', 
             						{callbackDirName:'widgetButton.selectedIds',
             						callbackDirID:currWidgetId,
             						targetDirName:'datatable.page.selectedids',
             						targetDirID:inputId
             						});
             				inputData = {ids:selectedIds};
             				var parentDataObj = eval("(" + parentData + ")");
            				if(parentDataObj){
                				inputData = $.extend(true, {ids:selectedIds}, parentDataObj);
            				}else{
            					inputData = {ids:selectedIds};
            				}
                		}
                		if(outputType == "excel"){
                			inputData.tableId = outputId;
                            var form = $("<form>");//定义一个form表单
                            form.attr("style", "display:none");
                            form.attr("target", "");
                            form.attr("method", "post");
                            form.attr("action", "/rest/api/"+ COMMON.getProviderCode() + action);
                			for(var attr in inputData){
                                var input = $("<input>");
                                input.attr("type", "hidden");
                                input.attr("name", attr);
                                input.attr("value", inputData[attr]);
                                form.append(input);
                			}
                            $("body").append(form);//将表单放置在web中
                            form.submit();
                            form.remove();
                		}
                		if(outputType == "container"){            				
             				DataService.saveData(action, inputData).then(function (response) {
             					var outputData = response.plain();
             					if(outputData.id){
                 					if(outputServiceName != null){
                          	        	scope.$emit('doAction', {actionName:'subcontainer.initData', d:{id:outputId, d: {serviceName:outputServiceName, id:outputData.id}}});
                 					}
             					}else if(outputData.length > 0){
                      	        	scope.$emit('doAction', {actionName:'subcontainer.initData', d:{id:outputId, d:outputData}});
             					}
             				});
                		}
                		//如果输出是弹出页面
                		if(outputType == "popup"){
                			var actionList = action.split(":");
                			var popupServiceName = "";
                			var popupData = "";
                			var popupId = "";
        					if(inputType == "datatable" && inputData.ids < 1){
        						alert("请选择一条数据后再进行操作！");
        						return;
        					}
                			//用后台服务初始化弹出页
                			if(actionList[0] == "initService"){
                				if(actionList.length > 1){
                    				popupServiceName = "&serviceName="+ actionList[1];
                    				popupId = "&id=" + inputData.ids[0];
                				}
                			}
                			//用父页面数据初始化弹出页
                			if(actionList[0] == "initData"){
                				//初始化数据映射popup页面的控件
                				if(actionList.length > 1){
                					if(actionList[1].substr(0,1) == "{"){
                    					var mappingObj = eval('('+ action.substring(9) + ')');
                    					var grid_selector = "#table" + inputId;
                    					var rowid= jQuery(grid_selector).jqGrid('getGridParam','selrow');
                    					var rowObject = jQuery(grid_selector).jqGrid('getRowData', rowid);
                    					for(var item in rowObject){
                    						var currWidgetCode = mappingObj[item];
                    						if(currWidgetCode){
                    							popupData = popupData + "&" + currWidgetCode + "=" + rowObject[item];
                    						}
                						}
                					}else{
                						var parentIds={};
                						parentIds[actionList[1]]= inputData.ids;
                        				popupData = "&parentData=" + JSON.stringify(parentIds);
                					}
                				//初始化数据隐藏在popup页面中
                				}else{
                    				popupData = "&parentData=" + JSON.stringify(inputData);
                				}
                			}
                			var popupConfig = eval('('+ output.substring(6) + ')');
                			var popupSize = popupConfig["size"];
                			var popupTitle = popupConfig["title"];
                			var popupPageId = popupConfig["pageId"];
                			var closeFlush = popupConfig["closeFlush"];
                			var popupWidth = VISUALEDIT.HALFSCREENAVAILWIDTH;
                			var popupHeight = VISUALEDIT.HALFSCREENAVAILHEIGHT;
                			if(popupSize == "large"){
                    			popupWidth = VISUALEDIT.SCREENAVAILWIDTH;
                    			popupHeight = VISUALEDIT.SCREENAVAILHEIGHT;
                			}
                			if(popupSize == "small"){
                    			popupWidth = VISUALEDIT.QUARTERSCREENAVAILWIDTH;
                    			popupHeight = VISUALEDIT.QUARTERSCREENAVAILHEIGHT;
                			}
                	        var popupHtml = "app/controller/popup/popup.tpl.html?ram=" + Math.random() + "&widgetId="+currWidgetId;
                	        if(!popupPageId){
                	        	popupPageId = "";
                	        }
                	        if(closeFlush == null){
                	        	closeFlush = true;
                	        }
                	       /* $.ajax({
                	            type: "post",
                	            url: "/setPopupSession?widgetId="+currWidgetId,
                	            success: function (e) {
                	            	if(e.status.code == 100){
                	            		console.log("已经设置弹出框Session");
                	            	}
                	            }
                	        });*/
                			DataService.getPageContainers(popupPageId).then(function (response) {
                				if(response){
                					var popupPage = response;
                					var popupContainer = popupPage.containers[0];
                					if(!popupTitle){
                						popupTitle = popupPage.name;
                					}
                					var frameSrcUrl = "";
                                    frameSrcUrl = popupHtml
                                        + popupServiceName
                                        + popupId
                                        + popupData
                                        + '&popupTitle=' + popupTitle
                                        + '&pageId=' + popupPage.id
                                        + '&containerId=' + popupContainer.id;
                                    frameSrcUrl = encodeURI(frameSrcUrl);
                        			VISUALEDIT.popupWindow({
                						title: popupTitle, 
                						frameSrcUrl: frameSrcUrl,
                						width: popupWidth,
                						height: popupHeight,
                						closeFunc:function(){
                							if(closeFlush){
                    							scope.$emit('doAction', {actionName:'do.button.action', d:{}});
                							}
                						},
                						saveBeforePopup:false
            						});
                				}else{
                					//创建页面
                					var pageData = {
                							code:data.code + "_PG",
                							name:data.name + '的弹出页面'
                					};
                					DataService.saveData("page/saveorupdate", pageData).then(function (responsePage) {
                						var popupPage = responsePage;
                						var popupContainer = popupPage.containers[0];
                    					if(!popupTitle){
                    						popupTitle = popupPage.name;
                    					}
                						VISUALEDIT.popupWindow({
                    						title: popupTitle, 
                    						frameSrcUrl: popupHtml 
                    									+ popupServiceName
                    									+ popupId
                    									+ popupData
                    									+ 'popupTitle=' + popupTitle
                    									+ '&pageId=' + popupPage.id
                    									+ '&containerId=' + popupContainer.id,
                    						width: popupWidth,
                    						height: popupHeight,
                    						closeFunc:function(){
                    							if(closeFlush){
                        							scope.$emit('doAction', {actionName:'do.button.action', d:{}});
                    							}
                    						},
                    						saveBeforePopup:false
                						});
                     				});
                				}
                			});
                		}
                		if(outputType == "datatable"){
                    		var queryCondition = new Object();
                    		var page = new Object();
                    		//将查询条件数据送给哪个table控件
                    		queryCondition.id = outputId;
                    		queryCondition.d = {action:action,data:inputData};
                    		scope.$on('widgetButton.pageData', function(event, data){
                    			if(data.srcDirID == currWidgetId){
                    				page = data.d
                    				page.tableId = outputId;
                    			}
                    		});
                    		scope.$emit('getSerializeObject', {type:"tableDiv", id:outputId, srcDirName:'widgetButton.pageData',srcDirID:currWidgetId});
              	        	//把查询条件设置给页面变量conditionObject供翻页用
                    		scope.$emit('setTempObjectDataMap', queryCondition);
                    		var o = $.extend(true, inputData, page);
                    		DataService.findPageData(action, o).then(function (response) {
              	        		var grid_data = response.plain();
                  	        	scope.$emit('doAction', {actionName:'grid.data.update', d:{id:outputId, d: grid_data}});
              	        	});
                		}
                		if(outputType == "reflushPage"){
                    		DataService.findPageData(action, inputData).then(function (response) {
              	        		var result = response.plain();
              	        		if(result.status == "0" || result.status == 0){
                  	        		if(result.msg){
                  	        			alert(result.msg);
                  	        		}else{
                  	        			alert("操作完成！");
                  	        		}
              	        			scope.$emit('doAction', {actionName:'do.button.action', d:{}});
              	        		}else{
              	        			alert(result.msg);
              	        		}
              	        	});
                		}
                		if(outputType == "closeMe"){
                			if(action && inputData && action != ""){
                        		DataService.findPageData(action, inputData).then(function (response) {
                  	        		var result = response.plain();
              	        			alert(result.msg);
              	        			var formDialog = $('.formDialog', parent.document);
              	        			if(formDialog){
              	        				var formDialogId = formDialog.eq(0).attr("id");
              	        				var s;
              	        				if(formDialogId && formDialogId.indexOf("Window") > 0){
              	        					s = parseInt(formDialogId.substr(11));
              	        				}
              	        				COMMON.closePopupWindow(s);
              	        			}
                  	        	});
                			}else{
                				var formDialog = $('.formDialog', parent.document);
          	        			if(formDialog){
          	        				var formDialogId = formDialog.eq(0).attr("id");
          	        				var s;
          	        				if(formDialogId && formDialogId.indexOf("Window") > 0){
          	        					s = parseInt(formDialogId.substr(11));
          	        				}
          	        				COMMON.closePopupWindow(s);
          	        			}
                			}
                		}
            		}
            		scope.$on("do.button.action",function(event, data){
            			if(data && data.id){
            				if(data.id == currWidgetId){
                				doButtonAction();
                			}
            			}else if(scope.type && scope.type == "immediate"){
                			doButtonAction();
            			}
            		});
                	element.find("button").click(function(){
                		doButtonAction();
                	});
                	//如果当前Action是立即执行的Action
                	if(scope.type && scope.type == "immediate"){
          	        	//如果是输出是表格的情况，轮询10秒是否加载完成，执行初始Action
                		var timeCount = 0;
                		var timer = setInterval(function(){
                			//元素属性全部加载完成后渲染表格
                			if(outputType != "datatable" || $("#tableDiv" + outputId).hasClass("loaded")){
                				clearInterval(timer);
                				doButtonAction();
                			}
                			timeCount ++;
                    		//加载数据超时(10秒)，直接返回，不进行表格渲染
                			if(timeCount == 20){
                				alert("加载元素属性超时！");
                				clearInterval(timer);
                				return;
                			}
                		},500);
                	}
            	});
            }
        };
    }])
;
