package com.github.wangdasong.scwproviderwebeditor;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class Constants {

	public static final Gson GSON;
	public static final Gson GSON_FULL;
	public static final Gson DEFAULT_GSON;
	
	public static final String REST_API_PREFIX = "/api";
	public static final String REST_IMPORT = "/import/{serviceName}/{tableId}";
	public static final String REST_EXPORT = "/export/{serviceName}";
	public static final String PAGE_CONTAINERS = "/pageContainers/{pageId}";
	public static final String SUB_CONTAINERS = "/subContainers/{containerId}";
	public static final String MENU_PATH = "/menuPath/{elementId}";
	public static final String WIDGET_DETAIL = "/widgetDetail/{widgetId}";
	public static final String ATT_CONFIG = "/attConfigs/{belongId}";
	public static final String DATA_SRC_LIST = "/dataSrcList/{serviceName}";
	public static final String TREE_DATA_LIST = "/treeDataList/{serviceName}/{parentId}";
	public static final String UPLOAD_FILE = "/uploadfile";
	/**
	 * 用户相关请求
	 */
	public static final String REST_USER_PREFIX = "/user";
	public static final String REST_USER_LIST = "/list";
	public static final String REST_USER_IMPORT = "/import/{tableId}";
	public static final String REST_USER_EXPORT = "/export";
	public static final String REST_USER_BATDEL = "/batdel";
	public static final String REST_USER_EDIT = "/edit";
	public static final String REST_USER_ADD = "/add";
	public static final String REST_USER_DEL = "/del";
	/**
	 * 子系统配置相关请求
	 */
	public static final String REST_SUBSYS_PREFIX = "/subsys";
	public static final String REST_SUBSYS_LIST = "/list";
	public static final String REST_SUBSYS_EDIT = "/edit";
	public static final String REST_SUBSYS_ADD = "/add";
	public static final String REST_SUBSYS_DEL = "/del";
	public static final String REST_SUBSYS_CHANGE = "/change";
	public static final String REST_SUBSYS_RELOAD = "/reload";
	/**
	 * 服务提供者配置相关请求
	 */
	public static final String REST_PROVIDER_PREFIX = "/provider";
	public static final String REST_PROVIDER_LIST = "/list";
	public static final String REST_PROVIDER_EDIT = "/edit";
	public static final String REST_PROVIDER_ADD = "/add";
	public static final String REST_PROVIDER_DEL = "/del";
	
	/**
	 * 用户角色相关请求
	 */
	public static final String REST_USER_ROLE_PREFIX = "/userrole";
	
	/**
	 * 容器相关请求
	 */
	public static final String REST_CONTAINER_PREFIX = "/container";
	public static final String REST_CONTAINER_LIST = "/list";
	public static final String REST_CONTAINER_SOU = "/saveorupdate";
	public static final String REST_CONTAINER_SOU_TPL = "/saveorupdatefortpl";
	public static final String REST_CONTAINER_COPY_TEMPLETE = "/copytemplete";
	public static final String REST_CONTAINER_EDIT = "/edit";
	public static final String REST_CONTAINER_ADD = "/add";
	public static final String REST_CONTAINER_DEL = "/del";
	/**
	 * 页面编辑相关请求
	 */
	public static final String REST_PAGE_PREFIX = "/page";
	public static final String REST_PAGE_LIST = "/list";
	public static final String REST_PAGE_SOU = "/saveorupdate";
	public static final String REST_PAGE_COPY_TEMPLETE = "/copytemplete";
	public static final String REST_PAGE_EDIT = "/edit";
	public static final String REST_PAGE_ADD = "/add";
	public static final String REST_PAGE_DEL = "/del";
	/**
	 * 元素相关请求
	 */
	public static final String REST_ELEMENT_PREFIX = "/element";
	public static final String REST_ELEMENT_LIST = "/list";
	public static final String REST_ELEMENT_SOU = "/saveorupdate";
	public static final String REST_ELEMENT_COPY_TEMPLETE = "/copytemplete";
	public static final String REST_ELEMENT_EDIT = "/edit";
	public static final String REST_ELEMENT_ADD = "/add";
	public static final String REST_ELEMENT_DEL = "/del";
	public static final String REST_ELEMENT_IMPORT = "/import";

	/**
	 * 控件相关请求
	 */
	public static final String REST_WIDGET_PREFIX = "/widget";
	public static final String REST_WIDGET_LIST = "/list";
	public static final String REST_WIDGET_SOU = "/saveorupdate";
	public static final String REST_WIDGET_COPY_TEMPLETE = "/copytemplete";
	public static final String REST_WIDGET_EDIT = "/edit";
	public static final String REST_WIDGET_ADD = "/add";
	public static final String REST_WIDGET_DEL = "/del";
	/**
	 * 属�?�相关请�?
	 */
	public static final String REST_ATT_CONFIG_PREFIX = "/attribute";
	public static final String REST_ATT_CONFIG_LIST = "/list";
	public static final String REST_ATT_CONFIG_BATDEL = "/batdel";
	public static final String REST_ATT_CONFIG_EDIT = "/edit";
	public static final String REST_ATT_CONFIG_ADD = "/add";
	public static final String REST_ATT_CONFIG_DEL = "/del";


	static {

		DEFAULT_GSON = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss")
				.create();

		GSON = new GsonBuilder()
				.setDateFormat("yyyy-MM-dd HH:mm:ss").create();
		GSON_FULL = new GsonBuilder()
				.setDateFormat("yyyy-MM-dd HH:mm:ss").create();
	}
}
