package com.github.wangdasong.scwproviderwebeditor.controller.webpage;

import com.github.wangdasong.scwbasecore.controller.base.BaseController;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwproviderwebeditor.Constants;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Page;
import com.github.wangdasong.scwproviderwebeditor.service.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(Constants.REST_PAGE_PREFIX)
public class PageController extends BaseController{

	@Autowired
	PageService pageService;

	/**
	 * 构建页面请求
	 */
	@RequestMapping(value = Constants.REST_USER_LIST)
	public Pagination findPagePage(Pagination pagination, Page page){
		Pagination rePage = null;
		rePage = pageService.getEntityPage(pagination.getPageNumber(), pagination.getPageSize(),pagination.getPageSort(), page);
		return rePage;
	}

	/**
	 * 保存容器数据
	 */
	@RequestMapping(value = Constants.REST_PAGE_SOU)
	public Page saveOrUpdate(Page page){
		page = pageService.saveOrUpdatePage(page);
		return page;
	}

	/**
	 * 删除容器数据
	 */
	@RequestMapping(value = Constants.REST_PAGE_DEL)
	public Page del(Page page){
		pageService.delEntity(page.getId());
		return page;
	}
	
	
}
