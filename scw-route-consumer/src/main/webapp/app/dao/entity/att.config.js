function AttConfig (){
};

AttConfig.prototype = {
    constructor: AttConfig,
    code: "",
    name: "",
    belongId: "",
    type: 0,
    attValue: 0,
    nullAble: true,
    attDefault: "",
    attComment: "",
    belongType: 1,
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
    getAttValue: function () {
        return attValue;
    },
    getNullAble: function () {
        return nullAble;
    },
    getAttDefault: function () {
        return attDefault;
    },
    getAttComment: function () {
        return attComment;
    },
    getBelongType: function () {
        return belongType;
    }

}