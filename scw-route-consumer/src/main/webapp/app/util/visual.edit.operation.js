/**
 * 可视化操作引擎
 */

/*
 * 取得地址传参
 *
 * 参数：无,只需要取得当前所引用的script的文件的名称
 * 
 */
// 将各标记的模块进行初始化

$(function () {


    // endregion 1
	
    var contents= $("[conacEditFlag]");
    $.each(contents,function(index,element){
    	var randomId= Math.round(Math.random() * 1000000).toString();
    	$(element).attr("randomId", randomId);
    });
    
        // region:1. 首页背景
    var bannerItems = $("[conacEditFlag='conacModuleBannerContentElement']");
    $.each(bannerItems, function (index, element) {
        VISUALEDIT.initBannerContentManage(element);
    });
    
    // 头部横幅
   	var banner =$("[conacEditFlag='conacModuleBannerChannelElement']");
    $.each(banner, function (index, element) {
        VISUALEDIT.initBannerChannelManage(element);
    });
    
    // region: 2.nonBottomChannelElment 为某个channel树中，非叶子节点的channel。它有下一级child channel，自身没有content，它的编辑操作针对其channel本身，它的添加操作针对其child channel。
    
    var elementEditElements = $("[canEditFlag='elementEditElement']");
    $.each(elementEditElements, function (index, element) {
        VISUALEDIT.initElementEditElement(element);
    });   
    var widgetEditElements = $("[canEditFlag='widgetEditElement']");
    $.each(widgetEditElements, function (index, element) {
        VISUALEDIT.initWidgetEditElement(element);
    });
    var widgetEditElementPanels = $("[canEditFlag='widgetEditElementPanel']");
    $.each(widgetEditElementPanels, function (index, element) {
        VISUALEDIT.initWidgetEditElement(element);
    });
    var containerEditElements = $("[canEditFlag='containerEditElement']");
    $.each(containerEditElements, function (index, element) {
        VISUALEDIT.initContainerEditElement(element);
    });
    var elementContainerEditElements = $("[canEditFlag='elementContainerEditElement']");
    $.each(elementContainerEditElements, function (index, element) {
        VISUALEDIT.initContainerEditElement(element);
    });
    
    var containerAddElements = $("[canEditFlag='containerAddElement']");
    $.each(containerAddElements, function (index, element) {
        VISUALEDIT.initContainerAddElement(element);
    });
    var elementContainerAddElements = $("[canEditFlag='elementContainerAddElement']");
    $.each(elementContainerAddElements, function (index, element) {
        VISUALEDIT.initContainerAddElement(element);
    });
    
    // endregion 2

    // region: 3. bottomChannelElment 为某个channel树中，最底层的channel，它的没有子channel，自身包含content. 它的编辑操作针对其channel本身，它的添加操作针对其content
    
    var bottomChannelModules = $("[conacEditFlag='conacModuleBottomChannelElement']");
    $.each(bottomChannelModules, function (index, element) {

        VISUALEDIT.initBottomChannel(element);

        //VISUALEDIT.initContentsWithInElementObject(element);
    });
    
    var singltonChannelModules = $("[conacEditFlag='conacModuleSingltonChannelElement']");
    $.each(singltonChannelModules, function (index, element) {
        VISUALEDIT.initSingltonChannel(element);

        //VISUALEDIT.initContentsWithInElementObject(element);
    });
    // endregion 3

    // region: 4.mixedChannelElement 焦点图 新闻点击排行等"栏目"是从不同的栏目中抽取的内容组成，也只有简单的2层根叶结构: "栏目"-"内容"。它没有编辑及添加操作，因为无法确定channel ID
    
    var mixedChannelElement = $("[conacEditFlag='conacModuleMixedChannelElement']");
    $.each(mixedChannelElement, function (index, element) {
        // 此"栏目"在后台定义中无对应的栏目，无需处理，只需处理"栏目"中单条的内容 

        // 处理栏目的内容
        //VISUALEDIT.initContentsWithInElementObject(element);
    });
    // endregion 4

    // region: 5. Other Element其他元素包括Topic/GuestBook/VoteTopic/Comment/FriendLink等"栏目"，也只有简单的2层根叶结构:"栏目"-"内容"。它的编辑操作针对其本身，它的添加操作针对其content
    
    var otherModules = $("[conacEditFlag='conacModuleOtherElement']");
    $.each(otherModules, function (index, element) {

        // 处理"栏目"头
        VISUALEDIT.initOtherModule(element);

        // 处理"栏目"的内容
        //VISUALEDIT.initContentsWithInElementObject(element);
    });
    
    VISUALEDIT.initContentsWithInElementObject();
    // endregion 5
});

