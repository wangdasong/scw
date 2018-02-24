package com.github.wangdasong.scwproviderwebeditor.dao.persistence;


import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Page;

import java.util.List;

public interface PageMapper extends BaseDaoMapper<Page> {

	/**
	 * 获取页面总数目
	 * @param pagination
	 * @return int
	 */
	int getCount(Pagination pagination);

	/**
	 * 获取某一页页面信息的集合
	 * @param pagination
	 * @return 某页面信息集合
	 */
	List<Page> findPageData(Pagination pagination);
}

