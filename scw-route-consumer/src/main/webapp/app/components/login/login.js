var curPath=window.document.location.href;  
var pathName=window.document.location.pathname;  
var pos=curPath.indexOf(pathName);  
var basePath=curPath.substring(0,pos);  
var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);  
function getCookie(name)
{
var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
if(arr=document.cookie.match(reg))
return unescape(arr[2]);
else
return null;
}
function getParameterName(str) {
    var start = str.indexOf("=");
    if (start==-1) {
        return str;
    }
    return str.substring(0,start);
}

function getParameterValue(str) {
    var start = str.indexOf("=");
    if (start==-1) {
        return "";
    }
    return str.substring(start+1);
}
function getParameter(name) {
    var url = document.location.href;
    var start = url.indexOf("?")+1;
    if (start==0) {
        return "";
    }
    var value = "";
    var queryString = url.substring(start);
    var paraNames = queryString.split("&");
    for (var i=0; i<paraNames.length; i++) {
        if (name==getParameterName(paraNames[i])) {
            value = getParameterValue(paraNames[i])
        }
    }
    return value;
}
$(document).ready(function() {

    if ($.cookie("remUsr") == "true") {
    	$('#input_login_remember').attr("checked", true);
        $('#input_username').val($.cookie("userName"));
        $('#input_password').val($.cookie("passWord"));
    }
    var serverType = getCookie("serverTypeCookie");
    if(serverType == "" || serverType == null){
    	serverType = "3";
    }
    $('#input_server_type' + serverType).attr("checked","checked");
    $('#input_server_ip').val(getCookie("serverIpCookie"));
    $('#input_server_port').val(getCookie("serverPortCookie"));
    if(parseInt(serverType) > 1){
    	$('#input_server_ip').attr("disabled", true);
    	$('#input_server_port').attr("disabled", true);
    }
    $('#input_server_type1').click(function () {
    	$('#input_server_ip').attr("disabled",false);
    	$('#input_server_port').attr("disabled",false);
    });
    $('#input_server_type2,#input_server_type3').click(function () {
    	$('#input_server_ip').attr("disabled", true);
    	$('#input_server_port').attr("disabled", true);
    });
});



function rememberMeCookie() {
	var rememberMe = $('#input_login_remember').is(':checked');
	
    if (rememberMe) {
        var userName = $('#input_username').val();
        var passWord = $('#input_password').val();
        $.cookie("remUsr", "true", { expires: 7 }); // 存储一个带7天期限的 cookie
        $.cookie("userName", userName, { expires: 7 }); // 存储一个带7天期限的 cookie
        $.cookie("passWord", passWord, { expires: 7 }); // 存储一个带7天期限的 cookie
        
    }
    else {
        $.cookie("remUsr", "false", { expires: -1 });        // 删除 cookie
        $.cookie("userName", '', { expires: -1 });
        $.cookie("passWord", '', { expires: -1 });
        
    }
}







$("body").keydown(function() {
	//按空格键登录--start  如不需要，可以删掉下面这段if体
	/*if(event.keyCode="32"){  //keyCode=32是空格键
		$('#button_login').click();
	}*/
	//按空格键登录--end

});



//登录按钮触发事件
var flag = false;
//登录前检查
function preLogin(){
	//首先执行下检查，用户名密码是否为空
	flag = preCheck();
	//如果合法，则提交登录信息进行验证。
	if(flag){
		loginSubmit();
	}
	
}



//用户名检查标志位
var flag1 = false;
//密码非空检查标志位
var flag2 = false;
var username;
var password;

//登录前检查
function preCheck(){
	username = $('#input_username').val();
	password = $('#input_password').val();
	if ($.trim(username) == '') {
		layer.tips('用户名不能为空！', '#userspan', {
			tips: [2, '#cc4125'],
			time: 9000
		});
		
		
	    //$("#userspan").html("<font color='red'>用户名不能为空</font>");
	    flag1 = false;
	}else{
		flag1 = true;
	}
	
	if ($.trim(password) == "") {
		layer.tips('密码不能为空！', '#pswspan', {
			tips: [2, '#cc4125'],
			time: 9000
		});
        //$("#pswspan").html("<font color='red'>密码不能为空</font>");
        flag2 = false;
    }else{
    	flag2 = true;
    }
	
	return (flag1&&flag2);
	
}

