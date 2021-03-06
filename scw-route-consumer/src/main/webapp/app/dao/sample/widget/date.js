
function WidgetDateSample(){
}

WidgetDateSample.prototype = {
    currWidget:null,
    createObject : function (containerId, widgetId) {
        if(widgetId == null || widgetId == ""){
            widgetId = COMMON.createUUID();
        }
        this.currWidget = new Widget();
        this.currWidget.id = widgetId;
        this.currWidget.code = "SAMPLE_DATE_WIDGET";
        this.currWidget.name = "sampleDate";
        this.currWidget.type = "datepicker";
        this.currWidget.sort = 999;
        this.currWidget.tmpFlg = "true";
        this.currWidget.containerId = containerId;
        /*
        //设置消息
        var attMessage = new AttConfig();
        attMessage.code = "INPUT_MESSAGE";
        attMessage.name = "控件消息";
        attMessage.attValue = "请输入正确的XXXX！";
        attMessage.type = "message";
        attMessage.belongId = widgetId;
        attMessage.belongType = "2";
        this.currWidget.addAttribute(attMessage);
        //设置正则规则属性
        var attRegular = new AttConfig();
        attRegular.type = "regular";
        attRegular.name = "正则匹配";
        attRegular.code = "INPUT_REGULAR";
        attRegular.attValue = "";
        attRegular.belongId = widgetId;
        attRegular.belongType = "2";
        this.currWidget.addAttribute(attRegular);
        */

        //设置格式
        var attFormat = new AttConfig();
        attFormat.type = "format";
        attFormat.name = "显示格式";
        attFormat.code = "INPUT_FORMAT";
        attFormat.attValue = "yyyy-mm-dd hh:ii:ss";
        attFormat.belongId = widgetId;
        attFormat.belongType = "2";
        this.currWidget.addAttribute(attFormat);
        //设置标签属性
        var attLabel = new AttConfig();
        attLabel.type = "label";
        attLabel.name = "控件标签";
        attLabel.code = "INPUT_LABEL";
        attLabel.attValue = "样例日期输入框";
        attLabel.belongId = widgetId;
        attLabel.belongType = "2";
        this.currWidget.addAttribute(attLabel);
        //设置name属性
        var attName = new AttConfig();
        attName.type = "name";
        attName.name = "控件名称";
        attName.code="INPUT_NAME";
        attName.attValue="sampleDate";
        attName.belongId = widgetId;
        attName.belongType = "2";
        this.currWidget.addAttribute(attName);
        //设置width属性
        var attType = new AttConfig();
        attType.type = "type";
        attType.name = "控件类型";
        attType.code="INPUT_TYPE";
        attType.attValue="datetimepicker";
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