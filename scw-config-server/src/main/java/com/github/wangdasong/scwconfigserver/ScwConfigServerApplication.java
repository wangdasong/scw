package com.github.wangdasong.scwconfigserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer
public class ScwConfigServerApplication {
	public static void main(String[] args) {
		SpringApplication.run(ScwConfigServerApplication.class, args);
	}
}
