package com.github.wangdasong.scwauthserver.dao.persistence;

import com.github.wangdasong.scwauthserver.dao.entity.PermissionResource;
import com.github.wangdasong.scwauthserver.dao.entity.Resource;
import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;

import java.util.List;

public interface PermissionResourceMapper extends BaseDaoMapper<PermissionResource> {

	PermissionResource getById(String id);
	int deleteById(String id);
	int deleteByPermissionId(String permissionId);
	void save(PermissionResource PermissionResource);
	void update(PermissionResource PermissionResource);
	List<PermissionResource> findPageData(Pagination pagination);

	
	
	
	
	
	/**
	 * <p>方法描述: </p>
	 * <p>方法备注: </p>
	 * @param pid
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年2月24日 下午1:43:09</p>
	 */
	List<Resource> getResourceList(String pid);
	/**
	 * <p>方法描述: </p>
	 * <p>方法备注: </p>
	 * @param rid
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年2月24日 下午5:29:04</p>
	 */
	List<String> getPermissionByResId(String rid);
	/**
	 * <p>方法描述: </p>
	 * <p>方法备注: </p>
	 * @param pr
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年3月3日 上午11:28:54</p>
	 */
	int create(PermissionResource pr);
	
	
	
}

