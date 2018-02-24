package com.github.wangdasong.scwrouteconsumer;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableZuulProxy
@EnableDiscoveryClient
//@EnableRedisHttpSession
@MapperScan("com.github.wangdasong.scwrouteconsumer.dao.persistence")
public class ScwRouteConsumerApplication {

	/**
	 * 方法名称：restTemplate
	 * 概要：设置服务消费端
	 * @return
	 */
	@Bean
	@LoadBalanced
	RestTemplate restTemplate() {
		return new RestTemplate();
	}

	public static void main(String[] args) {
		SpringApplication.run(ScwRouteConsumerApplication.class, args);
	}

}