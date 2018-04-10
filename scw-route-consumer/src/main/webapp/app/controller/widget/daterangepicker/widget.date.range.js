angular.module('controller.webpage.container.widget.date.range', [])
    .directive('widgetDateRange', ['DataService', 'Session', 'APP_CONFIG', function (DataService, Session, APP_CONFIG) {
        var reloadScope = function (scope, element, attrs, data) {
            var currWidgetId = attrs.id;
            scope.attConfigs = data.attConfigs;
            scope.containerId =  data.containerId;
            scope.template = data.tmpFlg;
            scope.id = currWidgetId;
            if(attrs.initvalue){
                scope.initvalue = attrs.initvalue;
            }else {
                scope.initvalue = "";
            }
            for(var index in data.attConfigs){
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
                if(currAttConfigType == "format"){
                    scope.format = currAttConfig.attValue;
                }
                if(currAttConfigType == "type"){
                    scope.type = currAttConfig.attValue;
                }
            }
            var elm = $('.date-picker', $(element));
            //设置默认类型值
            if(!scope.type){
                scope.type = "datetimerangepicker"
            }
            if(scope.type == "datetimerangepicker"){
                if(!scope.format){
                    scope.format == "YYYY-MM-DD HH:mm:ss";
                }
                scope.timePicker = true;
            }else{
                if(!scope.format){
                    scope.format == "YYYY-MM-DD";
                }
                scope.timePicker = false;
            }
            var locale = {
                "format": 'YYYY-MM-DD',
                "separator": " -222 ",
                "applyLabel": "确定",
                "cancelLabel": "取消",
                "fromLabel": "起始时间",
                "toLabel": "结束时间",
                "customRangeLabel": "自定义",
                "weekLabel": "W",
                "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
                "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                "firstDay": 1
            };
            elm.daterangepicker({
                    locale:locale,
                    showDropdowns : true,
//                        maxDate : moment(), //最大时间
                    showWeekNumbers : true, //是否显示第几周
                    timePicker : scope.timePicker, //是否显示小时和分钟
                    timePickerIncrement : 1, //时间的增量，单位为分钟
                    timePicker12Hour : false, //是否使用12小时制来显示时间
                    ranges : {
                        '最近1小时': [moment().subtract('hours',1), moment()],
                        '今日': [moment().startOf('day'), moment()],
                        '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
                        '最近7日': [moment().subtract('days', 6), moment()],
                        '最近30日': [moment().subtract('days', 29), moment()]
                    },
                    opens : 'right', //日期选择框的弹出位置
                    buttonClasses : [ 'btn btn-default' ],
                    applyClass : 'btn-small btn-primary blue',
                    cancelClass : 'btn-small',
                    separator : ' 至 ',
                    format : scope.format
                },
                function (start, end) {
                    var s = start.format(scope.format);
                    var e = end.format(scope.format);
                    $("#" + currWidgetId + "Start").val(s);
                    $("#" + currWidgetId + "End").val(e);
                });
            scope.$apply();
        };
        return {
            restrict: 'EA',
            templateUrl: '/app/controller/widget/daterangepicker/widget.date.range.tpl.html',
            replace: false,
            scope: {
            },
            link: function (scope, element, attrs) {
            	var currWidgetId = attrs.id;
                scope.template = attrs.template;
            	scope.clearData = function(){
        			$("#" + currWidgetId).val("");
        			$("#" + currWidgetId + "Start").val("");
        			$("#" + currWidgetId + "End").val("");
            	}
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