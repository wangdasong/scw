package com.github.wangdasong.scwproviderwebeditor.service;


import com.github.wangdasong.scwbasecore.service.base.BaseService;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Page;

public interface PageService extends BaseService<Page> {
	public Page saveOrUpdatePage(Page page);
}
