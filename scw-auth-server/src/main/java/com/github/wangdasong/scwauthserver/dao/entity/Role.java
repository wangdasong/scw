/********************************************************************
 *
 * Copyright 2016-2017 nsw All rights reserved
 *
 ********************************************************************/
package com.github.wangdasong.scwauthserver.dao.entity;

import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;

import java.util.ArrayList;
import java.util.List;

public class Role extends BaseEntity {

    private String roleName;
    private String roleType;
    private String description;
    private Short state;
    private List<Permission> permissionList = new ArrayList<Permission>();


    public String getRoleName() {
        return roleName;
    }

    public String getRoleType() {
        return roleType;
    }

    public String getDescription() {
        return description;
    }

    public Short getState() {
        return state;
    }



    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public void setRoleType(String roleType) {
        this.roleType = roleType;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setState(Short state) {
        this.state = state;
    }

    public List<Permission> getPermissionList() {
        return permissionList;
    }

    public void setPermissionList(List<Permission> permissionList) {
        this.permissionList = permissionList;
    }
}
