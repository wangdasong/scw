package com.github.wangdasong.scwproviderwebeditor.service.impl;

import com.github.wangdasong.scwbasecore.dao.entity.base.DataSrcEntity;
import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.service.base.DataSrcService;
import com.github.wangdasong.scwbasecore.service.impl.BaseServiceImpl;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwbasecore.utils.paging.TablePagingService;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Container;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Page;
import com.github.wangdasong.scwproviderwebeditor.dao.persistence.PageMapper;
import com.github.wangdasong.scwproviderwebeditor.service.ContainerService;
import com.github.wangdasong.scwproviderwebeditor.service.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@Service
public class PageServiceImpl extends BaseServiceImpl<Page> implements DataSrcService<Page>, PageService, TablePagingService {
	@Override
	public BaseDaoMapper getCurrDaoMapper() {
		return pageMapper;
	}

	@Resource
	PageMapper pageMapper;
	@Autowired
	ContainerService containerService;

	@Override
	public Page delEntity(String id) {
		Page page = pageMapper.getDetailById(id);
		List<Container> containerList = page.getContainers();
		for(Container container : containerList){
			containerService.delEntity(container.getId());
		}
		pageMapper.deleteById(page.getId());
		return page;
	}

	@Override
	public Page saveOrUpdatePage(Page page) {
		if(page.getId() == null || "".equals(page.getId())){
			this.addEntity(page);
			//增加主内容容器（固定）
			Container container = new Container();
			container.setCode("MAIN_CONTENT");
			container.setName("内容容器");
			container.setPageId(page.getId());
			container.setContainerId(page.getId());
			container.setTmpFlg("1");
			containerService.addEntity(container);
		}else{
			this.editEntity(page);
		}
		page = (Page)this.getEntityDetailById(page.getId());
		return page;
	}

	@Override
	public List<DataSrcEntity> getDataSrcListByCondition(Page t) {
		List<DataSrcEntity> dataSrcEntityList = new ArrayList<DataSrcEntity>();
		//取得元素字段信息
		if(t.getId() != null){
			Page page = pageMapper.getById(t.getId());
			DataSrcEntity dataSrcEntity;
			//设置ID
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(page.getId() + "id");
			dataSrcEntity.setLabel("EDIT_PAGE_FORM_INPUT_ID");
			dataSrcEntity.setValue(page.getId());
			dataSrcEntityList.add(dataSrcEntity);
			//设置CODE
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(page.getId() + "code");
			dataSrcEntity.setLabel("EDIT_PAGE_FORM_INPUT_CODE");
			dataSrcEntity.setValue(page.getCode());
			dataSrcEntityList.add(dataSrcEntity);
			//设置NAME
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(page.getId() + "name");
			dataSrcEntity.setLabel("EDIT_PAGE_FORM_INPUT_NAME");
			dataSrcEntity.setValue(page.getName());
			dataSrcEntityList.add(dataSrcEntity);

		}
		return dataSrcEntityList;
	}


	@Override
	public int getCount(Pagination pagination) {
		return pageMapper.getCount(pagination);
	}

	@Override
	public List<Page> findPageData(Pagination pagination) {
		return pageMapper.findPageData(pagination);
	}

}
