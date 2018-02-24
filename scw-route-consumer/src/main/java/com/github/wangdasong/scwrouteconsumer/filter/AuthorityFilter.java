package com.github.wangdasong.scwrouteconsumer.filter;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import java.util.Collection;
@Component
public class AuthorityFilter extends ZuulFilter {
    @Autowired
    RestTemplate restTemplate;

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();
        String uri = request.getRequestURI();
        //调用WEB编辑器服务和权限认证服务不进行权限限制
        if(uri.indexOf("api-webeditor") > 0 || uri.indexOf("api-auth") > 0){
            return null;
        }
        Collection authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
        for(Object authoritie : authorities){
            String authoritieString = authoritie.toString();
            if(authoritieString.indexOf(uri) > 0){
                return null;
            }
        }
        ctx.setSendZuulResponse(false);
        ctx.setResponseStatusCode(401);
        ctx.setResponseBody("{\"message\":\"you have no permission to visit this resource!\"}");// 输出最终结果
        return null;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public int filterOrder() {
        return 0;
    }

    @Override
    public String filterType() {
        return "pre";// 在请求被处理之后，会进入该过滤器
    }
}
