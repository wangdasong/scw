angular.module('controller.webpage.container.widget.menu', [])
    .directive('widgetMenu', ['$route', 'DataService', 'LoadingService', 'Session', function ($route, DataService, LoadingService, Session) {
        return {
            restrict: 'EA',
            templateUrl: '/app/controller/widget/menu/widget.menu.tpl.html',
            replace: false,
            scope: {
            },
            controller: function ($scope, $location) {
                $scope.path = "#" + $location.path();
            },
            link: function (scope, element, attrs) {
            	var currWidgetId = attrs.id;
            	scope.id = currWidgetId;
                scope.menuClick = function (path, canBeClick, obj) {
                	Session.setMenuElementId(obj);
                	$("#sidebar .active").each(function(){
                		$(this).removeClass("active");
                	});
                    if (canBeClick === true){
                    	$("#li" + obj).parents("li").each(function(){
                    		$(this).addClass("active");
                    	});
                    	$("#li" + obj).addClass("active");
                        if(scope.path === path) {
                            $route.reload();
                        }
                        LoadingService.show();
                        scope.path = path;
                    }
                }
            	DataService.getWidgetDetailById(currWidgetId).then(function (response) {
            		var data = response.plain();
            		scope.attConfigs = data.attConfigs;
            		//权限过滤
            		scope.elements = data.elements;
        			scope.queryCondition = {};
            		for(index in data.attConfigs){
                		var currAttConfig = data.attConfigs[index];
            			var currAttConfigType = currAttConfig.type;
            			if(currAttConfigType == "label"){
            				scope.label = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "width"){
            				scope.width = currAttConfig.attValue;
            			}
            		}
        			var i = 0;
        			var indexArray = [];
            		for(i=0; i< data.elements.length; i ++ ){
            			var currElementId = data.elements[i].id;
            			indexArray[currElementId] = i;
            			var currElementUrl, currElementIcon, currElementLabel, currElementFolder;
            			//加载第一级菜单属性
            			DataService.getAttConfigsByBelongId(currElementId).then(function (response){
            				eleAttConfigs = response.plain();
                			for(index0 in eleAttConfigs){
                				var currEleAttConfig = eleAttConfigs[index0];
                				var currEleAttConfigType = currEleAttConfig.type;
                				var currEleAttConfigBelongId = currEleAttConfig.belongId;
                    			if(currEleAttConfigType == "url"){
                    				currElementUrl = currEleAttConfig.attValue;
                    				scope.elements[indexArray[currEleAttConfigBelongId]].url = currElementUrl;
                    			}
                    			if(currEleAttConfigType == "icon"){
                    				currElementIcon = currEleAttConfig.attValue;
                    				scope.elements[indexArray[currEleAttConfigBelongId]].icon = currElementIcon;
                    			}
                    			if(currEleAttConfigType == "label"){
                    				currElementLabel = currEleAttConfig.attValue;
                    				scope.elements[indexArray[currEleAttConfigBelongId]].label = currElementLabel;
                    			}
                    			if(currEleAttConfigType == "folder"){
                    				currElementFolder = currEleAttConfig.attValue;
                    				if(currElementFolder == "true"){
                        				scope.elements[indexArray[currEleAttConfigBelongId]].folder = true;
                    				}else{
                        				scope.elements[indexArray[currEleAttConfigBelongId]].folder = false;
                    				}
                    			}
                			}
                			indexArray[currEleAttConfigBelongId] = null;
            			});
            			var sub1Eles = scope.elements[i].childElements;
            			var j = 0;
            			for(j=0; j< sub1Eles.length; j ++ ){
                			var currsub1ElementId = sub1Eles[j].id;
                			indexArray[currsub1ElementId] = [i,j];
                			var currsub1ElementUrl, currsub1ElementIcon, currsub1ElementLabel, currsub1ElementFolder;
                			//加载第二级菜单属性
                			DataService.getAttConfigsByBelongId(currsub1ElementId).then(function (response){
                				elesub1AttConfigs = response.plain();
                    			for(index1 in elesub1AttConfigs){
                    				var currsub1EleAttConfig = elesub1AttConfigs[index1];
                    				var currsub1EleAttConfigType = currsub1EleAttConfig.type;
                    				var currsub1EleAttConfigBelongId = currsub1EleAttConfig.belongId;
                        			if(currsub1EleAttConfigType == "url"){
                        				currsub1ElementUrl = currsub1EleAttConfig.attValue;
                        				scope.elements[indexArray[currsub1EleAttConfigBelongId][0]].childElements[indexArray[currsub1EleAttConfigBelongId][1]].url = currsub1ElementUrl;
                        			}
                        			if(currsub1EleAttConfigType == "icon"){
                        				currsub1ElementIcon = currsub1EleAttConfig.attValue;
                        				scope.elements[indexArray[currsub1EleAttConfigBelongId][0]].childElements[indexArray[currsub1EleAttConfigBelongId][1]].icon = currsub1ElementIcon;
                        			}
                        			if(currsub1EleAttConfigType == "label"){
                        				currsub1ElementLabel = currsub1EleAttConfig.attValue;
                        				scope.elements[indexArray[currsub1EleAttConfigBelongId][0]].childElements[indexArray[currsub1EleAttConfigBelongId][1]].label = currsub1ElementLabel;
                        			}
                        			if(currsub1EleAttConfigType == "folder"){
                        				currsub1ElementFolder = currsub1EleAttConfig.attValue;
                        				if(currsub1ElementFolder == "true"){
                            				scope.elements[indexArray[currsub1EleAttConfigBelongId][0]].childElements[indexArray[currsub1EleAttConfigBelongId][1]].folder = true;
                        				}else{
                            				scope.elements[indexArray[currsub1EleAttConfigBelongId][0]].childElements[indexArray[currsub1EleAttConfigBelongId][1]].folder = false;
                        				}
                        			}
                    			}
                    			indexArray[currsub1EleAttConfigBelongId] = null;
                			});

                			var sub2Eles = scope.elements[i].childElements[j].childElements;
                			var k = 0;
                			for(k =0; k< sub2Eles.length; k ++ ){
                    			var currsub2ElementId = sub2Eles[k].id;
                    			indexArray[currsub2ElementId] = [i,j,k];
                    			var currsub2ElementUrl, currsub2ElementIcon, currsub2ElementLabel, currsub2ElementFolder;
                    			//加载第三级菜单属性
                    			DataService.getAttConfigsByBelongId(currsub2ElementId).then(function (response){
                    				elesub2AttConfigs = response.plain();
                        			for(index2 in elesub2AttConfigs){
                        				var currsub2EleAttConfig = elesub2AttConfigs[index2];
                        				var currsub2EleAttConfigType = currsub2EleAttConfig.type;
                        				var currsub2EleAttConfigBelongId = currsub2EleAttConfig.belongId;
                            			if(currsub2EleAttConfigType == "url"){
                            				currsub2ElementUrl = currsub2EleAttConfig.attValue;
                            				scope.elements[indexArray[currsub2EleAttConfigBelongId][0]].childElements[indexArray[currsub2EleAttConfigBelongId][1]].childElements[indexArray[currsub2EleAttConfigBelongId][2]].url = currsub2ElementUrl;
                            			}
                            			if(currsub2EleAttConfigType == "icon"){
                            				currsub2ElementIcon = currsub2EleAttConfig.attValue;
                            				scope.elements[indexArray[currsub2EleAttConfigBelongId][0]].childElements[indexArray[currsub2EleAttConfigBelongId][1]].childElements[indexArray[currsub2EleAttConfigBelongId][2]].icon = currsub2ElementIcon;
                            			}
                            			if(currsub2EleAttConfigType == "label"){
                            				currsub2ElementLabel = currsub2EleAttConfig.attValue;
                            				scope.elements[indexArray[currsub2EleAttConfigBelongId][0]].childElements[indexArray[currsub2EleAttConfigBelongId][1]].childElements[indexArray[currsub2EleAttConfigBelongId][2]].label = currsub2ElementLabel;
                            			}
                            			if(currsub2EleAttConfigType == "folder"){
                            				currsub2ElementFolder = currsub2EleAttConfig.attValue;
                            				if(currsub2ElementFolder == "true"){
                                				scope.elements[indexArray[currsub2EleAttConfigBelongId][0]].childElements[indexArray[currsub2EleAttConfigBelongId][1]].childElements[indexArray[currsub2EleAttConfigBelongId][2]].folder = true;
                            				}else{
                                				scope.elements[indexArray[currsub2EleAttConfigBelongId][0]].childElements[indexArray[currsub2EleAttConfigBelongId][1]].childElements[indexArray[currsub2EleAttConfigBelongId][2]].folder = false;
                            				}
                            			}
                        			}
                        			indexArray[currsub2EleAttConfigBelongId] = null;
                    			});
                    			var sub3Eles = scope.elements[i].childElements[j].childElements[k].childElements;
                    			var l = 0;
                    			for(l =0; l< sub3Eles.length; l ++ ){
                        			var currsub3ElementId = sub3Eles[l].id;
                        			indexArray[currsub3ElementId] = [i,j,k,l];
                        			var currsub3ElementUrl, currsub3ElementIcon, currsub3ElementLabel, currsub3ElementFolder;
                        			//加载第三级菜单属性
                        			DataService.getAttConfigsByBelongId(currsub3ElementId).then(function (response){
                        				elesub3AttConfigs = response.plain();
                            			for(index3 in elesub3AttConfigs){
                            				var currsub3EleAttConfig = elesub3AttConfigs[index3];
                            				var currsub3EleAttConfigType = currsub3EleAttConfig.type;
                            				var currsub3EleAttConfigBelongId = currsub3EleAttConfig.belongId;
                                			if(currsub3EleAttConfigType == "url"){
                                				currsub3ElementUrl = currsub3EleAttConfig.attValue;
                                				scope.elements[indexArray[currsub3EleAttConfigBelongId][0]].childElements[indexArray[currsub3EleAttConfigBelongId][1]].childElements[indexArray[currsub3EleAttConfigBelongId][2]].childElements[indexArray[currsub3EleAttConfigBelongId][3]].url = currsub3ElementUrl;
                                			}
                                			if(currsub3EleAttConfigType == "icon"){
                                				currsub3ElementIcon = currsub3EleAttConfig.attValue;
                                				scope.elements[indexArray[currsub3EleAttConfigBelongId][0]].childElements[indexArray[currsub3EleAttConfigBelongId][1]].childElements[indexArray[currsub3EleAttConfigBelongId][2]].childElements[indexArray[currsub3EleAttConfigBelongId][3]].icon = currsub3ElementIcon;
                                			}
                                			if(currsub3EleAttConfigType == "label"){
                                				currsub3ElementLabel = currsub3EleAttConfig.attValue;
                                				scope.elements[indexArray[currsub3EleAttConfigBelongId][0]].childElements[indexArray[currsub3EleAttConfigBelongId][1]].childElements[indexArray[currsub3EleAttConfigBelongId][2]].childElements[indexArray[currsub3EleAttConfigBelongId][3]].label = currsub3ElementLabel;
                                			}
                                			if(currsub3EleAttConfigType == "folder"){
                                				currsub3ElementFolder = currsub3EleAttConfig.attValue;
                                				if(currsub3ElementFolder == "true"){
                                    				scope.elements[indexArray[currsub3EleAttConfigBelongId][0]].childElements[indexArray[currsub3EleAttConfigBelongId][1]].childElements[indexArray[currsub3EleAttConfigBelongId][2]].childElements[indexArray[currsub3EleAttConfigBelongId][3]].folder = true;
                                				}else{
                                    				scope.elements[indexArray[currsub3EleAttConfigBelongId][0]].childElements[indexArray[currsub3EleAttConfigBelongId][1]].childElements[indexArray[currsub3EleAttConfigBelongId][2]].childElements[indexArray[currsub3EleAttConfigBelongId][3]].folder = false;
                                				}
                                			}
                            			}
                            			indexArray[currsub3EleAttConfigBelongId] = null;
                        			});
                    			}
                			}
            			}
            		}
            		ace.handle_side_menu(jQuery);
            		reloadJs("reloadAceElement");
            	});
            }
        };
    }])
;

