// 初始化VISUALEDIT
if (typeof VISUALEDIT == "undefined") {
    VISUALEDIT = {};
}
VISUALEDIT.SCREENAVAILHEIGHT =window.screen.availHeight-20;
VISUALEDIT.SCREENAVAILWIDTH =window.screen.availWidth-80;
VISUALEDIT.HALFSCREENAVAILHEIGHT =window.screen.availHeight/2-10;
VISUALEDIT.HALFSCREENAVAILWIDTH =window.screen.availWidth/2-40;
VISUALEDIT.QUARTERSCREENAVAILHEIGHT =window.screen.availHeight/4-5;
VISUALEDIT.QUARTERSCREENAVAILWIDTH =window.screen.availWidth/4-20;

VISUALEDIT.openMaxWindow= function(url) {   
	var strFeatures = "left=0,screenX=0,top=0,screenY=0";  
	if (window.screen){
		//获取屏幕的分辨率
		var maxh = screen.availHeight-30;
		var maxw = screen.availWidth-10;
		strFeatures += ",height="+maxh;
		strFeatures += "innerHeight"+maxh;
		strFeatures += ",width="+maxw;
		strFeatures += "innerwidth"+maxw;
	}else{
		strFeatures +=",resizable"; 
	}
 	window.open(url+"&winHeight="+(maxh-300),'newwindow',strFeatures);
} 
var layerShowFlg = false;
var canEditFlagLev = 0;
// 给模板上的模块添加可操作控件
// moduleId:要初始化的模块的channelId，调用init方法将这些要加载的模块生成在html页面上，鼠标划过时，加载到指定的元素周围
// editLayerJson:描述按钮的json串
VISUALEDIT.initModuleLayer = function (objModule, editLayerJson) {
    //debugger;
    var currentModule = $(objModule);
    var tmpId = parseInt(Math.random() * 10000);

    // 移除已有mouseover和mouseleave事件，重新加载
    currentModule.off("mouseover").off("mouseleave").mouseover(function () {
        // 标记鼠标划过
        $(this).attr("_mouseIn", 1);
        var currCanEditFlag = $(this).attr("canEditFlag");
        var currCanEditFlagLev;
        if(currCanEditFlag == "containerAddElement"){
        	currCanEditFlagLev = 1;
        }
        if(currCanEditFlag == "containerEditElement"){
        	currCanEditFlagLev = 2;
        }
        if(currCanEditFlag == "widgetEditElement"){
        	currCanEditFlagLev = 3;
        }
        if(currCanEditFlag == "elementEditElement"){
        	currCanEditFlagLev = 4;
        }
        if(currCanEditFlag == "elementContainerAddElement"){
	    	currCanEditFlagLev = 5;
	    }
        if(currCanEditFlag == "elementContainerEditElement"){
        	currCanEditFlagLev = 6;
        }
        if(currCanEditFlag == "widgetEditElementPanel"){
        	currCanEditFlagLev = 7;
        }
        if(!layerShowFlg || currCanEditFlagLev > canEditFlagLev){
            // 显示模块按钮
            VISUALEDIT.removeAllEditLayer();
            VISUALEDIT.addModuleLayer(currentModule, tmpId, editLayerJson);
        	layerShowFlg = true;
        }
    	canEditFlagLev = currCanEditFlagLev;
    })
	// 鼠标离开效果       
			.mouseleave(function () {

			    // 标记鼠标离开
			    $(this).attr("_mouseIn", 0);

			    // 不显示鼠标划过时显示的边框
			    VISUALEDIT.removeMoveFrame(tmpId);

			    // 不显示模块按钮
			    VISUALEDIT.removeModuleLayer(tmpId);

		    	layerShowFlg = false;
			});
};



VISUALEDIT.delElement = function (id, elementName) {
    // 移除所有可视化编辑按钮
    VISUALEDIT.removeAllEditLayer();

    if (window.confirm("确定删除" + elementName + "?")) {
        COMMON.ing("正在删除……", false);
        var tempSrcUrl = "/rest/api/element/del";
        $.ajax({
            type: "post",
            url: tempSrcUrl,
            data: "id=" + id,
            error: function () {
                COMMON.ing("系统繁忙，请稍候重试", false)
            },
            success: function (e) {
                COMMON.removeAllIng();
            }
        })
    }
};

VISUALEDIT.delWidget = function (id, widgetName) {
    // 移除所有可视化编辑按钮
    VISUALEDIT.removeAllEditLayer();

    if (window.confirm("确定删除" + widgetName + "?")) {
        COMMON.ing("正在删除……", false);
        var tempSrcUrl = "/rest/api/widget/del";
        $.ajax({
            type: "post",
            url: tempSrcUrl,
            data: "id=" + id,
            error: function () {
                COMMON.ing("系统繁忙，请稍候重试", false)
            },
            success: function (e) {
                alert("删除成功");
                COMMON.removeAllIng();
            }
        })
    }
};
VISUALEDIT.delContainer = function (id, containerName) {
    // 移除所有可视化编辑按钮
    VISUALEDIT.removeAllEditLayer();

    if (window.confirm("确定删除" + containerName + "?")) {
        COMMON.ing("正在删除……", false);
        var tempSrcUrl = "/rest/api/container/del";
        $.ajax({
            type: "post",
            url: tempSrcUrl,
            data: "id=" + id,
            error: function () {
                COMMON.ing("系统繁忙，请稍候重试", false)
            },
            success: function (e) {
                alert("删除成功");
                COMMON.removeAllIng();
                $("div[containerId='" + id + "']").parent().parent().remove();
            }
        })
    }
};

VISUALEDIT.initElementEditElement = function (obj) {

    var elementId = $(obj).attr("elementId");
    var widgetId = $(obj).attr("widgetId");
    var conacEditAuth = "true";
    var editUrlSurfix;
    var addUrlSurfix;
    if (elementId) {
        editUrlSurfix = "app/controller/edit/editElement.tpl.html?ram=" + Math.random();
        addUrlSurfix = "app/controller/edit/editElement.tpl.html?ram=" + Math.random();

        var editframeSrcUrl = editUrlSurfix;
        var addframeSrcUrl = addUrlSurfix;

    	var editConfig = {
                "text": "编辑",
                "title": "编辑",
                "evalScript": "VISUALEDIT.popupWindow({title:'编辑', frameSrcUrl:'"
                        + editframeSrcUrl
                        + "&id="
                        + elementId
                        + "&serviceName=elementServiceImpl"
                        + "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+", saveBeforePopup:false});"
            };
    	var addConfig = {
                "text": "添加子项",
                "title": "添加子项",
                "evalScript": "VISUALEDIT.popupWindow({title:'添加子项', frameSrcUrl:'"
                        + addframeSrcUrl
                        + "&EDIT_ELEMENT_FORM_INPUT_PARENT="
                        + elementId
                        + "&EDIT_ELEMENT_FORM_INPUT_WIDGET_ID="
                        + widgetId
                        + "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+"});"
            };
    	var delConfig = {
            "text": "删除",
            "title": "删除",
            "className":"delbgc",
		    evalScript: "VISUALEDIT.delElement('" + elementId
					+ "', '"
					+ ""//COMMON.encodeHtmlJs(contentTitle)
					+ "', document.location.href, 0);"
		};
    	if(widgetId){
            VISUALEDIT.initModuleLayer(obj,[editConfig,addConfig,delConfig]);
    	}else{
            VISUALEDIT.initModuleLayer(obj,[editConfig,delConfig]);
    	}
    }
}

VISUALEDIT.initWidgetEditElement = function (obj) {

    var widgetId = $(obj).attr("widgetId");
    var addElement = $(obj).attr("addElement");
    var conacEditAuth = "true";
    var editUrlSurfix;
    var addUrlSurfix;
    if (widgetId) {
        editUrlSurfix = "app/controller/edit/editWidget.tpl.html?ram=" + Math.random();
        addUrlSurfix = "app/controller/edit/editElement.tpl.html?ram=" + Math.random();

        var editframeSrcUrl = editUrlSurfix;
        var addframeSrcUrl = addUrlSurfix;

        if (conacEditAuth && conacEditAuth.toUpperCase() == "TRUE") {
        	var editConfig = {
                    "text": "编辑",
                    "title": "编辑",
                    "evalScript": "VISUALEDIT.popupWindow({title:'编辑', frameSrcUrl:'"
                            + editframeSrcUrl
                            + "&id="
                            + widgetId
                            + "&serviceName=widgetServiceImpl"
                            + "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+", saveBeforePopup:false});"
                };
        	var addConfig = {
                    "text": "添加元素",
                    "title": "添加元素",
                    "evalScript": "VISUALEDIT.popupWindow({title:'添加元素', frameSrcUrl:'"
                            + addframeSrcUrl
                            + "&EDIT_ELEMENT_FORM_INPUT_PARENT="
                            + widgetId
                            + "&EDIT_ELEMENT_FORM_INPUT_WIDGET_ID="
                            + widgetId
                            + "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+"});"
                };

        	var delConfig = {
                "text": "删除",
                "title": "删除",
                "className":"delbgc",
			    evalScript: "VISUALEDIT.delWidget('" + widgetId
						+ "', '"
						+ ""//COMMON.encodeHtmlJs(contentTitle)
						+ "', document.location.href, 0);"
			};
        	if(addElement){
                VISUALEDIT.initModuleLayer(obj,[editConfig,addConfig,delConfig]);
        	}else{
                VISUALEDIT.initModuleLayer(obj,[editConfig,delConfig]);
        	}
        }
        else {
            VISUALEDIT
				.initModuleLayer(
						obj,
						[
								{
								    "text": "没有栏目编辑权限",
								    "title": "没有栏目编辑权限",
								    "evalScript": ""
								}]);
        }
    }
    // endregion:如果该module有channelId，则添加编辑框及编辑按钮
}


VISUALEDIT.initContainerEditElement = function (obj) {
    var containerId = $(obj).attr("containerId");
    var editUrlSurfix;
    var addUrlSurfix;
    if (containerId) {
        editUrlSurfix = "app/controller/edit/editContainer.tpl.html?ram=" + Math.random();
        addUrlSurfix = "app/controller/edit/editWidget.tpl.html?ram=" + Math.random();

        var editframeSrcUrl = editUrlSurfix;
        var addframeSrcUrl = addUrlSurfix;

    	var editConfig = {
                "text": "编辑",
                "title": "编辑",
                "evalScript": "VISUALEDIT.popupWindow({title:'编辑', frameSrcUrl:'"
                        + editframeSrcUrl
                        + "&id="
                        + containerId
                        + "&serviceName=containerServiceImpl"
                        + "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT/2+", saveBeforePopup:false});"
            };
    	var addConfig = {
                "text": "添加控件",
                "title": "添加控件",
                "evalScript": "VISUALEDIT.popupWindow({title:'添加控件', frameSrcUrl:'"
                        + addframeSrcUrl
                        + "&EDIT_WIDGET_FORM_INPUT_CONATAINER_ID="
                        + containerId
                        + "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+"});"
            };
        var delConfig = {
                "text": "删除",
                "title": "删除",
                "className":"delbgc",
			    evalScript: "VISUALEDIT.delContainer('" + containerId
						+ "', '"
						+ ""//COMMON.encodeHtmlJs(contentTitle)
						+ "', document.location.href, 0);"
			};
    	VISUALEDIT.initModuleLayer(obj,[editConfig,addConfig,delConfig]);
    }
}

VISUALEDIT.initContainerAddElement = function (obj) {
    var parentContainerId = $(obj).attr("parentContainerId");
    var pageId = $(obj).attr("pageId");
    var addUrlSurfix;
    if (parentContainerId && pageId) {
    	var addframeSrcUrl = "app/controller/edit/editContainer.tpl.html?ram=" + Math.random();
    	var addPageframeSrcUrl = "app/controller/edit/editPage.tpl.html?ram=" + Math.random();
    	var addConfig = {
                "text": "添加容器",
                "title": "添加容器",
                "evalScript": "VISUALEDIT.popupWindow({title:'添加容器', frameSrcUrl:'"
                        + addframeSrcUrl
                        + "&EDIT_CONTAINER_FORM_INPUT_CONTAINER_ID="
                        + parentContainerId
                        + "&EDIT_CONTAINER_FORM_INPUT_PAGE_ID="
                        + pageId
                        + "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT/2+"});"
            };
    	var editPage = {
                "text": "编辑页面",
                "title": "编辑页面",
                "evalScript": "VISUALEDIT.popupWindow({title:'编辑页面', frameSrcUrl:'"
                        + addPageframeSrcUrl
                        + "&id="
                        + pageId
                        + "&serviceName=pageServiceImpl"
                        + "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT/2+"});"
            };
    	VISUALEDIT.initModuleLayer(obj,[editPage, addConfig]);
    }
}





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
VISUALEDIT.initSingltonChannel = function (obj) {

    var channelId = $(obj).attr("channelId");
    var conacEditAuth = $(obj).attr("conacEditAuth");
    var editUrlSurfix;
    var addUrlSurfix;
    if (channelId) {
        editUrlSurfix = "/channel/v_edit.do?ram=" + Math.random();

        var editframeSrcUrl = base + appBase + editUrlSurfix;

        if (conacEditAuth && conacEditAuth.toUpperCase() == "TRUE") {
            
        VISUALEDIT
	                    .initModuleLayer(
	                            obj,
	                            [
	                                    {
	                                        "text": "编辑栏目",
	                                        "title": "编辑栏目",
	                                        "evalScript": "VISUALEDIT.popupWindow({title:'编辑栏目', frameSrcUrl:'"
	                                                + editframeSrcUrl
	                                                + "&id="
	                                                + channelId
	                                                + "', width:'1024', height:'768', saveBeforePopup:false});"
	                                    }]);
        	
        	
        }
    }
    // endregion:如果该module有channelId，则添加编辑框及编辑按钮
}

VISUALEDIT.initBottomChannel = function (obj) {

    var channelId = $(obj).attr("channelId");
    var conacEditAuth = "true";
    var isFullScreen = "true";
    var editUrlSurfix;
    var addUrlSurfix;
    if (channelId) {
        editUrlSurfix = "/channel/v_edit.do?ram=" + Math.random();
        addUrlSurfix = "/content/v_add.do?ram=" + Math.random();

        var editframeSrcUrl = editUrlSurfix;
        var addframeSrcUrl = addUrlSurfix;

        if (conacEditAuth && conacEditAuth.toUpperCase() == "TRUE") {
            
        	
        	
        	if(isFullScreen && isFullScreen.toUpperCase() == "TRUE")
        	{
	        	VISUALEDIT
	                    .initModuleLayer(
	                            obj,
	                            [
	                                    {
	                                        "text": "编辑",
	                                        "title": "编辑",
	                                        "evalScript": "VISUALEDIT.popupWindow({title:'编辑', frameSrcUrl:'"
	                                                + editframeSrcUrl
	                                                + "&id="
	                                                + channelId
	                                                + "', width:'1024', height:'768', saveBeforePopup:false});"
	                                    },
	                                    {
	                                        "text": "添加内容",
	                                        "evalScript":"VISUALEDIT.openMaxWindow('"+addframeSrcUrl+"&cid="+channelId+"&isFullScreen=true');"
	/*                                        "evalScript": "VISUALEDIT.popupWindow({title:'添加内容', frameSrcUrl:'"
	                                                + addframeSrcUrl
	                                                + "&cid="
	                                                + channelId
	                                                + "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+"});"*/
	                                    }]);
        	}
        	else
        	{	        	
        		VISUALEDIT
	                    .initModuleLayer(
	                            obj,
	                            [
	                                    {
	                                        "text": "编辑栏目",
	                                        "title": "编辑栏目",
	                                        "evalScript": "VISUALEDIT.popupWindow({title:'编辑栏目', frameSrcUrl:'"
	                                                + editframeSrcUrl
	                                                + "&id="
	                                                + channelId
	                                                + "', width:'1024', height:'768', saveBeforePopup:false});"
	                                    },
	                                    {
	                                        "text": "添加内容",
	                                        "evalScript": "VISUALEDIT.popupWindow({title:'添加内容', frameSrcUrl:'"
	                                                + addframeSrcUrl
	                                                + "&cid="
	                                                + channelId
	                                                + "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+"});"
	                                    }]);
        		}
        }
        else {
            VISUALEDIT
        .initModuleLayer(
                obj,
                [
                        {
                            "text": "添加内容",
                             "evalScript":"VISUALEDIT.openMaxWindow('"+addframeSrcUrl+"&cid="+channelId+"&isFullScreen=true');"
                        }]);
        }
    }
    // endregion:如果该module有channelId，则添加编辑框及编辑按钮
}