//登录前检查
function preCheckIp(){
	
}

//登录前检查
function preCheckPort(){
	
}








//登录信息提交事件
function loginSubmit(){
    
    var url = "/login/loginAuth";
    var args = {
        "username" : $.trim(username),
        "password" : $.trim(password)
    };
    
    var postData={data:JSON.stringify(args)};
    
    $.post(
        url,
        args,
        function(data,status){
        	
          //由于Controller层DS做了规范，返回类型统一为ResultString类型的对象，故此处需要做一个转换，然后取值，否则会出现undefined现象。	
		  if ($.trim(JSON.parse(data).status) == 1) {
			  
			  layer.confirm('登录验证失败，请检查用户名密码是否有误！', {
			    btn: ['确定','取消'] //按钮
			  }, function(index){
				  $('#input_username').val("");
				  $('#input_password').val("");
				  layer.close(index);
			  }, function(){
			    
			  });
			  
			  //window.location.href = basePath + "/rest/forward/401";
			  flag1 = false;
		  } else if ($.trim(JSON.parse(data).status) == 0) {
			  window.location.href = basePath + "/index.html";
			  flag1 = true;
		  }
        });
	
}





//下面开始找回密码触发事件
var emailToGetBackPWD;
//找回密码触发事件（主事件）
function getBackPWD(){
	emailToGetBackPWD = $('#input_emailGetBack').val();
	var cFlag = checkNSWMail($.trim(emailToGetBackPWD));
	
	if(cFlag){
	    var url = "/rest/login/getBackPWD";
	    var args = {
	        "email" : $.trim(emailToGetBackPWD)
	    };
	    var postData={data:JSON.stringify(args)};
	    $.post(
	        url,
	        postData,
	        function(data,status){
			  if ($.trim(JSON.parse(data).status) == 1) {
				  
				  layer.msg('找回密码失败，请联系管理员，即将跳转到登录页面！', {
					  time: 0 //不自动关闭
					  ,btn: ['确定','取消，留在本页']
					  ,yes: function(index){
					    layer.close(index);
					    window.location.href = basePath + "/rest/forward/login";
					  }
					});
			  } else if ($.trim(JSON.parse(data).status) == 0) {
				  layer.msg('恭喜你！密码找回成功，即将跳转到登录页面！请查收您的邮箱以接收密码重置请求。', {
					  time: 0 //不自动关闭
					  ,btn: ['确定']
					  ,yes: function(index){
					    layer.close(index);
					    window.location.href = basePath + "/rest/forward/login";
					  }
				  });
			  }
	        });
		
	}else{
		return;
	}
	
	
}



function checkMail(mail) {
	 var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	 if (filter.test(mail)){
		 return true;
	 }else {
		alert('您输入的电子邮箱格式非法');
	 	return false;
	 }
}

function checkNSWMail(mail) {
	 var filter  = /^([a-zA-Z0-9_\.\-])+\@(NSW+\.)+(cc)+$/;
	 
	 if (filter.test(mail)){
		 return true;
	 }else {
		alert('您输入的邮箱地址非您的官方邮箱（@cpcsc.cc）');
		return false;
	 }
}












//下面开始修改密码部分验证及提交
var regUsername ;
var registFlag = false;
var regPassword;
var regRePassword;






var unameFlag;
//注册表单用户名检查
function checkUname(){
	unameFlag = false;
	regUsername = $('#input_register_username').val();
	var uname = $.trim(regUsername);
	if( uname != '' ){

		var url = "/rest/login/checkUnameExist";
		var args = {
				"username" : $.trim(uname)
		};
		var postData={data:JSON.stringify(args)};
		$.post(
			url,
			postData,
			function(data,status){
				if ($.trim(JSON.parse(data).status) == 0) {
					layer.tips('很遗憾！该用户名不存在，请您确定是否输入有误！', '#input_register_username', {
						tips: [2, '#cc4125'],
						time: 9000
					});
				} else if ($.trim(JSON.parse(data).status) == 1) {
					layer.tips('恭喜您，该用户名存在。', '#input_register_username', {
						tips: [2, '#3595CC'],
						time: 4000
					});
					unameFlag = true;
				}
			});
		
	
	}else{
		layer.tips('用户名不可为空！', '#input_register_username', {
		  tips: [2, '#cc4125'],
		  time: 60000
		});
	}
	
}



