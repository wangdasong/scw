package com.github.wangdasong.scwproviderwebeditor.service;

import com.github.wangdasong.scwbasecore.service.base.BaseService;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.SubsysConfig;

import java.util.List;

public interface SubsysConfigService extends BaseService<SubsysConfig> {
	public Pagination getSubsysConfigPage(int pageNo, int size, String sort, SubsysConfig subsysConfig);
	public List<SubsysConfig> getAllList();
	public SubsysConfig getById(String subsysConfigId);
	public void add(SubsysConfig subsysConfig);
	public void edit(SubsysConfig subsysConfig);
	public void del(String scid);
}
