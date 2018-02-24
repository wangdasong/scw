package com.github.wangdasong.scwproviderwebeditor.dao.persistence;

import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Widget;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;

public interface WidgetMapper extends BaseDaoMapper<Widget> {
	@Cacheable(value="pageDataCache")
    public Widget getDetailById(String id)throws RuntimeException;

	@CacheEvict(value="pageDataCache", allEntries=true)
    public void save(Widget entity)throws RuntimeException;

	@CacheEvict(value="pageDataCache", allEntries=true)
    public void update(Widget entity)throws RuntimeException;

	@CacheEvict(value="pageDataCache", allEntries=true)
    public void deleteById(String id)throws RuntimeException;
}

