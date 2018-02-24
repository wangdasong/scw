package com.github.wangdasong.scwauthserver.service;


import com.github.wangdasong.scwauthserver.dao.entity.Permission;
import com.github.wangdasong.scwauthserver.dao.entity.RolePermission;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;

import java.util.List;
import java.util.Set;


public interface RolePermissionService{
	/** 
	 * 获取用户-角色桥表列表
	 * @param pageNo 页数
	 * @param size 每页多少条记录
	 * @param sort 排序条件
	 * @param rp 查询条件
	 * @return Pagination
	 */
	public Pagination getRolePermissionPage(int pageNo, int size, String sort, RolePermission rp);
	public void edit(RolePermission rp);
	public void add(RolePermission rp);
	public void del(String userRoleId);
	
	
	
	/**
	 * <p>方法描述: 创建新 用户-角色桥表 关联</p>
	 * <p>方法备注: </p>
	 * @param rp
	 * @return int
	 */
	public int create(RolePermission rp);
	
	List<Permission> getPermissionListByRoleId(String roleId);

	List<String> getRoleByPid(String pid);

	public List<Permission> getPermissionList(String username);

	public Set<String> findRoleByPid(Set<String> permissionIdSet);
    
	
	
}
