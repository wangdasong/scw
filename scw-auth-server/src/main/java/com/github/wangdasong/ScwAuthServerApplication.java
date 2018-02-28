package com.github.wangdasong;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver;

import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
@EnableDiscoveryClient
/**
 * 工具方法，用来在当前应用context里(必须是一个DispatcherServlet context)
 * 开启一个授权server(例如AuthorizationEndpoint)和一个TokenEndpoint。
 */
@EnableAuthorizationServer
/**
 * Oauth2 资源服务器的便利方法，开启了一个spring security的filter，
 * 这个filter通过一个Oauth2的token进行认证请求。
 */
@EnableResourceServer
@SessionAttributes("authorizationRequest")
//@EnableRedisHttpSession
@MapperScan("com.github.wangdasong.scwauthserver.dao.persistence")
public class ScwAuthServerApplication extends WebMvcConfigurerAdapter  {
	@Value("${page.resources.path}")
	String resourcesPath;

	public static void main(String[] args) {
		SpringApplication.run(ScwAuthServerApplication.class, args);
	}

	@Override
	/**
	 * 增加视图，让login指向自定义的页面（FreeMarker）
	 */
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController("/login").setViewName("login");
	}

	@Bean
	/**
	 * 设置FreeMarker解析器
	 */
	public FreeMarkerViewResolver freeMarkerViewResolver() {
		FreeMarkerViewResolver resolver = new FreeMarkerViewResolver();
		resolver.setPrefix("");
		resolver.setSuffix(".ftl");
		resolver.setContentType("text/html; charset=UTF-8");
		resolver.setRequestContextAttribute("request");
		Map attributesMap = new HashMap<String,String>();
		attributesMap.put("resourcesPath", resourcesPath);
		resolver.setAttributesMap(attributesMap);
		return resolver;
	}
}
