package com.github.wangdasong.scwauthserver.service;


import com.github.wangdasong.scwauthserver.dao.entity.PermissionResource;
import com.github.wangdasong.scwauthserver.dao.entity.Resource;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;

import java.util.List;
import java.util.Set;

public interface PermissionResourceService {
	/** 
	 * 获取用户-角色桥表列表
	 * @param pageNo 页数
	 * @param size 每页多少条记录
	 * @param sort 排序条件
	 * @param pres 查询条件
	 * @return Pagination
	 */
	public Pagination getPermissionResourcePage(int pageNo, int size, String sort, PermissionResource pres);
	public void edit(PermissionResource pres);
	public void add(PermissionResource pres);
	public void del(String roleResId);
	public void delByPermissionId(String permissionId);
	
	
	
	/**
	 * <p>方法描述: 创建新 用户-角色桥表 关联</p>
	 * <p>方法备注: </p>
	 * @param pres
	 * @return
	 */
	public int create(PermissionResource pres);
	/**
	 * <p>方法描述: </p>
	 * <p>方法备注: </p>
	 * @param pid
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年3月6日 上午11:18:07</p>
	 */
	public List<Resource> getResourceByPid(String pid);
	/**
	 * <p>方法描述: </p>
	 * <p>方法备注: </p>
	 * @param resourceIdSet
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间：2017年3月6日 上午11:22:12</p>
	 */
	public Set<String> findPermissionsByResourceId(Set<String> resourceIdSet);
	

    
	
	
}
