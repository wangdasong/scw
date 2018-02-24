package com.github.wangdasong.scwproviderwebeditor.dao.persistence;

import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Element;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.dao.DataAccessException;

import java.util.List;

public interface ElementMapper extends BaseDaoMapper<Element> {
	public List<Element> getElementsByParentId(String parentId);

	@CacheEvict(value="pageDataCache", allEntries=true)
    public void save(Element entity)throws DataAccessException;

	@CacheEvict(value="pageDataCache", allEntries=true)
    public void update(Element entity)throws DataAccessException;

	@CacheEvict(value="pageDataCache", allEntries=true)
    public void deleteById(String id)throws DataAccessException;
}

