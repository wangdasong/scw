angular.module('controller.webpage.container.widget.radio.element', [])
.directive('widgetRadioElement', ['DataService', 'APP_CONFIG', function (DataService) {
    return {
        restrict: 'A',
        templateUrl: 'app/controller/widget/radiobox/widget.radio.element.tpl.html',
        replace: false,
        scope: {
        },
        link: function (scope, element, attrs) {
        	var currElementId = attrs.id;
        	DataService.getAttConfigsByBelongId(currElementId).then(function (response) {
				eleAttConfigs = response.plain();
				scope.name = attrs.name;
				scope.id = currElementId;
    			for(index in eleAttConfigs){
    				var currEleAttConfig = eleAttConfigs[index];
    				var currEleAttConfigType = currEleAttConfig.type;
        			if(currEleAttConfigType == "label"){
        				scope.label = currEleAttConfig.attValue;
        			}
        			if(currEleAttConfigType == "value"){
        				scope.value = currEleAttConfig.attValue;
        			}
    			}
			});
        }
    };
}])
;