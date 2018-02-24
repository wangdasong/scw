/********************************************************************
 *
 * Copyright 2016-2017 nsw All rights reserved
 *
 ********************************************************************/
package com.github.wangdasong.scwauthserver.dao.entity;

import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;

public class RolePermission extends BaseEntity {

    private String roleId;
    private String permissionId;
    private Permission permission;


    public String getRoleId() {
        return roleId;
    }

    public String getPermissionId() {
        return permissionId;
    }



    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public void setPermissionId(String permissionId) {
        this.permissionId = permissionId;
    }

	public Permission getPermission() {
		return permission;
	}

	public void setPermission(Permission permission) {
		this.permission = permission;
	}



}
