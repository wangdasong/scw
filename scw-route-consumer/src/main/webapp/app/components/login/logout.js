var curPath=window.document.location.href;  
//alert("curPath=" + curPath);
var pathName=window.document.location.pathname;  
//alert("pathName=" + pathName);
var pos=curPath.indexOf(pathName);  
//alert("pos=" + pos);
var basePath=curPath.substring(0,pos);  
//alert("basePath=" + basePath);

var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);  
//alert("projectName=" + projectName);  


function logout(){
    
    var url = "/logout";
    
    /*
    $.ajax({
        cache: true,
        type: "POST",
        url:url,
        data:null,        //$('#yourformid').serialize(),// 你的formid
        async: false,
        error: function(request) {
            alert("C error");
            window.location.href = basePath + "/rest/page/401";
        },
        success: function(data) {
        	alert("success  is");
        	window.location.href = basePath + "/rest/page/4042";
        }
    });
    
    */
    
    
    
    $.post(
        url,
        null,
        function(data,status){
          //alert("数据：" + data + "\n状态：" + status);
		  //if ($.trim(data) == "failure") {
          alert(data);
        });

}


