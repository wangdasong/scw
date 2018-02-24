package com.github.wangdasong.scwproviderwebeditor.service;

import com.github.wangdasong.scwbasecore.service.base.BaseService;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Container;

import java.util.List;

public interface ContainerService extends BaseService<Container>{
	public List<Container> getSubContainers(String containerId);
	public Container saveOrUpdateContainer(Container container);
}
