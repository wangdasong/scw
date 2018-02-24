package com.github.wangdasong.scwproviderwebeditor.controller.webpage;

import com.github.wangdasong.scwproviderwebeditor.Constants;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Container;
import com.github.wangdasong.scwproviderwebeditor.service.ContainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(Constants.REST_CONTAINER_PREFIX)
public class ContainerController {

	@Autowired
	ContainerService containerService;

	/**
	 * 保存容器数据
	 */
	@RequestMapping(value = Constants.REST_CONTAINER_SOU)
	@ResponseBody
	public Container saveOrUpdate(Container container){
		container = containerService.saveOrUpdateContainer(container);
		return container;
	}

	/**
	 * 按模板保存容器数据
	 */
	@RequestMapping(value = Constants.REST_CONTAINER_SOU_TPL)
	@ResponseBody
	public Container saveOrUpdateByTemplate(String templateType, String pageId, String parentId){
		String[] currWeightList = templateType.split(":");
		int i = 0;
		for(String currWeight : currWeightList){
			Container container = new Container();
			container.setCode("CONTAINER_" + i);
			container.setName("自动创建容器" + i);
			container.setWidth(Integer.parseInt(currWeight));
			container.setContainerId(parentId);
			container.setPageId(pageId);
			container.setSort(i + 1);
			container = containerService.saveOrUpdateContainer(container);
			i++;
		}
		return containerService.getEntityById(parentId);
	}
	/**
	 * 删除容器数据
	 */
	@RequestMapping(value = Constants.REST_CONTAINER_DEL)
	@ResponseBody
	public Container del(Container container){
		containerService.delEntity(container.getId());
		return container;
	}
}
