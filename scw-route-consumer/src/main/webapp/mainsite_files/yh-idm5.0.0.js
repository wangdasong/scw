(function(window){
	if(window.idm === undefined){
		window.idm = {};
	}
	idm.encrypt = {
		encode:false,//是否启用加密
		publickey:"",
		instance:null,
		rsa:function(str){
			if(this.encode && !this.instance){//第一次初始化
				this.instance = new JSEncrypt();
				this.instance.setPublicKey(this.publickey);
			}
			if(str && this.encode && this.instance){
				str = this.instance.encrypt(str);
			}
			return str;
		}
	};
	idm.url = "";
	//相关配置
	var configs = {
		debug: false,//是否启用debug
		servicecode:'',//接入代码
		valipass:false,//是否认证通过
		errcode:{},//错误码
		publickey:'',
		models:{//模块
			favorite:function(){return idm.url+'/static/js/yh-favorite.js'}
		},
		encrypturl:function(){return idm.url+'/static/js/jsencrypt.js'},
		valisignurl:function(){return idm.url+'/js/valisign'},//签名验证
		ticketloginurl:function(){return idm.url+'/js/ticketlogin'},
		loginurl:function(){return idm.url+'/js/login'},
		isloginurl:function(){return idm.url+'/js/islogin'},
		logouturl:function(){return idm.url+'/js/logout'},
		infourl:function(){return idm.url+'/js/userinfo'},
		openregurl:function(){return idm.url+'/user/reg'},
		openloginurl:function(){return idm.url+'/sso/login'},
		openhomeurl:function(){return idm.url+'/user/home'},
		openediturl:function(){return idm.url+'/user/edit'}
	};
	
	//初始化配置认证
	idm.config = function(options){
		if(options !== undefined){
			if(options.debug){
				configs.debug = true;
			}
			var servicecode = options.servicecode;
			var time = options.time;
			var sign = options.sign;
			//初始化回调等参数
			idm.url = options.url;
			idm.callback.success = options.success;
			idm.callback.fail = options.fail;
			//回调之前
			idm.callback.before = function(issucc,resJson){
				if(issucc){
					configs.valipass = true;
					if(resJson && resJson.encode){//需要rsa加密
						idm.load.addScript(configs.encrypturl());
						idm.encrypt.encode = true;
						idm.encrypt.publickey = resJson.publickey;
						delete resJson.encode;
						delete resJson.publickey;
					}
				}
			};
			//简单验证
			if(!servicecode || !time || !sign){
				configs.errcode = {code:'config_sign_fail',msg:'初始化配置信息失败，认证参数为空'};
				idm.callback.call(false,configs.errcode);
				return ;
			}
			if(!idm.url){
				configs.errcode = {code:'config_url_null',msg:'初始化配置信息失败，url参数为空'};
				idm.callback.call(false,configs.errcode);
				return ;
			}
			configs.servicecode = servicecode;
			//加载其他相应模块
			var models = options.models;
			if(models){
				$(models).each(function(i,v){
					try {
						idm.load.addScript(configs.models[v]());
					} catch (e) {
					}
				})
			}
			//异步ajax请求
			var domain = document.domain;
			var url = configs.valisignurl() +"?servicecode="+servicecode+"&time="+time+"&sign="+sign+"&domain="+domain;
			idm.ajaxRequest(url);
		}
	};
	//回调
	idm.callback = {
		success:function(){//成功ajax回调事件
			
		},
		fail:function(){//失败ajax回调
			
		},
		before:function(issuccess,jsonRes){//回调之前
			
		},
		call:function(issuccess,jsonRes){//回调交互总入口
			try {
				if(jsonRes && typeof jsonRes == "string"){
					jsonRes = eval("("+jsonRes+")");
				}
			} catch (e) {
				console.log(e);
				jsonRes={code:'exception',msg:'程序异常'};
			}
			var msg = "失败";
			if(issuccess){
				msg = "成功";
			}
			idm.log("请求"+msg+",返回值：", jsonRes);
			idm.callback.before(issuccess,jsonRes);
			if(issuccess){
				idm.callback.success(jsonRes);
			}else{
				idm.callback.fail(jsonRes);
			}
		}
	};
	
	idm.user={//用户相关对外接口
		callbefore:function(options){
			idm.callback.success = options.success;
			idm.callback.fail = options.fail;
			if(configs.valipass == false){
				idm.callback.call(false,configs.errcode);
			}
			return configs.valipass;
		},
		ticketlogin: function(options){//票据登录
			if(this.callbefore(options) == false){
				return;
			}
			//异步ajax请求
			var url = configs.ticketloginurl();
			if(options && options.ticket){
				url = url + "?servicecode="+configs.servicecode+"&ticket="+options.ticket;
			}
			idm.ajaxRequest(url);
		},
		login: function(options){//票据登录
			if(this.callbefore(options) == false){
				return;
			}
			//异步ajax请求
			var url = configs.loginurl();
			var getticket = false;
			if(!options && !options.loginname && !options.password){
				idm.callback.call(false,{code:'login_args_null',msg:'用户名或者密码不能为空'});
				return ;
			}
			
			if(options && options.getticket){
				getticket = true;
			}
			
			var password = idm.encrypt.rsa(options.password);
			url = url + "?servicecode="+configs.servicecode+"&loginname="+encodeURIComponent(options.loginname)+"&password="+encodeURIComponent(password)+"&getticket="+getticket;
			idm.ajaxRequest(url);
		},
		loginapp: function(options){
			var loginappUrl = configs.openloginurl();
			loginappUrl = loginappUrl+"?servicecode="+configs.servicecode+"&gourl="+window.location.href;
			window.location.replace(loginappUrl);
		},
		islogin: function(options){//票据登录
			if(this.callbefore(options) == false){
				return;
			}
			//异步ajax请求
			var url = configs.isloginurl();
			var userinfo = false;
			var getticket = false;
			url = url + "?servicecode="+configs.servicecode;
			if(options && options.userinfo){
				userinfo = true;
			}
			if(options && options.getticket){
				getticket = true;
			}
			url = url + "&userinfo="+userinfo+"&getticket="+getticket;
			idm.ajaxRequest(url);
		},
		logout: function(options){//登出
			if(this.callbefore(options) == false){
				return;
			}
			//回调之前
			idm.callback.before = function(issucc,resJson){
				if(issucc){
					if(resJson && resJson.logouturls){//需要rsa加密
						$.each(resJson.logouturls,function(i,v){
							idm.load.addScript(v);
						});
						delete resJson.logouturls;
					}
				}
			};
			//异步ajax请求
			var url = configs.logouturl();
			idm.ajaxRequest(url);
		},
		info: function(options){//获取用户信息
			if(this.callbefore(options) == false){
				return;
			}
			//异步ajax请求
			var url = configs.infourl();
			url = url + "?servicecode="+configs.servicecode;
			idm.ajaxRequest(url);
		},
		openreg: function(options){//打开注册页面
			var url = configs.openregurl()+"?servicecode="+configs.servicecode;
			if(options){
				if(options.gourl){
					url = url + "&gourl="+encodeURIComponent(options.gourl);
				}
				if(options.extargs){
					url = url + "&extargs="+encodeURIComponent(options.extargs);
				}
			}
			if(options && options.redirect){
				var l = top.location || self.location;
				l.href = url;
			}else{
				window.open(url);
			}
		},
		openlogin: function(options){//打开登录界面
			var url = configs.openloginurl()+"?servicecode="+configs.servicecode;
			if(options){
				if(options.gourl){
					url = url + "&gourl="+encodeURIComponent(options.gourl);
				}
				if(options.extargs){
					url = url + "&extargs="+encodeURIComponent(options.extargs);
				}
			}
			if(options && options.redirect){
				var l = top.location || self.location;
				l.href = url;
			}else{
				window.open(url);
			}
		},
		open: function(options){//打开用户中心页面
			//TODO 判断用户是否登录
			var url = configs.openhomeurl()+"?servicecode="+configs.servicecode;
			if(options){
				if(options.ticket){
					url = url + "&ticket="+options.ticket;
				}
				if(options.gourl){
					url = url + "&gourl="+encodeURIComponent(options.gourl);
				}
			}
			if(options && options.redirect){
				var l = top.location || self.location;
				l.href = url;
			}else{
				window.open(url);
			}
		},
		openedit: function(options){//用户用户编辑页面
			//TODO 判断用户是否登录
			var url = configs.openediturl()+"?servicecode="+configs.servicecode;
			if(options){
				if(options.ticket){
					url = url + "&ticket="+options.ticket;
				}
				if(options.gourl){
					url = url + "&gourl="+encodeURIComponent(options.gourl);
				}
			}
			if(options && options.redirect){
				var l = top.location || self.location;
				l.href = url;
			}else{
				window.open(url);
			}
		}
	};
	//日志输出
	idm.log = function(errorMsg, data){
		if(configs.debug){
			var msg = errorMsg + (data === undefined ? '' : (typeof data == 'object' ? JSON.stringify(data) : data));
			alert(msg);
		}
	}
	//ajax异步请求
	idm.ajaxRequest = function(url){
		idm.load.editScript(url);
	}
	//动态加载
	idm.load = {
		addStyle:function(href){
			var style;
			var styleElements = document.getElementsByTagName("link");
			if(styleElements){
				var l = styleElements.length;
				for (var i = 0; i < l; i++) {
					if(styleElements[i].href == href)
						return ;
				}
			}
			try {
				style = document.createElement("link");
				style.type = "text/css";
				style.rel="stylesheet";
				style.href = href;
				document.getElementsByTagName("head")[0].appendChild(style);
			} catch (e) {
				// TODO: handle exception
			}
		},
		addScript:function(src){
			var script;
			var scriptElements = document.getElementsByTagName("script");
			if(scriptElements){
				var l = scriptElements.length;
				for (var i = 0; i < l; i++) {
					if(scriptElements[i].src == src)
						return ;
				}
			}
			try {
				script = document.createElement("script");
				script.type = "text/javascript";
				script.src = src;
				document.getElementsByTagName("HEAD")[0].appendChild(script);
			} catch (e) {
				// TODO: handle exception
			}
		},
		
		createHidIframe:function(src){
			if(document.getElementById(YH.config.hidIframeName)){
				document.getElementById(YH.config.hidIframeName).src = src;
			}
			try {
				var iframe = document.createElement("iframe");
				iframe.src = src;
				iframe.setAttribute("class","test");
				document.getElementsByTagName("body")[0].appendChild(iframe);
			} catch (e) {
				// TODO: handle exception
			}
		},
		
		editScript:function(src){
			var scriptElement = document.getElementById("_ssoedit");
			if(scriptElement){
				scriptElement = scriptElement.parentNode.removeChild(scriptElement);
			}
			if(src.indexOf("?") == -1){
				src += "?1=1";
			}
			src += "&rd="+Math.random();
			var script;
			try {
				script = document.createElement("script");
				script.type = "text/javascript";
				script.src = src;
				script.id = "_ssoedit";
				document.getElementsByTagName("HEAD")[0].appendChild(script);
			} catch (e) {
				// TODO: handle exception
			}
		}
	};
	
	function Base64() {
	    // private property
	    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	 
	    // public method for encoding
	    this.encode = function (input) {
	        var output = "";
	        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	        var i = 0;
	        input = _utf8_encode(input);
	        while (i < input.length) {
	            chr1 = input.charCodeAt(i++);
	            chr2 = input.charCodeAt(i++);
	            chr3 = input.charCodeAt(i++);
	            enc1 = chr1 >> 2;
	            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	            enc4 = chr3 & 63;
	            if (isNaN(chr2)) {
	                enc3 = enc4 = 64;
	            } else if (isNaN(chr3)) {
	                enc4 = 64;
	            }
	            output = output +
	            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
	            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
	        }
	        return output;
	    }
	 
	    // public method for decoding
	    this.decode = function (input) {
	        var output = "";
	        var chr1, chr2, chr3;
	        var enc1, enc2, enc3, enc4;
	        var i = 0;
	        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	        while (i < input.length) {
	            enc1 = _keyStr.indexOf(input.charAt(i++));
	            enc2 = _keyStr.indexOf(input.charAt(i++));
	            enc3 = _keyStr.indexOf(input.charAt(i++));
	            enc4 = _keyStr.indexOf(input.charAt(i++));
	            chr1 = (enc1 << 2) | (enc2 >> 4);
	            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	            chr3 = ((enc3 & 3) << 6) | enc4;
	            output = output + String.fromCharCode(chr1);
	            if (enc3 != 64) {
	                output = output + String.fromCharCode(chr2);
	            }
	            if (enc4 != 64) {
	                output = output + String.fromCharCode(chr3);
	            }
	        }
	        output = _utf8_decode(output);
	        return output;
	    }
	 
	    // private method for UTF-8 encoding
	    _utf8_encode = function (string) {
	        string = string.replace(/\r\n/g,"\n");
	        var utftext = "";
	        for (var n = 0; n < string.length; n++) {
	            var c = string.charCodeAt(n);
	            if (c < 128) {
	                utftext += String.fromCharCode(c);
	            } else if((c > 127) && (c < 2048)) {
	                utftext += String.fromCharCode((c >> 6) | 192);
	                utftext += String.fromCharCode((c & 63) | 128);
	            } else {
	                utftext += String.fromCharCode((c >> 12) | 224);
	                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	                utftext += String.fromCharCode((c & 63) | 128);
	            }
	 
	        }
	        return utftext;
	    }
	 
	    // private method for UTF-8 decoding
	    _utf8_decode = function (utftext) {
	        var string = "";
	        var i = 0;
	        var c = c1 = c2 = 0;
	        while ( i < utftext.length ) {
	            c = utftext.charCodeAt(i);
	            if (c < 128) {
	                string += String.fromCharCode(c);
	                i++;
	            } else if((c > 191) && (c < 224)) {
	                c2 = utftext.charCodeAt(i+1);
	                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
	                i += 2;
	            } else {
	                c2 = utftext.charCodeAt(i+1);
	                c3 = utftext.charCodeAt(i+2);
	                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
	                i += 3;
	            }
	        }
	        return string;
	    }
	}
	
	idm.base64 = new Base64();
	
	return window.idm;
})(this);