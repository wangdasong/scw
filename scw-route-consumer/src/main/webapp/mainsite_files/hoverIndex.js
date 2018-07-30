$(function(){
	$(".footer2_1 ul li").not(".nobackground").mouseover(function(){
		$(this).addClass("asect").siblings().removeClass();	
		$(this).find(".select_content").show().parent().siblings().find(".select_content").hide();
	})
	$(".footer2_1 ul li").not(".nobackground").mouseout(function(){
		$(this).removeClass("asect")
		$(this).find(".select_content").hide();
	})
	
	$(".column3ri1_1 li").each(function(){
        $(".column3ri1_1 li").hover(function(){
            $(this).find("a").stop().animate({
                "background-position-y":0
            })
        },function(){
            $(this).find("a").stop().animate({
                "background-position-y":"5px"
            })
        })
    })
	$(".spyp_main .spyp_con").eq(1).fadeOut(0).css('z-index',1).siblings().css('z-index',11);
	$(".lmtit1 a").hover(function(){
		$(".spyp_main .spyp_con").eq($(this).index()).fadeIn(0).css('z-index',11).siblings().fadeOut(0).css('z-index',1);
	})
	
	function setab(){
		$('.setab').find('.lmtit a').hover(function(){
			$(this).parents('.setab').find('.con_stree').eq($(this).index()).show().siblings().hide();	
	})
	}
	setab();
	
	$('.column3ri4 .column3ri4_1 ul li').hover(function(){
			$(this).addClass('hover').siblings().removeClass('hover');
			$(this).parents('.column3ri4').find('.column3ri4_2_con').eq($(this).index()).show().siblings().hide();	
	})
	
})
