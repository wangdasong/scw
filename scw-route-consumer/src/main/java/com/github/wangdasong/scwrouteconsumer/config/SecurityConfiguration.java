package com.github.wangdasong.scwrouteconsumer.config;

import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.stereotype.Component;

@Component
/**
 * 设置单点登录服务
 */
@EnableOAuth2Sso
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    public void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        http
                //登出成功地址
                .logout().logoutSuccessUrl("/")
                .and()
                //除了以下url其他地址都要进行权限认证
                .authorizeRequests()
                .antMatchers( "/demo-ace/**", "/login", "/app/**", "/thirdparty/**").permitAll()
                .anyRequest().authenticated()
                .and()
                //资源可作为iframe内容使用
                .headers().frameOptions().disable()
                .and()
                .csrf()
                .disable();
//                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
        // @formatter:on
    }
}
