package com.github.wangdasong.scwbasetask.service;

import java.util.List;

public interface BaseBusinessDealService {
	//public List<String> getAllTaskList();//获取所有的 任务
	public List<String> assignAllTaskList();//分配所有的 任务
	public Integer taskType();//类型 1 仅一台服务器  2 随机分配 3每台服务器 分配指定的 数量
	public Integer assignTaskNum();//每台服务器 分配的数量
	/*public List<String> doMyTask(List<String> myTaskList);执行我的任务*/
	public boolean doMyTask(String myTask);
	}
