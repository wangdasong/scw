angular.module('controller.webpage', []).controller('WebPageController', [
    '$scope',
    'DataService',
    'Session',
    function($scope, DataService, Session){
    	//初始化弹出页抬头
    	var popupTitle = getQueryString("popupTitle");
    	if(popupTitle){
    		$scope.popupTitle = decodeURI(popupTitle);
    	}
    	var popupContainerId = getQueryString("containerId");
    	if(popupContainerId){
    		$scope.popupContainerId = popupContainerId;
    	}
    	var popupPageId = getQueryString("pageId");
    	if(popupPageId){
    		$scope.popupPageId = popupPageId;
    	}
    	var currPageId = Session.pageId;
    	if(!currPageId){
    		currPageId = popupPageId;
    	}
    	if(currPageId){
        	DataService.getPageContainers(currPageId).then(function (response) {
        		var data = response.plain();
        		$scope.providerCode = data.providerCode;
        		$scope.pageId = currPageId;
        		$scope.containers = data.containers;
        	});
    	}
    	$scope.$on('doAction', function(event, data) {
    		$scope.$broadcast(data.actionName, data.d);
    		event.stopPropagation();
    	});
    	$.fn.serializeObject = function(){
            var result = {};
            $(this).find("input,select").each(function(){
                if($(this).attr("disabled")) return;
                var type= $(this).attr("type");
                if(type&&(type.toLocaleLowerCase()=="radio"||type.toLocaleLowerCase() == "checkbox")&&!(this.checked))return;
                var name = $(this).attr("name");
                var value = $(this).val();
                if(name&&value){
                    if(result[name]){
                    	if(result[name] instanceof Array){
                        	var arrLength = result[name].length;
                        	result[name][arrLength] = value;
                    	}else{
                    		var index0 = result[name];
                    		result[name] = new Array();
                        	result[name][0] = index0;
                        	result[name][1] = value;
                    	}
                    }else{
                        result[name] =  value;
                    }
                }
            });
            return result;
    	};
    	$scope.tempObject = new Array();
    	$scope.serializeObject = new Object();
    	$scope.$on('setTempObjectDataMap', function(event, data) {
    		var dataValue = data.d;
    		$scope.tempObject[data.id] = dataValue;
    	});
    	$scope.$on('getCurrConditionObject', function(event, data) {
    		//返回给哪个方法
    		var srcDirName = data.srcDirName;
    		//返回给哪个具体控件
    		var srcDirID = data.srcDirID;
    		//返回数据
    		var conditionObject = $scope.tempObject[srcDirID];
    		var reData = {srcDirID:srcDirID, d:conditionObject};
    		$scope.$broadcast(srcDirName, reData);
    	});
    	$scope.$on('getSerializeObject', function(event, data) {
    		var id = data.id;
    		var objectType = data.type;
    		var srcDirName = data.srcDirName;
    		var srcDirID = data.srcDirID;
    		var jsonuserinfo = $('#' + objectType + id).serializeObject();
    		if(objectType == "tableDiv"){
    			var tablepage = {};
    			tablepage.pageNumber = jsonuserinfo.pageNumber;
    			tablepage.pageSize = jsonuserinfo.pageSize;
    			tablepage.pageSort = jsonuserinfo.pageSort;
    			jsonuserinfo = tablepage;
    		}
    		var reData = {srcDirID:srcDirID, d:jsonuserinfo};
    		$scope.$broadcast(srcDirName, reData);
    	});
    	

    	$scope.$on('transportWidgetDataForEachOther', function(event, data) {
    		//返回给哪个方法
    		var callbackDirName = data.callbackDirName;
    		//返回给哪个具体控件
    		var callbackDirID = data.callbackDirID;
    		//调取哪个方法
    		var targetDirName = data.targetDirName;
    		//调用哪个具体控件
    		var targetDirID = data.targetDirID;
    		$scope.$broadcast(targetDirName, {id:targetDirID});
    		
    		//返回数据
    		var transportWidgetData = $scope.tempObject[targetDirName + targetDirID];
    		var reData = {callbackDirID:callbackDirID, d:transportWidgetData};
    		$scope.$broadcast(callbackDirName, reData);
    	});

    	//取得导航路径
    	if(Session.menuElementId){
        	DataService.getMenuPath(Session.menuElementId).then(function (response) {
        		$scope.elementPath = response;
    			var indexArray = [];
        		for(var i = 0; i < $scope.elementPath.length; i ++ ){
        			var currElementId = $scope.elementPath[i].id;
        			indexArray[currElementId] = i;
        			//加载第一级菜单属性
        			DataService.getAttConfigsByBelongId(currElementId).then(function (response){
        				eleAttConfigs = response.plain();
            			for(var index0 = 0; index0 < eleAttConfigs.length; index0 ++ ){
            				var currEleAttConfig = eleAttConfigs[index0];
            				var currEleAttConfigType = currEleAttConfig.type;
            				var currEleAttConfigBelongId = currEleAttConfig.belongId;
                			if(currEleAttConfigType == "url"){
                				currElementUrl = currEleAttConfig.attValue;
                				$scope.elementPath[indexArray[currEleAttConfigBelongId]].url = currElementUrl;
                			}
                			if(currEleAttConfigType == "icon"){
                				currElementIcon = currEleAttConfig.attValue;
                				$scope.elementPath[indexArray[currEleAttConfigBelongId]].icon = currElementIcon;
                			}
                			if(currEleAttConfigType == "label"){
                				currElementLabel = currEleAttConfig.attValue;
                				$scope.elementPath[indexArray[currEleAttConfigBelongId]].label = currElementLabel;
                			}
                			if(currEleAttConfigType == "folder"){
                				currElementFolder = currEleAttConfig.attValue;
                				if(currElementFolder == "true"){
                					$scope.elementPath[indexArray[currEleAttConfigBelongId]].folder = true;
                				}else{
                					$scope.elementPath[indexArray[currEleAttConfigBelongId]].folder = false;
                				}
                			}
            			}
            			indexArray[currEleAttConfigBelongId] = null;
        			});
        			
        		}
        	});
    	}
    }
])
;