package com.github.wangdasong.scwbasecore.dao.persistence.base;

import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;

import java.util.List;


public interface BaseDaoMapper<T extends BaseEntity> {
	/**
	 * 根据ID取得对象
	 * @param id
	 * @return
	 * @throws Exception
	 */
    public <PK> T getById(PK id)throws RuntimeException;
    
    /**
     * 根据ID取得对象以及对象中的成员
     * @param id
     * @return
     * @throws Exception
     */
    public <PK> T getDetailById(PK id)throws RuntimeException;

    public void save(T entity)throws RuntimeException;

    public void update(T entity)throws RuntimeException;

    public <PK> void deleteById(PK id)throws RuntimeException;

    public List<T> getAllData() throws RuntimeException;

    public List<T> getListByCondition(T t) throws RuntimeException;
    
	public int getCount(Pagination pagination) throws RuntimeException ;
	
	public List<T> findPageData(Pagination pagination) throws RuntimeException ;
	
}
