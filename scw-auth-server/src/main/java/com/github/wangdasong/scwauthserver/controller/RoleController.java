package com.github.wangdasong.scwauthserver.controller;

import com.alibaba.druid.support.logging.Log;
import com.alibaba.druid.support.logging.LogFactory;
import com.github.wangdasong.scwauthserver.dao.entity.CommonUser;
import com.github.wangdasong.scwauthserver.dao.entity.Role;
import com.github.wangdasong.scwauthserver.dao.entity.UserRole;
import com.github.wangdasong.scwauthserver.service.RolePermissionService;
import com.github.wangdasong.scwauthserver.service.RoleService;
import com.github.wangdasong.scwauthserver.service.UserRoleService;
import com.github.wangdasong.scwbasecore.controller.base.BaseController;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwbasecore.utils.result.ResultString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * 视图控制�?,返回视图给前�?
 **/
@Controller
@RequestMapping("/role")
public class RoleController extends BaseController {
	
    @Autowired
    private RoleService roleService;

    @Autowired
    private UserRoleService userRoleService;
    
    @Autowired
    private RolePermissionService rpService;
    
    private Log logger = LogFactory.getLog(super.getClass());


    
	  
    /**
     * 
     * <p>方法描述: 获取某一用户的角色列表（即根据用户查询角色功能）</p>
     * <p>方法备注: 修改/删除某一用户的某�?特定角色时，�?定会在页面显示出角色的ID�?
     * 					�?以直接调用RoleController中的修改/删除方法即可</p>
     * @param user
     * @return
     */
	@RequestMapping(value = "/getUserRole")
	@Transactional
	@ResponseBody
	public List<Role> getRoleByUserId(CommonUser user){
		logger.debug("class:RoleController method:getRoleByUserId(User user)");
		List<Role> roleList = userRoleService.getRoleListByUserId(user);
		
		return roleList;
		
	}
	
	
	/**
	 * <p>方法描述: 根据username获取某一用户的角色列表List</p>
	 * <p>方法备注: 根据用户查询角色列表中的角色类型（SYS_ROLE表中的ROLE_TYPE字段的List集合�?
	 * 
	 * 				另一种Set集合可以参�?�LoginService(LoginController)中的findPermissionsByUname方法</p>
	 * @param username
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间�?2017�?2�?28�? 下午3:35:32</p>
	 */
	@RequestMapping(value = "/getRoleTypeList")
	@Transactional
	@ResponseBody
	public List<String> getRoleTypeList(String username){
		logger.debug("class:RoleController method:getRoleTypeList(String username)");
		List<String> roleTypeList = userRoleService.getRoleTypeListByUsername(username);
		
		return roleTypeList;
	}
	
	
	/**
	 * 
	 * <p>方法描述:根据某一username用户名，获取其所有角色列表List </p>
	 * <p>方法备注: </p>
	 * @param username
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间�?2017�?3�?2�? 下午5:22:53</p>
	 */
	@RequestMapping(value = "/getRoleList")
	@Transactional
	@ResponseBody
	public List<Role> getRoleList(String username){
		logger.debug("class:RoleController method:getRoleList(String username)");
		List<Role> roleList = userRoleService.getRoleListByUser(username);
		
		return roleList;
		
	}
	
	
	//由权限反推角�?
    public Set<String> findRoleByPid(Set<String> permissionIdSet){
    	logger.debug("class:RoleController method:findRoleByPid(Set<String> permissionIdSet)");
    	Set<String> retRoleSet = rpService.findRoleByPid(permissionIdSet);
    	
    	return retRoleSet;
    }
    
    /**
     * <p>方法描述: 查询角色列表（全部）</p>
     * <p>方法备注: 方式�?，直接返回List<Role></p>
     * @param 
     * @return
     */
    @RequestMapping(value = "/view", method = RequestMethod.POST)
    @ResponseBody
    public List<Role> list() {
    	logger.debug("class:RoleController method:list()");
        List<Role> roleList = new ArrayList<Role>();
        roleList = roleService.findAll();
        return roleList;
    }
    
    /**
     * <p>方法描述: 查询角色列表/构�?�页面请�?</p>
     * <p>方法备注: 方式二，大嵩前台�?�?要的分页及数据形�?</p>
     * @param 
     * @return
     */
    @RequestMapping(value = "/list")
    @ResponseBody
	public Pagination findRolePage(Pagination page, Role role){
		Pagination rePage = null;
		rePage = roleService.getRolePage(page.getPageNumber(), page.getPageSize(),page.getPageSort(),role);
		return rePage;
	}
    
    
  /*
	*//**
	 * 导出页面请求
	 *//*
	@RequestMapping(value = "/export")
	public void exportRolePage(HttpServletResponse response, Pagination page, String[] ids, String tableId, Role role){
		Pagination rePage = null;
		//如果输入为�?�中的表格行
		if(ids != null){
			String idStr = "";
			for(String currId : ids){
				idStr = idStr + "," + currId;
			}
			if(idStr.length() > 1){
				idStr = idStr.substring(1);
			}
			role.setId(idStr);
		}
		rePage = roleService.getRolePage(1, 10000, null, role);
		HSSFWorkbook wkb = roleService.exportData((List<Role>) rePage.getList(), tableId);
		//处理Excel响应
		responseObject(response, wkb);
	}
	*/
	
