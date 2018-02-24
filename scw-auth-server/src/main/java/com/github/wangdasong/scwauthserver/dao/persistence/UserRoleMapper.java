package com.github.wangdasong.scwauthserver.dao.persistence;


import com.github.wangdasong.scwauthserver.dao.entity.UserRole;
import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;

import java.util.List;

public interface UserRoleMapper extends BaseDaoMapper<UserRole> {
	/**
	 * <p>方法描述: 通过User表的主键ID查询所有关联的角色表的主键ID</p>
	 * <p>方法备注: </p>
	 * @param userId
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年2月23日 下午3:05:19</p>
	 */
	List<String> getRoleId(String userId);
	
	
	/**
	 * 
	 * <p>方法描述: 通过id来查询某一条UserRole记录</p>
	 * <p>方法备注: </p>
	 * @param id
	 * @return UserRole
	 */
	UserRole getById(String id);
	
	/**
	 * 
	 * <p>方法描述: 通过id来删除某一条UserRole记录</p>
	 * <p>方法备注: </p>
	 * @param id
	 * @return int
	 */
	int deleteById(String id);
	
	
	/**
	 * 
	 * <p>方法描述: 保存一条UserRole记录</p>
	 * <p>方法备注: </p>
	 * @param userRole
	 * @return
	 */
	void save(UserRole userRole);
	
	/**
	 * 
	 * <p>方法描述: 更新一条UserRole记录</p>
	 * <p>方法备注: </p>
	 * @param userRole
	 * @return
	 */
	void update(UserRole userRole);
	
	
	/**
	 * 获取某一页用户角色UserRole的集合
	 * @param pagination
	 * @return 某页用户角色UserRole集合
	 */
	List<UserRole> findPageData(Pagination pagination);
	
	
	/**
	 * 
	 * <p>方法描述: 有返回值的创建</p>
	 * <p>方法备注: </p>
	 * @param userRole
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年3月3日 上午11:15:07</p>
	 */
	int create(UserRole userRole);
	
	/**
	 * <p>方法描述: 通过User表的主键ID查询所有关联的角色表的主键ID</p>
	 * <p>方法备注: </p>
	 * @param userId
	 * @return
	 * <p>创建人：郑鹏</p>
	 * <p>创建时间：2017年4月1日 上午11:05:19</p>
	 */
	List<String> getUserRole(String userId);


}

