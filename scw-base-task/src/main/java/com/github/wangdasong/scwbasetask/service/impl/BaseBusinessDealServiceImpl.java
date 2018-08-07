package com.github.wangdasong.scwbasetask.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;


import com.github.wangdasong.scwbasetask.redis.RedisConfig;
import com.github.wangdasong.scwbasetask.redis.RedisService;
import com.github.wangdasong.scwbasetask.service.BaseBusinessDealService;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.scheduling.Trigger;
import org.springframework.scheduling.TriggerContext;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.scheduling.support.CronTrigger;


public abstract class BaseBusinessDealServiceImpl implements
		BaseBusinessDealService, SchedulingConfigurer {

	@Value("${spring.redis.host}")
	public String host;
	@Value("${spring.redis.port}")
	public int port;
	@Value("${spring.redis.timeout}")
	public int timeOut;
	@Value("${spring.redis.jedis.pool.max-active}")
	public int maxActive;
	@Value("${spring.redis.jedis.pool.max-idle}")
	public int maxIdle;
	@Value("${spring.redis.jedis.pool.max-wait}")
	public long maxWait;
	public String password = null;
	public RedisService redisService;;

	public Integer singleServer = 1;
	public Integer randomServer = 2;
	public Integer assignNum = 3;
	public Integer defaultAssignTaskNum=100;
	
	
	List<Map<String, String>> taskAssignResultList;
	public List<Map<String, String>> getTaskAssignResultList() {
		return taskAssignResultList;
	}
	public void setTaskAssignResultList(
			List<Map<String, String>> taskAssignResultList) {
		this.taskAssignResultList = taskAssignResultList;
	}

	public RedisService getRedisService() {
		if (this.redisService != null) {
			return this.redisService;
		}
		System.out
				.println("BaseBusinessDealServiceImpl##############################");
		RedisConfig config;
		config = new RedisConfig();
		config.setHost(host);
		System.out.println("host##############################" + host);
		config.setMaxActive(maxActive);
		config.setMaxIdle(maxIdle);
		config.setMaxWait(maxWait);
		config.setPort(port);
		config.setTimeOut(timeOut);
		config.setPassword(password);
		this.redisService = new RedisService(config);
		return this.redisService;
	}

	Logger log = LoggerFactory.getLogger(BaseBusinessDealServiceImpl.class);

	private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	@Value("${spring.nsw.task.manage.serverName}")
	public String serverName;
/*	@Value("${spring.nsw.task.manage.registerCron}")
	public String registCron;
	@Value("${spring.nsw.task.manage.assignCron}")
	public String assignCron;
	@Value("${spring.nsw.task.manage.pendingCron}")
	public String pendingCron;*/
	public String registCron;
	public String assignCron;
	public String pendingCron;
	public String registServerKey = this.getClass().getSimpleName()+"RegistServerKey";
	
	public String assignServerKey = this.getClass().getSimpleName()+"AssignServerKey";
	
	public String pendingServerKey = this.getClass().getSimpleName()+"PendingServerKey";
	@Value("${spring.nsw.task.manage.aliveTime}")
	public int aliveTime;
	/**
	 * 注册服务的 时间表达式
	 * 默认每30秒执行一次
	 * @return
	 */
	public String registCron(){
		return "0/30 * * * * ?";
	}
	/**
	 * 分配任务的时间表达式
	 * 默认每2分钟执行一次
	 * @return
	 */
	public String assignCron(){
		return "0 0/2 * * * ?";
	}
	/**
	 * 获取任务列表的时间表达式
	 * 默认每3分钟执行一次
	 * @return
	 */
	public String pendingCron(){
		return "0 0/3 * * * ?";
	}
	
	
	@Override
	public void configureTasks(ScheduledTaskRegistrar scheduledTaskRegistrar) {
		// 注册心跳 定时任务
		scheduledTaskRegistrar.addTriggerTask(new Runnable() {
			@Override
			public void run() {
				try {
					registCron=registCron();
					// 注册心跳信息
					log.info("---------------start-------------------");
					log.info("注册服务定时任务参数，时间表达式registCron为：" + registCron);
					log.info("当前时间为：" + sdf.format(new Date()));
					log.info("----------------end--------------------");
					// 注册服务
					if (StringUtils.isEmpty(serverName)) {
						log.info("serverName is not allow null");
						throw new Exception("serverName is not allow null");
					}
					boolean registerMonitor = registMethod(registServerKey,
							serverName);
					if (registerMonitor) {
						log.info(serverName + "向redis注册成功");
					} else {
						log.info(serverName + "向redis注册失败");
						throw new Exception("serverName regist fail");
					}

				} catch (Exception e) {

					e.printStackTrace();
				}

			}
		}, new Trigger() {
			@Override
			public Date nextExecutionTime(TriggerContext triggerContext) {
				registCron=registCron();
				if (StringUtils.isNotEmpty(registCron)) {
					CronTrigger cronTrigger = new CronTrigger(registCron);
					Date nextExecDate = cronTrigger
							.nextExecutionTime(triggerContext);
					return nextExecDate;
				} else {
					return null;
				}

			}
		});
		// 分配定时任务
		scheduledTaskRegistrar.addTriggerTask(new Runnable() {
			@Override
			public void run() {
				
				try {
					assignCron = assignCron();
					if (StringUtils.isEmpty(assignCron)) {
						log.info("assignCron is not allow null");
						throw new Exception("assignCron is not allow null");
					}
					// 分配服务信息
					log.info("---------------start-------------------");
					log.info("分配服务定时任务参数，时间表达式assignCron为：" + assignCron);
					log.info("当前时间为：" + sdf.format(new Date()));
					log.info("----------------end--------------------");
					List<String> allTaskList = assignAllTaskList();
					List<Map<String, String>> result = assignMethod(allTaskList);
					doTaskAssignResult(result);
				} catch (Exception e) {

					e.printStackTrace();
				}

			}
		}, new Trigger() {
			@Override
			public Date nextExecutionTime(TriggerContext triggerContext) {
				assignCron = assignCron();
				if (StringUtils.isNotEmpty(assignCron)) {
					CronTrigger cronTrigger = new CronTrigger(assignCron);
					Date nextExecDate = cronTrigger
							.nextExecutionTime(triggerContext);
					return nextExecDate;
				} else {
					return null;
				}

			}
		});

		// 处理任务
		scheduledTaskRegistrar.addTriggerTask(new Runnable() {
			@Override
			public void run() {
				pendingCron=pendingCron();
				try {
					if (StringUtils.isEmpty(pendingCron)) {
						log.info("pendingCron is not allow null");
						throw new Exception("pendingCron is not allow null");
					}
					// 分配服务信息
					log.info("---------------start-------------------");
					log.info("执行任务定时任务参数，时间表达式pendingCron为：" + pendingCron);
					log.info("当前时间为：" + sdf.format(new Date()));
					log.info("----------------end--------------------");
					// 完成任务
					myTaskList();
				} catch (Exception e) {

					e.printStackTrace();
				}

			}
		}, new Trigger() {
			@Override
			public Date nextExecutionTime(TriggerContext triggerContext) {
				pendingCron=pendingCron();
				if (StringUtils.isNotEmpty(pendingCron)) {
					CronTrigger cronTrigger = new CronTrigger(pendingCron);
					Date nextExecDate = cronTrigger
							.nextExecutionTime(triggerContext);
					return nextExecDate;
				} else {
					return null;
				}

			}
		});
	}
	/**
	 * 注册心跳方法
	 * 
	 * @param serverKey
	 * @param serverName
	 * @return
	 */
	public boolean registMethod(String serverKey, String serverName) {
		log.info("服务器名称:" + serverName + "注册服务到redis");
		if (log.isDebugEnabled()) {
			log.debug("服务器名称:" + serverName + "注册服务到redis");
		}
		redisService = this.getRedisService();
		Long time = redisService.getTime();
		return redisService.hmSet(serverKey, serverName, String.valueOf(time));
	}

	/**
	 * 清理过期的 key 返回所有有效的服务
	 * 
	 * @param
	 * @return
	 */
	public Map<String, String> aliveServer() {
		redisService = this.getRedisService();
		Map<String, String> hgetAll = redisService
				.hgetAll(this.registServerKey);
		if (hgetAll != null && hgetAll.size() > 0) {
			if (log.isDebugEnabled()) {
				log.debug("服务列表!" + hgetAll.toString());
			}
			log.info("服务列表!" + hgetAll.toString());
			Set<String> keySet = hgetAll.keySet();
			long time = redisService.getTime();
			for (String currentServerName : keySet) {
				if(redisService==null){
					redisService = this.getRedisService();
				}
				String timeStr = hgetAll.get(currentServerName);
				long currentServerTime = Long.parseLong(timeStr);
				long interval = (time - currentServerTime) / 1000;
				if (interval > this.aliveTime) {// 删除掉key
					if (log.isDebugEnabled()) {
						log.debug("服务器名称:" + currentServerName + "服务过期!");
					}
					log.info("服务器名称:" + currentServerName + "服务过期!");
					redisService.hdel(this.registServerKey, currentServerName);
					if (log.isDebugEnabled()) {
						log.debug("服务器名称:" + currentServerName + "过期服务删除成功!");
					}
					log.info("服务器名称:" + currentServerName + "过期服务删除成功!");
				}
			}
		}
		return redisService.hgetAll(this.registServerKey);
	}

	public List<Map<String, String>> assignMethod(List<String> allTaskList) throws Exception {
		redisService = this.getRedisService();
		RedisConnection connection = null;
		log.info("服务器名称:" + this.serverName + "进入到指定一个分配任务方法");
		if (log.isDebugEnabled()) {
			log.debug("服务器名称:" + this.serverName + "进入到指定一个分配任务方法");
		}
		RedisTemplate<String, Object> template = redisService.getTemplate();

		RedisSerializer<String> stringSerializer = template
				.getStringSerializer();
		connection = template.getConnectionFactory().getConnection();
		connection.watch(stringSerializer.serialize(this.assignServerKey));
		byte[] bs = connection.get(stringSerializer
				.serialize(this.assignServerKey));
		String currentServer = stringSerializer.deserialize(bs);
		if (allTaskList != null && allTaskList.size() > 0) {// 非上传下载型 任务
			if (currentServer == null || "".equals(currentServer)) {// 不存在服务
				fileAllocation(connection, stringSerializer, allTaskList);
			} else if (!this.currentServerState(currentServer)) {// 分配任务的服务是否有心跳
				log.info("服务器名称:" + currentServer + "宕机");
				if (log.isDebugEnabled()) {
					log.debug("服务器名称:" + currentServer + "宕机");
				}
				fileAllocation(connection, stringSerializer, allTaskList);
			} else if (this.serverName.equals(currentServer)) {// 上次服务启动时,redis记载自己未完成任务
				fileAllocation(connection, stringSerializer, allTaskList);
			}
		} 
		redisService.close(connection);
		List<Map<String, String>> result = new ArrayList<Map<String, String>>();
		return result;
	}

	/**
	 * 进行 任务分配
	 * 
	 * @param allTaskList
	 * @throws Exception
	 */
	public void fileAllocation(RedisConnection connection,
			RedisSerializer<String> stringSerializer, List<String> allTaskList)
			throws Exception {
		if(redisService==null){
			redisService = this.getRedisService();
		}
		connection.multi();
		// redisService.set(this.downloadEdi180Server, this.serverName);
		connection.set(stringSerializer.serialize(this.assignServerKey),
				stringSerializer.serialize(this.serverName));
		List<Object> exec = connection.exec();
		connection.unwatch();
		if (exec == null) {
			log.info("服务器名称:" + this.serverName + "没有任务分配");
			if (log.isDebugEnabled()) {
				log.debug("服务器名称:" + this.serverName + "没有任务分配");
			}
			return;
		}
		// 1 查看是否有未完成任务 有 进行分配,无 进行新的任务分配
		Map<String, String> hgetAll = redisService.hgetAll(this.pendingServerKey);
		if (hgetAll != null && hgetAll.size() > 0) {// 有未完成的服务
			// 进行就得任务处理 1 判断任务处理服务是否宕机 宕机则重新分配
			survivalCheck(hgetAll);
		} else {// 没有未完成的服务
			fileAssign(allTaskList);
		}
		redisService.remove(this.assignServerKey);
		log.info("服务器名称:" + this.serverName + "完成任务分配");
		if (log.isDebugEnabled()) {
			log.debug("服务器名称:" + this.serverName + "完成任务分配");
		}
	}

	/**
	 * 查看当前的 无是否存活 服务名称
	 */
	public boolean currentServerState(String currentServer) {
		if(redisService==null){
			redisService = this.getRedisService();
		}
		String hget = (String) redisService.hmGet(this.registServerKey,
				currentServer);
		if (hget == null || "".equals(hget)) {
			return false;
		}
		long currentServerTime = Long.parseLong(hget);
		long time = redisService.getTime();
		long interval = (time - currentServerTime) / 1000;
		if (interval > this.aliveTime) {// 删除掉key
			if (log.isDebugEnabled()) {
				log.debug("服务器名称:" + currentServer + "服务过期!");
			}
			log.info("服务器名称:" + currentServer + "服务过期!");
			redisService.hdel(this.registServerKey, currentServer);
			if (log.isDebugEnabled()) {
				log.debug("服务器名称:" + currentServer + "过期服务删除成功!");
			}
			log.info("服务器名称:" + currentServer + "过期服务删除成功!");
			return false;
		}
		return true;
	}

	/**
	 * 已经分配任务服务器 存活检查
	 * 
	 * @throws Exception
	 */
	public void survivalCheck(Map<String, String> hgetAll) throws Exception {
		List<String> fileList = new ArrayList<String>(); // 宕机任务集合
		Set<String> keySet = hgetAll.keySet();// 所有任务的集合
		for (String key : keySet) {
			String currentServer = hgetAll.get(key);// 服务名称 key 任务名称
			boolean currentServerState = currentServerState(currentServer);
			if (!currentServerState) {// 不包含,服务器宕机
				fileList.add(key);
			}
		}
		// 重新分配
		if (fileList != null && fileList.size() > 0) {
			fileAssign(fileList);
		}
	}

	/**
	 * 分配任务方法 fileList 任务列表 serverExist 存活服务 fileEdi180Server redis key
	 * 
	 * @param fileList
	 * @throws Exception
	 */
	public void fileAssign(List<String> fileList) throws Exception {
		if(redisService==null){
			redisService = this.getRedisService();
		}
		Map<String, String> aliveServer = aliveServer();
		Integer taskType = taskType();
		if (singleServer.equals(taskType)) {// 一个服务器做
			if (aliveServer != null && aliveServer.size() > 0) {
				for (int i = 0; i < fileList.size(); i++) {
					if(redisService==null){
						redisService = this.getRedisService();
					}
					redisService.hmSet(this.pendingServerKey, fileList.get(i),
							serverName);
				}
			}
		} else if (randomServer.equals(taskType) || taskType == null) {// 随机服务器去做
			randomAssign(aliveServer, fileList);
		} else if (assignNum.equals(taskType)) {// 每台服务器分配指定 的数量
			if (aliveServer != null && aliveServer.size() > 0) {
				Integer assignTaskNum = assignTaskNum();
				if (assignTaskNum == null || assignTaskNum == 0) {// 数量不为空
					assignTaskNum=this.defaultAssignTaskNum;
				}
				Set<String> keySet = aliveServer.keySet();
				List<String> serList = new ArrayList<String>();// 服务名称列表
				for (String string : keySet) {
					serList.add(string);
				}

				int size = fileList.size();
				int count = (size + assignTaskNum - 1) / assignTaskNum;

				for (int i = 0; i < count; i++) {
					if (serList.size() < i + 1) {
						break;
					}
					List<String> subList = fileList.subList(i
							* assignTaskNum,
							((i + 1) * assignTaskNum > size ? size
									: assignTaskNum * (i + 1)));
					for (String myTask : subList) {
						if(redisService==null){
							redisService = this.getRedisService();
						}
						redisService.hmSet(this.pendingServerKey, myTask,
								serList.get(i % serList.size()));
					}
				}
			}
		}

	}

	/**
	 * 获取当前服务所有的任务列表 并处理任务
	 */
	public void myTaskList() {
		redisService = this.getRedisService();

		List<String> myTaskList = new ArrayList<String>();
		Map<String, String> hgetAll = redisService.hgetAll(this.pendingServerKey);
		Set<String> keySet = hgetAll.keySet();
		for (String fileName : keySet) {
			String currentServerName = hgetAll.get(fileName);// servername
			if (this.serverName.equals(currentServerName)) {// 如果相同则添加到任务列表
				myTaskList.add(fileName);
			}
		}
		for (String myTask : myTaskList) {
			if(redisService==null){
				redisService = this.getRedisService();
			}
			boolean doMyTask = doMyTask(myTask);
			if(doMyTask){
				redisService.hdel(this.pendingServerKey, myTask);
			}
		}
		/*List<String> doMyTask = doMyTask(myTaskList);
		if(doMyTask!=null&&doMyTask.size()>0){
			for (String myTask : doMyTask) {
				if(redisService==null){
					redisService = this.getRedisService();
				}
				redisService.hdel(this.pendingServerKey, myTask);
			}
		}*/
	}

	// 随机分配
	public void randomAssign(Map<String, String> aliveServer,
			List<String> fileList) {
		if (aliveServer != null && aliveServer.size() > 0) {
			Set<String> keySet = aliveServer.keySet();
			List<String> serList = new ArrayList<String>();// 服务名称列表
			for (String string : keySet) {
				serList.add(string);
			}
			/**
			 * 每个服务器 分 任务
			 */
			if (serList != null && serList.size() > 0 && fileList != null
					&& fileList.size() > 0) {
				for (int i = 0; i < fileList.size(); i++) {
					if(redisService==null){
						redisService = this.getRedisService();
					}
					redisService.hmSet(this.pendingServerKey, fileList.get(i),
							serList.get(i % serList.size()));
					
				}
			}
		}
	}
	/**
	 * 任务分配结果
	 * @param result
	 */
	public void doTaskAssignResult(List<Map<String, String>> result){
		
	}
}
