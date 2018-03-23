angular.module('controller.webpage.container.widget.file', [])
    .directive('widgetFile', ['DataService', 'Session', 'APP_CONFIG', function (DataService, Session) {
        var reloadScope = function (scope, element, attrs, data) {
            var currWidgetId = attrs.id;
            scope.template = data.tmpFlg;
            scope.containerId =  data.containerId;
            scope.attConfigs = data.attConfigs;
            var doInitvalue = function(initvalue){
                if(initvalue){
                    scope.initvalue = initvalue;
                }else {
                    scope.initvalue = "";
                }
            };
            scope.$on("widget.reload.initvalue",function(e, data){
                doInitvalue(attrs.initvalue);
                scope.$apply();
            });
            doInitvalue(attrs.initvalue);
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
            }
            element.find("input[type='file']").ace_file_input({
                no_file:'无文件 ...',
                btn_choose:'选择',
                btn_change:'更换',
                droppable:false,
                before_change:function(){
                    var el = element.find("input[type='file']");
                    var $form = el.parents('form');
                    if (el.val() == '') {
                        return false;
                    }
                    $form.attr('action', "/rest/api/" + COMMON.getProviderCode() + "/uploadfile");
                    var submitStatus = "";
                    $form.ajaxSubmit({
                        type: 'POST',
                        uploadProgress: function (evt, pos, tot, percComplete) {
                            if(submitStatus == ""){
                                $form.hide();
                                element.find(".progress").show();
                            }
                            submitStatus = "uploading";

                            scope.$apply(function () {
                                scope.progress = percComplete;
                            });

                            if (100 === percComplete) {
                                $form.show();
                                element.find(".progress").hide();
                                scope.$apply(function () {
                                    scope.progress = 0;
                                });
                                submitStatus = "";
                            }
                        },
                        error: function (evt, statusText, response, form) {
                        },
                        success: function (response, status, xhr, form) {
                            $form.removeAttr('action');
                            var uploadurl = response;
                            element.find("input[type='hidden']").val(uploadurl);
                        }
                    });
                    return true;
                },
                thumbnail:false //| true | large
                //whitelist:'gif|png|jpg|jpeg'
                //blacklist:'exe|php'
                //
            });
			scope.$apply();
        };
        return {
            restrict: 'EA',
            templateUrl: '/app/controller/widget/fileupload/widget.file.tpl.html',
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