angular.module('controller.webpage.edit.tools', [])
    .directive('editTools', ['DataService', 'APP_CONFIG', '$route', function (DataService, APP_CONFIG) {
        return {
            restrict: 'EA',
            templateUrl: '/app/controller/edit/edit.page.tools.tpl.html',
            replace: false,
            scope: {
            },
        	controller:function ($scope) {
        		$scope.Dragging=function(validateHandler){ //参数为验证点击区域是否为可移动区域，如果是返回欲移动元素，负责返回null
        			var draggingObj=null; //dragging Dialog
        			var diffX=0;
        			var diffY=0;
        			
        			function mouseHandler(e){
        			    switch(e.type){
        			        case 'mousedown':
        			        draggingObj=validateHandler(e);//验证是否为可点击移动区域
        			        if(draggingObj!=null){
        			            diffX=e.clientX-draggingObj.offsetLeft;
        			            diffY=e.clientY-draggingObj.offsetTop;
        			        }
        			        break;
        			    
        			    case 'mousemove':
        			        if(draggingObj){
        			            draggingObj.style.left=(e.clientX-diffX)+'px';
        			            draggingObj.style.top=(e.clientY-diffY)+'px';
        			        }
        			        break;
        			    
        			    case 'mouseup':
        			            draggingObj =null;
        			            diffX=0;
        			            diffY=0;
        			            break;
        			    }
        			};
        			
        			return {
        			enable:function(){
        			    document.addEventListener('mousedown',mouseHandler);
        			    document.addEventListener('mousemove',mouseHandler);
        			    document.addEventListener('mouseup',mouseHandler);
        			},
        			disable:function(){
        			    document.removeEventListener('mousedown',mouseHandler);
        			    document.removeEventListener('mousemove',mouseHandler);
        			    document.removeEventListener('mouseup',mouseHandler);
        			    }
        			}
        		}
        		$scope.getDraggingDialog = function(e){
        		    var target=e.target;
        		    while(target && target.className.indexOf('dialog-title')==-1){
        		        target=target.offsetParent;
        		    }
        		    if(target!=null){
        		        return target.offsetParent;
        		    }else{
        		        return null;
        		    }
        		}
        		            

        		$scope.supportstorage = function() {
        			if (typeof $scope.localStorage=='object') 
        				return true;
        			else
        				return false;		
        		}

        		$scope.handleSaveLayout = function() {
        			var e = $(".demo").html();
        			if (!$scope.stopsave && e != window.demoHtml) {
        				$scope.stopsave++;
        				window.demoHtml = e;
        				$scope.saveLayout();
        				$scope.stopsave--;
        			}
        		}

        		$scope.layouthistory;
        		$scope.saveLayout = function (){
        			var data = $scope.layouthistory;
        			if (!data) {
        				data={};
        				data.count = 0;
        				data.list = [];
        			}
        			if (data.list.length>data.count) {
        				for (i=data.count;i<data.list.length;i++)
        					data.list[i]=null;
        			}
        			data.list[data.count] = window.demoHtml;
        			data.count++;
        			if ($scope.supportstorage()) {
        				$scope.localStorage.setItem("layoutdata",JSON.stringify(data));
        			}
        			$scope.layouthistory = data;
        			//console.log(data);
        			/*$.ajax({  
        				type: "POST",  
        				url: "/build/saveLayout",  
        				data: { layout: $('.demo').html() },  
        				success: function(data) {
        					//updateButtonsVisibility();
        				}
        			});*/
        		}

        		$scope.downloadLayout = function(){
        			
        			$.ajax({  
        				type: "POST",  
        				url: "/build/downloadLayout",  
        				data: { layout: $('#download-layout').html() },  
        				success: function(data) { window.location.href = '/build/download'; }
        			});
        		}

        		$scope.downloadHtmlLayout = function (){
        			$.ajax({  
        				type: "POST",  
        				url: "/build/downloadLayout",  
        				data: { layout: $('#download-layout').html() },  
        				success: function(data) { window.location.href = '/build/downloadHtml'; }
        			});
        		}

        		$scope.undoLayout = function() {
        			var data = $scope.layouthistory;
        			//console.log(data);
        			if (data) {
        				if (data.count<2) return false;
        				window.demoHtml = data.list[data.count-2];
        				data.count--;
        				$('.demo').html(window.demoHtml);
        				if ($scope.supportstorage()) {
        					$scope.localStorage.setItem("layoutdata",JSON.stringify(data));
        				}
        				return true;
        			}
        			return false;
        			/*$.ajax({  
        				type: "POST",  
        				url: "/build/getPreviousLayout",  
        				data: { },  
        				success: function(data) {
        					undoOperation(data);
        				}
        			});*/
        		}

        		$scope.redoLayout = function() {
        			var data = $scope.layouthistory;
        			if (data) {
        				if (data.list[data.count]) {
        					window.demoHtml = data.list[data.count];
        					data.count++;
        					$('.demo').html(window.demoHtml);
        					if ($scope.supportstorage()) {
        						$scope.localStorage.setItem("layoutdata",JSON.stringify(data));
        					}
        					return true;
        				}
        			}
        			return false;
        			/*
        			$.ajax({  
        				type: "POST",  
        				url: "/build/getPreviousLayout",  
        				data: { },  
        				success: function(data) {
        					redoOperation(data);
        				}
        			});*/
        		}

        		$scope.handleJsIds = function() {
        			handleModalIds();
        			handleAccordionIds();
        			handleCarouselIds();
        			handleTabsIds()
        		}
        		function handleAccordionIds() {
        			var e = $(".demo #myAccordion");
        			var t = randomNumber();
        			var n = "accordion-" + t;
        			var r;
        			e.attr("id", n);
        			e.find(".accordion-group").each(function(e, t) {
        				r = "accordion-element-" + randomNumber();
        				$(t).find(".accordion-toggle").each(function(e, t) {
        					$(t).attr("data-parent", "#" + n);
        					$(t).attr("href", "#" + r)
        				});
        				$(t).find(".accordion-body").each(function(e, t) {
        					$(t).attr("id", r)
        				})
        			})
        		}
        		function handleCarouselIds() {
        			var e = $(".demo #myCarousel");
        			var t = randomNumber();
        			var n = "carousel-" + t;
        			e.attr("id", n);
        			e.find(".carousel-indicators li").each(function(e, t) {
        				$(t).attr("data-target", "#" + n)
        			});
        			e.find(".left").attr("href", "#" + n);
        			e.find(".right").attr("href", "#" + n)
        		}
        		function handleModalIds() {
        			var e = $(".demo #myModalLink");
        			var t = randomNumber();
        			var n = "modal-container-" + t;
        			var r = "modal-" + t;
        			e.attr("id", r);
        			e.attr("href", "#" + n);
        			e.next().attr("id", n)
        		}
        		function handleTabsIds() {
        			var e = $(".demo #myTabs");
        			var t = randomNumber();
        			var n = "tabs-" + t;
        			e.attr("id", n);
        			e.find(".tab-pane").each(function(e, t) {
        				var n = $(t).attr("id");
        				var r = "panel-" + randomNumber();
        				$(t).attr("id", r);
        				$(t).parent().parent().find("a[href=#" + n + "]").attr("href", "#" + r)
        			})
        		}
        		function randomNumber() {
        			return randomFromInterval(1, 1e6)
        		}
        		function randomFromInterval(e, t) {
        			return Math.floor(Math.random() * (t - e + 1) + e)
        		}
        		$scope.gridSystemGenerator = function () {
        			$(".lyrow .preview input").bind("keyup", function() {
        				var e = 0;
        				var t = "";
        				var n = $(this).val().split(" ", 12);
        				$.each(n, function(n, r) {
        					e = e + parseInt(r);
        					t += '<div class="span' + r + ' column"></div>'
        				});
        				if (e == 12) {
        					$(this).parent().next().children().html(t);
        					$(this).parent().prev().show()
        				} else {
        					$(this).parent().prev().hide()
        				}
        			})
        		}
        		$scope.configurationElm = function (e, t) {
        			$(".demo").delegate(".configuration > a", "click", function(e) {
        				e.preventDefault();
        				var t = $(this).parent().next().next().children();
        				$(this).toggleClass("active");
        				t.toggleClass($(this).attr("rel"))
        			});
        			$(".demo").delegate(".configuration .dropdown-menu a", "click", function(e) {
        				e.preventDefault();
        				var t = $(this).parent().parent();
        				var n = t.parent().parent().next().next().children();
        				t.find("li").removeClass("active");
        				$(this).parent().addClass("active");
        				var r = "";
        				t.find("a").each(function() {
        					r += $(this).attr("rel") + " "
        				});
        				t.parent().removeClass("open");
        				n.removeClass(r);
        				n.addClass($(this).attr("rel"))
        			})
        		}
        		$scope.removeElm = function () {
        			$(".demo").delegate(".remove", "click", function(e) {
        				e.preventDefault();
        				$(this).parent().parent().remove();
        				if (!$(".demo .lyrow").length > 0) {
        					//$scope.clearDemo();
        				}
        			})
        		}
        		$scope.clearDemo = function () {
        			$(".demo").empty();
        			$scope.layouthistory = null;
        			if ($scope.supportstorage())
        				$scope.localStorage.removeItem("layoutdata");
        		}
        		$scope.removeMenuClasses = function () {
        			$("#menu-layoutit li button").removeClass("active")
        		}
        		$scope.changeStructure = function (e, t) {
        			$("#download-layout ." + e).removeClass(e).addClass(t)
        		}
        		function cleanHtml(e) {
        			$(e).parent().append($(e).children().html())
        		}
        		$scope.downloadLayoutSrc = function () {
        			var e = "";
        			$("#download-layout").children().html($(".demo").html());
        			var t = $("#download-layout").children();
        			t.find(".preview, .configuration, .drag, .remove").remove();
        			t.find(".lyrow").addClass("removeClean");
        			t.find(".box-element").addClass("removeClean");
        			t.find(".lyrow .lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {
        				cleanHtml(this)
        			});
        			t.find(".lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {
        				cleanHtml(this)
        			});
        			t.find(".lyrow .lyrow .lyrow .removeClean").each(function() {
        				cleanHtml(this)
        			});
        			t.find(".lyrow .lyrow .removeClean").each(function() {
        				cleanHtml(this)
        			});
        			t.find(".lyrow .removeClean").each(function() {
        				cleanHtml(this)
        			});
        			t.find(".removeClean").each(function() {
        				cleanHtml(this)
        			});
        			t.find(".removeClean").remove();
        			$("#download-layout .column").removeClass("ui-sortable");
        			$("#download-layout .row-fluid").removeClass("clearfix").children().removeClass("column");
        			if ($("#download-layout .container").length > 0) {
        				$scope.changeStructure("row-fluid", "row")
        			}
        			formatSrc = $.htmlClean($("#download-layout").html(), {
        				format: true,
        				allowedAttributes: [
        					["id"],
        					["class"],
        					["data-toggle"],
        					["data-target"],
        					["data-parent"],
        					["role"],
        					["data-dismiss"],
        					["aria-labelledby"],
        					["aria-hidden"],
        					["data-slide-to"],
        					["data-slide"]
        				]
        			});
        			$("#download-layout").html(formatSrc);
        			$("#downloadModal textarea").empty();
        			$("#downloadModal textarea").val(formatSrc)
        		}

        		$scope.currentDocument = null;
        		$scope.timerSave = 1000;
        		$scope.stopsave = 0;
        		$scope.startdrag = 0;
        		$scope.demoHtml = $(".demo").html();
        		$scope.currenteditor = null;
        		$(window).resize(function() {
        			$("body").css("min-height", $(window).height() - 90);
        			$(".demo").each(function(){
        				$("body").css("min-height", $(window).height() - 90);
        				var dialogHeight = $(this).parent().find('.sidebar-nav').height() + 100;
        				$(this).parent().css("height", dialogHeight + "px");
        			});
        		});

        		$scope.restoreData = function (){
        			if ($scope.supportstorage()) {
        				$scope.layouthistory = JSON.parse($scope.localStorage.getItem("layoutdata"));
        				if (!$scope.layouthistory) return false;
        				window.demoHtml = $scope.layouthistory.list[$scope.layouthistory.count-1];
        				if (window.demoHtml) $(".demo").html(window.demoHtml);
        			}
        		}

        		$scope.initContainer = function (){
        			$(".demo, .demo .column").sortable({
        				connectWith: ".column",
        				opacity: .35,
        				handle: ".drag",
        				start: function(e,t) {
        					if (!$scope.startdrag) $scope.stopsave++;
        					$scope.startdrag = 1;
        				},
        				stop: function(e,t) {
        					if($scope.stopsave>0) $scope.stopsave--;
        					$scope.startdrag = 0;
        				}
        			});
        			$scope.configurationElm();
        		}
        		$scope.loadDateRangeJs = function(inputDataRangeSample){
        			var dateRangeType = "datetimerangepicker";
        			var dateRangeFormat = "YYYY-MM-DD HH:mm:ss";
        			var dateRangeTimePicker = true;
                	var locale = {
                			"format": 'YYYY-MM-DD',
                			"separator": " -222 ",
                			"applyLabel": "确定",
                			"cancelLabel": "取消",
                			"fromLabel": "起始时间",
                			"toLabel": "结束时间",
                			"customRangeLabel": "自定义",
                			"weekLabel": "W",
                			"daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
                			"monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                			"firstDay": 1
                			};
                	inputDataRangeSample.daterangepicker({
                		locale:locale,
                		showDropdowns : true,
//                        maxDate : moment(), //最大时间 
                        showWeekNumbers : true, //是否显示第几周
                		timePicker : dateRangeTimePicker, //是否显示小时和分钟  
                        timePickerIncrement : 1, //时间的增量，单位为分钟  
                        timePicker12Hour : false, //是否使用12小时制来显示时间  
                        ranges : {
                            '最近1小时': [moment().subtract('hours',1), moment()],  
                            '今日': [moment().startOf('day'), moment()],  
                            '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],  
                            '最近7日': [moment().subtract('days', 6), moment()],  
                            '最近30日': [moment().subtract('days', 29), moment()]
                        }, 
                        opens : 'right', //日期选择框的弹出位置  
                        buttonClasses : [ 'btn btn-default' ],
                        applyClass : 'btn-small btn-primary blue', 
                        cancelClass : 'btn-small', 
                        separator : ' 至 ',
                        format : dateRangeFormat
                	},
                    function (start, end) {
                        var s = start.format(scope.format);
                        var e = end.format(scope.format);
            			$("#inputDataRangeSampleStart").val(s);
            			$("#inputDataRangeSampleEnd").val(e);
                    });
        		}
        	},
            link: function (scope, element, attrs) {
            	scope.Dragging(scope.getDraggingDialog).enable();
            	CKEDITOR.disableAutoInline = true;
//            	restoreData();
//            	var contenthandle = CKEDITOR.replace( 'contenteditor' ,{
//            		language: 'zh-cn',
//            		contentsCss: ['/thirdparty/bootstrap/css/bootstrap.min.css'],
//            		allowedContent: true
//            	});
            	$("body").css("min-height", $(window).height() - 90);
            	$(".demo").css("min-height", $(window).height() - 160);
            	//拖拽排版功能控件
            	$(".sidebar-nav .lyrow").draggable({
            		connectToSortable: ".demo",
            		helper: "clone",
            		handle: ".drag",
            		start: function(e,t) {
            			if (!scope.startdrag) scope.stopsave++;
            			scope.startdrag = 1;
            		},
            		drag: function(e, t) {
            			t.helper.width(400)
            		},
            		stop: function(e, t) {
            			if($("[containerid]").length > 0){
            				var resultFlg=confirm("当前页面已经存在容器布局，是否继续添加？");
            				if(!resultFlg){
            					return;
            				}
            			}
            			$(".lyrow").remove();
            			$(".demo .column").sortable({
            				opacity: .35,
            				connectWith: ".column",
            				start: function(e,t) {
            					if (!scope.startdrag) scope.stopsave++;
            					scope.startdrag = 1;
            				},
            				stop: function(e,t) {
            					if(scope.stopsave>0) scope.stopsave--;
            					scope.startdrag = 0;
            				}
            			});
            			var layoutType = $(this).find("input").val();
            			if(layoutType == "12:12:12"){
            				alert("这是一个大幅上中下结构的布局！");
            			}
            			
            			var parentcontainer = $("[parentcontainerid]");
            			var parentId = parentcontainer.attr("parentcontainerid");
            			var pageId = $("#" + parentId).attr("pageid");
            			var action = "container/saveorupdatefortpl";
            			DataService.saveData(action, {'templateType':layoutType,'pageId':pageId,'parentId':parentId}).then(function (response) {
         					var outputData = response.plain();
         				});
            			if(scope.stopsave>0) scope.stopsave--;
            			scope.startdrag = 0;
            			window.location.reload();
            		}
            	});
            	//拖拽组件功能控件
            	$(".sidebar-nav .box").draggable({
            		connectToSortable: ".column",
            		helper: "clone",
            		handle: ".drag",
            		start: function(e,t) {
            			if (!scope.startdrag) scope.stopsave++;
            			scope.startdrag = 1;
            		},
            		drag: function(e, t) {
            			t.helper.width(400)
            		},
            		stop: function() {
            			scope.handleJsIds();
            			if(scope.stopsave>0) scope.stopsave--;
            			scope.startdrag = 0;
            			var inputDataRangeSample = $(this).find("#inputDataRangeSample");
            			if(inputDataRangeSample){
            				scope.loadDateRangeJs(inputDataRangeSample);
            			}
            		}
            	});
            	scope.initContainer();
            	$('body.edit .demo').on("click","[data-target=#editorModal]",function(e) {
            		e.preventDefault();
            		scope.currenteditor = $(this).parent().parent().find('.view');
            		var eText = scope.currenteditor.html();
//            		contenthandle.setData(eText);
            	});
            	$("#savecontent").click(function(e) {
            		e.preventDefault();
//            		currenteditor.html(contenthandle.getData());
            	});
            	$("[data-target=#downloadModal]").click(function(e) {
            		e.preventDefault();
            		scope.downloadLayoutSrc();
            	});
            	$("[data-target=#sourceModal]").click(function(e) {
            		e.preventDefault();
            		$('#sourceeditor').val($(".demo").html());
            	});
            	$("#savesource").click(function(){
            		$('.demo').html($('#sourceeditor').val());
            		scope.initContainer();
            		return;
            	});
            	$("[data-target=#shareModal]").click(function(e) {
            		e.preventDefault();
            		scope.handleSaveLayout();
            	});
            	$("#download").click(function() {
            		scope.downloadLayout();
            		return false;
            	});
            	$("#downloadhtml").click(function() {
            		scope.downloadHtmlLayout();
            		return false
            	});
            	$("#edit").click(function() {
            		$("body").removeClass("devpreview sourcepreview");
            		$("body").addClass("edit");
            		scope.removeMenuClasses();
            		$(this).addClass("active");
            		return false
            	});
            	$("#clear").click(function (e) {
            	    if (confirm("你是认真的？"))
            	    {
            		    e.preventDefault();
            		    scope.clearDemo()
            	    }
            	});
            	$("#devpreview").click(function() {
            		$("body").removeClass("edit sourcepreview");
            		$("body").addClass("devpreview");
            		scope.removeMenuClasses();
            		$(this).addClass("active");
            		return false
            	});
            	$("#sourcepreview").click(function() {
            		$("body").removeClass("edit");
            		$("body").addClass("devpreview sourcepreview");
            		scope.removeMenuClasses();
            		$(this).addClass("active");
            		return false
            	});
            	$("#fluidPage").click(function(e) {
            		e.preventDefault();
            		scope.changeStructure("container", "container-fluid");
            		$("#fixedPage").removeClass("active");
            		$(this).addClass("active");
            		scope.downloadLayoutSrc()
            	});
            	$("#fixedPage").click(function(e) {
            		e.preventDefault();
            		scope.changeStructure("container-fluid", "container");
            		$("#fluidPage").removeClass("active");
            		$(this).addClass("active");
            		scope.downloadLayoutSrc()
            	});
            	$(".nav-header").click(function() {
            		$(".sidebar-nav .boxes, .sidebar-nav .rows").hide();
            		$(this).next().slideDown(300,function(){
            			var dialogHeight = $(this).parent().parent().height() + 100;
            			$(this).parents(".dialog").css("height", dialogHeight + "px");
            		})
            	});
            	$('#undo').click(function(){
            		scope.stopsave++;
            		if (scope.undoLayout()) scope.initContainer();
            		scope.stopsave--;
            	});
            	$('#redo').click(function(){
            		scope.stopsave++;
            		if (scope.redoLayout()) scope.initContainer();
            		scope.stopsave--;
            	});
            	scope.removeElm();
            	scope.gridSystemGenerator();
            	setInterval(function() {
//            		handleSaveLayout()
            	}, scope.timerSave);
            }
        };
    }])
;