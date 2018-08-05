package com.github.wangdasong.scwauthserver.service.impl;

import com.github.wangdasong.scwauthserver.dao.entity.SubsysConfig;
import com.github.wangdasong.scwauthserver.dao.persistence.SubsysConfigMapper;
import com.github.wangdasong.scwauthserver.service.SubsysConfigService;
import com.github.wangdasong.scwbasecore.dao.entity.base.DataSrcEntity;
import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.service.base.DataSrcService;
import com.github.wangdasong.scwbasecore.service.impl.BaseServiceImpl;
import com.github.wangdasong.scwbasecore.utils.ThreadVariable;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwbasecore.utils.paging.TablePagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SubsysConfigServiceImpl extends BaseServiceImpl<SubsysConfig> implements
		DataSrcService<SubsysConfig>, SubsysConfigService, TablePagingService {
	@Autowired
	SubsysConfigMapper subsysConfigMapper;

	@Override
	public BaseDaoMapper<SubsysConfig> getCurrDaoMapper() {
		return subsysConfigMapper;
	}

	@Override
	public void add(SubsysConfig subsysConfig) {
		subsysConfigMapper.save(subsysConfig);
	}

	@Override
	public void edit(SubsysConfig subsysConfig) {
		subsysConfigMapper.update(subsysConfig);
	}

	@Override
	public void del(String scid) {
		subsysConfigMapper.deleteById(scid);
	}

	@Override
	public int getCount(Pagination page) {
		return subsysConfigMapper.getCount(page);
	}

	@Override
	public List<SubsysConfig> findPageData(Pagination page) {
		return subsysConfigMapper.findPageData(page);
	}

	@Override
	public Pagination getSubsysConfigPage(int pageNo, int size, String sort,
			SubsysConfig subsysConfig) {
		Pagination pr = new Pagination(pageNo, size, sort, this);
		try {
			pr.doPage(subsysConfig);
			if(pr.getList() != null ){
				for(SubsysConfig currSubsysConfig : (List<SubsysConfig>)pr.getList()){
					System.out.println("getSubsysConfigPage----"+ ThreadVariable.getSubsysCodeVariable());
					if(currSubsysConfig.getCode().equals(ThreadVariable.getSubsysCodeVariable())){
						currSubsysConfig.setActive(true);
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return pr;
	}

	@Override
	public List<DataSrcEntity> getDataSrcListByCondition(SubsysConfig t) {
		List<SubsysConfig> subsysConfigList = subsysConfigMapper.getAllData();
		List<DataSrcEntity> dataSrcEntityList = new ArrayList<DataSrcEntity>();
		for(SubsysConfig subsysConfig : subsysConfigList){
			DataSrcEntity currrDataSrcEntity = new DataSrcEntity();
			currrDataSrcEntity.setId(subsysConfig.getId());
			currrDataSrcEntity.setLabel(subsysConfig.getName());
			currrDataSrcEntity.setValue(subsysConfig.getCode());
			dataSrcEntityList.add(currrDataSrcEntity);
		}
		return dataSrcEntityList;
	}

	@Override
	public List<SubsysConfig> getAllList() {
		return subsysConfigMapper.getAllData();
	}

	@Override
	public SubsysConfig getById(String subsysConfigId) {
		return subsysConfigMapper.getById(subsysConfigId);
	}


}
