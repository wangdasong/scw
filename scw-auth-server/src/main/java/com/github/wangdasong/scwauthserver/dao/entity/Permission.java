/********************************************************************
 *
 * Copyright 2016-2017 nsw All rights reserved
 *
 ********************************************************************/
package com.github.wangdasong.scwauthserver.dao.entity;

import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;

import java.util.ArrayList;
import java.util.List;

public class Permission extends BaseEntity {

    private String permissionName;
    private String permission;
    private String description;
    private short state;
    private String resourceCount;
    private List<Resource> resourceList = new ArrayList<Resource>();

    private String roleId;

    public String getPermissionName() {
        return permissionName;
    }

    public String getPermission() {
        return permission;
    }

    public String getDescription() {
        return description;
    }

    public double getState() {
        return state;
    }



    public void setPermissionName(String permissionName) {
        this.permissionName = permissionName;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setState(short state) {
        this.state = state;
    }

	public String getRoleId() {
		return roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	public String getResourceCount() {
		return resourceCount;
	}

	public void setResourceCount(String resourceCount) {
		this.resourceCount = resourceCount;
	}

    public List<Resource> getResourceList() {
        return resourceList;
    }

    public void setResourceList(List<Resource> resourceList) {
        this.resourceList = resourceList;
    }
}
