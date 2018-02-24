package com.github.wangdasong.scwproviderwebeditor.service;

import com.github.wangdasong.scwbasecore.service.base.BaseService;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.AttConfig;

import java.util.List;

public interface AttConfigService extends BaseService<AttConfig>{
	public List<AttConfig> getAttConfigsByBelongId(String belongId);
}
