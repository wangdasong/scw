package com.github.wangdasong.scwproviderwebeditor.dao.persistence;

import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Container;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;

public interface ContainerMapper extends BaseDaoMapper<Container> {
	@Cacheable(value="pageDataCache")
	List<Container> getListByParentId(String containerId);

	@CacheEvict(value="pageDataCache", allEntries=true)
    public void save(Container entity)throws RuntimeException;

	@CacheEvict(value="pageDataCache", allEntries=true)
    public void update(Container entity)throws RuntimeException;

	@CacheEvict(value="pageDataCache", allEntries=true)
    public void deleteById(String id)throws RuntimeException;
}

