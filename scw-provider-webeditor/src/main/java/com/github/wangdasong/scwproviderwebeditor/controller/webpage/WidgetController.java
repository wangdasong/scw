package com.github.wangdasong.scwproviderwebeditor.controller.webpage;

import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwproviderwebeditor.Constants;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Widget;
import com.github.wangdasong.scwproviderwebeditor.service.WidgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(Constants.REST_WIDGET_PREFIX)
public class WidgetController {

	@Autowired
	WidgetService widgetService;
	

	/**
	 * 查找控件属性
	 */
	@RequestMapping(value = Constants.REST_WIDGET_LIST)
	@ResponseBody
	public Pagination findMyAttConfigPage(Pagination page, Widget widget){
		Pagination rePage = null;
		if(widget.getId() == null || "".equals(widget.getId())){
			return null;
		}
		rePage = widgetService.getMyAttConfigPage(page.getPageNumber(), page.getPageSize(),page.getPageSort(), widget);
		return rePage;
	}


	/**
	 * 构�?�页面请�?
	 */
	@RequestMapping(value = Constants.REST_WIDGET_COPY_TEMPLETE)
	@ResponseBody
	public Widget copyTemplete(Pagination page, Widget myWidget){
		Widget tempWidget = new Widget();
		String tempWidgetId = "43C2964E5457760EE0530100007FFF6B";
		if("text".equals(myWidget.getType())){
			tempWidgetId = "43C2964E5457760EE0530100007FFF6B";
		}
		if("daterangepicker".equals(myWidget.getType())){
			tempWidgetId = "44221DEF691B34C7E0530100007F4B53";
		}
		if("datepicker".equals(myWidget.getType())){
			tempWidgetId = "4411559F7D854E43E0530100007F4309";
		}
		if("select".equals(myWidget.getType())){
			tempWidgetId = "442534BEED330FF1E0530100007F7F07";
		}
		if("radio".equals(myWidget.getType())){
			tempWidgetId = "43C2964E5459760EE0530100007FFF6B";
		}
		if("check".equals(myWidget.getType())){
			tempWidgetId = "4422B0B22CE0424EE0530100007F632C";
		}
		if("selecttree".equals(myWidget.getType())){
			tempWidgetId = "44B1CCF4C2175B89E0530100007F707C";
		}
		if("treeview".equals(myWidget.getType())){
			tempWidgetId = "44B1CCF4C2175B89E0530100007F707C";
		}
		if("button".equals(myWidget.getType())){
			tempWidgetId = "4463A07B5F863171E0530100007F066A";
		}
		if("datatable".equals(myWidget.getType())){
			tempWidgetId = "44288D81F8AE7291E0530100007F765E";
		}
		tempWidget.setId(tempWidgetId);
		myWidget = widgetService.copyElementAttsFromTemplet(tempWidget, myWidget);
		return myWidget;
	}

	/**
	 * 保存控件数据
	 */
	@RequestMapping(value = Constants.REST_WIDGET_SOU)
	@ResponseBody
	public Widget saveOrUpdate(Widget widget){
		widget = widgetService.saveOrUpdateWidget(widget);
		return widget;
	}
	/**
	 * 保存控件数据
	 */
	@RequestMapping(value = Constants.REST_WIDGET_SAVE)
	@ResponseBody
	public Widget saveOrUpdateForJson(@RequestBody Widget widget){
		widget = widgetService.saveWidgetInfoAll(widget);
		return widget;
	}

	/**
	 * 删除控件数据
	 */
	@RequestMapping(value = Constants.REST_WIDGET_DEL)
	@ResponseBody
	public Widget del(Widget widget){
		widgetService.delEntity(widget.getId());
		return widget;
	}
}