var pwdFlag;
//注册表单密码和密码确认文本框输入是否一致检查
function checkPwd(){
	pwdFlag = false;
	regPassword = $('#input_register_password').val();
	var pwd = $.trim(regPassword);
	regRePassword = $('#input_register_pwdagain').val();
	var rePwd = $.trim(regRePassword);
	var preCheckFlag = preCheckPwd();
	
	if (preCheckFlag) {
		if (pwd==rePwd) {
			pwdFlag = true;
			layer.tips('恭喜您，密码格式合法。', '#input_register_pwdagain', {
				tips: [2, '#3595CC'],
				time: 4000
			});
		}else{
			layer.tips('两次输入密码不一致，请检查后重新输入！', '#input_register_pwdagain', {
				tips: [2, '#cc4125'],
				time: 4000
			});
		}
	}else{
		layer.tips('密码不可以为空格或汉字，亦不可为空，请重新检查后输入！', '#input_register_pwdagain', {
			tips: [2, '#cc4125'],
			time: 4000
		});
	}
}

//修改云服务连接
function editServer(){
	var serverType = $("input[name='input_server_type']:checked").val();
	var serverIp = $('#input_server_ip').val();
	var serverPort = $('#input_server_port').val();
	if (serverType) {
	    var url = "/rest/login/editSaba";
	    var args = {
	    	"serverType" : serverType,
	        "serverIp" : serverIp,
	        "serverPort" : serverPort,
	    };
	    var postData={data:JSON.stringify(args)};
	    $.post(
	        url,
	        postData,
	        function(data, status){
			  if ($.trim(JSON.parse(data).status) == 0) {
			  	layer.msg('服务连接修改成功！', {
					  time: 0 //不自动关闭
					  ,btn: ['确定']
					  ,yes: function(index){
					    layer.close(index);
					  }
					});
			  }
	        });
	}else{
		layer.msg('提交信息有误，请检查！');
	}
	
}

//修改密码
function editPwd(){
	var uname = $.trim(regUsername);
	var password = $.trim(regPassword);
	
	if (pwdFlag & unameFlag) {
	    var url = "/rest/login/editPassword";
	    var args = {
	    	"username" : uname,
	        "password" : password
	    };
	    
	    var postData={data:JSON.stringify(args)};
	    
	    $.post(
	        url,
	        postData,
	        function(data,status){
	          //alert("数据：" + data + "\n状态：" + status);
			  if ($.trim(JSON.parse(data).status) == 1) {
				layer.msg('修改密码失败，请联系管理员，即将跳转到登录页面！', {
				  time: 0 //不自动关闭
				  ,btn: ['确定','取消，留在本页']
				  ,yes: function(index){
				    layer.close(index);

				    window.location.href = basePath + "/rest/forward/login";
				  }
				});
			  } else if ($.trim(JSON.parse(data).status) == 0) {
				  
				  layer.msg('恭喜你！修改密码成功，即将跳转到登录页面！', {
					  time: 0 //不自动关闭
					  ,btn: ['确定']
					  ,yes: function(index){
					    layer.close(index);

					    window.location.href = basePath + "/rest/forward/login";
					  }
					});
			  }
	        });
	}else{
		layer.msg('个人信息有误，请检查！');
	}
	
}







//注册表单页的功能性函数
function preCheckPwd(){
	regPassword = $('#input_register_password').val();
	var pwd = $.trim(regPassword);
	if (checkIsChinese(pwd)) {
		layer.tips('密码不可以用汉字！', '#input_register_password', {
			tips: [2, '#cc4125'],
			time: 10000
		});
		return false;
	}
	
	if (regPassword != pwd) {
		layer.tips('密码不可以用空格！', '#input_register_password', {
			tips: [2, '#cc4125'],
			time: 10000
		});
		return false;
	}
	
	if (pwd == '') {
		layer.tips('密码不可为空！', '#input_register_password', {
			tips: [2, '#cc4125'],
			time: 10000
		});
		return false;
	}
	
	return true;
	
	
}



function checkIsChinese(s) {
    var patrn = /[^\x00-\x80]/;
    if (!patrn.exec(s)) return false
    return true
}












