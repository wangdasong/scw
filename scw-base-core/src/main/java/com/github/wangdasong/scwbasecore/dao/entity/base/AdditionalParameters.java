package com.github.wangdasong.scwbasecore.dao.entity.base;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

public class AdditionalParameters {
	/**
	 * 子节点列�?
	 */
	private List<TreeDataEntity> children = new ArrayList<TreeDataEntity>();

	/**
	 * 节点的Id
	 */
	private String id;

	/**
	 * 是否有�?�中属�??
	 */
	@JsonProperty("item-selected")
	private boolean itemSelected;

	public boolean isItemSelected() {
		return itemSelected;
	}

	public void setItemSelected(boolean itemSelected) {
		this.itemSelected = itemSelected;
	}

	public List<TreeDataEntity> getChildren() {
		return children;
	}

	public void setChildren(List<TreeDataEntity> children) {
		this.children = children;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

}
