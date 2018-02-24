package com.github.wangdasong.scwbasecore.utils;


import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;

import java.util.Set;

public class ThreadVariable {
	/**
	 * 当前用户线程变量
	 */
	private static ThreadLocal<BaseEntity> userVariable = new ThreadLocal<BaseEntity>();
	/**
	 * 当前访问菜单ID线程变量
	 */
	private static ThreadLocal<String> currMenuVariable = new ThreadLocal<String>();
	/**
	 * 当前数据库类型
	 */
	private static ThreadLocal<String> dbDialogVariable = new ThreadLocal<String>();
	/**
	 * 当前弹出控件ID线程变量
	 */
	private static ThreadLocal<String> popupWidgetVariable = new ThreadLocal<String>();
//	/**
//	 * 当前RedisMsgPubSubListener线程变量
//	 */
//	private static ThreadLocal<RedisMsgPubSubListener> redisMsgPubSubListenerVariable = new ThreadLocal<RedisMsgPubSubListener>();
	/**
	 * 当前用户拥有资源线程变量
	 */
	private static ThreadLocal<Set<BaseEntity>> resourceSetVariable = new ThreadLocal<Set<BaseEntity>>();
	/**
	 * 当前用户菜单权限线程变量
	 */
	private static ThreadLocal<Set<String>> menuPermissionSetVariable = new ThreadLocal<Set<String>>();
	/**
	 * 当前用户容器权限线程变量
	 */
	private static ThreadLocal<Set<String>> containerPermissionSetVariable = new ThreadLocal<Set<String>>();
	/**
	 * 当前用户控件权限线程变量
	 */
	private static ThreadLocal<Set<String>> widgetPermissionSetVariable = new ThreadLocal<Set<String>>();
	/**
	 * 当前用户弹出页面容器权限线程变量
	 */
	private static ThreadLocal<Set<String>> pcPermissionSetVariable = new ThreadLocal<Set<String>>();
	/**
	 * 当前用户弹出页面控件权限线程变量
	 */
	private static ThreadLocal<Set<String>> pwPermissionSetVariable = new ThreadLocal<Set<String>>();
	/**
	 * 当前用户表格元素权限线程变量
	 */
	private static ThreadLocal<Set<String>> elementPermissionSetVariable = new ThreadLocal<Set<String>>();

	/**
	 * 当前服务类型线程变量
	 */
	private static ThreadLocal<String> serverTypeVariable = new ThreadLocal<String>();
	/**
	 * 当前服务IP线程变量
	 */
	private static ThreadLocal<String> serverIpVariable = new ThreadLocal<String>();
	/**
	 * 当前服务端口号线程变量
	 */
	private static ThreadLocal<String> serverPortVariable = new ThreadLocal<String>();
	/**
	 * 当前子系统编码线程变量
	 */
	private static ThreadLocal<String> subsysCodeVariable = new ThreadLocal<String>();

	/**
	 * 设置当前用户
	 * 
	 * @param user
	 */
	public static void setUser(BaseEntity user) {
		userVariable.set(user);
	}

	/**
	 * 获得当前用户
	 * 
	 * @return
	 */
	public static BaseEntity getUser() {
		return userVariable.get();
	}
	/**
	 * 设置当前用户拥有资源
	 * 
	 * @param permissionSet
	 */
	public static void setResourceSetVariable(Set<BaseEntity> permissionSet) {
		resourceSetVariable.set(permissionSet);
	}

	/**
	 * 获得当前用户拥有资源
	 * 
	 * @return
	 */
	public static Set<BaseEntity> getResourceSetVariable() {
		return resourceSetVariable.get();
	}

	/**
	 * 设置当前用户菜单权限
	 * 
	 * @param permissionSet
	 */
	public static void setMenuPermissionSetVariable(Set<String> permissionSet) {
		menuPermissionSetVariable.set(permissionSet);
	}

	/**
	 * 获得当前用户菜单权限
	 * 
	 * @return
	 */
	public static Set<String> getMenuPermissionSetVariable() {
		return menuPermissionSetVariable.get();
	}

	/**
	 * 设置当前用户容器权限
	 * 
	 * @param permissionSet
	 */
	public static void setContainerPermissionSetVariable(Set<String> permissionSet) {
		containerPermissionSetVariable.set(permissionSet);
	}

	/**
	 * 获得当前用户容器权限
	 * 
	 * @return
	 */
	public static Set<String> getContainerPermissionSetVariable() {
		return containerPermissionSetVariable.get();
	}

