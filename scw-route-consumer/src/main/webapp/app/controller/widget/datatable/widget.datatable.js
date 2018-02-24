angular.module('controller.webpage.container.widget.datatable', [])
	.directive('widgetDataTable', ['DataService', 'APP_CONFIG', function (DataService, APP_CONFIG) {
	    return {
	        restrict: 'EA',
            templateUrl: '/app/controller/widget/datatable/widget.datatable.tpl.html',
            replace: false,
	        scope: {
	        },
	        link: function (scope, element, attrs) {
	        	 var widgetId = attrs.id;

	        	 scope.id = widgetId;
	        	 scope.pageSort = "";
	        	 scope.pageNumber = "1";
	        	 scope.pageSize = "20";
	        	 
  				var grid_selector = "#table" + widgetId;
  				var pager_selector = "#pager" + widgetId;
  				//#######################################################################################################################################//
  				//                                                       表格基本数据取得                                                                                                                                                                            //
  				//                                                                                                                                       //
  				//#######################################################################################################################################//
  			    
	        	 //取得数据表的基本属性信息
	        	 function getTableAttrConfig(attConfigs){
		        	 var tableConfig = new Object(); 
		        	 tableConfig.canEdit = false;
		        	 tableConfig.canAdd = false;
		        	 tableConfig.canDel = false;
            		 for(index in data.attConfigs){
                		var currAttConfig = attConfigs[index];
            			var currAttConfigType = currAttConfig.type;
            			//表格标题
            			if(currAttConfigType == "label"){
            				tableConfig.label = currAttConfig.attValue;
            			}
            			//每行显示记录数
            			if(currAttConfigType == "rowNum"){
            				tableConfig.rowNum = currAttConfig.attValue;
            			}
            			//是否能多选
            			if(currAttConfigType == "multiselect"){
            				if(currAttConfig.attValue == "true"){
            					tableConfig.multiselect = true;
            				}else{
            					tableConfig.multiselect = false;
            				}
            			}
            			//是否能多选
            			if(currAttConfigType == "onSelectRow"){
            				tableConfig.onSelectRow = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "height"){
            				tableConfig.height = parseInt(currAttConfig.attValue);
            			}
            			//是否选中checkbox才选中行
            			if(currAttConfigType == "multiboxonly"){
            				if(currAttConfig.attValue == "true"){
            					tableConfig.multiboxonly = true;
            				}else{
            					tableConfig.multiboxonly = false;
            				}
            			}
            			//是否显示记录总数
            			if(currAttConfigType == "viewrecords"){
            				if(currAttConfig.attValue == "true"){
            					tableConfig.viewrecords = true;
            				}else{
            					tableConfig.viewrecords = false;
            				}
            			}
            			//编辑行提交链接
            			if(currAttConfigType == "editrowurl"){
            				if(currAttConfig.attValue && currAttConfig.attValue.trim() != ""){
            					tableConfig.canEdit = true;
            				}
            				var urlList = [];
            				if(currAttConfig.attValue){
            					urlList = currAttConfig.attValue.split("?");
            				}
            				if(urlList.length > 0){
                				tableConfig.editrowurl = urlList[0];
            				}
            				if(urlList.length > 1){
            					tableConfig.editrowpara = urlList[1];
            				}else{
                                tableConfig.editrowpara = null;
							}
            			}
            			//编辑行提交链接
            			if(currAttConfigType == "addrowurl"){
            				if(currAttConfig.attValue && currAttConfig.attValue.trim() != ""){
            					tableConfig.canAdd = true;
            				}
            				var urlList = [];
            				if(currAttConfig.attValue){
            					urlList = currAttConfig.attValue.split("?");
            				}
            				if(urlList.length > 0){
                				tableConfig.addrowurl = urlList[0];
            				}
            				if(urlList.length > 1){
            					tableConfig.addrowpara = urlList[1];
            				}
            			}
            			//编辑行提交链接
            			if(currAttConfigType == "delrowurl"){
            				if(currAttConfig.attValue && currAttConfig.attValue.trim() != ""){
            					tableConfig.canDel = true;
            				}
            				var urlList = [];
            				if(currAttConfig.attValue){
            					urlList = currAttConfig.attValue.split("?");
            				}
            				if(urlList.length > 0){
                				tableConfig.delrowurl = urlList[0];
            				}
            				if(urlList.length > 1){
            					tableConfig.delrowpara = urlList[1];
            				}
            			}
            			//是否自动调整列宽度
            			if(currAttConfigType == "shrinkToFit"){
            				var shrinkToFit = true;
            				if(currAttConfig.attValue == "true"){
            					tableConfig.shrinkToFit = true;
            				}else{
            					tableConfig.shrinkToFit = false;
            				}
            			}
            			
            		}
            		 return tableConfig;
	        	 }
	        	 
	        	 var elementAttConfig = new Object();
	        	 var loadElementCount = 0;
	        	 function loadElementAttConfig(elements){
	        		 for(var i = 0; i < elements.length; i ++ ){
	        			 var currElementId = elements[i].id;
	        			 elementAttConfig[currElementId] = new Object();
	        			 DataService.getAttConfigsByBelongId(currElementId).then(function (response){
	        				 var eleAttConfigs = response.plain();
	        				 if(eleAttConfigs != null && eleAttConfigs.length >= 1){
			        			 elementAttConfig[eleAttConfigs[0].belongId] = eleAttConfigs;
	        				 }
		        			 loadElementCount ++;
	        			 });
	        		 }
	        	 }
	        	 function getColNames(elements){
	        		 var colNames = new Array(elements.length);
	        		 var indexs = new Array(elements.length);
	        		 for(var i = 0; i < elements.length; i ++ ){
	        			 var currElement = elements[i];
	        			 var eleAttConfigs = elementAttConfig[currElement.id];
          				 var currEleOrder=9999;
	        			 for(index2 in eleAttConfigs){
             				var currEleAttConfig = eleAttConfigs[index2];
             				var currEleAttConfigType = currEleAttConfig.type;
                 			if(currEleAttConfigType == "order"){
                 				currEleOrder  = parseInt(currEleAttConfig.attValue);
                 			}
                 			if(currEleAttConfigType == "label"){
                 				colNames[i]  = currEleAttConfig.attValue;
                 			}
             			}
	        			indexs[i] = currEleOrder;
	        		 }
	        		 return maopaoSort(indexs, colNames);
	        	 }
	        	 
	        	 
	        	 function maopaoSort(indexs, objects){
	        		 var tempIndex = 0;
	        		 var tempCurrObject={};
	        		 for(var j=0; j<indexs.length; j++){
	        			 for(var k=j+1; k<indexs.length; k++){
	        				 if(indexs[j] > indexs[k]){
	        					 //角标交换
	        					 tempIndex = indexs[j];
	        					 indexs[j] = indexs[k];
	        					 indexs[k] = tempIndex;
	        					 
	        					 //对象交换
	        					 tempCurrObject = objects[j];
	        					 objects[j] = objects[k];
	        					 objects[k] = tempCurrObject;
	        				 }
	        			 }
	        		 }
	        		 return objects;
	        	 }
	        	 

  				//#######################################################################################################################################//
  				//                                                       表格列元素配置取得                                                                                                                                                                         //
  				//                                                                                                                                       //
  				//#######################################################################################################################################//
	        	 //取得表格列配置信息
	        	 function getColModel(elements){
	        		 var currModel = [];
	        		 var indexs = new Array(elements.length);
	        		 var eleIdNameMap = new Array();
	        		 for(var i = 0; i < elements.length; i ++ ){
	        			 var currElement = elements[i];
	        			 var eleAttConfigs = elementAttConfig[currElement.id];
	        			 currModel[i] = new Object();
	        			 currModel[i].name = currElement.name;
	        			 currModel[i].id = currElement.id;
	        			 currModel[i].require = false;
    					 currModel[i].regular = null;
	        			 eleIdNameMap[currElement.id] = currElement.name;
          				 var currEleOrder=999;
	        			 for(index2 in eleAttConfigs){
	        				 var currEleAttConfig = eleAttConfigs[index2];
	        				 var currEleAttConfigType = currEleAttConfig.type;
                 			if(currEleAttConfigType == "order"){
                 				currEleOrder  = parseInt(currEleAttConfig.attValue);
                 			}
	        				 if(currEleAttConfigType == "index"){
	        					 currModel[i].index = currEleAttConfig.attValue;
	        				 }
	        				 if(currEleAttConfigType == "name"){
	        					 currModel[i].name = currEleAttConfig.attValue;
	        					 eleIdNameMap[currElement.id] = currEleAttConfig.attValue;
	        				 }
	        				 if(currEleAttConfigType == "width"){
	        					 currModel[i].width = parseInt(currEleAttConfig.attValue);
	        				 }
	        				 if(currEleAttConfigType == "editable"){
	             				if(currEleAttConfig.attValue == "true"){
	             					currModel[i].editable = true;
	            				}else{
	            					currModel[i].editable = false;
	            				}
	        				 }
	        				 if(currEleAttConfigType == "sortable"){
	             				if(currEleAttConfig.attValue == "true"){
	             					currModel[i].sortable = true;
	            				}else{
	            					currModel[i].sortable = false;
	            				}
	        				 }
	        				 if(currEleAttConfigType == "sorttype"){
	        					 currModel[i].sorttype = currEleAttConfig.attValue;
	        				 }
	        				 if(currEleAttConfigType == "editable"){
	             				if(currEleAttConfig.attValue == "true"){
	             					currModel[i].editable = true;
	            				}else{
	            					currModel[i].editable = false;
	            				}
	        				 }
	        				 if(currEleAttConfigType == "hidden"){
	             				if(currEleAttConfig.attValue == "true"){
	             					currModel[i].hidden = true;
	            				}else{
	            					currModel[i].hidden = false;
	            				}
	        				 }
	             			if(currEleAttConfigType == "message"){
	             				currModel[i].message = currEleAttConfig.attValue;
	            			}
	             			if(currEleAttConfigType == "require" && currEleAttConfig.attValue != null && currEleAttConfig.attValue == "true"){
	             				currModel[i].require = true;
	            			}
	        				 if(currEleAttConfigType == "regular" && currEleAttConfig.attValue != null && currEleAttConfig.attValue.trim() != ""){
	        					 currModel[i].regular = currEleAttConfig.attValue;
	        				 }
	        				 if(currEleAttConfigType == "edittype" && currEleAttConfig.attValue != null && currEleAttConfig.attValue.trim() != ""){
	        					 currModel[i].edittype = currEleAttConfig.attValue;
	        				 }
	        				 if(currEleAttConfigType == "editoptions" && currEleAttConfig.attValue != null && currEleAttConfig.attValue.trim() != ""){
	        					 var currOptions = eval('('+currEleAttConfig.attValue+')');
	        					 if(currOptions.serviceName && currOptions.queryCondition){
	        						 var dataUrlStr = COMMON.getProviderCode() + "/api/dataSrcList/" + currOptions.serviceName;
	        						 dataUrlStr = dataUrlStr + "?json=" + JSON.stringify(currOptions.queryCondition);
	        						 var myBuildSelect = function(data){
	        							 var dataObj = eval("(" + data + ")");
	        							 var reDataStr = "<select>";
	        							 for(var dataIndex = 0; dataIndex < dataObj.length; dataIndex ++){
	        								 reDataStr = reDataStr + "<option value='" + dataObj[dataIndex].value + "'>";
	        								 reDataStr = reDataStr + dataObj[dataIndex].label;
	        								 reDataStr = reDataStr + "</option>";
	        							 }
	        							 reDataStr = reDataStr + "</select>";
	        							 return reDataStr;
	        						 }
	        						 currModel[i].editoptions = {
	        								 dataUrl : dataUrlStr,
	        								 buildSelect : myBuildSelect
	        						 }
	        					 }else{
	        						 currModel[i].editoptions = currOptions;
	        					 }
	        				 }
	        				 if(currEleAttConfigType == "unformat" && currEleAttConfig.attValue != null && currEleAttConfig.attValue.trim() != ""){
	                 			if(currEleAttConfig.attValue == "pickDate"){
	                				datepickers[datepickersIndex] = currModel[i].name;
	                				datepickersIndex ++;
	                			}
	                			if(currEleAttConfig.attValue == "aceSwitch"){
	                				aceswitchs[aceswitchsIndex] = currModel[i].name;
	                				aceswitchsIndex ++;
	                			}
	        					 currModel[i].unformat = eval(currEleAttConfig.attValue);
	        				 }
	        				 if(currEleAttConfigType == "formatter" && currEleAttConfig.attValue != null && currEleAttConfig.attValue.trim() != ""){
        						 if(currModel[i].formatter == null || !(typeof currModel[i].formatter === 'function')){
    	        					 if(currEleAttConfig.attValue == "reRender"){
    	        						 currModel[i].unformat = unRender;
    		        					 currModel[i].formatter = eval(currEleAttConfig.attValue);
    	        					 }else if(currEleAttConfig.attValue == "addDataLink"){
    	        						 currModel[i].unformat = unAddDataLink;
    		        					 currModel[i].formatter = eval(currEleAttConfig.attValue);     
    	        					 }else if(!currModel[i].formatter){
    		        					 currModel[i].formatter = currEleAttConfig.attValue;
    	        					 }
        						 }
	        				 }
	        				 if(currEleAttConfigType == "formatoptions" && currEleAttConfig.attValue != null && currEleAttConfig.attValue.trim() != ""){
	        					 if(eval('('+currEleAttConfig.attValue+')').queryCondition){
	        						var queryCondition = eval('('+currEleAttConfig.attValue+')').queryCondition;
	        						var dataUrl = JSON.stringify(queryCondition)
      								var r = /\[(.+?)\]/g;
      								var m = dataUrl.match(r);
      								if(m){
      									currModel[i].formatter = reRender;
      									currModel[i].unformat = unRender;
      									var formatoptions = eval('('+currEleAttConfig.attValue+')');
      									currModel[i].formatoptions = formatoptions;
      								}else{
			        					 var currOptions = {};
			        					 currOptions = eval('('+currEleAttConfig.attValue+')');
		        						 var serviceName = currOptions.serviceName;	        						 
	
		        						 var dataUrlStr = COMMON.getProviderCode() + "/api/dataSrcList/" + serviceName;
		        						 dataUrlStr = dataUrlStr + "?json=" + JSON.stringify(currOptions.queryCondition);
		        						 var myFormatoptions = {};
		        						 //提交后台请求
		        						 $.ajax({
	        						        type: "POST",
	        						        url: dataUrlStr,
	        						        async: false,
	        						        contentType: "application/json; charset=utf-8",
	        						        dataType: "json",
	        						        success: function (dataObj) {
	        						        	var myFormatoptionsStr = "({value:{";
	        						        	for(var dataIndex = 0; dataIndex < dataObj.length; dataIndex ++){
	        						        		myFormatoptionsStr = myFormatoptionsStr + "'" + dataObj[dataIndex].value + "':'" + dataObj[dataIndex].label + "'";
	        						        		if(dataIndex < dataObj.length -1){
	        						        			myFormatoptionsStr = myFormatoptionsStr + ",";
	        						        		}
	        						        	}
	        						        	myFormatoptionsStr = myFormatoptionsStr + "}})"
	        						        	
	        						        	myFormatoptions = eval(myFormatoptionsStr);
	        						        }
	        						    });
		        						 if(currModel[i].formatter != null && currModel[i].formatter == "select" 
		        							 && (currModel[i].editoptions == null || currModel[i].editoptions == "")){
		        							 currModel[i].editoptions = myFormatoptions;
		        						 }
		        						 currModel[i].formatoptions = myFormatoptions;      									
      								}
	        					 //匹配上中括号里面英文或数字
	        					 }else if(currEleAttConfig.attValue && currEleAttConfig.attValue.match(/^\[[\da-zA-Z]+\]$/)){
	        						 var itemName = currEleAttConfig.attValue.substr(1);
	        						 itemName = itemName.substr(0, itemName.length - 1);
	        						 var formatterFunction = function(cellvalue, options, rowObject){
	        							 return rowObject[itemName];
	        						 }
	        						 currModel[i].formatoptions = formatterFunction;
	        					 }else if(currEleAttConfig.attValue && eval('('+currEleAttConfig.attValue+')')){
	        						 currModel[i].formatoptions = eval('('+currEleAttConfig.attValue+')');
	        					 }
	        				 }
	        			 }
	        			 //数据校验
	        			 if(currModel[i].regular != null || currModel[i].require){
	    					 currModel[i].editrules = {
        						 custom : true,
        						 custom_func : function(value, colname, vl){
        	        				 var colModelRegular = currModel[vl - 1].regular;
        	        				 var colModelRequire = currModel[vl - 1].require;
        	        				 var colModelMessage = currModel[vl - 1].message;        	        				 
        	        				 if(value.trim() == ""){
        	        					 if(colModelRequire){
            								 return [false, "【" + colname + "】是必须输入项！"];
        	        					 }
        	        				 }else{
        	        					 if(colModelRegular != null){
                    						 var r = eval("/" + colModelRegular + "/");
                    						 var m = value.match(r);
                    						 if(m){
                    							 return [true,""];
                    						 }else{
                    							 return [false, "【" + colname + "】" + colModelMessage];
                    						 }
        	        					 }
        	        				 }
    								 return [true,""];
            					 }
        					 }
	        			 }
	        			 indexs[i] = currEleOrder;
	        		 }

	        		 return maopaoSort(indexs, currModel);
	        	 }
	        	 

  				//#######################################################################################################################################//
  				//                                                       根据元素ID构造表格                                                                                                                                                                        //
  				//                                                                                                                                       //
  				//#######################################################################################################################################//
         		 var datepickers = [], aceswitchs = [];
         		 var datepickersIndex = 0, aceswitchsIndex = 0;
	        	 DataService.getWidgetDetailById(widgetId).then(function (response) {
        		 	var data = response.plain();
            		var tableConfig = getTableAttrConfig(data.attConfigs);
            		var colElements = data.elements;
            		//加载元素属性
            		loadElementAttConfig(colElements);
            		//监听是否加载完成
            		var timeCount = 0;
            		var timer = setInterval(function(){
            			//元素属性全部加载完成后渲染表格
            			if(loadElementCount == colElements.length){
            				clearInterval(timer);
            				createGrid();
            				$("#tableDiv" + widgetId).addClass("loaded");
            			}
            			timeCount ++;
                		//加载数据超时(5秒)，直接返回，不进行表格渲染
            			if(timeCount == 50){
            				alert("加载元素属性超时！");
            				clearInterval(timer);
            				return;
            			}
            		},100);
            		var currRowId = null;
            		var createGrid = function(){
                		//取得每个表头标签名称
                		var currColNames = getColNames(colElements);
                		//取得列配置信息
                		var currColModel = getColModel(colElements);
                        var pagingFinished = true;
         				jQuery(grid_selector).jqGrid({
         					//direction: "rtl",
         					datatype: "custom",
         					height: tableConfig.height,
         					shrinkToFit:tableConfig.shrinkToFit,
         					forceFit:true,
         					autoScroll: true,
         					colNames: currColNames,
         					colModel: currColModel,
         					viewrecords : tableConfig.viewrecords,
         					rowNum:tableConfig.rowNum,
         					rowList:[20,50,100],
         					pager : pager_selector,
         					altRows: tableConfig.altRows,
         					//toppager: true,
         					
         					multiselect: tableConfig.multiselect,
         					//multikey: "ctrlKey",
         			        multiboxonly: tableConfig.multiboxonly,
         					loadComplete : function() {
         						var table = this;
         						setTimeout(function(){
         							styleCheckbox(table);
         							updateActionIcons(table);
         							updatePagerIcons(table);
         							enableTooltips(table);
         						}, 0);
         					},
                            gridComplete: function (data) {
                                pagingFinished = true;
                            },
                            jsonReader: {
                                root: 'list',
                                page: 'pageNumber',
                                total: 'pageTotal',
                                records: 'totalCount',
                                repeatitems: false
                            },
         					editurl: "/dummy.html",//nothing is saved
         					caption: tableConfig.label,
         					autowidth: true,
                            onPaging: function (pgButton) {
                                if (pagingFinished) {
                                    pagingFinished = false;
                                } else {
                                    return;
                                }
                                var $this = $(this);
                                setTimeout(function () {
                                    var pageNumber = $this.jqGrid('getGridParam', 'page');
                                    var lastPage = $this.jqGrid('getGridParam', 'lastpage');
                                    if (pgButton === 'records') {
                                        pageNumber = 1;
                                    }

                                    if (pageNumber > lastPage) {
                                        DialogService.alert(['页码超出范围！']);
                                        return false;
                                    }
                                    //$this[0].grid.beginReq();
                                    scope.$apply(function () {
                                        if (pgButton === 'records') {
                                            scope.pageNumber = 1;
                                        } else {
                                            scope.pageNumber = $this.jqGrid('getGridParam', 'page');
                                        }

                                        scope.pageSize = $this.jqGrid('getGridParam', 'rowNum');
                                    });
                     				//取得当前检索条件
                     				scope.$emit('getCurrConditionObject', {srcDirName:'datatable.page.conditionObject', srcDirID:widgetId});
                     				//取得页面的page信息
                     				scope.$emit('getSerializeObject', {type:"tableDiv", id:widgetId, srcDirName:'datatable.page.pageData',srcDirID:widgetId});
                     				//检索条件合并page信息
                     				var queryData = $.extend(true, conditionObject.data, pageData);
                     				DataService.findPageData(conditionObject.action, queryData).then(function (response) {
                      	        		var grid_data = response.plain();
                      	        		gridDataUpdate(grid_data);
                      	        	});
                                }, 0);


                            },
                            onSelectRow:function(rowid, status){
                            	if(tableConfig.onSelectRow){
                            		var onSelectRowValue = tableConfig.onSelectRow;
                            		var onSelectRowValueList = onSelectRowValue.split(":");
                            		if(onSelectRowValueList.length >= 2){
                            			if(onSelectRowValueList[0] =="action"){
                                    		scope.$emit('doAction', {actionName:'do.button.action', d:{id:onSelectRowValueList[1]}});
                            			}
                            		}
                            	}
                            },
                            onSortCol: function (index, columnIndex, sortOrder) {
                                var sort = index;
                                if (sortOrder == 'desc') {
                                    sort = sort + " desc";
                                }

                                var $this = $(this);
                                setTimeout(function () {
                                    scope.$apply(function () {
                                        scope.pageNumber = 1;
                                        scope.pageSort = sort;
                                        scope.pageSize = $this.jqGrid('getGridParam', 'rowNum');
                                        //$scope.$broadcast('refreshGrid');
                                    });
                     				//取得当前检索条件
                     				scope.$emit('getCurrConditionObject', {srcDirName:'datatable.page.conditionObject', srcDirID:widgetId});
                     				//取得页面的page信息
                     				scope.$emit('getSerializeObject', {type:"tableDiv", id:widgetId, srcDirName:'datatable.page.pageData',srcDirID:widgetId});
                     				//检索条件合并page信息
                     				var queryData = $.extend(true, conditionObject.data, pageData);
                     				DataService.findPageData(conditionObject.action, queryData).then(function (response) {
                      	        		var grid_data = response.plain();
                      	        		gridDataUpdate(grid_data);
                      	        	});
                                }, 0);
                            }
         				});
         				//为每一列增加编辑标识
         				for(var i = 0; i < currColModel.length; i ++ ){
         					var colId = "table" + widgetId + "_" + currColModel[i].name;
              				$("#" + colId).attr("canEditFlag", "elementEditElement");
             				$("#" + colId).attr("elementId", currColModel[i].id);
         				}
         				
         				//取得当前选中行IDs
         				scope.$on("datatable.page.selectedids",function (e, data){
         					if(data.id == widgetId){
             					var ids= jQuery(grid_selector).jqGrid('getGridParam','selarrrow');
             					//将当前table选中数据的id存放在临时数据表中
             					scope.$emit('setTempObjectDataMap', {id:"datatable.page.selectedids"+widgetId,d:ids});
         					}
         				});
         				
         				//取得页面的conditionObject
                        var conditionObject,pageData;
         				scope.$on("datatable.page.conditionObject",function (e, data){
         					if(data.srcDirID == widgetId){                     						
         						conditionObject = data.d;
         					}
         				});
         				//取得翻页信息
         				scope.$on("datatable.page.pageData",function (e, data){
         					if(data.srcDirID == widgetId){
         						pageData = data.d;
         					}
         				});
         				var gridDataUpdate = function(gridData){
//         					//重新编辑数据源URL
// 							var colModelMine = jQuery(grid_selector).jqGrid('getGridParam', 'colModel');
// 							for(var rowIndex = 0; rowIndex < gridData.list.length; rowIndex ++ ){
// 								var rowData = gridData.list[rowIndex];
// 	 							for(var index = 0; index < colModelMine.length; index ++ ){
// 	 								if(colModelMine[index].editoptions && colModelMine[index].editoptions.dataUrl){
// 	 									var dataUrl = colModelMine[index].editoptions.dataUrl;
// 	     								var r = /\[(.+?)\]/g;
// 	     								var m = dataUrl.match(r);
// 	     								while (m){
// 	     									var currKey = m[0].substring(1);
// 	     									currKey = currKey.substring(0, currKey.length -1);
// 	     									if(rowData[currKey]){
// 	         									var replaceValue = rowData[currKey];
// 	         									dataUrl = dataUrl.replace(r, replaceValue);
// 	     									}else{
// 	     										dataUrl = dataUrl.replace(r, "");
// 	     									}
// 	     									m = dataUrl.match(r);
// 	     								}
// 	     								colModelMine[index].editoptions.dataUrlOrigin = colModelMine[index].editoptions.dataUrl;
// 	     								colModelMine[index].editoptions.dataUrl = dataUrl;
// 	 								}
// 	 							}
// 							}
         					jQuery(grid_selector).jqGrid('clearGridData');
         					if (jQuery(grid_selector).jqGrid('getGridParam', 'datatype') === 'custom') {
         						jQuery(grid_selector)[0].addJSONData(gridData);
                            } else {
                            	jQuery(grid_selector).jqGrid('setGridParam', {
                                    data: gridData
                                });
                            }
         					jQuery(grid_selector).trigger('reloadGrid');
//         					//恢复原数据源
// 							for(var index = 0; index < colModelMine.length; index ++ ){
// 								if(colModelMine[index].editoptions && colModelMine[index].editoptions.dataUrlOrigin){
// 									colModelMine[index].editoptions.dataUrl = colModelMine[index].editoptions.dataUrlOrigin;
// 								}
// 							}
         					updatePagerIcons(jQuery(grid_selector));
         				};
         				scope.$on("grid.data.update",function (e, data){
         					if (data.id === scope.id) {
	         					var d = data.d;
	         					gridDataUpdate(d);
         					}
         				});
         				//navButtons
         				jQuery(grid_selector).jqGrid('navGrid',pager_selector,
         					{ 	//navbar options
         						edit: tableConfig.canEdit,
         						editicon : 'icon-pencil blue',
         						add:  tableConfig.canAdd,
         						addicon : 'icon-plus-sign purple',
         						del:  tableConfig.canDel,
         						delicon : 'icon-trash red',
         						search: true,
         						searchicon : 'icon-search orange',
         						refresh: true,
         						refreshicon : 'icon-refresh green',
         						view: true,
         						viewicon : 'icon-zoom-in grey',
         					},
         					{
         						//edit record form
     							editCaption: "编辑",
     							bSubmit: "提交",
     					        bCancel: "取消",
     					        bClose: "关闭",
     					        url: "/" + COMMON.getProviderCode() + tableConfig.editrowurl,
     					        closeAfterEdit: true,
     					        refresh:true,
         						recreateForm: true,
         						reloadAfterSubmit:true,
         						beforeInitData : function(e) {
         							var colModelMine = jQuery(grid_selector).jqGrid('getGridParam', 'colModel');
         							var rowId = jQuery(grid_selector).jqGrid('getGridParam', 'selrow');
         							var rowData= jQuery(grid_selector).jqGrid('getRowData', rowId);

         							for(var index = 0; index < colModelMine.length; index ++ ){
         								if(colModelMine[index].editoptions && colModelMine[index].editoptions.dataUrl){
         									var dataUrl = colModelMine[index].editoptions.dataUrl;
             								var r = /\[(.+?)\]/g;
             								var m = dataUrl.match(r);
             								while (m){
             									var currKey = m[0].substring(1);
             									currKey = currKey.substring(0, currKey.length -1);
             									if(rowData[currKey]){
                 									var replaceValue = rowData[currKey];
                 									dataUrl = dataUrl.replace(r, replaceValue);
             									}else{
             										dataUrl = dataUrl.replace(r, "");
             									}
             									m = dataUrl.match(r);
             								}
             								colModelMine[index].editoptions.dataUrlOrigin = colModelMine[index].editoptions.dataUrl;
             								colModelMine[index].editoptions.dataUrl = dataUrl;
         								}
         							}
         						},
         						beforeShowForm : function(e) {
         							var colModelMine = jQuery(grid_selector).jqGrid('getGridParam', 'colModel');
         							for(var index = 0; index < colModelMine.length; index ++ ){
         								if(colModelMine[index].editoptions && colModelMine[index].editoptions.dataUrlOrigin){
         									colModelMine[index].editoptions.dataUrl = colModelMine[index].editoptions.dataUrlOrigin;
         								}
         							}
         							var form = $(e[0]);
         							form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');
         							if(tableConfig.editrowpara){
         								var editrowparaStr = tableConfig.editrowpara;
         								var paraData = {};
         								var r = /\[(.+?)\]/g;
         								var m = editrowparaStr.match(r);
         								while (m){
         									var currWidgetId = m[0].substring(1);
         									currWidgetId = currWidgetId.substring(0, currWidgetId.length -1);
         									if($("#input" + currWidgetId )){
             									var replaceValue = $("#input" + currWidgetId ).val();
             									editrowparaStr = editrowparaStr.replace(r, "'" + replaceValue + "'");
         									}
         									m = editrowparaStr.match(r);
         								}
         								paraData = eval("(" + editrowparaStr + ")");
	         							form.find(".jqguidrowhidden");
	         							var tbodyObj = form.find("tbody");
	         							var index = 0;
	         							for (var x in paraData) {
	         								var currTr = document.createElement("tr");
	         								currTr.id = "tr_" + x;
	         								currTr.className = "FormData";
	         								currTr.style.display = "none";
	         								currTr.setAttribute("rowpos", tbodyObj.find("tr").length + index);
	         								tbodyObj.append(currTr);
	         								//设置TD
	         								var currTdLabel = document.createElement("td");
	         								currTdLabel.className = "CaptionTD";
	         								currTdLabel.innerHTML = x;
	         								currTr.appendChild(currTdLabel);
	         								var currTd = document.createElement("td");
	         								currTd.className = "DataTD";
	         								currTr.appendChild(currTd);
	         						        var opt = document.createElement("input");
	         						        opt.name = x;
	         						        opt.value = paraData[x];
	         						        opt.className = "jqguidrowhidden FormElement";
	         						        currTd.appendChild(opt);
	         								index ++;
	         						    }
         							}
         							style_edit_form(form, datepickers, aceswitchs);
         						},
         						afterSubmit:function(response, postdata){
         							var responseObjStr = response.responseText;
         							var msg = COMMON.getMsgFromStr(responseObjStr);
         							if(msg && msg != ""){
         								alert(msg);
         							}else{
         								alert("操作成功！");
         							}
                     				//取得当前检索条件
                     				scope.$emit('getCurrConditionObject', {srcDirName:'datatable.page.conditionObject', srcDirID:widgetId});
                     				//取得页面的page信息
                     				scope.$emit('getSerializeObject', {type:"tableDiv", id:widgetId, srcDirName:'datatable.page.pageData',srcDirID:widgetId});
                     				//检索条件合并page信息
                     				var queryData = $.extend(true, conditionObject.data, pageData);
                     				DataService.findPageData(conditionObject.action, queryData).then(function (response) {
                      	        		var grid_data = response.plain();
                      	        		gridDataUpdate(grid_data);
                      	        	});
         		                    return true;
         		                }
         					},
         					{
         						//new record form
     							addCaption: "新增",
     							bSubmit: "提交",
     					        bCancel: "取消",
     					        bClose: "关闭",
     					        url: "/" + COMMON.getProviderCode() + tableConfig.addrowurl,
         						closeAfterAdd: true,
         						recreateForm: true,
         						reloadAfterSubmit:true,
         						viewPagerButtons: false,
         						beforeInitData : function(e) {
         							var colModelMine = jQuery(grid_selector).jqGrid('getGridParam', 'colModel');
         							var rowId = jQuery(grid_selector).jqGrid('getGridParam', 'selrow');
         							var rowData= jQuery(grid_selector).jqGrid('getRowData', rowId);
         							for(var index = 0; index < colModelMine.length; index ++ ){
         								if(colModelMine[index].editoptions && colModelMine[index].editoptions.dataUrl){
         									var dataUrl = colModelMine[index].editoptions.dataUrl;
             								var r = /\[(.+?)\]/g;
             								var m = dataUrl.match(r);
             								while (m){
             									var currKey = m[0].substring(1);
             									currKey = currKey.substring(0, currKey.length -1);
             									if(rowData[currKey]){
                 									var replaceValue = rowData[currKey];
                 									dataUrl = dataUrl.replace(r, replaceValue);
             									}else{
             										dataUrl = dataUrl.replace(r, "");
             									}
             									m = dataUrl.match(r);
             								}
             								colModelMine[index].editoptions.dataUrlOrigin = colModelMine[index].editoptions.dataUrl;
             								colModelMine[index].editoptions.dataUrl = dataUrl;
         								}
         							}
         						},
         						beforeShowForm : function(e) {
         							var colModelMine = jQuery(grid_selector).jqGrid('getGridParam', 'colModel');
         							for(var index = 0; index < colModelMine.length; index ++ ){
         								if(colModelMine[index].editoptions && colModelMine[index].editoptions.dataUrlOrigin){
         									colModelMine[index].editoptions.dataUrl = colModelMine[index].editoptions.dataUrlOrigin;
         								}
         							}
         							var form = $(e[0]);
         							form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
         							if(tableConfig.addrowpara){
         								var addrowparaStr = tableConfig.addrowpara;
         								var paraData = {};
         								var r = /\[(.+?)\]/g;         								 
         								var m = addrowparaStr.match(r);
         								while (m){
         									var currWidgetId = m[0].substring(1);
         									currWidgetId = currWidgetId.substring(0, currWidgetId.length -1);
         									if($("#input" + currWidgetId )){
             									var replaceValue = $("#input" + currWidgetId ).val();
             									addrowparaStr = addrowparaStr.replace(r, "'" + replaceValue + "'");
         									}
         									m = addrowparaStr.match(r);
         								}
         								paraData = eval("(" + addrowparaStr + ")");
	         							form.find(".jqguidrowhidden");
	         							var tbodyObj = form.find("tbody");
	         							var index = 0;
	         							for (var x in paraData) {
	         								var currTr = document.createElement("tr");
	         								currTr.id = "tr_" + x;
	         								currTr.className = "FormData";
	         								currTr.style.display = "none";
	         								currTr.setAttribute("rowpos", tbodyObj.find("tr").length + index);
	         								tbodyObj.append(currTr);
	         								//设置TD
	         								var currTdLabel = document.createElement("td");
	         								currTdLabel.className = "CaptionTD";
	         								currTdLabel.innerHTML = x;
	         								currTr.appendChild(currTdLabel);
	         								var currTd = document.createElement("td");
	         								currTd.className = "DataTD";
	         								currTr.appendChild(currTd);
	         						        var opt = document.createElement("input");
	         						        opt.name = x;
	         						        opt.value = paraData[x];
	         						        opt.className = "jqguidrowhidden FormElement";
	         						        currTd.appendChild(opt);
	         								index ++;
	         						    }
         							}
         							style_edit_form(form, datepickers, aceswitchs);
         						},
         						afterSubmit:function(response, postdata){
         							var responseObjStr = response.responseText;
         							var msg = COMMON.getMsgFromStr(responseObjStr);
         							if(msg && msg != ""){
         								alert(msg);
         							}else{
         								alert("操作成功！");
         							}
                     				//取得当前检索条件
                     				scope.$emit('getCurrConditionObject', {srcDirName:'datatable.page.conditionObject', srcDirID:widgetId});
                     				//取得页面的page信息
                     				scope.$emit('getSerializeObject', {type:"tableDiv", id:widgetId, srcDirName:'datatable.page.pageData',srcDirID:widgetId});
                     				//检索条件合并page信息
                     				var queryData = $.extend(true, conditionObject.data, pageData);
                     				DataService.findPageData(conditionObject.action, queryData).then(function (response) {
                      	        		var grid_data = response.plain();
                      	        		gridDataUpdate(grid_data);
                      	        	});
         		                    return true;
         		                }
         					},
         					{
         						//delete record form
         						caption: "删除",
     							bSubmit:"删除",
     					        bCancel:"取消",
     					        msg: "删除?",
     					        refresh:true,
         						reloadAfterSubmit:true,
         						closeAfterDelete: true,
     					        url: "/" + COMMON.getProviderCode() + tableConfig.delrowurl,
         						recreateForm: false,
         						beforeShowForm : function(e) {
         							var form = $(e[0]);
         							if(form.data('styled')) return false;         							
         							form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
         							if(tableConfig.delrowpara){
         								var delrowparaStr = tableConfig.delrowpara;
         								var paraData = {};
         								var r = /\[(.+?)\]/g;         								 
         								var m = delrowparaStr.match(r);
         								while (m){
         									var currWidgetId = m[0].substring(1);
         									currWidgetId = currWidgetId.substring(0, currWidgetId.length -1);
         									if($("#input" + currWidgetId )){
             									var replaceValue = $("#input" + currWidgetId ).val();
             									delrowparaStr = delrowparaStr.replace(r, "'" + replaceValue + "'");
         									}
         									m = delrowparaStr.match(r);
         								}
         								paraData = eval("(" + delrowparaStr + ")");
	         							form.find(".jqguidrowhidden");
	         							var tbodyObj = form.find("tbody");
	         							var index = 0;
	         							for (var x in paraData) {
	         								var currTr = document.createElement("tr");
	         								currTr.id = "tr_" + x;
	         								currTr.className = "FormData";
	         								currTr.style.display = "none";
	         								currTr.setAttribute("rowpos", tbodyObj.find("tr").length + index);
	         								tbodyObj.append(currTr);
	         								//设置TD
	         								var currTdLabel = document.createElement("td");
	         								currTdLabel.className = "CaptionTD";
	         								currTdLabel.innerHTML = x;
	         								currTr.appendChild(currTdLabel);
	         								var currTd = document.createElement("td");
	         								currTd.className = "DataTD";
	         								currTr.appendChild(currTd);
	         						        var opt = document.createElement("input");
	         						        opt.name = x;
	         						        opt.value = paraData[x];
	         						        opt.className = "jqguidrowhidden FormElement";
	         						        currTd.appendChild(opt);
	         								index ++;
	         						    }
         							}
         							style_delete_form(form);
         							
         							form.data('styled', true);
         						},
         						afterSubmit:function(response, postdata){
         							var responseObjStr = response.responseText;
         							var msg = COMMON.getMsgFromStr(responseObjStr);
         							if(msg && msg != ""){
         								alert(msg);
         							}else{
         								alert("操作成功！");
         							}
                     				//取得当前检索条件
                     				scope.$emit('getCurrConditionObject', {srcDirName:'datatable.page.conditionObject', srcDirID:widgetId});
                     				//取得页面的page信息
                     				scope.$emit('getSerializeObject', {type:"tableDiv", id:widgetId, srcDirName:'datatable.page.pageData',srcDirID:widgetId});
                     				//检索条件合并page信息
                     				var queryData = $.extend(true, conditionObject.data, pageData);
                     				DataService.findPageData(conditionObject.action, queryData).then(function (response) {
                      	        		var grid_data = response.plain();
                      	        		gridDataUpdate(grid_data);
                      	        	});
         		                    return true;
         		                },
         						onClick : function(e) {
         							alert(1);
         						}
         					},
         					{
         						//search form
         						recreateForm: true,
         						afterShowSearch: function(e){
         							var form = $(e[0]);
         							form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
         							style_search_form(form);
         						},
         						afterRedraw: function(){
         							style_search_filters($(this));
         						}
         						,
         						multipleSearch: true,
         						/**
         						multipleGroup:true,
         						showQuery: true
         						*/
         					},
         					{
         						//view record form
         						recreateForm: true,
         						beforeShowForm: function(e){
         							var form = $(e[0]);
         							form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
         						}
         					}
         				);
         				
         				
            		};
            		
	        	 });

  				//#######################################################################################################################################//
  				//                                                       表格内容所用的方法                                                                                                                                                                         //
  				//                                                                                                                                       //
  				//#######################################################################################################################################//
     				//enable search/filter toolbar
     				//jQuery(grid_selector).jqGrid('filterToolbar',{defaultSearch:true,stringResult:true})
     			
     				//switch element when editing inline
     				function aceSwitch( cellvalue, options, cell ) {
     					setTimeout(function(){
     						$(cell) .find('input[type=checkbox]')
     								.wrap('<label class="inline" />')
     							.addClass('ace ace-switch ace-switch-5')
     							.after('<span class="lbl"></span>');
     					}, 0);
     				}
     				//enable datepicker
     				function pickDate( cellvalue, options, cell ) {
     					setTimeout(function(){
     						$(cell) .find('input[type=text]')
     								.datepicker({language:  'zh', format:'yyyy-mm-dd' , autoclose:true}); 
     					}, 0);
     				}
     				function reRender(cellvalue, options, rowObject){
     					var formatoptions = options.colModel.formatoptions;
			        	var showText = "";
     					if(formatoptions.serviceName){
     						var serviceName = formatoptions.serviceName;
     						var dataUrlStr = "/rest/api/" + COMMON.getProviderCode() + "dataSrcList/" + serviceName;
     						if(formatoptions.queryKey){
         						var queryKey = formatoptions.queryKey;
         						dataUrlStr = dataUrlStr + "?json={" + queryKey + ":'" + cellvalue + "'}";
     						}
     						if(formatoptions.queryCondition){
         						var queryCondition = formatoptions.queryCondition;
         						dataUrlStr = dataUrlStr + "?json=" + JSON.stringify(queryCondition);
  								var r = /\[(.+?)\]/g;
  								var m = dataUrlStr.match(r);
  								while (m){
  									var currKey = m[0].substring(1);
  									currKey = currKey.substring(0, currKey.length -1);
  									if(rowObject[currKey]){
      									var replaceValue = rowObject[currKey];
      									dataUrlStr = dataUrlStr.replace(r, replaceValue);
  									}else{
  										dataUrlStr = dataUrlStr.replace(r, "");
  									}
  									m = dataUrlStr.match(r);
  								}
     						}
     						//提交后台请求
	   						 $.ajax({
						        type: "POST",
						        async: false,
						        url: dataUrlStr,
						        contentType: "application/json; charset=utf-8",
						        dataType: "json",
						        success: function (dataObj) {
						        	for(var index = 0; index < dataObj.length; index ++){
						        		if(formatoptions.queryCondition && cellvalue == dataObj[index].value){
						        			showText = dataObj[index].label;
						        			break;
						        		}else{
							        		if(index == 0){
								        		showText = dataObj[index].label;
							        		}else{
								        		showText = showText + "," + dataObj.label;
							        		}
						        		}
						        	}
						        	formatoptions[options.rowId + showText] = cellvalue;
						        }
						    });
     					}     					
   						return showText;
     				}
     				function unRender(cellvalue, options, cell){
     					var formatoptions = options.colModel.formatoptions;
     					return formatoptions[options.rowId + cellvalue];
     				}
     				function addDataLink(cellvalue, options, rowObject){
     					if(cellvalue == null || cellvalue == ""){
     						return "";
     					}
     					var rowId = rowObject['id'];
     					var formatoptions = options.colModel.formatoptions;
     					var optionsStr = JSON.stringify(formatoptions);
     					var rowObjectStr = JSON.stringify(rowObject);
     					var reStr = '<a href="javascript:void(0)" style="text-decoration:underline" onclick=angular.element(this).scope().showDataDetail("' + rowId + '",' + optionsStr + ') >' + cellvalue + '</a>';
     					return reStr;
     				}
     				function unAddDataLink(cellvalue, options, cell){
     					return cellvalue;
     				}
     				
     				scope.showDataDetail = function(itemId, options){
            			var popupServiceName = "";
            			var popupData = "";
            			var popupId = "";
            			if(options.initService && options.initService.trim() != ""){
                			popupServiceName = "&serviceName="+ options.initService;
            			}
            			if(options.initData){
            				if(options.initData != ""){
             					var rowObject = jQuery(grid_selector).jqGrid('getRowData', itemId);
            					for(var item in rowObject){
            						var currWidgetCode = options.initData[item];
            						if(currWidgetCode){
            							popupData = popupData + "&" + currWidgetCode + "=" + rowObject[item];
            						}
        						}            					
            				}else{
                				popupData = "&parentData={id:'" + itemId +"'}";
            				}
            			}
        				popupId = "&id=" + itemId;
            			var popupConfig = options.popup;
            			var popupSize = popupConfig["size"];
            			var popupTitle = popupConfig["title"];
            			var popupPageId = popupConfig["pageId"];
            			var closeFlush = popupConfig["closeFlush"];
            			var popupWidth = VISUALEDIT.HALFSCREENAVAILWIDTH;
            			var popupHeight = VISUALEDIT.HALFSCREENAVAILHEIGHT;
            			if(popupSize == "large"){
                			popupWidth = VISUALEDIT.SCREENAVAILWIDTH;
                			popupHeight = VISUALEDIT.SCREENAVAILHEIGHT;
            			}
            			if(popupSize == "small"){
                			popupWidth = VISUALEDIT.QUARTERSCREENAVAILWIDTH;
                			popupHeight = VISUALEDIT.QUARTERSCREENAVAILHEIGHT;
            			}
            	        var popupHtml = "app/controller/popup/popup.tpl.html?ram=" + Math.random();
            	        if(!popupPageId){
            	        	popupPageId = "";
            	        }
            	        if(closeFlush == null){
            	        	closeFlush = true;
            	        }
            			DataService.getPageContainers(popupPageId).then(function (response) {
            				if(response){
            					var popupPage = response;
            					var popupContainer = popupPage.containers[0];
            					if(!popupTitle){
            						popupTitle = popupPage.name;
            					}
                    	        /*$.ajax({
                    	            type: "post",
                    	            url: "/setPopupSession?widgetId=none",
                    	            success: function (e) {
                    	            	if(e.status.code == 100){
                    	            		console.log("已经设置弹出框Session");
                    	            	}
                    	            }
                    	        });*/
                    			VISUALEDIT.popupWindow({
            						title: popupTitle, 
            						frameSrcUrl: popupHtml 
            									+ popupServiceName
            									+ popupId
            									+ popupData
            									+ '&popupTitle=' + popupTitle
            									+ '&pageId=' + popupPage.id
            									+ '&containerId=' + popupContainer.id,
            						width: popupWidth,
            						height: popupHeight,
            						closeFunc:function(){
            							if(closeFlush){
                							scope.$emit('doAction', {actionName:'do.button.action', d:{}});
            							}
            						},
            						saveBeforePopup:false
        						});
            				}else{
            					//创建页面
            					var pageData = {
            							code:data.code + "_PG",
            							name:data.name + '的弹出页面'
            					};
            					DataService.saveData("page/saveorupdate", pageData).then(function (responsePage) {
            						var popupPage = responsePage;
            						var popupContainer = popupPage.containers[0];
                					if(!popupTitle){
                						popupTitle = popupPage.name;
                					}
            						VISUALEDIT.popupWindow({
                						title: popupTitle, 
                						frameSrcUrl: popupHtml 
                									+ popupServiceName
                									+ popupId
                									+ popupData
                									+ 'popupTitle=' + popupTitle
                									+ '&pageId=' + popupPage.id
                									+ '&containerId=' + popupContainer.id,
                						width: popupWidth,
                						height: popupHeight,
                						closeFunc:function(){
                							if(closeFlush){
                    							scope.$emit('doAction', {actionName:'do.button.action', d:{}});
                							}
                						},
                						saveBeforePopup:false
            						});
                 				});
            				}
            			});
     				}
     				function style_edit_form(form, datapickers, aceswitchs) {
     					setTimeout(function(){
         					//设置级联方法
    						var colModelMine = jQuery(grid_selector).jqGrid('getGridParam', 'colModel');
    						var colNameslMine = jQuery(grid_selector).jqGrid('getGridParam', 'colNames');
    						
         					var formElements = form.find('.FormElement');
         					formElements.each(function (index, domEle){
         						var currLabel = $(domEle).parent().parent().find(".CaptionTD").text();
         						var currId = $(domEle).attr("name");
         						var dataurlorigin = null;
         						for(var index = 0; index < colModelMine.length; index ++ ){
         							var currColName = colNameslMine[index];
 	 								if(colModelMine[index].editoptions 
 	 										&& colModelMine[index].editoptions.dataUrl
 	 										&& currColName == currLabel){
 	 									if(!$(domEle).attr("name")){
 	 	 									$(domEle).attr("name", colModelMine[index].name);
 	 	 									$(domEle).attr("id", colModelMine[index].name);
 	 									} 	 									
 	 									dataurlorigin = colModelMine[index].editoptions.dataUrl;
 	 								}
         						}
         						if(dataurlorigin){
         							var dataUrl = dataurlorigin;
     								var r = /\[(.+?)\]/g;
     								var m = dataUrl.match(r);
     								while (m){
     									var currKey = m[0].substring(1);
     									currKey = currKey.substring(0, currKey.length -1);
     									var parentElement = form.find("#" + currKey);
     									if(parentElement){
         									var replaceValue = parentElement.val();
         									dataUrl = dataUrl.replace(r, replaceValue);
         									parentElement.bind("change",function(){
         										reloadMe(this);
         									});
     									}else{
     										dataUrl = dataUrl.replace(r, "");
     									}
     									m = dataUrl.match(r); 									
     								}
     								var reloadMe = function(thisObject){
     	     							var dataUrl = dataurlorigin;
     	 								var r = /\[(.+?)\]/g;
     	 								var m = dataUrl.match(r);
     	 								while (m){
     	 									var currKey = m[0].substring(1);
     	 									currKey = currKey.substring(0, currKey.length -1);
     	 									var parentElement = form.find("#" + currKey);
     	 									if(parentElement){
     	     									var replaceValue = parentElement.val();
     	     									dataUrl = dataUrl.replace(r, replaceValue);
     	 									}else{
     	 										dataUrl = dataUrl.replace(r, "");
     	 									}
     	 									m = dataUrl.match(r); 									
     	 								} 									
    	        						 //提交后台请求
    	        						 $.ajax({
    	       						        type: "POST",
    	       						        url: dataUrl,
    	       						        async: false,
    	       						        contentType: "application/json; charset=utf-8",
    	       						        dataType: "json",
    	       						        success: function (dataObj) {
    	       						             var selectOptions = domEle.options;  
    	       						             var optionLength = selectOptions.length;  
    	       						             for(var i=0;i <optionLength;i++){  
    	       						            	domEle.removeChild(selectOptions[0]);
    	       						             }
    	       						        	for(var dataIndex = 0; dataIndex < dataObj.length; dataIndex ++){
    	       						        		domEle.options.add(new Option(dataObj[dataIndex].label, dataObj[dataIndex].value));
    	       						        	}
    	       						        	$(domEle).change();
    	       						        }
    	       						    });
     								}
         						}
         					});
 						}, 100);
     					
     					//enable datepicker on "sdate" field and switches for "stock" field
//     					form.find('input[name=sdate]').datepicker({format:'yyyy-mm-dd' , autoclose:true})
//     						.end().find('input[name=stock]')
//     							  .addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');
     					//添加选择时间控件
     					for(var i=0; i < datapickers.length; i ++ ){
     						$('input[name='+ datapickers[i] +']').datepicker({format:'yyyy-mm-dd' , autoclose:true});
     					}
     					//添加ACE切换控件
     					for(var i=0; i < aceswitchs.length; i ++ ){
     						$('input[name='+ aceswitchs[i] +']').addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');
     					}
     					//update buttons classes
     					var buttons = form.next().find('.EditButton .fm-button');
     					buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
     					buttons.eq(0).addClass('btn-primary').prepend('<i class="icon-ok"></i>');
     					buttons.eq(1).prepend('<i class="icon-remove"></i>')
     					
     					buttons = form.next().find('.navButton a');
     					buttons.find('.ui-icon').remove();
     					buttons.eq(0).append('<i class="icon-chevron-left"></i>');
     					buttons.eq(1).append('<i class="icon-chevron-right"></i>');		
     				}
     			
     				function style_delete_form(form) {
     					var buttons = form.next().find('.EditButton .fm-button');
     					buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
     					buttons.eq(0).addClass('btn-danger').prepend('<i class="icon-trash"></i>');
     					buttons.eq(1).prepend('<i class="icon-remove"></i>')
     				}
     				
     				function style_search_filters(form) {
     					form.find('.delete-rule').val('X');
     					form.find('.add-rule').addClass('btn btn-xs btn-primary');
     					form.find('.add-group').addClass('btn btn-xs btn-success');
     					form.find('.delete-group').addClass('btn btn-xs btn-danger');
     				}
     				function style_search_form(form) {
     					var dialog = form.closest('.ui-jqdialog');
     					var buttons = dialog.find('.EditTable')
     					buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'icon-retweet');
     					buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'icon-comment-alt');
     					buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'icon-search');
     				}
     				
     				function beforeDeleteCallback(e) {
     					var form = $(e[0]);
     					if(form.data('styled')) return false;
     					
     					form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
     					style_delete_form(form);
     					
     					form.data('styled', true);
     				}
     				
     				function beforeEditCallback(e) {
     					var form = $(e[0]);
     					form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
     					style_edit_form(form);
     				}
     			
     			
     			
     				//it causes some flicker when reloading or navigating grid
     				//it may be possible to have some custom formatter to do this as the grid is being created to prevent this
     				//or go back to default browser checkbox styles for the grid
     				function styleCheckbox(table) {
     				/**
     					$(table).find('input:checkbox').addClass('ace')
     					.wrap('<label />')
     					.after('<span class="lbl align-top" />')
     			
     			
     					$('.ui-jqgrid-labels th[id*="_cb"]:first-child')
     					.find('input.cbox[type=checkbox]').addClass('ace')
     					.wrap('<label />').after('<span class="lbl align-top" />');
     				*/
     				}
     				
     			
     				//unlike navButtons icons, action icons in rows seem to be hard-coded
     				//you can change them like this in here if you want
     				function updateActionIcons(table) {
     					/**
     					var replacement = 
     					{
     						'ui-icon-pencil' : 'icon-pencil blue',
     						'ui-icon-trash' : 'icon-trash red',
     						'ui-icon-disk' : 'icon-ok green',
     						'ui-icon-cancel' : 'icon-remove red'
     					};
     					$(table).find('.ui-pg-div span.ui-icon').each(function(){
     						var icon = $(this);
     						var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
     						if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
     					})
     					*/
     				}
     				
     				//replace icons with FontAwesome icons like above
     				function updatePagerIcons(table) {
     					var replacement = 
     					{
     						'ui-icon-seek-first' : 'icon-double-angle-left bigger-140',
     						'ui-icon-seek-prev' : 'icon-angle-left bigger-140',
     						'ui-icon-seek-next' : 'icon-angle-right bigger-140',
     						'ui-icon-seek-end' : 'icon-double-angle-right bigger-140'
     					};
     					$('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
     						var icon = $(this);
     						var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
     						
     						if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
     					})
     				}
     			
     				function enableTooltips(table) {
     					$('.navtable .ui-pg-button').tooltip({container:'body'});
     					$(table).find('.ui-pg-div').tooltip({container:'body'});
     				}
     			
     				//var selr = jQuery(grid_selector).jqGrid('getGridParam','selrow');
	     			
	     			
	        }
        };
    }])
;