// region 为Topic/GuestBook/VoteTopic/Comment/FriendLink等"栏目" 添加"栏目"编辑按钮
VISUALEDIT.initOtherModule = function (obj) {

    // modelName 指明"栏目"分类
    var modelName = $(obj).attr("modelName");
    var editUrlSurfix;
    var addUrlSurfix;
    if (modelName && modelName.toUpperCase() == "GUESTBOOK") {// 留言
        editUrlSurfix = "/guestbook_ctg/v_add.do?ram=" + Math.random();
        addUrlSurfix = "/guestbook/v_add.do?ram=" + Math.random();

        var addGuestBookCtgframeSrcUrl = base + appBase + editUrlSurfix;
        var addframeSrcUrl = base + appBase + addUrlSurfix;
        //http://localhost:8080/conaccmsnew/conacadmin/conaccms/guestbook_ctg/o_save.do
        VISUALEDIT
				.initModuleLayer(
						obj,
						[
/*								{
								    "text": "添加留言类别",
								    "evalScript": "VISUALEDIT.popupWindow({title:'添加留言类别', frameSrcUrl:'"
											+ addGuestBookCtgframeSrcUrl
											+ "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+"});"
								},*/
								{
								    "text": "添加留言",
								    "evalScript": "VISUALEDIT.popupWindow({title:'添加留言', frameSrcUrl:'"
											+ addframeSrcUrl
											+ "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+"});"
								}]);
    } else if (modelName && modelName.toUpperCase() == "FRIENDLINK") {// 友情链接
        editUrlSurfix = "/friendlink_ctg/v_list.do?ram=" + Math.random();
        addUrlSurfix = "/friendlink/v_add.do?ram=" + Math.random();

        var addFriendLinkCtgframeSrcUrl = base + appBase + editUrlSurfix;
        var addframeSrcUrl = base + appBase + addUrlSurfix;

        VISUALEDIT
				.initModuleLayer(
						obj,
						[
								{
								    "text": "添加友情链接",
								    "evalScript": "VISUALEDIT.popupWindow({title:'添加友情链接', frameSrcUrl:'"
											+ addframeSrcUrl
											+ "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+" });"
								}]);
    } else if (modelName && modelName.toUpperCase() == "VOTETOPIC") {// 投票
        editUrlSurfix = "/vote_topic/v_edit.do?ram=" + Math.random();
        addUrlSurfix = "/vote_topic/v_add.do?ram=" + Math.random();

        var editframeSrcUrl = base + appBase + editUrlSurfix;
        var addframeSrcUrl = base + appBase + addUrlSurfix;

        VISUALEDIT.initModuleLayer(obj, [{
            "text": "添加投票",
            "evalScript": "VISUALEDIT.popupWindow({title:'添加投票', frameSrcUrl:'"
					+ addframeSrcUrl + "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+"});"
        }]);
    } 
    /*else if (modelName && modelName.toUpperCase() == "COMMENT") { 评论        editUrlSurfix = "/comment/v_edit.do?ram=" + Math.random();
        addUrlSurfix = "/comment/v_add.do?ram=" + Math.random();

        var editframeSrcUrl = base + appBase + editUrlSurfix;
        var addframeSrcUrl = base + appBase + addUrlSurfix;

        VISUALEDIT.initModuleLayer(obj, [{
            "text": "添加评论",
            "evalScript": "VISUALEDIT.popupWindow({title:'添加评论', frameSrcUrl:'"
					+ addframeSrcUrl + "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+"});"
        }]);
    } */
    else if (modelName && modelName.toUpperCase() == "TOPIC") {// 主题
        editUrlSurfix = "/topic/v_edit.do?ram=" + Math.random();
        addUrlSurfix = "/topic/v_add.do?ram=" + Math.random();
        //http://localhost:8080/conaccmsnew/guestbook/v_add.do

        var editframeSrcUrl = base + appBase + editUrlSurfix;
        var addframeSrcUrl = base + appBase + addUrlSurfix;

        VISUALEDIT.initModuleLayer(obj, [{
            "text": "添加专题",
            "evalScript": "VISUALEDIT.popupWindow({title:'添加专题', frameSrcUrl:'"
					+ addframeSrcUrl + "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+"});"
        }]);
    }
    // endregion:如果该module有channelId，则添加编辑框及编辑按钮
}
// endregion

//VISUALEDIT.initModuleChildren = function (obj) {

//    var subChannelElement = $(obj).find(".conacModuleChannelElement");
//    var subNonChannelElement = $(obj).find(".conacModuleMixedChannelElement");
//    var subContentElement = $(obj).find(".conacModuleContentElement");

//    if (subChannelElement.length > 0 || subNonChannelElement.length > 0) {
//        $.each(subChannelElement, function (index, element) {
//            VISUALEDIT.initModule(element);
//            //alert($(element).attr("channelId"));
//            VISUALEDIT.initModuleChildren(element);
//        });

//        $.each(subNonChannelElement, function (index, element) {
//            VISUALEDIT.initModuleChildren(element);
//        });
//    }
//    else if (subContentElement.length > 0) {
//        VISUALEDIT.initContentsWithInElementObject(obj);
//    }
//    else {

//    }
//}

VISUALEDIT.initContentsWithInElementObject = function () {
    var objContent = $("[conacEditFlag='conacModuleContentElement']");
    $.each(objContent, function (index, element) {
        VISUALEDIT.initSingleContentLineItemManage(element);
    });

    var objTopic = $("[conacEditFlag='conacModuleTopicElement']");
    $.each(objTopic, function (index, e) {
        VISUALEDIT.initSingleTopicItemManage(e);
    });

    var objGuestBook = $("[conacEditFlag='conacModuleGuestBookElement']");
    $.each(objGuestBook, function (index, e) {
        VISUALEDIT.initSingleGuestBookItemManage(e);
    });

    var objComment = $("[conacEditFlag='conacModuleCommentElement']");
    $.each(objComment, function (index, e) {
        VISUALEDIT.initSingleCommentItemManage(e);
    });

    var objVoteTopic = $("[conacEditFlag='conacModuleVoteTopicElement']");
    $.each(objVoteTopic, function (index, e) {
        VISUALEDIT.initSingleVoteTopicItemManage(e);
    });

    var objFriendLink = $("[conacEditFlag='conacModuleFriendLinkElement']");
    $.each(objFriendLink, function (index, e) {
        VISUALEDIT.initSingleFriendLinkItemManage(e);
    });
}
// 显示模块按钮
VISUALEDIT.addModuleLayer = function (objModule, tmpId, editLayerJson) {
    if (!COMMON.isNull(VISUALEDIT._enableEditLayer) && !VISUALEDIT._enableEditLayer) {
        VISUALEDIT.replaceDocumentwrite($(objModule));
        return;
    }

    // 显示鼠标划过时的模块边框
    VISUALEDIT.addMoveFrameByObj(objModule, tmpId);

    var obj = $(objModule);

    // 添加上方按钮
    var layerId = tmpId + "moduleLayer";
    if ($("#" + layerId).length < 1) {

        var html = new Array();
        var multiLayerClass = "";
        html.push("<div id='" + layerId + "' class='moduleLayer "
				+ multiLayerClass + "'>");
        var tipsText = "";
        var tipsTarget = "";
        var tipsFlag = "";

        $.each(editLayerJson, function (i, n) {
            var statusScript = n.statusScript;
            var status = 0;
            if (statusScript) {
                status = eval(statusScript);
            }
            if (status == -1) {
                return true;
            }
            var text = n.text;
            var title = n.title;
            var menu = n.menu;
            var className = "item";
            var addClass = n.className;
            if (n.className) {
                className += " " + n.className;
            }else{
            	addClass = "";
            }

            var extScript = "VISUALEDIT.removeAllEditLayer();return false;";
            var id = n.id;
            if (id == null) {
                id = layerId + "item" + i;
            }
            var tipScript = "";
            var onclick;
            if (menu) {
                if (n.log > 0) {
                    onclick = "VISUALEDIT.logClick(" + n.log + ");";
                } else {
                    onclick = "";
                }
                onclick += "VISUALEDIT.showModuleLayerMenu('" + layerId + "', '"
						+ id + "');" + tipScript + ";return false;";
            } else {
                onclick = n.evalScript + ";" + tipScript + extScript;
            }
            html.push("<div class='" + className + "'>");
            html.push("<a hidefocus='true' id='" + id + "' class='tool " + n.className+ "' ");
            if (title) {
                html.push("title='" + title + "' ");
            }
            //html.push("href='javascript:;' onclick=\"" + onclick + '">' + text
            html.push("href='javascript:;' onclick=\"" + onclick + '">'
                    + text + "</a>");
            html.push("</div>");
            if (i < editLayerJson.length - 1) {
                html.push('<div class="itemHr"></div>');
            }
        });

        if (html) {
            html.push("</div>");
            var div = $(html.join(""));
            div.appendTo("body");
            div.css("margin", 0);
            var objWidth = obj.outerWidth() - 2;
            if (obj.offset().left + obj.width() >= COMMON.top.document.documentElement.clientWidth - 20) {
                div.css("left", COMMON.top.document.documentElement.clientWidth
						- 20 - div.width());
            } else {
                if (obj.offset().left + objWidth - div.width() <= 0) {
                    div.css("left", 0);
                } else {
                    if (obj.attr("_inmulmcol") > 0 || obj.attr("_intab") > 0) {
                        div.css("left", obj.offset().left);
                    } else {
                        div.css("left", obj.offset().left + objWidth
								- div.outerWidth());
                    }
                }
            }
            var divTop = (obj.offset().top - div.height() - 1);
            //if (divTop < $("#web").offset().top) {
            //    //按钮显示在模块底部
            //    div.addClass("moduleLayerBottom");
            //    divTop = obj.offset().top + obj.height();
            //}
            div.css("top", divTop + "px");

            div.mouseover(function () {
                $(this).attr("_mouseIn", 1);
                $(this).attr("_realmousein", 1);
            });
            div.mouseleave(function () {
                $(this).attr("_mouseIn", 0);
                $(this).attr("_realmousein", 0);
                VISUALEDIT.removeAllEditLayer();
            });

            // 鼠标中键事件
            VISUALEDIT.bindMousewheel();

            // 显示编辑按钮的二级目录
            $.each(editLayerJson, function (i, n) {
                var menu = n.menu;
                var id = n.id;
                if (id == null) {
                    id = layerId + "item" + i;
                }
                if (typeof menu !== "undefined" && menu.length > 0) {
                    $("#" + id).on(
							"mouseenter",
							function () {
							    var firstClick = $("#" + layerId).data(
										"firstClick");
							    if (firstClick) {
							        var menu = $("#" + id + "menu");
							        if (menu.length > 0
											&& menu.css("display") != "none") {
							            return;

							        }
							        VISUALEDIT.showModuleLayerMenu(layerId, id);
							    }
							})
                }
            });
            return div;
        }
    } else {
        var div = $("#" + layerId);
        div.attr("_mouseIn", 1);
        return div;
    }
};

// 移除模块按钮
VISUALEDIT.removeModuleLayer = function (moduleId) {
    var moduleLayer = $("#" + moduleId + "moduleLayer");
    moduleLayer.attr("_mouseIn", 0);
    setTimeout("VISUALEDIT.removeModuleLayer_Internal('" + moduleId + "')", 100);
};

VISUALEDIT.removeModuleLayer_Internal = function (moduleId) {

    var moduleLayerId = moduleId + "moduleLayer";
    var moduleLayer = $("#" + moduleLayerId);
    if (moduleLayer.length == 1) {
        if (moduleLayer.attr("_mouseIn") != 1) {
            moduleLayer.remove();
            $("#" + moduleLayerId + "tips").remove();
            var module = $("#" + moduleId);
            var moduleSide = module.attr("_side");
        }
    }
};

VISUALEDIT.removeOverlay = function () {
    $("#findModuleDiv").remove();
};

VISUALEDIT.replaceDocumentwrite = function (module) {
    var moduleScript = module.find("script");
    moduleScript.each(function () {
        var element = $(this).html().replace("document.write", "void");
        $(this).html(element);
    })
};

VISUALEDIT.bindMousewheel = function () {
    if (typeof g_bindMousewheel == "undefined") {
        g_bindMousewheel = 1;
        $("body").bind("mousewheel", function () {
            VISUALEDIT.removeAllEditLayer();
            $(".msgBoardEditLayer").remove();
            if (COMMON.isIE()) {
                $(".gMallPanel").remove();
            }
        })
    }
};

VISUALEDIT.showModuleLayerMenu = function (a, i, c) {
    var h = $("#" + i + "menu");
    if (h.length > 0 && h.css("display") != "none") {
        h.hide();
        return;
    }
    COMMON.top.$(".moduleLayer .menu").hide();
    COMMON.top.$(".moduleLayer .item").removeClass("itemOn");
    var b = COMMON.top.$(document).height();
    var f = $("#" + a).height();
    h.show();
    if (h.offset().top + h.height() > b) {
        h.css("top", (h.position().top - h.height() - f - 4) + "px");
        h.addClass("menuBottom");
    }
    COMMON.top.$("#" + i).parent().addClass("itemOn");
    $("#" + a).data("firstClick", true);
};

VISUALEDIT.popupWindow = function (windowJson) {
    var b = true;
    if (!COMMON.isNull(windowJson.saveBeforePopup)) {
        b = windowJson.saveBeforePopup;
    }
    if (b && VISUALEDIT.checkSaveBar()) {
        return;

    }
    if ($.isFunction(VISUALEDIT.removeAllEditLayer)) {
        VISUALEDIT.removeAllEditLayer();
    }
    COMMON.popupWindow(windowJson);
};

VISUALEDIT.checkSaveBar = function () {
    if (COMMON.top._changeStyleNum > 0) {
        VISUALEDIT.popupStyleChangeBodyWindow("您的网站设计已经更改，是否立即保存？");
        return true;
    }
    return false;
};

