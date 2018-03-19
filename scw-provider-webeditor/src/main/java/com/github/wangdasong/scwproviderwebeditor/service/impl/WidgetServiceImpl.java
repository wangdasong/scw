package com.github.wangdasong.scwproviderwebeditor.service.impl;

import com.github.wangdasong.scwbasecore.dao.entity.base.DataSrcEntity;
import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.service.base.DataSrcService;
import com.github.wangdasong.scwbasecore.service.impl.BaseServiceImpl;
import com.github.wangdasong.scwbasecore.utils.ThreadVariable;
import com.github.wangdasong.scwbasecore.utils.WebContextFactoryUtil;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwbasecore.utils.paging.TablePagingService;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.AttConfig;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Container;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Element;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Widget;
import com.github.wangdasong.scwproviderwebeditor.dao.persistence.WidgetMapper;
import com.github.wangdasong.scwproviderwebeditor.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class WidgetServiceImpl extends BaseServiceImpl<Widget> implements DataSrcService<Widget>, WidgetService {
	@Override
	public BaseDaoMapper<Widget> getCurrDaoMapper() {
		return widgetMapper;
	}

	@Autowired
	WidgetMapper widgetMapper;
	@Autowired
	AttConfigService attConfigService;
	@Autowired
	ContainerService containerService;
	@Autowired
	ElementService elementService;
	protected Widget menuPermissionFilter(Widget widget, Set<String> permission){
		Set<Element> dealElementSet = new HashSet<Element>();
		for(Element element : widget.getElements()){
			if(!permission.contains(element.getId())){
				dealElementSet.add(element);
			}
			Set<Element> dealElementSub2Set = new HashSet<Element>();
			for(Element elementSub2 : element.getChildElements()){
				if(!permission.contains(elementSub2.getId())){
					dealElementSub2Set.add(elementSub2);
				}
				Set<Element> dealElementSub3Set = new HashSet<Element>();
				for(Element elementSub3 : elementSub2.getChildElements()){
					if(!permission.contains(elementSub3.getId())){
						dealElementSub3Set.add(elementSub3);
					}
					Set<Element> dealElementSub4Set = new HashSet<Element>();
					for(Element elementSub4 : elementSub3.getChildElements()){
						if(!permission.contains(elementSub4.getId())){
							dealElementSub4Set.add(elementSub4);
						}
					}
					for(Element dealElementSub4 : dealElementSub4Set){
						elementSub3.getChildElements().remove(dealElementSub4);
					}
				}
				for(Element dealElementSub3 : dealElementSub3Set){
					elementSub2.getChildElements().remove(dealElementSub3);
				}
			}
			for(Element dealElementSub2 : dealElementSub2Set){
				element.getChildElements().remove(dealElementSub2);
			}
		}
		for(Element dealElement : dealElementSet){
			widget.getElements().remove(dealElement);
		}
		return widget;
	}
	protected Widget elementPermissionFilter(Widget widget, Set<String> permission){
		//编辑页面不控制权限
		Container container = containerService.getEntityById(widget.getContainerId());
		if(container.getContainerId().length() < 32){
			return widget;
		}
		Set<Element> dealElementSet = new HashSet<Element>();
		for(Element element : widget.getElements()){
			String currMenuId = ThreadVariable.getCurrMenuVariable();
			if(!permission.contains(currMenuId + ":" + widget.getContainerId() + ":" + widget.getId() + ":" + element.getId())){
				dealElementSet.add(element);
			}
		}
		for(Element dealElement : dealElementSet){
			widget.getElements().remove(dealElement);
		}
		return widget;
	}
	@Override
	public Widget getEntityDetailById(String widgetId) {
		Widget widget = widgetMapper.getDetailById(widgetId);
		for(AttConfig currAttConfig : widget.getAttConfigs()){
			if("dynamicElement".equals(currAttConfig.getType())){
				String currAttConfigValue = currAttConfig.getAttValue();
				String dynamicElementsServiceName = currAttConfigValue.split(":")[0];
				String newWidgetId = widget.getId();
				if(currAttConfigValue.split(":").length > 1){
					newWidgetId = currAttConfigValue.split(":")[1];
				}
				DynamicElementsService dynamicElementsService = (DynamicElementsService) WebContextFactoryUtil.getBean(dynamicElementsServiceName);
				List<Element> elements = dynamicElementsService.getElementsByWidgetId(newWidgetId);
				for(Element element : elements){
					element.setId("dynamicElement_" + dynamicElementsServiceName + "_" + element.getId());
				}
				widget.setElements(elements);
			}
		}
//		if(SecurityUtils.getSubject().getPrincipal() == null || SecurityUtils.getSubject().hasRole("sysadmin") || ThreadVariable.getPopupWidgetVariable() != null){
//			return widget;
//		}
		return widget;
		//如果是读取菜单信息，检查菜单权限
//		if("systemmenu".equals(widget.getContainerId())){
//			Set<String> menuPermission = ThreadVariable.getMenuPermissionSetVariable();
//			return menuPermissionFilter(widget, menuPermission);
//		}else {
//			Set<String> elementPermission = ThreadVariable.getElementPermissionSetVariable();
//			return elementPermissionFilter(widget, elementPermission);
//		}
	}

	@Override
	public Widget saveOrUpdateWidget(Widget widget) {
		//正常插入控件数据到DB
		if(widget.getId() == null || "".equals(widget.getId())){
			addEntity(widget);
		}else if(widget.getId().indexOf("@") > -1){
			//页面编辑创建控件
			widget.setId(null);
			widget.setTmpFlg("false");
			widget = addEntity(widget);
			if(widget.getAttConfigs() != null){
				for(AttConfig ac : widget.getAttConfigs()){
					ac.setBelongId(widget.getId());
					attConfigService.addEntity(ac);
				}
			}
		}else{
			editEntity(widget);
		}
		return widget;
	}

	@Override
	public Pagination getMyAttConfigPage(int pageNo, int size, String sort, Widget widget) {
		Pagination pr = new Pagination(pageNo, size, sort, (TablePagingService)attConfigService);
		try {
			AttConfig attConfig = new AttConfig();
			attConfig.setBelongId(widget.getId());
			pr.doPage(attConfig);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return pr;
	}

	@Override
	public List<AttConfig> getMyAttConfigList(Widget widget) {
		return attConfigService.getAttConfigsByBelongId(widget.getId());
	}

	@Override
	public List<DataSrcEntity> getDataSrcListByCondition(Widget t) {
		List<DataSrcEntity> dataSrcEntityList = new ArrayList<DataSrcEntity>();
		//取得元素字段信息
		if(t.getId() != null){
			Widget widget = widgetMapper.getById(t.getId());
			DataSrcEntity dataSrcEntity;
			//设置ID
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(widget.getId() + "id");
			dataSrcEntity.setLabel("EDIT_WIDGET_FORM_INPUT_ID");
			dataSrcEntity.setValue(widget.getId());
			dataSrcEntityList.add(dataSrcEntity);
			//设置CODE
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(widget.getId() + "code");
			dataSrcEntity.setLabel("EDIT_WIDGET_FORM_INPUT_CODE");
			dataSrcEntity.setValue(widget.getCode());
			dataSrcEntityList.add(dataSrcEntity);
			//设置NAME
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(widget.getId() + "name");
			dataSrcEntity.setLabel("EDIT_WIDGET_FORM_INPUT_NAME");
			dataSrcEntity.setValue(widget.getName());
			dataSrcEntityList.add(dataSrcEntity);
			//设置类型
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(widget.getId() + "parentId");
			dataSrcEntity.setLabel("EDIT_WIDGET_FORM_INPUT_TYPE");
			dataSrcEntity.setValue(widget.getType());
			dataSrcEntityList.add(dataSrcEntity);
			//设置所属容器
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(widget.getId() + "widgetId");
			dataSrcEntity.setLabel("EDIT_WIDGET_FORM_INPUT_CONATAINER_ID");
			dataSrcEntity.setValue(widget.getContainerId());
			dataSrcEntityList.add(dataSrcEntity);
			//设置加载顺序
			dataSrcEntity = new DataSrcEntity();
			dataSrcEntity.setId(widget.getId() + "sort");
			dataSrcEntity.setLabel("EDIT_WIDGET_FORM_INPUT_SORT");
			dataSrcEntity.setValue(widget.getSort() + "");
			dataSrcEntityList.add(dataSrcEntity);

		}
		return dataSrcEntityList;
	}


	@Override
	public Widget copyElementAttsFromTemplet(Widget templetWidget,
			Widget myWidget) {
		List<AttConfig> tempAttConfigs = this.getMyAttConfigList(templetWidget);
		List<AttConfig> attConfigs = new ArrayList<AttConfig>();
		for(AttConfig attConfig : tempAttConfigs){
			attConfig.setId("");
			attConfig.setCreateDate(new Date());
			attConfig.setUpdateDate(new Date());
			attConfig.setBelongId(myWidget.getId());
			attConfigService.addEntity(attConfig);
			attConfigs.add(attConfig);
		}
		myWidget.setAttConfigs(attConfigs);
		return myWidget;
	}

	@Override
	public Widget delEntity(String id) {
		Widget widgetDetail = this.getEntityDetailById(id);
		for(Element element : widgetDetail.getElements()){
			elementService.delElement(element);
		}
		for(AttConfig attConfig : widgetDetail.getAttConfigs()){
			attConfigService.delEntity(attConfig.getId());
		}
		widgetMapper.deleteById(id);
		return widgetDetail;
	}
}
