angular.module('controller.webpage.container.widget.select', [])
    .directive('widgetSelect', ['DataService', 'Session', 'APP_CONFIG', function (DataService, Session) {
    	var reloadScope = function (scope, element, attrs, data) {
            var currWidgetId = attrs.id;
            scope.labelValue = "";
            scope.code = data.code;
            scope.containerId =  data.containerId;
            scope.attConfigs = data.attConfigs;
            scope.template = data.tmpFlg;
            scope.elements = data.elements;
            scope.id = currWidgetId;
            scope.initvalue = attrs.initvalue;
            scope.queryCondition = {};
            scope.cascadeFuc = null;
            for(var index1 in data.attConfigs){
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
                    scope.cascadeStr = currAttConfig.attValue;
                    if(currAttConfig.attValue){
                        scope.cascade = eval('('+currAttConfig.attValue+')');
                        scope.cascadeFuc = function(){
                            var currValue = $("#" + currWidgetId).val();
                            var dataStr = "{id:'" + scope.cascade.id + "',queryCondition:{" + scope.cascade.queryKey + ":'" +currValue+ "'}}";
                            var dataObj = eval('(' + dataStr + ')');
                            scope.$emit('doAction', {actionName:'widget.reload.options', d:dataObj});
                        };
                    }
                }
                if(currAttConfigType == "queryCondition"){
                    scope.queryConditionStr = currAttConfig.attValue;
                    if(currAttConfig.attValue){
                        scope.queryCondition = eval('('+currAttConfig.attValue+')');
                    }
                }
            }
            scope.changeValue = function(){
                var selectOption = $("#" + currWidgetId + ">option:selected");
                if(selectOption){
                    $("#" + currWidgetId).prev().val(selectOption.text().replace("请选择","").trim());
                }
                if(scope.cascadeFuc){
                    scope.cascadeFuc();
                }
            }
            //有数据源的控件，根据数据源读取选项信息
            if(scope.serviceName != null && scope.serviceName != ""){
                var reloadOptions = function(queryCondition){
                    if(scope.queryKey){
                        var maxElementLength = 10;
                        DataService.findDataSrcList(scope.serviceName, queryCondition).then(function (response){
                            $("#" + currWidgetId).selectpicker({
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
                                    $("#" + currWidgetId).selectpicker('render');
                                    $("#" + currWidgetId).selectpicker('refresh');
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
                            $("#" + currWidgetId).selectpicker('render');
                            $("#" + currWidgetId).selectpicker('refresh');
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
                scope.elements = [];
                for(var i=0; i< data.elements.length; i ++ ){
                	var currElement = data.elements[i];
                    var currElementId = currElement.id;
                    var currElementValue, currElementLabel;
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
                    if(currElement.attConfigs == null || currElement.attConfigs.length == 0){
                        DataService.getAttConfigsByBelongId(currElementId).then(function (response){
                            var  currAttConfigs = response.plain();
                            loadElementAttribute(currAttConfigs);
                        });
					}else {
                    	//存在元素属性（模板数据）直接使用元素属性
						var reloadAndApplay = function (currElementThis) {
                            loadElementAttribute(currElementThis.attConfigs);
                        }
                        setTimeout(reloadAndApplay(currElement),100);
					}
                }
            }
            scope.$apply();
        };
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

