
angular.module('shared.session', [])

    .provider('Session', function () {
        this.pageId = null;
        this.pageName = null;
        this.widgetId = null;
        this.menuElementId = null;
        this.widgetArray = new Array();
/*
        this.domainName = null;
        this.domainId = null;
        this.query = null;
        this.page = null;
        this.parent = {};
        this.property = null;
        this.propId = null;
        this.domainDesc = null;
*/
        this.$get = function () {
            return this;
        };

        this.setPageId = function (pageId) {
            this.pageId = pageId;
        };
        this.setWidgetId = function (widgetId) {
            this.widgetId = widgetId;
        };
        this.setMenuElementId = function (elementId) {
            this.menuElementId = elementId;
        };
        this.addWidget = function (newWidget){
            this.widgetArray.push(newWidget);
        };
        this.getWidgetObjectById = function (widgetId) {
            for(var i = 0; i < this.widgetArray.length; i ++){
                if(this.widgetArray[i].id == widgetId){
                    return this.widgetArray[i];
                }
            }
            return null;
        };
        this.updateWidgetAttData = function(widgetId, attCode, attValue){
            var currWidget = this.getWidgetObjectById(widgetId);
            for(var i = 0; i < currWidget.attConfigs.length; i ++){
                var currAttConfig =  currWidget.attConfigs[i];
                if(currAttConfig.code == attCode){
                    currAttConfig.attValue = attValue
                }
            }
            return currWidget;
        };
        this.updateWidgetData = function(widgetId, name, value){
            var currWidget = this.getWidgetObjectById(widgetId);
            currWidget[name] = value;
            return currWidget;
        };
        this.updateElementAttData = function(widgetId, elementId, attCode, attValue){
            var currWidget = this.getWidgetObjectById(widgetId);
            for(var i = 0; i < currWidget.elements.length; i ++ ){
                var currElement = currWidget.elements[i];
                if(currElement.id == elementId){
                    for(var j = 0; j < currElement.attConfigs.length; j ++){
                        var currAttConfig =  currElement.attConfigs[j];
                        if(currAttConfig.code == attCode){
                            currAttConfig.attValue = attValue
                        }
                    }
                }
            }
            return currWidget;
        };
        this.removeWidget = function (widgetId) {
            for(var i = 0; i < this.widgetArray.length; i ++){
                if(this.widgetArray[i].id == widgetId){
                    this.widgetArray.splice(i,1);
                    return;
                }
            }
            return;
        };
/*
        this.setProp = function (property, propId) {
            this.property = property;
            this.propId = propId;
        };
        this.setDomainName = function (domainName) {
            this.domainName = domainName;
        };

        this.setDomainDesc = function (domainDesc) {
            this.domainDesc = domainDesc;
        };

        this.setDomainId = function (domainId) {
            this.domainId = domainId;
        };

        this.setParent = function (parent) {
            this.parent = parent;
        };

        this.saveQueryParams = function (query, page) {
            this.query = query;
            this.page = page;
        };
*/
        this.reset = function () {
            this.pageId = null;
            this.pageName = null;
            this.widgetId = null;
/*
            this.domainName = null;
            this.domainId = null;
            this.query = null;
            this.parent = {};

            this.property = null;
            this.propId = null;

            this.domainDesc = null;
*/
        }
    })

    .run(function ($rootScope, DataService) {
    	/*
        DataService.getLoginUser().then(function (response) {
            var rtnData = response.plain();
            if (rtnData.status.code === 200) {
                $rootScope.user = rtnData.data;
            }
        });
        */
    })
;