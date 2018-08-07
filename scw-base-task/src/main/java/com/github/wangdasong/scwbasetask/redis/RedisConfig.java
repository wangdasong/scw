package com.github.wangdasong.scwbasetask.redis;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RedisConfig {

	private static Logger logger = LoggerFactory.getLogger(RedisConfig.class);

	private String host;
	private int port;
	private int timeOut;
	private int maxActive;
	private int maxIdle;
	private long maxWait;
	private String password = null;
	public static Logger getLogger() {
		return logger;
	}
	public static void setLogger(Logger logger) {
		RedisConfig.logger = logger;
	}
	public String getHost() {
		return host;
	}
	public void setHost(String host) {
		this.host = host;
	}
	public int getPort() {
		return port;
	}
	public void setPort(int port) {
		this.port = port;
	}
	public int getTimeOut() {
		return timeOut;
	}
	public void setTimeOut(int timeOut) {
		this.timeOut = timeOut;
	}
	public int getMaxActive() {
		return maxActive;
	}
	public void setMaxActive(int maxActive) {
		this.maxActive = maxActive;
	}
	public int getMaxIdle() {
		return maxIdle;
	}
	public void setMaxIdle(int maxIdle) {
		this.maxIdle = maxIdle;
	}
	public long getMaxWait() {
		return maxWait;
	}
	public void setMaxWait(long maxWait) {
		this.maxWait = maxWait;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

		

}
