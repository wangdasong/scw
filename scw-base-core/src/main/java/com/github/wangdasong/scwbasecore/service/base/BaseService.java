package com.github.wangdasong.scwbasecore.service.base;


import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;

import java.util.List;

public interface BaseService<T extends BaseEntity>  {
	public T addEntity(T t);
	public T editEntity(T t);
	public T delEntity(String id);
	public T getEntityById(String id);
	public T getEntityDetailById(String id);
	public List<T> getEntityListByCondition(T t);
	public Pagination getEntityPage(int pageNo, int size, String sort, T t);
}