	/**
	 * 批量删除请求
	 */
	@RequestMapping(value = "/rolebatdel")
	@ResponseBody
	public Pagination batDel(Pagination page, Role role, String[] ids){
		Pagination rePage = null;
		for(String id : ids){
			System.out.println("id = "+ id);
		}
		rePage = roleService.getRolePage(page.getPageNumber(), page.getPageSize(),page.getPageSort(), role);
		return rePage;
	}
	/**
	 * 桥表 创建
	 * <p>方法描述: 创建用户与角色的关联</p>
	 * <p>方法备注: 即数据库中SYS_USER表与SYS_ROLE表之间的桥表SYS_USER_ROLE的创�?</p>
	 * @param ur
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间�?2017�?3�?3�? 上午11:21:43</p>
	 */
    @RequestMapping(value = "/addUserRole")
    @ResponseBody
    public UserRole addUserRole(UserRole ur){
    	if("".equals(ur.getId())){
    		ur.setId(null);
    	}
    	userRoleService.addUserRole(ur);
		return ur;
    }
    
    
    
    
	/**
	 * 桥表   编辑更新修改
	 * <p>方法描述: 编辑用户与角色的关联</p>
	 * <p>方法备注: 即数据库中SYS_USER表与SYS_ROLE表之间的桥表SYS_USER_ROLE的编�?</p>
	 * @param ur
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间�?2017�?3�?3�? 上午11:21:43</p>
	 */
    @RequestMapping(value = "/editUserRole")
    @ResponseBody
    public UserRole editUserRole(UserRole ur){
    	userRoleService.editUserRole(ur);
    	return ur;
    }
    
	/**
	 * 桥表   删除
	 * <p>方法描述: 删除用户与角色的关联</p>
	 * <p>方法备注: 即数据库中SYS_USER表与SYS_ROLE表之间的桥表SYS_USER_ROLE的删�?</p>
	 * @param ur
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间�?2017�?3�?3�? 上午11:21:43</p>
	 */
    @RequestMapping(value = "/delUserRole")
    @ResponseBody
    public UserRole delUserRole(UserRole ur){
    	userRoleService.delUserRole(ur.getId());
    	return ur;
    }
    
    
    
    
    
	/**
	 * 桥表   查询
	 * <p>方法描述: 查询用户与角色的关联</p>
	 * <p>方法备注: 即数据库中SYS_USER表与SYS_ROLE表之间的桥表SYS_USER_ROLE的查�?</p>
	 * @param page
	 * @param ur
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间�?2017�?3�?3�? 上午11:21:43</p>
	 */
    @RequestMapping(value = "/listUserRole")
    @ResponseBody
	public Pagination findUserRolePage(Pagination page, UserRole ur){
		Pagination rePage = null;
		rePage = userRoleService.getUserRolePage(page.getPageNumber(), page.getPageSize(),page.getPageSort(),ur);
		return rePage;
	}
    

    /**
     * 
     * <p>方法描述: 角色创建，新增角�?</p>
     * <p>方法备注: </p>
     * @param role
     * @return
     */
    @RequestMapping(value = "/create")
    @ResponseBody
    public ResultString create(Role role) {
    	ResultString resultString = new ResultString("");
    	//初始化返回标志位为失�?
    	resultString.setStatus(ResultString.RESULT_STATUS_FAILED);
    	resultString.setData("failed");
    	//角色表创�?
    	int flag = roleService.createRole(role);
    	if (flag>0) {
    		resultString.setStatus(ResultString.RESULT_STATUS_SUCCESS);
        	resultString.setData("success");
		}
        return resultString;
    }
    
    
    /**
     * <p>方法描述: 新增角色   方法�?</p>
     * <p>方法备注: 大嵩版前台页面所�?新增角色方法</p>
     * @param role
     * @return
     */
    @RequestMapping(value = "/add")
    @ResponseBody
    public Role add(Role role){
    	if("".equals(role.getId())){
    		role.setId(null);
    	}
    	roleService.addRole(role);
		return role;
    }
    
    /**
     * 
     * <p>方法描述: 角色更新，编辑角�?</p>
     * <p>方法备注: </p>
     * @param role
     * @return
     */
    @RequestMapping(value = "/update")
    @ResponseBody
    public ResultString update(Role role) {
    	ResultString resultString = new ResultString("");
    	//初始化返回标志位为失�?
    	resultString.setStatus(ResultString.RESULT_STATUS_FAILED);
    	resultString.setData("failed");
    	int flag = roleService.updateRole(role);
    	if (flag>0) {
    		resultString.setStatus(ResultString.RESULT_STATUS_SUCCESS);
        	resultString.setData("success");
		}
        return resultString;
    }
    
    /**
     * <p>方法描述: 编辑角色   方法�?</p>
     * <p>方法备注: 大嵩版前台页面所�?编辑角色方法</p>
     * @param role
     * @return
     */
    @RequestMapping(value = "/edit")
    @ResponseBody
    public Role edit(Role role){
    	roleService.editRole(role);
    	return role;
    }
    



    /**
     * <p>方法描述: 删除角色</p>
     * <p>方法备注: 逻辑删除，修改state标志位为1</p>
     * @param id
     * @return
     */
    @RequestMapping(value = "/delete")
    @ResponseBody
    public ResultString delete(String id) {
    	ResultString resultString = new ResultString("");
    	//初始化返回标志位为失�?
    	resultString.setStatus(ResultString.RESULT_STATUS_FAILED);
    	resultString.setData("failed");
    	int flag = roleService.lockRole(id);
    	//物理删除
    	//roleService.deleteRoleById(id);
    	if (flag>0) {
    		resultString.setStatus(ResultString.RESULT_STATUS_SUCCESS);
        	resultString.setData("success");
		}
        return resultString;
    }
    
    
    /**
     * <p>方法描述: 删除角色   物理删除  方式�?</p>
     * <p>方法备注: 大嵩版前台页面所�?删除角色方法</p>
     * @param role
     * @return
     */
    @RequestMapping(value = "/del")
    @ResponseBody
    public Role del(Role role){
    	roleService.delRole(role.getId());
    	return role;
    }
 
}