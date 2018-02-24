angular.module('service.data', ['ngResource', 'restangular'])
	.constant('URL_CONFIG', {
	    getRootUrl: function () {
	        return "/";
	    },
	    getOrigin: function () {
	        return window.document.location.origin;
	    },
	    getDataBaseUrl: function () {
	        return this.getRootUrl() + 'data/api/';
	    },
	    getRestBaseUrl: function () {
	        return this.getRootUrl() + 'rest/api/';
	    },
	    getFuncBaseUrl: function () {
	        return this.getRootUrl() + 'func/api/';
	    },
        getApiUrl: function (apiName) {
            return this.getRootUrl() + apiName + '/';
        },
        getApiWebeditorUrl: function (apiName) {
            return 'api-webeditor/api/' + apiName;
        },
        getApiAuthUrl: function () {
            return this.getRootUrl() + 'api-auth/uaa/';
        },

	    getPreBaseUrl: function (url) {
    		return COMMON.getProviderCode() + "/" + url;
	    }
	})
	.config(['URL_CONFIG', 'RestangularProvider',
        function (URL_CONFIG, RestangularProvider) {
            RestangularProvider.setBaseUrl(URL_CONFIG.getRootUrl());
        }])
        
    .run(['Restangular', 'DialogService', 'LoadingService', '$rootScope',
        function (Restangular, DialogService, LoadingService, $rootScope) {
            Restangular
                .setFullRequestInterceptor(function (element, operation, what, url, headers, params) {
                	if(what != "dataSrcList"){
                		//如果是表格的刷新的话
                    	if(params && params.pageSize){
                    		var tableDiv = $("#gbox_table" + params.tableId);
                    		var X = tableDiv.offset().top;
                    		var Y = tableDiv.offset().left;
                    		var tableWidth = tableDiv.width();
                    		var tableHeight = tableDiv.height();
                            LoadingService.show(X, Y, tableWidth, tableHeight);
                    	}else{
                            LoadingService.show();
                    	}
                	}
                    return {
                        headers: headers,
                        params: _.extend(params, {
                            _t: new Date().getTime()
                        }),
                        element: element
                    };
                })
                .setResponseExtractor(function (resData, operation, route, fetchUrl, response, deferred) {
                    $rootScope.$broadcast('request.trigger');
                    if (typeof resData.status !== 'undefined'
                        && typeof resData.status.code !== 'undefined') {
                        if (resData.status.code === 401
                            && fetchUrl.indexOf('/base/login') === -1) {
                            window.location.href = '/views/login.html';
                        } else if (resData.status.code === 300) {
                        	window.location.href = '/views/login.html';
                        } else if (resData.status.code === 404) {
                            DialogService.alert(['您没有访问该功能的权限！']);
                        }
                    }
                    LoadingService.hide();
                    return resData;
                })
                .setErrorInterceptor(function (response, deferred, responseHandler) {
                    if (response.status !== 200) {
                        DialogService.dialog({
                            title: response.status + ' ' + response.statusText + '<br><h5>' + response.config.url + '</h5>',
                            message: response.data,
                            closeButton: true,
                            buttons: {
                                ok: {
                                    label: '<i class="ace-icon fa fa-check"></i> OK',
                                    className: 'btn-xs btn-success'
                                }
                            }
                        });
                        //LoadingServiceProvider.hide();
                        return false; // error handled
                    }

                    return true; // error not handled
                });
        }])
    .factory('DataService', ['Restangular', 'URL_CONFIG', '$cacheFactory',
        function (Restangular, URL_CONFIG, $cacheFactory) {

            __GLOBE.BASE_PATH = URL_CONFIG.getRootUrl();
            __GLOBE.ORIGIN = URL_CONFIG.getOrigin();

            // init caches
            $cacheFactory('pageContainers');
            $cacheFactory('subContainers');

            return {
                // deprecated replaced by getRestBaseUrl
                getBaseUrl: function () {
                    return URL_CONFIG.getRestBaseUrl();
                },
                getRestBaseUrl: function () {
                    return URL_CONFIG.getRestBaseUrl();
                },
                getFuncBaseUrl: function () {
                    return URL_CONFIG.getFuncBaseUrl();
                },
                getRootUrl: function () {
                    return URL_CONFIG.getRootUrl();
                },
                getPageContainers: function(pageId){
                	var resultData = Restangular.service(URL_CONFIG.getApiWebeditorUrl("pageContainers")).one(pageId).get();
                	return resultData;
                },
                getSubContainers: function(containerId){
                	var resultData = Restangular.service(URL_CONFIG.getApiWebeditorUrl("subContainers")).one(containerId).get();
                	return resultData;
                },
                getMenuPath: function(elementId){
                	if(elementId == null){
                		return;
                	}
                	var resultData = Restangular.service(URL_CONFIG.getApiWebeditorUrl("menuPath")).one(elementId).get();
                	return resultData;
                },
                getWidgetDetailById: function(widgetId){
                	var resultData = Restangular.service(URL_CONFIG.getApiWebeditorUrl("widgetDetail")).one(widgetId).get();
                	return resultData;
                },
                getAttConfigsByBelongId: function(belongId){
                	var resultData = Restangular.service(URL_CONFIG.getApiWebeditorUrl("attConfigs")).one(belongId).get();
                	return resultData;
                },
                findDataSrcList: function(serviceName, queryCondition){
                    return Restangular.service(URL_CONFIG.getPreBaseUrl("common/dataSrcList")).one(serviceName).post('', {}, {json:JSON.stringify(queryCondition)}, {});
                },
                findTreeDataList: function(serviceName, parentId, queryCondition){
                    return Restangular.service(URL_CONFIG.getPreBaseUrl("common/treeDataList")).one(serviceName).one(parentId).post('', {}, {json:JSON.stringify(queryCondition)}, {});
                },
                saveData: function(url, object){
                	var urlList = (URL_CONFIG.getPreBaseUrl(url)).split("/");
                	if(urlList == null || urlList.length < 2){
                		return null;
                	}
                    if(urlList.length == 2){
                        return Restangular.service(urlList[0]).one(urlList[1]).post('', {}, object, {});
                    }
                    if(urlList.length == 3){
                        return Restangular.service(urlList[0]).one(urlList[1]).one(urlList[2]).post('', {}, object, {});
                    }
                    if(urlList.length == 4){
                        return Restangular.service(urlList[0]).one(urlList[1]).one(urlList[2]).one(urlList[3]).post('', {}, object, {});
                    }
                    if(urlList.length == 5){
                        return Restangular.service(urlList[0]).one(urlList[1]).one(urlList[2]).one(urlList[3]).one(urlList[4]).post('', {}, object, {});
                    }else{
                        return Restangular.service(url).post('', {}, object, {});
                    }
                },
                findPageData: function(url, queryCondition){
                	var urlList = (URL_CONFIG.getPreBaseUrl(url)).split("/");
                	if(urlList == null || urlList.length < 2){
                		return null;
                	}
                	if(urlList.length == 2){
                        return Restangular.service(urlList[0]).one(urlList[1]).post('', {}, queryCondition, {});
                	}
                	if(urlList.length == 3){
                        return Restangular.service(urlList[0]).one(urlList[1]).one(urlList[2]).post('', {}, queryCondition, {});
                	}
                    if(urlList.length == 4){
                        return Restangular.service(urlList[0]).one(urlList[1]).one(urlList[2]).one(urlList[3]).post('', {}, queryCondition, {});
                    }
                    if(urlList.length == 5){
                        return Restangular.service(urlList[0]).one(urlList[1]).one(urlList[2]).one(urlList[3]).one(urlList[4]).post('', {}, queryCondition, {});
                    }else{
                		return Restangular.service(url).post('', {}, queryCondition, {});
                	}
                },
                getUsername : function () {
                    var results = "用户";
                    var url = "/api-auth/uaa/user/detailInfo";
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: null,
                        dataType: 'text',
                        async: false,
                        success: function(data){
                            if(data.code == null & typeof(data.code) == "undefined"){
                                if(data){
                                    results = $.trim(JSON.parse(data).username)
                                    return results;
                                }
                            }
                        }
                    });
                    return results;
                }
            };
        }]);