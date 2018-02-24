function Container (){
};

Container.prototype = {
    constructor: Container,
    code: "",
    name: "",
    type: 0,
    pageId: "",
    containerId: "",
    sort: 0,
    width:12,
    getCode: function () {
        return code;
    },
    getName: function () {
        return name;
    },
    getPageId: function () {
        return containerId;
    },
    getContainerId: function () {
        return containerId;
    },
    getType: function () {
        return type;
    },
    getSort: function () {
        return sort;
    },
    getWidth: function () {
        return width;
    }
}