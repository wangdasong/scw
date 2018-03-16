angular.module('controller.webpage.edit.tools', [])
    .directive('editTools', ['DataService', 'Session','APP_CONFIG', '$route', function (DataService,Session, APP_CONFIG) {
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

        		$scope.removeElm = function () {
        			$(".demo").delegate(".remove", "click", function(e) {
        				e.preventDefault();
        				var currObj = $(this).parent().parent();
                        var viewObject = $(this).parent().next().next();
                        var widgetId = viewObject.attr("widgetId");
                        Session.removeWidget(widgetId);
                        currObj.remove();
        				if (!$(".demo .lyrow").length > 0) {
        					//$scope.clearDemo();
        				}
        			})
        		}
        		$scope.removeMenuClasses = function () {
        			$("#menu-layoutit li button").removeClass("active")
        		}
        		$scope.currenteditor = null;
        		$(window).resize(function() {
        			$("body").css("min-height", $(window).height() - 90);
        			$(".demo").each(function(){
        				$("body").css("min-height", $(window).height() - 90);
        				var dialogHeight = $(this).parent().find('.sidebar-nav').height() + 100;
        				$(this).parent().css("height", dialogHeight + "px");
        			});
        		});

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
        		}
        	},
            link: function (scope, element, attrs) {
            	scope.Dragging(scope.getDraggingDialog).enable();
            	CKEDITOR.disableAutoInline = true;
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
            			window.location.reload();
            		}
            	});
            	//拖拽组件功能控件
            	$(".sidebar-nav .box").draggable({
            		connectToSortable: ".column",
            		helper: "clone",
            		handle: ".drag",
            		start: function(e, t) {
                        // $(".sidebar-nav .view").css("width","500px");
            		},
            		drag: function(e, t) {
            		},
            		stop: function(event, ui) {
            			return;
            		}
            	});

            	$('body.edit .demo').on("click","[data-target=#editorModal]",function(e) {
            		e.preventDefault();
            		scope.currenteditor = $(this).parent().parent().find('.view');
            		var eText = scope.currenteditor.html();
            	});
            	$(".nav-header").click(function() {
            		$(".sidebar-nav .boxes, .sidebar-nav .rows").hide();
            		$(this).next().slideDown(300,function(){
            			var dialogHeight = $(this).parent().parent().height() + 100;
            			$(this).parents(".dialog").css("height", dialogHeight + "px");
            		})
            	});
            	scope.removeElm();
            }
        };
    }])
;