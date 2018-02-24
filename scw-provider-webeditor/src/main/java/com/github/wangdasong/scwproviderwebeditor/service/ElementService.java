package com.github.wangdasong.scwproviderwebeditor.service;


import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.AttConfig;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Element;

import java.util.List;

public interface ElementService {
	/** 
	 * 获取自己属性列表
	 * @param pageNo 页数
	 * @param size 每页多少条记录 
	 * @param sort 拍序条件
	 * @param element 查询条件
	 * @return Pagination
	 */
	public Pagination getMyAttrConfigPage(int pageNo, int size, String sort, Element element);
	public List<AttConfig> getMyAttConfigList(Element element);
	public Element getElementById(String id);
	public List<Element> getElementPath(String id);
	public void editElement(Element element);
	public void addElement(Element element);
	public void delElement(Element element);
	public Element saveOrUpdateElement(Element element);
	public Element copyElementAttsFromTemplet(Element templetElement, Element myElement);
}
