<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html lang="en">
<!-- <html lang="en" ng-app="components.login"> -->
	<head>
        <meta charset="utf-8" />
        <title>登录 - Finance</title>
        <meta http-equiv="Access-Control-Allow-Origin" content="*">
        <meta name="keywords" content="Finance,finance,结算系统,NSW,本系统财务结算系统" />
        <meta name="description" content="本系统财务结算系统" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="bookmark"  type="image/x-icon"  href="${resourcesPath}assets/avatars/ico.png"/>
        <link rel="shortcut icon" href="${resourcesPath}assets/avatars/ico.png">
        <link rel="icon" href="${resourcesPath}assets/avatars/ico.png">


        <!-- basic styles -->

        <link href="${resourcesPath}assets/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="${resourcesPath}assets/css/font-awesome.min.css" />

        <!--[if IE 7]>
		<link rel="stylesheet" href="${resourcesPath}assets/css/font-awesome-ie7.min.css" />
        <![endif]-->

        <!-- page specific plugin styles -->
        <link rel="stylesheet" href="${resourcesPath}assets/css/jquery-ui-1.10.3.full.min.css" />
        <link rel="stylesheet" href="${resourcesPath}assets/css/jquery-ui-1.10.3.custom.min.css" />
        <link rel="stylesheet" href="${resourcesPath}assets/css/datepicker.css" />
        <link rel="stylesheet" href="${resourcesPath}assets/css/daterangepicker.css" />



        <!-- ace styles -->

        <link rel="stylesheet" href="${resourcesPath}assets/css/ace-login.css" />
        <link rel="stylesheet" href="${resourcesPath}assets/css/ace.min.css" />
        <link rel="stylesheet" href="${resourcesPath}assets/css/ace-rtl.min.css" />
        <link rel="stylesheet" href="${resourcesPath}assets/css/ace-skins.min.css" />

        <!--[if lte IE 8]>
		<link rel="stylesheet" href="${resourcesPath}assets/css/ace-ie.min.css" />
        <![endif]-->


        <!-- ace settings handler -->

        <script src="${resourcesPath}assets/js/ace-extra.min.js"></script>


        <!-- inline styles related to this page -->

        <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->

        <!--[if lt IE 9]>
		<script src="${resourcesPath}assets/js/html5shiv.js"></script>
		<script src="${resourcesPath}assets/js/respond.min.js"></script>
        <![endif]-->





	</head>

	<body class="login-layout light-login" >
	<!-- <body class="login-layout light-login" ng-controller="LoginController"> -->
		<div class="main-container">
			<div class="main-content">
				<div class="row">
					<div class="col-sm-10 col-sm-offset-1">
						<div class="login-container">
							<div class="center">
								<h1>
									<i class="icon-leaf green"></i>
									<span class="red">SCW</span>
									<span class="blue"  id="id-text2" >统一接入窗口</span>
								</h1>
								<h4 class="blue" id="id-company-text" >&copy; SCW</h4>
							</div>



							<div class="space-6"></div>



							<div class="position-relative">
								<div id="login-box" class="login-box visible widget-box no-border">
									<div class="widget-body">
										<div class="widget-main">
											<h4 class="header blue lighter bigger">
												<i class="icon-coffee green"></i>
												请输入您的登录信息
											</h4>

											<div class="space-6"></div>

											<div ng-class="error ? 'alert alert-danger': 'hidden'" ng-bind="error" style="white-space:pre;max-width:none;"></div>

                                    		<!-- <form novalidate > -->

											<!-- <form> -->
											<form action="login" id="form" method="post">
												<fieldset>
													<label class="block clearfix">
														<span class="block input-icon input-icon-right" id="userspan"></span>
														<span class="block input-icon input-icon-right" id="userspan">
															<input type="text" id="input_username" name="username" class="form-control" placeholder="用户名" />
															<i class="icon-user"></i>
														</span>


													</label>

													<label class="block clearfix">
														<span class="block input-icon input-icon-right" id="pswspan"></span>
														<span class="block input-icon input-icon-right">
															<input type="password" id="input_password" name="password" class="form-control" placeholder="密码" />
															<i class="icon-lock"></i>
														</span>


													</label>


													<div class="space"></div>

													<div class="clearfix">
														<label class="inline">
															<input type="checkbox" id="input_login_remember" class="ace" onclick="rememberMeCookie()" />
															<span class="lbl"> 记住密码</span>
														</label>

														<input type="hidden" id="csrf_token" name="${_csrf.parameterName}" value="${_csrf.token}"/>
														<input type="submit"  class="width-35 pull-right btn btn-sm btn-primary" value="登录">
														<!--<button type="button" id="button_login" class="width-35 pull-right btn btn-sm btn-primary" onclick="">
															<i class="icon-key"></i>
															登录
														</button>-->



													</div>

													<div class="space-4"></div>
												</fieldset>
											</form>

										</div><!-- /widget-main -->

										<div class="toolbar clearfix">
											<div style="width:33%">
												<a href="#" onclick="show_box('forgot-box'); return false;" class="forgot-password-link">
													<i class="icon-arrow-left"></i>
													忘记密码
												</a>
											</div>
											<div style="width:33%">
												<a href="#" onclick="show_box('server-config-box'); return false;" class="user-signup-link">
													<i class="icon-arrow-down"></i>
													选择云服务
												</a>
											</div>
											<div style="width:33%">
												<a href="#" onclick="show_box('signup-box'); return false;" class="user-signup-link">
													修改密码
													<i class="icon-arrow-right"></i>
												</a>
											</div>
										</div>
									</div><!-- /widget-body -->
								</div><!-- /login-box -->

								<div id="forgot-box" class="forgot-box widget-box no-border">
									<div class="widget-body">
										<div class="widget-main">
											<h4 class="header red lighter bigger">
												<i class="icon-key"></i>
												找回密码
											</h4>

											<div class="space-6"></div>
											<p>
												请输入您的电子邮箱地址：
												<!-- Enter your email and to receive instructions -->
											</p>

											<form>
												<fieldset>
													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="email" id="input_emailGetBack" name="input_emailGetBack" class="form-control" placeholder="Email" />
															<i class="icon-envelope"></i>
														</span>
													</label>

													<div class="clearfix">
														<button type="button" id="button_send" class="width-35 pull-right btn btn-sm btn-danger" onclick="getBackPWD()">
															<i class="icon-lightbulb"></i>
															发送
														</button>
													</div>
												</fieldset>
											</form>
										</div><!-- /widget-main -->

										<div class="toolbar center">
											<a href="#" onclick="show_box('login-box'); return false;" class="back-to-login-link">
												返回登录界面
												<i class="icon-arrow-right"></i>
											</a>
										</div>
									</div><!-- /widget-body -->
								</div><!-- /forgot-box -->


								<div id="signup-box" class="signup-box widget-box no-border">
									<div class="widget-body">
										<div class="widget-main">
											<h4 class="header green lighter bigger">
												<i class="icon-group blue"></i>
												修改密码
											</h4>

											<div class="space-6"></div>
											<p> 请输入以下信息: </p>

											<form>
												<fieldset>


													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="text" class="form-control" id="input_register_username" name="input_register_username" onblur="checkUname()" placeholder="请输入用户名" />
															<i class="icon-user"></i>
														</span>
													</label>

													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="password" class="form-control" id="input_register_password" onblur="preCheckPwd();" placeholder="请输入密码" />
															<i class="icon-lock"></i>
														</span>
													</label>

													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="password" class="form-control" id="input_register_pwdagain" onblur="checkPwd();" placeholder="请再输入一遍密码" />
															<i class="icon-retweet"></i>
														</span>
													</label>



													<div class="clearfix">
														<button type="reset" class="width-30 pull-left btn btn-sm">
															<i class="icon-refresh"></i>
															重置
														</button>

														<button type="button" class="width-65 pull-right btn btn-sm btn-success" id="register_btn"  onclick="editPwd()">
															修改
															<i class="icon-arrow-right icon-on-right"></i>
														</button>

													</div>
												</fieldset>
											</form>
										</div>

										<div class="toolbar center">
											<a href="#" onclick="show_box('login-box'); return false;" class="back-to-login-link">
												<i class="icon-arrow-left"></i>
												返回登录页面
											</a>
										</div>
									</div>

								</div>



								<div id="server-config-box" class="signup-box widget-box no-border">
									<div class="widget-body">
										<div class="widget-main">
											<h4 class="header green lighter bigger">
												<i class="icon-cloud blue"></i>
												云服务连接
											</h4>

											<div class="space-6"></div>
											<p> 请选择以下云服务器: </p>

											<form>
												<fieldset>

													<label class="block clearfix">
															<input id="input_server_type1" name="input_server_type" type="radio" class="ace" value="1" />
															<span class="lbl"> 本地</span>
															<input id="input_server_type2" name="input_server_type" type="radio" class="ace" value="2" />
															<span class="lbl"> 测试</span>
															<input id="input_server_type3" name="input_server_type" type="radio" class="ace" value="3" />
															<span class="lbl"> 正式</span>
													</label>
													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="text" class="form-control" id="input_server_ip" onblur="preCheckIp();" placeholder="请输入本地服务IP地址" />
															<i class="icon-tasks"></i>
														</span>
													</label>

													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="text" class="form-control" id="input_server_port" onblur="preCheckPort();" placeholder="请输入本地服务端口号" />
															<i class="icon-tasks"></i>
														</span>
													</label>
													<div class="clearfix">
														<button type="reset" class="width-30 pull-left btn btn-sm">
															<i class="icon-refresh"></i>
															重置
														</button>

														<button type="button" class="width-65 pull-right btn btn-sm btn-success" id="register_btn"  onclick="editServer()">
															提交
															<i class="icon-arrow-right icon-on-right"></i>
														</button>

													</div>
												</fieldset>
											</form>
										</div>

										<div class="toolbar center">
											<a href="#" onclick="show_box('login-box'); return false;" class="back-to-login-link">
												<i class="icon-arrow-left"></i>
												返回登录页面
											</a>
										</div>
									</div>

								</div>


							</div><!-- /position-relative -->




							<div class="navbar-fixed-top align-right">
								<br />
								&nbsp;
								<a id="btn-login-blur" href="#">Blur</a>
								&nbsp;
								<span class="blue">/</span>
								&nbsp;
								<a id="btn-login-dark" href="#">Dark</a>
								&nbsp;
								<span class="blue">/</span>
								&nbsp;
								<a id="btn-login-light" href="#">Light</a>
								&nbsp; &nbsp; &nbsp;
							</div>





							<div class="navbar-fixed-bottom align-center"  style="z-index:-1">
								<br />
								&nbsp;
								<br />
								<font color="#898989" id="copyright" name="copyright" onmousemove="changeFColorL()" onmouseout="changeFColorH()" >
								Copyright©SCW   AllRights Reserved
								<br />
								电话：010-XXXXXX    地址：XXXXXXXXXXXX   京ICP备XXXXXXXXXXX号
								<br />
								XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
								</font>
								<br />
								<br />

							</div>




						</div>
					</div><!-- /.col -->
				</div><!-- /.row -->
			</div>
		</div><!-- /.main-container -->

		<!-- basic scripts -->



		<!-- inline scripts related to this page -->

		<script type="text/javascript">
			function show_box(id) {
			 jQuery('.widget-box.visible').removeClass('visible');
			 jQuery('#'+id).addClass('visible');
			}




			//you don't need this, just used for changing background
			jQuery(function($) {
			 $('#btn-login-dark').on('click', function(e) {
				$('body').attr('class', 'login-layout');
				$('#id-text2').attr('class', 'white');
				$('#id-company-text').attr('class', 'blue');

				e.preventDefault();
			 });
			 $('#btn-login-light').on('click', function(e) {
				$('body').attr('class', 'login-layout light-login');
				$('#id-text2').attr('class', 'grey');
				$('#id-company-text').attr('class', 'blue');

				e.preventDefault();
			 });
			 $('#btn-login-blur').on('click', function(e) {
				$('body').attr('class', 'login-layout blur-login');
				$('#id-text2').attr('class', 'white');
				$('#id-company-text').attr('class', 'light-blue');

				e.preventDefault();
			 });

			});



			function changeFColorL(){

				//alert("555");

				$('#copyright').attr('color', '#69AA46');

			}


			function changeFColorH(){
				//alert("666");

				$('#copyright').attr('color', '#898989');

			}






		</script>



		<!-- page specific plugin scripts -->

		<script src="${resourcesPath}jquery/js/jquery-ui.js"></script>
		<script src="${resourcesPath}layer/layer.js"></script>














		<script src="${resourcesPath}jquery/js/jquery.cookie.js" type="text/javascript"></script>
		<script type="text/javascript"  src="${resourcesPath}../app/components/login/login.js"></script>
		





</body>
</html>
