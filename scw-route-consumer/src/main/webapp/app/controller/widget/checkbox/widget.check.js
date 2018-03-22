angular.module('controller.webpage.container.widget.check', [])
    .directive('widgetCheck', ['DataService', 'Session', 'APP_CONFIG', function (DataService, Session) {
        var reloadScope = function (scope, element, attrs, data) {
            var currWidgetId = attrs.id;
            scope.containerId =  data.containerId;;
            scope.code = data.code;
            scope.template = data.tmpFlg;
            scope.attConfigs = data.attConfigs;
            scope.elements = data.elements;
            scope.initvalue = attrs.initvalue;
            var initvalueList = [];
            if(attrs.initvalue){
                initvalueList = scope.initvalue.split(",");
            }
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
                if(currAttConfigType == "serviceName"){
                    scope.serviceName = currAttConfig.attValue;
                }
                if(currAttConfigType == "cascade"){
                    if(currAttConfig.attValue){
                        scope.cascade = eval('('+currAttConfig.attValue+')');
                        scope.changeValue = function(elementId){
                            var currValue = $("#input" + elementId).val();
                            var dataStr = "{id:'" + scope.cascade.id + "',queryCondition:{" + scope.cascade.queryKey + ":'" +currValue+ "'}}";
                            var dataObj = eval('(' + dataStr + ')');
                            scope.$emit('doAction', {actionName:'widget.reload.options', d:dataObj});
                        };
                    }
                }
                if(currAttConfigType == "queryCondition"){
                    if(currAttConfig.attValue != null && currAttConfig.attValue !="" ){
                        scope.queryCondition = eval('('+currAttConfig.attValue+')');
                    }
                }
            }
            if(scope.serviceName != null && scope.serviceName != ""){
                var reloadOptions = function(queryCondition){
                    DataService.findDataSrcList(scope.serviceName, queryCondition).then(function (response){
                        var optionList = response.plain();
                        var elements = new Array(optionList.length);
                        for(var i = 0; i < optionList.length; i ++ ){
                            var currElement = {};
                            currElement.id = optionList[i].id;
                            currElement.label = optionList[i].label;
                            currElement.value = optionList[i].value;
                            currElement.checked = false;
                            for(var j = 0; j < initvalueList.length; j ++ ){
                                if(initvalueList[j] == currElement.value){
                                    currElement.checked = true;
                                }
                            }
                            elements[i] = currElement;
                        }
                        scope.elements = elements;
                        scope.$apply();
                        scope.changeValue;
                    });
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
                            scope.elements[i].checked = true;
                            scope.changeValue();
                        }
                    }
                    scope.$apply();
                    scope.changeValue;
                });

            }else{
                scope.elements = [];
                for(var i=0; i< data.elements.length; i ++ ){
                    var currElement = data.elements[i];
                    var currElementId = data.elements[i].id;
                    var currElementValue, currElementLabel, currElementChecked;
                    var loadElementAttribute =function (eleAttConfigs) {
                        var currElementForPage = {};
                        currElementForPage.id = currElementId;
                        for(var index2 in eleAttConfigs){
                            var currEleAttConfig = eleAttConfigs[index2];
                            var currEleAttConfigType = currEleAttConfig.type;
                            if(currEleAttConfigType == "label"){
                                currElementLabel = currEleAttConfig.attValue;
                                currElementForPage.label = currElementLabel;
                            }
                            if(currEleAttConfigType == "value"){
                                currElementValue = currEleAttConfig.attValue;
                                if(currElementValue == scope.initvalue){
                                    currElementForPage.selected = true;
                                }
                                currElementForPage.value = currElementValue;
                            }
                        }
                        scope.elements.push(currElementForPage);
                    };
                    //没有元素属性数据，去后台加载
                    if(currElement.attConfigs == null || currElement.attConfigs.length == 0) {
                        DataService.getAttConfigsByBelongId(currElementId).then(function (response) {
                            var eleAttConfigs = response.plain();
                            loadElementAttribute(eleAttConfigs);
                            /*
                            for(index2 in eleAttConfigs){
                                var currEleAttConfig = eleAttConfigs[index2];
                                var currEleAttConfigType = currEleAttConfig.type;
                                if(currEleAttConfigType == "label"){
                                    currElementLabel = currEleAttConfig.attValue;
                                    $("#span"+currEleAttConfig.belongId).html(currElementLabel);
                                }
                                if(currEleAttConfigType == "value"){
                                    currElementValue = currEleAttConfig.attValue;
                                    currElementChecked = false;
                                    for(var j = 0; j < initvalueList.length; j ++ ){
                                        if(initvalueList[j] == currElementValue){
                                            currElementChecked = true;
                                        }
                                    }
                                    $("#input"+currEleAttConfig.belongId).val(currElementValue);
                                    $("#input"+currEleAttConfig.belongId).attr("checked",currElementChecked);
                                }
                            }
                            */
                        });
                    }else{
                        //存在元素属性（模板数据）直接使用元素属性
                        var reloadAndApplay = function (currElementThis) {
                            loadElementAttribute(currElementThis.attConfigs);
                        };
                        setTimeout(reloadAndApplay(currElement),100);
					}
                }
            }
            scope.$apply();
        };
        return {
            restrict: 'EA',
            templateUrl: '/app/controller/widget/checkbox/widget.check.tpl.html',
            replace: false,
            scope: {
            },
            link: function (scope, element, attrs) {
            	var currWidgetId = attrs.id;
            	scope.id = currWidgetId;
            	DataService.getWidgetDetailById(currWidgetId).then(function (response) {
            		var data = response.plain();
                    reloadScope(scope, element, attrs, data);
            	});
                scope.updateWidgetAttData = function (widgetId, attCode, attValue) {
                    var data = Session.updateWidgetAttData(widgetId, attCode, attValue);
                    reloadScope(scope, element, attrs, data);
                };
                scope.updateWidgetData = function (widgetId, name, value) {
                    var data = Session.updateWidgetData(widgetId, name, value);
                    reloadScope(scope, element, attrs, data);
                };
                scope.updateElementAttData = function (widgetId, elementId, attCode, attValue) {
                    var data = Session.updateElementAttData(widgetId, elementId, attCode, attValue);
                    reloadScope(scope, element, attrs, data);
                };
                scope.addSampleElementToWidget = function (widgetId) {
                    var widgetSelectSample = new WidgetSelectSample();
                    var sampleElement = widgetSelectSample.createSampleElement(widgetId);
                    var currWidget = Session.getWidgetObjectById(widgetId);
                    currWidget.addElement(sampleElement);
                    reloadScope(scope, element, attrs, currWidget);
                };
                scope.saveWidgetInfo = function (widgetId) {
                    DataService.saveWidgetInfo(widgetId).then(function (response) {
                        var data = response.plain();
                        reloadScope(scope, element, attrs, data);
                    });
                };
            }
        };
    }])
;

