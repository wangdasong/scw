package com.github.wangdasong.scwproviderwebeditor.service.impl;

import com.github.wangdasong.scwbasecore.dao.entity.base.AdditionalParameters;
import com.github.wangdasong.scwbasecore.dao.entity.base.DataSrcEntity;
import com.github.wangdasong.scwbasecore.dao.entity.base.TreeDataEntity;
import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.service.base.DataSrcService;
import com.github.wangdasong.scwbasecore.service.base.TreeDataService;
import com.github.wangdasong.scwbasecore.service.impl.BaseServiceImpl;
import com.github.wangdasong.scwbasecore.utils.ThreadVariable;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Container;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Widget;
import com.github.wangdasong.scwproviderwebeditor.dao.persistence.ContainerMapper;
import com.github.wangdasong.scwproviderwebeditor.service.ContainerService;
import com.github.wangdasong.scwproviderwebeditor.service.ElementService;
import com.github.wangdasong.scwproviderwebeditor.service.WidgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Service
public class ContainerServiceImpl extends BaseServiceImpl<Container> implements DataSrcService<Container>, TreeDataService<Container>, ContainerService{
	@Override
	public BaseDaoMapper<Container> getCurrDaoMapper() {
		return containerMapper;
	}

	@Autowired
	ContainerMapper containerMapper;
	@Autowired
	WidgetService widgetService;
	@Autowired
	ElementService elementService;

	@Override
	public List<Container> getSubContainers(String containerId) {
		//取得容器列表
		List<Container> containerOrgList = containerMapper.getListByParentId(containerId);
		List<Container> containerList = new ArrayList<Container>();
		for(Container currContainer : containerOrgList){
			try {
				containerList.add((Container) currContainer.deepCopy());
			}catch (Exception e){
				containerList.add(new Container());
				e.printStackTrace();
			}
		}
		ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		HttpServletRequest request =  attributes.getRequest();
		Cookie[] cookies = request.getCookies();
		String subSysCode = "common";
		if(cookies != null){
			for(Cookie cookie : cookies){
				if(cookie.getName().equals("subsysCode")){
					subSysCode = cookie.getValue();
				}
			}
		}
		//角色未系统管理员或编辑视图功能
		for(Container container : containerList){
			List<Widget> needDealList = new ArrayList<Widget>();
			for(Widget widget : container.getWidgets()){
				if("menu".equals(widget.getType()) && !subSysCode.equals(widget.getCode())){
					needDealList.add(widget);
				}
			}
			for(Widget widget : needDealList){
				container.getWidgets().remove(widget);
			}
		}

		//校验权限
		Collection authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
		Set<String> permissionSet= new HashSet<>();
		for (Object authoritie : authorities){
			permissionSet.add(authoritie.toString());
		}
		if(permissionSet.contains("sysadmin") || containerId.length() < 32){
			return containerList;
		}
		String currMenuId = ThreadVariable.getCurrMenuVariable();
		String currPopupWidgetId = ThreadVariable.getPopupWidgetVariable();
		String currPopupContainerId = null;
		if(currPopupWidgetId != null && !"".equals(currPopupWidgetId)){
			if(!"none".equals(currPopupWidgetId)){
				currPopupContainerId = widgetService.getEntityDetailById(currPopupWidgetId).getContainerId();
				Set<String> pcPermissionSet= ThreadVariable.getPcPermissionSetVariable();
				Set<String> pwPermissionSet= ThreadVariable.getPwPermissionSetVariable();
				List<Container> dealContainerList = new ArrayList<Container>();
				for(Container currContainer : containerList){
					if(!pcPermissionSet.contains(currMenuId + ":" + currPopupContainerId + ":" + currPopupWidgetId + ":" + currContainer.getId())){
						dealContainerList.add(currContainer);
					}else{
						List<Widget> dealWidgetList = new ArrayList<Widget>();
						for(Widget currWidget : currContainer.getWidgets()){
							if(!pwPermissionSet.contains(currMenuId + ":" + currPopupContainerId + ":" + currPopupWidgetId + ":" + currContainer.getId() + ":" + currWidget.getId())){
								dealWidgetList.add(currWidget);
							}
						}
						for(Widget dealWidget : dealWidgetList){
							currContainer.getWidgets().remove(dealWidget);
						}
					}
				}
				for(Container dealContainer : dealContainerList){
					containerList.remove(dealContainer);
				}
			}
		}else{
			List<Container> dealContainerList = new ArrayList<Container>();
			for(Container currContainer : containerList){
				if(!permissionSet.contains(currMenuId + ":" + currContainer.getId())){
					dealContainerList.add(currContainer);
				}else{
					List<Widget> dealWidgetList = new ArrayList<Widget>();
					for(Widget currWidget : currContainer.getWidgets()){
						if(!permissionSet.contains(currMenuId + ":" + currContainer.getId() + ":" + currWidget.getId())){
							dealWidgetList.add(currWidget);
						}
					}
					for(Widget dealWidget : dealWidgetList){
						currContainer.getWidgets().remove(dealWidget);
					}
				}
			}
			for(Container dealContainer : dealContainerList){
				containerList.remove(dealContainer);
			}
		}
		return containerList;
	}

