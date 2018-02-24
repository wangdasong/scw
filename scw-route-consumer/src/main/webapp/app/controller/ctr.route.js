//
angular.module('app')
.config(['$httpProvider', '$routeProvider', '$locationProvider', 'SessionProvider',
  function ($httpProvider, $routeProvider, $locationProvider, SessionProvider) {
//	$locationProvider.html5Mode(false).hashPrefix('!');
//
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
    this.switchPage = function (urlattr) {
        if (urlattr.pageId !== SessionProvider.pageId) {
            SessionProvider.reset();
        }
        SessionProvider.setPageId(urlattr.pageId); 
        $('.bootbox').remove();
    };
    $routeProvider
    .when('/webpage/:pageId', {
        templateUrl: function (urlattr) {
        	switchPage(urlattr);
            return '/app/controller/webpage/webpage.tpl.html';
        },
        controller: 'WebPageController'
    })
    .otherwise({redirectTo: '/'});	
    
    
  }])
;