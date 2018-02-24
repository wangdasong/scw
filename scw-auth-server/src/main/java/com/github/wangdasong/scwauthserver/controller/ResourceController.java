package com.github.wangdasong.scwauthserver.controller;

import com.alibaba.druid.support.logging.Log;
import com.alibaba.druid.support.logging.LogFactory;
import com.github.wangdasong.scwauthserver.dao.entity.PermissionResource;
import com.github.wangdasong.scwauthserver.dao.entity.Resource;
import com.github.wangdasong.scwauthserver.service.PermissionResourceService;
import com.github.wangdasong.scwauthserver.service.ResourceService;
import com.github.wangdasong.scwbasecore.controller.base.BaseController;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * 视图控制�?,返回视图给前�?
 **/
@Controller
@RequestMapping("/resource")
public class ResourceController extends BaseController {
	
	
	@Autowired
	ResourceService resourceService;
	
	@Autowired
	PermissionResourceService presService;
	
	private Log logger = LogFactory.getLog(super.getClass());
	
	
	  
    /**
     * 
     * <p>方法描述: 获取某一权限的资源列�?</p>
     * <p>方法备注: 修改/删除某一权限的资源时，一定会在页面显示出资源ID�?
     * 					�?以直接调用本类中的修�?/删除方法即可</p>
     * @param pid
     * @return
     */
	@RequestMapping(value = "/getResourceByPid")
	@Transactional
	@ResponseBody
	public List<Resource> getResourceByPid(String pid){
		logger.debug("class:ResourceController method:getResourceByPid(String pid)");
		List<Resource> resList = presService.getResourceByPid(pid);
				
		return resList;
		
	}

	
	/**
	 * <p>方法描述: 根据username获取资源对象的List</p>
	 * <p>方法备注: </p>
	 * @param username
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间�?2017�?2�?28�? 下午4:43:30</p>
	 */
	@RequestMapping(value = "/getResourceList")
	@Transactional
	@ResponseBody
	public List<Resource> getResourceList(String username){
		logger.debug("class:ResourceController method:getResourceList(String username)");
		List<Resource> retResList = resourceService.getResourceList(username);
		
		return retResList;
	}
	
	
	
	/**
	 * <p>方法描述: 根据username获取资源对象的Set，主要是RESOURCE_TYPE字段�?</p>
	 * <p>方法备注: </p>
	 * @param username
	 * @return
	 * <p>创建人：wenjie.zhu</p>
	 * <p>创建时间�?2017�?2�?28�? 下午4:43:50</p>
	 */
	@RequestMapping(value = "/getResourceSet")
	@Transactional
	@ResponseBody
	public Set<String> getResourceSet(String username){
		logger.debug("class:ResourceController method:getResourceSet(String username)");
		Set<String> resourceSet = resourceService.getResourceSet(username);
		
		return resourceSet;
	}
	
	
	
	//由资源反推权�?
	@RequestMapping(value = "/findPermissionsByResourceId")
	@Transactional
	@ResponseBody
    public Set<String> findPermissionsByResourceId(Set<String> resourceIdSet){
		logger.debug("class:ResourceController method:findPermissionsByResourceId(Set<String> resourceIdSet)");
    	Set<String> retPermissionSet = presService.findPermissionsByResourceId(resourceIdSet);
    			
    	return retPermissionSet;
    }
    
	
	
	
	
	
	/**
	 * 桥表   创建
	 */
	@RequestMapping(value = "/addPermissionResource")
    @ResponseBody
    public PermissionResource addPermissionResource(PermissionResource pres){
    	if("".equals(pres.getId())){
    		pres.setId(null);
    	}
    	presService.add(pres);
		return pres;
    }
    
	
	/**
	 * 桥表  编辑
	 */
    @RequestMapping(value = "/editPermissionResource")
    @ResponseBody
    public PermissionResource editPermissionResource(PermissionResource pres){
    	presService.edit(pres);
    	return pres;
    }
    
	
	/**
	 * 桥表  删除
	 */
    @RequestMapping(value = "/delPermissionResource")
    @ResponseBody
    public PermissionResource delPermissionResource(PermissionResource pres){
    	presService.del(pres.getId());
    	return pres;
    }
	
	
    /**
     * 桥表 查询
     */
    @RequestMapping(value = "/listPermissionResource")
    @ResponseBody
	public Pagination findPermissionResourcePage(Pagination page, PermissionResource pres){
		Pagination rePage = null;
		rePage = presService.getPermissionResourcePage(page.getPageNumber(), page.getPageSize(),page.getPageSort(),pres);
		return rePage;
	}

    /**
     * <p>方法描述: 查询资源列表（全部）</p>
     * <p>方法备注: 方式�?，直接返回List<Role></p>
     * @param 
     * @return
     */
    @RequestMapping(value = "/view", method = RequestMethod.POST)
    @ResponseBody
    public List<Resource> list() {
        List<Resource> resList = new ArrayList<Resource>();
        resList = resourceService.findAll();
        return resList;
    }
    

    
    
    
    /**
     * <p>方法描述: 查询资源列表/构�?�页面请�?</p>
     * <p>方法备注: 方式二，大嵩前台�?�?要的分页及数据形�?</p>
     * @param 
     * @return
     */
    @RequestMapping(value = "/list")
    @ResponseBody
	public Pagination findResourcePage(Pagination page, Resource resource){
		Pagination rePage = null;
		rePage = resourceService.getPermissionPage(page.getPageNumber(), page.getPageSize(),page.getPageSort(),resource);
		return rePage;
	}
    
    
    /*
	*//**
	 * 导出页面请求
	 *//*
	@RequestMapping(value = "/export")
	public void exportResourcePage(HttpServletResponse response, Pagination page, String[] ids, String tableId, Resource resource){
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
			resource.setId(idStr);
		}
		rePage = resourceService.getPermissionPage(1, 10000, null, resource);
		HSSFWorkbook wkb = resourceService.exportData((List<Resource>) rePage.getList(), tableId);
		//处理Excel响应
		responseObject(response, wkb);
	}
	*/
	/**
	 * 批量删除请求
	 */
	@RequestMapping(value = "/resourcebatdel")
	@ResponseBody
	public Pagination batDel(Pagination page, Resource resource, String[] ids){
		Pagination rePage = null;
		for(String id : ids){
			System.out.println("id = "+ id);
		}
		rePage = resourceService.getPermissionPage(page.getPageNumber(), page.getPageSize(),page.getPageSort(), resource);
		return rePage;
	}
    
}