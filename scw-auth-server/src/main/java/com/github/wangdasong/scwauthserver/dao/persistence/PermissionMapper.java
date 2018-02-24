package com.github.wangdasong.scwauthserver.dao.persistence;

import com.github.wangdasong.scwauthserver.dao.entity.Permission;
import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;

import java.util.List;

public interface PermissionMapper extends BaseDaoMapper<Permission> {

	int deleteById(String id);
	void save(Permission permission);
	void update(Permission permission);
	List<Permission> findPageData(Pagination pagination);
	
	
	
	
	/**
	 * 
	 * <p>方法描述: 通过id来查询某一条Permission记录</p>
	 * <p>方法备注: </p>
	 * @param id
	 * @return Permission
	 */
	Permission getById(String id);


	/**
	 * <p>方法描述: 获取全部权限列表</p>
	 * <p>方法备注: </p>
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年2月23日 下午5:22:27</p>
	 */
	List<Permission> findAll();

	
	/**
	 * <p>方法描述: 新增权限、创建权限</p>
	 * <p>方法备注: 有返回值的</p>
	 * @param permission
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年2月23日 下午6:01:11</p>
	 */
	int createPermission(Permission permission);


	/**
	 * <p>方法描述: 更新权限、编辑权限</p>
	 * <p>方法备注: 有返回值的</p>
	 * @param permission
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年2月24日 上午10:19:34</p>
	 */
	int updateById(Permission permission);

}

