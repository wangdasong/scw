﻿jQuery.fn.flash = function( duration ){
	var timer = null;   //定义时间器  
	var i = 0;   
	clearInterval(timer); //先清空时间器   
	var currObj = $(this)
	timer = setInterval(function () {
		if(i++ % 2 == 0){
			currObj.removeClass("alert-danger");
		}else{
			currObj.addClass("alert-danger");
		}
		i > 8 && (clearInterval(timer))  //控制闪烁次数  
	}, duration );
}
//判断是否有初始数据
function getQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var hrefList = window.location.href.split("?");
     if(hrefList.length < 2){
    	 return null;
     }
     var r = hrefList[1].match(reg);
     if(r!=null)return  (r[2]); return null;
}
JsonToHtml={
	init:function(data, parent){// jsonDB,父元素
		for(var attr in data){
			if(data[attr]["id"]){var num=1}else{var num=data[attr]["num"]||1}// 如果存在id,则循环默认为1,因为id不可重复
			for(var j=0;j<num;j++){
				var obj= document.createElement(attr);
				parent ? parent.appendChild(obj) : document.body.appendChild(obj);// 递归时传入父元素,没有则默认从body输出
				for(var attr2 in data[attr]){
					var _tempAttr=data[attr][attr2];
					switch(attr2){
					case "id":
						obj.id=_tempAttr;
						break;
						case "className": // 支持多个class传入~简了点~
							if(_tempAttr.length && _tempAttr.pop){
								for(var k=0;k<_tempAttr.length;++k){
									obj.className= obj.className+" "+_tempAttr[k] ;
								}
							}else{
								obj.className =_tempAttr;
							}
							break;
						case "sub": // 如果有子节点则开始递归
							for(var i=0;i<_tempAttr.length;i++){
								_tempAttr[i].sub ? this.init(_tempAttr[i]) : this.init(_tempAttr[i],obj)
							}
							break;
						case "con":// 设置内容,可以生成新的子元素
							obj.innerHTML=_tempAttr;
							break;
						case "num":
							break;
						case "fn":// 绑定方法
							for(var fns in _tempAttr){
								if (window.addEventListener) {
									obj.addEventListener(fns, _tempAttr[fns], false);
								} else {
									if (window.attachEvent) {
										obj.attachEvent("on" + fns, _tempAttr[fns]);
									}
								}
							}
							break;
						default : // 设置属性
							obj.setAttribute(attr2,_tempAttr);break;
					}
				}
			}
		}
		return this;
	}
} 

//重新加载拖拽JS
var reloadNestable = function(){
	$('.dd').nestable();
	$('.dd-handle a').on('mousedown', function(e){
		e.stopPropagation();
	});
	$('[data-rel="tooltip"]').tooltip();
}
//打开神秘的编辑模式
var mypwd="";
$(document).keypress(function(event) {
	var code = (event.keyCode ? event.keyCode : event.which);
	if (code == 66){
		mypwd = mypwd + "b";
	}else if(code == 79){
		mypwd = mypwd + "o";
	}else if(code == 82){
		mypwd = mypwd + "r";
	}else if(code == 85){
		mypwd = mypwd + "u";
	}else if(code == 79){
		mypwd = mypwd + "o";
	}else if(code == 66){
		mypwd = mypwd + "b";
	}else if(code == 79){
		mypwd = mypwd + "o";
	}else if(code == 76){
		mypwd = mypwd + "l";
	}else if(code == 85){
		mypwd = mypwd + "u";
	}else if(code == 79){
		mypwd = mypwd + "o";
	}else if(code == 77){
		mypwd = mypwd + "m";
	}else if(code == 73){
		mypwd = mypwd + "i";
	}else{
		mypwd = "";
	}
	if(mypwd == "boruoboluomi"){
		alert("恭喜您，神奇的编辑模式已经打开了！");
		reloadJs("visualEdit");
	}
});  

try {
    if ($.browser.msie && $.browser.version == "6.0") {
        document.execCommand("BackgroundImageCache", false, true)
    }
} catch (e) { }
if (typeof COMMON == "undefined") {
    COMMON = {};
    COMMON.top = top
}

