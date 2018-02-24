
angular.module('controller.webpage.elementpanel', [])
    .directive('elementpanelContainer', ['DataService', 'APP_CONFIG', function (DataService) {
        return {
            restrict: 'EA',
            templateUrl: '/app/controller/container/elementpanel.tpl.html',
            replace: false,
            scope: {
            	id : "@",
            },
            controller:function($scope,$element,$attrs){
	        },
            link: function (scope, element, attrs) {
            	var currContainerId = attrs.id;
            	if(currContainerId == null || currContainerId == ""){
            		if(scope.id == null || scope.id == ""){
                		return;
            		}else{
            			currContainerId = scope.id;
            		}
            	}
            	scope.id = currContainerId;
            	scope.pageId = attrs.pageid;
            	//判断是否有初始数据
            	function getQueryString(name){
            	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            	     var r = window.location.search.substr(1).match(reg);
            	     if(r!=null)return  (r[2]); return null;
            	}
            	//取得初始方法URL
            	var paraServiceName = getQueryString("serviceName");
            	var paraId = getQueryString("id");
            	function initContainer(data, serviceName, id){
            		var initvalueLoaded = false;
            		//取得初始数据
                	DataService.findDataSrcList(serviceName, {id:id}).then(function (response) {
                		var dataSrcList = response.plain();
                		for(var i = 0; i < data.length; i++ ){
                			var currWidgets = data[i].widgets;
                    		for(var j = 0; j < currWidgets.length; j++ ){
                    			var currWidget = currWidgets[j];
                    			for(var k = 0; k < dataSrcList.length; k++ ){
                        			if(currWidget.code == dataSrcList[k].label){
                        				currWidget.initvalue = dataSrcList[k].value;
                        			}
                    			}
                    		}
                		}
                		initvalueLoaded = true;
                	});
            		//监听是否加载完成
                	var timeCount = 0;
            		var timer = setInterval(function(){
            			//元素属性全部加载完成后渲染表格
            			if(initvalueLoaded){
                			scope.containers = data;
                    		scope.$emit('setTempObjectDataMap', {id:currContainerId, d:data});
                			scope.$apply();
              	        	scope.$emit('doAction', {actionName:'widget.reload.initvalue', d:{}});                			
            				clearInterval(timer);
            			}
            			timeCount ++;
                		//加载数据超时(5秒)，直接返回，不进行表格渲染
            			if(timeCount == 50){
            				alert("加载元素属性超时！");
            				clearInterval(timer);
            				return;
            			}
            		},100);
            	}
            	var containerData;
            	scope.$on("container.initData",function(event, data){
            		if(data.id == currContainerId){
                		initContainer(data.d.containerData, data.d.serviceName, data.d.id);
            		}
            	});
            	DataService.getSubContainers(currContainerId).then(function (response) {
            		containerData = response.plain();          		
            		if(containerData != null && containerData.length > 0){
            			//如果有初始化方法
                    	if(paraServiceName && paraId){
                    		initContainer(containerData, paraServiceName, paraId);
                    	}else{
                    		//传入数据是固定的
                    		for(var i = 0; i < containerData.length; i++ ){
                    			var currWidgets = containerData[i].widgets;
                        		for(var j = 0; j < currWidgets.length; j++ ){
                        			var currWidget = currWidgets[j];
                        			if(getQueryString(currWidget.code)){
                        				currWidget.initvalue = getQueryString(currWidget.code)
                        			}
                    			}
                    		}
                			scope.containers = containerData;
                    		scope.$emit('setTempObjectDataMap', {id:currContainerId, d:containerData});
                    	}
            		}else{
            			scope.containers = null;
            		}
            	});
            }
        };
    }])
;