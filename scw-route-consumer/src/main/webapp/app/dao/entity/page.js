function Page (){
};

Page.prototype = {
    constructor: Page,
    code: "",
    name: "",
    providerId: "",
    sort: 0,
    getCode: function () {
        return code;
    },
    getName: function () {
        return name;
    },
    getProviderId: function () {
        return containerId;
    }
}