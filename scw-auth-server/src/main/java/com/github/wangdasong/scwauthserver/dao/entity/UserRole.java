/********************************************************************
 *
 * Copyright 2016-2017 nsw All rights reserved
 *
 ********************************************************************/
package com.github.wangdasong.scwauthserver.dao.entity;

import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;

public class UserRole extends BaseEntity{

    private String userId;
    private String roleId;
    private Role role;


    public String getUserId() {
        return userId;
    }

    public String getRoleId() {
        return roleId;
    }



    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}



}
