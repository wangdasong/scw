angular.module('controller.webpage.container.widget.tree.view', [])
    .directive('widgetTreeView', ['DataService', 'APP_CONFIG', function (DataService) {
        return {
            restrict: 'EA',
            templateUrl: '/app/controller/widget/treeview/widget.tree.view.tpl.html',
            replace: false,
            scope: {
            },
            controller : function ($scope, $element, $attrs) {
            	$scope.clearData = function (){
				    $('#text'+$attrs.id).val("");
				    $('#hid'+$attrs.id).val("");
            	}
            },
            link: function (scope, element, attrs) {
            	var currWidgetId = attrs.id;
            	$("div.dropdown-menu").on("click", function(e) {
                    e.stopPropagation();
                });
            	var replaceQueryCondition = function(queryCondition){
					var r = /\[(.+?)\]/g;
					var m = queryCondition.match(r);
					while (m){
						var currQueryWidgetId = m[0].substring(1);
						currQueryWidgetId = currQueryWidgetId.substring(0, currQueryWidgetId.length -1);
						var replaceValue = null;
						if($("#input" + currQueryWidgetId ) && typeof($("#input" + currQueryWidgetId ).val())!="undefined"){
							replaceValue = $("#input" + currQueryWidgetId ).val();
						}else if($("#select" + currQueryWidgetId ) && typeof($("#select" + currQueryWidgetId ).val())!="undefined"){
							replaceValue = $("#select" + currQueryWidgetId ).val();
						}
						if(replaceValue != null){
							queryCondition = queryCondition.replace(r, "'" + replaceValue + "'");
						}
						m = queryCondition.match(r);
					}
					return eval("(" + queryCondition + ")");
            	}
            	DataService.getWidgetDetailById(attrs.id).then(function (response) {
            		var data = response.plain();
            		scope.attConfigs = data.attConfigs;
            		scope.elements = data.elements;
            		scope.id = currWidgetId;
            		scope.initvalue = attrs.initvalue;
        			scope.queryCondition = "non";
        			scope.multiselect = false;
            		for(index1 in data.attConfigs){
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
            				scope.multiselect = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "height"){
            				scope.height = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "type"){
            				scope.type = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "queryCondition"){
            				if(currAttConfig.attValue.indexOf("{") > -1){
            					scope.queryCondition = currAttConfig.attValue;
            				}else{
                				scope.queryCondition = "{id:'"+ queryCondition +"'}";
            				}
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
	    			　　　　　　parent_id = options.additionalParameters['id']
	    				
	    			　　　　}
	    			　　}	    			
    			　　　　if(parent_id !== null) {//根据父节点id，请求子节点
    						DataService.findTreeDataList(scope.serviceName, parent_id, replaceQueryCondition(scope.queryCondition)).then(function (response){
    							var parentNode = response.plain();
    							var treeList = parentNode.additionalParameters.children;
    							callback({ data: treeList})
    						});
    			　　　　}
    			　　};
    				var reflushInput = function(){
    					var tagsDiv = $('#tags'+currWidgetId);
    					tagsDiv.html("");
    				    $('.hid'+currWidgetId).val("");
    					var items = $('#tree'+currWidgetId).tree('selectedItems' );
    				    for (var i in items) if (items.hasOwnProperty(i)) {
    				       var item = items[i];
    				       tagsDiv.append('<span class="tag">' + item.name + '<button type="button" class="close">×</button></span>');
    				       tagsDiv.append('<input type="hidden" class="hid' + currWidgetId + '" name="' + scope.name + '" value="' + item.additionalParameters['id' ] + '"/>');
    				    }
    				}
    				setTimeout(function(){
    					DataService.findTreeDataList(scope.serviceName, scope.parentId, replaceQueryCondition(scope.queryCondition)).then(function (response){
    						var parentNode = response.plain();
    						var treeList = parentNode.additionalParameters.children;
    	    				var treeDataSource = new DataSourceTree({data: treeList});
    	            		$('#tree'+currWidgetId).ace_tree({
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
    				},10);
					//定义重新加载方法，将初始值赋给控件
            		scope.$on("widget.reload.initvalue",function(e, data){
                		doInitvalue(attrs.initvalue);
                		scope.$apply();
            		});
            		var doInitvalue = function(initvalue){
            			if(initvalue == null || initvalue == ""){
            				return;
            			}
    					DataService.findTreeDataList(scope.serviceName, initvalue, replaceQueryCondition(scope.queryCondition)).then(function (response){
    						var parentNode = response.plain();
        				    $('#text'+currWidgetId).val(parentNode.name);
        				    $('#hid'+currWidgetId).val(scope.initvalue);
    					});
            		}
            		doInitvalue(attrs.initvalue);
            	});
            }
        };
    }])
;