	@Override
	public TreeDataEntity getTreeDataListByParentId(String parentId, Container queryCondition) {
		List<Container> containers = containerMapper.getListByParentId(parentId);
		Container parentContainer = containerMapper.getById(parentId);
		List<TreeDataEntity> treeDataEntitys = new ArrayList<TreeDataEntity>();
		for(Container container : containers){
			TreeDataEntity currTreeDataEntity = new TreeDataEntity();
			currTreeDataEntity.setName(container.getCode()+":"+container.getName());
			if(container.getSubCount() > 0){
				currTreeDataEntity.setTypeEnum(TreeDataEntity.TypeEnum.FOLDER);
				AdditionalParameters adp = new AdditionalParameters();
                adp.setId(container.getId());
                currTreeDataEntity.setAdditionalParameters(adp);  
			}else{
				AdditionalParameters adp = new AdditionalParameters();
				adp.setId(container.getId());
                adp.setItemSelected(false);
                currTreeDataEntity.setAdditionalParameters(adp);
				currTreeDataEntity.setTypeEnum(TreeDataEntity.TypeEnum.ITEM);//无子节点 
			}
			treeDataEntitys.add(currTreeDataEntity);
		}
		TreeDataEntity treeDataEntity = new TreeDataEntity();
		treeDataEntity.setTypeEnum(TreeDataEntity.TypeEnum.FOLDER);
		AdditionalParameters additionalParameters = new AdditionalParameters();
		additionalParameters.setChildren(treeDataEntitys);
		if(parentContainer == null){
			treeDataEntity.setName("");
			additionalParameters.setId("");
		}else{
			treeDataEntity.setName(parentContainer.getCode()+":"+parentContainer.getName());
			additionalParameters.setId(parentContainer.getId());
		}
		treeDataEntity.setAdditionalParameters(additionalParameters);
		return treeDataEntity;
	}

	@Override
	public List<DataSrcEntity> getDataSrcListByCondition(Container t) {
		List<DataSrcEntity> dataSrcEntityList = new ArrayList<DataSrcEntity>();
		//取得元素字段信息
		if(t.getId() != null){
			Container container = containerMapper.getById(t.getId());
			DataSrcEntity dataSrcEntity;
			//设置ID
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(container.getId() + "id");
			dataSrcEntity.setLabel("EDIT_CONTAINER_FORM_INPUT_ID");
			dataSrcEntity.setValue(container.getId());
			dataSrcEntityList.add(dataSrcEntity);
			//设置CODE
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(container.getId() + "code");
			dataSrcEntity.setLabel("EDIT_CONTAINER_FORM_INPUT_CODE");
			dataSrcEntity.setValue(container.getCode());
			dataSrcEntityList.add(dataSrcEntity);
			//设置NAME
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(container.getId() + "name");
			dataSrcEntity.setLabel("EDIT_CONTAINER_FORM_INPUT_NAME");
			dataSrcEntity.setValue(container.getName());
			dataSrcEntityList.add(dataSrcEntity);
			//设置页面ID
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(container.getId() + "pageId");
			dataSrcEntity.setLabel("EDIT_CONTAINER_FORM_INPUT_PAGE_ID");
			dataSrcEntity.setValue(container.getPageId());
			dataSrcEntityList.add(dataSrcEntity);
			//设置父容器ID
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(container.getId() + "containerId");
			dataSrcEntity.setLabel("EDIT_CONTAINER_FORM_INPUT_CONTAINER_ID");
			dataSrcEntity.setValue(container.getContainerId());
			dataSrcEntityList.add(dataSrcEntity);
			//设置排序
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(container.getId() + "sort");
			dataSrcEntity.setLabel("EDIT_CONTAINER_FORM_INPUT_SORT");
			dataSrcEntity.setValue(container.getSort() + "");
			dataSrcEntityList.add(dataSrcEntity);
			//设置宽度
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(container.getId() + "width");
			dataSrcEntity.setLabel("EDIT_CONTAINER_FORM_INPUT_WIDTH");
			dataSrcEntity.setValue(container.getWidth() + "");
			dataSrcEntityList.add(dataSrcEntity);
			
			
		}
		return dataSrcEntityList;
	}

	@Override
	public Container delEntity(String id) {
		Container container = containerMapper.getDetailById(id);
		List<Widget> widgetList = container.getWidgets();
		for (Widget widget : widgetList) {
			widgetService.delEntity(widget.getId());
		}
		containerMapper.deleteById(container.getId());
		return container;
	}

	@Override
	public Container saveOrUpdateContainer(Container container) {
		if(container.getId() == null || "".equals(container.getId())){
			addEntity(container);
		}else{
			editEntity(container);
		}
		return container;
	}

}
