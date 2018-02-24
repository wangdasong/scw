angular.module('service.loading', [])

    .factory('LoadingService', [function () {
        var pleaseWaitDiv = angular.element('<div class="modal"><div class="modal-dialog" style="height:100%"><div class="modal-body center" style="top:30%;"><i class="fa fa-spinner orange2 bigger-200"></i></div></div></div>');

        return {
            show: function (X, Y, tableWidth, tableHeight) {
            	//modal-open
            	if(this.isModelOpen === undefined){
            		this.isModelOpen=$("body").is(".modal-open");
            	}
                pleaseWaitDiv.modal({backdrop: 'static'});
            	if(X && Y){
                    $(".modal-backdrop").css({position: "absolute",'top':X, 'left':Y, width:tableWidth, height:tableHeight});
                    pleaseWaitDiv.css({position: "absolute",'top':X, 'left':Y, width:tableWidth, height:tableHeight});
            	}
            },
            hide: function (domainName, id) {
                pleaseWaitDiv.modal('hide');
                if(this.isModelOpen){
                	$("body").addClass("modal-open");
                }
                delete this.isModelOpen;
            }
        };
    }])
;


//<div class="modal" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h3>Processing...</h3></div><div class="modal-body"><div class="progress progress-striped active"><div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" style="width: 100%;"></div></div></div></div></div></div>