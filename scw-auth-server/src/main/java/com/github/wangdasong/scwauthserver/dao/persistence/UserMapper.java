package com.github.wangdasong.scwauthserver.dao.persistence;

import com.github.wangdasong.scwauthserver.dao.entity.CommonUser;
import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;

import java.util.List;

public interface UserMapper extends BaseDaoMapper<CommonUser> {

	/**
	 * 获取用户总数目
	 * @param pagination
	 * @return int
	 */
	int getCount(Pagination pagination);

	/**
	 * 获取某一页用户的集合
	 * @param pagination
	 * @return 某页用户集合
	 */
	List<CommonUser> findPageData(Pagination pagination);
	
	/**
	 * 
	 * <p>方法描述: 根据username和password来查询User信息</p>
	 * <p>方法备注: </p>
	 * @param user
	 * @return
	 */
	CommonUser selectByUsernamePassword(CommonUser user);

	/**
	 * <p>方法描述: 根据username查询User信息</p>
	 * <p>方法备注: </p>
	 * @param username
	 * @return
	 */
	CommonUser selectByUsername(String username);
	

	/**
	 * <p>方法描述: 用户注册功能</p>
	 * <p>方法备注: </p>
	 * @param user
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年1月22日 上午11:54:46</p>
	 */
	int createUser(CommonUser user);
	
	
	int editPwd(CommonUser user);

	
}

