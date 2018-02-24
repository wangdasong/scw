package com.github.wangdasong.scwauthserver.controller;

import com.alibaba.druid.support.logging.Log;
import com.alibaba.druid.support.logging.LogFactory;
import com.github.wangdasong.scwauthserver.dao.entity.CommonUser;
import com.github.wangdasong.scwauthserver.dao.entity.Permission;
import com.github.wangdasong.scwauthserver.dao.entity.PermissionResource;
import com.github.wangdasong.scwauthserver.dao.entity.RolePermission;
import com.github.wangdasong.scwauthserver.service.PermissionResourceService;
import com.github.wangdasong.scwauthserver.service.PermissionService;
import com.github.wangdasong.scwauthserver.service.RolePermissionService;
import com.github.wangdasong.scwbasecore.controller.base.BaseController;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwbasecore.utils.result.ResultString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 视图控制�?,返回视图给前�?
 **/
@Controller
@RequestMapping("/permission")
public class PermissionController  extends BaseController {

	@Autowired
	PermissionService pService;
	@Autowired
	RolePermissionService rpService;
	@Autowired
	PermissionResourceService presService;
	
	private Log logger = LogFactory.getLog(super.getClass());
	
	

	  
    /**
     * 
     * <p>方法描述: 获取某一角色的权限列�?</p>
     * <p>方法备注: 修改/删除某一角色的权限时，一定会在页面显示出权限的ID�?
     * 					�?以直接调用本类中的修�?/删除方法即可</p>
     * @param roleId
     * @return
     */
	@RequestMapping(value = "/getPermissionByRoleId")
	@Transactional
	@ResponseBody
	public List<Permission> getPermissionByRoleId(String roleId){
		logger.debug("class:PermissionController method:getPermissionByRoleId(String roleId) ");
		List<Permission> permissionList = rpService.getPermissionListByRoleId(roleId);
		return permissionList;
		
	}
	

	/**
	 * 
	 * <p>方法描述: 根据某一用户名username来获取其权限List</p>
	 * <p>方法备注: </p>
	 * @param username
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间�?2017�?3�?2�? 下午5:21:24</p>
	 */
	@RequestMapping(value = "/getPermissionList")
	@Transactional
	@ResponseBody
	public List<Permission> getPermissionList(String username){
		logger.debug("class:PermissionController method:getPermissionList(String username) ");
		List<Permission> permissionList = new ArrayList<Permission>();
		
		permissionList = rpService.getPermissionList(username);
		
		return permissionList;
		
	}
	
	
	/**
	 * 桥表
	 * <p>方法描述: 角色与权限之间桥表的新增，创�?</p>
	 * <p>方法备注: 即创建一个角色权限之间的关系</p>
	 * @param roleIds
	 * @param ids
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间�?2017�?3�?3�? 上午11:26:06</p>
	 */
	@RequestMapping(value = "/addRolePermission")
    @ResponseBody
    public ResultString addRolePermission(String[] roleIds, String[] ids){
		
		for(String roleId : roleIds){
			for(String permissionId : ids){
				RolePermission rp = new RolePermission();
				rp.setRoleId(roleId);
				rp.setPermissionId(permissionId);
				rpService.add(rp);
			}
		}
		ResultString resultString = new ResultString("");
		resultString.setStatus(ResultString.RESULT_STATUS_SUCCESS);
		resultString.setMsg("权限添加成功�?");
		return resultString;
    }
    

