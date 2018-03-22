package com.github.wangdasong.scwproviderwebeditor.service.impl;

import com.github.wangdasong.scwbasecore.dao.entity.base.AdditionalParameters;
import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;
import com.github.wangdasong.scwbasecore.dao.entity.base.DataSrcEntity;
import com.github.wangdasong.scwbasecore.dao.entity.base.TreeDataEntity;
import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.service.base.DataSrcService;
import com.github.wangdasong.scwbasecore.service.base.TreeDataService;
import com.github.wangdasong.scwbasecore.service.impl.BaseServiceImpl;
import com.github.wangdasong.scwbasecore.utils.ThreadVariable;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwbasecore.utils.paging.TablePagingService;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.AttConfig;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Element;
import com.github.wangdasong.scwproviderwebeditor.dao.persistence.ElementMapper;
import com.github.wangdasong.scwproviderwebeditor.service.AttConfigService;
import com.github.wangdasong.scwproviderwebeditor.service.ContainerService;
import com.github.wangdasong.scwproviderwebeditor.service.ElementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ElementServiceImpl extends BaseServiceImpl<Element> implements DataSrcService<Element>, TreeDataService<Element>, ElementService {
	@Override
	public BaseDaoMapper<Element> getCurrDaoMapper() {
		return elementMapper;
	}

	@Resource
	ElementMapper elementMapper;
	@Autowired
	AttConfigService attConfigService;
	@Autowired
	ContainerService containerService;

	@Override
	public TreeDataEntity getTreeDataListByParentId(String parentId, Element queryCondition) {
		List<Element> elements = elementMapper.getElementsByParentId(parentId);
		Element parentElement = elementMapper.getById(parentId);
		List<TreeDataEntity> treeDataEntityList = new ArrayList<TreeDataEntity>();
		for(Element element : elements){
			TreeDataEntity treeDataEntity = new TreeDataEntity();
			treeDataEntity.setName(element.getCode() + ":" + element.getName());
			AdditionalParameters additionalParameters = new AdditionalParameters();
			additionalParameters.setId(element.getId());
			if(element.getSubCount() > 0){
				treeDataEntity.setTypeEnum(TreeDataEntity.TypeEnum.FOLDER);
			}else {
				treeDataEntity.setTypeEnum(TreeDataEntity.TypeEnum.ITEM);
			}
			treeDataEntity.setAdditionalParameters(additionalParameters);
			treeDataEntityList.add(treeDataEntity);
		}
		TreeDataEntity treeDataEntity = new TreeDataEntity();
		treeDataEntity.setTypeEnum(TreeDataEntity.TypeEnum.FOLDER);
		AdditionalParameters additionalParameters = new AdditionalParameters();
		if(parentElement == null){
			additionalParameters.setId("");
			treeDataEntity.setName("");
		}else{
			additionalParameters.setId(parentElement.getId());
			treeDataEntity.setName(parentElement.getCode()+":"+parentElement.getName());
		}
		additionalParameters.setChildren(treeDataEntityList);
		treeDataEntity.setAdditionalParameters(additionalParameters);
		return treeDataEntity;
	}

	@Override
	public List<DataSrcEntity> getDataSrcListByCondition(Element t) {
		List<DataSrcEntity> dataSrcEntityList = new ArrayList<DataSrcEntity>();
		//取得元素字段信息
		if(t.getId() != null){
			Element element = elementMapper.getById(t.getId());
			DataSrcEntity dataSrcEntity;
			//设置ID
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(element.getId() + "id");
			dataSrcEntity.setLabel("EDIT_ELEMENT_FORM_INPUT_ID");
			dataSrcEntity.setValue(element.getId());
			dataSrcEntityList.add(dataSrcEntity);
			//设置CODE
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(element.getId() + "code");
			dataSrcEntity.setLabel("EDIT_ELEMENT_FORM_INPUT_CODE");
			dataSrcEntity.setValue(element.getCode());
			dataSrcEntityList.add(dataSrcEntity);
			//设置NAME
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(element.getId() + "name");
			dataSrcEntity.setLabel("EDIT_ELEMENT_FORM_INPUT_NAME");
			dataSrcEntity.setValue(element.getName());
			dataSrcEntityList.add(dataSrcEntity);
			//设置父元素
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(element.getId() + "parentId");
			dataSrcEntity.setLabel("EDIT_ELEMENT_FORM_INPUT_PARENT");
			dataSrcEntity.setValue(element.getParentId());
			dataSrcEntityList.add(dataSrcEntity);
			//设置父元素
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(element.getId() + "widgetId");
			dataSrcEntity.setLabel("EDIT_ELEMENT_FORM_INPUT_WIDGET_ID");
			dataSrcEntity.setValue(element.getWidgetId());
			dataSrcEntityList.add(dataSrcEntity);

		}
		return dataSrcEntityList;
	}

	@Override
	public Pagination getMyAttrConfigPage(int pageNo, int size, String sort,
										  Element element) {
		Pagination pr = new Pagination(pageNo, size, sort, (TablePagingService)attConfigService);
		try {
			AttConfig attConfig = new AttConfig();
			attConfig.setBelongId(element.getId());
			pr.doPage(attConfig);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return pr;
	}

	@Override
	public void editElement(Element element) {
		elementMapper.update(element);
	}

	@Override
	public Element addElement(Element element) {
		element.setCreateDate(new Date());
		element.setUpdateDate(new Date());
		BaseEntity user = ThreadVariable.getUser();
		if(user != null ){
			element.setCreateUserId(user.getId());
			element.setUpdateUserId(user.getId());
		}
		elementMapper.save(element);
		/*String widgetId = element.getWidgetId();
		if(widgetId != null && !"".equals(widgetId)){
			Container container = new Container();
			container.setId(element.getId());
			container.setCode(element.getCode() + "AUTO_CREATE");
			container.setName(element.getName() + "默认容器");
			container.setPageId(widgetId);
			containerService.addEntity(container);
		}*/
		return element;
	}

	@Override
	public Element saveOrUpdateElement(Element element) {
		if(element.getId() == null || "".equals(element.getId())){
			addElement(element);
		}else{
			editElement(element);
		}
		return element;
	}

	@Override
	public List<AttConfig> getMyAttConfigList(
			Element element) {
		return attConfigService.getAttConfigsByBelongId(element.getId());
	}

	@Override
	public Element copyElementAttsFromTemplet(Element templetElement, Element myElement) {

		List<AttConfig> tempAttConfigs = this.getMyAttConfigList(templetElement);
		List<AttConfig> attConfigs = new ArrayList<AttConfig>();
		for(AttConfig attConfig : tempAttConfigs){
			attConfig.setId("");
			attConfig.setCreateDate(new Date());
			attConfig.setUpdateDate(new Date());
			attConfig.setBelongId(myElement.getId());
			if("TABLE_ELEMENT_INDEX".equals(attConfig.getCode())){
				attConfig.setAttValue(myElement.getName());
			}
			if("TABLE_ELEMENT_LABEL".equals(attConfig.getCode())){
				if(myElement.getAttConfigs() != null && myElement.getAttConfigs().size() > 0){
					attConfig.setAttValue(myElement.getAttConfigs().get(0).getAttValue());
				}
			}
			if("TABLE_ELEMENT_ORDER".equals(attConfig.getCode())){
				if(myElement.getAttConfigs() != null && myElement.getAttConfigs().size() > 1){
					attConfig.setAttValue(myElement.getAttConfigs().get(1).getAttValue());
				}
			}
			if("TABLE_ELEMENT_EDITABLE".equals(attConfig.getCode())){
				if(myElement.getAttConfigs() != null && myElement.getAttConfigs().size() > 2){
					attConfig.setAttValue(myElement.getAttConfigs().get(2).getAttValue());
				}
			}
			attConfigService.addEntity(attConfig);
			attConfigs.add(attConfig);
		}
		myElement.setAttConfigs(attConfigs);
		return myElement;
	}

	@Override
	public void delElement(Element element) {
		// TODO Auto-generated method stub
		List<AttConfig> attConfigList = this.getMyAttConfigList(element);
		for(AttConfig attConfig : attConfigList){
			attConfigService.delEntity(attConfig.getId());
		}
		List<Element> subElementList = elementMapper.getElementsByParentId(element.getId());
		for(Element subElement : subElementList){
			this.delElement(subElement);
		}
		elementMapper.deleteById(element.getId());
	}

	@Override
	public Element getElementById(String id) {
		Element currElement = elementMapper.getById(id);
		if(currElement == null){
			return null;
		}
		String partentId = currElement.getParentId();
		if(partentId != null){
			Element parentElement = this.getElementById(id);
			if(parentElement != null){
				currElement.setParentElement(parentElement);
			}
		}
		return currElement;
	}

	@Override
	public List<Element> getElementPath(String id) {
		List<Element> reElements = new ArrayList<Element>();
		String currId = id;
		Element currElement = null;
		do{
			currElement = elementMapper.getById(currId);
			if(currElement != null){
				reElements.add(0, currElement);
				currId = currElement.getParentId();
			}
		}while(currElement != null);
		return reElements;
	}

}
