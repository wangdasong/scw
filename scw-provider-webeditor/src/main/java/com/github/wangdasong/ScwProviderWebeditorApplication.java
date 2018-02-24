package com.github.wangdasong;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;

@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan
//@EnableRedisHttpSession
@EnableResourceServer
@MapperScan("com.github.wangdasong.scwproviderwebeditor.dao.persistence")
public class ScwProviderWebeditorApplication {
	public static void main(String[] args) {
		SpringApplication.run(ScwProviderWebeditorApplication.class, args);
	}
}
