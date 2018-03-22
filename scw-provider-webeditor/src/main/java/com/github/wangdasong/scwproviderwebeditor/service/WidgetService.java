package com.github.wangdasong.scwproviderwebeditor.service;

import com.github.wangdasong.scwbasecore.service.base.BaseService;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.AttConfig;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Widget;

import java.util.List;

public interface WidgetService extends BaseService<Widget>{
	public Pagination getMyAttConfigPage(int pageNo, int size, String sort, Widget widget);
	public List<AttConfig> getMyAttConfigList(Widget widget);
	public Widget saveOrUpdateWidget(Widget widget);
	public Widget saveWidgetInfoAll(Widget widget);
	public Widget copyElementAttsFromTemplet(Widget templetWidget, Widget myWidget);
}
