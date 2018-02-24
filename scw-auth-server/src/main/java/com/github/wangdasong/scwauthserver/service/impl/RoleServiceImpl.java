/**
 * 
 */
package com.github.wangdasong.scwauthserver.service.impl;

import com.github.wangdasong.scwauthserver.dao.entity.Role;
import com.github.wangdasong.scwauthserver.dao.persistence.RoleMapper;
import com.github.wangdasong.scwauthserver.service.RoleService;
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
 * <P>类名称：RoleServiceImpl</P>
 * *********************************<br>
 * <P>类描述：</P>
 * 创建人：wenjie.zhu<br>
 * 创建时间：2017年2月20日 上午10:01:32<br>
 * 修改人：wenjie.zhu<br>
 * 修改时间：2017年2月20日 上午10:01:32<br>
 * 修改备注：<br>
 * @version 1.0<br>    
 */
@Service
public class RoleServiceImpl extends BaseServiceImpl<Role> implements DataSrcService<Role>, RoleService, TablePagingService {
	@Autowired
	private RoleMapper roleMapper;
	
	
	
	
	@Override
	public int getCount(Pagination page) {
		return roleMapper.getCount(page);
	}


	@Override
	public List<Role> findPageData(Pagination page) {
		List<Role> roleList = roleMapper.findPageData(page);
		return roleList;
	}


	@Override
	public List<Role> findAll() {
		List<Role> roleList = roleMapper.findAll();
		return roleList;
	}
	
	
	@Override
	public int createRole(Role role) {
		
		return roleMapper.createRole(role);
	}

	
	@Override
	public Role findById(String id) {
		return roleMapper.getById(id);
	}

	
	@Override
	public int updateRole(Role role) {
		return roleMapper.updateById(role);
	}
	
	

	@Override
	public int lockRole(String id) {
		Role role = new Role();
		role.setId(id);
		//state，状态为，0为可用，1为禁用。默认为0
		role.setState((short) 1);
		int flag = roleMapper.updateById(role);
		return 0;
	}


	@Override
	public Pagination getRolePage(int pageNo, int size, String sort, Role role) {
		Pagination pr = new Pagination(pageNo, size, sort, this);
		try {
			pr.doPage(role);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return pr;
	}
	
	@Override
	public List<DataSrcEntity> getDataSrcListByCondition(Role t) {
		List<Role> roleList = roleMapper.getListByCondition(t);
		List<DataSrcEntity> dataSrcEntityList = new ArrayList<DataSrcEntity>();
		for(Role currRole : roleList){
			DataSrcEntity currrDataSrcEntity = new DataSrcEntity();
			currrDataSrcEntity.setId(currRole.getId());
			currrDataSrcEntity.setLabel(currRole.getRoleName());
			currrDataSrcEntity.setValue(currRole.getId());
			dataSrcEntityList.add(currrDataSrcEntity);
		}
		return dataSrcEntityList;
	}

	@Override
	public void addRole(Role role) {
		roleMapper.save(role);
		
	}

	@Override
	public void editRole(Role role) {
		roleMapper.update(role);
	}


	@Override
	public void delRole(String roleId) {
		roleMapper.deleteById(roleId);
		
	}


	@Override
	public BaseDaoMapper<Role> getCurrDaoMapper() {
		return roleMapper;
	}


}
