package com.github.wangdasong.scwbasecore.utils.paging;

import java.util.List;

public interface TablePagingService {
	public int getCount(Pagination page);
	public List findPageData(Pagination page);
}
