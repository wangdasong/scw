package com.github.wangdasong.scwproviderwebeditor.service.impl;

import com.github.wangdasong.scwbasecore.dao.entity.base.BaseUser;
import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.service.impl.BaseServiceImpl;
import com.github.wangdasong.scwbasecore.utils.ThreadVariable;
import com.github.wangdasong.scwbasecore.utils.WebContextFactoryUtil;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwbasecore.utils.paging.TablePagingService;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.AttConfig;
import com.github.wangdasong.scwproviderwebeditor.dao.persistence.AttConfigMapper;
import com.github.wangdasong.scwproviderwebeditor.service.AttConfigService;
import com.github.wangdasong.scwproviderwebeditor.service.DynamicElementsService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class AttConfigServiceImpl extends BaseServiceImpl<AttConfig> implements TablePagingService, AttConfigService {
	@Override
	public BaseDaoMapper getCurrDaoMapper() {
		return attConfigMapper;
	}

	@Resource
	AttConfigMapper attConfigMapper;

	@Override
	public List<AttConfig> getAttConfigsByBelongId(String belongId) {
		if(belongId.contains("dynamicElement_")){
			String realBelongId = belongId.split("_")[2];
			String dynamicElementsServiceName = belongId.split("_")[1];
			DynamicElementsService dynamicElementsService = (DynamicElementsService) WebContextFactoryUtil.getBean(dynamicElementsServiceName);
			List<AttConfig> attConfigs = dynamicElementsService.getAttConfigsByElementId(realBelongId);
			return attConfigs;
		}
		return attConfigMapper.getByBelongId(belongId);
	}

	@Override
	public int getCount(Pagination page) {
		return attConfigMapper.getCount(page);
	}

	@Override
	public List findPageData(Pagination page) {
		return attConfigMapper.findPageData(page);
	}

	@Override
	@CacheEvict(value="pageDataCache", key="attConfig.getBelongId()", allEntries=true)
	public AttConfig addEntity(AttConfig attConfig) {
		if("".equals(attConfig.getId())){
			attConfig.setId(null);
		}
		if(attConfig.getNullAble()== null || "".equals(attConfig.getNullAble())){
			attConfig.setNullAble("1");
		}
		attConfigMapper.save(attConfig);
		return attConfig;
	}

	@CacheEvict(value="pageDataCache", key="attConfig.getBelongId()", allEntries=true)
	public AttConfig editEntity(AttConfig attConfig) {
		Date currTime = new Date();
		BaseUser loginUser = null;
		loginUser = (BaseUser) ThreadVariable.getUser();
		attConfig.setCreateDate(currTime);
		attConfig.setUpdateDate(currTime);
		if(loginUser != null){
			attConfig.setCreateUserId(loginUser.getCreateUserId());
			attConfig.setUpdateUserId(loginUser.getCreateUserId());
		}
		this.getCurrDaoMapper().update(attConfig);
		return attConfig;
	}


}
