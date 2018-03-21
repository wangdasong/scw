function Widget (){
    id = "";
    code = "";
    name = "",
    containerId = "";
    type = "";
    sort = 0;
    tmpFlg = "true";
    attConfigs = new Array();
    elements = new Array();
};
Widget.getWidgetByType = function(type, containerId, widgetId) {
    if(type == "@text"){
        var widgetTextSample = new WidgetTextSample();
        return widgetTextSample.createObject(containerId, widgetId);
    }
    if(type == "@datepicker"){
        var widgetDateSample = new WidgetDateSample();
        return widgetDateSample.createObject(containerId, widgetId);
    }
    if(type == "@daterangepicker"){
        var widgetDateRangeSample = new WidgetDateRangeSample();
        return widgetDateRangeSample.createObject(containerId, widgetId);
    }
    if(type == "@select"){
        var widgetSelectSample = new WidgetSelectSample();
        return widgetSelectSample.createObject(containerId, widgetId);
    }
}
Widget.getWidgetSample = function (type, widget) {
    if(type == "@text"){
        var widgetTextSample = new WidgetTextSample();
        widgetTextSample.currWidget = widget;
        return widgetTextSample;
    }
    if(type == "@datepicker"){
        var widgetDateSample = new WidgetDateSample();
        widgetDateSample.currWidget = widget;
        return widgetDateSample;
    }
    if(type == "@daterangepicker"){
        var widgetDateRangeSample = new WidgetDateRangeSample();
        widgetDateRangeSample.currWidget = widget;
        return widgetDateRangeSample;
    }
    if(type == "@select"){
        var widgetSelectSample = new WidgetSelectSample();
        widgetSelectSample.currWidget = widget;
        return widgetSelectSample;
    }
}

Widget.prototype = {
    constructor: Widget,
    getId: function () {
        return this.id;
    },
    getCode: function () {
        return this.code;
    },
    getName: function () {
        return this.name;
    },
    getContainerId: function () {
        return this.containerId;
    },
    getType: function () {
        return this.type;
    },
    getSort: function () {
        return this.sort;
    },
    getTmpFlg: function(){
        return this.tmpFlg;
    },
    getAttConfigs: function () {
        return this.attConfigs;
    },
    addAttribute: function (attConfig) {
        if(this.attConfigs == null){
            this.attConfigs = new Array();
        }
        this.attConfigs[this.attConfigs.length] = attConfig;
    },
    addElement: function (element) {
        if(this.elements == null){
            this.elements = new Array();
        }
        this.elements[this.elements.length] = element;
    }
}