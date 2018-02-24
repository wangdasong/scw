/********************************************************************
 *
 * Copyright 2016-2017 nsw All rights reserved
 *
 ********************************************************************/
package com.github.wangdasong.scwauthserver.dao.entity;

import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;

public class PermissionResource extends BaseEntity {

    private String permissionId;
    private String resourceId;
    private Resource resource;
    private Permission permission;


    public String getPermissionId() {
        return permissionId;
    }

    public String getResourceId() {
        return resourceId;
    }



    public void setPermissionId(String permissionId) {
        this.permissionId = permissionId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

	public Resource getResource() {
		return resource;
	}

	public void setResource(Resource resource) {
		this.resource = resource;
	}

	public Permission getPermission() {
		return permission;
	}

	public void setPermission(Permission permission) {
		this.permission = permission;
	}



}
