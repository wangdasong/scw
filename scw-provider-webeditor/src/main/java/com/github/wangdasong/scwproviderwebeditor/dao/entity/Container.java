/********************************************************************
 *
 * Copyright 2016-2017 nsw All rights reserved
 *
 ********************************************************************/
package com.github.wangdasong.scwproviderwebeditor.dao.entity;


import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;

import java.util.Date;
import java.util.List;

public class Container extends BaseEntity {

    private String code;
    private String name;
    private String type;
    private int sort = 9999;
    private int width = 12;
    private String pageId;
    private String containerId;
    private String tmpFlg;
    private List<AttConfig> attConfigs;
    private List<Container> containers;
    private List<Widget> widgets;
    private int subCount;
    
    public String getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public String getPageId() {
        return pageId;
    }

    public String getContainerId() {
        return containerId;
    }

    public String getTmpFlg() {
        return tmpFlg;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public String getCreateUserId() {
        return createUserId;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public String getUpdateUserId() {
        return updateUserId;
    }



    public void setId(String id) {
        this.id = id;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setPageId(String pageId) {
        this.pageId = pageId;
    }

    public void setContainerId(String containerId) {
        this.containerId = containerId;
    }

    public void setTmpFlg(String tmpFlg) {
        this.tmpFlg = tmpFlg;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public void setCreateUserId(String createUserId) {
        this.createUserId = createUserId;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public void setUpdateUserId(String updateUserId) {
        this.updateUserId = updateUserId;
    }

	public List<AttConfig> getAttConfigs() {
		return attConfigs;
	}

	public void setAttConfigs(List<AttConfig> attConfigs) {
		this.attConfigs = attConfigs;
	}

	public List<Container> getContainers() {
		return containers;
	}

	public void setContainers(List<Container> containers) {
		this.containers = containers;
	}

	public List<Widget> getWidgets() {
		return widgets;
	}

	public void setWidgets(List<Widget> widgets) {
		this.widgets = widgets;
	}

	public int getSort() {
		return sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	public int getSubCount() {
		return subCount;
	}

	public void setSubCount(int subCount) {
		this.subCount = subCount;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}



}
