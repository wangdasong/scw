angular.module('controller.webpage.container.widget.file', [])
    .directive('widgetFile', ['DataService', 'APP_CONFIG', function (DataService) {
        return {
            restrict: 'EA',
            templateUrl: '/app/controller/widget/fileupload/widget.file.tpl.html',
            replace: false,
            scope: {
            },
            link: function (scope, element, attrs) {
            	var currWidgetId = attrs.id;
        		scope.id = currWidgetId;
            	DataService.getWidgetDetailById(currWidgetId).then(function (response) {
            		var data = response.plain();
            		scope.attConfigs = data.attConfigs;
            		var doInitvalue = function(initvalue){
                		if(initvalue){
                    		scope.initvalue = initvalue;
                		}else {
                			scope.initvalue = "";
                		}
            		};
            		scope.$on("widget.reload.initvalue",function(e, data){
                		doInitvalue(attrs.initvalue);
                		scope.$apply();
            		});
            		doInitvalue(attrs.initvalue);
            		for(index in data.attConfigs){
                		var currAttConfig = data.attConfigs[index];
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
            			if(currAttConfigType == "height"){
            				scope.height = currAttConfig.attValue;
            			}
            			if(currAttConfigType == "regular"){
            				scope.regular = currAttConfig.attValue;
            			}
            		}
    				$('#input' + scope.id).ace_file_input({
    					no_file:'无文件 ...',
    					btn_choose:'选择',
    					btn_change:'更换',
    					droppable:false,
    					before_change:function(){
                			var fileWidget = $('#input' + scope.id);
                            var el = $("#input" + currWidgetId);
                            var $form = el.parents('form');
                            if (el.val() == '') {
                                return false;
                            }
                            $form.attr('action', "/rest/api/" + COMMON.getProviderCode() + "/uploadfile");
                            var submitStatus = "";
                            $form.ajaxSubmit({
                                type: 'POST',
                                uploadProgress: function (evt, pos, tot, percComplete) {
                                	if(submitStatus == ""){
                                    	$form.hide();
                                    	$("#progress" + currWidgetId).show();
                                	}
                                	submitStatus = "uploading";
                                	
                                    scope.$apply(function () {
                                        scope.progress = percComplete;
                                    });

                                    if (100 === percComplete) {
                                    	$form.show();
                                    	$("#progress" + currWidgetId).hide();
                                        scope.$apply(function () {
                                            scope.progress = 0;
                                        });
                                        submitStatus = "";
                                    }
                                },
                                error: function (evt, statusText, response, form) {
                                },
                                success: function (response, status, xhr, form) {
                                    $form.removeAttr('action');
                                    var uploadurl = response;
                                    $("#hidden" + currWidgetId).val(uploadurl);
                                }
                            });
                			return true;
                		},
    					thumbnail:false //| true | large
    					//whitelist:'gif|png|jpg|jpeg'
    					//blacklist:'exe|php'
    					//
    				});
            	});            	
            }
        };
    }])
;