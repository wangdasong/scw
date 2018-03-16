angular.module('controller.webpage.container.widget.text', [])
    .directive('widgetText', ['DataService','Session', 'APP_CONFIG', function (DataService,Session) {

        var reloadScope = function (scope, element, attrs, data) {
            var currWidgetId = attrs.id;
            scope.attConfigs = data.attConfigs;
            scope.id = currWidgetId;
            scope.isReadonly = "false";
            scope.containerId =  data.containerId;
            var doInitvalue = function(initvalue) {
                if (initvalue) {
                    scope.initvalue = initvalue;
                } else {
                    scope.initvalue = "";
                }
            };
            scope.$on("widget.reload.initvalue", function (e, data) {
                doInitvalue(attrs.initvalue);
                scope.$apply();
            });
            doInitvalue(attrs.initvalue);
            scope.message = "";
            for (index in data.attConfigs) {
                var currAttConfig = data.attConfigs[index];
                var currAttConfigType = currAttConfig.type;
                if (currAttConfigType == "label") {
                    scope.label = currAttConfig.attValue;
                }
                if (currAttConfigType == "name") {
                    scope.name = currAttConfig.attValue;
                }
                if (currAttConfigType == "type") {
                    scope.type = currAttConfig.attValue;
                }
                if (currAttConfigType == "width") {
                    scope.width = currAttConfig.attValue;
                }
                if (currAttConfigType == "height") {
                    scope.height = currAttConfig.attValue;
                }
                if (currAttConfigType == "regular") {
                    scope.regular = currAttConfig.attValue;
                }
                if (currAttConfigType == "require") {
                    scope.require = currAttConfig.attValue;
                }
                if (currAttConfigType == "message") {
                    scope.message = currAttConfig.attValue;
                }
            }
            if (scope.type == "readonly") {
                scope.isReadonly = true;
            } else {
                scope.isReadonly = false;
            }
            if (scope.type == "hidden") {
                scope.isHidden = true;
            } else {
                scope.isHidden = false;
            }
            if (scope.message == "") {
                scope.message = "请输入正确的" + scope.label;
            }
            scope.$apply();
        }


        var doLink = function (scope, element, attrs) {
            var currWidgetId = attrs.id;
            scope.template = attrs.template;
            var clearWarning = function (){
                $("#span" + currWidgetId).attr("title", scope.message);
                $("#i" + currWidgetId).attr("class","icon-info-sign");
                $("#i" + currWidgetId).css("color", "");
                $("#span" + currWidgetId).removeAttr("onclick");
                element.find("input").css("background-color","");
                element.find("input").removeClass("check-failed");
            }
            var setWarning = function (){
                $("#i" + currWidgetId).attr("class","icon-remove-sign alert-danger");
                $("#span" + currWidgetId).attr("title",scope.message);
                $("#i" + currWidgetId).flash(500);
                $("#span" + currWidgetId).click(function(){
                    if($("#i" + currWidgetId).hasClass("icon-remove-sign")){
                        element.find("input").val("");
                        element.find("input").css("background-color","");
                        element.find("input").removeClass("check-failed");
                    }
                });
                element.find("input").focus();
                element.find("input").css("background-color","#d15b47");
                element.find("input").addClass("check-failed");
            }
            element.find("input").blur(function(){
                var currValue = $(this).val().trim();
                if(currValue.length != 0 && scope.regular){
                    var r = currValue.match(scope.regular);
                    if(r == null){
                        setWarning();
                    }else{
                        clearWarning();
                    }
                }else{
                    clearWarning();
                }
                if(scope.require == "true"){
                    if(currValue.length == 0){
                        setWarning();
                    }else{
                        clearWarning();
                    }
                }
            });
            DataService.getWidgetDetailById(currWidgetId).then(function (response) {
                var data = response.plain();
                reloadScope(scope, element, attrs, data);
            });
        }
        return {
            restrict: 'EA',
            templateUrl: '/app/controller/widget/text/widget.text.tpl.html',
            replace: false,
            scope: {
                elementpanel : '@',
            },
            controller: function ($scope,$element,$attrs) {
            },
            link: function (scope, element, attrs) {
                doLink(scope, element, attrs);
                scope.updateWidgetAttData = function (widgetId, attCode, attValue) {
                    var data = Session.updateWidgetAttData(widgetId, attCode, attValue);
                    reloadScope(scope, element, attrs, data);
                };
            }
        };
    }])
;
