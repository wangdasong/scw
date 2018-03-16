function Widget (){
};
Widget.getWidgetByType = function(type, containerId, widgetId) {
    if(type == "@text"){
        var widgetTextSample = new WidgetTextSample();
        return widgetTextSample.createObject(containerId, widgetId);
    }
    if(type == "@radio"){
        var widgetTextSample = new WidgetTextSample();
        return widgetTextSample.createObject(containerId, widgetId);
    }
}
Widget.getWidgetSample = function (type, widget) {
    if(type == "@text"){
        var widgetTextSample = new WidgetTextSample();
        widgetTextSample.currWidget = widget;
        return widgetTextSample;
    }
}

Widget.prototype = {
    constructor: Widget,
    id:"",
    code: "",
    name: "",
    containerId: "",
    type: "",
    sort: 0,
    tmpFlg: "true",
    attConfigs:[],
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
    addAttribute: function (attConfig) {
        if(this.attConfigs == null){
            this.attConfigs = new Array();
        }
        this.attConfigs[this.attConfigs.length] = attConfig;
    }
}