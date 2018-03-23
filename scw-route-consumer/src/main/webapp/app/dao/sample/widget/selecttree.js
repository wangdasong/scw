
function WidgetSelectTreeSample(){
}

WidgetSelectTreeSample.prototype = {
    currWidget:null,
    createObject : function (containerId, widgetId) {
        if(widgetId == null || widgetId == ""){
            widgetId = COMMON.createUUID();
        }
        this.currWidget = new Widget();
        this.currWidget.id = widgetId;
        this.currWidget.code = "SELECT_TREE";
        this.currWidget.name = "selectTree";
        this.currWidget.type = "selecttree";
        this.currWidget.sort = 999;
        this.currWidget.tmpFlg = "true";
        this.currWidget.containerId = containerId;
        //设置是否多选
        var attMultiSelect = new AttConfig();
        attMultiSelect.code = "INPUT_MULTISELECT";
        attMultiSelect.name = "是否多选";
        attMultiSelect.attValue = "false";
        attMultiSelect.type = "multiselect";
        attMultiSelect.belongId = widgetId;
        attMultiSelect.belongType = "2";
        this.currWidget.addAttribute(attMultiSelect);
        //设置数据源服务名称属性
        var attServiceName = new AttConfig();
        attServiceName.type = "serviceName";
        attServiceName.name = "数据源服务名称";
        attServiceName.code = "INPUT_SERVICE_NAME";
        attServiceName.attValue = "";
        attServiceName.belongId = widgetId;
        attServiceName.belongType = "2";
        this.currWidget.addAttribute(attServiceName);
        //设置根元素ID属性
        var attRoot = new AttConfig();
        attRoot.type = "parentId";
        attRoot.name = "根元素ID";
        attRoot.code = "INPUT_ROOT_ID";
        attRoot.attValue = "";
        attRoot.belongId = widgetId;
        attRoot.belongType = "2";
        this.currWidget.addAttribute(attRoot);
        //设置过滤条件
        var attQueryCondition = new AttConfig();
        attQueryCondition.type = "parentId";
        attQueryCondition.name = "根元素ID";
        attQueryCondition.code = "INPUT_ROOT_ID";
        attQueryCondition.attValue = "";
        attQueryCondition.belongId = widgetId;
        attQueryCondition.belongType = "2";
        this.currWidget.addAttribute(attQueryCondition);
        //设置标签属性
        var attLabel = new AttConfig();
        attLabel.type = "label";
        attLabel.name = "控件标签";
        attLabel.code = "INPUT_LABEL";
        attLabel.attValue = "样例树形下拉";
        attLabel.belongId = widgetId;
        attLabel.belongType = "2";
        this.currWidget.addAttribute(attLabel);
        //设置name属性
        var attName = new AttConfig();
        attName.type = "name";
        attName.name = "控件名称";
        attName.code="INPUT_NAME";
        attName.attValue="selecttreeSample";
        attName.belongId = widgetId;
        attName.belongType = "2";
        this.currWidget.addAttribute(attName);
        //设置width属性
        var attType = new AttConfig();
        attType.type = "type";
        attType.name = "控件类型";
        attType.code="INPUT_TYPE";
        attType.attValue="selecttree";
        attType.belongId = widgetId;
        attType.belongType = "2";
        this.currWidget.addAttribute(attType);
        //设置width属性
        var attWidth = new AttConfig();
        attWidth.type = "width";
        attWidth.name = "控件长度";
        attWidth.code="INPUT_WIDTH";
        attWidth.attValue="6";
        attWidth.belongId = widgetId;
        attWidth.belongType = "2";
        this.currWidget.addAttribute(attWidth);
        return this;
    },
    plain : function () {
        return this.currWidget;
    }
}