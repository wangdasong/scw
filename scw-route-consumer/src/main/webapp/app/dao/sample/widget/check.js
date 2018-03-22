
function WidgetCheckSample(){
    currWidget = new Widget();
}

WidgetCheckSample.prototype = {
    createObject : function (containerId, widgetId) {
        if(widgetId == null || widgetId == ""){
            widgetId = COMMON.createUUID();
        }
        this.currWidget = new Widget();
        this.currWidget.id = widgetId;
        this.currWidget.code = "CHECK_SAMPLE";
        this.currWidget.name = "sampleCheck";
        this.currWidget.type = "check";
        this.currWidget.sort = 999;
        this.currWidget.tmpFlg = "true";
        this.currWidget.containerId = containerId;
        //设置标签属性
        var attLabel = new AttConfig();
        attLabel.type = "label";
        attLabel.name = "控件标签";
        attLabel.code = "INPUT_LABEL";
        attLabel.attValue = "样例文本框";
        attLabel.belongId = widgetId;
        attLabel.belongType = "2";
        this.currWidget.addAttribute(attLabel);
        //设置name属性
        var attName = new AttConfig();
        attName.type = "name";
        attName.name = "控件名称";
        attName.code="INPUT_NAME";
        attName.attValue="sampleCheck";
        attName.belongId = widgetId;
        attName.belongType = "2";
        this.currWidget.addAttribute(attName);
        //设置width属性
        var attType = new AttConfig();
        attType.type = "type";
        attType.name = "控件类型";
        attType.code="INPUT_TYPE";
        attType.attValue="check";
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
        //设置服务名称属性
        var attServiceName = new AttConfig();
        attServiceName.type = "serviceName";
        attServiceName.name = "控件数据源服务名称";
        attServiceName.code="INPUT_SERVICE_NAME";
        attServiceName.attValue = "";
        attServiceName.belongId = widgetId;
        attServiceName.belongType = "2";
        this.currWidget.addAttribute(attServiceName);
        //设置查询条件属性
        var attQueryOption = new AttConfig();
        attQueryOption.type = "queryCondition";
        attQueryOption.name = "控件数据源条件";
        attQueryOption.code="INPUT_QUERY_CONDITION";
        attQueryOption.attValue = "";
        attQueryOption.belongId = widgetId;
        attQueryOption.belongType = "2";
        this.currWidget.addAttribute(attQueryOption);
        //设置级联属性
        var attCascade = new AttConfig();
        attCascade.type = "cascade";
        attCascade.name = "控件级联";
        attCascade.code="INPUT_CASCADE";
        attCascade.attValue = "";
        attCascade.belongId = widgetId;
        attCascade.belongType = "2";
        this.currWidget.addAttribute(attCascade);

        return this;
    },
    createSampleElement : function (widgetId) {
        //设置模板元素
        var elementSample = new Element();
        elementSample.id = COMMON.createUUID();
        elementSample.code = "ELEMENT_SAMPLE";
        elementSample.name= "元素样例";
        elementSample.widgetId = widgetId;
        //设置标签属性
        var attElementLabel = new AttConfig();
        attElementLabel.type = "label";
        attElementLabel.name = "元素标签";
        attElementLabel.code = "ELEMENT_LABEL";
        attElementLabel.attValue = "选项1";
        attElementLabel.belongId = elementSample.id;
        attElementLabel.belongType = "2";
        elementSample.addAttribute(attElementLabel);
        //设置标签属性
        var attElementValue = new AttConfig();
        attElementValue.type = "value";
        attElementValue.name = "元素值";
        attElementValue.code = "ELEMENT_VALUE";
        attElementValue.attValue = "1";
        attElementValue.belongId = elementSample.id;
        attElementValue.belongType = "2";
        elementSample.addAttribute(attElementValue);
        return elementSample;
    },
    plain : function () {
        return this.currWidget;
    }
}