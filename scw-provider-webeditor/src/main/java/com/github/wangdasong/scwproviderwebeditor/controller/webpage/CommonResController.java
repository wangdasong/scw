package com.github.wangdasong.scwproviderwebeditor.controller.webpage;

import com.github.wangdasong.scwbasecore.controller.base.BaseController;
import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;
import com.github.wangdasong.scwbasecore.dao.entity.base.DataSrcEntity;
import com.github.wangdasong.scwbasecore.dao.entity.base.TreeDataEntity;
import com.github.wangdasong.scwbasecore.service.base.DataSrcService;
import com.github.wangdasong.scwbasecore.service.base.TreeDataService;
import com.github.wangdasong.scwbasecore.utils.AopTargetUtils;
import com.github.wangdasong.scwbasecore.utils.WebContextFactoryUtil;
import com.github.wangdasong.scwproviderwebeditor.Constants;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.*;
import com.github.wangdasong.scwproviderwebeditor.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;


@Controller
@RequestMapping(Constants.REST_API_PREFIX)
public class CommonResController extends BaseController {
	@Autowired
	PageService pageService;
	@Autowired
	ContainerService containerService;
	@Autowired
	ElementService elementService;
	@Autowired
	WidgetService widgetService;
	@Autowired
	AttConfigService attConfigService;
	
	/**
	 * 构造页面请求
	 */
	@RequestMapping(value = Constants.PAGE_CONTAINERS)
	public Page createPage(@PathVariable("pageId")String pageId){
		Page page = null;
		page = pageService.getEntityDetailById(pageId);
		return page;
	}

	/**
	 * 取得子容器列�?
	 */
	@RequestMapping(value = Constants.SUB_CONTAINERS)
	public List<Container> getSubContainers(@PathVariable("containerId")String containerId){
		List<Container> containers = null;
		containers = containerService.getSubContainers(containerId);
		return containers;
	}
	/**
	 * 取得菜单路径列表
	 */
	@RequestMapping(value = Constants.MENU_PATH)
	public List<Element> getMenuPath(@PathVariable("elementId")String elementId){
		List<Element> elements = elementService.getElementPath(elementId);
		return elements;
	}
	/**
	 * 取得控件详细内容
	 */
	@RequestMapping(value = Constants.WIDGET_DETAIL)
	public Widget getWidgetDetail(@PathVariable("widgetId")String widgetId){
		Widget widget = null;
		widget = widgetService.getEntityDetailById(widgetId);
		return widget;
	}
	/**
	 * 根据�?属ID查询属�?�列�?
	 */
	@RequestMapping(value = Constants.ATT_CONFIG)
	public List<AttConfig> getAttConfigsByBelongId(@PathVariable("belongId")String belongId){
		List<AttConfig> attConfigs = null;
		attConfigs = attConfigService.getAttConfigsByBelongId(belongId);
		return attConfigs;
	}
	
//
//	/**
//	 * 上传文件
//	 */
//	@RequestMapping(value = Constants.UPLOAD_FILE, method = RequestMethod.POST)
//	@ResponseBody
//	public String uploadfile(final @RequestParam("file") MultipartFile file){
//		String uploadfile = null;
//		uploadfile = super.saveUploadFile(file);
//		if(uploadfile == null){
//			uploadfile = "fail";
//		}
//		return uploadfile;
//	}
//
//	/**
//	 * 导入Excel
//	 */
//	@RequestMapping(value = Constants.REST_IMPORT)
//	@ResponseBody
//	public ResultString importFile(HttpServletRequest request, String uploadImportFile, @PathVariable("serviceName")String serviceName, @PathVariable("tableId")String tableId){
//
//		ResultString rs = new ResultString();
//		try {
//			ImportService importService = (ImportService)WebContextFactoryUtil.getBean(serviceName);
//			if(tableId != null && uploadImportFile != null){
//				File file = new File(uploadImportFile);
//				if(file.exists()){
//					List<BaseEntity> importDataList = importService.importData(request, uploadImportFile, tableId);
//					String errorMsg = "";
//					for(BaseEntity currBaseEntity : importDataList){
//						if(currBaseEntity.getHasError()){
//							errorMsg = errorMsg + "<br/>" + currBaseEntity.getErrors().get(0);
//						}
//					}
//					if(!"".equals(errorMsg)){
//						rs.setMsg(errorMsg);
//						rs.setStatus(ResultString.RESULT_STATUS_FAILED);
//						return rs;
//					}
//				}else {
//					rs.setMsg("未找到导入文件！");
//					rs.setStatus(ResultString.RESULT_STATUS_FAILED);
//					return rs;
//				}
//			}else{
//				rs.setMsg("未找到导入文件！");
//				rs.setStatus(ResultString.RESULT_STATUS_FAILED);
//				return rs;
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//			rs.setMsg("文件导入时发生系统异常，请及时联系管理员�?");
//			rs.setStatus(ResultString.RESULT_STATUS_FAILED);
//			return rs;
//		}
//		rs.setMsg("导入成功！");
//		rs.setStatus(ResultString.RESULT_STATUS_SUCCESS);
//		return rs;
//	}
//
//
//	/**
//	 * 导出请求
//	 */
//	@RequestMapping(value = Constants.REST_EXPORT)
//	public void exportDataTable(HttpServletRequest request, HttpServletResponse response, Pagination page, String[] ids, String tableId, @PathVariable("serviceName")String serviceName){
//
//		Pagination rePage = null;
//		ExportService exportService = (ExportService)WebContextFactoryUtil.getBean(serviceName);
//
//		TablePagingService tablePagingService = (TablePagingService)exportService;
//		Pagination pr = new Pagination(1, 1, null, tablePagingService);
//		try {
//			pr.doPage(null);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		List dataList = pr.getList();
//		if(dataList == null || dataList.size() == 0){
//			return;
//		}
//		Object currEntity = dataList.get(0);
//		Object queryBean = RequestToBean.getBeanToRequest(request, currEntity.getClass());
//		pr = new Pagination(1, 10000, null, tablePagingService);
//		try {
//			pr.doPage((BaseEntity)queryBean);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		dataList = pr.getList();
//		HSSFWorkbook wkb = exportService.exportData(dataList, tableId);
//		//处理Excel响应
//		responseObject(response, wkb);
//	}
}
