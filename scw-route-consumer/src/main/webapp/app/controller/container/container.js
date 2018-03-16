
angular.module('controller.webpage.container', [])
    .directive('webpageContainer', ['DataService', 'Session', 'APP_CONFIG', function (DataService, Session) {
    	var doLink = function (scope, element, attrs) {
            var subsysCode = COMMON.Cookie.get("subsysCode");
            if(subsysCode == null || subsysCode == ""){
                subsysCode = "common";
            }
            scope.cookieSubsysCode = subsysCode;
            var currContainerId = attrs.id;
            var currPageId = attrs.pageid;
            //如果没有静态的ID参数
            if(currContainerId == null || currContainerId == ""){
                //如果上层域也没有传ID过来直接返回
                if(scope.id == null || scope.id == ""){
                    return;
                    //使用动态的ID参数，直接从上层域获取
                }else{
                    currContainerId = scope.id;
                }
            }
            //如果没有静态的pageId参数
            if(currPageId == null || currPageId == ""){
                //如果上层域也没有传ID过来直接返回
                if(scope.pageId == null || scope.pageId == ""){
                    return;
                    //使用动态的ID参数，直接从上层域获取
                }else{
                    currPageId = scope.pageId;
                }
            }
            scope.id = currContainerId;
            scope.pageId = currPageId;
            scope.showPageList = function(){
                var pageUrl = "app/controller/edit/pageList.tpl.html?ram=" + Math.random();
                VISUALEDIT.popupWindow({title:'页面列表',
                    frameSrcUrl:pageUrl,
                    width:VISUALEDIT.SCREENAVAILWIDTH,
                    height:VISUALEDIT.SCREENAVAILHEIGHT
                });
            };
            scope.reflushVisualEdit = function(){
                reloadJs("visualEdit");
                alert("编辑模式已开启！");
            };

            //取得初始方法URL
            var paraServiceName = getQueryString("serviceName");
            var paraId = getQueryString("id");
            var paraData = getQueryString("parentData");
            function initContainer(data, serviceName, id, parentData, brotherData){
                var initvalueLoaded = false;
                //取得初始数据
                //父页面继承来的数据
                if(parentData){
                    data.parentData = parentData;
                    initvalueLoaded = true;
                    //根据参数从后台取来的
                }else if(serviceName && id){
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
                    //根据其他兄弟功能传来的json
                }else if(brotherData){
                    for(var i = 0; i < data.length; i++ ){
                        var currWidgets = data[i].widgets;
                        for(var j = 0; j < currWidgets.length; j++ ){
                            var currWidget = currWidgets[j];
                            for(var k = 0; k < brotherData.length; k++ ){
                                if(brotherData[k].label == currWidget.code){
                                    currWidget.initvalue = brotherData[k].value;
                                }
                            }
                        }
                    }
                    initvalueLoaded = true;
                    //根据url参数设定来的
                }else{
                    //传入数据是固定的
                    for(var i = 0; i < data.length; i++ ){
                        var currWidgets = data[i].widgets;
                        for(var j = 0; j < currWidgets.length; j++ ){
                            var currWidget = currWidgets[j];
                            if(getQueryString(currWidget.code)){
                                currWidget.initvalue = decodeURIComponent(getQueryString(currWidget.code));
                            }
                        }
                    }
                    initvalueLoaded = true;
                }
                //监听是否加载完成
                var timeCount = 0;
                var timer = setInterval(function(){
                    //元素属性全部加载完成后渲染表格
                    if(initvalueLoaded){
                        scope.containers = data;
                        scope.$emit('setTempObjectDataMap', {id:currContainerId, d:data});
                        scope.$apply();
                        // Portlets (boxes)
                        //让每一个自容器都能排序
                        /*$('.widget-main').sortable({
                            connectWith: '.widget-container-span',
                            items:'> .widget-box',
                            handle:'.widget-header',
                            opacity:0.8,
                            revert:true,
                            forceHelperSize:true,
                            placeholder: 'widget-placeholder',
                            forcePlaceholderSize:true,
                            tolerance:'pointer'
                        });*/
                        //为每一个子容器添加drop事件
                        $(".widget-main").each(function () {
                            var  containerId = $(this).attr("containerId");
                            $(this).droppable({
                                greedy: true,
                                drop: function(event,ui) {
                                    //测试代码开始
                                    var widgetId = COMMON.createUUID();
                                    var templateId = ui.helper.attr("widgettype");
                                    var widgetObject = Widget.getWidgetByType(templateId, containerId, templateId + "_"+ widgetId);
                                    //增加控件数据
                                    var newWidgetData = widgetObject.plain();
                                    Session.addWidget(newWidgetData);
                                    for(var i = 0; i < scope.containers.length; i ++ ){
                                        if(scope.containers[i].id == containerId){
                                            scope.$apply(function () {
                                                scope.containers[i].widgets[scope.containers[i].widgets.length] = newWidgetData;
                                            })
                                        }
                                    }
                                }
                            });
                        });
                        clearInterval(timer);
                        var t = setInterval(function(){
                            scope.$emit('doAction', {actionName:'widget.reload.initvalue', d:{}});
                            clearInterval(t);
                        },500)
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
            //等待本页面action刷新
            scope.$on("container.initData",function(event, data){
                if(data.id == currContainerId){
                    initContainer(data.d.containerData, data.d.serviceName, data.d.id, null, null);
                }
            });

            scope.$on("subcontainer.initData",function(event, data){
                var currSubContainers = scope.containers;
                for(var ctrIndex = 0; ctrIndex < currSubContainers.length; ctrIndex ++){
                    var currSubCtr = currSubContainers[ctrIndex];
                    if(data.id = currSubCtr.id){
                        if(data.d.serviceName){
                            initContainer(currSubContainers, data.d.serviceName, data.d.id, null, null);
                        }else{
                            initContainer(currSubContainers, null, null, null, data.d);
                        }
                    }
                }
            });
            var timeCount = 0;
            var timer = setInterval(function(){
                //取得用户信息后渲染用户信息显示标签
                var username = DataService.getUsername();
                if( username != "用户"){
                    clearInterval(timer);
                    DataService.getSubContainers(currContainerId).then(function (response) {
                        containerData = response.plain();
                        if(containerData != null && containerData.length > 0){
                            //如果有初始化方法
                            if(paraServiceName && paraId){
                                initContainer(containerData, paraServiceName, paraId, null, null);
                            }else if(paraData){
                                paraData = decodeURIComponent(paraData);
                                initContainer(containerData, null, null, paraData, null);
                            }else{
                                initContainer(containerData, null, null, null, null);
                            }
                        }else{
                            scope.containers = null;
                        }
                    });
                }
                timeCount ++;
                //加载数据超时(5秒)，直接返回，不进行表格渲染
                if(timeCount == 10){
                    alert("加载登录用户超时！");
                    clearInterval(timer);
                    return;
                }
            },500);

        };
        return {
            restrict: 'EA',
            templateUrl: '/app/controller/container/container.tpl.html',
//            require:'^editTools',
            replace: false,
            scope: {
            	id : "@",
            	pageid : "@"
            },
            controller:function($scope,$element,$attrs){
            	$scope.toolsButton = function(){
            		if($("#editTools").is(":hidden")){
            			$("#editTools").show();
            		}else{
                		$("#editTools").hide();
            		}
            	};
/*
                $scope.loadSubContainer = function (containerId) {
                    console.log("containerId===" + containerId);
                    setTimeout(function () {
                        if($("#container" + containerId).length < 1){
                            return;
                        }
                        $("#container" + containerId).droppable({
                            greedy: true,
                            drop: function(event,ui) {
                                  setTimeout( function () {
                                      $("#container" + containerId).find(".ui-draggable").each(function () {
                                          var $that = $(this);
                                          if(!$that.attr("droped")){
                                              $that.attr("droped", "true");
                                              //重新设置新建Dom的属性
                                              var templateId = $that.attr("widgettype");
                                              var widgetId = COMMON.createUUID();
                                              $that.attr("id", templateId + "_" + widgetId);
                                              $that.find(".view").attr("widgetid", widgetId);
                                              $that.attr("containerId", containerId);
                                              var widgetObject = Widget.getWidgetByType(templateId, containerId, widgetId);
                                              //增加控件数据
                                              Session.addWidget(widgetObject.plain());
                                          }
                                      });
                                  },100 );
                            }
                        });
                    },1000);
                };*/


            },
            link: function (scope, element, attrs) {
            	doLink(scope, element, attrs);




                /*scope.loadSubContainer = function (containerId) {
                    setTimeout(function () {
                        if($("#container" + containerId).length < 1){
                            return;
                        }
                        $("#container" + containerId).droppable({
                            greedy: true,
                            drop: function(event,ui) {
                                //测试代码开始
                                var widgetId = COMMON.createUUID();
                                var templateId = ui.helper.attr("widgettype");
                                var widgetObject = Widget.getWidgetByType(templateId, containerId, templateId + "_"+ widgetId);
                                //增加控件数据
                                var newWidgetData = widgetObject.plain();
                                Session.addWidget(newWidgetData);
                                for(var i = 0; i < scope.containers.length; i ++ ){
                                    if(scope.containers[i].id == containerId){
                                        scope.$apply(function () {
                                            scope.containers[i].widgets[scope.containers[i].widgets.length] = newWidgetData;
                                        })
                                    }
                                }
                               /!* setTimeout(function () {
                                    $("#container" + containerId).find(".ui-draggable").each(function () {
                                        var $that = $(this);
                                        if (!$that.attr("droped")) {
                                            $that.attr("droped", "true");
                                            $that.attr("id", templateId + "_" + widgetId);
                                            $that.find(".view").attr("widgetid", widgetId);
                                            $that.attr("containerId", containerId);
                                        }
                                    });
                                },500);*!/
                            }
                        });
                    },1000);
                };*/

            }
        };
    }])
;