VISUALEDIT.popupStyleChangeBodyWindow = function (d, k, f, g, a, h) {
    var b = false;
    var i = "确定";
    var j = "取消";
    if (typeof f != "undefined" && f == 1) {
        b = true;
    }
    if (typeof a != "undefined") {
        i = "" + a;
    }
    if (typeof h != "undefined") {
        j = "" + h;
    }
    var e = "<div style='line-height:20px;color:black;padding:7px 0 5px 0;'><p style='padding:0 6px 0 5px;text-align:center;'>"
			+ d
			+ "</p><div style='padding:2px 0 0 66px;'><p style='padding:5px 0 5px 0;'><input type='radio' name='save' id='popupWindowSaveChangeBtn' checked='checked' style='vertical-align:-2px;_vertical-align:-1px;' /><label for='popupWindowSaveChangeBtn' style='cursor:pointer;'>立即保存</label></p><p><input type='radio' name='save' id='popupWindowCancelChangeBtn' style='vertical-align:-2px;_vertical-align:-1px;' /><label for='popupWindowCancelChangeBtn' style='cursor:pointer;'>不保存</label></p></div></div>";
    if (b) {
        e = "<div style='line-height:20px;color:black;padding:28px 0 5px 72px;'><p>"
				+ d + "</p></div>";
    }
    var c = COMMON.top.COMMON.popupBodyWindow({
        title: "操作提示",
        content: "" + e,
        width: 350,
        height: 85
    });
    COMMON.top.COMMON.addPopupBodyWindowBtn(c,
			{
			    id: "save",
			    text: i,
			    extClass: "saveButton",
			    click: function () {
			        if (b) {
			            $(window).unbind("beforeunload");
			            VISUALEDIT.closeStyleDesign();
			        } else {
			            if (top.$(top.document).find(
								"#popupWindowSaveChangeBtn").length > 0
								&& top.$(top.document).find(
										"#popupWindowSaveChangeBtn").prop(
										"checked")) {
			                COMMON.top.VISUALEDIT.saveStyle(k);
			            } else {
			                if (typeof k != "undefined"
									&& typeof k.fun === "function"
									&& typeof g != "undefined" && g) {
			                    $(window).unbind("beforeunload");
			                    setTimeout(function () {
			                        k.fun.apply(window, k.args);
			                    }, 10)
			                } else {
			                    COMMON.top._changeStyleNum = 0;
			                    COMMON.top.location.reload();
			                }
			            }
			            COMMON.top.COMMON.closePopupBodyWindow(c);
			        }
			    }
			});
    COMMON.top.COMMON.addPopupBodyWindowBtn(c, {
        id: "cancel",
        text: j,
        click: "close"
    })
};

VISUALEDIT.afterAddNews = function (a) {
    if (typeof (a) != "undefined") {
        document.location.reload();
    }
};

// 保存请求发送
VISUALEDIT.saveStyle = function (O) {
    // 判断是否有改变
    if (COMMON.top._changeStyleNum == 0) {
        return;
    }

    // 弹出提示框体
    COMMON.ing("正在保存……", false);
    $("#saveButton").attr("disabled", true).addClass("buttonDisabled");
    // 判断是否发生站点克隆的操作
    if (COMMON.top.changeCloneSiteIndustryId
			&& COMMON.top.changeCloneSiteIndustryId != '') {
        var p = new Array();
        p.push("changeCloneSiteIndustryId="
				+ COMMON.top.changeCloneSiteIndustryId);
        p.push("changeCloneSiteIndustryName="
				+ COMMON.top.changeCloneSiteIndustryName);
        // 进行站点克隆请求
        $.ajax({
            type: "post",
            url: base + appBase + "/visual/o_site_clone.do?" + p.join("&"),
            data: p.join("&"),
            async: false,
            contentType: "application/json",
            dataType: 'json',
            timeout: 30000,
            error: function (data) {
                $("#saveButton").removeAttr("disabled").removeClass(
						"buttonDisabled");
                COMMON.ing("系统繁忙，请稍候重试", false);
                return;
            },
            success: function (data) {
                if (data.success == true) {
                    $("#saveButton").attr("disabled", true).addClass(
							"buttonDisabled");
                    COMMON.top._changeStyleNum--;
                    alert("保存成功");
                    // 保存成功，刷新页面
                    COMMON.top.location.reload();
                } else {
                    $("#saveButton").removeAttr("disabled").removeClass(
							"buttonDisabled");
                    COMMON.ing(data.msg, false);
                    return;
                }
            }
        });
    }

    // 判断是否发生栏目版式变更的操作
    if (COMMON.top.changeChanneltplPath && COMMON.top.changeChanneltplPath != '') {
        var p = new Array();
        p.push("tplPath=" + COMMON.top.changeChanneltplPath);
        p.push("tplName=" + COMMON.top.changeChanneltplName);
        p.push("curveChannelId=" + COMMON.top.curveChannelId);
        // 进行站点克隆请求
        $.ajax({
            type: "post",
            url: base + appBase + "/visual/o_channeltpl_change.do?ram="
					+ Math.random(),
            data: p.join("&"),
            async: false,
            error: function () {
                $("#saveButton").removeAttr("disabled").removeClass(
						"buttonDisabled");
                COMMON.ing("系统繁忙，请稍候重试", false);
            },
            success: function (data) {
                if (data.success == true) {
                    $("#saveButton").attr("disabled", true).addClass(
							"buttonDisabled");
                    COMMON.top._changeStyleNum--;
                    alert("保存成功");
                    // 保存成功，刷新页面
                    COMMON.top.location.reload();
                } else {
                    $("#saveButton").removeAttr("disabled").removeClass(
							"buttonDisabled");
                    COMMON.ing(data.msg, false);
                    return;
                }
            }
        });
    }
};

//todo
/**
 * 网站设计-站点设置
 *
 * settingType：设置类别，open：加载jsp；refresh：重置jsp；其他：不用调用jsp；close：关闭jsp
 * manageAction：调用manage的处理，webTemplateTab：站点主题，webBannerTab：站点banner，webSettingTab：站点设置；pageLayoutTab：页面布局；pageSettingTab：页面设置
 */
VISUALEDIT.styleSetting = function (settingType, manageAction, d, e, f) {
    VISUALEDIT.removeAllEditLayer();
    if (settingType == "open") {
        if (COMMON.top.$("#styleDesign").css("display") == "none") {
            COMMON.top.$("#styleDesign").css("display", "block");
            VISUALEDIT.showTopBar();
            VISUALEDIT.styleDefaultClick();
        }
        if (manageAction == "webTemplateTab") {
            VISUALEDIT.webTemplateTabClick(e);
            if (COMMON.top._signupDays < 1
					&& $.cookie("usedRapidSiteNum") != null) {
                var c = parseInt($.cookie("usedRapidSiteNum"));
                $.cookie("usedRapidSiteNum", c + 1, {
                    expires: 7
                })
            }
        } else {
            if (manageAction == "webSettingTab") {
                VISUALEDIT.webSettingTabClick(e);
            } else {
                if (manageAction == "pageLayoutTab") {
                    VISUALEDIT.pageLayoutTabClick(e, f);
                }
            }
        }
        VISUALEDIT.resetGmainPos();
    } else if (settingType == "refresh") {
        if (COMMON.top.$("#styleDesign").css("display") == "none") {
            COMMON.top.$("#styleDesign").css("display", "block");
            VISUALEDIT.showTopBar();
            VISUALEDIT.styleDefaultClick();
        }
        if (manageAction == "webTemplateTab") {
            VISUALEDIT.refreshStyleTemplatePanel(d);
        } else {
            if (manageAction == "webSettingTab") {
                VISUALEDIT.refreshStyleWebPanel(d);
            } else {
                if (manageAction == "webBannerTab") {
                    VISUALEDIT.refreshStyleBannerPanel(d);
                } else {
                    if (manageAction == "pageSettingTab") {
                        VISUALEDIT.refreshStylePagePanel(d);
                    } else {
                        if (manageAction == "pageLayoutTab") {
                            VISUALEDIT.refreshStyleLayoutPanel(d);
                        }
                    }
                }
            }
        }
        VISUALEDIT.resetGmainPos();
    } else if (settingType == "close") {
        if (_changeStyleNum == 0) {
            COMMON.top.$("#styleDesign").css("display", "none");
            VISUALEDIT.showTopBar();
        } else {
            COMMON.top.location.reload();
        }
        VISUALEDIT.refreshCOMMONFloatPanelIconStyle();
    } else {
    }
};

VISUALEDIT.removeBannerTradeSelect = function () {
    if (COMMON.top.$("#bannerTradeSelectDiv").length > 0) {
        COMMON.top.$("#bannerTradeSelectTop").remove();
        COMMON.top.$("#bannerTradeSelectDiv").remove();
    }
};
VISUALEDIT.removeAdvanceContent = function () {
    if (COMMON.top.$(".setContentDiv2").length > 0) {
        COMMON.top.$(".setContentDiv2").remove();
    }
    if (COMMON.top.$(".setContentDiv").length > 0) {
        COMMON.top.$(".setContentDiv").remove();
    }
};

VISUALEDIT.getRootPath = function () {

    var curWwwPath = window.document.location.href;

    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);

    var localhostPath = curWwwPath.substring(0, pos);

    var projectName = pathName
			.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPath + projectName);
};

VISUALEDIT.initBannerContentManage = function (bannerElement) {
    var randomId = $(bannerElement).attr("randomId");
    var objChannelId = $(bannerElement).attr("channelId");
    var contentId = $(bannerElement).attr("contentId");
    
    var conacEditAuth = $(bannerElement).attr("conacEditAuth");

    if (contentId) {
        $(bannerElement)
				.mouseover(
						function () {
						    var tempframeSrcUrl = base + appBase
									+ "/content/v_edit.do?ram=" + Math.random();
						    var e;
						    
						   if (conacEditAuth && conacEditAuth.toUpperCase() == "TRUE")
						    	{
						    e = [{
						        operationText: "编辑背景",
						        className: "edit",
						        evalScript: "VISUALEDIT.popupWindow({title:'编辑背景', frameSrcUrl:'"
										+ tempframeSrcUrl
										+ "&id="
										+ contentId
										+ "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+" });"
						    }];
						    }
						   else
							   {
							   	 e = [{
						        operationText: "已审核通过，不可更改",
						        className: "lock",
						        evalScript: ""
						    }];
							   }

						    // 添加单条内容鼠标划过时的边框
						    VISUALEDIT.addMoveFrameById(randomId);

						    //  添加单条内容的可视化编辑按钮
						    VISUALEDIT.addEditLayer(bannerElement, e, 1);
						}).mouseleave(function () {

						    // 移除单条内容鼠标划过时的边框
						    VISUALEDIT.removeMoveFrame(bannerElement.id);

						    // 移除单条内容的可视化编辑按钮
						    VISUALEDIT.removeEditLayer(bannerElement);
						});
    }
    else {
        $(bannerElement)
				.mouseover(
						function () {
						    var tempframeSrcUrl = base + appBase
									+ "/content/v_add.do?ram=" + Math.random();
						    var e = [{
						        operationText: "添加背景",
						        className: "new",
						        evalScript: "VISUALEDIT.popupWindow({title:'添加背景', frameSrcUrl:'"
										+ tempframeSrcUrl
										+ "&cid="
										+ objChannelId
										+ "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+" });"
						    }];

						    // 添加单条内容鼠标划过时的边框
						    VISUALEDIT.addMoveFrameById(randomId);

						    //  添加单条内容的可视化编辑按钮
						    VISUALEDIT.addEditLayer(bannerElement, e, 1);
						}).mouseleave(function () {

						    // 移除单条内容鼠标划过时的边框
						    VISUALEDIT.removeMoveFrame(bannerElement.id);

						    // 移除单条内容的可视化编辑按钮
						    VISUALEDIT.removeEditLayer(bannerElement);
						});
    }
}

VISUALEDIT.initBannerChannelManage = function (banner) {
    var randomId = $(banner).attr("randomId");
    var objChannelId = $(banner).attr("channelId");
    var conacEditAuth = $(banner).attr("conacEditAuth");

    $(banner)
			.mouseover(
					function () {
					    var tempframeSrcUrl = base + appBase
								+ "/channel/v_edit.do?ram=" + Math.random();
					    
					    var e;
					    if (conacEditAuth && conacEditAuth.toUpperCase() == "TRUE") {
					     e = [{
					        operationText: "编辑内容",
					        className: "edit",
					        evalScript: "VISUALEDIT.popupWindow({title:'编辑内容', frameSrcUrl:'"
									+ tempframeSrcUrl
									+ "&id="
									+ objChannelId
									+ "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+" });"
					    }];
					     }
					    else
					    	{
					    	e = [{
					        operationText: "没有栏目编辑权限",
					        className: "lock",
					        evalScript: ""
					    }];
					    	}

					    // 添加单条内容鼠标划过时的边框
					    VISUALEDIT.addMoveFrameById(randomId);

					    //  添加单条内容的可视化编辑按钮
					    VISUALEDIT.addEditLayer(banner, e, 1);
					}).mouseleave(function () {

					    // 移除单条内容鼠标划过时的边框
					    VISUALEDIT.removeMoveFrame(randomId);

					    // 移除单条内容的可视化编辑按钮
					    VISUALEDIT.removeEditLayer(banner);
					})
}
// 设置单条内容的可视化按钮和鼠标划过的边框
VISUALEDIT.initSingleContentLineItemManage = function (objContentLine) {
    var contentId = $(objContentLine).attr("contentId");
    var contentTitle = $(objContentLine).attr("contentTitle");
    var randomId = $(objContentLine).attr("randomId");
    var isFullScreen = $(objContentLine).attr("isFullScreen");
    

    var editAuth = $(objContentLine).attr("conacEditAuth");
	//VISUALEDIT.openMaxWindow
    $(objContentLine)
			.mouseover(
					function () {

					    var tempframeSrcUrl = base + appBase
								+ "/content/v_edit.do?ram=" + Math.random();
					    var e;
					    if (editAuth && editAuth.toUpperCase() == "TRUE") {
					    	

					    	if(isFullScreen && isFullScreen.toUpperCase() == "TRUE")
					    	{
					    	
						        e = [
									{
									    operationText: "编辑内容",
									    className: "edit",
									    evalScript:"VISUALEDIT.openMaxWindow('"+tempframeSrcUrl+"&id="+contentId+"&isFullScreen="+isFullScreen+"');"
									    
									    
									    
									    
	/*								    evalScript: "VISUALEDIT.popupWindow({title:'编辑内容', frameSrcUrl:'"
												+ tempframeSrcUrl
												+ "&id="
												+ contentId
												+ "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+" });"*/
									},
									{
									    operationText: "删除内容",
									    className: "close",
									    evalScript: "VISUALEDIT.delNews('" + contentId
												+ "', '"
												+ COMMON.encodeHtmlJs(contentTitle)
												+ "', document.location.href, 0);"
									}];
					        
					        }
					    	else
					    	{
					    			e = [
									{
									    operationText: "编辑内容",
									    className: "edit",
/*									    evalScript:"VISUALEDIT.openMaxWindow('"+tempframeSrcUrl+"&id="+contentId+"&isFullScreen="+isFullScreen+"');"*/
									    
									    
									    
									    
									    evalScript: "VISUALEDIT.popupWindow({title:'编辑内容', frameSrcUrl:'"
												+ tempframeSrcUrl
												+ "&id="
												+ contentId
												+ "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+" });"
									},
									{
									    operationText: "删除内容",
									    className: "close",
									    evalScript: "VISUALEDIT.delNews('" + contentId
												+ "', '"
												+ COMMON.encodeHtmlJs(contentTitle)
												+ "', document.location.href, 0);"
									}];
					    	}
					        
					        
					        
					    }
					    //VISUALEDIT.SCREENAVAILHEIGHT =window.screen.availHeight; VISUALEDIT.SCREENAVAILWIDTH =window.screen.availWidth;
					    else {
					        e = [
								{
								    operationText: "已审核通过，不可更改",
								    className: "lock",
								    evalScript: ""
								}];
					    }

					    // 添加单条内容鼠标划过时的边框
					    //VISUALEDIT.addMoveFrameToChild(objParent, objContentLine.id);
					    VISUALEDIT.addMoveFrameById(randomId);

					    //  添加单条内容的可视化编辑按钮
					    VISUALEDIT.addEditLayer(objContentLine, e, 1);
					}).mouseleave(function () {

					    // 移除单条内容鼠标划过时的边框
					    VISUALEDIT.removeMoveFrame(randomId);

					    // 移除单条内容的可视化编辑按钮
					    VISUALEDIT.removeEditLayer(objContentLine);
					})
}

