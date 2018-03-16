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
	    },
        getDataFromSample: function (json) {
            /**
             * 使用MyPromise模拟Promise基本功能：
             * MyPromise新建就立即执行其参数fn，这点比较重要
             * fn里面必须调用状态函数resolve或者reject之一
             * 每次.then接受一个处理MyPromise当前状态的回调函数，包括resolve和reject（都是异步执行）
             * 回调函数里面默认或者显式返回一个新的MyPromise，之后的then中的回调是处理新的MyPromise的状态
             * 每次resolve或者reject执行就形成了一个新的MyPromise（并立即执行），后续的then会处理其状态，这样就保证默认的状态不会改变
             *
             * 使用MyPromise.prototype.events保存时间，其实then链是最先执行的
             * 每次resolve或者reject都会使得events中的第一个回调出队列
             *
             * @param fun
             * @constructor
             */
            function MyPromise(fun){
                //用于生成MyPromise的id，其实在then执行的时候，都是利用同一个MyPromise将回调保存在events
                this.id = ++MyPromise.prototype.counts;
                var that = this;
                var resolve = function(value){
                    var events = MyPromise.prototype.events;
                    if(events.length>0){
                        console.log("call resolve Promise"+that.id);
                        var func = events.shift().res;//取出events队列头中的回调
                        //异步执行，实际上是生成了新的MyPromise
                        setTimeout(function(){
                            func(value)
                        },0);
                    }
                };
                var reject = function(value){
                    var events = MyPromise.prototype.events;
                    if(events.length>0){
                        console.log("call reject Promise"+that.id);
                        var func = events.shift().rej;//取出events队列头中的回调
                        //异步执行，实际上是生成了新的MyPromise
                        setTimeout(function(){func(value)},0);
                    }
                };
                //立即执行
                fun(resolve,reject);

            }


            MyPromise.prototype.counts = 0;
            MyPromise.prototype.events = [];//回调队列
            /**
             * then方法用于保存回调
             * @param res
             * @param rej
             * @returns {MyPromise}
             */
            MyPromise.prototype.then = function(res, rej){
                var events = MyPromise.prototype.events;
                //默认的状态处理，所以可以不断的调用.then并生成新的MyPromise
                var _res = function(value){return new MyPromise(function(res,rej){res(value)});};
                var _rej = function(value){return new MyPromise(function(res,rej){rej(value)});};
                if(res){
                    _res = function(value){
                        var result = res(value);
                        if(result instanceof MyPromise)return result;
                        return new MyPromise(function(res,rej){res(value)});
                    };
                }
                if(rej){
                    _rej = function(value){
                        var result = rej(value);
                        if(result instanceof MyPromise)return result;
                        return new MyPromise(function(res,rej){rej(value)});
                    };
                }

                events.push({res:_res,rej:_rej});
                console.log("call .then, Events Counts"+events.length);
                return this;
            };

            return new MyPromise(function(resolve,reject){
                setTimeout(function(){
                    if(json=="6"){
                        reject(("error from 3"));
                    }else{
                        resolve(json);
                    }
                },100);
            });
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
    .factory('DataService', ['Restangular','Session', 'URL_CONFIG', '$cacheFactory',
        function (Restangular, Session, URL_CONFIG, $cacheFactory) {

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
                    var widgetIdList = widgetId.split("_");
                    var widgetSample = null;
                    //当前控件为未保存控件
                    if(widgetIdList[0].substr(0,1) == "@"){
                        //模板控件上的
                        if(widgetIdList.length <= 1){
                            widgetSample = Widget.getWidgetByType(widgetIdList[0], null, null);
                        }else{
                            //已经实例化的未保存控件
                            var windgetObject = Session.getWidgetObjectById(widgetId);
                            widgetSample = Widget.getWidgetSample("@" + windgetObject.type, windgetObject);
                        }
                        return URL_CONFIG.getDataFromSample(widgetSample);
                    }
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