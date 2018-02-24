package com.github.wangdasong.scwauthserver.dao.persistence;


import com.github.wangdasong.scwauthserver.dao.entity.Role;
import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;

import java.util.List;

public interface RoleMapper extends BaseDaoMapper<Role> {
	
	
	void save(Role Role);
	void update(Role Role);
	
	
	/**
	 * 
	 * <p>方法描述: 通过id来查询某一条Role记录</p>
	 * <p>方法备注: </p>
	 * @param id
	 * @return Role
	 */
	Role getById(String id);
	
	/**
	 * 
	 * <p>方法描述: 通过id来删除某一条Role记录</p>
	 * <p>方法备注: </p>
	 * @param id
	 * @return int
	 */
	int deleteById(String id);
	
	
	
	
	/**
	 * 获取角色集合
	 * @param pagination
	 * @return 某页角色集合
	 */
	List<Role> findPageData(Pagination pagination);
	
	/**
	 * <p>方法描述: 有返回值的更新</p>
	 * <p>方法备注: 有返回值可判断是否更新成功</p>
	 * @param Role
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年2月23日 上午10:01:31</p>
	 */
	int updateById(Role Role);
	
	
	
	List<Role> findAll();
	
	
	
	
	/**
	 * <p>方法描述: 创建一个新角色</p>
	 * <p>方法备注: 有返回值的方式，无返回值使用默认的save即可</p>
	 * @param role
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年2月23日 下午1:23:46</p>
	 */
	int createRole(Role role);
	
	
	
	

}

