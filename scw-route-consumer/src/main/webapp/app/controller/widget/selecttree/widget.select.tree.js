angular.module('controller.webpage.container.widget.select.tree', [])
    .directive('widgetSelectTree', ['DataService', 'Session', 'APP_CONFIG', function (DataService, Session) {

        var reloadScope = function (scope, element, attrs, data) {
            var currWidgetId = attrs.id;
            scope.attConfigs = data.attConfigs;
            scope.template = data.tmpFlg;
            scope.containerId =  data.containerId;
            scope.elements = data.elements;
            scope.id = currWidgetId;
            scope.initvalue = attrs.initvalue;
            scope.multiselect = false;
            scope.queryCondition = "non";
            for(var index1 in data.attConfigs){
                var currAttConfig = data.attConfigs[index1];
                var currAttConfigType = currAttConfig.type;
                if(currAttConfigType == "label"){
                    scope.label = currAttConfig.attValue;
                }
                if(currAttConfigType == "name"){
                    scope.name = currAttConfig.attValue;
                }
                if(currAttConfigType == "width"){
                    scope.width = currAttConfig.attValue;
                }
                if(currAttConfigType == "multiselect"){
                	if(currAttConfig.attValue == "true"){
                        scope.multiselect = true;
                    }else{
                        scope.multiselect = false;
                    }
                }
                if(currAttConfigType == "height"){
                    scope.height = currAttConfig.attValue;
                }
                if(currAttConfigType == "queryCondition"){
                    var queryCondition = currAttConfig.attValue;
                    scope.queryCondition = eval("("+ queryCondition +")");
                }
                if(currAttConfigType == "type"){
                    scope.type = currAttConfig.attValue;
                }
                if(currAttConfigType == "serviceName"){
                    scope.serviceName = currAttConfig.attValue;
                }
                if(currAttConfigType == "parentId"){
                    scope.parentId = currAttConfig.attValue
                }
            }
            var DataSourceTree = function(options) {
                this._data 	= options.data;
                this._delay = options.delay;
            }
            DataSourceTree.prototype.data = function(options, callback) {
                var parent_id = null
                if( !('name' in options || 'type' in options) ){
                    parent_id = scope.parentId;//load first level data
                } else if('type' in options && options['type'] == 'folder') {//it has children
                    if('additionalParameters' in options && 'children' in options.additionalParameters){
                        parent_id = options.additionalParameters['id'];
                    }
                }
                if(parent_id !== null) {//根据父节点id，请求子节点
                    DataService.findTreeDataList(scope.serviceName, parent_id, scope.queryCondition).then(function (response){
                        var parentNode = response.plain();
                        var treeList = parentNode.additionalParameters.children;
                        callback({ data: treeList})
                    });
                }
            };
            var reflushInput = function(){
                element.find(".text").val("");
                element.find("input[type='hidden']").val("");
                var items = element.find(".tree").tree('selectedItems' );
                var ids = "";
                var output = "";
                for (var i in items) if (items.hasOwnProperty(i)) {
                    var item = items[i];
                    ids += item.additionalParameters['id' ];
                    output += item.name;
                }
                element.find(".text").val(output);
                element.find("input[type='hidden']").val(ids);
            }
            if(scope.serviceName != null
				&& scope.serviceName != ""
				&& scope.parentId != null
                && scope.parentId != ""){
                DataService.findTreeDataList(scope.serviceName, scope.parentId, scope.queryCondition).then(function (response){
                    var parentNode = response.plain();
                    var treeList = parentNode.additionalParameters.children;
                    var treeDataSource = new DataSourceTree({data: treeList});
                   /* element.find(".tree").empty();
                    element.find(".tree").removeData("fu.tree");
                    element.find(".tree").unbind('click.fu.tree');*/
                    element.find(".tree").ace_tree({
                        dataSource: treeDataSource,
                        multiSelect:scope.multiselect,
                        folderSelect:true,
                        cacheItems: true,
                        loadingHTML:'<div class="tree-loading"><i class="icon-refresh icon-spin blue"></i></div>',
                        'open-icon' : 'icon-minus',
                        'close-icon' : 'icon-plus',
                        'selectable' : true,
                        'selected-icon' : 'icon-ok',
                        'unselected-icon' : 'icon-remove'
                    }).on('selected.fu.tree', function(e) {
                        reflushInput();
                    }).on('loaded.fu.tree', function(e) {
                        reflushInput();
                    }).on('deselected.fu.tree', function(e) {
                        reflushInput();
                    }).on('refreshedFolder.fu.tree', function() {
                        reflushInput();
                    }).on('opened.fu.tree', function() {
                        reflushInput();
                    }).on('closed.fu.tree', function() {
                        reflushInput();
                    });
                });
			}
            //定义重新加载方法，将初始值赋给控件
            scope.$on("widget.reload.initvalue",function(e, data){
                doInitvalue(attrs.initvalue);
                scope.$apply();
            });
            var doInitvalue = function(initvalue){
                if(initvalue == null || initvalue == ""){
                    return;
                }
                DataService.findTreeDataList(scope.serviceName, initvalue, scope.queryCondition).then(function (response){
                    var parentNode = response.plain();
                    element.find(".text").val(parentNode.name);
                    element.find("input[type='hidden']").val(scope.initvalue);
                });
            }
            doInitvalue(attrs.initvalue);
            scope.$apply();
        };
        return {
            restrict: 'EA',
            templateUrl: '/app/controller/widget/selecttree/widget.select.tree.tpl.html',
            replace: false,
            scope: {
            },
            controller : function ($scope, $element, $attrs) {
            	$scope.clearData = function (){
                    $element.find(".text").val("");
                    $element.find("input[type='hidden']").val("");
            	}
            },
            link: function (scope, element, attrs) {
            	var currWidgetId = attrs.id;
            	$("div.dropdown-menu").on("click", function(e) {
                    e.stopPropagation();
                });
            	DataService.getWidgetDetailById(currWidgetId).then(function (response) {
            		var data = response.plain();
                    reloadScope(scope, element, attrs, data);
            	});
                scope.updateWidgetAttData = function (widgetId, attCode, attValue) {
                    var data = Session.updateWidgetAttData(widgetId, attCode, attValue);
                    reloadScope(scope, element, attrs, data);
                };
                scope.updateWidgetData = function (widgetId, name, value) {
                    var data = Session.updateWidgetData(widgetId, name, value);
                    reloadScope(scope, element, attrs, data);
                };
                scope.saveWidgetInfo = function (widgetId) {
                    DataService.saveWidgetInfo(widgetId).then(function (response) {
                        var data = response.plain();
                        reloadScope(scope, element, attrs, data);
                    });
                };
            }
        };
    }])
;

