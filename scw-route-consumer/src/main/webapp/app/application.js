

var __GLOBE = {
    BASE_PATH: '/',
    ORIGIN: window.location.origin
};

angular.module('shared.application', [])
    .constant('APP_CONFIG', {
        DEBUG: false,
        DATE_FORMAT: 'YYYY-MM-DD',
        DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
        TIME_FORMAT: 'HH:mm:ss',
        HTTP_STATUS: {
            OK: 200,
            UNAUTHORIZED: 401,
            SERVER_ERROR: 500
        }
    })

    .directive('includeReplace', function () {
        return {
            //require: 'ngInclude',
            restrict: 'A', /* optional */
            link: function (scope, el, attrs) {
                el.replaceWith(el.children());
            }
        };
    })

    .run(function($rootScope, $location, LoadingService){

        $rootScope.$on('$routeChangeStart', function(){
            LoadingService.show();
        });
        $rootScope.$on('$routeChangeSuccess', function(){
            if($location.path() === '/'){
                LoadingService.hide();
            }
        });
        $rootScope.$on('$routeChangeError', function(){
            LoadingService.hide();
        });
        $rootScope.$on('$routeUpdate', function(){
            LoadingService.hide();
        });

        $rootScope.$on('$viewContentLoaded', function(){
            LoadingService.hide();
        });
        
    })
;