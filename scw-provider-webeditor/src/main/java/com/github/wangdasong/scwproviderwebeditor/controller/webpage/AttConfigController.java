package com.github.wangdasong.scwproviderwebeditor.controller.webpage;

import com.github.wangdasong.scwproviderwebeditor.Constants;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.AttConfig;
import com.github.wangdasong.scwproviderwebeditor.service.AttConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 属�?�操作相�?
 **/
@Controller
@RequestMapping(Constants.REST_ATT_CONFIG_PREFIX)
public class AttConfigController {
	@Autowired
	AttConfigService attConfigService;

	/**
	 * 修改
	 */
	@RequestMapping(value = Constants.REST_ATT_CONFIG_EDIT)
	@ResponseBody
	public AttConfig edit(AttConfig attConfig){
		attConfigService.editEntity(attConfig);
		return attConfig;
	}
	/**
	 * 新增
	 */
	@RequestMapping(value = Constants.REST_ATT_CONFIG_ADD)
	@ResponseBody
	public AttConfig add(AttConfig attConfig){
		attConfigService.addEntity(attConfig);
		return attConfig;
	}
	/**
	 * 删除
	 */
	@RequestMapping(value = Constants.REST_ATT_CONFIG_DEL)
	@ResponseBody
	public AttConfig del(AttConfig attConfig){
		attConfigService.delEntity(attConfig.getId());
		return attConfig;
	}
}