// 设置单条内容的可视化按钮和鼠标划过的边框
VISUALEDIT.initSingleTopicItemManage = function (objTopic) {
    var topicId = $(objTopic).attr("topicId");
    var topicName = $(objTopic).attr("topicName");
    var randomId = $(objTopic).attr("randomId");

    if (topicId) {
        $(objTopic)
                .mouseover(function () {

                    // 不同的cid代表不同的栏目channel，目前由于id的唯一性，只需传入id系统自动根据内容寻找对应的edit页面

                    var tempframeSrcUrl = base + appBase
                            + "/topic/v_edit.do?ram=" + Math.random();
                    var e = [
                            {
                                operationText: "编辑主题",
                                className: "edit",
                                evalScript: "VISUALEDIT.popupWindow({title:'编辑主题', frameSrcUrl:'"
                                        + tempframeSrcUrl
                                        + "&id="
                                        + topicId
                                        + "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+" });"
                            },
                            {
                                operationText: "删除主题",
                                className: "close",
                                evalScript: "VISUALEDIT.delTopic('" + topicId
                                        + "', '"
                                        + COMMON.encodeHtmlJs(topicName)
                                        + "', document.location.href, 0);"
                            }];

                    // 添加单条内容鼠标划过时的边框
                    VISUALEDIT.addMoveFrameById(randomId);

                    //  添加单条内容的可视化编辑按钮
                    VISUALEDIT.addEditLayer(objTopic, e, 1)
                }).mouseleave(function () {

                    // 移除单条内容鼠标划过时的边框
                    VISUALEDIT.removeMoveFrame(randomId);

                    // 移除单条内容的可视化编辑按钮
                    VISUALEDIT.removeEditLayer(randomId);
                });
    }
    else {
        $(objTopic)
			.mouseover(function () {

			    // 不同的cid代表不同的栏目channel，目前由于id的唯一性，只需传入id系统自动根据内容寻找对应的edit页面

			    var tempframeSrcUrl = base + appBase
                        + "/topic/v_add.do?ram=" + Math.random();
			    var e = [
                        {
                            operationText: "添加主题",
                            className: "new",
                            evalScript: "VISUALEDIT.popupWindow({title:'添加主题', frameSrcUrl:'"
                                    + tempframeSrcUrl
                                    + "&id="
                                    + topicId
                                    + "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+" });"
                        }];

			    // 添加单条内容鼠标划过时的边框
			    VISUALEDIT.addMoveFrameById(randomId);

			    //  添加单条内容的可视化编辑按钮
			    VISUALEDIT.addEditLayer(objTopic, e, 1)
			}).mouseleave(function () {

			    // 移除单条内容鼠标划过时的边框
			    VISUALEDIT.removeMoveFrame(randomId);

			    // 移除单条内容的可视化编辑按钮
			    VISUALEDIT.removeEditLayer(randomId);
			});
    }
}

// 设置单条内容的可视化按钮和鼠标划过的边框
VISUALEDIT.initSingleGuestBookItemManage = function (objGuestBook) {

    var guestBookId = $(objGuestBook).attr("guestBookId");
    var d = $(objGuestBook).attr("guestBookTitle");
    var randomId = $(objGuestBook).attr("randomId");

    $(objGuestBook)
			.mouseover(function () {

			    // 不同的cid代表不同的栏目channel，目前由于id的唯一性，只需传入id系统自动根据内容寻找对应的edit页面

			    var tempframeSrcUrl = base + appBase
                        + "/guestbook/v_edit.do?ram=" + Math.random();
			    var e = [
                        {
                            operationText: "编辑留言",
                            className: "edit",
                            evalScript: "VISUALEDIT.popupWindow({title:'编辑留言', frameSrcUrl:'"
                                    + tempframeSrcUrl
                                    + "&id="
                                    + guestBookId
                                    + "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+" });"
                        },
                        {
                            operationText: "删除留言",
                            className: "close",
                            evalScript: "VISUALEDIT.delGuestBook('"
                                    + guestBookId + "', '"
                                    + COMMON.encodeHtmlJs(d)
                                    + "', document.location.href, 0);"
                        }];

			    // 添加单条内容鼠标划过时的边框
			    VISUALEDIT.addMoveFrameById(randomId);

			    //  添加单条内容的可视化编辑按钮
			    VISUALEDIT.addEditLayer(objGuestBook, e, 1)
			}).mouseleave(function () {

			    // 移除单条内容鼠标划过时的边框
			    VISUALEDIT.removeMoveFrame(randomId);

			    // 移除单条内容的可视化编辑按钮
			    VISUALEDIT.removeEditLayer(randomId);
			})
}

VISUALEDIT.initSingleCommentItemManage = function (objComment) {

    var commentId = $(objComment).attr("commentId");
    var randomId = $(objComment).attr("randomId");

    $(objComment)
			.mouseover(
					function () {

					    var tempframeSrcUrl = base + appBase
								+ "/comment/v_edit.do?ram=" + Math.random();
					    var e = [
								{
								    operationText: "编辑评论",
								    className: "edit",
								    evalScript: "VISUALEDIT.popupWindow({title:'编辑评论', frameSrcUrl:'"
											+ tempframeSrcUrl
											+ "&id="
											+ commentId
											+ "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+" });"
								},
								{
								    operationText: "删除评论",
								    className: "close",
								    evalScript: "VISUALEDIT.delComment('"
											+ commentId
											+ "', document.location.href, 0);"
								}];

					    // 添加单条内容鼠标划过时的边框
					    VISUALEDIT.addMoveFrameById(randomId);

					    //  添加单条内容的可视化编辑按钮
					    VISUALEDIT.addEditLayer(objComment, e, 1)
					}).mouseleave(function () {

					    // 移除单条内容鼠标划过时的边框
					    VISUALEDIT.removeMoveFrame(randomId);

					    // 移除单条内容的可视化编辑按钮
					    VISUALEDIT.removeEditLayer(randomId);
					})
}

VISUALEDIT.initSingleVoteTopicItemManage = function (objVoteTopic) {

    var voteTopicId = $(objVoteTopic).attr("voteTopicId");
    var d = $(objVoteTopic).attr("voteTopicTitle");
    var randomId = $(objVoteTopic).attr("randomId");

    $(objVoteTopic)
			.mouseover(
					function () {
					    var tempframeSrcUrl = base + appBase
								+ "/vote_topic/v_edit.do?ram=" + Math.random();
					    var e = [
								{
								    operationText: "编辑投票",
								    className: "edit",
								    evalScript: "VISUALEDIT.popupWindow({title:'编辑投票', frameSrcUrl:'"
											+ tempframeSrcUrl
											+ "&id="
											+ voteTopicId
											+ "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+" });"
								},
								{
								    operationText: "删除投票",
								    className: "close",
								    evalScript: "VISUALEDIT.delVoteTopic('"
											+ voteTopicId + "', '"
											+ COMMON.encodeHtmlJs(d)
											+ "', document.location.href, 0);"
								}];

					    // 添加单条内容鼠标划过时的边框
					    VISUALEDIT.addMoveFrameById(randomId);

					    //  添加单条内容的可视化编辑按钮
					    VISUALEDIT.addEditLayer(objVoteTopic, e, 1)
					}).mouseleave(function () {

					    // 移除单条内容鼠标划过时的边框
					    VISUALEDIT.removeMoveFrame(randomId);

					    // 移除单条内容的可视化编辑按钮
					    VISUALEDIT.removeEditLayer(randomId);
					})
}

VISUALEDIT.initSingleFriendLinkItemManage = function (objFriendLink) {
    var voteFriendLinkId = $(objFriendLink).attr("friendLinkid");
    var d = $(objFriendLink).attr("friendLinkName");
    var randomId = $(objFriendLink).attr("randomId");

    $(objFriendLink)
			.mouseover(
					function () {

					    var tempframeSrcUrl = base + appBase
								+ "/friendlink/v_edit.do?ram=" + Math.random();
					    var e = [
								{
								    operationText: "编辑友情链接",
								    className: "edit",
								    evalScript: "VISUALEDIT.popupWindow({title:'编辑友情链接', frameSrcUrl:'"
											+ tempframeSrcUrl
											+ "&id="
											+ voteFriendLinkId
											+ "', width:"+VISUALEDIT.SCREENAVAILWIDTH+", height:"+VISUALEDIT.SCREENAVAILHEIGHT+" });"
								},
								{
								    operationText: "删除友情链接",
								    className: "close",
								    evalScript: "VISUALEDIT.delFriendLink('"
											+ voteFriendLinkId + "', '"
											+ COMMON.encodeHtmlJs(d)
											+ "', document.location.href, 0);"
								}];

					    // 添加单条内容鼠标划过时的边框
					    VISUALEDIT.addMoveFrameById(randomId);

					    //  添加单条内容的可视化编辑按钮
					    VISUALEDIT.addEditLayer(objFriendLink, e, 1)
					}).mouseleave(function () {

					    // 移除单条内容鼠标划过时的边框
					    VISUALEDIT.removeMoveFrame(randomId);

					    // 移除单条内容的可视化编辑按钮
					    VISUALEDIT.removeEditLayer(randomId);
					})
}

VISUALEDIT.delNews = function (d, c, a, b) {
    // 移除所有可视化编辑按钮
    VISUALEDIT.removeAllEditLayer();

    if (VISUALEDIT.checkSaveBar()) {
        return


    }

    if (window.confirm("确定删除“" + c + "”?")) {
        COMMON.ing("正在删除……", false);
        var tempSrcUrl = base + appBase + "/content/o_delete.do";
        $.ajax({
            type: "post",
            url: tempSrcUrl,
            data: "ids=" + d,
            error: function () {
                COMMON.ing("系统繁忙，请稍候重试", false)
            },
            success: function (e) {
                //COMMON.successHandle(e, "删除成功", "", a, b, 1);
                alert("删除成功");
                COMMON.top.location.href = COMMON.top.location.href;
            }
        })
    }
};

VISUALEDIT.delTopic = function (d, c, a, b) {
    // 移除所有可视化编辑按钮
    VISUALEDIT.removeAllEditLayer();

    if (VISUALEDIT.checkSaveBar()) {
        return
    }

    if (window.confirm("确定删除“" + c + "”?")) {
        COMMON.ing("正在删除……", false);
        var tempSrcUrl = base + appBase + "/topic/o_delete.do";
        $.ajax({
            type: "post",
            url: tempSrcUrl,
            data: "ids=" + d,
            error: function () {
                COMMON.ing("系统繁忙，请稍候重试", false)
            },
            success: function (e) {
                //COMMON.successHandle(e, "删除成功", "", a, b, 1);
                alert("删除成功");
                COMMON.top.location.href = COMMON.top.location.href;
            }
        })
    }
};


VISUALEDIT.delGuestBook = function (d, c, a, b) {
    // 移除所有可视化编辑按钮
    VISUALEDIT.removeAllEditLayer();

    if (VISUALEDIT.checkSaveBar()) {
        return
    }

    if (window.confirm("确定删除“" + c + "”?")) {
        COMMON.ing("正在删除……", false);
        var tempSrcUrl = base + appBase + "/guestbook/o_delete.do";
        $.ajax({
            type: "post",
            url: tempSrcUrl,
            data: "ids=" + d,
            error: function () {
                COMMON.ing("系统繁忙，请稍候重试", false)
            },
            success: function (e) {
                //COMMON.successHandle(e, "删除成功", "", a, b, 1);
                alert("删除成功");
                COMMON.top.location.href = COMMON.top.location.href;
            }
        })
    }
};

VISUALEDIT.delComment = function (d, a, b) {
    // 移除所有可视化编辑按钮
    VISUALEDIT.removeAllEditLayer();

    if (VISUALEDIT.checkSaveBar()) {
        return
    }

    if (window.confirm("确定删除这条评论吗?")) {
        COMMON.ing("正在删除……", false);
        var tempSrcUrl = base + appBase + "/comment/o_delete.do";
        $.ajax({
            type: "post",
            url: tempSrcUrl,
            data: "ids=" + d,
            error: function () {
                COMMON.ing("系统繁忙，请稍候重试", false)
            },
            success: function (e) {
                //COMMON.successHandle(e, "删除成功", "", a, b, 1);
                alert("删除成功");
                COMMON.top.location.href = COMMON.top.location.href;
            }
        })
    }
};

VISUALEDIT.delVoteTopic = function (d, c, a, b) {
    // 移除所有可视化编辑按钮
    VISUALEDIT.removeAllEditLayer();

    if (VISUALEDIT.checkSaveBar()) {
        return
    }

    if (window.confirm("确定删除“" + c + "”?")) {
        COMMON.ing("正在删除……", false);
        var tempSrcUrl = base + appBase + "/vote_topic/o_delete.do";
        $.ajax({
            type: "post",
            url: tempSrcUrl,
            data: "ids=" + d,
            error: function () {
                COMMON.ing("系统繁忙，请稍候重试", false)
            },
            success: function (e) {
                //COMMON.successHandle(e, "删除成功", "", a, b, 1);
                alert("删除成功");
                COMMON.top.location.href = COMMON.top.location.href;
            }
        })
    }
};

VISUALEDIT.delFriendLink = function (d, c, a, b) {
    // 移除所有可视化编辑按钮
    VISUALEDIT.removeAllEditLayer();

    if (VISUALEDIT.checkSaveBar()) {
        return
    }
    if (window.confirm("确定删除“" + c + "”?")) {
        COMMON.ing("正在删除……", false);
        var tempSrcUrl = base + appBase + "/friendlink/o_delete.do";
        $.ajax({
            type: "post",
            url: tempSrcUrl,
            data: "ids=" + d,
            error: function () {
                COMMON.ing("系统繁忙，请稍候重试", false)
            },
            success: function (e) {
                //COMMON.successHandle(e, "删除成功", "", a, b, 1);
                alert("删除成功");
                COMMON.top.location.href = COMMON.top.location.href;
            }
        })
    }
};


VISUALEDIT.setTop = function (c, b, a) {
    VISUALEDIT.removeAllEditLayer();
    if (VISUALEDIT.checkSaveBar()) {
        return
    }
    COMMON.ing("正在设置……", false);
    $.ajax({
        type: "post",
        url: VISUALEDIT.genAjaxUrl("news_h.jsp"),
        data: "cmd=set&id=" + c + "&top=" + b,
        error: function () {
            COMMON.ing("系统繁忙，请稍候重试", false)
        },
        success: function (d) {
            //COMMON.successHandle(d, "设置成功", "", a, 0, 1)
        }
    })
};

