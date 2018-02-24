package com.github.wangdasong.scwproviderwebeditor.controller.webpage;

import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwbasecore.utils.result.ResultString;
import com.github.wangdasong.scwproviderwebeditor.Constants;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.AttConfig;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Element;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.Widget;
import com.github.wangdasong.scwproviderwebeditor.service.ElementService;
import com.github.wangdasong.scwproviderwebeditor.service.WidgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Controller
@RequestMapping(Constants.REST_ELEMENT_PREFIX)
public class ElementController {

	@Autowired
	ElementService elementService;
	@Autowired
	WidgetService widgetService;

	/**
	 * 构�?�页面请�?
	 */
	@RequestMapping(value = Constants.REST_ELEMENT_LIST)
	@ResponseBody
	public Pagination findMyAttConfigPage(Pagination page, Element element){
		Pagination rePage = null;
		if(element.getId() == null || "".equals(element.getId())){
			return null;
		}
		rePage = elementService.getMyAttrConfigPage(page.getPageNumber(), page.getPageSize(),page.getPageSort(), element);
		return rePage;
	}

	/**
	 * 构�?�页面请�?
	 */
	@RequestMapping(value = Constants.REST_ELEMENT_COPY_TEMPLETE)
	public Element copyTemplete(Element element, String sampleType){
		Element tempElement = new Element();
		tempElement.setId("44EA45BA27912E9CE0530100007F5070");
		String widgetId = element.getWidgetId();
		if(widgetId != null){
			Widget myWidget = widgetService.getEntityById(widgetId);
			if(sampleType == null || "".equals(sampleType)){
				if("menu".equals(myWidget.getType())){
					tempElement.setId("44EA45BA27922E9CE0530100007F5070");
				}
				if("select".equals(myWidget.getType())){
					tempElement.setId("442543E1BF291203E0530100007F66A2");
				}
				if("radio".equals(myWidget.getType())){
					tempElement.setId("43C2C1AFEBA5798FE0530100007F0762");
				}
				if("check".equals(myWidget.getType())){
					tempElement.setId("4422C04BB71E469DE0530100007FA38B");
				}
				if("datatable".equals(myWidget.getType())){
					tempElement.setId("444DBA4F96290892E0530100007FCFFE");
				}
			}else if("1".equals(sampleType)){
				tempElement.setId("442543E1BF291203E0530100007F66A2");
			}else if("2".equals(sampleType)){
				tempElement.setId("44EA45BA27922E9CE0530100007F5070");
			}else if("3".equals(sampleType)){
				tempElement.setId("444DBA4F96290892E0530100007FCFFE");
			}else if("4".equals(sampleType)){
				tempElement.setId("444DBA4F962B0892E0530100007FCFFE");
			}else if("5".equals(sampleType)){
				tempElement.setId("444DBA4F962D0892E0530100007FCFFE");
			}else if("6".equals(sampleType)){
				tempElement.setId("489E2EFEF13C2104E0530100007F545D");
			}else if("7".equals(sampleType)){
				tempElement.setId("444DBA4F962A0892E0530100007FCFFE");
			}else if("8".equals(sampleType)){
				tempElement.setId("444DBA4F962C0892E0530100007FCFFE");
			}
		}
		
		element = elementService.copyElementAttsFromTemplet(tempElement, element);
		return element;
	}

	/**
	 * 保存元素数据
	 */
	@RequestMapping(value = Constants.REST_ELEMENT_SOU)
	@ResponseBody
	public Element saveOrUpdate(Element element){
		element = elementService.saveOrUpdateElement(element);
		return element;
	}

	/**
	 * 导入数据表的元素数据
	 */
	@RequestMapping(value = Constants.REST_ELEMENT_IMPORT)
	@ResponseBody
	public ResultString importData(String[] widgetIds, String[] sorts, String[] codes, String[] names, String[] sampleTypes , String[] editFlgs, String[] labels ){
		ResultString resultString = new ResultString("");
		int i = 0;
		for(String widgetId : widgetIds){
			Element element = new Element();
			element.setWidgetId(widgetId);
			element.setCode(codes[i]);
			element.setName(names[i]);
			element.setSampleType(sampleTypes[i]);
			element.setParentId(widgetId);
			element.setCreateUserId("01062317");
			element.setCreateDate(new Date());
			element = elementService.saveOrUpdateElement(element);
			AttConfig attConfig = new AttConfig();
			attConfig.setAttValue(labels[i]);
			List<AttConfig>  attConfigs = new ArrayList<AttConfig>();
			attConfigs.add(attConfig);
			attConfig = new AttConfig();
			attConfig.setAttValue(sorts[i]);
			attConfigs.add(attConfig);
			attConfig = new AttConfig();
			attConfig.setAttValue(editFlgs[i]);
			attConfigs.add(attConfig);
			element.setAttConfigs(attConfigs);
			copyTemplete(element, element.getSampleType());
			i ++ ;
		}
		return resultString;
	}

	/**
	 * 删除元素数据
	 */
	@RequestMapping(value = Constants.REST_ELEMENT_DEL)
	@ResponseBody
	public Element del(Element element){
		elementService.delElement(element);
		return element;
	}
}
