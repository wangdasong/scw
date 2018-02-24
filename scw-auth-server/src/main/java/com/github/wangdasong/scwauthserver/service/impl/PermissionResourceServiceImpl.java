/**
 * 
 */
package com.github.wangdasong.scwauthserver.service.impl;

import com.github.wangdasong.scwauthserver.dao.entity.Permission;
import com.github.wangdasong.scwauthserver.dao.entity.PermissionResource;
import com.github.wangdasong.scwauthserver.dao.entity.Resource;
import com.github.wangdasong.scwauthserver.dao.persistence.PermissionMapper;
import com.github.wangdasong.scwauthserver.dao.persistence.PermissionResourceMapper;
import com.github.wangdasong.scwauthserver.dao.persistence.ResourceMapper;
import com.github.wangdasong.scwauthserver.service.PermissionResourceService;
import com.github.wangdasong.scwbasecore.dao.entity.base.AdditionalParameters;
import com.github.wangdasong.scwbasecore.dao.entity.base.DataSrcEntity;
import com.github.wangdasong.scwbasecore.dao.entity.base.TreeDataEntity;
import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.service.base.DataSrcService;
import com.github.wangdasong.scwbasecore.service.base.TreeDataService;
import com.github.wangdasong.scwbasecore.service.impl.BaseServiceImpl;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwbasecore.utils.paging.TablePagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * 项目名称：finance<br>
 * *********************************<br>
 * <P>类名称：UserRoleServiceImpl</P>
 * *********************************<br>
 * <P>类描述：</P>
 * 创建人：wenjie.zhu<br>
 * 创建时间：2017年3月6日 上午9:41:49<br>
 * 修改人：wenjie.zhu<br>
 * 修改时间：2017年3月6日 上午9:41:49<br>
 * 修改备注：<br>
 * @version 1.0<br>    
 */

@Service
public class PermissionResourceServiceImpl extends BaseServiceImpl<PermissionResource> implements DataSrcService<PermissionResource>, TreeDataService<PermissionResource>, PermissionResourceService, TablePagingService {
	@Autowired
	private PermissionResourceMapper presMapper;
	
	@Autowired
	private PermissionMapper pMapper;
	
	@Autowired
	private ResourceMapper resMapper;
	
		
	
	
	@Override
	public BaseDaoMapper<PermissionResource> getCurrDaoMapper() {
		return presMapper;
	}
	
	
	@Override
	public int getCount(Pagination page) {
		return presMapper.getCount(page);
	}
	
	
	
	@Override
	public List findPageData(Pagination page) {
		List roleResList = presMapper.findPageData(page);
		return roleResList;
	}

	
	@Override
	public Pagination getPermissionResourcePage(int pageNo, int size, String sort, PermissionResource pres) {
		Pagination pr = new Pagination(pageNo, size, sort, this);
		try {
			pr.doPage(pres);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return pr;
	}

	
	
	@Override
	public List<DataSrcEntity> getDataSrcListByCondition(PermissionResource t) {
		List<PermissionResource> userRoleList = presMapper.getListByCondition(t);
		List<DataSrcEntity> dataSrcEntityList = new ArrayList<DataSrcEntity>();
		for(PermissionResource curr : userRoleList){
			DataSrcEntity currrDataSrcEntity = new DataSrcEntity();
			currrDataSrcEntity.setId(curr.getId());
			currrDataSrcEntity.setLabel(curr.getPermissionId());
			currrDataSrcEntity.setValue(curr.getResourceId());
			dataSrcEntityList.add(currrDataSrcEntity);
		}
		return dataSrcEntityList;
	}

	
	



	@Override
	public void edit(PermissionResource pres) {
		presMapper.update(pres);
	}

	@Override
	public void add(PermissionResource pres) {
		presMapper.save(pres);
		
	}


	@Override
	public void del(String Id) {
		presMapper.deleteById(Id);
	}

	@Override
	public int create(PermissionResource pres) {
		return presMapper.create(pres);
	}


	@Override
	@Transactional
	public List<Resource> getResourceByPid(String pid) {
		List<Resource> resourceList = presMapper.getResourceList(pid);
		return resourceList;
	}


	@Override
	public Set<String> findPermissionsByResourceId(Set<String> resourceIdSet) {
		Set<String> retPermissionSet = new HashSet<String>();
    	List<String> permissionStrList = new ArrayList<String>();
    
    	for (String rid : resourceIdSet) {
    		permissionStrList = presMapper.getPermissionByResId(rid);
    		for (String pid : permissionStrList) {
    			Permission permission = pMapper.getById(pid);
				retPermissionSet.add(permission.getPermission());
			}
		}
    	return retPermissionSet;
	}


	@Override
	public TreeDataEntity getTreeDataListByParentId(String parentId,
													PermissionResource permissionResource) {
//        Subject currentUser = SecurityUtils.getSubject();
//        boolean isSysadmin = false;
//        if(currentUser != null){
//            isSysadmin = currentUser.hasRole("sysadmin");
//        }
		Resource resource = new Resource();
		resource.setParentId(parentId);
		resource.setPermissionId(permissionResource.getPermissionId());
		List<Resource> resources = resMapper.getListByCondition(resource);
		Resource parentResource = resMapper.getById(parentId);
		List<TreeDataEntity> children = new ArrayList<TreeDataEntity>();
		for(Resource subResource : resources){
			TreeDataEntity treeDataEntitySub = new TreeDataEntity();
			AdditionalParameters additionalParameters = new AdditionalParameters();
			if(subResource.getSubCount() != null && subResource.getSubCount() > 0){
				treeDataEntitySub.setTypeEnum(TreeDataEntity.TypeEnum.FOLDER);				
			}else{
				treeDataEntitySub.setTypeEnum(TreeDataEntity.TypeEnum.ITEM);
			}
			treeDataEntitySub.setName(subResource.getCode() + ":" + subResource.getName());
			additionalParameters.setId(subResource.getId());
			additionalParameters.setItemSelected(subResource.getHasRes());
			treeDataEntitySub.setAdditionalParameters(additionalParameters);
			children.add(treeDataEntitySub);
		}
		TreeDataEntity treeDataEntity = new TreeDataEntity();
		AdditionalParameters additionalParameters = new AdditionalParameters();
		treeDataEntity.setTypeEnum(TreeDataEntity.TypeEnum.FOLDER);
		if(parentResource == null){
			treeDataEntity.setName("");
			additionalParameters.setId("");
		}else{
			treeDataEntity.setName(parentResource.getCode() + ":" + parentResource.getName());
			additionalParameters.setId(parentId);
		}
		additionalParameters.setChildren(children);
		additionalParameters.setItemSelected(true);
		treeDataEntity.setAdditionalParameters(additionalParameters);
		return treeDataEntity;
	}


	@Override
	public void delByPermissionId(String permissionId) {
		presMapper.deleteByPermissionId(permissionId);
	}








}
