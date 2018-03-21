function Element (){
    id = "";
    code = "";
    name = "";
    widgetId = "";
    attConfigs = new Array();
};

Element.prototype = {
    constructor: Element,
    getCode: function () {
        return this.code;
    },
    getName: function () {
        return this.name;
    },
    getWidgetId: function () {
        return this.widgetId;
    },
    addAttribute: function (attConfig) {
        if(this.attConfigs == null){
            this.attConfigs = new Array();
        }
        this.attConfigs[this.attConfigs.length] = attConfig;
    }
}