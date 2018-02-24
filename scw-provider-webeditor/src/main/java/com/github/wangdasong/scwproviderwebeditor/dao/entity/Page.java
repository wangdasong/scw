/********************************************************************
 *
 * Copyright 2016-2017 nsw All rights reserved
 *
 ********************************************************************/
package com.github.wangdasong.scwproviderwebeditor.dao.entity;


import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;

import java.util.Date;
import java.util.List;

public class Page extends BaseEntity {

    private String code;
    private String name;
    private String screenSize="";
    private String tmpFlg;
    private List<Container> containers;
    private List<AttConfig> attConfigs;
    //服务提供者的编码
    private String providerCode;

    public String getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getScreenSize() {
        return screenSize;
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

    public void setScreenSize(String screenSize) {
        this.screenSize = screenSize;
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

	public List<Container> getContainers() {
		return containers;
	}

	public void setContainers(List<Container> containers) {
		this.containers = containers;
	}

	public List<AttConfig> getAttConfigs() {
		return attConfigs;
	}

	public void setAttConfigs(List<AttConfig> attConfigs) {
		this.attConfigs = attConfigs;
	}

	public String getProviderCode() {
		return providerCode;
	}

	public void setProviderCode(String providerCode) {
		this.providerCode = providerCode;
	}



}
