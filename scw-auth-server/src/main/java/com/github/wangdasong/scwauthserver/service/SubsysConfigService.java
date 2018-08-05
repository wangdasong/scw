package com.github.wangdasong.scwauthserver.service;

import com.github.wangdasong.scwauthserver.dao.entity.SubsysConfig;
import com.github.wangdasong.scwbasecore.service.base.BaseService;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;

import java.util.List;

public interface SubsysConfigService extends BaseService<SubsysConfig> {
	public Pagination getSubsysConfigPage(int pageNo, int size, String sort, SubsysConfig subsysConfig);
	public List<SubsysConfig> getAllList();
	public SubsysConfig getById(String subsysConfigId);
	public void add(SubsysConfig subsysConfig);
	public void edit(SubsysConfig subsysConfig);
	public void del(String scid);
}
