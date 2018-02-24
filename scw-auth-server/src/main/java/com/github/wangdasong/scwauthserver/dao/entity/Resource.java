/********************************************************************
 *
 * Copyright 2016-2017 nsw All rights reserved
 *
 ********************************************************************/
package com.github.wangdasong.scwauthserver.dao.entity;

import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;

public class Resource extends BaseEntity {

	public static final String RESOURCE_TYPE_MENU = "1";
	public static final String RESOURCE_TYPE_CONTAINER = "2";
	public static final String RESOURCE_TYPE_WIDGET = "3";
	public static final String RESOURCE_TYPE_PC = "4";
	public static final String RESOURCE_TYPE_PW = "5";
	public static final String RESOURCE_TYPE_ELEMENT = "6";

    private String name;
    private String code;
    private String type;
    private String parentId;
    private Short sort;
    private Boolean hasRes;
    private String permissionId;
    private Integer subCount;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	public Short getSort() {
		return sort;
	}
	public void setSort(Short sort) {
		this.sort = sort;
	}
	public Boolean getHasRes() {
		return hasRes;
	}
	public void setHasRes(Boolean hasRes) {
		this.hasRes = hasRes;
	}
	public String getPermissionId() {
		return permissionId;
	}
	public void setPermissionId(String permissionId) {
		this.permissionId = permissionId;
	}
	public Integer getSubCount() {
		return subCount;
	}
	public void setSubCount(Integer subCount) {
		this.subCount = subCount;
	}



}
