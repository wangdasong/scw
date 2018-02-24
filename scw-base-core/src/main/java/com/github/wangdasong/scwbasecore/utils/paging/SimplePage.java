package com.github.wangdasong.scwbasecore.utils.paging;

import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;

/**
 * �??��分页�??
 */
public class SimplePage extends BaseEntity implements Paginable {
	private static final long serialVersionUID = 1L;
	public static final int DEF_COUNT = 10;

	/**
	 * �??��页码 checkPageNumber
	 * 
	 * @param pageNumber
	 * @return intData
	 */
	public static int cpn(Integer pageNumber) {
		return (pageNumber == null || pageNumber < 1) ? 1 : pageNumber;
	}

	public SimplePage() {
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
	public SimplePage(int pageNumber, int pageSize, int totalCount) {
		setTotalCount(totalCount);
		setPageSize(pageSize);
		setPageNumber(pageNumber);
		adjustPageNumber();
	}

	/**
	 * 调整页码，使不超过最大页�??
	 */
	public void adjustPageNumber() {
		if (pageNumber == 1) {
			return;
		}
		int tp = getTotalPage();
		if (pageNumber > tp) {
			pageNumber = tp;
		}
	}

	/**
	 * 获得页码
	 */
	public int getPageNumber() {
		return pageNumber;
	}

	/**
	 * 每页几条数据
	 */
	public int getPageSize() {
		return pageSize;
	}

	/**
	 * 总共几条数据
	 */
	public int getTotalCount() {
		return totalCount;
	}

	/**
	 * 总共几页
	 */
	public int getTotalPage() {
		int totalPage = totalCount / pageSize;
		if (totalPage == 0 || totalCount % pageSize != 0) {
			totalPage++;
		}
		return totalPage;
	}

	/**
	 * 是否第一�??
	 */
	public boolean isFirstPage() {
		return pageNumber <= 1;
	}

	/**
	 * 是否�??���??��
	 */
	public boolean isLastPage() {
		return pageNumber >= getTotalPage();
	}

	/**
	 * 下一页页�??
	 */
	public int getNextPage() {
		if (isLastPage()) {
			return pageNumber;
		} else {
			return pageNumber + 1;
		}
	}

	/**
	 * 上一页页�??
	 */
	public int getPrePage() {
		if (isFirstPage()) {
			return pageNumber;
		} else {
			return pageNumber - 1;
		}
	}

	protected int totalCount = 0;
	protected int pageSize = 20;
	protected int pageNumber = 1;
	protected int pageTotal = 1;
	protected int oracle_maxrow = 20;
	protected int oracle_minrow = 0;
	protected String pageSort;
	

	public String getPageSort() {
		return pageSort;
	}
	public String[] getPageSortArray() {
		if(pageSort == null){
			return null;
		}
		return pageSort.split(",");
	}

	public void setPageSort(String pageSort) {
		this.pageSort = pageSort;
	}

	public int getOracle_maxrow() {
		return pageSize * pageNumber;
	}

	public int getOracle_minrow() {
		return pageSize * (pageNumber-1);
	}

	public int getPageTotal() {
		if(totalCount % pageSize == 0){
			return (int)totalCount/pageSize;
		}else{
			return ((int)totalCount/pageSize + 1);
		}
	}

	public void setPageTotal(int pageTotal) {
		this.pageTotal = pageTotal;
	}

	/*
	 * if totalCount<0 then totalCount=0
	 * 
	 * @param totalCount
	 */
	public void setTotalCount(int totalCount) {
		if (totalCount < 0) {
			this.totalCount = 0;
		} else {
			this.totalCount = totalCount;
		}
	}

	/*
	 * if pageSize< 1 then pageSize=DEF_COUNT
	 * 
	 * @param pageSize
	 */
	public void setPageSize(int pageSize) {
		if (pageSize < 1) {
			this.pageSize = DEF_COUNT;
		} else {
			this.pageSize = pageSize;
		}
	}

	/*
	 * if pageNumber < 1 then pageNumber=1
	 * 
	 * @param pageNumber
	 */
	public void setPageNumber(int pageNumber) {
		if (pageNumber < 1) {
			this.pageNumber = 1;
		} else {
			this.pageNumber = pageNumber;
		}
	}

}
