/*
* @Author: Administrator
* @Date:   2017-10-10 22:53:36
* @Last Modified by:   dingyousi
* @Last Modified time: 2017-10-11 00:13:51
*/
//此处分号避免前面别人的函数结尾没有分号这样就会报错
        ;(function ($, window, document, undefined) {
                
                //构造函数
                function BigImgScroll (ele, options) {
                        
                        //在这里面,ele指的是用jQuery选中的元素$('.bigImgScroll')
                        this.$ele=ele;
                        
                        //默认属性值
                        this._default={
                            
                            //按钮事件
                            btnEvent:'click',
                            //滚动的容器
                            bigImgScroll_list:'.bigImgScroll_list',
                            //幻灯片小按钮
                            bigImgScroll_btn:'.bigImgScroll_btn',
                            //每一个li的margin
                            bigImgScroll_listItem_margin:0,
                            //滚动间隔时间
                            scrollTime:500,
                            //左边按钮
                            btnPrev:'.btnPrev',
                            //右边按钮
                            btnNext:'.btnNext',
                            //是否自动滚动：
                            isAuto:false,
                            
                            //是否浮动布局
                            isFloat:true
                                
                        };
                        
                        //合并属性保护好默认参数:
                        this.opt=$.extend({}, this._default, options);
                        
                        this.$bigImgScroll_list=$(this.opt.bigImgScroll_list);
                        
                        this.$bigImgScroll_btn=$(this.opt.bigImgScroll_btn);
                        
                        this.$bigImgScroll_btn_item=this.$bigImgScroll_btn.children();
                        
                        /*上一个*/
                        this.$btnPrev=$(this.opt.btnPrev);
                        /*下一个*/
                        this.$btnNext=$(this.opt.btnNext);
                        
                        this.num=0;
                                
                        this.bool=true;
                        
                        this.timer=null;
                        
                        this.init();
                        
                };
                
                BigImgScroll.prototype={
                    
                     init:function () {
                        
                     },
                     
                     bigImgScroll:function () {
                        
                                var _this=this;
                                
                                this.$bigImgScroll_list.html(this.$bigImgScroll_list.html()+this.$bigImgScroll_list.html());
                                
                                /*注意此处一定要等元素添加到页面了才获取*/
                                this.$bigImgScroll_list_item=this.$bigImgScroll_list.children();
                                
                                this.$liWidth=this.$bigImgScroll_list_item.eq(0).outerWidth(true)+this.opt.bigImgScroll_listItem_margin;

                                this.$bigImgScroll_list.width(this.$liWidth*this.$bigImgScroll_list_item.length);
                                
                                this.$length=this.$bigImgScroll_list_item.length;
                                
                                this.$btnPrev.hide();
                                
                                this.$btnNext.hide();
                                /*点击上一个*/
                                this.$btnPrev.on(this.opt.btnEvent, function () {
                                        
                                        clearInterval(_this.timer);
                                        
                                        if (_this.bool) {
                                            
                                                //this.num==0
                                                if (_this.num==0) {
                                                    
                                                    //瞬间将left是宽度的一半（肉眼看不到）
                                                    _this.$bigImgScroll_list.css('left',-_this.$liWidth*_this.$length/2);
                                                    
                                                    _this.num=_this.$length/2;
                                                    
                                                }
                                                
                                                _this.num--;
                                                
                                                //让对应的按钮显示背景色
                                                _this.$bigImgScroll_btn_item.eq(_this.num).addClass('active').siblings().removeClass('active');
                                                    
                                                _this.$bigImgScroll_list.animate({
                                                    
                                                    left:-(_this.num%_this.$length)*_this.$liWidth
                                                    
                                                }, _this.opt.scrollTime, 'linear', function () {
                                                    
                                                
                                                    //等走完就变成true这样下次点击又会起作用了
                                                    _this.bool=true;
                                                    
                                                });
                                                
                                                //这样上一张没有走完你点击多少次n都不会增加了
                                                _this.bool=false;
                                        }
                                        
                                });
                                
                                /*点击下一个*/
                                this.$btnNext.on(this.opt.btnEvent, function () {
                                    
                                        _this.scrollFn();
                                
                                });
                                
                                /*点击下面按钮*/
                                this.$bigImgScroll_btn_item.on('click', function () {
                                    
                                        var $index=_this.$bigImgScroll_btn_item.index($(this));
                                        
                                        //让对应的按钮显示背景色
                                        _this.$bigImgScroll_btn_item.eq($index).addClass('active').siblings().removeClass('active');
                                                
                                        _this.$bigImgScroll_list.animate({
                                            
                                                    left: -($index%$length)*$liWidth
                                                    
                                                }, _this.opt.scrollTime, 'linear', function () {
                                                    
                                                
                                            });
                                });
                                
                                function autoPlay () {
                                    //自动滚动
                                    _this.timer=setInterval(function () {
                                        _this.scrollFn();
                                    }, 5000);
                                };
                                
                                if (_this.opt.isAuto) {
                                	
                                	autoPlay();
                                	
                                }
                                
                                
                              this.$ele.hover(
                                
                                function () {
                                    clearInterval(_this.timer);
                                    _this.$btnPrev.fadeIn();
                                
                                    _this.$btnNext.fadeIn();
                                },
                                
                                function () {
                                    autoPlay();
                                     _this.$btnPrev.fadeOut();
                                
                                    _this.$btnNext.fadeOut();
                                }
                                
                              );
                                
                     },
                     scrollFn: function () {
                        
                                var _this=this;
                                
                                if (_this.bool) {
                                        
                                            _this.num++;
                                        
                                            _this.$bigImgScroll_list.animate({
                                            
                                                    left:-(_this.num%_this.$length)*_this.$liWidth
                                                    
                                                }, _this.opt.scrollTime, 'linear', function () {
                                                    
                                                    // 如果滚到中间的一张
                                                    if (_this.num==0) {
                                                        
                                                        //让left==0（瞬间）瞬间让中间一张变成第一张（这两张其实是一样的图片所以你看不到变化）
                                                        _this.$bigImgScroll_list.css('left',0);
                                                            
                                                    }
                                                    
                                                    //等走完就变成true这样下次点击又会起作用了
                                                    _this.bool=true;
                                                
                                            });
                                            
                                            
                                            if (_this.num==_this.$length/2) {
                                                
                                                    _this.num=0;
                                                            
                                            }
                                            
                                            //让对应的按钮显示背景色
                                            _this.$bigImgScroll_btn_item.eq(_this.num).addClass('active').siblings().removeClass('active');
                                            
                                            //这样上一张没有走完你点击多少次n都不会增加了
                                            _this.bool=false;
                                            
                                    }   
                                    
                     }
                     
                     
                };
                
                $.fn.slideshow=function (options) {
                        //在这里面,this指的是用jQuery选中的元素
                        var bis=new BigImgScroll(this, options); 
                        
                        return bis.bigImgScroll();
                        
                };
                
        })(jQuery);