package com.github.wangdasong.scwbasecore.utils.paging;


import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;
import com.github.wangdasong.scwbasecore.utils.ConvertObject;
import com.github.wangdasong.scwbasecore.utils.MapUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * 列表分页。包含list属�?�??
 */

public class Pagination extends SimplePage implements java.io.Serializable,
		Paginable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1101012159847725114L;

	TablePagingService tablePagingService;

	public Pagination() {
	}
	public Pagination(int pageNumber, int pageSize, String pageSort, TablePagingService tablePagingService) {
		this.pageNumber = pageNumber;
		this.pageSize = pageSize;
		this.pageSort = pageSort;
		this.tablePagingService = tablePagingService;
		this.list = new ArrayList();
	}

	private HashMap editPageMap(Object... options) {
		HashMap conditionMap = null;
		try {
			conditionMap = (HashMap) ConvertObject.modelsToMap(options);
			MapUtils.MapEmptyForNull(conditionMap);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return conditionMap;
	}

	public Pagination doPage(BaseEntity... options) throws Exception{
		HashMap conditionMap = editPageMap(options);
		this.setOptions(conditionMap);
		totalCount = tablePagingService.getCount(this);
		//获取分页数据
		list = tablePagingService.findPageData(this);
		return this;
	}
	/**
	 * 构�?�??
	 * 
	 * @param pageNumber
	 *            页码
	 * @param pageSize
	 *            每页几条数据
	 * @param totalCount
	 *            总共几条数据
	 */
	public Pagination(int pageNumber, int pageSize, int totalCount) {
		super(pageNumber, pageSize, totalCount);
	}

	/**
	 * 构�?�??
	 * 
	 * @param pageNumber
	 *            页码
	 * @param pageSize
	 *            每页几条数据
	 * @param totalCount
	 *            总共几条数据
	 * @param list
	 *            分页内容
	 */
	public Pagination(int pageNumber, int pageSize, int totalCount, List<?> list) {
		super(pageNumber, pageSize, totalCount);
		this.list = list;
	}

	/**
	 * 第一条数据位�??
	 * 
	 * @return
	 */
	public int getFirstResult() {
		return (pageNumber - 1) * pageSize;
	}

	/**
	 * 当前页的数据
	 */
	protected List<?> list;

	/**
	 * 输出table的ID
	 */
	protected String tableId;

	protected HashMap options;
	/**
	 * 获得分页内容
	 * 
	 * @return
	 */
	public List<?> getList() {
		return list;
	}

	/**
	 * 设置分页内容
	 * 
	 * @param list
	 */
	@SuppressWarnings("unchecked")
	public void setList(List list) {
		this.list = list;
	}
	
	public HashMap getOptions() {
		return options;
	}
	public void setOptions(HashMap options) {
		this.options = options;
	}
	public String getTableId() {
		return tableId;
	}
	public void setTableId(String tableId) {
		this.tableId = tableId;
	}
}
