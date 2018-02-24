package com.github.wangdasong.scwproviderwebeditor.dao.persistence;

import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.AttConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;

public interface AttConfigMapper extends BaseDaoMapper<AttConfig> {
	@Cacheable(value="pageDataCache")
	List<AttConfig> getByBelongId(String belongId);

	/**
	 * 获取用户总数目
	 * @param pagination
	 * @return int
	 */
	int getCount(Pagination pagination);

	/**
	 * 获取某一页用户的集合
	 * @param pagination
	 * @return 某页用户集合
	 */
	List<AttConfig> findPageData(Pagination pagination);

	@CacheEvict(value="pageDataCache", allEntries=true)
    public void save(AttConfig entity)throws RuntimeException;

	@CacheEvict(value="pageDataCache", allEntries=true)
    public void update(AttConfig entity)throws RuntimeException;

	@CacheEvict(value="pageDataCache", allEntries=true)
    public void deleteById(String id)throws RuntimeException;
}

