
function WidgetButtonSample(){
}

WidgetButtonSample.prototype = {
    currWidget:null,
    createObject : function (containerId, widgetId) {
        if(widgetId == null || widgetId == ""){
            widgetId = COMMON.createUUID();
        }
        this.currWidget = new Widget();
        this.currWidget.id = widgetId;
        this.currWidget.code = "SAMPLE_BUTTON";
        this.currWidget.name = "sampleButton";
        this.currWidget.type = "button";
        this.currWidget.sort = 999;
        this.currWidget.tmpFlg = "true";
        this.currWidget.containerId = containerId;
        //设置输入
        var attInput = new AttConfig();
        attInput.code = "INPUT_BUTTON_INPUT";
        attInput.name = "按钮输入";
        attInput.attValue = "";
        attInput.type = "input";
        attInput.belongId = widgetId;
        attInput.belongType = "2";
        this.currWidget.addAttribute(attInput);
        //设置输出
        var attOutput= new AttConfig();
        attOutput.type = "output";
        attOutput.name = "按钮输出";
        attOutput.code = "INPUT_BUTTON_OUTPUT";
        attOutput.attValue = "reflushPage";
        attOutput.belongId = widgetId;
        attOutput.belongType = "2";
        this.currWidget.addAttribute(attOutput);
        //设置width属性
        var attWidth = new AttConfig();
        attWidth.type = "width";
        attWidth.name = "控件长度";
        attWidth.code="INPUT_BUTTON_WIDTH";
        attWidth.attValue="1";
        attWidth.belongId = widgetId;
        attWidth.belongType = "2";
        this.currWidget.addAttribute(attWidth);
        //设置name属性
        var attName = new AttConfig();
        attName.type = "name";
        attName.name = "控件名称";
        attName.code="INPUT_BUTTON_NAME";
        attName.attValue="sampleButton";
        attName.belongId = widgetId;
        attName.belongType = "2";
        this.currWidget.addAttribute(attName);
        //设置标签属性
        var attLabel = new AttConfig();
        attLabel.type = "label";
        attLabel.name = "控件标签";
        attLabel.code = "INPUT_BUTTON_LABEL";
        attLabel.attValue = "样例文本框";
        attLabel.belongId = widgetId;
        attLabel.belongType = "2";
        this.currWidget.addAttribute(attLabel);
        //设置width属性
        var attType = new AttConfig();
        attType.type = "type";
        attType.name = "控件类型";
        attType.code="INPUT_BUTTON_TYPE";
        attType.attValue="button";
        attType.belongId = widgetId;
        attType.belongType = "2";
        this.currWidget.addAttribute(attType);
        //设置按钮情景
        var attSit = new AttConfig();
        attSit.type = "situation";
        attSit.name = "按钮情景";
        attSit.code="INPUT_BUTTON_SIT";
        attSit.attValue="info";
        attSit.belongId = widgetId;
        attSit.belongType = "2";
        this.currWidget.addAttribute(attSit);
        //设置按钮事件
        var attAction = new AttConfig();
        attAction.type = "action";
        attAction.name = "按钮事件";
        attAction.code="INPUT_BUTTON_ACTION";
        attAction.attValue="";
        attAction.belongId = widgetId;
        attAction.belongType = "2";
        this.currWidget.addAttribute(attAction);
        //设置按钮大小
        var attSize = new AttConfig();
        attSize.type = "size";
        attSize.name = "按钮大小";
        attSize.code="INPUT_BUTTON_SIZE";
        attSize.attValue="small";
        attSize.belongId = widgetId;
        attSize.belongType = "2";
        this.currWidget.addAttribute(attSize);
        return this;
    },
    plain : function () {
        return this.currWidget;
    }
}