VISUALEDIT.removeEditLayer = function (c, b, a) {
    var d = null;
    if (!b) {
        b = ""
    }
    if (typeof c == "object") {
        if (c.length == 1) {
            d = c
        } else {
            d = $(c)
        }
        c = d.attr("randomId")
    } else {
        d = $("#" + c)
    }
    var e = $("#" + c + "editLayer" + b);
    e.attr("_mouseIn", 0);
    if (a == 106) {
        setTimeout("VISUALEDIT.removeEditLayer_Internal('" + c + "','" + b + "',106)", 0)
    } else {
        setTimeout("VISUALEDIT.removeEditLayer_Internal('" + c + "','" + b + "')", 0)
    }
};
VISUALEDIT.removeEditLayer_Internal = function (b, e, f) {
    var g = b + "editLayer" + e;
    var a = $("#" + g);
    var h = $("#" + b + "moveFrameLeft");
    var c = $("#" + b + "moveFrameRight");
    var i = $("#" + b + "moveFrameTop");
    var d = $("#" + b + "moveFrameBottom");
    if (a.length == 1) {
        if (a.attr("_mouseIn") != 1) {
            if (h.length == 1) {
                if (h.attr("_mouseIn") == 1 || c.attr("_mouseIn") == 1 || i.attr("_mouseIn") == 1 || d.attr("_mouseIn") == 1) {
                    return
                }
                setTimeout("VISUALEDIT.removeMoveFrame('" + b + "')", 0)
            }
            if (f == 106) {
                a.remove();
                $("#" + b + "imgPdPoBorderTop").remove();
                $("#" + b + "imgPdPoBorderBottom").remove();
                $("#" + b + "imgPdPoBorderLeft").remove();
                $("#" + b + "imgPdPoBorderRight").remove()
            } else {
                a.remove()
            }
            $("#" + g + "tips").remove()
        }
    }
};

