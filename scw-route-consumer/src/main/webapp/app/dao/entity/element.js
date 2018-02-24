function Element (){
};

Element.prototype = {
    constructor: Element,
    code: "",
    name: "",
    widgetId: "",
    getCode: function () {
        return code;
    },
    getName: function () {
        return name;
    },
    getWidgetId: function () {
        return widgetId;
    }
}