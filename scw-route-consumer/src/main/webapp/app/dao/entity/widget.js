function Widget (){
    this.id = "";
    this.code = "";
    this.name = "";
    this.containerId = "";
    this.type = "";
    this.sort = 0;
    this.tmpFlg = "true";
    this.attConfigs = new Array();
    this.elements = new Array();
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
    if(type == "@radio"){
        var widgetRadioSample = new WidgetRadioSample();
        return widgetRadioSample.createObject(containerId, widgetId);
    }
    if(type == "@check"){
        var widgetCheckSample = new WidgetCheckSample();
        return widgetCheckSample.createObject(containerId, widgetId);
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
    if(type == "@radio"){
        var widgetRadioSample = new WidgetRadioSample();
        widgetRadioSample.currWidget = widget;
        return widgetRadioSample;
    }
    if(type == "@check"){
        var widgetCheckSample = new WidgetCheckSample();
        widgetCheckSample.currWidget = widget;
        return widgetCheckSample;
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
    getElements: function () {
        return this.elements;
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