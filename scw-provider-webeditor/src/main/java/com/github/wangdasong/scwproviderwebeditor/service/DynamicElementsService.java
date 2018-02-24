package com.github.wangdasong.scwproviderwebeditor.service;


import com.github.wangdasong.scwproviderwebeditor.dao.entity.AttConfig;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Element;

import java.util.List;

public interface DynamicElementsService {
	List<Element> getElementsByWidgetId(String widgetId);
	List<AttConfig> getAttConfigsByElementId(String elementId);
}
