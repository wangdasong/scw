package com.github.wangdasong.scwproviderwebeditor.controller.webpage;

import com.github.wangdasong.scwbasecore.controller.base.BaseController;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwproviderwebeditor.Constants;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.SubsysConfig;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Widget;
import com.github.wangdasong.scwproviderwebeditor.service.SubsysConfigService;
import com.github.wangdasong.scwproviderwebeditor.service.WidgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * 服务提供者配置操作相关
 **/
@Controller
@RequestMapping(Constants.REST_SUBSYS_PREFIX)
public class SubsysConfigController extends BaseController {
	@Autowired
	SubsysConfigService subsysConfigService;
	@Autowired
	WidgetService widgetService;
//	@Autowired
//	ProviderConfigService providerConfigService;
//

	/**	
	 * 取得全部
	 */
	@RequestMapping(value = Constants.REST_SUBSYS_LIST)
	@ResponseBody
	public Pagination findUserPage(Pagination page, SubsysConfig subsysConfig){
		Pagination rePage = null;
		rePage = subsysConfigService.getSubsysConfigPage(page.getPageNumber(), page.getPageSize(),page.getPageSort(), subsysConfig);
		return rePage;
	}

	/**
	 * 改变子系统
	 */
	@RequestMapping(value = Constants.REST_SUBSYS_CHANGE)
	public SubsysConfig chageSubSys(HttpServletRequest req, HttpServletResponse rep, String subsysCode){
		Cookie subsysCodeCookie = null;
		Cookie[] cookies = req.getCookies();
		for(Cookie cookie : cookies){
			if(cookie.getName().equals("subsysCode")){
				subsysCodeCookie = cookie;
			}
		}
		if(subsysCodeCookie == null){
			subsysCodeCookie = new Cookie("subsysCode", subsysCode);
		}else{
			subsysCodeCookie.setValue(subsysCode);
		}
		subsysCodeCookie.setPath("/");
		//设置cookies一年有效
		subsysCodeCookie.setMaxAge(60*60*24*365);
		rep.addCookie(subsysCodeCookie);
		SubsysConfig subsysConfig = new SubsysConfig();
		subsysConfig.setCode(subsysCode);
		subsysConfig = subsysConfigService.getEntityListByCondition(subsysConfig).get(0);
		return subsysConfig;
	}

	/**
	 * 修改
	 */
	@RequestMapping(value = Constants.REST_SUBSYS_EDIT)
	@ResponseBody
	public SubsysConfig edit(SubsysConfig subsysConfig){

		//查看是否还有菜单控件
		SubsysConfig oldSubsysConfig = subsysConfigService.getById(subsysConfig.getId());
		Widget widget = new Widget();
		widget.setCode(oldSubsysConfig.getCode());
		List<Widget> widgetList = widgetService.getEntityListByCondition(widget);
		for(Widget currWidget : widgetList ){
			currWidget.setCode(subsysConfig.getCode());
			widgetService.editEntity(currWidget);
		}
		/*List<ProviderConfig> providerConfigList = providerConfigService.getProviderConfigsByCode(oldSubsysConfig.getCode());
		for(ProviderConfig providerConfig : providerConfigList ){
			providerConfig.setCode(subsysConfig.getCode());
			providerConfigService.edit(providerConfig);
		}*/
		subsysConfigService.edit(subsysConfig);
		return subsysConfig;
	}
	/**
	 * 新增
	 */
	@RequestMapping(value = Constants.REST_SUBSYS_ADD)
	public SubsysConfig add(SubsysConfig subsysConfig){
		if("".equals(subsysConfig.getId())){
			subsysConfig.setId(null);
		}
		subsysConfigService.add(subsysConfig);
		Widget widget = new Widget();
		widget.setCode(subsysConfig.getCode());
		widget.setName(subsysConfig.getName() + "菜单");
		widget.setType("menu");
		widget.setContainerId("systemmenu");
		widgetService.addEntity(widget);
		return subsysConfig;
	}
	/**
	 * 删除
	 */
	@RequestMapping(value = Constants.REST_SUBSYS_DEL)
	@ResponseBody
	public SubsysConfig del(SubsysConfig subsysConfig){
		//查看是否还有菜单控件
		subsysConfig = subsysConfigService.getById(subsysConfig.getId());
		Widget widget = new Widget();
		widget.setCode(subsysConfig.getCode());
		List<Widget> widgetList = widgetService.getEntityListByCondition(widget);
		for(Widget currWidget : widgetList ){
			//如果当前菜单有内容，结束删除子系统
			if(currWidget.getElements() != null && currWidget.getElements().size() > 0){
				return null;
			}else{
				//删除菜单控件
				try{
					widgetService.delEntity(currWidget.getId());
				}catch (Exception e){
					e.printStackTrace();
				}
			}
		}
		subsysConfigService.del(subsysConfig.getId());
		return subsysConfig;
	}
//	/**
//	 * 重新加载服务
//	 */
//	@RequestMapping(value = Constants.REST_SUBSYS_RELOAD)
//	@ResponseBody
//	public ResultString reload(){
//		ResultString resultString= new ResultString();
//		RedisProviderRouter redisProviderRouter = (RedisProviderRouter) WebContextFactoryUtil.getBean("redisProviderRouter");
//		redisProviderRouter.reloadProviders();
//		resultString.setStatus(0);
//		resultString.setMsg("服务重载成功！");
//		return resultString;
//	}
	
}
