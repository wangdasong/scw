package com.github.wangdasong.scwauthserver.service;


import com.github.wangdasong.scwauthserver.dao.entity.Role;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;

import java.util.List;

public interface RoleService{
	
	Pagination getRolePage(int pageNumber, int pageSize, String pageSort, Role role);
	public void addRole(Role role);
	public void editRole(Role role);
	public void delRole(String roleId);
	
	
	/**
	 * <p>方法描述: 逻辑删除角色，即将state标志位置为1</p>
	 * <p>方法备注: </p>
	 * @param id
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年2月22日 下午5:59:56</p>
	 */
	int lockRole(String id);
	
	
	
	
	/**
	 * <p>方法描述: 查询角色列表</p>
	 * <p>方法备注: 方式一，直接返回List</p>
	 * @return
	 */
	List<Role> findAll();
	
	



	
	
	
	
	
	/**
	 * <p>方法描述: </p>
	 * <p>方法备注: </p>
	 * @param id
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年2月17日 下午4:30:35</p>
	 */
	Role findById(String id);
	
	

	/**
	 * <p>方法描述: </p>
	 * <p>方法备注: </p>
	 * @param role
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年2月17日 下午4:29:56</p>
	 */
	int createRole(Role role);


	/**
	 * <p>方法描述: </p>
	 * <p>方法备注: </p>
	 * @param role
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年2月17日 下午4:31:40</p>
	 */
	int updateRole(Role role);
	
	




	 
}  