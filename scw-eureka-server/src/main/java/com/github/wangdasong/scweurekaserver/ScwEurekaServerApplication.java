package com.github.wangdasong.scweurekaserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@EnableEurekaServer
@SpringBootApplication
public class ScwEurekaServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScwEurekaServerApplication.class, args);
	}
}
