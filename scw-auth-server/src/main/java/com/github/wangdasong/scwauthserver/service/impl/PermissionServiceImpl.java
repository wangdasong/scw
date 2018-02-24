/**
 * 
 */
package com.github.wangdasong.scwauthserver.service.impl;

import com.github.wangdasong.scwauthserver.dao.entity.Permission;
import com.github.wangdasong.scwauthserver.dao.persistence.PermissionMapper;
import com.github.wangdasong.scwauthserver.service.PermissionService;
import com.github.wangdasong.scwbasecore.dao.entity.base.DataSrcEntity;
import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.service.base.DataSrcService;
import com.github.wangdasong.scwbasecore.service.impl.BaseServiceImpl;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwbasecore.utils.paging.TablePagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 项目名称：finance<br>
 * *********************************<br>
 * <P>类名称：PermissionServiceImpl</P>
 * *********************************<br>
 * <P>类描述：</P>
 * 创建人：wenjie.zhu<br>
 * 创建时间：2017年2月20日 上午10:03:32<br>
 * 修改人：wenjie.zhu<br>
 * 修改时间：2017年2月20日 上午10:03:32<br>
 * 修改备注：<br>
 * @version 1.0<br>    
 */
@Service
public class PermissionServiceImpl extends BaseServiceImpl<Permission> implements DataSrcService<Permission>, PermissionService, TablePagingService {
	
	@Autowired
	PermissionMapper pMapper;
	


	@Override
	public int getCount(Pagination page) {
		return pMapper.getCount(page);
	}



	@Override
	public List<Permission> findAll() {
		return pMapper.findAll();
	}


	
	
	@Override
	public Permission findById(String id) {
		return pMapper.getById(id);
	}






	@Override
	public Pagination getPermissionPage(int pageNo, int size, String sort, Permission permission) {
		Pagination pr = new Pagination(pageNo, size, sort, this);
		try {
			pr.doPage(permission);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return pr;
	}



	@Override
	public List findPageData(Pagination page) {
		List<Permission> pList = pMapper.findPageData(page);
		return pList;
	}



	@Override
	public List<DataSrcEntity> getDataSrcListByCondition(Permission t) {
		List<Permission> pList = pMapper.getListByCondition(t);
		List<DataSrcEntity> dataSrcEntityList = new ArrayList<DataSrcEntity>();
		for(Permission currPermission : pList){
			DataSrcEntity currrDataSrcEntity = new DataSrcEntity();
			currrDataSrcEntity.setId(currPermission.getId());
			currrDataSrcEntity.setLabel(currPermission.getPermissionName());
			currrDataSrcEntity.setValue(currPermission.getId());
			dataSrcEntityList.add(currrDataSrcEntity);
		}
		return dataSrcEntityList;
	}



	@Override
	public BaseDaoMapper<Permission> getCurrDaoMapper() {
		return pMapper;
	}






	
	@Override
	public int createPermission(Permission permission) {
		return pMapper.createPermission(permission);
		
	}



	@Override
	public void add(Permission permission) {
		pMapper.save(permission);
		
	}



	@Override
	public void edit(Permission permission) {
		pMapper.update(permission);
		
	}


	@Override
	public void del(String id) {
		pMapper.deleteById(id);
		
	}



	@Override
	public int update(Permission permission) {
		return pMapper.updateById(permission);
	}



	/**
	 * 逻辑删除，修改标志位State为1，即锁定禁用状态。
	 */
	@Override
	public int lockPermission(String id) {
		Permission p = new Permission();
		p.setId(id);
		p.setState((short) 1);
		return pMapper.updateById(p);
	}







}