VISUALEDIT.addEditLayer = function (objId, editJson, positionMode, options) {
    var moduleId = $(objId).parents(".conacModule").attr("id");
    if (!COMMON.isNull(VISUALEDIT._enableEditLayer) && !VISUALEDIT._enableEditLayer) {
        return
    }
    if (!options) {
        options = {}
    }
    var extId = "";
    if (!COMMON.isNull(options.extId)) {
        extId = options.extId
    }
    var extCls = "";
    if (!COMMON.isNull(options.extCls)) {
        extCls = options.extCls
    }
    if (options.fromEditLayer) {
        VISUALEDIT.addMoveFrameById(objId, options.fromEditLayer)
    }
    var obj = null;
    if (typeof objId == "object") {
        if (objId.length == 1) {
            obj = objId
        } else {
            obj = $(objId)
        }
        objId = obj.attr("randomId")
    } else {
        obj = $("#" + objId)
    }
    var layerId = objId + "editLayer" + extId;
    if ($("#" + layerId).length < 1) {
        var html = "";
        var tipsText = "";
        var tipsTarget = "";
        var tipsFlag = "";
        $.each(editJson,
        function (i, n) {
            var statusScript = n.statusScript;
            var text = n.operationText;
            var className = n.className;
            var status = 0;
            var extScript = "VISUALEDIT.removeAllEditLayer();return false;";
            var id = n.id;
            if (statusScript) {
                status = eval(statusScript);
                text = n["operationText" + status];
                className = n["className" + status]
            }
            if (n.tipText && n.tipFlag && !VISUALEDIT.getCookieFlag(n.tipFlag)) {
                tipsText = n.tipText;
                if (id) {
                    tipsTarget = id
                } else {
                    tipsTarget = layerId + className;
                    id = layerId + className
                }
                tipsFlag = n.tipFlag;
                extScript = "VISUALEDIT.setCookieFlag(" + n.tipFlag + ", true);" + extScript
            }
            if (status != -1) {
                if (n.display != "text") {
                    if (id) {
                        if (extScript) {
                            html += "<a id='" + id + "' class='" + className + "' title='" + text + "' href='javascript:;' onclick=\"" + n.evalScript + ";" + extScript + '"></a>'
                        } else {
                            html += "<a id='" + id + "' class='" + className + "' title='" + text + "' href='javascript:;' onclick=\"" + n.evalScript + ';VISUALEDIT.removeAllEditLayer();return false;"></a>'
                        }
                    } else {
                        html += "<a class='" + className + "' title='" + text + "' href='javascript:;' onclick=\"" + n.evalScript + ";" + extScript + '"></a>'
                    }
                } else {
                    className = "button";
                    title = n.operationTitle;
                    if (n.judge && n.judge == "banner") {
                        if (top._bannerData.s == 3) {
                            className += " disabledBtn"
                        }
                    }
                    if (!title) {
                        title = ""
                    }
                    if (id) {
                        if (extScript) {
                            html += "<a id='" + id + "' class='" + className + "' title='" + title + "' href='javascript:;' onclick=\"" + n.evalScript + ";" + extScript + '">' + text + "</a>"
                        } else {
                            html += "<a id='" + id + "' class='" + className + "' title='" + title + "' href='javascript:;' onclick=\"" + n.evalScript + ';VISUALEDIT.removeAllEditLayer();return false;">' + text + "</a>"
                        }
                    } else {
                        html += "<a class='" + className + "' title='" + title + "' href='javascript:;' onclick=\"" + n.evalScript + ";" + extScript + '">' + text + "</a>"
                    }
                }
                if (i < editJson.length - 1) {
                    var tmpHrClass = "";
                    if (n.judge && n.judge == "banner") {
                        if (top._bannerData.s == 3) {
                            tmpHrClass += " disabledBtn"
                        }
                    }
                    html += "<div class='itemHr " + tmpHrClass + "'></div>"
                }
            }
        });
        if (html) {
            var className = "editLayer";
            if (positionMode == 7) {
                className += " editLayerV"
            }
            if (extCls) {
                className += " " + extCls
            }
            var html2 = "<div id='" + layerId + "' class='item'>";
            html2 += "  <div class='tools'>";
            html2 += html;
            html2 += "  </div>";
            html2 += "</div>";
            var div = $(html2);
            div.appendTo("body");
            div.attr("ancestorModule", moduleId);
            if (positionMode == 1) {
                div.css("margin", 0);
                div.css("left", obj.offset().left + obj.width() - div.width());
                div.css("top", obj.offset().top)
            } else {
                if (positionMode == 2) {
                    div.css("margin", 0);
                    div.css("left", obj.offset().left);
                    div.css("top", obj.offset().top + obj.height() - div.height())
                } else {
                    if (positionMode == 3) {
                        div.css("margin", 0);
                        if (obj.width() > 1000) {
                            div.css("left", (obj.width() - 960) / 2)
                        } else {
                            div.css("left", obj.offset().left)
                        }
                        div.css("top", obj.offset().top)
                    } else {
                        if (positionMode == 4) {
                            div.css("margin", 0);
                            div.css("left", obj.offset().left);
                            div.css("top", obj.offset().top - div.height())
                        } else {
                            if (positionMode == 5) {
                                div.css("margin", 0);
                                div.css("left", obj.offset().left + obj.width() - div.width());
                                div.css("top", obj.offset().top);
                                if (div.height() + 10 >= obj.height()) {
                                    div.css("top", obj.offset().top - div.height())
                                }
                            } else {
                                if (positionMode == 6) {
                                    div.css("margin", 0);
                                    div.css("left", obj.offset().left + obj.width() - div.width() - 3);
                                    div.css("top", obj.offset().top + obj.height() - div.height() - 4)
                                } else {
                                    if (positionMode == 7) {
                                        div.css("margin", 0);
                                        div.css("left", obj.offset().left - div.width() - 1);
                                        div.css("top", obj.offset().top)
                                    } else {
                                        if (positionMode == 8) {
                                            div.css("margin", 0);
                                            div.css("left", obj.offset().left + (obj.width() - div.width()) / 2);
                                            div.css("top", obj.offset().top - div.height() - 1)
                                        } else {
                                            if (positionMode == 9) {
                                                div.css("margin", 0);
                                                div.css("left", obj.offset().left + obj.width() - div.width());
                                                div.css("top", obj.offset().top + obj.height())
                                            } else {
                                                if (positionMode == 100) {
                                                    div.css("margin", 0);
                                                    div.css("left", obj.offset().left + obj.width() - div.width() - 35);
                                                    div.css("top", obj.offset().top)
                                                } else {
                                                    if (positionMode == 106) {
                                                        div.css("margin", 0);
                                                        div.css("left", obj.offset().left + obj.width() - div.width() - 3);
                                                        div.css("top", obj.offset().top + obj.height() - div.height() - 4);
                                                        var imgPdPoBorderTop = $("<div id='" + objId + "imgPdPoBorderTop' class='img_ProductPhoto_TB_Border'></div>");
                                                        var imgPdPoBorderBottom = $("<div id='" + objId + "imgPdPoBorderBottom' class='img_ProductPhoto_TB_Border'></div>");
                                                        var imgPdPoBorderLeft = $("<div id='" + objId + "imgPdPoBorderLeft' class='img_ProductPhoto_LR_Border'></div>");
                                                        var imgPdPoBorderRight = $("<div id='" + objId + "imgPdPoBorderRight' class='img_ProductPhoto_LR_Border'></div>");
                                                        imgPdPoBorderTop.appendTo("body");
                                                        imgPdPoBorderBottom.appendTo("body");
                                                        imgPdPoBorderLeft.appendTo("body");
                                                        imgPdPoBorderRight.appendTo("body");
                                                        $(div.find(".tools").find("a").eq(0)).before('<div class="itemHr"></div>');
                                                        var imgBorderWidth = "";
                                                        var imgBorderHeight = "";
                                                        var editLayerWidth = "";
                                                        var imgWidth = "";
                                                        var imgHeight = "";
                                                        if (obj.hasClass("formTable")) {
                                                            var doubleListPicWidth = obj.find(".imgDiv").eq(0);
                                                            imgBorderWidth = doubleListPicWidth.width();
                                                            imgBorderHeight = doubleListPicWidth.height();
                                                            editLayerWidth = doubleListPicWidth.width();
                                                            imgWidth = doubleListPicWidth.width();
                                                            imgHeight = doubleListPicWidth.height()
                                                        } else {
                                                            imgBorderWidth = obj.width();
                                                            imgBorderHeight = obj.height();
                                                            editLayerWidth = obj.width();
                                                            imgWidth = obj.width();
                                                            imgHeight = obj.height()
                                                        }
                                                        imgPdPoBorderTop.width(imgBorderWidth);
                                                        imgPdPoBorderBottom.width(imgBorderWidth);
                                                        imgPdPoBorderLeft.height(imgBorderHeight);
                                                        imgPdPoBorderRight.height(imgBorderHeight);
                                                        imgPdPoBorderTop.css("left", Math.round(obj.offset().left));
                                                        imgPdPoBorderBottom.css("left", Math.round(obj.offset().left));
                                                        imgPdPoBorderLeft.css("left", Math.round(obj.offset().left));
                                                        imgPdPoBorderRight.css("left", Math.round(obj.offset().left + imgBorderWidth));
                                                        imgPdPoBorderTop.css("top", Math.round(obj.offset().top - 1));
                                                        imgPdPoBorderBottom.css("top", Math.round(obj.offset().top + imgBorderHeight - 1));
                                                        imgPdPoBorderLeft.css("top", Math.round(obj.offset().top - 1));
                                                        imgPdPoBorderRight.css("top", Math.round(obj.offset().top - 1));
                                                        div.css("margin", 0);
                                                        div.css("left", Math.round(obj.offset().left));
                                                        div.css("top", Math.round(obj.offset().top + imgHeight - div.height() - 2));
                                                        div.css("width", editLayerWidth - 1);
                                                        div.find(".tools").css("float", "right")
                                                    } else {
                                                        div.css("margin", 0);
                                                        div.css("left", obj.offset().left + obj.width() - div.width());
                                                        div.css("top", obj.offset().top - div.height() - 1)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            var minTop = 0,
            maxTop = document.documentElement.clientHeight;
            //if ($("#web").length > 0) {
            //    minTop = $("#web").offset().top
            //}
            if (div.offset().top <= minTop) {
                if (typeof positionMode == "undefined" || positionMode == 0 || positionMode == 5) {
                    div.css("top", obj.offset().top + obj.height())
                } else {
                    if (positionMode == 4) {
                        if (obj.height() < div.height() * 2) {
                            div.css("top", obj.offset().top + obj.height())
                        } else {
                            div.css("top", minTop + "px")
                        }
                    } else {
                        div.css("top", minTop + "px")
                    }
                }
            }
            if ((div.offset().top + div.height()) >= maxTop) {
                if (positionMode == 9) {
                    div.css("top", obj.offset().top - div.height())
                }
            }
            if (div.offset().left <= 0) {
                div.css("left", 0)
            }
            if (tipsTarget) {
                if (!VISUALEDIT.getCookieFlag(tipsFlag)) {
                    COMMON.showTip({
                        id: layerId + "tips",
                        tid: "#" + tipsTarget,
                        content: tipsText,
                        closeSwitch: false,
                        mode: "bottom",
                        cls: "editLayerTips",
                        beforeClose: function () {
                            if (VISUALEDIT.getCookieFlag(tipsFlag)) {
                                VISUALEDIT.setCookieFlag(tipsFlag, true)
                            }
                        }
                    })
                }
            }
            div.mouseover(function () {
                $(this).attr("_mouseIn", 1);
                var moduleId = $(this).attr("ancestorModule");
                if (moduleId) {
                    var module = $("#" + moduleId);
                    var sideStatus = module.attr("_side");
                    if (sideStatus == 2) {
                        VISUALEDIT.stopFlutterInterval(module)
                    }
                    var parentId = module.parent().attr("id");
                    if (parentId == "floatLeftTopForms" || parentId == "floatLeftBottomForms") {
                        module.mouseenter()
                    } else {
                        if (parentId == "floatRightTopForms" || parentId == "floatRightBottomForms") {
                            module.mouseenter()
                        }
                    }
                }
            });
            if (positionMode != 106) {
                div.mouseleave(function () {
                    $(this).attr("_mouseIn", 0);
                    VISUALEDIT.removeEditLayer(objId, extId)
                })
            } else {
                div.mouseleave(function () {
                    $(this).attr("_mouseIn", 0);
                    VISUALEDIT.removeEditLayer(objId, extId, 106)
                })
            }
            VISUALEDIT.bindMousewheel();
            return div
        }
    } else {
        var div = $("#" + layerId);
        div.attr("_mouseIn", 1);
        return div
    }
};

//  objParentModule 需要添加虚线边框的元素的父元素
//  tmpId 需要添加虚线边框的元素的id或者为其临时生成的id
VISUALEDIT.addMoveFrameToChild = function (objParentModule, tmpId, e) {
    if (!COMMON.isNull(VISUALEDIT._enableEditLayer) && !VISUALEDIT._enableEditLayer) {
        return
    }
    var f;

    f = $(objParentModule).find("#" + tmpId);


    var h = false;

    if (f.length <= 0 || f.css("display") == "none") {
        return
    }
    var d = f.outerWidth() - 2;
    var a = f.outerHeight() - 2;

    var g = $("#" + tmpId + "moveFrameLeft");
    if (g.length < 1) {
        var b = "<div id='" + tmpId + "moveFrameLeft' class='moveFrame'></div>";
        g = $(b);
        g.appendTo("body");
        g.css("width", "0px");
        g.css("height", a + "px");
        g.css("left", f.offset().left);
        g.css("top", f.offset().top);
        if (COMMON.isIE6() || COMMON.isIE7()) {
            g.css("width", "1px");
            g.css("left", f.offset().left - 1)
        }
        g.css("background", "#FFF");
        g.css("border-left-width", "1px");
        if (h) {
            g.css("opacity", "0")
        } else {
            g.css("opacity", "1")
        }
        if (!e) {
            g.mouseover(function () {
                $(this).attr("_mouseIn", 1)
            }).mouseleave(function () {
                $(this).attr("_mouseIn", 0)
            })
        }
    }
    var g = $("#" + tmpId + "moveFrameRight");
    if (g.length < 1) {
        var b = "<div id='" + tmpId + "moveFrameRight' class='moveFrame'></div>";
        g = $(b);
        g.appendTo("body");
        g.css("height", a + "px");
        g.css("left", f.offset().left + d + 1);
        g.css("top", f.offset().top);
        if (!h) {
            g.css("width", "0px");
            if (COMMON.isIE6() || COMMON.isIE7()) {
                g.css("width", "1px")
            }
            g.css("background", "#FFF");
            g.css("border-right-width", "1px")
        } else {
            g.css({
                width: "1px",
                background: "transparent url(" + COMMON.top._resRoot + "/image/mulColTabBorderRight.png) no-repeat 0 0",
                border: "none"
            })
        }
        if (!e) {
            g.mouseover(function () {
                $(this).attr("_mouseIn", 1)
            }).mouseleave(function () {
                $(this).attr("_mouseIn", 0)
            })
        }
    }
    var g = $("#" + tmpId + "moveFrameTop");
    if (g.length < 1) {
        var b = "<div id='" + tmpId + "moveFrameTop' class='moveFrame'></div>";
        g = $(b);
        g.appendTo("body");
        g.css("left", f.offset().left);
        g.css("top", f.offset().top);
        if (!h) {
            g.css("width", d + "px");
            g.css("height", "0px");
            if (COMMON.isIE6() || COMMON.isIE7()) {
                g.css("height", "1px");
                g.css("top", f.offset().top - 1)
            }
            g.css("background", "#FFF");
            g.css("border-top-width", "1px")
        } else {
            g.css("width", (d + 1) + "px");
            if (COMMON.isIE6() || COMMON.isIE7()) {
                g.css("top", f.offset().top - 1)
            }
            g.css({
                height: "1px",
                background: "transparent url(" + Fai.top._resRoot + "/image/mulColTabBorderTop.png) no-repeat right top",
                border: "none"
            })
        }
        if (!e) {
            g.mouseover(function () {
                $(this).attr("_mouseIn", 1)
            }).mouseleave(function () {
                $(this).attr("_mouseIn", 0)
            })
        }
    }
    var g = $("#" + tmpId + "moveFrameBottom");
    if (g.length < 1) {
        var b = "<div id='" + tmpId + "moveFrameBottom' class='moveFrame'></div>";
        g = $(b);
        g.appendTo("body");
        g.css("width", d + "px");
        g.css("height", "0px");
        if (COMMON.isIE6() || COMMON.isIE7()) {
            g.css("height", "1px")
        }
        g.css("left", f.offset().left);
        g.css("top", f.offset().top + a + 1);
        g.css("background", "#FFF");
        g.css("border-bottom-width", "1px");
        if (h) {
            g.css("opacity", "0")
        } else {
            g.css("opacity", "1")
        }
        if (!e) {
            g.mouseover(function () {
                $(this).attr("_mouseIn", 1)
            }).mouseleave(function () {
                $(this).attr("_mouseIn", 0)
            })
        }
    }
};

VISUALEDIT.addMoveFrameById = function (tmpId, e) {
    if (!COMMON.isNull(VISUALEDIT._enableEditLayer) && !VISUALEDIT._enableEditLayer) {
        return
    }
    var f;

    f = $("[randomId=" + tmpId + "]");

    var h = false;

    if (f.length <= 0 || f.css("display") == "none") {
        return
    }
    var d = f.outerWidth() - 2;
    var a = f.outerHeight() - 2;

    if (!tmpId)
    { return; }

    var g = $("#" + tmpId + "moveFrameLeft");
    if (g.length < 1) {
        var b = "<div id='" + tmpId + "moveFrameLeft' class='moveFrame'></div>";
        g = $(b);
        g.appendTo("body");
        g.css("width", "0px");
        g.css("height", a + "px");
        g.css("left", f.offset().left);
        g.css("top", f.offset().top);
        if (COMMON.isIE6() || COMMON.isIE7()) {
            g.css("width", "1px");
            g.css("left", f.offset().left - 1)
        }
        g.css("background", "#FFF");
        g.css("border-left-width", "1px");
        if (h) {
            g.css("opacity", "0")
        } else {
            g.css("opacity", "1")
        }
        if (!e) {
            g.mouseover(function () {
                $(this).attr("_mouseIn", 1);
            }).mouseleave(function () {
                $(this).attr("_mouseIn", 0);
            })
        }
    }
    var g = $("#" + tmpId + "moveFrameRight");
    if (g.length < 1) {
        var b = "<div id='" + tmpId + "moveFrameRight' class='moveFrame'></div>";
        g = $(b);
        g.appendTo("body");
        g.css("height", a + "px");
        g.css("left", f.offset().left + d + 1);
        g.css("top", f.offset().top);
        if (!h) {
            g.css("width", "0px");
            if (COMMON.isIE6() || COMMON.isIE7()) {
                g.css("width", "1px")
            }
            g.css("background", "#FFF");
            g.css("border-right-width", "1px")
        } else {
            g.css({
                width: "1px",
                background: "transparent url(" + COMMON.top._resRoot + "/image/mulColTabBorderRight.png) no-repeat 0 0",
                border: "none"
            })
        }
        if (!e) {
            g.mouseover(function () {
                $(this).attr("_mouseIn", 1)
            }).mouseleave(function () {
                $(this).attr("_mouseIn", 0)
            })
        }
    }
    var g = $("#" + tmpId + "moveFrameTop");
    if (g.length < 1) {
        var b = "<div id='" + tmpId + "moveFrameTop' class='moveFrame'></div>";
        g = $(b);
        g.appendTo("body");
        g.css("left", f.offset().left);
        g.css("top", f.offset().top);
        if (!h) {
            g.css("width", d + "px");
            g.css("height", "0px");
            if (COMMON.isIE6() || COMMON.isIE7()) {
                g.css("height", "1px");
                g.css("top", f.offset().top - 1)
            }
            g.css("background", "#FFF");
            g.css("border-top-width", "1px")
        } else {
            g.css("width", (d + 1) + "px");
            if (COMMON.isIE6() || COMMON.isIE7()) {
                g.css("top", f.offset().top - 1)
            }
            g.css({
                height: "1px",
                background: "transparent url(" + Fai.top._resRoot + "/image/mulColTabBorderTop.png) no-repeat right top",
                border: "none"
            })
        }
        if (!e) {
            g.mouseover(function () {
                $(this).attr("_mouseIn", 1)
            }).mouseleave(function () {
                $(this).attr("_mouseIn", 0)
            })
        }
    }
    var g = $("#" + tmpId + "moveFrameBottom");
    if (g.length < 1) {
        var b = "<div id='" + tmpId + "moveFrameBottom' class='moveFrame'></div>";
        g = $(b);
        g.appendTo("body");
        g.css("width", d + "px");
        g.css("height", "0px");
        if (COMMON.isIE6() || COMMON.isIE7()) {
            g.css("height", "1px")
        }
        g.css("left", f.offset().left);
        g.css("top", f.offset().top + a + 1);
        g.css("background", "#FFF");
        g.css("border-bottom-width", "1px");
        if (h) {
            g.css("opacity", "0")
        } else {
            g.css("opacity", "1")
        }
        if (!e) {
            g.mouseover(function () {
                $(this).attr("_mouseIn", 1)
            }).mouseleave(function () {
                $(this).attr("_mouseIn", 0)
            })
        }
    }
};

VISUALEDIT.addMoveFrameByObj = function (obj, tmpId, e) {
    if (!COMMON.isNull(VISUALEDIT._enableEditLayer) && !VISUALEDIT._enableEditLayer) {
        return
    }
    var f;

    f = $(obj);

    var h = false;

    if (f.length <= 0 || f.css("display") == "none") {
        return
    }
    var d = f.outerWidth() - 2;
    var a = f.outerHeight() - 2;

    if (!tmpId)
    { return; }

    var g = $("#" + tmpId + "moveFrameLeft");
    if (g.length < 1) {
        var b = "<div id='" + tmpId + "moveFrameLeft' class='moveFrame'></div>";
        g = $(b);
        g.appendTo("body");
        g.css("width", "0px");
        g.css("height", a + "px");
        g.css("left", f.offset().left);
        g.css("top", f.offset().top);
        if (COMMON.isIE6() || COMMON.isIE7()) {
            g.css("width", "1px");
            g.css("left", f.offset().left - 1)
        }
        g.css("background", "#FFF");
        g.css("border-left-width", "1px");
        if (h) {
            g.css("opacity", "0")
        } else {
            g.css("opacity", "1")
        }
        if (!e) {
            g.mouseover(function () {
                $(this).attr("_mouseIn", 1);
            }).mouseleave(function () {
                $(this).attr("_mouseIn", 0);
            })
        }
    }
    var g = $("#" + tmpId + "moveFrameRight");
    if (g.length < 1) {
        var b = "<div id='" + tmpId + "moveFrameRight' class='moveFrame'></div>";
        g = $(b);
        g.appendTo("body");
        g.css("height", a + "px");
        g.css("left", f.offset().left + d + 1);
        g.css("top", f.offset().top);
        if (!h) {
            g.css("width", "0px");
            if (COMMON.isIE6() || COMMON.isIE7()) {
                g.css("width", "1px")
            }
            g.css("background", "#FFF");
            g.css("border-right-width", "1px")
        } else {
            g.css({
                width: "1px",
                background: "transparent url(" + COMMON.top._resRoot + "/image/mulColTabBorderRight.png) no-repeat 0 0",
                border: "none"
            })
        }
        if (!e) {
            g.mouseover(function () {
                $(this).attr("_mouseIn", 1)
            }).mouseleave(function () {
                $(this).attr("_mouseIn", 0)
            })
        }
    }
    var g = $("#" + tmpId + "moveFrameTop");
    if (g.length < 1) {
        var b = "<div id='" + tmpId + "moveFrameTop' class='moveFrame'></div>";
        g = $(b);
        g.appendTo("body");
        g.css("left", f.offset().left);
        g.css("top", f.offset().top);
        if (!h) {
            g.css("width", d + "px");
            g.css("height", "0px");
            if (COMMON.isIE6() || COMMON.isIE7()) {
                g.css("height", "1px");
                g.css("top", f.offset().top - 1)
            }
            g.css("background", "#FFF");
            g.css("border-top-width", "1px")
        } else {
            g.css("width", (d + 1) + "px");
            if (COMMON.isIE6() || COMMON.isIE7()) {
                g.css("top", f.offset().top - 1)
            }
            g.css({
                height: "1px",
                background: "transparent url(" + Fai.top._resRoot + "/image/mulColTabBorderTop.png) no-repeat right top",
                border: "none"
            })
        }
        if (!e) {
            g.mouseover(function () {
                $(this).attr("_mouseIn", 1)
            }).mouseleave(function () {
                $(this).attr("_mouseIn", 0)
            })
        }
    }
    var g = $("#" + tmpId + "moveFrameBottom");
    if (g.length < 1) {
        var b = "<div id='" + tmpId + "moveFrameBottom' class='moveFrame'></div>";
        g = $(b);
        g.appendTo("body");
        g.css("width", d + "px");
        g.css("height", "0px");
        if (COMMON.isIE6() || COMMON.isIE7()) {
            g.css("height", "1px")
        }
        g.css("left", f.offset().left);
        g.css("top", f.offset().top + a + 1);
        g.css("background", "#FFF");
        g.css("border-bottom-width", "1px");
        if (h) {
            g.css("opacity", "0")
        } else {
            g.css("opacity", "1")
        }
        if (!e) {
            g.mouseover(function () {
                $(this).attr("_mouseIn", 1)
            }).mouseleave(function () {
                $(this).attr("_mouseIn", 0)
            })
        }
    }
};



VISUALEDIT.removeMoveFrame = function (a) {
    $("#" + a + "moveFrameLeft").remove();
    $("#" + a + "moveFrameRight").remove();
    $("#" + a + "moveFrameTop").remove();
    $("#" + a + "moveFrameBottom").remove()
};

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

// 01 topbar初始化请求批处理函数
VISUALEDIT.initPageAuth = function (c, b, a) {
    VISUALEDIT.initTopBar(c); // 02
    VISUALEDIT.initSiteBulletin(c); // 03
    VISUALEDIT.initSiteRenewNotice(b); // 04
    VISUALEDIT.footerLogin(a); //05
};

// 02 初始化topbar
VISUALEDIT.initTopBar = function (e) {
    $("#scrollbar").hide(); // 隐藏--正在加载网站管理功能面板
    // 服务支持按钮
    $("#choiceService").mouseleave(function () {
        $(this).attr("_mouseIn", 0); // 鼠标离开
        setTimeout("VISUALEDIT.hideOnlineHelp()", 100)
    }).mouseover(function () {
        $(this).attr("_mouseIn", 1); // 鼠标悬停
        $(this).addClass("choiceServiceInfo-hover");
        var f = $(".serviceList");
        f.css("left", $(this).position().left);
        f.css("top", $(this).position().top + 24);
        f.show()
    });

    // 服务支持对应的list
    $(".serviceList").mouseover(function () {
        $("#choiceService").attr("_mouseIn", 1);
        $(".serviceList").show()
    }).mouseleave(function () {
        $("#choiceService").attr("_mouseIn", 0);
        setTimeout("VISUALEDIT.hideOnlineHelp()", 100)
    });

    // 编辑人员按钮
    $("#topBarStaff").mouseleave(function () {
        $(this).attr("_mouseIn", 0);
        setTimeout(function () {
            var f = parseInt($("#topBarStaff").attr("_mouseIn"));
            if (f == 0) {
                $(".topBarStaffContent").hide();
                $("#topBarStaff").removeClass("siteTitle-hover")
            }
        },
        100)
    }).mouseover(function () {
        $(this).attr("_mouseIn", 1);
        $(this).addClass("siteTitle-hover");
        var f = $(".topBarStaffContent");
        f.css("left", $(this).position().left - f.outerWidth() + $(this).outerWidth());
        f.css("top", $(this).position().top + 26);
        f.show()
    });

    // 编辑人员按钮悬停显示出的内容
    $(".topBarStaffContent").mouseover(function () {
        $("#topBarStaff").attr("_mouseIn", 1);
        $(this).show()
    }).mouseleave(function () {
        $("#topBarStaff").attr("_mouseIn", 0);
        setTimeout(function () {
            var f = parseInt($("#topBarStaff").attr("_mouseIn"));
            if (f == 0) {
                $(".topBarStaffContent").hide();
                $("#topBarStaff").removeClass("siteTitle-hover")
            }
        },
        100)
    });

    if (COMMON.isIE7()) {
        $(".topBarStaffContent .bottom").width($(".topBarStaffContent").width())
    }

    // 工具条提示公告
    $(".topBarBulletin").mouseleave(function () {
        $(this).attr("_mouseIn", 0);
        setTimeout(function () {
            var f = parseInt($(".topBarBulletin").attr("_mouseIn"));
            if (f == 0) {
                $(".topBarBulletinContent").hide();
                $(".topBarBulletin").removeClass("topBarBulletin-hover");
                if ($.cookie("topBarUpdateVer") != null && $.cookie("topBarUpdateVer") != COMMON.top._topBarUpdateVersion) {
                    $(".topBarBulletinRemind").html("有新功能更新");
                    $(".topBarBulletinRemind").show();
                    $(".topBarBulletin").addClass("topBarBulletin-hasNew");
                    $(".topBarBulletinContent .redPoint").show()
                }
            }
        },
        100)
    }).mouseover(function () {
        $(this).attr("_mouseIn", 1);
        $(this).addClass("topBarBulletin-hover");
        var f = $(".topBarBulletinContent");
        f.css("left", $(this).position().left - f.outerWidth() + $(this).outerWidth());
        f.css("top", $(this).position().top + 26);
        f.show();
        $(".topBarBulletinRemind").hide();
        $(".topBarBulletin").removeClass("topBarBulletin-hasNew");
        $.cookie("topBarMyNewsVer", COMMON.top._topBarMyNewsVersion, {
            expires: 365,
            domain: document.domain,
            path: "/"
        });
    });

    $("#topBarArea").find(".styleSettingButton").first().css("border-left-color", "#f00");
    if ($(".memberBarArea").height()) {
        $("#topBarArea").addClass("g_topBarArea_noShadow")
    }
};

// 03
VISUALEDIT.initSiteBulletin = function (h) {
    var c = $("#siteBulletin_box");
    var g = c.height();
    if (c.length == 0) {
        return
    }
    var i = 0;
    var e = COMMON.Cookie.get("siteBulletinOem_version");
    if (h && (typeof e == "undefined" || e == null)) {
        i = 1;
        var b = new Date();
        b.setTime(b.getTime() + 365 * 24 * 60 * 60 * 1000);
        COMMON.Cookie.set("siteBulletinOem_version", "-", b)
    } else {
        if (COMMON.top._siteBulletinOemVersion == e) {
            i = COMMON.Cookie.get("siteBulletin_off")
        } else {
            i = 0;
            var b = new Date();
            b.setTime(b.getTime() + 365 * 24 * 60 * 60 * 1000);
            COMMON.Cookie.set("siteBulletinOem_version", COMMON.top._siteBulletinOemVersion, b)
        }
    }
    var f = $("#siteBulletin_small_box");
    var d = f.height();
    var a = $("#siteBulletin_close");
    if (i == 0) {
        c.slideDown("normal");
        a.attr("title", "点击隐藏公告")
    } else {
        f.delay(100).fadeIn(600);
        f.attr("title", "点击查看公告")
    }
    $("#siteBulletin_close").live("click",
    function () {
        c.slideUp("normal",
        function () {
            f.delay(100).fadeIn(600);
            f.attr("title", "点击查看公告");
            var j = new Date();
            j.setTime(j.getTime() + 7 * 24 * 60 * 60 * 1000);
            COMMON.Cookie.set("siteBulletin_off", 1, j)
        })
    });
    f.on("click",
    function () {
        f.hide();
        c.slideDown("normal");
        a.attr("title", "点击隐藏公告")
    })
};

// 04
VISUALEDIT.initSiteRenewNotice = function (b) {
    var a = $("#siteRenewNotice_small_box");
    var e = $("#siteRenewNotice_close");
    var c = COMMON.Cookie.get("siteRenewNotice_on");
    var d = $("#siteRenewNotice_box");
    if (7 < b && b < 31 && c != 0) {
        VISUALEDIT.showSiteRenewNoticeTime(d, a, 3)
    } else {
        if (-8 < b && b < 8 && c != 0) {
            VISUALEDIT.showSiteRenewNoticeTime(d, a, 1)
        } else {
            if (-31 < b && b < -7 && c != 0) {
                VISUALEDIT.showSiteRenewNoticeTime(d, a, 7)
            }
        }
    }
    if (c == 0) {
        a.show();
        $("#siteRenewNotice_close,#siteRenewNotice_close_a").live("click",
        function () {
            $("#siteRenewNotice_box").slideUp("normal",
            function () {
                a.delay(100).fadeIn(600);
                a.attr("title", "点击查看付费公告")
            })
        })
    }
    a.on("click",
    function () {
        a.hide();
        d.slideDown("normal");
        $("#siteRenewNotice_close").attr("title", "点击隐藏付费公告")
    })
};

VISUALEDIT.footerLogin = function (a) {
    if (a < 2) {
        VISUALEDIT.showTip({
            tid: "#footerLogin a",
            content: "您下次可以从此处快捷登录&nbsp;&nbsp;<a hidefocus='true' href='javascript:;' onclick='COMMON.closeTip(\"#footerLogin a\");VISUALEDIT.setCookieFlag(37, true);' style='color:red;'>我知道了</a>",
            appendToId: "#web",
            autoLocation: true,
            cusStyle: "z-index:9031;"
        },
        37)
    }
};

// 清除所有的编辑工具层
VISUALEDIT.removeAllEditLayer = function () {
    $(".img_ProductPhoto_LR_Border").remove();
    $(".img_ProductPhoto_TB_Border").remove();
    $(".editLayer").remove();
    $(".moveFrame").remove();
    $(".moduleLayer").remove();
    $(".flutterLayer").remove();
    $(".editLayerTips").remove();
    $(".shortcutLayer").remove()
};

// 显示顶部工具条
VISUALEDIT.showTopBar = function () {
    if (COMMON.top.$("#arrow").hasClass("g_arrow_up")) {
        COMMON.top.$("#arrow").removeClass("g_arrow_up");
        COMMON.top.$("#topBar").hide()
    } else {
        COMMON.top.$("#arrow").addClass("g_arrow_up");
        COMMON.top.$("#topBar").show()
    }
    VISUALEDIT.resetGmainPos()
};

// 重置g_main组件编辑域
VISUALEDIT.resetGmainPos = function () {
    var d = 0;
    d = VISUALEDIT.getTopHeight();
    var b = COMMON.top.$("#g_main");
    if (COMMON.isIE6() || COMMON.isIE7()) {
        var a = COMMON.top.document.documentElement.clientHeight - d;
        if (b.height() != a) {
            b.css("height", a + "px")
        }
        var c = COMMON.top.document.documentElement.clientWidth;
        if (b.width() != c) {
            b.css("width", c + "px")
        }
    }
    if ($("#topBar").css("display") === "block") {
        d = d - 6
    }
    if ($("#memberBarArea").length !== 0) {
        d = d - 2
    }
    if (b.css("top") != (d + "px")) {
        b.css("top", d + "px")
    }
    VISUALEDIT.resetMemberBarPos();
    COMMON.top.$(".floatLeftTop").css("top", d + "px");
    COMMON.top.$(".floatRightTop").css("top", d + "px")
};

// 获取top的高度
VISUALEDIT.getTopHeight = function () {
    var f = 0;
    var e = 0;
    var a = 0;
    var d = 0;
    var g = 0;
    var c = 0;
    var b = 0;
    if ((COMMON.top.$("#sitetips").length > 0) && (COMMON.top.$("#sitetips").css("display") != "none")) {
        g = COMMON.top.$("#sitetips").outerHeight(true)
    }
    if ((COMMON.top.$("#arrears").length > 0) && (COMMON.top.$("#arrears").css("display") != "none")) {
        e = COMMON.top.$("#arrears").outerHeight(true)
    }
    if ((COMMON.top.$("#topBar").length > 0) && (COMMON.top.$("#topBar").css("display") != "none")) {
        a = COMMON.top.$("#topBarArea").outerHeight(true)
    }
    if ((COMMON.top.$("#styleDesign").length > 0) && (COMMON.top.$("#styleDesign").css("display") != "none")) {
        d = COMMON.top.$("#styleDesign").outerHeight(true)
    }
    if ((COMMON.top.$("#siteTipsDemoTemplate").length > 0) && (COMMON.top.$("#siteTipsDemoTemplate").css("display") != "none")) {
        c = COMMON.top.$("#siteTipsDemoTemplate").outerHeight(true)
    }
    if ((COMMON.top.$("#memberBar").length > 0) && (COMMON.top.$("#memberBar").css("display") != "none")) {
        b = COMMON.top.$("#memberBar").outerHeight(true)
    }
    if (d > 0) {
        g = 0
    }
    f = e + a + d + g + c + b;
    return f
};

// 重置memberBar域的定位
VISUALEDIT.resetMemberBarPos = function () {
    var b = VISUALEDIT.getTopHeight() - 32;
    if ($("#topBar").css("display") === "block") {
        b = b - 6
    }
    var a = COMMON.top.$("#memberBarArea");
    if (a.css("top") != (b + "px")) {
        a.css("top", b + "px")
    }
};

// 单击默认样式
VISUALEDIT.styleDefaultClick = function () {
    VISUALEDIT.stylePanesHide()
};

// 隐藏/显示样式控制板
VISUALEDIT.stylePanesHide = function () {
    var b = COMMON.top.$("#conacFloatPanel");
    var tempAddHeight = 0;
    COMMON.top.$("#panes").hide();
    COMMON.top.$(".g_styleDesign").css("height", (37 + tempAddHeight) + "px");
    $("#styleDesignArrow").removeClass("g_styleDesignArrowUp").addClass("g_styleDesignArrow");
    $("#styleDesignArrow").attr("title", "点击展开设计面板");
    COMMON.top.VISUALEDIT.resetGmainPos();
    VISUALEDIT.refreshPanelStyle(b);
    VISUALEDIT.refreshCOMMONFloatPanelIconStyle(true)
};

// 重置样式控制板
VISUALEDIT.refreshPanelStyle = function () {
    var c = COMMON.top.$("#conacFloatPanel");
    if (typeof c == "undefined" || c.length < 1) {
        return
    }
    var a = COMMON.top.$(".floatLeftTop").offset().top;
    var f = COMMON.top.$(".floatLeftBottom").offset().top;
    var e = f - a;
    var g = COMMON.top.$(".floatRightTop").offset().left;
    if (c.attr("status") != 0) {
        var j = g - c.outerWidth() + 1;
        if (c.attr("location") == "right") {
            c.css({
                left: j + "px"
            })
        }
    }
    c.css({
        top: a + "px",
        height: e + 6 + "px"
    });
    var i = e - 38 - 38 - 10;
    var d = i - 24;
    var b = i;
    var h = i - 24;
    if (COMMON.top.$("#panelOemPrompt").length > 0) {
        d -= 30
    }
    if (COMMON.top.$("#otherSectionSelecterContainer").is(":visible")) {
        h -= 45
    }
    COMMON.top.$("#addModuleContentContainer").css({
        height: b + "px"
    });
    COMMON.top.$("#setSiteStyleContentContainer").css({
        height: d + "px"
    });
    COMMON.top.$("#sectionModuleContentContainer").css({
        height: h + "px"
    });
    VISUALEDIT.refreshFillDiv()
};

// 重置所有Fill域
VISUALEDIT.refreshFillDiv = function () {
    var f = COMMON.top.$("#addModuleContentContainer");
    var b = f.find(".splitLine");
    var m = f.find(".panelContentFillDiv");
    var p = f.offset().top;
    var a = f.outerHeight();
    var c = m.offset().top;
    var n = 0;
    var j = (c - p) % a;
    n = a - f.find(".panelItemContainer").last().outerHeight();
    m.css({
        height: n + "px"
    });
    var e = COMMON.top.$("#setSiteStyleContentContainer");
    var i = e.find(".splitLine");
    var o = e.find(".panelContentFillDiv");
    var h = e.offset().top;
    var l = e.outerHeight();
    var g = o.offset().top;
    var k = 0;
    var d = (g - h) % l;
    k = l - e.find(".panelItemContainer").last().outerHeight();
    o.css({
        height: k + "px"
    })
};

// 
VISUALEDIT.refreshCOMMONFloatPanelIconStyle = function (f) {
    var b = COMMON.top.$("#conacFloatPanelIconContainer");
    if (b.length < 1) {
        return
    }
    if (b.attr("status") != 1) {
        return
    }
    var e = $.cookie("conacFloatPanelIcon_left", {
        path: "/"
    });
    var c = $.cookie("conacFloatPanelIcon_top", {
        path: "/"
    });
    if (typeof e == "string" && typeof c == "string") {
        b.removeClass("conacFloatPanelIconContainer_left conacFloatPanelIconContainer_right");
        b.css({
            left: e + "px",
            top: c + "px"
        });
        var g = 10;
        var h = COMMON.top.$(".floatRightTop").offset().left;
        var k = h / 2;
        var d = parseInt(e);
        var j = d + 52 + g;
        var a = d;
        if (d < g) {
            b.addClass("conacFloatPanelIconContainer_left");
            a = 0
        } else {
            if (j > h) {
                b.addClass("conacFloatPanelIconContainer_right");
                a = h - 23
            }
        }
        if (f) {
            b.css({
                left: a + "px"
            })
        } else {
            b.animate({
                left: a + "px"
            },
            500)
        }
        if (d < k) {
            b.attr("location", "left")
        } else {
            b.attr("location", "right")
        }
    }
    var i = COMMON.top.$(".floatRightTop").offset().top;
    if (b.offset().top < i) {
        b.css({
            top: i + "px"
        })
    } else {
        if (typeof c != "undefined" && (parseInt(c) < i)) {
            c = i + ""
        }
        if (typeof e == "string" && typeof c == "string") {
            b.css({
                left: a + "px",
                top: c + "px"
            })
        }
    }
};

VISUALEDIT.webTemplateTabClick = function (b) {
    VISUALEDIT.stylePanesShow(true);
    VISUALEDIT.newRapidSiteInit(true);
    COMMON.top.$("#webTemplate").show();
    COMMON.top.$("#webTemplateTab").addClass("current");
    if (!COMMON.top.$("#webTemplateFrame").attr("src")) {
        VISUALEDIT.styleDesignLoading("webTemplate", "webTemplateFrame");
        COMMON.top.$("#webTemplateFrame").attr("src", base + appBase + "/visual/v_site_clone.do?ram=" + Math.random());
        COMMON.top.$("#webTemplateFrame").load(function () {
            // COMMON.top.$("#webTemplateFrame")[0].contentWindow.parentShow();
            var c = COMMON.top.$("#webTemplateFrame")[0].contentWindow.document.getElementById(b);
            if (c) {
                c.click()
            }
        })
    } else {
        // COMMON.top.$("#webTemplateFrame")[0].contentWindow.parentShow();
        var a = COMMON.top.$("#webTemplateFrame")[0].contentWindow.document.getElementById(b);
        if (a) {
            a.click()
        }
    }

    COMMON.top.$("#newRapidSitePreview").show();

};

// 显示样式控制板
VISUALEDIT.stylePanesShow = function (a) {
    COMMON.top.$("#panes").show();
    if (a) {
        COMMON.top.$("#panes > div").hide();
        COMMON.top.$("#tabs a").removeClass("current")
    }
    COMMON.top.$(".g_styleDesign").css("height", "340px");
    COMMON.top.$("#styleDesignArrow").removeClass("g_styleDesignArrow").addClass("g_styleDesignArrowUp");
    COMMON.top.$("#styleDesignArrow").attr("title", "点击收起设计面板");
    COMMON.top.VISUALEDIT.resetGmainPos();
    COMMON.top.$("#tabs > li").hover(function () {
        var b = $(this).find("a").hasClass("current");
        if (!b) {
            $(this).addClass("tabHover").siblings().removeClass("tabHover")
        }
    },
    function () {
        var b = $(this).find("a").hasClass("current");
        if (!b) {
            $(this).removeClass("tabHover")
        }
    });
    COMMON.top.$("#tabs > li").bind("click",
    function () {
        $(this).removeClass("tabHover")
    });
    COMMON.top.$("#tabs .saveBtn").hover(function () {
        if ($(this).hasClass("buttonDisabled")) {
            return
        }
        $(this).addClass("saveBtnHover")
    },
    function () {
        $(this).removeClass("saveBtnHover")
    });
    COMMON.top.$("#tabs .cancelBtn").hover(function () {
        $(this).addClass("cancelBtnHover")
    },
    function () {
        $(this).removeClass("cancelBtnHover")
    });
    VISUALEDIT.hideCOMMONFloatPanel(true);
    VISUALEDIT.refreshCOMMONFloatPanelIconStyle(true)
};

// 隐藏Float控制板
VISUALEDIT.hideCOMMONFloatPanel = function (a) {
    var d = COMMON.top.$("#conacFloatPanel");
    if (d.length > 0 && (d.attr("status") == 1)) {
        var c = 1 - d.outerWidth();
        var b = COMMON.top.$(".floatRightTop").offset().left;
        if (d.attr("location") == "right") {
            c = b - 1
        }
        if (a) {
            d.attr("status", "0").css({
                left: c + "px"
            }).hide()
        } else {
            d.attr("status", "0").animate({
                left: c + "px"
            },
            300);
            setTimeout(function () {
                d.hide()
            },
            300)
        }
        VISUALEDIT.showCOMMONFloatPanelIcon()
    }
};

VISUALEDIT.showCOMMONFloatPanelIcon = function () {
    var a = COMMON.top.$("#conacFloatPanelIconContainer");
    a.attr({
        status: "1"
    }).show();
    VISUALEDIT.refreshCOMMONFloatPanelIconStyle()
};


VISUALEDIT.styleDesignLoading = function (a, c) {
    var b = $('<div class="forWaiting ajaxLoading2" style="position:absolute;background-color:#f7f7f7;width:100%;height:205px;top:37px;left:0;"></div>');
    b.appendTo("#" + a);
    $("#" + c).load(function () {
        $(".forWaiting").remove()
    })
};

// 关闭样式控制面板
VISUALEDIT.closeStyleDesign = function () {
    VISUALEDIT.styleSetting("close");
    // 隐藏提示面板
    COMMON.top.$("#newRapidSitePreview").remove();
    // 清除变化
    COMMON.top._changeStyleNum = 0;
    // 改变保存按钮状态
    COMMON.top.$("#styleDesign").find(".saveBtn").addClass("buttonDisabled");
};

// 隐藏banner选择面板
VISUALEDIT.removeBannerTradeSelect = function () {
    if (COMMON.top.$("#bannerTradeSelectDiv").length > 0) {
        COMMON.top.$("#bannerTradeSelectTop").remove();
        COMMON.top.$("#bannerTradeSelectDiv").remove();
    }
};

// 隐藏advance内容
VISUALEDIT.removeAdvanceContent = function () {
    if (COMMON.top.$(".setContentDiv2").length > 0) {
        COMMON.top.$(".setContentDiv2").remove();
    }
    if (COMMON.top.$(".setContentDiv").length > 0) {
        COMMON.top.$(".setContentDiv").remove();
    }
};

// 变更样式设计面板，显示或者隐藏样式面板
VISUALEDIT.changeStyleDesignPanes = function () {
    if ($("#styleDesignArrow").hasClass("g_styleDesignArrowUp")) {
        VISUALEDIT.stylePanesHide();
        VISUALEDIT.fixWebFooterHeight();
    } else {
        VISUALEDIT.stylePanesShow(false);
    }
};

// 样式设计控制板隐藏后将编辑区域高度重绘
VISUALEDIT.fixWebFooterHeight = function () {
    var h = COMMON.top.$("#web"),
    // COMMONEDIT需要修改
    a = COMMON.top.$("body").height(),
    c = COMMON.top.$("#webFooterTable"),
    b = c.css({
        height: ""
    }) && c.height(),
    f = h.offset().top,
    d = h.height();
    if (COMMON.isIE6()) {
        var g = 0;
        h.find(">table").each(function () {
            g += $(this).height()
        });
        if (a > (g + f)) {
            c.css("height", (a - g + b - f) + "px")
        }
    } else {
        var e = d + f;
        if (a > e) {
            var i = a - e;
            c.css("height", i + b + "px")
        }
    }
};

// 关闭模板选择面板
VISUALEDIT.newRapidSiteClose = function () {
    VISUALEDIT.logDog(100063, 6);
    if (COMMON.top.rapidSiteStyleChangeNum > 0) {
        var b = new Array();
        b.push("<div style='line-height:20px; color:black; text-align:center; padding:10px 0px;'>");
        b.push("您还没复制当前样板，确定要离开吗？</span>");
        b.push("</div>");
        var a = COMMON.popupBodyWindow({
            title: "取消复制",
            content: b.join(""),
            width: 300,
            height: 40
        });
        COMMON.addPopupBodyWindowBtn(a, {
            id: "save",
            text: "确定",
            extClass: "saveButton",
            click: function () {
                VISUALEDIT.newRapidSiteRemove();
                $("#popupWindow" + a).remove();
                $("#popupBg" + a).remove();
                COMMON.top.$("#popupBgTitle" + a).remove()
            }
        });
        COMMON.addPopupBodyWindowBtn(a, {
            id: "cancel",
            text: "取消",
            click: function () {
                $("#popupWindow" + a).remove();
                $("#popupBg" + a).remove();
                COMMON.top.$("#popupBgTitle" + a).remove()
            }
        })
    } else {
        VISUALEDIT.newRapidSiteRemove()
    }
};

// 删除模板选择面板
VISUALEDIT.newRapidSiteRemove = function () {
    VISUALEDIT.resetGmainPos();
    COMMON.top.$("#newRapidSiteTopBar").hide();
    COMMON.top.$("#newRapidSitePreview").hide();
    COMMON.top.$("#newRapidSiteMain").hide();
    COMMON.top.$("#newRapidSiteTopBar .save").addClass("buttonDisabled");
    COMMON.top.$("#newRapidSitePreviewFrame").hide();
    COMMON.top.$("#newRapidSiteBlackBg").show();
    COMMON.top.rapidSiteStyleChangeNum = 0;
};

// 模板确定选择
VISUALEDIT.newRapidSiteCopy = function () {
    if (COMMON.top.rapidSiteStyleChangeNum == 0) {
        return;
    }
    var b = COMMON.top.rapidSiteCloneId;
    var a = COMMON.top._signupDays;
    if (typeof b == "undefined" || b == 0) {
        COMMON.ing("请选择您所需要的初始化样板网站！", true);
        return;
    }

    VISUALEDIT.logDog(100063, 5);
    if (a <= 1 && !VISUALEDIT.getCookieFlag(38)) {
        VISUALEDIT.setCookieFlag(38, true);
        VISUALEDIT.newRapidSiteCloneing(null, b);
    } else {
        if ((a > 1 && a <= 7) || (a <= 1 && VISUALEDIT.getCookieFlag(38))) {
            var d = new Array();
            d.push("<div style='line-height:20px; color:black; text-align:center; padding:10px 0px;'>");
            d.push("使用“极速建站”后，您的网站内容将全部更换为样板网站内容");
            d.push("</div>");
            var c = COMMON.popupBodyWindow({
                title: "极速建站",
                content: d.join(""),
                width: 400,
                height: 40
            });
            COMMON.addPopupBodyWindowBtn(c, {
                id: "save",
                text: "确定",
                extClass: "saveButton",
                click: function () {
                    COMMON.top._changeStyleNum = 0;
                    if (a >= 7 && !confirm("确定复制网站？确定后您的网站数据将被全部删除，不可恢复！")) {
                        return
                    }
                    $("#popupWindow" + c).remove();
                    $("#popupBg" + c).remove();
                    COMMON.enablePopupBodyWindowBtn(c, "save", false);
                    VISUALEDIT.newRapidSiteCloneing(c, b);
                }
            });
            COMMON.addPopupBodyWindowBtn(c, {
                id: "cancel",
                text: "取消",
                click: function () {
                    $("#popupWindow" + c).remove();
                    $("#popupBg" + c).remove();
                    COMMON.top.$("#popupBgTitle" + c).remove();
                }
            })
        } else {
            var d = new Array();
            d.push("<div style='line-height:20px; color:black; text-align:center; padding:10px 0px;'>");
            d.push("使用“极速建站”后，<span class='cloneAll'>您的网站内容（含手机版）将全部更换为样板网站内容</span>");
            d.push("<span class='cloneTemplate' style='display:none;'>您的网站将更换为网站模版，内容不会改变</span>。");
            d.push("<div style='float:left; padding:8px 0 0 17px;'>");
            d.push("<div class='cloneAll' style='color:red;width:300px;'>&nbsp;&nbsp;注意：确定后您的网站数据将被全部删除，不可恢复！</div>");
            d.push("<div class='cloneAll' style='padding-left:12px;'>或者您可以首先&nbsp;<a hidefocus='true' style='color:blue;' target='_blank' href='./index.jsp?openmf=manageSiteBackupRestore'>备份网站</a>&nbsp;以便于恢复。</div>");
            d.push("</div>");
            d.push("</div>");
            var c = COMMON.popupBodyWindow({
                title: "极速建站",
                content: d.join(""),
                width: 450,
                height: 100
            });
            COMMON.addPopupBodyWindowBtn(c, {
                id: "save",
                text: "确定",
                extClass: "saveButton",
                click: function () {
                    COMMON.top._changeStyleNum = 0;
                    if (a >= 7 && !confirm("确定复制网站？确定后您的网站数据将被全部删除，不可恢复！")) {
                        return;
                    }
                    $("#popupWindow" + c).remove();
                    $("#popupBg" + c).remove();
                    COMMON.enablePopupBodyWindowBtn(c, "save", false);
                    VISUALEDIT.newRapidSiteCloneing(c, b);
                }
            });
            COMMON.addPopupBodyWindowBtn(c, {
                id: "cancel",
                text: "取消",
                click: function () {
                    $("#popupWindow" + c).remove();
                    $("#popupBg" + c).remove();
                    COMMON.top.$("#popupBgTitle" + c).remove();
                }
            })
        }
    }
};

VISUALEDIT.logDog = function (b, a) {
    /*conac
  $.ajax({
    type: "GET",
    url: "/ajax/log_h.jsp?cmd=dog&dogId=" + COMMON.encodeUrl(b) + "&dogSrc=" + COMMON.encodeUrl(a)
  })
    */
};

VISUALEDIT.logProf = function (b, a) {
    /*conac
  $.ajax({
    type: "GET",
    url: "/ajax/log_h.jsp?cmd=prof&profId=" + COMMON.encodeUrl(b) + "&profVal=" + Fai.encodeUrl(a)
  })
    */
};

// 退出按钮
VISUALEDIT.logout = function (a) {
    COMMON.ing("正在退出系统...", false);
    $.ajax({
        type: "post",
        url: "ajax/login_h.jsp?cmd=logout",
        error: function () {
            COMMON.ing("系统繁忙，请稍后重试。", false);
        },
        success: function (b) {
            //COMMON.successHandle(b, "", "系统繁忙，请稍后重试。", a, 1, 1);
        }
    })
};

//网站版式设计面板打开
VISUALEDIT.pageLayoutTabClick = function (b, c) {
    if (c == undefined) {
        c = function () { };
    }
    VISUALEDIT.stylePanesShow(true);
    COMMON.top.$("#pageLayout").show();
    COMMON.top.$("#pageLayoutTab").addClass("current");
    if (!COMMON.top.$("#pageLayoutFrame").attr("src")) {
        VISUALEDIT.styleDesignLoading("pageLayout", "pageLayoutFrame");
        COMMON.top.$("#pageLayoutFrame").attr("src", base + appBase + "/visual/v_channel_change.do?ram=" + Math.random() + "&curveChannelId=" + curveChannelId + "&curveChannelPath=" + curveChannelPath + "&isIndex=" + isIndex);
        COMMON.top.$("#pageLayoutFrame").load(function () {
            var d = COMMON.top.$("#pageLayoutFrame")[0].contentWindow.document.getElementById(b);
            if (d) {
                $(d).click();
                c();
            }
        })
    } else {
        //COMMON.top.$("#pageLayoutFrame")[0].contentWindow.refreshAllLayout();
        var a = COMMON.top.$("#pageLayoutFrame")[0].contentWindow.document.getElementById(b);
        if (a) {
            $(a).click();
            c();
        }
    }
};

// 弹出dialogwindow，站点设置面板打开
VISUALEDIT.webSettingTabClick = function (b, c) {
    var tempframeSrcUrl = base + appBase + "/site_config/v_base_edit.do?ram=" + Math.random();
    VISUALEDIT.popupWindow({ title: '编辑留言', frameSrcUrl: tempframeSrcUrl, width: 1024, height: 340 });
};

VISUALEDIT.isLayoutHidden = function (b) {
    var c = false;
    for (var a = 0; a < COMMON.top._displayLayoutList.length; ++a) {
        if (b == COMMON.top._displayLayoutList[a]) {
            c = true;
            if (b == 1) {
                if (!COMMON.top.$("#containerFormsLeft").is(":visible")) {
                    c = false;
                }
            } else {
                if (b == 2) {
                    if (!COMMON.top.$("#centerTopForms").is(":visible")) {
                        c = false;
                    }
                } else {
                    if (b == 3) {
                        if (!COMMON.top.$("#containerFormsRight").is(":visible")) {
                            c = false;
                        }
                    } else {
                        if (b == 4) {
                            if (!COMMON.top.$("#middleLeftForms").is(":visible")) {
                                c = false;
                            }
                        } else {
                            if (b == 5) {
                                if (!COMMON.top.$("#middleRightForms").is(":visible")) {
                                    c = false;
                                }
                            } else {
                                if (b == 6) {
                                    if (!COMMON.top.$("#centerBottomForms").is(":visible")) {
                                        c = false;
                                    }
                                } else {
                                    if (b == 7) {
                                        if (!COMMON.top.$("#topForms").is(":visible")) {
                                            c = false;
                                        }
                                    } else {
                                        if (b == 8) {
                                            if (!COMMON.top.$("#bottomForms").is(":visible")) {
                                                c = false;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            break;
        }
    }
    return !c;
};

VISUALEDIT.hideOnlineHelp = function () {
    var a = parseInt($("#choiceService").attr("_mouseIn"));
    if (a == 0) {
        $(".serviceList").hide();
        $("#choiceService").removeClass("choiceServiceInfo-hover");
    }
};

VISUALEDIT.newRapidSiteInit = function () {
    $("#newRapidSitePreview").remove();
    var a = [];
    a.push('<div id="newRapidSitePreview">');
    a.push('<div id="newRapidSiteBigImg"><a hidefocus="true" href="javascript:;" id="newRapidSiteBigImgClose" onclick="VISUALEDIT.newRapidSiteBigImgRemove();return false;"></a></div>');
    a.push("</div>");
    COMMON.top.$("body").append(a.join(""));
};
VISUALEDIT.triggerGobalEvent = function (a, b) {
    top.$(top.document).trigger(a, b);
};
VISUALEDIT.bindGobalEvent = function (a, b) {
    top.$(top.document).on(a, b);
};

VISUALEDIT.newRapidSiteBigImgRemove = function () {
    COMMON.top.$("#newRapidSiteBigImg").hide();
};

VISUALEDIT.showTopManageFrame = function (url) {
    COMMON.top.location.href = url;
};