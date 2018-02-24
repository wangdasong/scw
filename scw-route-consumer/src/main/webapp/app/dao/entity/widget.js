function Widget (){
};

Widget.prototype = {
    constructor: Widget,
    code: "",
    name: "",
    containerId: "",
    type: 0,
    sort: 0,
    getCode: function () {
        return code;
    },
    getName: function () {
        return name;
    },
    getContainerId: function () {
        return containerId;
    },
    getType: function () {
        return type;
    },
    getSort: function () {
        return sort;
    }
}