	@RequestMapping(value = "/addres")
    @ResponseBody
    public ResultString addPermissionResources(String permissionId, String[] resourceIds){
		Date currDate = new Date();
		CommonUser user = (CommonUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String currUserId = user.getId();
		if(resourceIds != null && resourceIds.length > 0){
			presService.delByPermissionId(permissionId);
		}
		for(String resourceId : resourceIds){
			PermissionResource pres = new PermissionResource();
			pres.setCreateDate(currDate);
			pres.setCreateUserId(currUserId);
			pres.setPermissionId(permissionId);
			pres.setResourceId(resourceId);
			presService.add(pres);
		}
		ResultString resultString = new ResultString("");
		resultString.setStatus(ResultString.RESULT_STATUS_SUCCESS);
		resultString.setMsg("资源添加成功�?");
		return resultString;
    }
	/**
	 * 桥表  编辑
	 */
    @RequestMapping(value = "/editRolePermission")
    @ResponseBody
    public RolePermission editRolePermission(RolePermission rp){
    	rpService.edit(rp);
    	return rp;
    }
    
	
	/**
	 * 桥表  删除
	 */
    @RequestMapping(value = "/delRolePermission")
    @ResponseBody
    public RolePermission delRolePermission(RolePermission rp){
    	rpService.del(rp.getId());
    	return rp;
    }
	
	
    /**
     * 桥表 查询
     */
    @RequestMapping(value = "/listRolePermission")
	public Pagination findRolePermissionPage(Pagination page, String[] ids){
		Pagination rePage = null;
		if(ids == null || ids.length == 0){
			return rePage;
		}
		String roleId = ids[0];
		RolePermission rp = new RolePermission();
		rp.setRoleId(roleId);
		rePage = rpService.getRolePermissionPage(page.getPageNumber(), page.getPageSize(),page.getPageSort(),rp);
		return rePage;
	}
	
	
	
	
	
	
	
    
    /**
     * <p>方法描述: 查询权限列表（全部）</p>
     * <p>方法备注: 方式�?，直接返回List<Role></p>
     * @param 
     * @return
     */
    @RequestMapping(value = "/view", method = RequestMethod.POST)
    public List<Permission> list() {
        List<Permission> permissionList = new ArrayList<Permission>();
        permissionList = pService.findAll();
        return permissionList;
    }
    

    
    
    
    /**
     * <p>方法描述: 查询权限列表/构�?�页面请�?</p>
     * <p>方法备注: 方式二，大嵩前台�?�?要的分页及数据形�?</p>
     * @param 
     * @return
     */
    @RequestMapping(value = "/list")
	public Pagination findPermissionPage(Pagination page, Permission permission){
		Pagination rePage = null;
		rePage = pService.getPermissionPage(page.getPageNumber(), page.getPageSize(),page.getPageSort(),permission);
		return rePage;
	}
    
    /**
     * <p>方法描述: 查询权限列表/构�?�页面请�?</p>
     * <p>方法备注: 方式二，大嵩前台�?�?要的分页及数据形�?</p>
     * @param 
     * @return
     */
    @RequestMapping(value = "/perlist")
	public Pagination findPermissionPageByRoleId(Pagination page, String[] ids){
		Pagination rePage = null;
		String roleId = ids[0];
		Permission permission = new Permission();
		permission.setRoleId(roleId);
		rePage = pService.getPermissionPage(page.getPageNumber(), page.getPageSize(), page.getPageSort(), permission);
		return rePage;
	}
    
    
    /*
	*//**
	 * 导出页面请求
	 *//*
	@RequestMapping(value = "/export")
	public void exportPermissionPage(HttpServletResponse response, Pagination page, String[] ids, String tableId, Permission permission){
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
			permission.setId(idStr);
		}
		rePage = pService.getPermissionPage(1, 10000, null, permission);
		HSSFWorkbook wkb = pService.exportData((List<Permission>) rePage.getList(), tableId);
		//处理Excel响应
		responseObject(response, wkb);
	}
	*/
	
	/**
	 * 批量删除请求
	 */
	@RequestMapping(value = "/permissionbatdel")
	@ResponseBody
	public Pagination batDel(Pagination page, Permission permission, String[] ids){
		Pagination rePage = null;
		for(String id : ids){
			System.out.println("id = "+ id);
		}
		rePage = pService.getPermissionPage(page.getPageNumber(), page.getPageSize(),page.getPageSort(), permission);
		return rePage;
	}
    
    
    
    
    
    

    /**
     * 
     * <p>方法描述: 权限创建，新增权�?</p>
     * <p>方法备注: </p>
     * @param permission
     * @return
     */
    @RequestMapping(value = "/create")
    @ResponseBody
    public ResultString create(Permission permission) {
    	logger.debug("class:PermissionController method:create(Permission permission) ");
    	ResultString resultString = new ResultString("");
    	//初始化返回标志位为失�?
    	resultString.setStatus(ResultString.RESULT_STATUS_FAILED);
    	resultString.setData("failed");
    	int flag = pService.createPermission(permission);
    	if (flag>0) {
    		resultString.setStatus(ResultString.RESULT_STATUS_SUCCESS);
        	resultString.setData("success");
		}
        return resultString;
    }
    
    
    /**
     * <p>方法描述: 新增权限   方法�?</p>
     * <p>方法备注: 大嵩版前台页面所�?新增权限方法</p>
     * @param permission
     * @return
     */
    @RequestMapping(value = "/add")
    @ResponseBody
    public Permission add(Permission permission){
    	if("".equals(permission.getId())){
    		permission.setId(null);
    	}
    	pService.add(permission);
		return permission;
    }

    /**
     * 
     * <p>方法描述: 权限更新，编辑权�?</p>
     * <p>方法备注: </p>
     * @param permission
     * @return
     */
    @RequestMapping(value = "/update")
    @ResponseBody
    public ResultString update(Permission permission) {
    	ResultString resultString = new ResultString("");
    	//初始化返回标志位为失�?
    	resultString.setStatus(ResultString.RESULT_STATUS_FAILED);
    	resultString.setData("failed");
    	int flag = pService.update(permission);
    	if (flag>0) {
    		resultString.setStatus(ResultString.RESULT_STATUS_SUCCESS);
        	resultString.setData("success");
		}
        return resultString;
    }
    
    /**
     * <p>方法描述: 编辑权限   方法�?</p>
     * <p>方法备注: 大嵩版前台页面所�?编辑权限方法</p>
     * @param permission
     * @return
     */
    @RequestMapping(value = "/edit")
    @ResponseBody
    public Permission edit(Permission permission){
    	pService.edit(permission);
    	return permission;
    }
    



    /**
     * <p>方法描述: 删除角色</p>
     * <p>方法备注: 逻辑删除，修改state标志位为1</p>
     * @param id
     * @return
     */
    @RequestMapping(value = "/del")
    @ResponseBody
    public ResultString delete(String id) {
    	ResultString resultString = new ResultString("");
    	try{
    		//删除关系�?
        	presService.delByPermissionId(id);
        	//删除权限
        	pService.del(id);
    	}catch(Exception e){
        	//初始化返回标志位为失�?
        	resultString.setStatus(ResultString.RESULT_STATUS_FAILED);
        	resultString.setData("failed"); 
            return resultString;   		
    	}
		resultString.setStatus(ResultString.RESULT_STATUS_SUCCESS);
    	resultString.setData("success");
        return resultString;
    }
    

    /**
     * <p>方法描述: 删除权限   物理删除  方式�?</p>
     * <p>方法备注: 大嵩版前台页面所�?删除权限方法</p>
     * @param permission
     * @return permission
     */
 /*   @RequestMapping(value = "/del")
    @ResponseBody
    public Permission del(Permission permission){
    	pService.del(permission.getId());
    	return permission;
    }*/







	



}