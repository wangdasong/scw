$(document).ready(function(){
  // 导航菜单
  $('li.mainlevel').mousemove(function(){
  $(this).find('ul').show();//you can give it a speed
  });
  $('li.mainlevel').mouseleave(function(){
  $(this).find('ul').hide();
  });
  
});

/*$(document).ready(function(){
  
  
  // 导航菜单
  
  $('li.mainlevel').mouseover(function(){
	thisUl = $(this).find('ul');
  	thisUl.stop().show();//you can give it a speed
	var ulTop = thisUl.height()+35;
	//alert(thisUl.css('padding-top'));
	$('.content').stop().animate({marginTop:ulTop},200);
  });
  $('li.mainlevel').mouseleave(function(){
  	$(this).find('ul').stop().hide();
	$('.content').stop().animate({marginTop:0},200);
	//alert(0);
  });
  
});*/