COMMON.getProviderCode = function() {
	var providerCode = COMMON.Cookie.get("subsysCode");
    if(providerCode == "common" || $("#webpage-editor-flag").length > 0){
        providerCode = "api-webeditor/";
    }
    if(providerCode == "api-auth"){
        providerCode = "api-auth/uaa/";
    }
	return providerCode;
}
COMMON.createUUID = function(){
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
}
COMMON.getMsgFromObj = function(resultObj){
	var reMsg = null;
	if(resultObj.errors && resultObj.errors.length > 0){
		for(var i = 0; i < resultObj.errors.length; i ++){
			reMsg = reMsg + resultObj.errors[i] + "\n";			
		}
	}else if(resultObj.msg){
		reMsg = resultObj.msg
	}
	return reMsg;
}
COMMON.getMsgFromStr = function(resultStr){
	if(resultStr && eval("(" + resultStr +")")){
		var resultObj = eval("(" + resultStr +")");
		return COMMON.getMsgFromObj(resultObj);
	}
}
COMMON.openLog = false;
COMMON.isDbg = function () {
    var a = COMMON.Cookie.get("_common_debug");
    return a == "true"
};
COMMON.logDbg = function () {
    var d = COMMON.isDbg();
    if (d || COMMON.openLog) {
        var a = $.makeArray(arguments);
        if (COMMON.isIE()) {
            var b = '<div id="commonDebugMsg" style="position:absolute; top:30px; left:45%; margin:0px auto; width:auto; height:auto; z-index:9999;"></div>';
            var c = COMMON.top.$("#commonDebugMsg");
            if (c.length == 0) {
                c = COMMON.top.$(b);
                c.appendTo("body")
            }
            COMMON.top.$('<div class="tips" style="position:relative; top:0px; left:-50%; width:auto; _width:50px; height:24px; margin:3px 0; line-height:24px; color:#000000; border:1px solid #EAEA00; background:#FFFFC4; z-index:9999;"><div class="msg" style="width:auto; margin:0 3px; height:24px; line-height:24px; word-break:keep-all; white-space:nowrap;">' + a.join("") + "</div></div>").appendTo(c)
        } else {
            console.log(a.join(""))
        }
    }
};
COMMON.logAlert = function () {
    var b = COMMON.Cookie.get("_common_debug");
    if (b == "true" || COMMON.openLog) {
        var a = $.makeArray(arguments);
        alert(a.join(""))
    }
};
COMMON.replaceContentOfURL = function (a) {
    return (a.replace(/((https?|ftp|file):\/\/[-a-zA-Z0-9+&@#\/%?=~_|!:,.;]*)/g, '<a href="$1" target="_blank">$1</a>'))
};
COMMON.getByteLength = function (f, g) {
    var d = 0,
    b, c, a;
    g = g ? g.toLowerCase() : "";
    if (g === "utf-16" || g === "utf16") {
        for (c = 0, a = f.length; c < a; c++) {
            b = f.charCodeAt(c);
            if (b <= 65535) {
                d += 2
            } else {
                d += 4
            }
        }
    } else {
        for (c = 0, a = f.length; c < a; c++) {
            b = f.charCodeAt(c);
            if (b <= 127) {
                d += 1
            } else {
                if (b <= 2047) {
                    d += 2
                } else {
                    if (b <= 65535) {
                        d += 3
                    } else {
                        d += 4
                    }
                }
            }
        }
    }
    return d
};
COMMON.isNull = function (a) {
    return (typeof a == "undefined") || (a == null)
};
COMMON.isDate = function (a) {
    if (a.constructor == Date) {
        return true
    } else {
        return false
    }
};
COMMON.isNumber = function (a) {
    if (/[^\d]/.test(a)) {
        return false
    } else {
        return true
    }
};
COMMON.isFloat = function (a) {
    return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(a)
};
COMMON.isInteger = function (a) {
    return /^-?\d+$/.test(a)
};
COMMON.isLowerCase = function (a) {
    return /^[a-z]+$/.test(a)
};
COMMON.isUpperCase = function (a) {
    return /^[A-Z]+$/.test(a)
};
COMMON.toLowerCaseFirstOne = function (a) {
    if (typeof a === "undefined" || COMMON.isLowerCase(a.charAt(0))) {
        return a
    } else {
        var c = a.substring(0, 1).toLowerCase();
        var b = a.substring(1, a.length);
        return c + b
    }
};
COMMON.toUpperCaseFirstOne = function (a) {
    if (typeof a === "undefined" || COMMON.isUpperCase(a.charAt(0))) {
        return a
    } else {
        var c = a.substring(0, 1).toUpperCase();
        var b = a.substring(1, a.length);
        return c + b
    }
};
COMMON.isDigit = function (a) {
    if (a < "0" || a > "9") {
        return false
    }
    return true
};
COMMON.isLetter = function (a) {
    if ((a < "a" || a > "z") && (a < "A" || a > "Z")) {
        return false
    }
    return true
};
COMMON.isChinese = function (a) {
    if (a < "一" || a > "龥") {
        return false
    }
    return true
};
COMMON.isIp = function (c) {
    if (typeof c != "string" || $.trim(c) == "") {
        return false
    }
    var b = c.split(".");
    if (b.length != 4) {
        return false
    }
    var a = true;
    $.each(b,
    function (d, f) {
        if (!COMMON.isNumber(f) || parseInt(f) < 0 || parseInt(f) > 255) {
            a = false;
            return true
        }
    });
    return a
};
COMMON.isDomain = function (a) {
    if (/^[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9]$/.test(a)) {
        if (a.indexOf("--") >= 0) {
            return false
        }
        return true
    } else {
        return false
    }
};
COMMON.isWord = function (b) {
    var a = /^[a-zA-Z0-9_]+$/;
    return a.test(b)
};
COMMON.isEmail = function (a) {
    var b = /^[a-zA-Z0-9_\&\-\.\+]+@[a-zA-Z0-9][a-zA-Z0-9_\-]*\.[a-zA-Z0-9\-][a-zA-Z0-9_\-\.]*[a-zA-Z0-9 ]$/;
    return b.test(a)
};
COMMON.isEmailDomain = function (a) {
    var b = /^[a-zA-Z0-9][a-zA-Z0-9_\-]*\.[a-zA-Z0-9\-][a-zA-Z0-9_\-\.]*[a-zA-Z0-9]$/;
    return b.test(a)
};
COMMON.isMobile = function (a) {
    var b = /^1\d{10}$/;
    return b.test(a)
};
COMMON.isPhone = function (a) {
    var c = /^([^\d])+([^\d])*([^\d])$/;
    var b = /^([\d\+\s\(\)-])+([\d\+\s\(\)-])*([\d\+\s\(\)-])$/;
    if (c.test(a)) {
        return false
    }
    return b.test(a)
};
COMMON.isUrl = function (d, c) {
    if (typeof c == "undefined") {
        c = true
    }
    if (c && d.length >= 1 && d.charAt(0) == "/") {
        return true
    }
    if (c && d.length >= 1 && d.charAt(0) == "#") {
        return true
    }
    var b = /^(\w+:).+/;
    var a = b.test(d);
    return a
};
COMMON.fixUrl = function (a, b) {
    if (COMMON.isUrl(a, b)) {
        return a
    }
    return "http://" + a
};
COMMON.checkBit = function (i, b) {
    var f = true;
    if (i > 2147483647 || i < 0 || b > 2147483647 || b < 0) {
        f = false
    }
    if (f) {
        return (i & b) == b
    }
    var g = i.toString(2);
    var d = b.toString(2);
    if (g.length > 62 || d.length > 62) {
        alert("Does not support more than 62 bit. flagBinary.length=" + g.length + ",bitFlagBinary.length" + d.length + ".");
        return false
    }
    var h = flagLow = bitFlagHight = bitFlagLow = 0;
    if (g.length > 31) {
        var c = g.slice(0, g.length - 31);
        var a = g.slice(g.length - 31);
        h = parseInt(c, "2");
        flagLow = parseInt(a, "2")
    } else {
        flagLow = parseInt(g.slice(0, g.length), "2")
    }
    if (d.length > 31) {
        var c = d.slice(0, d.length - 31);
        var a = d.slice(d.length - 31);
        bitFlagHight = parseInt(c, "2");
        bitFlagLow = parseInt(a, "2")
    } else {
        bitFlagLow = parseInt(d.slice(0, d.length), "2")
    }
    var j = (flagLow & bitFlagLow) == bitFlagLow;
    if (j) {
        j = (h & bitFlagHight) == bitFlagHight
    }
    return j
};
COMMON.andBit = function (b, h) {
    var a = true;
    if (b > 2147483647 || b < 0 || h > 2147483647 || h < 0) {
        a = false
    }
    if (a) {
        return b &= h
    }
    var f = b.toString(2);
    var d = h.toString(2);
    if (f.length > 62 || d.length > 62) {
        alert("Does not support more than 62 bit. flagBinary.length=" + f.length + ",bitFlagBinary.length" + d.length + ".");
        return 0
    }
    var c = flagLow = bitFlagHight = bitFlagLow = 0;
    if (f.length > 31) {
        var g = f.slice(0, f.length - 31);
        var i = f.slice(f.length - 31);
        c = parseInt(g, "2");
        flagLow = parseInt(i, "2")
    } else {
        flagLow = parseInt(f.slice(0, f.length), "2")
    }
    if (d.length > 31) {
        var g = d.slice(0, d.length - 31);
        var i = d.slice(d.length - 31);
        bitFlagHight = parseInt(g, "2");
        bitFlagLow = parseInt(i, "2")
    } else {
        bitFlagLow = parseInt(d.slice(0, d.length), "2")
    }
    flagLow &= bitFlagLow;
    c &= bitFlagHight;
    f = flagLow.toString(2);
    for (; f.length < 31;) {
        f = "0" + f
    }
    f = c.toString(2) + f;
    return parseInt(f, "2")
};
COMMON.orBit = function (b, h) {
    var a = true;
    if (b > 2147483647 || b < 0 || h > 2147483647 || h < 0) {
        a = false
    }
    if (a) {
        return b |= h
    }
    var f = b.toString(2);
    var d = h.toString(2);
    if (f.length > 62 || d.length > 62) {
        alert("Does not support more than 62 bit. flagBinary.length=" + f.length + ",bitFlagBinary.length" + d.length + ".");
        return 0
    }
    var c = flagLow = bitFlagHight = bitFlagLow = 0;
    if (f.length > 31) {
        var g = f.slice(0, f.length - 31);
        var i = f.slice(f.length - 31);
        c = parseInt(g, "2");
        flagLow = parseInt(i, "2")
    } else {
        flagLow = parseInt(f.slice(0, f.length), "2")
    }
    if (d.length > 31) {
        var g = d.slice(0, d.length - 31);
        var i = d.slice(d.length - 31);
        bitFlagHight = parseInt(g, "2");
        bitFlagLow = parseInt(i, "2")
    } else {
        bitFlagLow = parseInt(d.slice(0, d.length), "2")
    }
    flagLow |= bitFlagLow;
    c |= bitFlagHight;
    f = flagLow.toString(2);
    for (; f.length < 31;) {
        f = "0" + f
    }
    f = c.toString(2) + f;
    return parseInt(f, "2")
};
COMMON.renderUEditor = function (b) {
    var a = {
        ueditorId: null,
        setPageChange: null,
        initContent: null,
        minFrameHeight: 0,
        commonscoRichTip: null,
        withPage: null
    };
    $.extend(a, b);
    var c = new baidu.editor.ui.Editor({
        upLoadFlashUrl: "/ajax/upfile_h.jsp?type=50",
        upLoadImageUrl: "/ajax/upimg_h.jsp",
        ueditorChangeEvent: a.setPageChange,
        htmlModuleRichTip: a.commonscoRichTip,
        initialContent: a.initContent,
        minFrameHeight: a.minFrameHeight,
        toolbars: [["shrinkopenup", "removeformat", "|", "bold", "italic", "underline", "|", "fontfamily", "fontsize", "forecolor", "backcolor", "|", "insertorderedlist", "insertunorderedlist", "lineheight", "justifyright", "|", "link", "unlink", "qqservice", "image", "flash", "inserttable", a.withPage, "|", "source", "||", "pasteplain", "|", "selectall", "undo", "redo", "|", "strikethrough", "superscript", "subscript", "horizontal", "|", "indent", "rowspacingtop", "rowspacingbottom", "|", "deletetable", "insertparagraphbeforetable", "insertrow", "deleterow", "insertcol", "deletecol", "mergecells", "mergeright", "mergedown", "splittocells", "splittorows", "splittocols", "|", "fullscreen"]]
    });
    c.render(a.ueditorId);
    return c
};
COMMON.isEnterKey = function (a) {
    if ($.browser.msie) {
        if (event.keyCode == 13) {
            return true
        } else {
            return false
        }
    } else {
        if (a.which == 13) {
            return true
        } else {
            return false
        }
    }
};
COMMON.isNumberKey = function (b, a) {
    if ($.browser.msie) {
        if (a && event.keyCode == 45) {
            return true
        }
        if (((event.keyCode > 47) && (event.keyCode < 58)) || (event.keyCode == 8)) {
            return true
        } else {
            return false
        }
    } else {
        if (a && b.which == 45) {
            return true
        }
        if (((b.which > 47) && (b.which < 58)) || (b.which == 8)) {
            return true
        } else {
            return false
        }
    }
};
COMMON.isNumberKey2 = function (c, a, b) {
    if (a) {
        $(c).val($(c).val().replace(/[^0-9\-]/g, ""))
    } else {
        $(c).val($(c).val().replace(/[^0-9]/g, ""))
    }
};
COMMON.isFloatKey = function (a) {
    if ($.browser.msie) {
        if (((event.keyCode > 47) && (event.keyCode < 58)) || (event.keyCode == 8) || (event.keyCode == 46)) {
            return true
        } else {
            return false
        }
    } else {
        if (((a.which > 47) && (a.which < 58)) || (a.which == 8) || (a.which == 46)) {
            return true
        } else {
            return false
        }
    }
};
COMMON.flashChecker = function () {
    var hasFlash = 0;
    var flashVersion = 0;
    var isIE =
    /*@cc_on!@*/
    0;
    if (isIE) {
        try {
            var swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            if (swf) {
                hasFlash = 1;
                VSwf = swf.GetVariable("$version");
                flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0])
            }
        } catch (ex) { }
    } else {
        if (navigator.plugins && navigator.plugins.length > 0) {
            var swf = navigator.plugins["Shockwave Flash"];
            if (swf) {
                hasFlash = 1;
                var words = swf.description.split(" ");
                for (var i = 0; i < words.length; ++i) {
                    if (isNaN(parseInt(words[i]))) {
                        continue
                    }
                    flashVersion = parseInt(words[i])
                }
            }
        }
    }
    return {
        f: hasFlash,
        v: flashVersion
    }
};
COMMON.isIE = function () {
    return $.browser.msie ? true : false
};
COMMON.isIE6 = function () {
    if ($.browser.msie) {
        if ($.browser.version == "6.0") {
            return true
        }
    }
    return false
};
COMMON.isIE7 = function () {
    if ($.browser.msie) {
        if ($.browser.version == "7.0") {
            return true
        }
    }
    return false
};
COMMON.isIE8 = function () {
    if ($.browser.msie) {
        if ($.browser.version == "8.0") {
            return true
        }
    }
    return false
};
COMMON.isIE9 = function () {
    if ($.browser.msie) {
        if ($.browser.version == "9.0") {
            return true
        }
    }
    return false
};
COMMON.isIE10 = function () {
    if ($.browser.msie) {
        if ($.browser.version == "10.0") {
            return true
        }
    }
    return false
};
COMMON.isIE11 = function () {
    if ($.browser.msie) {
        if ($.browser.version == "11.0" || $.browser.rv) {
            return true
        }
    }
    return false
};
COMMON.isSafari = function () {
    return $.browser.safari ? true : false
};
COMMON.isWebkit = function () {
    return $.browser.webkit ? true : false
};
COMMON.isChrome = function () {
    return $.browser.chrome ? true : false
};
COMMON.isMozilla = function () {
    return $.browser.mozilla ? true : false
};
COMMON.isAppleWebKit = function () {
    var a = window.navigator.userAgent;
    if (a.indexOf("AppleWebKit") >= 0) {
        return true
    }
    return false
};
COMMON.isOpera = function () {
    return $.browser.opera || $.browser.opr ? true : false
};
COMMON.isAndroid = function () {
    return $.browser.android ? true : false
};
COMMON.isIpad = function () {
    return $.browser.ipad ? true : false
};
COMMON.isIphone = function () {
    return $.browser.iphone ? true : false
};
COMMON.BrowserType = {
    UNKNOWN: 0,
    SPIDER: 1,
    CHROME: 2,
    FIREFOX: 3,
    MSIE8: 4,
    MSIE7: 5,
    MSIE6: 6,
    MSIE9: 7,
    SAFARI: 8,
    MSIE10: 9,
    MSIE11: 10,
    OPERA: 11,
    APPLE_WEBKIT: 12
};
COMMON.getBrowserType = function () {
    if (COMMON.isIE6()) {
        return COMMON.BrowserType.MSIE6
    } else {
        if (COMMON.isIE7()) {
            return COMMON.BrowserType.MSIE7
        } else {
            if (COMMON.isIE8()) {
                return COMMON.BrowserType.MSIE8
            } else {
                if (COMMON.isIE9()) {
                    return COMMON.BrowserType.MSIE9
                } else {
                    if (COMMON.isIE10()) {
                        return COMMON.BrowserType.MSIE10
                    } else {
                        if (COMMON.isIE11()) {
                            return COMMON.BrowserType.MSIE11
                        } else {
                            if (COMMON.isMozilla()) {
                                return COMMON.BrowserType.FIREFOX
                            } else {
                                if (COMMON.isOpera()) {
                                    return COMMON.BrowserType.OPERA
                                } else {
                                    if (COMMON.isChrome()) {
                                        return COMMON.BrowserType.CHROME
                                    } else {
                                        if (COMMON.isSafari()) {
                                            return COMMON.BrowserType.SAFARI
                                        } else {
                                            if (COMMON.isAppleWebKit()) {
                                                return COMMON.BrowserType.APPLE_WEBKIT
                                            } else {
                                                return COMMON.BrowserType.UNKNOWN
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
COMMON.Screen = function () {
    return {
        width: window.screen.width,
        height: window.screen.height
    }
};
COMMON.ScreenType = {
    OTHER: 0,
    W1920H1080: 1,
    W1680H1050: 2,
    W1600H1200: 3,
    W1600H1024: 4,
    W1600H900: 5,
    W1440H900: 6,
    W1366H768: 7,
    W1360H768: 8,
    W1280H1024: 9,
    W1280H960: 10,
    W1280H800: 11,
    W1280H768: 12,
    W1280H720: 13,
    W1280H600: 14,
    W1152H864: 15,
    W1024H768: 16,
    W800H600: 17
};
COMMON.getScreenType = function (b, a) {
    if (b == 1920 && a == 1080) {
        return COMMON.ScreenType.W1920H1080
    } else {
        if (b == 1680 && a == 1050) {
            return COMMON.ScreenType.W1680H1050
        } else {
            if (b == 1600 && a == 1200) {
                return COMMON.ScreenType.W1600H1200
            } else {
                if (b == 1600 && a == 1024) {
                    return COMMON.ScreenType.W1600H1024
                } else {
                    if (b == 1600 && a == 900) {
                        return COMMON.ScreenType.W1600H900
                    } else {
                        if (b == 1440 && a == 900) {
                            return COMMON.ScreenType.W1440H900
                        } else {
                            if (b == 1366 && a == 768) {
                                return COMMON.ScreenType.W1366H768
                            } else {
                                if (b == 1360 && a == 768) {
                                    return COMMON.ScreenType.W1360H768
                                } else {
                                    if (b == 1280 && a == 1024) {
                                        return COMMON.ScreenType.W1280H1024
                                    } else {
                                        if (b == 1280 && a == 960) {
                                            return COMMON.ScreenType.W1280H960
                                        } else {
                                            if (b == 1280 && a == 800) {
                                                return COMMON.ScreenType.W1280H800
                                            } else {
                                                if (b == 1280 && a == 768) {
                                                    return COMMON.ScreenType.W1280H768
                                                } else {
                                                    if (b == 1280 && a == 720) {
                                                        return COMMON.ScreenType.W1280H720
                                                    } else {
                                                        if (b == 1280 && a == 600) {
                                                            return COMMON.ScreenType.W1280H600
                                                        } else {
                                                            if (b == 1152 && a == 864) {
                                                                return COMMON.ScreenType.W1152H864
                                                            } else {
                                                                if (b == 1024 && a == 768) {
                                                                    return COMMON.ScreenType.W1024H768
                                                                } else {
                                                                    if (b == 800 && a == 600) {
                                                                        return COMMON.ScreenType.W800H600
                                                                    } else {
                                                                        return COMMON.ScreenType.OTHER
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
COMMON.getCssInt = function (c, b) {
    if (c.css(b)) {
        var a = parseInt(c.css(b).replace("px", ""));
        if (isNaN(a)) {
            return 0
        }
        return a
    } else {
        return 0
    }
};
COMMON.getEventX = function (a) {
    a = a || window.event;
    return a.pageX || a.clientX + document.body.scrollLeft
};
COMMON.getEventY = function (a) {
    a = a || window.event;
    return a.pageY || a.clientY + document.body.scrollTop
};
COMMON.inRect = function (a, b) {
    if (a.x > b.left && a.x < (b.left + b.width) && a.y > b.top && a.y < (b.top + b.height)) {
        return true
    }
    return false
};
COMMON.addUrlParams = function (a, b) {
    if (COMMON.isNull(b)) {
        return a
    }
    if (a.indexOf("?") < 0) {
        return a + "?" + b
    }
    return a + "&" + b
};
COMMON.addArrElementsNoRepeat = function (a, c) {
    if (a.length > 0) {
        var b = 0;
        $.each(a,
        function (d, f) {
            if (a[d] == c) {
                b++
            }
        });
        if (b == 0) {
            a[a.length] = c
        }
    } else {
        a[a.length] = c
    }
    return a
};
COMMON.getUrlRoot = function (a) {
    var b = a.indexOf("://");
    if (b < 0) {
        return a
    }
    b = a.indexOf("/", b + 3);
    if (b < 0) {
        return "/"
    }
    return a.substring(b)
};
COMMON.getUrlParam = function (b, a) {
    var d = b.substring(b.indexOf("?") + 1, b.length).split("&");
    var c;
    $.each(d,
    function (f, h) {
        var g = decodeURIComponent(h.substring(0, h.indexOf("=")));
        if (g === a) {
            c = decodeURIComponent(h.substring(h.indexOf("=") + 1, h.length));
            return false
        }
    });
    return c
};
COMMON.encodeHtml = function (a) {
    return a && a.replace ? (a.replace(/&/g, "&amp;").replace(/ /g, "&nbsp;").replace(/\b&nbsp;+/g, " ").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\\/g, "&#92;").replace(/\'/g, "&#39;").replace(/\"/g, "&quot;").replace(/\n/g, "<br/>").replace(/\r/g, "")) : a
};
COMMON.decodeHtml = function (a) {
    return a && a.replace ? (a.replace(/&nbsp;/gi, " ").replace(/&lt;/gi, "<").replace(/&gt;/g, ">").replace(/&#92;/gi, "\\").replace(/&#39;/gi, "'").replace(/&quot;/gi, '"').replace(/\<br\/\>/gi, "\n").replace(/&amp;/gi, "&")) : a
};
COMMON.encodeHtmlJs = function (a) {
    return a && a.replace ? (a.replace(/\\/g, "\\\\").replace(/\'/g, "\\x27").replace(/\"/g, "\\x22").replace(/\n/g, "\\n").replace(/</g, "\\x3c").replace(/>/g, "\\x3e")) : a
};
COMMON.encodeHtmlAttr = function (a) {
    return a && a.replace ? (a.replace(/\"/g, "&#x22;").replace(/\'/g, "&#x27;").replace(/</g, "&#x3c;").replace(/>/g, "&#x3e;").replace(/&/g, "&#x26;")).replace(/\\/g, "&#5c;") : a
};
COMMON.encodeUrl = function (a) {
    return typeof a === "undefined" ? "" : encodeURIComponent(a)
};
COMMON.decodeUrl = function (a) {
    return typeof a === "undefined" ? "" : decodeURIComponent(a)
};
COMMON.toUN = {
    on: function (d) {
        var b = [],
        c = 0;
        for (; c < d.length;) {
            b[c] = ("00" + d.charCodeAt(c++).toString(16)).slice(-4)
        }
        return "\\u" + b.join("\\u")
    },
    un: function (a) {
        return unescape(a.replace(/\\/g, "%"))
    }
};
COMMON.parseFileName = function (b, a) {
    var d = b.lastIndexOf("/");
    if (d < 0) {
        d = b.lastIndexOf("\\")
    }
    if (d >= 0) {
        b = b.substring(d + 1)
    }
    if (a) {
        return b
    } else {
        var c = b.lastIndexOf(".");
        if (c >= 0) {
            return b.substring(0, c)
        } else {
            return b
        }
    }
};
COMMON.format = function () {
    var c = arguments[0];
    for (var a = 0; a < arguments.length - 1; a++) {
        var b = new RegExp("\\{" + a + "\\}", "gm");
        c = c.replace(b, arguments[a + 1])
    }
    return c
};
COMMON.checkValid = function (f, b, a, d, c) {
    var g;
    if (!f && d > 0) {
        g = COMMON.format("您还未输入{0}", b)
    } else {
        if (f.length < d) {
            g = COMMON.format("{0}不能少于{1}个字", b, d)
        } else {
            if (f.length > c) {
                g = COMMON.format("{0}不能多于{1}个字，请裁减后重试。", b, c)
            }
        }
    }
    COMMON.showErr(a, g);
    return !g
};
COMMON.showErr = function (a, c) {
    var b = $("#" + a);
    if (c) {
        b.show();
        b.text(c)
    } else {
        b.hide()
    }
};
COMMON.showMsg = function (b) {
    var a = $("#msg");
    if (b && b.length > 0) {
        a.show();
        a.text(b)
    } else {
        a.hide();
        a.text("")
    }
};
COMMON.checkVal = function (c, d, b, a) {
    var f;
    if (d.length < b) {
        alert(COMMON.format("{0}不能少于{1}个字符", c, b));
        f = false
    } else {
        if (d.length > a) {
            alert(COMMON.format("{0}不能多于{1}个字符", c, a));
            f = false
        } else {
            f = true
        }
    }
    return f
};
COMMON.getEl = function (a) {
    return typeof (a) == "string" ? document.getElementById(a) : a
};
COMMON.getBrowserWidth = function () {
    return document.documentElement.clientWidth
};
COMMON.getBrowserHeight = function () {
    return document.documentElement.clientHeight
};
COMMON.delNode = function (a) {
    if (COMMON.getEl(a) != null) {
        COMMON.getEl(a).parentNode.removeChild(COMMON.getEl(a))
    }
};
COMMON.delChildNodes = function (b) {
    if (b == null || b.childNodes == null) {
        return
    }
    var c = b.childNodes.length;
    for (var a = 0; a < c; ++a) {
        b.removeChild(b.firstChild)
    }
};
COMMON.showFlowMsg = function (b) {
    COMMON.delNode("showFlowMsg");
    var a = document.createElement("div");
    a.id = "showFlowMsg";
    a.style.position = "absolute";
    a.style.top = "80px";
    a.style.left = "400px";
    a.style.border = "1px";
    a.style.borderTop = "0px";
    a.style.borderBottomStyle = "solid";
    a.style.borderColor = "#E9F0F4";
    a.style.height = "22px";
    a.style.lineHeight = "22px";
    a.style.width = "auto";
    a.style.paddingTop = "1px";
    a.style.paddingBottom = "1px";
    a.style.paddingLeft = "10px";
    a.style.paddingRight = "10px";
    a.style.backgroundColor = "#FFFFC4";
    a.style.zIndex = "999";
    a.style.textAlign = "left";
    a.style.fontSize = "12";
    a.innerHTML = b;
    document.body.appendChild(a);
    COMMON.delay(150)
};
COMMON.closeFlowMsg = function () {
    COMMON.delNode("showFlowMsg")
};
COMMON.delay = function (b) {
    var a = new Date();
    var c = a.getTime() + b;
    while (true) {
        a = new Date();
        if (a.getTime() > c) {
            return
        }
    }
};
COMMON.Msg = {
    CONFIRM: 0,
    SUCCEED: 1,
    FAIL: 2,
    TIP: 3
};
COMMON.Msg.box = function (a, b) {
    COMMON.delNode("msgBox");
    alert("ok")
};
COMMON.Debug = {};
COMMON.Debug.alert = function (c) {
    if (typeof (c) != "object") {
        alert(c);
        return
    }
    var a = "";
    for (var b in c) {
        if (typeof (c[b]) == "function") {
            a += b + "=function\t"
        } else {
            a += b + "=" + c[b] + "\t"
        }
    }
    alert(a)
};
COMMON.Debug.msg = function (c) {
    if (COMMON.isNull(COMMON.Debug.cnt)) {
        COMMON.Debug.cnt = 0
    } ++COMMON.Debug.cnt;
    var b = "";
    b = "<div id='dbgMsg' style=\"position:absolute;  top:30px; left: 45%; margin:0px auto; width:auto;  height:auto; z-index:9999;\"></div>";
    if (COMMON.top.$("#dbgMsg").length == 0) {
        COMMON.top.$(b).appendTo("body")
    }
    var a = "";
    a += '<div class="tips"><div class="msg">' + COMMON.Debug.cnt + ":" + c + "</div></div>";
    COMMON.top.$("#dbgMsg").find(".tips").remove();
    COMMON.top.$(a).appendTo("#dbgMsg")
};
COMMON.Debug.track = function (d) {
    if (COMMON.isNull(COMMON.Debug.outtrack) || !COMMON.Debug.outtrack) {
        return
    }
    var a = (new Date()).getTime();
    if (COMMON.isNull(COMMON.Debug.last)) {
        COMMON.Debug.last = a
    }
    var c = (a - COMMON.Debug.last);
    COMMON.Debug.last = a;
    if (d == "" || c <= 0) {
        return
    }
    var b = "";
    b = "<div id='dbgMsg' style=\"position:absolute;  top:30px; left: 45%; margin:0px auto; width:auto;  height:auto; z-index:9999;\"></div>";
    var f = COMMON.top.$("#dbgMsg");
    if (f.length == 0) {
        f = COMMON.top.$(b);
        f.appendTo("body")
    }
    COMMON.top.$("<div class='tips'><div class='msg' style='clear:both;'>" + d + " : " + c + "</div></div>").appendTo(f)
};
COMMON.Cookie = {};
COMMON.Cookie.set = function (c, f) {
    var a = arguments;
    var i = arguments.length;
    var b = (i > 2) ? a[2] : null;
    var h = (i > 3) ? a[3] : "/";
    var d = (i > 4) ? a[4] : null;
    var g = (i > 5) ? a[5] : false;
    document.cookie = c + "=" + escape(f) + ((b == null) ? "" : ("; expires=" + b.toGMTString())) + ((h == null) ? "" : ("; path=" + h)) + ((d == null) ? "" : ("; domain=" + d)) + ((g == true) ? "; secure" : "")
};
COMMON.Cookie.get = function (d) {
    var b = d + "=";
    var g = b.length;
    var a = document.cookie.length;
    var f = 0;
    var c = 0;
    while (f < a) {
        c = f + g;
        if (document.cookie.substring(f, c) == b) {
            return COMMON.Cookie.getCookieVal(c)
        }
        f = document.cookie.indexOf(" ", f) + 1;
        if (f == 0) {
            break
        }
    }
    return null
};
COMMON.Cookie.clear = function (a) {
    if (COMMON.Cookie.get(a)) {
        var b = new Date();
        b.setTime(b.getTime() - (86400 * 1000 * 1));
        COMMON.Cookie.set(a, "", b)
    }
};
COMMON.Cookie.clearCloseClient = function (a) {
    if (COMMON.Cookie.get(a)) {
        COMMON.Cookie.set(a, "", null)
    }
};
COMMON.Cookie.getCookieByName = function(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
};
COMMON.Cookie.getCookieVal = function (b) {
    var a = document.cookie.indexOf(";", b);
    if (a == -1) {
        a = document.cookie.length
    }
    return unescape(document.cookie.substring(b, a))
};
COMMON.Conn = {};
COMMON.Conn.requestJs = function (d, b, a) {
    oScript = document.getElementById(d);
    var c = null;
    if (typeof a == "object" && a.target) {
        c = document.getElementsByName(a.target)[0]
    } else {
        c = document.getElementsByTagName("head")[0]
    }
    if (oScript) {
        c.removeChild(oScript)
    }
    if (typeof a == "object" && a.callback) {
        b = COMMON.addUrlParams(b, "_callback=" + a.callback)
    }
    if (typeof a == "object" && a.refresh) {
        b = COMMON.addUrlParams(b, "_random=" + Math.random())
    }
    oScript = document.createElement("script");
    oScript.setAttribute("src", b);
    oScript.setAttribute("id", d);
    oScript.setAttribute("type", "text/javascript");
    oScript.setAttribute("language", "javascript");
    c.appendChild(oScript);
    return oScript
};
COMMON.IFrame = {};
COMMON.IFrame.autoHeight = function (f, a) {
    var b = $("#" + f);
    var c = b[0].contentWindow.document;
    if (c) {
        var d = c.createElement("div");
        c.body.appendChild(d);
        d.style.clear = "both";
        d.style.margin = "0px";
        d.style.padding = "0px";
        d.style.fontSize = "1px"
    }
    if (a) {
        COMMON.IFrame.doAutoHeight(f, a)
    } else {
        COMMON.IFrame.doAutoHeight(f)
    }
    if (a) {
        setInterval("COMMON.IFrame.doAutoHeight('" + f + "','" + a + "')", 1000)
    } else {
        setInterval("COMMON.IFrame.doAutoHeight('" + f + "')", 1000)
    }
};
COMMON.IFrame.doAutoHeight = function (f, b) {
    try {
        var c = $("#" + f);
        if (c.length < 0) {
            return
        }
        var a = 0;
        if (b) {
            a = c[0].contentWindow.$("#" + b).height()
        } else {
            if (COMMON.isIE6()) {
                a = c[0].contentWindow.document.body.scrollHeight
            } else {
                a = c[0].contentWindow.$("body").height()
            }
        }
        if (a != c.height()) {
            c.height(a)
        }
    } catch (d) { }
};
COMMON.ptInRect = function (b, a) {
    if (b.x >= a.left && b.x <= a.left + a.width && b.y >= a.top && b.y <= a.top + a.height) {
        return true
    }
    return false
};
COMMON.Img = {};
COMMON.Img = {
    MODE_SCALE_FILL: 1,
    MODE_SCALE_WIDTH: 2,
    MODE_SCALE_HEIGHT: 3,
    MODE_SCALE_DEFLATE_WIDTH: 4,
    MODE_SCALE_DEFLATE_HEIGHT: 5,
    MODE_SCALE_DEFLATE_FILL: 6,
    MODE_SCALE_DEFLATE_MAX: 7
};
COMMON.Img.optimize = function (d, g) {
    var b = new Image();
    b.src = d.src;
    var c = b.width;
    var a = b.height;
    if (COMMON.isNull(c) || c == 0 || COMMON.isNull(a) || a == 0) {
        c = d.width;
        a = d.height
    }
    var f = COMMON.Img.calcSize(c, a, g.width, g.height, g.mode);
    d.width = f.width;
    d.height = f.height;
    if (g.display == 1) {
        d.style.display = "inline"
    } else {
        if (g.display == 2) {
            d.style.display = "none"
        } else {
            d.style.display = "block"
        }
    }
    return {
        width: d.width,
        height: d.height
    }
};
COMMON.Img.calcSize = function (f, a, h, g, i) {
    var c = {
        width: f,
        height: a
    };
    if (i == COMMON.Img.MODE_SCALE_FILL) {
        var d = f / h;
        var b = a / g;
        if (d > b) {
            c.width = h;
            c.height = a / d
        } else {
            c.width = f / b;
            c.height = g
        }
    } else {
        if (i == COMMON.Img.MODE_SCALE_WIDTH) {
            var d = f / h;
            c.width = h;
            c.height = a / d
        } else {
            if (i == COMMON.Img.MODE_SCALE_HEIGHT) {
                var b = a / g;
                c.width = f / b;
                c.height = g
            } else {
                if (i == COMMON.Img.MODE_SCALE_DEFLATE_WIDTH) {
                    var d = f / h;
                    if (d > 1) {
                        c.width = h;
                        c.height = a / d
                    }
                } else {
                    if (i == COMMON.Img.MODE_SCALE_DEFLATE_HEIGHT) {
                        var b = a / g;
                        if (b > 1) {
                            c.width = f / b;
                            c.height = g
                        }
                    } else {
                        if (i == COMMON.Img.MODE_SCALE_DEFLATE_FILL) {
                            var d = f / h;
                            var b = a / g;
                            if (d > b) {
                                if (d > 1) {
                                    c.width = h;
                                    c.height = a / d
                                }
                            } else {
                                if (b > 1) {
                                    c.width = f / b;
                                    c.height = g
                                }
                            }
                        } else {
                            if (i == COMMON.Img.MODE_SCALE_DEFLATE_MAX) {
                                if (f > h && a > g) {
                                    var d = f / h;
                                    var b = a / g;
                                    if (d < b) {
                                        c.width = h;
                                        c.height = a / d
                                    } else {
                                        c.width = f / b;
                                        c.height = g
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    c.width = Math.floor(c.width);
    c.height = Math.floor(c.height);
    if (c.width == 0) {
        c.width = 1
    }
    if (c.height == 0) {
        c.height = 1
    }
    return c
};
COMMON.ing = function (k, j) {
    var f = (k == null || k == "") ? "正在处理..." : k;
    var d = COMMON.top.document.body.clientWidth;
    var a = COMMON.top.document.body.clientHeight;
    var h = "";
    h = "<div id='ing' style=\"position:absolute;  top:30px; left: 50%; margin:0px auto; width:auto;  height:auto; z-index:9999;\"></div>";
    if (COMMON.top.$("#ing").length == 0) {
        COMMON.top.$(h).appendTo("body")
    }
    var b = COMMON.top.$("#ing");
    var l = COMMON.top.$("body").scrollTop();
    if (COMMON.isIE() && l == 0) {
        l = COMMON.top.$("html").scrollTop()
    }
    if (l > 0) {
        b.css("top", (l + 30) + "px")
    }
    var c = parseInt(Math.random() * 10000);
    var i = "";
    i += '<div id="' + c + '" class="tips"><div class="msg">' + f + "<span class='close'  onclick=\"COMMON.top.COMMON.removeIng(false, " + c + ');"></span></div></div>';
    b.find(".tips").remove();
    COMMON.top.$(i).appendTo(b);
    var g = COMMON.top.$(b).width();
    COMMON.top.$(b).css("left", (COMMON.top.document.documentElement.clientWidth - g) / 2);
    if (j) {
        COMMON.top.COMMON.removeIng(j, c)
    }
};
COMMON.removeAllIng = function () {
    COMMON.top.$("#ing").remove()
};
COMMON.removeIng = function (a, b) {
    if (a) {
        if (typeof b != "undefined" && COMMON.top.$("#" + b).length > 0) {
            COMMON.top.window.setTimeout(function () {
                $("#" + b).fadeOut(1000)
            },
            3000);
            COMMON.top.window.setTimeout(function () {
                $("#" + b).remove()
            },
            45000)
        } else {
            COMMON.top.$(".tips").fadeOut(1000);
            COMMON.top.window.setTimeout(function () {
                $("#ing").remove()
            },
            3000)
        }
    } else {
        if (typeof b != "undefined" && COMMON.top.$("#" + b).length > 0) {
            COMMON.top.$("#" + b).fadeOut(0);
            COMMON.top.window.setTimeout(function () {
                $("#" + b).remove()
            },
            0)
        } else {
            COMMON.top.$(".tips").fadeOut(0);
            COMMON.top.window.setTimeout(function () {
                $("#ing").remove()
            },
            0)
        }
    }
};

// 设置覆盖背景的透明幕布，防止点击
COMMON.bg = function (f, b) {
    var c = "";
    var a = "";
    if (b) {
        a = "filter: alpha(opacity=" + b * 100 + "); opacity:" + b + ";"
    }
    if (COMMON.isIE6()) {
        var d = COMMON.top.$("html").scrollTop();
        COMMON.top.$("html").data("scrollTop", d);
        COMMON.top.$("html").scrollTop(0);
        var d = COMMON.top.$("body").scrollTop();
        COMMON.top.$("body").data("scrollTop", d);
        COMMON.top.$("body").scrollTop(0);
        COMMON.top.$("html").data("overflow-x", COMMON.top.$("html").css("overflow-x"));
        COMMON.top.$("html").data("overflow-y", COMMON.top.$("html").css("overflow-y"));
        COMMON.top.$("html").css("overflow-x", "hidden");
        COMMON.top.$("html").css("overflow-y", "hidden");
        COMMON.top.$("body").data("overflow-x", COMMON.top.$("body").css("overflow-x"));
        COMMON.top.$("body").data("overflow-y", COMMON.top.$("body").css("overflow-y"));
        COMMON.top.$("body").css("overflow-x", "hidden");
        COMMON.top.$("body").css("overflow-y", "hidden")
    }
    if (COMMON.isIE6() || COMMON.isIE7() || COMMON.isIE8()) {
        if (COMMON.top.$("html").css("filter")) {
            COMMON.top.$("html").data("filter", COMMON.top.$("html").css("filter"));
            COMMON.top.$("html").css("filter", "none")
        }
    }
    //  参考popupBg样式
    //  .popupBg {
    //  position:fixed;
    //  margin:0;
    //  padding:0;
    //  top:0;
    //  left:0;
    //  right:0;
    //  bottom:0;
    //  height:100%;
    //  _position:absolute;
    //  _height:expression(body.clientHeight);
    //  *width:expression(document.documentElement.clientWidth);
    //  background-color:#000;
    //  filter:alpha(opacity=70);
    //  z-index:9032;
    //  overflow:hidden;
    //  opacity:.7
    //}
    c = '<div id="popupBg' + f + '" class="popupBg" style=\'' + a + "' >" + ($.browser.msie && $.browser.version == 6 ? '<iframe id="fixSelectIframe' + f + '" wmode="transparent" style="filter: alpha(opacity=0);opacity: 0;" class="popupBg" style="z-index:-111" src="javascript:"></iframe>' : "") + "</div>";
    COMMON.top.$(c).appendTo("body");
    COMMON.stopInterval(null)
};

// 移除幕布
COMMON.removeBg = function (a) {
    if (a) {
        COMMON.top.$("#popupBg" + a).remove()
    } else {
        COMMON.top.$(".popupBg").remove()
    }
    if (COMMON.isIE6()) {
        COMMON.top.$("html").css("overflow-x", COMMON.top.$("html").data("overflow-x"));
        COMMON.top.$("html").css("overflow-y", COMMON.top.$("html").data("overflow-y"));
        COMMON.top.$("body").css("overflow-x", COMMON.top.$("body").data("overflow-x"));
        COMMON.top.$("body").css("overflow-y", COMMON.top.$("body").data("overflow-y"));
        COMMON.top.$("html").scrollTop(COMMON.top.$("html").data("scrollTop"));
        COMMON.top.$("body").scrollTop(COMMON.top.$("body").data("scrollTop"))
    }
    if (COMMON.isIE6() || COMMON.isIE7() || COMMON.isIE8()) {
        if (COMMON.top.$("html").data("filter")) {
            COMMON.top.$("html").css("filter", COMMON.top.$("html").data("filter"))
        }
    }
    COMMON.startInterval(null)
};
COMMON.bodyBg = function (d, b) {
    var c = "";
    var a = "";
    if (b) {
        a = "filter: alpha(opacity=" + b * 100 + "); opacity:" + b + ";"
    }
    if (COMMON.isIE6()) {
        $("body").data("height", $("body").css("height"));
        $("body").css("height", "100%")
    }
    c = '<div id="popupBg' + d + '" class="popupBg" style=\'' + a + "' >" + ($.browser.msie && $.browser.version == 6 ? '<iframe id="fixSelectIframe' + d + '" wmode="transparent" style="filter: alpha(opacity=0);opacity: 0;" class="popupBg" style="z-index:-111" src="javascript:"></iframe>' : "") + "</div>";
    $(c).appendTo("body")
};
COMMON.removeBodyBg = function (a) {
    if (COMMON.isIE6()) {
        $("body").css("height", $("body").data("height"))
    }
    if (a) {
        $("#popupBg" + a).remove()
    } else {
        $(".popupBg").remove()
    }
};

COMMON.closePopupWindow = function (g, d) {
    if (g) {
        try {
            if (COMMON.isNull(COMMON.top._popupOptions["popup" + g])) {
                return
            }
            var c = COMMON.top._popupOptions["popup" + g];
            if (c.change) {
                if (!window.confirm("您的修改尚未保存，确定要离开吗？")) {
                    return
                }
            }
            if (c.refresh) {
                COMMON.top.location.reload();
                return
            }
            COMMON.top.COMMON.removeAllIng(false);
            var b = c.options;
            if (!COMMON.isNull(b.closeFunc)) {
                if (d) {
                    b.closeFunc(d)
                } else {
                    b.closeFunc(COMMON.top._popupOptions["popup" + g].closeArgs)
                }
            }
            COMMON.top._popupOptions["popup" + g] = {};
            var a = COMMON.top.$("#popupWindow" + g);
            if (b.animate) {
                COMMON.top.COMMON.closePopupWindowAnimate(a, b.animateTarget, b.animateOnClose)
            }
            COMMON.top.setTimeout("COMMON.closePopupWindow_Internal('" + g + "')")
        } catch (f) { }
    } else {
        COMMON.removeBg();
        COMMON.top.$(".formDialog").remove()
    }
};

// 弹出子模块的编辑框
COMMON.popupWindow = function (g) {
    // 默认属性
    var x = {
        title: "",
        width: 500,
        height: 300,
        frameSrcUrl: "about:_blank",
        frameScrolling: "auto",
        bannerDisplay: true,
        framePadding: true,
        opacity: "0.3",
        displayBg: true,
        bgClose: true,
        closeBtnClass: ""
    };
    // 合并属性,g为前台回传的属性
    x = $.extend(x, g);

    // 宽
    var t = parseInt(x.width);

    // 高
    var w = parseInt(x.height);

    // 浏览器宽
    var h = COMMON.top.document.documentElement.clientWidth;
    if (!$.browser.msie) {
        h = COMMON.top.document.body.clientWidth
    }

    // 浏览器高
    var n = COMMON.top.document.documentElement.clientHeight;

    // 距浏览器左右边距离，用于弹出框位置
    var j = (h - t) / 2;

    // 若前台返回数据未指定，则居中
    if (x.leftMar != null) {
        j = parseInt(x.leftMar)
    }

    // 默认banner高
    var E = 80;
    if (!x.bannerDisplay) {
        E = 0
    }
    // 距浏览器顶部距离，用于弹出框位置
    var r = (n - w - E) / 2;

    // 若前台返回数据未指定，则居中
    if (x.topMar != null) {
        r = parseInt(x.topMar)
    }

    var y = "";
    var C = "";
    var i = "";

    if (!x.bannerDisplay) {
        C = "display:none;";
        y = "background:none;";
        if (!x.closeBtnClass) {
            x.closeBtnClass = "formX_old"
        }
    }
    if (!x.framePadding) {
        y += "padding:0;";
        i = 'allowtransparency="true"'
    }
    var s = parseInt(Math.random() * 10000);

    // 拼装iframe
    var f = '<iframe ' + i + ' id="popupWindowIframe' + s + '" name="popupWindowIframe' + s + '" class="popupWindowIframe" src="" frameborder="0" scrolling="' + x.frameScrolling + '" style="width:100%;height:100%;" onload="COMMON.iframeOnload(this,this.src,' + s + ');"></iframe>';

    var u = true;
    if (x.divId != null) {
        u = false;
        f = $(x.divId).html()
    }
    if (x.divContent != null) {
        u = false;
        f = x.divContent
    }
    if (x.displayBg) {
        // 向body添加了一个id为popupbg+s的div，作用是弹出框以后给背景蒙上一层背景，防止点击？
        COMMON.bg(s, x.opacity)
    }

    // 可滑动时，滑动位置距离顶部距离，以px记
    var q = "";
    var d = COMMON.top.$("body").scrollTop();
    if (d == 0) {
        d = COMMON.top.$("html").scrollTop()
    }

    // 弹出框距左， 上距离
    var v = "left:" + j + "px; top:" + (r + d) + "px;";
    if (COMMON.isIE6() || COMMON.isIE7()) {
        v += "width:" + t + "px;"
    }
    var c = "position:relative;width:" + t + "px;height:" + w + "px;";

    // IE下特有的fixFlashIframe
    var a = "";
    if ($.browser.msie) {
        a = '<iframe id="fixFlashIframe' + s + '" style="position:absolute;z-index:-1;left:0;top:0;" frameborder="0" width="100%" height="100%" src="javascript:"></iframe>'
    }
    // 拼装弹出框的div
    var q = ['<div id="popupWindow' + s + '" class="formDialog" style="' + v + '">', a, '<div class="formTL" style=\'' + C + '\'><div class="formTR"><div class="formTC">' + x.title + "</div></div></div>", '<div class="formBL" style=\'' + y + "'>", '<div class="formBR" style=\'' + y + "'>", '<div class="formBC" id="formBC' + s + '" style="height:auto;' + y + '">', '<div class="formMSG" style="' + c + '">', f, "</div>", "<table cellpadding='0' cellspacing='0' class='formBtns'>", "<tr><td align='center' style='padding:15px 0px;'></td></tr>", "</table>", "</div>", '<div id="waitingP' + s + '" class="waitingP" style="height:auto;"></div>', "</div>", "</div>", '<a href="javascript:;" class="formX ' + x.closeBtnClass + "\" hidefocus='true' onclick='return false;'></a>", "</div>"];

    // 向body加入这个弹出框（关闭后会remove掉）
    var p = COMMON.top.$(q.join("")).appendTo("body");

    if (COMMON.isIE6() || COMMON.isIE7()) {
        var b = p.find(".formBL");
        var o = COMMON.getCssInt(b, "padding-left") + COMMON.getCssInt(b, "padding-right") + COMMON.getCssInt(b, "border-left-width") + COMMON.getCssInt(b, "border-right-width");
        var D = p.find(".formBR");
        var A = COMMON.getCssInt(D, "padding-left") + COMMON.getCssInt(D, "padding-right") + COMMON.getCssInt(D, "border-left-width") + COMMON.getCssInt(D, "border-right-width");
        var l = p.find(".formBC");
        var z = COMMON.getCssInt(l, "padding-left") + COMMON.getCssInt(l, "padding-right") + COMMON.getCssInt(l, "border-left-width") + COMMON.getCssInt(l, "border-right-width");
        p.css("width", (t + o + A + z) + "px")
    }
    var B = 40;
    var k = 20;
    if (!x.bannerDisplay) {
        B = 0
    }

    // 如果太高，则修改.formMSG这个div的高度
    if (p.height() + B > (n - k)) {
        var m = p.height() + B - p.find(".formMSG").height();
        p.find(".formMSG").css("height", (n - k - m) + "px");
        p.css("top", (10 + d) + "px")
    }
    if (COMMON.isIE6()) {
        $("#fixFlashIframe" + s).attr("height", p.height() + "px")
    }
    if (u) {
        COMMON.top.$("#waitingP" + s).height(COMMON.top.$("#formBC" + s).height());
        COMMON.top.$("#waitingP" + s).width(COMMON.top.$("#formBC" + s).width())
    } else {
        COMMON.top.$("#waitingP" + s).hide()
    }
    if (x.divInit != null) {
        x.divInit(s)
    }

    COMMON.top.$("#popupWindow" + s).ready(function () {
        if (u) {
            var F = "popupID=" + s;
            COMMON.top.$("#popupWindowIframe" + s).attr("src", COMMON.addUrlParams(x.frameSrcUrl, F)).load(function () {
                COMMON.top.$("#waitingP" + s).hide()
            })
        }
        p.find(".formX").bind("click",
        function () {
            COMMON.closePopupWindow(s);
            return false
        });
        //p.find(".formTL").disableSelection();
        if (x.bgClose) {
            COMMON.top.$("#popupBg" + s).bind("click",
            function () {
                COMMON.closePopupWindow(s);
                return false
            })
        }
    });

    // 建立字典，s为随机值，用做id
    if (COMMON.isNull(COMMON.top._popupOptions)) {
        COMMON.top._popupOptions = {}
    }
    if (COMMON.isNull(COMMON.top._popupOptions["popup" + s])) {
        COMMON.top._popupOptions["popup" + s] = {}
    }
    if (!COMMON.isNull(g.callArgs)) {
        COMMON.top._popupOptions["popup" + s].callArgs = g.callArgs
    }
    COMMON.top._popupOptions["popup" + s].options = g;

    // 可能用作标记是否有需要保存的改动，默认为false
    COMMON.top._popupOptions["popup" + s].change = false;
    return s
};
//COMMON.iframeOnload = function(obj, src, s) {
//    if (obj.contentWindow.document.location.href.indexOf(src) < 0) {
//        COMMON.closePopupWindow(s);
//        COMMON.top.location.href = COMMON.top.location.href;
//    }
//
//    $(obj.contentWindow.document).find(".submit").bind("click",
//    function() {
//        COMMON.top.$("#waitingP" + s).show();
//    });
//}
COMMON.iframeOnload = function (obj, src, s) {


    // 对应chrome中iframe两次加载的情况，其中第一次加载href为blank
    if (obj.contentWindow.document.location.href.indexOf('about:blank') >= 0) {
        return;
    } else if (obj.contentWindow.document.location.href.indexOf(src) < 0) {
        COMMON.closePopupWindow(s);
        setTimeout("COMMON.top.location.href = COMMON.top.location.href", 100);
    } else {
        $(obj.contentWindow.document).find("form").submit(function (e) {
            COMMON.top.$("#waitingP" + s).show();

            // 当submitPreventedflag为真的时候，form被校验函数阻止提交
            //var submitPreventedflag = true;
            //if (e.originalEvent.returnValue == undefined) {
            //	if (e.originalEvent.defaultPrevented == undefined) {
            //		if (COMMON.isIE && (document.documentMode == 7 || document.documentMode == 8 || document.documentMode == 6)) {
            //			submitPreventedflag = !e.originalEvent.cancelBubble;
            //		} else {
            //			submitPreventedflag = e.originalEvent.cancelBubble;
            //		}
            //	} else {
            //		submitPreventedflag = e.originalEvent.defaultPrevented;
            //	}
            //} else {
            //	submitPreventedflag = !e.originalEvent.returnValue;
            //}
            //alert(e.originalEvent.returnValue);
            //alert(e.originalEvent.defaultPrevented);
            //alert(e.originalEvent.cancelBubble);
            if (COMMON.isIE && (document.documentMode == 7 || document.documentMode == 8)) {
                //var tmpId = "#waitingP" + s;
                //setTimeout("COMMON.top.$('" + #waitingP +"'" + s + ").hide()",2000);
            }
            else {
                if (e.originalEvent.defaultPrevented) {
                    COMMON.top.$("#waitingP" + s).hide();
                } else {
                    return true;
                }
            }
        });
    }
}

COMMON.hideWaiting = function (s) {
    COMMON.top.$("#waitingP" + s).hide();
}

COMMON.setPopupWindowChange = function (b, a) {
    if (COMMON.isNull(COMMON.top._popupOptions)) {
        return
    }
    if (COMMON.isNull(COMMON.top._popupOptions["popup" + b])) {
        return
    }
    COMMON.top._popupOptions["popup" + b].change = a
};
COMMON.closePopupWindow = function (g, d) {
    // $.ajax({
    //     type: "post",
    //     url: "/clearPopupSession",
    //     success: function (e) {
    //     	if(e.status.code == 100){
    //     		console.log("已经清除弹出框Session");
    //     	}
    //     }
    // });
    if (g) {
        try {
            if (COMMON.isNull(COMMON.top._popupOptions["popup" + g])) {
                return
            }
            var c = COMMON.top._popupOptions["popup" + g];
            if (c.change) {
                if (!window.confirm("您的修改尚未保存，确定要离开吗？")) {
                    return
                }
            }
            if (c.refresh) {
                COMMON.top.location.reload();
                return
            }
            COMMON.top.COMMON.removeAllIng(false);
            var b = c.options;
            if (!COMMON.isNull(b.closeFunc)) {
                if (d) {
                    b.closeFunc(d)
                } else {
                    b.closeFunc(COMMON.top._popupOptions["popup" + g].closeArgs)
                }
            }
            COMMON.top._popupOptions["popup" + g] = {};
            var a = COMMON.top.$("#popupWindow" + g);
            if (b.animate) {
                COMMON.top.COMMON.closePopupWindowAnimate(a, b.animateTarget, b.animateOnClose)
            }
            COMMON.top.setTimeout("COMMON.closePopupWindow_Internal('" + g + "')")
        } catch (f) { }
    } else {
        COMMON.removeBg();
        COMMON.top.$(".formDialog").remove()
    }
};
COMMON.closePopupWindow_Internal = function (c) {
    if (typeof c == "undefined") {
        if ($.browser.msie && $.browser.version == 10) {
            var a = COMMON.top.$(".formDialog").find(".popupWindowIframe")[0];
            if (a) {
                popupWindowIframeWindow = a.contentWindow;
                if (popupWindowIframeWindow) {
                    try {
                        if (popupWindowIframeWindow.swfObj) {
                            popupWindowIframeWindow.swfObj.destroy()
                        }
                        if (popupWindowIframeWindow.editor) {
                            if (popupWindowIframeWindow.editor.swfObj) {
                                popupWindowIframeWindow.editor.swfObj.destroy()
                            }
                        }
                    } catch (b) { }
                }
            }
        }
        COMMON.top.$(".popupBg").remove();
        COMMON.top.$(".formDialog").remove()
    } else {
        if ($.browser.msie && $.browser.version == 10) {
            var a = COMMON.top.document.getElementById("popupWindowIframe" + c);
            if (a) {
                popupWindowIframeWindow = a.contentWindow;
                if (popupWindowIframeWindow) {
                    try {
                        if (popupWindowIframeWindow.swfObj) {
                            popupWindowIframeWindow.swfObj.destroy()
                        }
                        if (popupWindowIframeWindow.editor) {
                            if (popupWindowIframeWindow.editor.swfObj) {
                                popupWindowIframeWindow.editor.swfObj.destroy()
                            }
                        }
                    } catch (b) { }
                }
            }
        }
        COMMON.top.COMMON.removeBg(c);
        COMMON.top.$("#popupWindowIframe" + c).remove();
        COMMON.top.$("#popupWindow" + c).remove()
    }
};
COMMON.closePopupWindowAnimate = function (b, f, d) {
    var c = $("<div>");
    COMMON.top.$("body").append(c);
    c.css({
        border: "1px solid #ff4400",
        position: "absolute",
        "z-index": "9999",
        top: b.offset().top,
        left: b.offset().left,
        height: b.height() + "px",
        width: b.width() + "px"
    });
    var a = COMMON.top.$("body").find(f);
    c.animate({
        top: a.offset().top + "px",
        left: a.offset().left + "px",
        width: a.width() + "px",
        height: a.height() + "px"
    },
    "slow",
    function () {
        if (typeof d == "function") {
            d()
        }
        c.remove()
    })
};
COMMON.addPopupWindowBtn = function (h, b) {
    var f = COMMON.top.$("#popupWindow" + h);
    f.find(".formBtns").show();
    var g = "popup" + h + b.id;
    var d = f.find(".formBtns td");
    var c = d.find("#" + g);
    if (c.length > 0) {
        c.remove()
    }
    if (b.click != "help") {
        if (typeof b.extClass != "undefined") {
            var a = b.extClass;
            COMMON.top.$("<input id='" + g + "' type='button' value='" + b.text + "' class='abutton commonButton' extClass='" + a + "'></input>").appendTo(d)
        } else {
            COMMON.top.$("<input id='" + g + "' type='button' value='" + b.text + "' class='abutton commonButton'></input>").appendTo(d)
        }
    }
    c = d.find("#" + g);
    if (typeof c.commonButton == "function") {
        c.commonButton()
    }
    if (b.callback && Object.prototype.toString.call(b.callback) === "[object Function]") {
        c.click(function () {
            b.callback();
            COMMON.top.COMMON.closePopupWindow(h)
        })
    }
    if (b.click == "close") {
        c.click(function () {
            COMMON.top.COMMON.closePopupWindow(h)
        })
    } else {
        if (b.click == "help") {
            if (f.find("a.formH").length == 0) {
                f.append("<a class='formH' href='" + b.helpLink + "' target='_blank' title='" + b.text + "'></a>")
            }
        } else {
            c.click(b.click)
        }
    }
    if (b.disable) {
        c.attr("disabled", true);
        c.commonButton("disable")
    }
};

COMMON.enablePopupWindowBtn = function (f, d, a) {
    var c = COMMON.top.$("#popupWindow" + f);
    d = "popup" + f + d;
    var b = c.find("#" + d);
    if (a) {
        b.removeAttr("disabled");
        b.commonButton("enable")
    } else {
        b.attr("disabled", true);
        b.commonButton("disable")
    }
};
COMMON.popupBodyWindow = function (d) {
    var s = {
        title: "",
        width: 500,
        height: 300,
        bannerDisplay: true,
        opacity: "0.3",
        displayBg: true
    };
    s = $.extend(s, d);
    var o = parseInt(s.width);
    var r = parseInt(s.height);
    var c = $("body").scrollTop();
    if (c == 0) {
        c = $("html").scrollTop()
    }
    var f = document.documentElement.clientWidth;
    if (!$.browser.msie) {
        f = document.body.clientWidth
    }
    var i = document.documentElement.clientHeight;
    var w = "";
    var t = "";
    if (!s.bannerDisplay) {
        w = "display:none;";
        t = "background:none;"
    }
    var g = 20;
    if (s.leftMar != null) {
        g = s.leftMar
    } else {
        g = (f - o) / 2
    }
    var m = 20;
    if (s.topMar != null) {
        m = s.topMar
    } else {
        m = (i - r - 80) / 2
    }
    var q = "";
    if (s.content != null) {
        q = s.content
    }
    var n = parseInt(Math.random() * 10000);
    if (s.displayBg) {
        COMMON.bodyBg(n, s.opacity)
    }
    var p = "left:" + g + "px; top:" + (m + c) + "px;";
    if (COMMON.isIE6() || COMMON.isIE7()) {
        p += "width:" + o + "px;"
    }
    var b = "position:relative;width:" + o + "px;height:" + r + "px;";
    var l = ['<div id="popupWindow' + n + '" class="formDialog" style="' + p + '">', '<div class="formTL" style=\'' + w + "'>", '<div class="formTR">', '<div class="formTC">' + s.title + "</div>", "</div>", "</div>", '<div class="formBL" style=\'' + t + "'>", '<div class="formBR" style=\'' + t + "'>", '<div class="formBC" id="formBC" style="height:auto;' + t + '">', '<div class="formMSG" style="' + b + '">', q, "</div>", "<table cellpadding='0' cellspacing='0' class='formBtns'>", "<tr><td align='center' style='padding:10px 0px;' ></td></tr>", "</table>", "</div>", "</div>", "</div>", "<a class=\"formX\" href='javascript:;' hidefocus='true' onclick='return false;'></a>", "</div>"];
    $(l.join("")).appendTo("body");
    var k = $("#popupWindow" + n);
    if (COMMON.isIE6() || COMMON.isIE7()) {
        var a = k.find(".formBL");
        var j = COMMON.getCssInt(a, "padding-left") + COMMON.getCssInt(a, "padding-right") + COMMON.getCssInt(a, "border-left-width") + COMMON.getCssInt(a, "border-right-width");
        var y = k.find(".formBR");
        var v = COMMON.getCssInt(y, "padding-left") + COMMON.getCssInt(y, "padding-right") + COMMON.getCssInt(y, "border-left-width") + COMMON.getCssInt(y, "border-right-width");
        var h = k.find(".formBC");
        var u = COMMON.getCssInt(h, "padding-left") + COMMON.getCssInt(h, "padding-right") + COMMON.getCssInt(h, "border-left-width") + COMMON.getCssInt(h, "border-right-width");
        var x = k.find(".formMSG");
        var z = COMMON.getCssInt(x, "margin-left") + COMMON.getCssInt(x, "margin-right") + COMMON.getCssInt(x, "border-left-width") + COMMON.getCssInt(x, "border-right-width");
        k.css("width", (o + j + v + u + z) + "px")
    }
    k.ready(function () {
        $(".formDialog").draggable({
            handle: ".formTL"
        });
        //$(".formTL").disableSelection();
        $(".formX").click(function () {
            if (s.beforeClose) {
                s.beforeClose()
            }
            COMMON.closePopupBodyWindow(n);
            COMMON.top.$("#popupBgTitle" + n).remove()
        })
    });
    k.data("settings", s);
    return n
};
COMMON.closePopupBodyWindow = function (c) {
    if (c) {
        COMMON.removeBodyBg(c);
        var a = $("#popupWindow" + c);
        var b = a.data("settings");
        if (b && typeof b.closeFunc == "function") {
            b.closeFunc()
        }
        a.remove();
        $("body").focus()
    } else {
        COMMON.removeBodyBg();
        $(".formDialog").remove()
    }
};
COMMON.addPopupBodyWindowBtn = function (i, c) {
    var g = $("#popupWindow" + i);
    g.find(".formBtns").show();
    var h = "popup" + i + c.id;
    var f = g.find(".formBtns td");
    var d = f.find("#" + h);
    if (d.length > 0) {
        d.remove()
    }
    if (g.find(".popupButtons").length != 1) {
        $("<span class='popupButtons'></span>").appendTo(f)
    }
    if (g.find(".popupCheckboxs").length === 1) {
        $(g.find(".popupButtons")[0]).css("margin-right", "10px").css("float", "right").css("margin-top", "-3px");
        if (COMMON.isIE6()) {
            $(g.find(".popupButtons")[0]).css("margin-top", "-20px")
        }
    }
    var a = "";
    if (typeof c.extClass != "undefined") {
        var b = " " + c.extClass;
        a = "<input id='" + h + "' type='button' value='" + c.text + "' class='abutton commonButton' extClass='" + b + "'></input>"
    } else {
        a = "<input id='" + h + "' type='button' value='" + c.text + "' class='abutton commonButton'></input>"
    }
    $(a).appendTo($(f).find(".popupButtons"));
    d = f.find("#" + h);
    if (typeof d.commonButton == "function") {
        d.commonButton()
    }
    if (c.click == "close") {
        d.click(function () {
            COMMON.closePopupBodyWindow(i)
        })
    } else {
        d.click(c.click)
    }
    if (c.disable) {
        d.attr("disabled", true);
        d.commonButton("disable")
    }
};
COMMON.addPopupBodyWindowCheckBox = function (h, b) {
    var f = $("#popupWindow" + h);
    f.find(".formBtns").show();
    var g = "popup" + h + b.id;
    var d = f.find(".formBtns td");
    var c = d.find("#" + g);
    if (c.length > 0) {
        c.remove()
    }
    var a = "<input id='" + g + "' type='checkbox' /><label for='" + g + "'>" + b.text + "</label>";
    if (f.find(".popupCheckboxs").length != 1) {
        d.removeAttr("align").css("line-height", "22px");
        $(d.find(".popupButtons")[0]).css("margin-right", "10px").css("float", "right");
        $("<span class='popupCheckboxs'>" + a + "</span>").appendTo(d)
    } else {
        $(a).appendTo($(f.find(".popupCheckboxs")[0]))
    }
    if (b.init === "checked") {
        $("#" + g).attr("checked", "checked")
    }
    c = d.find("#" + g);
    c.click(b.click);
    if (b.disable) {
        c.attr("disabled", true)
    }
};
COMMON.enablePopupBodyWindowBtn = function (f, d, a) {
    var c = $("#popupWindow" + f);
    d = "popup" + f + d;
    var b = c.find("#" + d);
    if (a) {
        b.removeAttr("disabled");
        b.commonButton("enable")
    } else {
        b.attr("disabled", true);
        b.commonButton("disable")
    }
};
COMMON.successHandle = function (resultData, successMsg, commonlureMsg, jumpUrl, jumpMode, alertMode) {
    COMMON.top.$("#ing").find(".tips").remove();
    var result = jQuery.parseJSON(resultData);
    var output = "";
    if (result.success) {
        if (result.msg) {
            output = result.msg
        }
        if (successMsg != "") {
            output = successMsg
        }
        if (output && output != "") {
            if (alertMode == 0) {
                COMMON.top.COMMON.removeIng(true);
                alert(output)
            } else {
                if (alertMode == 1) {
                    COMMON.ing(output, true)
                } else {
                    if (alertMode == 2) {
                        COMMON.ing(output, false)
                    } else {
                        if (alertMode == 3) { } else {
                            COMMON.top.COMMON.removeIng(true);
                            alert(output)
                        }
                    }
                }
            }
        }
        if (jumpUrl != "") {
            if (jumpMode == 1) {
                jumpUrl = jumpUrl.replace(/#.*/, "");
                if (COMMON.top.location.href == jumpUrl) {
                    COMMON.top.location.reload()
                } else {
                    COMMON.top.location.href = jumpUrl
                }
            } else {
                if (jumpMode == 2) {
                    jumpUrl = jumpUrl.replace(/#.*/, "");
                    if (parent.location.href == jumpUrl) {
                        parent.location.reload()
                    } else {
                        parent.location.href = jumpUrl
                    }
                } else {
                    if (jumpMode == 3) {
                        return result.success
                    } else {
                        if (jumpMode == 4) {
                            eval(jumpUrl)
                        } else {
                            jumpUrl = jumpUrl.replace(/#.*/, "");
                            if (document.location.href == jumpUrl) {
                                document.location.reload()
                            } else {
                                document.location.href = jumpUrl
                            }
                        }
                    }
                }
            }
        }
    } else {
        if (result.msg) {
            output = result.msg
        }
        if (output == "") {
            output = commonlureMsg
        }
        if (output == "") {
            output = "系统错误"
        }
        if (alertMode == 0) {
            alert(output)
        } else {
            if (alertMode == 1 || alertMode == 2) {
                COMMON.ing(output, false)
            } else {
                alert(output)
            }
        }
    }
    return result.success
};
COMMON.checkEmbed = function (a, c) {
    if (COMMON.top.location.href == document.location.href) {
        var b = document.location.href;
        b = b.replace(/http:\/\/[^\/]+/, "");
        COMMON.top.location.href = COMMON.addUrlParams(a, "url=" + COMMON.encodeUrl(b) + "&item=" + COMMON.encodeUrl(c))
    }
};
COMMON.disable = function (b, a) {
    if (a) {
        $("#" + b).attr("disabled", true)
    } else {
        $("#" + b).removeAttr("disabled")
    }
};
var timeout = 500;
var closetimer = 0;
var ddmenuitem = 0;
COMMON.dropdownForm_open = function () {
    COMMON.dropdownForm_canceltimer();
    COMMON.dropdownForm_close();
    ddmenuitem = $(this).find("ul").eq(0).css("visibility", "visible")
};
COMMON.dropdownForm_close = function () {
    if (ddmenuitem) {
        ddmenuitem.css("visibility", "hidden")
    }
};
COMMON.dropdownForm_timer = function () {
    closetimer = window.setTimeout(COMMON.dropdownForm_close, timeout)
};
COMMON.dropdownForm_canceltimer = function () {
    if (closetimer) {
        window.clearTimeout(closetimer);
        closetimer = null
    }
};
$(function () {
    try {
        $(".dropdownForm > div").bind("click", COMMON.dropdownForm_open);
        $(".dropdownForm > div").bind("mouseover", COMMON.dropdownForm_open);
        $(".dropdownForm > div").bind("mouseout", COMMON.dropdownForm_timer)
    } catch (a) { }
});
COMMON.preloadImg = function () {
    var c = new Array();
    if (typeof (arguments[0]) == "string") {
        c[0] = arguments[0]
    }
    if (typeof (arguments[0]) == "object") {
        for (var b = 0; b < arguments[0].length; b++) {
            c[b] = arguments[0][b]
        }
    }
    var a = new Array();
    for (var b = 0; b < c.length; b++) {
        a[b] = new Image();
        a[b].src = c[b]
    }
};
COMMON.delayLoadImg = function (a) {
    if (typeof a == "undefined" || a <= 0) {
        a = 10
    }
    setTimeout("COMMON.doDelayLoadImg(" + a + ")", 200)
};
COMMON.doDelayLoadImg = function (b) {
    var a = 0;
    $("img").each(function () {
        var c = $(this).attr("commonSrc");
        if (!COMMON.isNull(c) && c != "") {
            if (c != $(this).attr("src")) {
                ++a;
                $(this).show();
                $(this).attr("src", c);
                if (a >= b) {
                    return false
                }
            }
        }
    });
    if (a >= b) {
        setTimeout("COMMON.doDelayLoadImg(" + b + ")", 200)
    }
};
COMMON.editableDiv = function (b) {
    var f = $("#" + b);
    var d = f.width();
    var a = f.text();
    var c = $("<input type='text' value='" + a + "'/>");
    f.html(c);
    c.click(function () {
        return false
    });
    c.css("font-size", "12px");
    c.css("text-align", "left");
    c.width(d - 10);
    c.trigger("focus").trigger("select");
    c.focus();
    c.blur(function () {
        var g = $(this);
        var h = g.val();
        if (h == "") {
            f.html("<span>默认栏目名称</span>")
        } else {
            f.html("<span>" + h + "</span>")
        }
        if (h != a) {
            $("#saveButton").attr("disabled", false)
        }
    });
    c.keyup(function (i) {
        var k = i || window.event;
        var g = k.keyCode;
        var h = $(this);
        switch (g) {
            case 13:
                var j = h.val();
                if (j == "") {
                    f.html("<span>默认栏目名称</span>")
                } else {
                    f.html("<span>" + j + "</span>")
                }
                if (j != a) {
                    $("#saveButton").attr("disabled", false)
                }
                break;
            case 27:
                f.html("<span>" + a + "</span>");
                break
        }
    })
};
COMMON.containsChinese = function (b) {
    var a = /[\u4e00-\u9fa5]+/;
    return a.test(b)
};
COMMON.refreshClass = function (a) {
    a.children().each(function () {
        $(this).attr("class", $(this).attr("class"));
        COMMON.refreshClass($(this))
    })
};
COMMON.addInterval = function (d, c, a) {
    if (COMMON.isNull(COMMON.intervalFunc)) {
        COMMON.intervalFunc = new Array()
    }
    for (var b = 0; b < COMMON.intervalFunc.length; ++b) {
        if (COMMON.intervalFunc[b].id == d) {
            COMMON.intervalFunc.splice(b, 1);
            break
        }
    }
    COMMON.intervalFunc.push({
        id: d,
        func: c,
        interval: a,
        type: 1
    })
};
COMMON.addTimeout = function (d, c, a) {
    if (COMMON.isNull(COMMON.intervalFunc)) {
        COMMON.intervalFunc = new Array()
    }
    for (var b = 0; b < COMMON.intervalFunc.length; ++b) {
        if (COMMON.intervalFunc[b].id == d) {
            COMMON.intervalFunc.splice(b, 1);
            break
        }
    }
    COMMON.intervalFunc.push({
        id: d,
        func: c,
        interval: a,
        type: 0
    })
};
COMMON.startInterval = function (c) {
    if (COMMON.isNull(COMMON.intervalFunc)) {
        return
    }
    for (var b = 0; b < COMMON.intervalFunc.length; ++b) {
        var a = COMMON.intervalFunc[b];
        if (c == null || a.id == c) {
            if (a.timer) {
                clearInterval(a.timer)
            }
            if (a.type == 1) {
                a.timer = setInterval(a.func, a.interval)
            } else {
                a.timer = setTimeout(a.func, a.interval)
            }
        }
    }
};

COMMON.stopInterval = function (c) {
    if (COMMON.isNull(COMMON.intervalFunc)) {
        return
    }
    for (var b = 0; b < COMMON.intervalFunc.length; ++b) {
        var a = COMMON.intervalFunc[b];
        if (c == null || a.id == c) {
            if (a.timer) {
                clearInterval(a.timer)
            }
        }
    }
};
jQuery.extend(jQuery.fx.step, {
    opacity: function (a) {
        var b = jQuery.style(a.elem, "opacity");
        if (b == null || b == "" || b != a.now) {
            jQuery.style(a.elem, "opacity", a.now)
        }
    }
});
jQuery.extend(jQuery.easing, {
    commoncount: 10,
    commonlinear: function (f, h, a, j, i) {
        var g = Math.abs(j - a) / jQuery.easing.commoncount;
        if (g == 0) {
            return j
        }
        f = parseInt(f / g) * g;
        return jQuery.easing.linear(f, h, a, j, i)
    }
});
COMMON.easingConacLinear = function () {
    jQuery.extend(jQuery.easing, {
        swing: function (f, g, a, i, h) {
            return jQuery.easing.commonlinear(f, g, a, i, h)
        }
    })
};
COMMON.getDivHeight = function (f) {
    var d = COMMON.getCssInt(f, "padding-top") + COMMON.getCssInt(f, "padding-bottom");
    var c = COMMON.getCssInt(f, "margin-top") + COMMON.getCssInt(f, "margin-bottom");
    var b = COMMON.getCssInt(f, "border-top-width") + COMMON.getCssInt(f, "border-bottom-width");
    var a = f.height();
    return a + b + c + d
};
COMMON.getDivWidth = function (f) {
    var d = COMMON.getCssInt(f, "padding-left") + COMMON.getCssInt(f, "padding-right");
    var c = COMMON.getCssInt(f, "margin-left") + COMMON.getCssInt(f, "margin-right");
    var a = COMMON.getCssInt(f, "border-left-width") + COMMON.getCssInt(f, "border-right-width");
    var b = f.width();
    return b + a + c + d
};
COMMON.getFrameHeight = function (d) {
    var c = COMMON.getCssInt(d, "padding-top") + COMMON.getCssInt(d, "padding-bottom");
    var b = COMMON.getCssInt(d, "margin-top") + COMMON.getCssInt(d, "margin-bottom");
    var a = COMMON.getCssInt(d, "border-top-width") + COMMON.getCssInt(d, "border-bottom-width");
    return a + b + c
};
COMMON.getFrameWidth = function (d) {
    var c = COMMON.getCssInt(d, "padding-left") + COMMON.getCssInt(d, "padding-right");
    var b = COMMON.getCssInt(d, "margin-left") + COMMON.getCssInt(d, "margin-right");
    var a = COMMON.getCssInt(d, "border-left-width") + COMMON.getCssInt(d, "border-right-width");
    return a + b + c
};
COMMON.showMenu = function (n) {
    var r = n.id;
    if (COMMON.isNull(r)) {
        r = ""
    }
    var p = n.host;
    var m = 0;
    if (!COMMON.isNull(n.mode)) {
        m = n.mode
    }
    if (COMMON.isNull(n.fixpos)) {
        n.fixpos = true
    }
    var l = n.rulerObj;
    var g = n.navSysClass;
    if (COMMON.isNull(g)) {
        g = ""
    }
    var f = 0;
    if (!COMMON.isNull(n.closeMode)) {
        f = n.closeMode
    }
    var k = 0;
    var q = 0;
    if (m == 1) {
        k = p.offset().left + p.width();
        q = p.offset().top
    } else {
        k = p.offset().left;
        q = p.offset().top + p.height()
    }
    var c = $("#g_menu" + r);
    if (c.length != 0) {
        if (f == 0) {
            c.attr("_mouseIn", 1);
            return c
        } else {
            c.attr("_mouseIn", 0);
            COMMON.hideMenu();
            return null
        }
    }
    $(".g_menu").each(function () {
        $(this).remove()
    });
    var B = n.data;
    if (n.data == null || n.data == "") {
        return null
    }
    c = $("<div id='g_menu" + r + "' tabindex='0' hidefocus='true' class='g_menu " + n.cls + " " + (n.clsIndex ? n.cls + "Index" + n.clsIndex : "") + " " + g + "' style='display:block;outline:none;'></div>");
    c.appendTo($("body"));
    var u = $("<div class='content contentLayer1'></div>");
    u.appendTo(c);
    COMMON.addMenuItem(B, u, n);
    if (n.fixpos) {
        if (q + c.height() + 20 > $(document).height()) {
            q = p.offset().top - c.height()
        }
    }
    c.css("left", k - COMMON.getCssInt(u, "border-left-width") + "px");
    c.css("top", q + "px");
    if (f == 0) {
        c.mouseleave(function () {
            c.attr("_mouseIn", 0);
            setTimeout("COMMON.hideMenu()", 100)
        });
        c.mouseover(function () {
            c.attr("_mouseIn", 1)
        });
        c.click(function () {
            c.attr("_mouseIn", 0);
            COMMON.hideMenu()
        });
        p.mouseleave(function () {
            c.attr("_mouseIn", 0);
            setTimeout("COMMON.hideMenu()", 100)
        });
        p.mouseover(function () {
            c.attr("_mouseIn", 1)
        })
    } else {
        p.mousedown(function () {
            c.attr("_mouseIn", 2)
        });
        c.bind("blur",
        function () {
            if (c.attr("_mouseIn") != 2) {
                c.attr("_mouseIn", 0);
                setTimeout("COMMON.hideMenu()", 100)
            }
        });
        c.focus()
    }
    if (typeof g_bindMenuMousewheel == "undefined") {
        g_bindMenuMousewheel = 1;
        $("body").bind("mousewheel",
        function () {
            $("#g_menu").remove()
        })
    }
    c.attr("_mouseIn", 1);
    c.slideDown(200);
    COMMON.calcMenuSize(c, n);
    var s = $("#g_menu" + r + ">div.content>table>tbody>tr>td.center>table.item");
    var w = $("#g_menu" + r);
    var C = (w.outerWidth() - w.width()) + (w.find(".content").outerWidth() - w.find(".content").width()) + (w.find(".content .middle").outerWidth() - w.find(".content .middle").width()) + (w.find(".content .middle .left").outerWidth() - w.find(".content .middle .right").outerWidth()) + (w.find(".content .middle .center").outerWidth() - w.find(".content .middle .center").width());
    var a = s.first().css("clear");
    var b = s.first().outerWidth();
    var j = s.length;
    if (a == "none") {
        if (j > 1 && b > 0) {
            var y = b * j;
            var v = document.documentElement.clientWidth;
            var t = w.offset().left;
            var i = w.offset().right;
            var A = w.width();
            var d = p.offset().left;
            var h = l.outerWidth();
            var x = l.offset().left;
            var o = x + h;
            if (d > v / 2) {
                if (y < v && y > v / 2) {
                    var z = o - y;
                    w.offset({
                        left: z - C
                    });
                    w.find(".content>.middle").width("100%")
                }
                if (y < v && y < v / 2 && (o - t) < y) {
                    var z = o - y;
                    w.offset({
                        left: z - C
                    });
                    w.find(".content>.middle").width("100%")
                }
                if (y > v) {
                    if (v < A) {
                        w.offset({
                            left: 0
                        });
                        w.find(".content>.middle").width("100%")
                    } else {
                        w.offset({
                            left: x
                        });
                        w.find(".content>.middle").width("100%")
                    }
                }
            } else {
                if (y < v && (v - d) < y) {
                    var z = v - y;
                    w.offset({
                        left: z - C
                    });
                    w.find(".content>.middle").width("100%")
                }
                if (y < v && (o - t) < y) {
                    var z = o - y;
                    w.offset({
                        left: z - C
                    });
                    w.find(".content>.middle").width("100%")
                }
                if (y > v) {
                    if (v < A) {
                        w.offset({
                            left: 0
                        });
                        w.find(".content>.middle").width("100%")
                    } else {
                        w.offset({
                            left: x
                        });
                        w.find(".content>.middle").width("100%")
                    }
                }
            }
        }
    }
    return c
};
COMMON.addMenuItem = function (t, b, j) {
    if (t.length <= 0) {
        return
    }
    var d = ["<table class='top' cellpadding='0' cellspacing='0'><tr><td class='left'></td><td class='center'></td><td class='right'></td></tr></table>", "<table class='middle' cellpadding='0' cellspacing='0'><tr><td class='left'></td><td class='center'></td><td class='right'></td></tr></table>", "<table class='bottom' cellpadding='0' cellspacing='0'><tr><td class='left'></td><td class='center'></td><td class='right'></td></tr></table>"];
    var n = $(d.join(""));
    n.appendTo(b);
    n = n.parent().find(".middle .center");
    for (var o = 0; o < t.length; ++o) {
        var q = t[o];
        var g = q.sub;
        var p = q.href;
        var u = q.onclick;
        var s = q.target;
        var f = q.disable;
        var c = "";
        if (!p && !u) {
            p = "";
            u = ""
        } else {
            if (!p) {
                p = " href='javascript:;'"
            } else {
                if (f) {
                    p = ""
                } else {
                    p = ' href="' + p + '" style="cursor:pointer;"'
                }
            }
            if (!u) {
                u = ""
            } else {
                u = ' onclick="' + u + '"'
            }
            if (!s) {
                s = ""
            } else {
                s = " target='" + s + "'"
            }
        }
        var l = parseInt(Math.random() * 100000);
        var h = [];
        var r = o + 1;
        h.push("<table class='item itemIndex" + r + "' itemId='");
        h.push(l);
        h.push("' cellpadding='0' cellspacing='0'><tr><td class='itemLeft'></td><td class='itemCenter'><a hidefocus='true' ");
        h.push(p);
        h.push(u);
        h.push(s);
        if (q.title) {
            h.push(" title='" + q.title + "'")
        }
        h.push(">" + q.html + "</a></td><td class='itemRight'></td></tr></table>");
        var k = $(h.join(""));
        if (g) {
            k.addClass("itemPopup")
        }
        if (n.find(" > .subMenu").length >= 1) {
            k.insertBefore(n.find(" > .subMenu").first())
        } else {
            k.appendTo(n)
        }
        if (g) {
            if (g.length == 0) { }
            var m = $("<div class='subMenu' itemId='" + l + "'><div class='content contentLayer2'></div></div>");
            m.appendTo(n);
            var a = m.find(" > .content");
            COMMON.addMenuItem(g, a, j);
            m.mouseleave(function () {
                $(this).attr("_mouseIn", 0);
                setTimeout(function () {
                    COMMON.hideSubMenu()
                },
                100);
                if (j.navBar == true && COMMON.isIE()) {
                    var w = $("#g_menu" + j.id);
                    var y = w.find(".contentLayer1");
                    var i = y.outerHeight(true);
                    var x = y.outerWidth(true);
                    var v = y.children(".middle").first().outerWidth(true);
                    w.css({
                        width: x + "px",
                        height: i + "px"
                    });
                    y.css({
                        width: v + "px"
                    })
                }
            });
            m.mouseover(function () {
                $(this).attr("_mouseIn", 1)
            });
            m.click(function () {
                $(this).attr("_mouseIn", 0);
                COMMON.hideSubMenu()
            })
        }
        k.hover(function () {
            var A = $(this);
            var K = null;
            $(this).parent().find(" > .subMenu").each(function (M, L) {
                if ($(this).attr("itemId") == A.attr("itemId")) {
                    K = $(this)
                }
            });
            if (K != null && K.length == 1) {
                if (K.css("display") == "none") {
                    if (K.attr("_hadShow") != 1) {
                        var v = A.position().left + A.width();
                        var F = A.position().top;
                        if (j.fixpos) {
                            var G = A.offset().top + K.height() + 20 - $(document).height();
                            if (G > 0) {
                                F = F - G
                            }
                        }
                        K.css("left", v + "px");
                        K.css("top", F + "px");
                        K.slideDown(200);
                        COMMON.calcMenuSize(K, j);
                        K.attr("_hadShow", 1)
                    } else {
                        K.slideDown(200)
                    }
                }
                K.attr("_mouseIn", 1);
                if (j.navBar == true && COMMON.isIE()) {
                    var i = $("#g_menu" + j.id);
                    var y = i.find(".contentLayer1");
                    var w = K.find(".contentLayer2");
                    var J = y.outerHeight(true);
                    var E = y.outerWidth(true);
                    var D = y.children(".middle").first().outerWidth(true);
                    var I = w.outerHeight(true);
                    var x = w.outerWidth(true);
                    var H = K.position().top;
                    var z = (I + H) - J;
                    var C = z > 0 ? (J + z) : J;
                    var B = E + x;
                    i.css({
                        width: B + "px",
                        height: C + "px"
                    });
                    y.css({
                        width: D + "px"
                    })
                }
            } else {
                if ($(this).parents(".subMenu").length <= 0) {
                    if (j.navBar == true && COMMON.isIE()) {
                        var i = $("#g_menu" + j.id);
                        var y = i.find(".contentLayer1");
                        var D = y.children(".middle").first().outerWidth(true);
                        var C = y.outerHeight(true);
                        var B = y.outerWidth(true);
                        i.css({
                            width: B + "px",
                            height: C + "px"
                        });
                        y.css({
                            width: D + "px"
                        })
                    }
                }
            }
            A.addClass("itemHover");
            A.addClass("itemHoverIndex" + (A.index() + 1));
            $(".g_menu").attr("_mouseIn", 1)
        },
        function () {
            var i = $(this);
            var v = null;
            $(this).parent().find(" > .subMenu").each(function () {
                if ($(this).attr("itemId") == i.attr("itemId")) {
                    v = $(this)
                }
            });
            if (v != null && v.length == 1) {
                v.attr("_mouseIn", 0);
                setTimeout(function () {
                    COMMON.hideSubMenu()
                },
                100)
            } else {
                i.removeClass("itemHover");
                i.removeClass("itemHoverIndex" + (i.index() + 1))
            }
        }).click(function () {
            $(".g_menu").attr("_mouseIn", 0);
            setTimeout("COMMON.hideMenu()", 100)
        });
        if (j.closeMode == 1) {
            k.mousedown(function () {
                $(".g_menu").attr("_mouseIn", 2)
            })
        }
    }
};
COMMON.calcMenuSize = function (b, a) {
    b.find(" > .content").each(function () {
        var d = $(" > .middle", this);
        var f = 0;
        if (!COMMON.isNull(a.minWidth)) {
            f = a.minWidth - COMMON.getCssInt(d.find(".left").first(), "width") - COMMON.getCssInt(d.find(".right").first(), "width")
        }
        var g = f;
        var c = d.find(" > tbody > tr > .center > .item");
        c.each(function () {
            if ($(this).width() > f) {
                g = $(this).outerWidth();
                f = $(this).width()
            }
        });
        c.width(g);
        c.find(" > tbody > tr > .itemCenter").each(function () {
            var k = $(this);
            var h = k.parent().find(" > .itemLeft");
            var i = k.parent().find(" > .itemRight");
            k.css("width", (f - h.outerWidth() - i.outerWidth() - k.outerWidth() + k.width()) + "px");
            var j = k.find("a");
            j.css("width", (k.width() - j.outerWidth() + j.width()) + "px")
        });
        $(" > .top", this).width(d.width());
        $(" > .bottom", this).width(d.width())
    })
};
COMMON.hideSubMenu = function () {
    $(".g_menu .subMenu").each(function () {
        var a = $(this);
        if (a.length != 1) {
            return
        }
        if (a.attr("_mouseIn") == 1) {
            return
        }
        a.css("display", "none");
        a.parent().find(" > .item").each(function () {
            if ($(this).attr("itemId") == a.attr("itemId")) {
                $(this).removeClass("itemHover")
            }
        })
    })
};
COMMON.hideMenu = function () {
    $(".g_menu").each(function () {
        var a = $(this);
        if (a.length != 1) {
            return
        }
        if (a.attr("_mouseIn") == 1) {
            return
        }
        a.remove()
    })
};
COMMON.calcCtrlWidth = function (a, b) {
    padding = COMMON.getCssInt(b, "padding-left") + COMMON.getCssInt(b, "padding-right");
    margin = COMMON.getCssInt(b, "margin-left") + COMMON.getCssInt(b, "margin-right");
    border = COMMON.getCssInt(b, "border-left-width") + COMMON.getCssInt(b, "border-right-width");
    b.width(a - padding - margin - border)
};
COMMON.calcCtrlHeight = function (a, b) {
    padding = COMMON.getCssInt(b, "padding-top") + COMMON.getCssInt(b, "padding-bottom");
    margin = COMMON.getCssInt(b, "margin-top") + COMMON.getCssInt(b, "margin-bottom");
    border = COMMON.getCssInt(b, "border-top-width") + COMMON.getCssInt(b, "border-bottom-width");
    b.height(a - padding - margin - border)
};
COMMON.calcGridSize = function (c, a, d, b, k) {
    if (c > 0) {
        var j = COMMON.getCssInt(a, "padding-left") + COMMON.getCssInt(a, "padding-right");
        var g = COMMON.getCssInt(a, "margin-left") + COMMON.getCssInt(a, "margin-right");
        var h = COMMON.getCssInt(a, "border-left-width") + COMMON.getCssInt(a, "border-right-width");
        a.css("overflow-x", "hidden");
        a.width(c - j - h - g)
    }
    var f = 0;
    if (d.css("display") != "none") {
        j = COMMON.getCssInt(d, "padding-left") + COMMON.getCssInt(d, "padding-right");
        g = COMMON.getCssInt(d, "margin-left") + COMMON.getCssInt(d, "margin-right");
        h = COMMON.getCssInt(d, "border-left-width") + COMMON.getCssInt(d, "border-right-width");
        f = d.width() + j + g + h
    }
    var i = 0;
    if (k.css("display") != "none") {
        j = COMMON.getCssInt(k, "padding-left") + COMMON.getCssInt(k, "padding-right");
        g = COMMON.getCssInt(k, "margin-left") + COMMON.getCssInt(k, "margin-right");
        h = COMMON.getCssInt(k, "border-left-width") + COMMON.getCssInt(k, "border-right-width");
        i = k.width() + j + g + h
    }
    COMMON.calcCtrlWidth(a.width() - f - i, b);
    j = COMMON.getCssInt(b, "padding-top") + COMMON.getCssInt(b, "padding-bottom");
    g = COMMON.getCssInt(b, "margin-top") + COMMON.getCssInt(b, "margin-bottom");
    h = COMMON.getCssInt(b, "border-top-width") + COMMON.getCssInt(b, "border-bottom-width");
    var l = b.height() + j + g + h;
    COMMON.calcCtrlHeight(l, d);
    COMMON.calcCtrlHeight(l, k)
};
COMMON.removeBgStyle = function (a) {
    if (a.attr("style")) {
        style = a.attr("style").toLowerCase();
        if (style.indexOf("background-image") > -1) {
            style = style.replace(/background-image[^;]*/gi, "")
        }
        if (style.indexOf("background-repeat") > -1) {
            style = style.replace(/background-repeat[^;]*/gi, "")
        }
        if (style.indexOf("background-position") > -1) {
            style = style.replace(/background-position[^;]*/gi, "")
        }
        if (style.indexOf("background-color") > -1) {
            style = style.replace(/background-color[^;]*/gi, "")
        }
        if (style.indexOf("background") > -1) {
            style = style.replace(/background[^;]*/gi, "")
        }
        if (style == "" || style == null) {
            a.removeAttr("style")
        } else {
            a.attr("style", style)
        }
    }
};
COMMON.showTip = function (c) {
    var a = new Array();
    if (!c.content) {
        c.content = ""
    }
    a.push("<div class='tip-content'>");
    if (c.closeSwitch) {
        a.push("<div class='tip-content'>");
        a.push("<a class='tip-btnClose'></a>")
    } else {
        a.push("<div class='tip-content'>")
    }
    a.push(c.content);
    a.push("</div>");
    var d = a.join("");
    var b = {
        content: d,
        className: "tip-yellowsimple",
        showTimeout: 1,
        hideTimeout: 0,
        alignTo: "target",
        alignX: "center",
        alignY: "top",
        offsetY: 5,
        showOn: "none",
        hideAniDuration: 0,
        id: "tip-yellowsimple" + parseInt(Math.random() * 10000)
    };
    if (c.id) {
        $.extend(b, {
            id: c.id
        })
    }
    if (c.showMode) {
        if (c.showMode == "left") {
            $.extend(b, {
                alignX: "left",
                alignY: "center",
                offsetY: 0,
                offsetX: 5
            })
        } else {
            if (c.showMode == "right") {
                $.extend(b, {
                    alignX: "right",
                    alignY: "center",
                    offsetY: 0,
                    offsetX: 5
                })
            } else {
                if (c.showMode == "top") {
                    $.extend(b, {
                        alignX: "center",
                        alignY: "top",
                        offsetY: 0,
                        offsetX: 5
                    })
                } else {
                    if (c.showMode == "bottom") {
                        $.extend(b, {
                            alignX: "center",
                            alignY: "bottom",
                            offsetY: 0,
                            offsetX: 5
                        })
                    }
                }
            }
        }
    }
    if (c.data) {
        $.extend(b, c.data)
    }
    if (c.appendToId) {
        $.extend(b, {
            appendToId: c.appendToId
        })
    }
    if (c.autoLocation) {
        $.extend(b, {
            autoLocation: c.autoLocation
        })
    }
    if (c.cusStyle) {
        $.extend(b, {
            cusStyle: c.cusStyle
        })
    }
    var f = $(c.tid);
    f.poshytip("destroy");
    f.poshytip(b);
    f.poshytip("show");
    if (c.cls) {
        $("#" + b.id).addClass(c.cls)
    }
    $("#" + b.id).find(".tip-btnClose").live("click",
    function () {
        if (c.beforeClose) {
            c.beforeClose()
        }
        COMMON.closeTip(c.tid)
    });
    if (c.autoTimeout) {
        window.setTimeout(function () {
            if (c.beforeClose) {
                c.beforeClose()
            }
            COMMON.closeTip(c.tid)
        },
        c.autoTimeout)
    }
};
COMMON.closeTip = function (a) {
    if (typeof $(a).poshytip == "function") {
        $(a).poshytip("destroy")
    }
};
COMMON.refreshTip = function (a) {
    $(a).poshytip("hide");
    $(a).poshytip("show")
};
COMMON.removeCss = function (d, a) {
    var c = new RegExp(a + "[^;]*;", "gi");
    var b = d.attr("style").replace(c, "");
    if (b == "" || b == null) {
        d.removeAttr("style")
    } else {
        d.attr("style", b)
    }
};
COMMON.rgb2hex = function (b) {
    if (b.charAt(0) == "#") {
        return b
    }
    var f = Number(b);
    var d = b.split(/\D+/);
    var a = Number(d[1]) * 65536 + Number(d[2]) * 256 + Number(d[3]);
    var c = a.toString(16);
    while (c.length < 6) {
        c = "0" + c
    }
    return "#" + c
};
COMMON.int2hex = function (a) {
    var b = a.toString(16);
    while (b.length < 6) {
        b = "0" + b
    }
    return "#" + b
};
COMMON.setCtrlStyleCss = function (c, b, l, k, j) {
    var a = $("#" + c);
    var h = new Array();
    if (a.length == 1) {
        var g = a.html();
        g = g.replace(/{\r\n/g, "{").replace(/\t/g, "").replace(/\r\n}/g, ";}");
        h = g.split("\n");
        a.remove()
    }
    var d = new RegExp("#" + b + " +" + l.replace(".", "\\.") + " *{ *" + k + "[^;]*;", "gi");
    if (b == "" || b == "undefined") {
        d = new RegExp(l.replace(".", "\\.") + " *{ *" + k + "[^;]*;", "gi")
    }
    for (var f = h.length - 1; f >= 0; --f) {
        var m = h[f];
        if (m.length == 0 || /^\s$/.test(m) || d.test(m)) {
            h.splice(f, 1)
        }
    }
    if (b == "" || b == "undefined") {
        h.push(l + "{" + k + ":" + j + ";}")
    } else {
        h.push("#" + b + " " + l + "{" + k + ":" + j + ";}")
    }
    $("head").append('<style type="text/css" id="' + c + '">' + h.join("\n") + "</style>")
};
COMMON.setCtrlStyleCssList = function (c, b, j, p) {
    var a = $("#" + c);
    var k = new Array();
    if (a.length == 1) {
        var h = a.html();
        h = h.replace(/{\r\n/g, "{").replace(/\t/g, "").replace(/\r\n}/g, ";}");
        k = h.split("\n");
        a.remove()
    }
    for (var g = k.length - 1; g >= 0; --g) {
        var o = k[g];
        for (var f = 0; f < j.length; ++f) {
            var m = j[f].cls;
            var l = j[f].key;
            var d = new RegExp("#" + b + " +" + m.replace(".", "\\.") + " *{ *" + l + "[^;]*;", "gi");
            if (b == "" || b == "undefined") {
                d = new RegExp(m.replace(".", "\\.") + " *{ *" + l + "[^;]*;", "gi")
            }
            if (o.length == 0 || /^\s$/.test(o) || d.test(o)) {
                k.splice(g, 1);
                break
            }
        }
    }
    for (var f = 0; f < j.length; ++f) {
        if (b == "" || b == "undefined") {
            k.push(j[f].cls + "{" + j[f].key + ":" + j[f].value + ";}")
        } else {
            k.push("#" + b + " " + j[f].cls + "{" + j[f].key + ":" + j[f].value + ";}")
        }
    }
    if (p && p.rev) {
        k.reverse()
    }
    $("head").append('<style type="text/css" id="' + c + '">' + k.join("\n") + "</style>")
};
COMMON.getCtrlStyleCss = function (d, c, k, j) {
    var b = $("#" + d);
    if (b.length == 0) {
        return ""
    }
    var h = b.html().split("\n");
    var f = new RegExp("#" + c + " +" + k.replace(".", "\\.") + " *{ *" + j + "[^;]*;", "gi");
    if (c == "" || c == "undefined") {
        f = new RegExp(k.replace(".", "\\.") + " *{ *" + j + "[^;]*;", "gi")
    }
    for (var g = h.length - 1; g >= 0; --g) {
        var l = h[g];
        var a = l.match(f);
        if (a && a.length >= 2) {
            return a[1]
        }
    }
    return ""
};
COMMON.removeCtrlStyleCss = function (c, b, k, j) {
    var a = $("#" + c);
    var h = new Array();
    if (a.length == 1) {
        var g = a.html();
        g = g.replace(/{\r\n/g, "{").replace(/\t/g, "").replace(/\r\n}/g, ";}");
        h = g.split("\n");
        a.remove()
    }
    var d = new RegExp("#" + b + " +" + k.replace(".", "\\.") + " *{ *" + j + "[^;]*;", "gi");
    if (b == "" || b == "undefined") {
        d = new RegExp(k.replace(".", "\\.") + " *{ *" + j + "[^;]*;", "gi")
    }
    for (var f = h.length - 1; f >= 0; --f) {
        var l = h[f];
        if (l.length == 0 || /^\s$/.test(l) || d.test(l)) {
            h.splice(f, 1)
        }
    }
    $("head").append('<style type="text/css" id="' + c + '">' + h.join("\n") + "</style>")
};
COMMON.removeCtrlStyleCssList = function (c, b, j) {
    var a = $("#" + c);
    var k = new Array();
    if (a.length == 1) {
        var h = a.html();
        h = h.replace(/{\r\n/g, "{").replace(/\t/g, "").replace(/\r\n}/g, ";}");
        k = h.split("\n");
        a.remove()
    }
    for (var g = k.length - 1; g >= 0; --g) {
        var o = k[g];
        for (var f = 0; f < j.length; ++f) {
            var m = j[f].cls;
            var l = j[f].key;
            var d = new RegExp("#" + b + " +" + m.replace(".", "\\.") + " *{ *" + l + "[^;]*;", "gi");
            if (b == "" || b == "undefined") {
                d = new RegExp(m.replace(".", "\\.") + " *{ *" + l + "[^;]*;", "gi")
            }
            if (o.length == 0 || /^\s$/.test(o) || d.test(o)) {
                k.splice(g, 1);
                break
            }
        }
    }
    $("head").append('<style type="text/css" id="' + c + '">' + k.join("\n") + "</style>")
};
COMMON.addCtrlStyle = function (a, d) {
    var c = $("#" + a);
    var f = new Array();
    if (c.length == 1) {
        var b = c.html();
        b = b.replace(/{\r\n/g, "{").replace(/\t/g, "").replace(/\r\n}/g, ";}");
        f = b.split("\n");
        c.remove()
    }
    f.push(d);
    $("head").append('<style type="text/css" id="' + a + '">' + f.join("\n") + "</style>")
};
COMMON.addBookmark = function (d, a) {
    try {
        try {
            window.sidebar.addPanel(d, a, "")
        } catch (b) {
            window.external.AddFavorite(a, d)
        }
    } catch (c) {
        alert("收藏网站失败，请使用Ctrl+D进行添加。")
    }
};
COMMON.setHomePage = function (c) {
    if (typeof (c) == "undefined") {
        c = location.protocol + "//" + location.host
    }
    var b = false;
    if (typeof LS == "undefined" || typeof LS.setHomePageSuccess == "undefined") {
        b = true
    }
    if ($.browser.msie) {
        try {
            document.body.style.behavior = "url(#default#homepage)";
            document.body.setHomePage(c)
        } catch (g) {
            var f = "您的浏览器暂时不支持自动设为首页，请手动添加。";
            if (!b) {
                d = LS.setHomePageNotSupport
            }
            alert(f)
        }
    } else {
        if ($.browser.mozilla) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).setCharPref("browser.startup.homepage", c);
                var a = "添加首页成功。";
                if (!b) {
                    a = LS.setHomePageSuccess
                }
                alert(a)
            } catch (g) {
                var d = "设置失败，请手动添加。";
                if (!b) {
                    d = LS.setHomePageError
                }
                alert(d)
            }
        } else {
            var f = "您的浏览器暂时不支持自动设为首页，请手动添加。";
            if (!b) {
                f = LS.setHomePageNotSupport
            }
            alert(f)
        }
    }
};
COMMON.singleTextAreaAddMaxLength = function (b, a) {
    if (typeof b != "undefined" && typeof a != "undefined") {
        var c = $("#" + b);
        c.attr("maxlength", a);
        c.bind("keydown keyup change blur",
        function () {
            textAreaObjVal = c.val();
            textAreaObjLength = textAreaObjVal.length;
            if (textAreaObjLength > a) {
                var d = textAreaObjVal.substr(0, a);
                c.val(d)
            }
        })
    }
};
COMMON.parseFileSize = function (c) {
    if (typeof c != "undefined" && typeof c == "number") {
        var b;
        if (c < 1024) {
            b = c + "B"
        } else {
            if (c < 1024 * 1024) {
                var a = c / 1024;
                b = a.toFixed(2) + "KB"
            } else {
                var a = c / (1024 * 1024);
                b = a.toFixed(2) + "MB"
            }
        }
        return b
    } else {
        return "-"
    }
};
COMMON.compareObj = function (c, a, b) {
    if (c === "") {
        if (a === "") {
            return 0
        }
        return 1
    }
    if (a === "") {
        return -1
    }
    if (!isNaN(c)) {
        if (!isNaN(a)) {
            c = Math.floor(c);
            a = Math.floor(a)
        } else {
            if (b) {
                return 1
            } else {
                return -1
            }
        }
    } else {
        if (!isNaN(a)) {
            if (b) {
                return -1
            } else {
                return 1
            }
        }
    }
    if (c > a) {
        if (b) {
            return -1
        } else {
            return 1
        }
    } else {
        if (c == a) {
            return 0
        } else {
            if (b) {
                return 1
            } else {
                return -1
            }
        }
    }
}; (function (a) {
    a.cookie = function (f, g, c) {
        if (arguments.length > 1 && (g === null || typeof g !== "object")) {
            c = a.extend({},
            c);
            if (g === null) {
                c.expires = -1
            }
            if (typeof c.expires === "number") {
                var i = c.expires,
                d = c.expires = new Date();
                d.setDate(d.getDate() + i)
            }
            return (document.cookie = [encodeURIComponent(f), "=", c.raw ? String(g) : encodeURIComponent(String(g)), c.expires ? "; expires=" + c.expires.toUTCString() : "", c.path ? "; path=" + c.path : "", c.domain ? "; domain=" + c.domain : "", c.secure ? "; secure" : ""].join(""))
        }
        c = g || {};
        var b, h = c.raw ?
        function (j) {
            return j
        } : decodeURIComponent;
        return (b = new RegExp("(?:^|; )" + encodeURIComponent(f) + "=([^;]*)").exec(document.cookie)) ? h(b[1]) : null
    }
})(jQuery); (function ($) {
    var escape = /["\\\x00-\x1f\x7f-\x9f]/g,
    meta = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    },
    hasOwn = Object.prototype.hasOwnProperty;
    $.toJSON = function (o) {
        if (o === null) {
            return "null"
        }
        var pairs, k, name, val, type = $.type(o);
        if (type === "undefined") {
            return undefined
        }
        if (type === "number" || type === "boolean") {
            return String(o)
        }
        if (type === "string") {
            return $.quoteString(o)
        }
        if (typeof o.toJSON === "function") {
            return $.toJSON(o.toJSON())
        }
        if (type === "date") {
            var month = o.getUTCMonth() + 1,
            day = o.getUTCDate(),
            year = o.getUTCFullYear(),
            hours = o.getUTCHours(),
            minutes = o.getUTCMinutes(),
            seconds = o.getUTCSeconds(),
            milli = o.getUTCMilliseconds();
            if (month < 10) {
                month = "0" + month
            }
            if (day < 10) {
                day = "0" + day
            }
            if (hours < 10) {
                hours = "0" + hours
            }
            if (minutes < 10) {
                minutes = "0" + minutes
            }
            if (seconds < 10) {
                seconds = "0" + seconds
            }
            if (milli < 100) {
                milli = "0" + milli
            }
            if (milli < 10) {
                milli = "0" + milli
            }
            return '"' + year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds + "." + milli + 'Z"'
        }
        pairs = [];
        if ($.isArray(o)) {
            for (k = 0; k < o.length; k++) {
                pairs.push($.toJSON(o[k]) || "null")
            }
            return "[" + pairs.join(",") + "]"
        }
        if (typeof o === "object") {
            for (k in o) {
                if (hasOwn.call(o, k)) {
                    type = typeof k;
                    if (type === "number") {
                        name = '"' + k + '"'
                    } else {
                        if (type === "string") {
                            name = $.quoteString(k)
                        } else {
                            continue
                        }
                    }
                    type = typeof o[k];
                    if (type !== "function" && type !== "undefined") {
                        val = $.toJSON(o[k]);
                        pairs.push(name + ":" + val)
                    }
                }
            }
            return "{" + pairs.join(",") + "}"
        }
    };
    $.evalJSON = typeof JSON === "object" && JSON.parse ? JSON.parse : function (str) {
        return eval("(" + str + ")")
    };
    $.secureEvalJSON = typeof JSON === "object" && JSON.parse ? JSON.parse : function (str) {
        var filtered = str.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "");
        if (/^[\],:{}\s]*$/.test(filtered)) {
            return eval("(" + str + ")")
        }
        throw new SyntaxError("Error parsing JSON, source is not valid.")
    };
    $.quoteString = function (str) {
        if (str.match(escape)) {
            return '"' + str.replace(escape,
            function (a) {
                var c = meta[a];
                if (typeof c === "string") {
                    return c
                }
                c = a.charCodeAt();
                return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16)
            }) + '"'
        }
        return '"' + str + '"'
    }
}(jQuery)); (function (f) {
    var b = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var d = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var c = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var a = [];
    a.Jan = "01";
    a.Feb = "02";
    a.Mar = "03";
    a.Apr = "04";
    a.May = "05";
    a.Jun = "06";
    a.Jul = "07";
    a.Aug = "08";
    a.Sep = "09";
    a.Oct = "10";
    a.Nov = "11";
    a.Dec = "12";
    f.format = (function () {
        function j(l) {
            return b[parseInt(l, 10)] || l
        }
        function k(m) {
            var l = parseInt(m, 10) - 1;
            return d[l] || m
        }
        function i(m) {
            var l = parseInt(m, 10) - 1;
            return c[l] || m
        }
        var g = function (l) {
            return a[l] || l
        };
        var h = function (o) {
            var p = o;
            var m = "";
            if (p.indexOf(".") !== -1) {
                var n = p.split(".");
                p = n[0];
                m = n[1]
            }
            var l = p.split(":");
            if (l.length === 3) {
                hour = l[0];
                minute = l[1];
                second = l[2];
                return {
                    time: p,
                    hour: hour,
                    minute: minute,
                    second: second,
                    millis: m
                }
            } else {
                return {
                    time: "",
                    hour: "",
                    minute: "",
                    second: "",
                    millis: ""
                }
            }
        };
        return {
            date: function (y, x) {
                try {
                    var m = null;
                    var u = null;
                    var s = null;
                    var A = null;
                    var n = null;
                    var l = null;
                    if (typeof y.getFullYear === "function") {
                        u = y.getFullYear();
                        s = y.getMonth() + 1;
                        A = y.getDate();
                        n = y.getDay();
                        l = h(y.toTimeString())
                    } else {
                        if (y.search(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d{0,3}[-+]?\d{2}:?\d{2}/) != -1) {
                            var z = y.split(/[T\+-]/);
                            u = z[0];
                            s = z[1];
                            A = z[2];
                            l = h(z[3].split(".")[0]);
                            m = new Date(u, s - 1, A);
                            n = m.getDay()
                        } else {
                            var z = y.split(" ");
                            switch (z.length) {
                                case 6:
                                    u = z[5];
                                    s = g(z[1]);
                                    A = z[2];
                                    l = h(z[3]);
                                    m = new Date(u, s - 1, A);
                                    n = m.getDay();
                                    break;
                                case 2:
                                    var w = z[0].split("-");
                                    u = w[0];
                                    s = w[1];
                                    A = w[2];
                                    l = h(z[1]);
                                    m = new Date(u, s - 1, A);
                                    n = m.getDay();
                                    break;
                                case 7:
                                case 9:
                                case 10:
                                    u = z[3];
                                    s = g(z[1]);
                                    A = z[2];
                                    l = h(z[4]);
                                    m = new Date(u, s - 1, A);
                                    n = m.getDay();
                                    break;
                                default:
                                    return y
                            }
                        }
                    }
                    var t = "";
                    var q = "";
                    for (var p = 0; p < x.length; p++) {
                        var v = x.charAt(p);
                        t += v;
                        switch (t) {
                            case "ddd":
                                q += j(n);
                                t = "";
                                break;
                            case "dd":
                                if (x.charAt(p + 1) == "d") {
                                    break
                                }
                                if (String(A).length === 1) {
                                    A = "0" + A
                                }
                                q += A;
                                t = "";
                                break;
                            case "MMMM":
                                q += i(s);
                                t = "";
                                break;
                            case "MMM":
                                if (x.charAt(p + 1) === "M") {
                                    break
                                }
                                q += k(s);
                                t = "";
                                break;
                            case "MM":
                                if (x.charAt(p + 1) == "M") {
                                    break
                                }
                                if (String(s).length === 1) {
                                    s = "0" + s
                                }
                                q += s;
                                t = "";
                                break;
                            case "yyyy":
                                q += u;
                                t = "";
                                break;
                            case "yy":
                                if (x.charAt(p + 1) == "y" && x.charAt(p + 2) == "y") {
                                    break
                                }
                                q += String(u).slice(-2);
                                t = "";
                                break;
                            case "HH":
                                q += l.hour;
                                t = "";
                                break;
                            case "hh":
                                var o = (l.hour == 0 ? 12 : l.hour < 13 ? l.hour : l.hour - 12);
                                o = String(o).length == 1 ? "0" + o : o;
                                q += o;
                                t = "";
                                break;
                            case "h":
                                if (x.charAt(p + 1) == "h") {
                                    break
                                }
                                var o = (l.hour == 0 ? 12 : l.hour < 13 ? l.hour : l.hour - 12);
                                q += o;
                                t = "";
                                break;
                            case "mm":
                                q += l.minute;
                                t = "";
                                break;
                            case "ss":
                                q += l.second.substring(0, 2);
                                t = "";
                                break;
                            case "SSS":
                                q += l.millis.substring(0, 3);
                                t = "";
                                break;
                            case "a":
                                q += l.hour >= 12 ? "PM" : "AM";
                                t = "";
                                break;
                            case " ":
                                q += v;
                                t = "";
                                break;
                            case "/":
                                q += v;
                                t = "";
                                break;
                            case ":":
                                q += v;
                                t = "";
                                break;
                            default:
                                if (t.length === 2 && t.indexOf("y") !== 0 && t != "SS") {
                                    q += t.substring(0, 1);
                                    t = t.substring(1, 2)
                                } else {
                                    if ((t.length === 3 && t.indexOf("yyy") === -1)) {
                                        t = ""
                                    }
                                }
                        }
                    }
                    return q
                } catch (r) {
                    return y
                }
            }
        }
    }())
}(jQuery)); (function (b, a) {
    $window = b(a);
    b.fn.lazyload = function (c) {
        var d = {
            threshold: 0,
            commonlure_limit: 0,
            event: "scroll",
            effect: "show",
            container: a,
            data_attribute: "original",
            skip_invisible: true,
            appear: null,
            load: null,
            lazyRemoveclass: ""
        };
        if (c) {
            if (undefined !== c.commonlurelimit) {
                c.commonlure_limit = c.commonlurelimit;
                delete c.commonlurelimit
            }
            if (undefined !== c.effectspeed) {
                c.effect_speed = c.effectspeed;
                delete c.effectspeed
            }
            b.extend(d, c)
        }
        var f = this;
        if (0 == d.event.indexOf("scroll")) {
            b(d.container).bind(d.event,
            function (h) {
                var g = 0;
                f.each(function () {
                    $this = b(this);
                    if (d.skip_invisible && !$this.is(":visible")) {
                        return
                    }
                    if (b.abovethetop(this, d) || b.leftofbegin(this, d)) { } else {
                        if (!b.belowthefold(this, d) && !b.rightoffold(this, d)) {
                            $this.trigger("appear")
                        } else {
                            if (++g > d.commonlure_limit) { }
                        }
                    }
                })
            })
        }
        this.each(function () {
            var g = this;
            var h = b(g);
            g.loaded = false;
            h.one("appear",
            function () {
                if (!this.loaded) {
                    if (d.appear) {
                        var i = f.length;
                        d.appear.call(g, i, d)
                    }
                    b("<img />").bind("load",
                    function () {
                        h.hide().removeClass(d.lazyRemoveclass).attr("src", h.data(d.data_attribute))[d.effect](d.effect_speed);
                        g.loaded = true;
                        var j = b.grep(f,
                        function (l) {
                            return !l.loaded
                        });
                        f = b(j);
                        if (d.load) {
                            var k = f.length;
                            d.load.call(g, k, d)
                        }
                    }).attr("src", h.data(d.data_attribute)).removeClass(d.lazyRemoveclass)
                }
            });
            if (0 != d.event.indexOf("scroll")) {
                h.bind(d.event,
                function (i) {
                    if (!g.loaded) {
                        h.trigger("appear")
                    }
                })
            }
        });
        $window.bind("resize",
        function (g) {
            b(d.container).trigger(d.event)
        });
        b(d.container).trigger(d.event);
        return this
    };
    b.belowthefold = function (d, f) {
        if (f.container === undefined || f.container === a) {
            var c = $window.height() + $window.scrollTop()
        } else {
            var c = b(f.container).offset().top + b(f.container).height()
        }
        return c <= b(d).offset().top - f.threshold
    };
    b.rightoffold = function (d, f) {
        if (f.container === undefined || f.container === a) {
            var c = $window.width() + $window.scrollLeft()
        } else {
            var c = b(f.container).offset().left + b(f.container).width()
        }
        return c <= b(d).offset().left - f.threshold
    };
    b.abovethetop = function (d, f) {
        if (f.container === undefined || f.container === a) {
            var c = $window.scrollTop()
        } else {
            var c = b(f.container).offset().top
        }
        return c >= b(d).offset().top + f.threshold + b(d).height()
    };
    b.leftofbegin = function (d, f) {
        if (f.container === undefined || f.container === a) {
            var c = $window.scrollLeft()
        } else {
            var c = b(f.container).offset().left
        }
        return c >= b(d).offset().left + f.threshold + b(d).width()
    };
    b.inviewport = function (c, d) {
        return !b.rightofscreen(c, d) && !b.leftofscreen(c, d) && !b.belowthefold(c, d) && !b.abovethetop(c, d)
    };
    b.extend(b.expr[":"], {
        "below-the-fold": function (c) {
            return b.belowthefold(c, {
                threshold: 0,
                container: a
            })
        },
        "above-the-top": function (c) {
            return !b.belowthefold(c, {
                threshold: 0,
                container: a
            })
        },
        "right-of-screen": function (c) {
            return b.rightoffold(c, {
                threshold: 0,
                container: a
            })
        },
        "left-of-screen": function (c) {
            return !b.rightoffold(c, {
                threshold: 0,
                container: a
            })
        },
        "in-viewport": function (c) {
            return !b.inviewport(c, {
                threshold: 0,
                container: a
            })
        },
        "above-the-fold": function (c) {
            return !b.belowthefold(c, {
                threshold: 0,
                container: a
            })
        },
        "right-of-fold": function (c) {
            return b.rightoffold(c, {
                threshold: 0,
                container: a
            })
        },
        "left-of-fold": function (c) {
            return !b.rightoffold(c, {
                threshold: 0,
                container: a
            })
        }
    })
})(jQuery, window); (function (a) {
    a.flag = function (k, m, j) {
        if (typeof k != "number") {
            return null
        }
        var f = {
            key: 0,
            digit: 32,
            options: "",
            setBoolean: ""
        };
        if (m || m === 0) {
            a.extend(f, {
                key: k,
                options: m,
                setBoolean: j
            });
            if (typeof m === "number") {
                if (typeof f.setBoolean != "boolean") {
                    if (f.options >= 0 && f.options < f.digit) {
                        var c = 1 << f.options;
                        return (f.key & c) == c
                    } else {
                        return false
                    }
                } else {
                    if (f.options >= 0 && f.options < f.digit) {
                        var c = 1 << f.options;
                        if (f.setBoolean) {
                            k |= c
                        } else {
                            k &= ~c
                        }
                    }
                    return k
                }
            } else {
                if (typeof m === "object") {
                    var g = m["true"];
                    var l = m["false"];
                    if ((typeof g != "undefined" || typeof l != "undefined") && (g.length > 0 || l.length > 0)) {
                        var b = {};
                        for (var h = 0; h < g.length; h++) {
                            b[g[h]] = true
                        }
                        for (var h = 0; h < l.length; h++) {
                            b[l[h]] = false
                        }
                        a.extend(f, {
                            options: b
                        })
                    }
                    for (var h = 0; h < f.digit; h++) {
                        var d = f.options[h];
                        var c = 1 << h;
                        if (typeof d != "undefined" && typeof d === "boolean") {
                            if (d) {
                                k |= c
                            } else {
                                k &= ~c
                            }
                        }
                    }
                    return k
                }
            }
        } else {
            return null
        }
    }
})(jQuery); (function (g) {
    function o(u, z) {
        var w = (u & 65535) + (z & 65535),
        v = (u >> 16) + (z >> 16) + (w >> 16);
        return (v << 16) | (w & 65535)
    }
    function s(u, v) {
        return (u << v) | (u >>> (32 - v))
    }
    function c(A, w, v, u, z, y) {
        return o(s(o(o(w, A), o(u, y)), z), v)
    }
    function b(w, v, B, A, u, z, y) {
        return c((v & B) | ((~v) & A), w, v, u, z, y)
    }
    function i(w, v, B, A, u, z, y) {
        return c((v & A) | (B & (~A)), w, v, u, z, y)
    }
    function n(w, v, B, A, u, z, y) {
        return c(v ^ B ^ A, w, v, u, z, y)
    }
    function a(w, v, B, A, u, z, y) {
        return c(B ^ (v | (~A)), w, v, u, z, y)
    }
    function d(F, A) {
        F[A >> 5] |= 128 << ((A) % 32);
        F[(((A + 64) >>> 9) << 4) + 14] = A;
        var w, z, y, v, u, E = 1732584193,
        D = -271733879,
        C = -1732584194,
        B = 271733878;
        for (w = 0; w < F.length; w += 16) {
            z = E;
            y = D;
            v = C;
            u = B;
            E = b(E, D, C, B, F[w], 7, -680876936);
            B = b(B, E, D, C, F[w + 1], 12, -389564586);
            C = b(C, B, E, D, F[w + 2], 17, 606105819);
            D = b(D, C, B, E, F[w + 3], 22, -1044525330);
            E = b(E, D, C, B, F[w + 4], 7, -176418897);
            B = b(B, E, D, C, F[w + 5], 12, 1200080426);
            C = b(C, B, E, D, F[w + 6], 17, -1473231341);
            D = b(D, C, B, E, F[w + 7], 22, -45705983);
            E = b(E, D, C, B, F[w + 8], 7, 1770035416);
            B = b(B, E, D, C, F[w + 9], 12, -1958414417);
            C = b(C, B, E, D, F[w + 10], 17, -42063);
            D = b(D, C, B, E, F[w + 11], 22, -1990404162);
            E = b(E, D, C, B, F[w + 12], 7, 1804603682);
            B = b(B, E, D, C, F[w + 13], 12, -40341101);
            C = b(C, B, E, D, F[w + 14], 17, -1502002290);
            D = b(D, C, B, E, F[w + 15], 22, 1236535329);
            E = i(E, D, C, B, F[w + 1], 5, -165796510);
            B = i(B, E, D, C, F[w + 6], 9, -1069501632);
            C = i(C, B, E, D, F[w + 11], 14, 643717713);
            D = i(D, C, B, E, F[w], 20, -373897302);
            E = i(E, D, C, B, F[w + 5], 5, -701558691);
            B = i(B, E, D, C, F[w + 10], 9, 38016083);
            C = i(C, B, E, D, F[w + 15], 14, -660478335);
            D = i(D, C, B, E, F[w + 4], 20, -405537848);
            E = i(E, D, C, B, F[w + 9], 5, 568446438);
            B = i(B, E, D, C, F[w + 14], 9, -1019803690);
            C = i(C, B, E, D, F[w + 3], 14, -187363961);
            D = i(D, C, B, E, F[w + 8], 20, 1163531501);
            E = i(E, D, C, B, F[w + 13], 5, -1444681467);
            B = i(B, E, D, C, F[w + 2], 9, -51403784);
            C = i(C, B, E, D, F[w + 7], 14, 1735328473);
            D = i(D, C, B, E, F[w + 12], 20, -1926607734);
            E = n(E, D, C, B, F[w + 5], 4, -378558);
            B = n(B, E, D, C, F[w + 8], 11, -2022574463);
            C = n(C, B, E, D, F[w + 11], 16, 1839030562);
            D = n(D, C, B, E, F[w + 14], 23, -35309556);
            E = n(E, D, C, B, F[w + 1], 4, -1530992060);
            B = n(B, E, D, C, F[w + 4], 11, 1272893353);
            C = n(C, B, E, D, F[w + 7], 16, -155497632);
            D = n(D, C, B, E, F[w + 10], 23, -1094730640);
            E = n(E, D, C, B, F[w + 13], 4, 681279174);
            B = n(B, E, D, C, F[w], 11, -358537222);
            C = n(C, B, E, D, F[w + 3], 16, -722521979);
            D = n(D, C, B, E, F[w + 6], 23, 76029189);
            E = n(E, D, C, B, F[w + 9], 4, -640364487);
            B = n(B, E, D, C, F[w + 12], 11, -421815835);
            C = n(C, B, E, D, F[w + 15], 16, 530742520);
            D = n(D, C, B, E, F[w + 2], 23, -995338651);
            E = a(E, D, C, B, F[w], 6, -198630844);
            B = a(B, E, D, C, F[w + 7], 10, 1126891415);
            C = a(C, B, E, D, F[w + 14], 15, -1416354905);
            D = a(D, C, B, E, F[w + 5], 21, -57434055);
            E = a(E, D, C, B, F[w + 12], 6, 1700485571);
            B = a(B, E, D, C, F[w + 3], 10, -1894986606);
            C = a(C, B, E, D, F[w + 10], 15, -1051523);
            D = a(D, C, B, E, F[w + 1], 21, -2054922799);
            E = a(E, D, C, B, F[w + 8], 6, 1873313359);
            B = a(B, E, D, C, F[w + 15], 10, -30611744);
            C = a(C, B, E, D, F[w + 6], 15, -1560198380);
            D = a(D, C, B, E, F[w + 13], 21, 1309151649);
            E = a(E, D, C, B, F[w + 4], 6, -145523070);
            B = a(B, E, D, C, F[w + 11], 10, -1120210379);
            C = a(C, B, E, D, F[w + 2], 15, 718787259);
            D = a(D, C, B, E, F[w + 9], 21, -343485551);
            E = o(E, z);
            D = o(D, y);
            C = o(C, v);
            B = o(B, u)
        }
        return [E, D, C, B]
    }
    function p(v) {
        var w, u = "";
        for (w = 0; w < v.length * 32; w += 8) {
            u += String.fromCharCode((v[w >> 5] >>> (w % 32)) & 255)
        }
        return u
    }
    function j(v) {
        var w, u = [];
        u[(v.length >> 2) - 1] = undefined;
        for (w = 0; w < u.length; w += 1) {
            u[w] = 0
        }
        for (w = 0; w < v.length * 8; w += 8) {
            u[w >> 5] |= (v.charCodeAt(w / 8) & 255) << (w % 32)
        }
        return u
    }
    function k(u) {
        return p(d(j(u), u.length * 8))
    }
    function f(w, z) {
        var v, y = j(w),
        u = [],
        x = [],
        A;
        u[15] = x[15] = undefined;
        if (y.length > 16) {
            y = d(y, w.length * 8)
        }
        for (v = 0; v < 16; v += 1) {
            u[v] = y[v] ^ 909522486;
            x[v] = y[v] ^ 1549556828
        }
        A = d(u.concat(j(z)), 512 + z.length * 8);
        return p(d(x.concat(A), 512 + 128))
    }
    function t(w) {
        var z = "0123456789abcdef",
        v = "",
        u, y;
        for (y = 0; y < w.length; y += 1) {
            u = w.charCodeAt(y);
            v += z.charAt((u >>> 4) & 15) + z.charAt(u & 15)
        }
        return v
    }
    function m(u) {
        return unescape(encodeURIComponent(u))
    }
    function q(u) {
        return k(m(u))
    }
    function l(u) {
        return t(q(u))
    }
    function h(u, v) {
        return f(m(u), m(v))
    }
    function r(u, v) {
        return t(h(u, v))
    }
    g.md5 = function (v, w, u) {
        if (!w) {
            if (!u) {
                return l(v)
            } else {
                return q(v)
            }
        }
        if (!u) {
            return r(w, v)
        } else {
            return h(w, v)
        }
    }
}(typeof jQuery === "function" ? jQuery : this)); (function (a) {
    a.openURL = function (c, d, b) {
        if (d) {
            window.open(c, d, b)
        } else {
            window.open(c)
        }
    }
})(jQuery); (function (a) {
    a.jumpURL = function (b) {
        window.location.href = b
    }
})(jQuery); (function (a) {
    a.hash = function (h, j) {
        function c(k) {
            return typeof k == "string" || Object.prototype.toString.call(k) === "[object String]"
        }
        if (!c(h) || h == "") {
            return
        }
        var g = new RegExp("(&" + h + "=[^&]*)|(\\b" + h + "=[^&]*&)|(\\b" + h + "=[^&]*)", "ig");
        var i = new RegExp("&*\\b" + h + "=[^&]*", "i");
        if (typeof j == "undefined") {
            var b = window.location.hash.match(i);
            var f = b ? b[0].indexOf("=") : -1;
            if (f != -1) {
                b = a.trim(b[0].substring(f + 1, b[0].length))
            } else {
                return null
            }
            return COMMON.isMozilla() ? b : decodeURIComponent(b)
        } else {
            if (j === null) {
                window.location.hash = window.location.hash.replace(g, "")
            } else {
                j = j + "";
                var d = window.location.hash.replace(g, "");
                d += ((d.indexOf("=") != -1) ? "&" : "") + h + "=" + encodeURIComponent(j);
                window.location.hash = d
            }
        }
    }
})(jQuery); (function (a) {
    a.fn.numeric = function (d, f) {
        if (typeof d === "boolean") {
            d = {
                decimal: d
            }
        }
        d = d || {};
        if (typeof d.negative == "undefined") {
            d.negative = true
        }
        var b = (d.decimal === false) ? "" : d.decimal || ".";
        var c = (d.negative === true) ? true : false;
        f = (typeof (f) == "function" ? f : function () { });
        return this.data("numeric.decimal", b).data("numeric.negative", c).data("numeric.callback", f).keypress(a.fn.numeric.keypress).keyup(a.fn.numeric.keyup).blur(a.fn.numeric.blur)
    };
    a.fn.numeric.keypress = function (h) {
        var b = a.data(this, "numeric.decimal");
        var c = a.data(this, "numeric.negative");
        var d = h.charCode ? h.charCode : h.keyCode ? h.keyCode : 0;
        if (d == 13 && this.nodeName.toLowerCase() == "input") {
            return true
        } else {
            if (d == 13) {
                return false
            }
        }
        var f = false;
        if ((h.ctrlKey && d == 97) || (h.ctrlKey && d == 65)) {
            return true
        }
        if ((h.ctrlKey && d == 120) || (h.ctrlKey && d == 88)) {
            return true
        }
        if ((h.ctrlKey && d == 99) || (h.ctrlKey && d == 67)) {
            return true
        }
        if ((h.ctrlKey && d == 122) || (h.ctrlKey && d == 90)) {
            return true
        }
        if ((h.ctrlKey && d == 118) || (h.ctrlKey && d == 86) || (h.shiftKey && d == 45)) {
            return true
        }
        if (d < 48 || d > 57) {
            var g = a(this).val();
            if (g.indexOf("-") !== 0 && c && d == 45 && (g.length === 0 || parseInt(a.fn.getSelectionStart(this), 10) === 0)) {
                return true
            }
            if (b && d == b.charCodeAt(0) && g.indexOf(b) != -1) {
                f = false
            }
            if (d != 8 && d != 9 && d != 13 && d != 35 && d != 36 && d != 37 && d != 39 && d != 46) {
                f = false
            } else {
                if (typeof h.charCode != "undefined") {
                    if (h.keyCode == h.which && h.which !== 0) {
                        f = true;
                        if (h.which == 46) {
                            f = false
                        }
                    } else {
                        if (h.keyCode !== 0 && h.charCode === 0 && h.which === 0) {
                            f = true
                        }
                    }
                }
            }
            if (b && d == b.charCodeAt(0)) {
                if (g.indexOf(b) == -1) {
                    f = true
                } else {
                    f = false
                }
            }
        } else {
            f = true
        }
        return f
    };
    a.fn.numeric.keyup = function (r) {
        var l = a(this).val();
        if (l && l.length > 0) {
            var f = a.fn.getSelectionStart(this);
            var u = a.fn.getSelectionEnd(this);
            var q = a.data(this, "numeric.decimal");
            var n = a.data(this, "numeric.negative");
            if (q !== "" && q !== null) {
                var d = l.indexOf(q);
                if (d === 0) {
                    this.value = "0" + l
                }
                if (d == 1 && l.charAt(0) == "-") {
                    this.value = "-0" + l.substring(1)
                }
                l = this.value
            }
            var c = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "-", q];
            var h = l.length;
            for (var p = h - 1; p >= 0; p--) {
                var b = l.charAt(p);
                if (p !== 0 && b == "-") {
                    l = l.substring(0, p) + l.substring(p + 1)
                } else {
                    if (p === 0 && !n && b == "-") {
                        l = l.substring(1)
                    }
                }
                var g = false;
                for (var o = 0; o < c.length; o++) {
                    if (b == c[o]) {
                        g = true;
                        break
                    }
                }
                if (!g || b == " ") {
                    l = l.substring(0, p) + l.substring(p + 1)
                }
            }
            var s = l.indexOf(q);
            if (s > 0) {
                for (var m = h - 1; m > s; m--) {
                    var t = l.charAt(m);
                    if (t == q) {
                        l = l.substring(0, m) + l.substring(m + 1)
                    }
                }
            }
            this.value = l;
            a.fn.setSelection(this, [f, u])
        }
    };
    a.fn.numeric.blur = function () {
        var b = a.data(this, "numeric.decimal");
        var f = a.data(this, "numeric.callback");
        var d = this.value;
        if (d !== "") {
            var c = new RegExp("^\\d+$|^\\d*" + b + "\\d+$");
            if (!c.exec(d)) {
                f.apply(this)
            }
        }
    };
    a.fn.removeNumeric = function () {
        return this.data("numeric.decimal", null).data("numeric.negative", null).data("numeric.callback", null).unbind("keypress", a.fn.numeric.keypress).unbind("blur", a.fn.numeric.blur)
    };
    a.fn.getSelectionStart = function (c) {
        if (c.createTextRange) {
            var b = document.selection.createRange().duplicate();
            b.moveEnd("character", c.value.length);
            if (b.text === "") {
                return c.value.length
            }
            return c.value.lastIndexOf(b.text)
        } else {
            return c.selectionStart
        }
    };
    a.fn.getSelectionEnd = function (c) {
        if (c.createTextRange) {
            var b = document.selection.createRange().duplicate();
            b.moveStart("character", -c.value.length);
            return b.text.length
        } else {
            return c.selectionEnd
        }
    };
    a.fn.setSelection = function (d, c) {
        if (typeof c == "number") {
            c = [c, c]
        }
        if (c && c.constructor == Array && c.length == 2) {
            if (d.createTextRange) {
                var b = d.createTextRange();
                b.collapse(true);
                b.moveStart("character", c[0]);
                b.moveEnd("character", c[1]);
                b.select()
            } else {
                if (d.setSelectionRange) {
                    d.focus();
                    d.setSelectionRange(c[0], c[1])
                }
            }
        }
    }
})(jQuery); (function (d, c, f) {
    var a, b;
    d.uaMatch = function (i) {
        i = i.toLowerCase();
        var h = /(opr)[\/]([\w.]+)/.exec(i) || /(chrome)[ \/]([\w.]+)/.exec(i) || /(webkit)[ \/]([\w.]+)/.exec(i) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(i) || /(msie) ([\w.]+)/.exec(i) || i.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(i) || i.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(i) || [];
        var g = /(ipad)/.exec(i) || /(iphone)/.exec(i) || /(android)/.exec(i) || [];
        return {
            browser: h[1] || "",
            version: h[2] || "0",
            platform: g[0] || ""
        }
    };
    a = d.uaMatch(c.navigator.userAgent);
    b = {};
    if (a.browser) {
        b[a.browser] = true;
        b.version = a.version
    }
    if (a.platform) {
        b[a.platform] = true
    }
    if (b.chrome || b.opr) {
        b.webkit = true
    } else {
        if (b.webkit) {
            b.safari = true
        }
    }
    if (b.rv) {
        b.msie = true
    }
    if (b.opr) {
        b.opera = true
    }
    d.browser = b
})(jQuery, window); (function (a) {
    a.fn.removeCss = function (c) {
        var b = [];
        var d = a.type(c);
        if (d === "array") {
            b = c
        } else {
            if (d === "object") {
                for (var f in c) {
                    b.push(f)
                }
            } else {
                if (d === "string") {
                    b = c.replace(/,$/, "").split(",")
                }
            }
        }
        return this.each(function () {
            var g = a(this);
            a.map(b,
            function (h) {
                g.css(h, "")
            })
        })
    }
})(jQuery); (function (a) {
    a.extend(a.fn, {
        livequery: function (f, d, c) {
            var b = this,
            g;
            if (a.isFunction(f)) {
                c = d,
                d = f,
                f = undefined
            }
            a.each(a.livequery.queries,
            function (h, j) {
                if (b.selector == j.selector && b.context == j.context && f == j.type && (!d || d.$lqguid == j.fn.$lqguid) && (!c || c.$lqguid == j.fn2.$lqguid)) {
                    return (g = j) && false
                }
            });
            g = g || new a.livequery(this.selector, this.context, f, d, c);
            g.stopped = false;
            g.run();
            return this
        },
        expire: function (f, d, c) {
            var b = this;
            if (a.isFunction(f)) {
                c = d,
                d = f,
                f = undefined
            }
            a.each(a.livequery.queries,
            function (g, h) {
                if (b.selector == h.selector && b.context == h.context && (!f || f == h.type) && (!d || d.$lqguid == h.fn.$lqguid) && (!c || c.$lqguid == h.fn2.$lqguid) && !this.stopped) {
                    a.livequery.stop(h.id)
                }
            });
            return this
        }
    });
    a.livequery = function (b, d, g, f, c) {
        this.selector = b;
        this.context = d;
        this.type = g;
        this.fn = f;
        this.fn2 = c;
        this.elements = [];
        this.stopped = false;
        this.id = a.livequery.queries.push(this) - 1;
        f.$lqguid = f.$lqguid || a.livequery.guid++;
        if (c) {
            c.$lqguid = c.$lqguid || a.livequery.guid++
        }
        return this
    };
    a.livequery.prototype = {
        stop: function () {
            var b = this;
            if (this.type) {
                this.elements.unbind(this.type, this.fn)
            } else {
                if (this.fn2) {
                    this.elements.each(function (c, d) {
                        b.fn2.apply(d)
                    })
                }
            }
            this.elements = [];
            this.stopped = true
        },
        run: function () {
            if (this.stopped) {
                return
            }
            var d = this;
            var f = this.elements,
            c = a(this.selector, this.context),
            b = c.not(f);
            this.elements = c;
            if (this.type) {
                b.bind(this.type, this.fn);
                if (f.length > 0) {
                    a.each(f,
                    function (g, h) {
                        if (a.inArray(h, c) < 0) {
                            a.event.remove(h, d.type, d.fn)
                        }
                    })
                }
            } else {
                b.each(function () {
                    d.fn.apply(this)
                });
                if (this.fn2 && f.length > 0) {
                    a.each(f,
                    function (g, h) {
                        if (a.inArray(h, c) < 0) {
                            d.fn2.apply(h)
                        }
                    })
                }
            }
        }
    };
    a.extend(a.livequery, {
        guid: 0,
        queries: [],
        queue: [],
        running: false,
        timeout: null,
        checkQueue: function () {
            if (a.livequery.running && a.livequery.queue.length) {
                var b = a.livequery.queue.length;
                while (b--) {
                    a.livequery.queries[a.livequery.queue.shift()].run()
                }
            }
        },
        pause: function () {
            a.livequery.running = false
        },
        play: function () {
            a.livequery.running = true;
            a.livequery.run()
        },
        registerPlugin: function () {
            a.each(arguments,
            function (c, d) {
                if (!a.fn[d]) {
                    return
                }
                var b = a.fn[d];
                a.fn[d] = function () {
                    var f = b.apply(this, arguments);
                    a.livequery.run();
                    return f
                }
            })
        },
        run: function (b) {
            if (b != undefined) {
                if (a.inArray(b, a.livequery.queue) < 0) {
                    a.livequery.queue.push(b)
                }
            } else {
                a.each(a.livequery.queries,
                function (c) {
                    if (a.inArray(c, a.livequery.queue) < 0) {
                        a.livequery.queue.push(c)
                    }
                })
            }
            if (a.livequery.timeout) {
                clearTimeout(a.livequery.timeout)
            }
            a.livequery.timeout = setTimeout(a.livequery.checkQueue, 20)
        },
        stop: function (b) {
            if (b != undefined) {
                a.livequery.queries[b].stop()
            } else {
                a.each(a.livequery.queries,
                function (c) {
                    a.livequery.queries[c].stop()
                })
            }
        }
    });
    a.livequery.registerPlugin("append", "prepend", "after", "before", "wrap", "attr", "removeAttr", "addClass", "removeClass", "toggleClass", "empty", "remove", "html");
    a(function () {
        a.livequery.play()
    })
})(jQuery);
COMMON.compareObjNew = function (h, g, a, d, f) {
    var c = h[d];
    var b = g[d];
    if (typeof c === "undefined" || typeof b === "undefined") {
        return
    }
    if (f === "number") {
        return COMMON.ber(c, b, a)
    }
    if (COMMON.isIE6() || COMMON.isIE7() || COMMON.isIE8()) {
        return COMMON.compareObjLocale(h, g, a, d)
    }
    return COMMON.compareStrings(c, b, a)
};
COMMON.compareObjLocale = function (g, f, a, d) {
    var c = g[d];
    var b = f[d];
    if (typeof c === "number" || typeof c === "boolean") {
        c = c.toString()
    }
    if (typeof b === "number" || typeof b === "boolean") {
        b = b.toString()
    }
    if (a == "asc") {
        return c.localeCompare(b)
    } else {
        return b.localeCompare(c)
    }
};
COMMON.ber = function (c, b, a) {
    if (c === b) {
        return 0
    }
    if (a == "asc") {
        return c > b ? 1 : -1
    } else {
        return c > b ? -1 : 1
    }
};
COMMON.compareStrings = function (i, h, c) {
    if (typeof i === "number" || typeof i === "boolean") {
        i = i.toString()
    }
    if (typeof h === "number" || typeof h === "boolean") {
        h = h.toString()
    }
    var j = {
        str1: i,
        str2: h,
        len1: i.length,
        len2: h.length,
        pos1: 0,
        pos2: 0
    };
    var k = 0;
    while (k == 0 && j.pos1 < j.len1 && j.pos2 < j.len2) {
        var b = j.str1.charAt(j.pos1);
        var a = j.str2.charAt(j.pos2);
        if (COMMON.isDigit(b)) {
            k = COMMON.isDigit(a) ? g(j) : -1
        } else {
            if (COMMON.isChinese(b)) {
                k = COMMON.isChinese(a) ? d(j) : 1
            } else {
                if (COMMON.isLetter(b)) {
                    k = (COMMON.isLetter(a) || COMMON.isChinese(a)) ? f(j, true) : 1
                } else {
                    k = COMMON.isDigit(a) ? 1 : (COMMON.isLetter(a) || COMMON.isChinese(a)) ? -1 : f(j, false)
                }
            }
        }
        j.pos1++;
        j.pos2++
    }
    if (c == "asc") {
        return k == 0 ? j.len1 - j.len2 : k
    } else {
        return -(k == 0 ? j.len1 - j.len2 : k)
    }
    function g(n) {
        var m = n.pos1 + 1;
        while (m < n.len1 && COMMON.isDigit(n.str1.charAt(m))) {
            m++
        }
        var p = m - n.pos1;
        while (n.pos1 < m && n.str1.charAt(n.pos1) == "0") {
            n.pos1++
        }
        var l = n.pos2 + 1;
        while (l < n.len2 && COMMON.isDigit(n.str2.charAt(l))) {
            l++
        }
        var o = l - n.pos2;
        while (n.pos2 < l && n.str2.charAt(n.pos2) == "0") {
            n.pos2++
        }
        var q = (m - n.pos1) - (l - n.pos2);
        if (q != 0) {
            return q
        }
        while (n.pos1 < m && n.pos2 < l) {
            q = n.str1.charCodeAt(n.pos1++) - n.str2.charCodeAt(n.pos2++);
            if (q != 0) {
                return q
            }
        }
        n.pos1--;
        n.pos2--;
        return o - p
    }
    function f(n, l) {
        var o = n.str1.charAt(n.pos1);
        var m = n.str2.charAt(n.pos2);
        if (o == m) {
            return 0
        }
        if (l) {
            o = o.toUpperCase();
            m = m.toUpperCase();
            if (o != m) {
                o = o.toLowerCase();
                m = m.toLowerCase()
            }
        }
        return o.charCodeAt(0) - m.charCodeAt(0)
    }
    function d(m) {
        var n = m.str1.charAt(m.pos1);
        var l = m.str2.charAt(m.pos2);
        if (n == l) {
            return 0
        }
        var p, o;
        if (typeof Pinyin != "undefined") {
            p = Pinyin.getStringStriped(n, Pinyin.mode.LOWERCASE, true);
            o = Pinyin.getStringStriped(l, Pinyin.mode.LOWERCASE, true);
            return -COMMON.compareStrings(p, o)
        } else {
            p = n.charCodeAt(0);
            o = l.charCodeAt(0);
            if (p == o) {
                return 0
            } else {
                return p - o
            }
        }
    }
};
COMMON.compareRandom = function (b, a) {
    return Math.random() > 0.5 ? (-1) : 1
};
COMMON.punycode = function () {
    var o = 2147483647,
    s = Math.floor,
    i = 36,
    k = 1,
    m = 26,
    l = 72,
    r = String.fromCharCode,
    j = 700,
    v = "-",
    d = i - k,
    f = 38,
    c = 128,
    n = {
        overflow: "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
    };
    function a(z, x, y) {
        var w = 0;
        z = y ? s(z / j) : z >> 1;
        z += s(z / x);
        for (; z > d * m >> 1; w += i) {
            z = s(z / d)
        }
        return s(w + (d + 1) * z / (z + f))
    }
    function h(z) {
        var y = [],
        x = 0,
        A = z.length,
        B,
        w;
        while (x < A) {
            B = z.charCodeAt(x++);
            if (B >= 55296 && B <= 56319 && x < A) {
                w = z.charCodeAt(x++);
                if ((w & 64512) == 56320) {
                    y.push(((B & 1023) << 10) + (w & 1023) + 65536)
                } else {
                    y.push(B);
                    x--
                }
            } else {
                y.push(B)
            }
        }
        return y
    }
    function q(x, w) {
        return x + 22 + 75 * (x < 26) - ((w != 0) << 5)
    }
    function b(w) {
        if (w - 48 < 10) {
            return w - 22
        }
        if (w - 65 < 26) {
            return w - 65
        }
        if (w - 97 < 26) {
            return w - 97
        }
        return i
    }
    function u(w) {
        return t(w,
        function (y) {
            var x = "";
            if (y > 65535) {
                y -= 65536;
                x += r(y >>> 10 & 1023 | 55296);
                y = 56320 | y & 1023
            }
            x += r(y);
            return x
        }).join("")
    }
    function t(y, w) {
        var x = y.length;
        while (x--) {
            y[x] = w(y[x])
        }
        return y
    }
    function g(I) {
        var z, K, F, x, G, E, A, w, D, M, J, y = [],
        C,
        B,
        L,
        H;
        I = h(I);
        C = I.length;
        z = c;
        K = 0;
        G = l;
        for (E = 0; E < C; ++E) {
            J = I[E];
            if (J < 128) {
                y.push(r(J))
            }
        }
        F = x = y.length;
        if (x) {
            y.push(v)
        }
        while (F < C) {
            for (A = o, E = 0; E < C; ++E) {
                J = I[E];
                if (J >= z && J < A) {
                    A = J
                }
            }
            B = F + 1;
            if (A - z > s((o - K) / B)) {
                throw RangeError(n.overflow)
            }
            K += (A - z) * B;
            z = A;
            for (E = 0; E < C; ++E) {
                J = I[E];
                if (J < z && ++K > o) {
                    throw RangeError(n.overflow)
                }
                if (J == z) {
                    for (w = K, D = i; ; D += i) {
                        M = D <= G ? k : (D >= G + m ? m : D - G);
                        if (w < M) {
                            break
                        }
                        H = w - M;
                        L = i - M;
                        y.push(r(q(M + H % L, 0)));
                        w = s(H / L)
                    }
                    y.push(r(q(w, 0)));
                    G = a(K, B, F == x);
                    K = 0; ++F
                }
            } ++K; ++z
        }
        return y.join("")
    }
    function p(J) {
        var z = [],
        C = J.length,
        E,
        F = 0,
        y = c,
        G = l,
        B,
        D,
        H,
        x,
        K,
        A,
        I,
        M,
        L;
        B = J.lastIndexOf(v);
        if (B < 0) {
            B = 0
        }
        for (D = 0; D < B; ++D) {
            if (J.charCodeAt(D) >= 128) {
                throw RangeError(n["not-basic"])
            }
            z.push(J.charCodeAt(D))
        }
        for (H = B > 0 ? B + 1 : 0; H < C;) {
            for (x = F, K = 1, A = i; ; A += i) {
                if (H >= C) {
                    throw RangeError(n["invalid-input"])
                }
                I = b(J.charCodeAt(H++));
                if (I >= i || I > s((o - F) / K)) {
                    throw RangeError(n.overflow)
                }
                F += I * K;
                M = A <= G ? k : (A >= G + m ? m : A - G);
                if (I < M) {
                    break
                }
                L = i - M;
                if (K > s(o / L)) {
                    throw RangeError(n.overflow)
                }
                K *= L
            }
            E = z.length + 1;
            G = a(F - x, E, x == 0);
            if (s(F / E) > o - y) {
                throw RangeError(n.overflow)
            }
            y += s(F / E);
            F %= E;
            z.splice(F++, 0, y)
        }
        return u(z)
    }
    return {
        encode: g,
        decode: p
    }
}();