	/**
	 * 设置当前用户控件权限
	 * 
	 * @param permissionSet
	 */
	public static void setWidgetPermissionSetVariable(Set<String> permissionSet) {
		widgetPermissionSetVariable.set(permissionSet);
	}

	/**
	 * 获得当前用户控件权限
	 * 
	 * @return
	 */
	public static Set<String> getWidgetPermissionSetVariable() {
		return widgetPermissionSetVariable.get();
	}

	/**
	 * 获得当前用户弹出页面容器权限
	 * 
	 * @return
	 */
	public static Set<String> getPcPermissionSetVariable() {
		return pcPermissionSetVariable.get();
	}
	/**
	 * 设置当前用户弹出页面容器权限
	 * 
	 * @param permissionSet
	 */
	public static void setPcPermissionSetVariable(Set<String> permissionSet) {
		pcPermissionSetVariable.set(permissionSet);
	}

	/**
	 * 获得当前用户弹出页面控件权限
	 * 
	 * @return
	 */
	public static Set<String> getPwPermissionSetVariable() {
		return pwPermissionSetVariable.get();
	}
	/**
	 * 设置当前用户弹出页面控件权限
	 * 
	 * @param permissionSet
	 */
	public static void setPwPermissionSetVariable(Set<String> permissionSet) {
		pwPermissionSetVariable.set(permissionSet);
	}

	/**
	 * 获得当前用户表单元素权限
	 * 
	 * @return
	 */
	public static Set<String> getElementPermissionSetVariable() {
		return elementPermissionSetVariable.get();
	}
	/**
	 * 设置当前用户表单元素权限
	 * 
	 * @param permissionSet
	 */
	public static void setElementPermissionSetVariable(Set<String> permissionSet) {
		elementPermissionSetVariable.set(permissionSet);
	}


	/**
	 * 获得数据库语言环境
	 * 
	 * @return
	 */
	public static String getDbDialogVariable() {
		return dbDialogVariable.get();
	}
	/**
	 * 设置数据库语言环境
	 * 
	 * @param dbDialog
	 */
	public static void setDbDialogVariable(String dbDialog) {
		dbDialogVariable.set(dbDialog);
	}
	
	
	/**
	 * 获得当前用户表单元素权限
	 * 
	 * @return
	 */
	public static String getCurrMenuVariable() {
		return currMenuVariable.get();
	}
	/**
	 * 设置当前用户表单元素权限
	 * 
	 * @param permissionSet
	 */
	public static void setCurrMenuVariable(String permissionSet) {
		currMenuVariable.set(permissionSet);
	}

	/**
	 * 获得当前弹出页面控件
	 * 
	 * @return
	 */
	public static String getPopupWidgetVariable() {
		return popupWidgetVariable.get();
	}
	/**
	 * 设置当前弹出页面控件
	 * 
	 * @param widgetId
	 */
	public static void setPopupWidgetVariable(String widgetId) {
		popupWidgetVariable.set(widgetId);
	}

//	/**
//	 * 获得当前RedisMsgPubSubListener
//	 *
//	 * @return
//	 */
//	public static RedisMsgPubSubListener getRedisMsgPubSubListenerVariable() {
//		return redisMsgPubSubListenerVariable.get();
//	}
//	/**
//	 * 设置当前RedisMsgPubSubListener
//	 *
//	 * @param redisMsgPubSubListener
//	 */
//	public static void setRedisMsgPubSubListenerVariable(RedisMsgPubSubListener redisMsgPubSubListener) {
//		redisMsgPubSubListenerVariable.set(redisMsgPubSubListener);
//	}

	public static String getServerTypeVariable() {
		return serverTypeVariable.get();
	}

	public static void setServerTypeVariable(String serverType) {
		ThreadVariable.serverTypeVariable.set(serverType);
	}

	public static String getServerIpVariable() {
		return serverIpVariable.get();
	}

	public static void setServerIpVariable(String serverIp) {
		ThreadVariable.serverIpVariable.set(serverIp);
	}

	public static String getServerPortVariable() {
		return serverPortVariable.get();
	}

	public static void setServerPortVariable(String serverPort) {
		ThreadVariable.serverPortVariable.set(serverPort);
	}

	public static String getSubsysCodeVariable() {
		return subsysCodeVariable.get();
	}

	public static void setSubsysCodeVariable(String subsys) {
		ThreadVariable.subsysCodeVariable.set(subsys);
	}
	
}
