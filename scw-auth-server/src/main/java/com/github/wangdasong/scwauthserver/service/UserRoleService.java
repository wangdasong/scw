package com.github.wangdasong.scwauthserver.service;


import com.github.wangdasong.scwauthserver.dao.entity.CommonUser;
import com.github.wangdasong.scwauthserver.dao.entity.Role;
import com.github.wangdasong.scwauthserver.dao.entity.UserRole;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;

import java.util.List;


public interface UserRoleService{
	/** 
	 * 获取用户-角色桥表列表
	 * @param pageNo 页数
	 * @param size 每页多少条记录
	 * @param sort 排序条件
	 * @param userRole 查询条件
	 * @return Pagination
	 */
	public Pagination getUserRolePage(int pageNo, int size, String sort, UserRole userRole);
	public void editUserRole(UserRole userRole);
	public void addUserRole(UserRole userRole);
	public void delUserRole(String userRoleId);
	
	
	
	/**
	 * <p>方法描述: 创建新 用户-角色桥表 关联</p>
	 * <p>方法备注: </p>
	 * @param userRole
	 * @return int
	 */
	public int create(UserRole userRole);
	
	
	List<String> getRoleId(String userId);


	public int delete(String userRoleId);
	/**
	 * <p>方法描述: </p>
	 * <p>方法备注: </p>
	 * @param user
	 * @return List
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年3月8日 上午10:31:45</p>
	 */
	public List<Role> getRoleListByUserId(CommonUser user);
	/**
	 * <p>方法描述: </p>
	 * <p>方法备注: </p>
	 * @param username
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年3月8日 上午10:49:36</p>
	 */
	public List<String> getRoleTypeListByUsername(String username);
	/**
	 * <p>方法描述: </p>
	 * <p>方法备注: </p>
	 * @param username
	 * @return List
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年3月8日 上午11:08:07</p>
	 */
	public List<Role> getRoleListByUser(String username);

    
	public List<Role> getRoleListByUserId(String userId);
	
	
}
