package com.github.wangdasong.scwrouteconsumer.filter;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.netflix.zuul.filters.route.RibbonCommandContext;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.rmi.UnexpectedException;
import java.util.Collection;

@Component
public class LogoutFilter extends ZuulFilter {
    @Autowired
    RestTemplate restTemplate;

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();
        HttpServletResponse response = ctx.getResponse();
        String uri = request.getRequestURI();
        //如果请求路径为登出
        if (uri.indexOf("api-auth/uaa/user/logout") > 0) {
            Cookie cookies[] = request.getCookies();
            if (cookies != null) {
                for (int i = 0; i < cookies.length; i++) {
                    //将cookies中的登录子系统code清空
                    if (!cookies[i].getName().equals("subsysCode")) {
                        Cookie cookie = new Cookie(cookies[i].getName(), "");//这边得用"",不能用null
                        cookie.setPath("/");//设置成跟写入cookies一样的
                        cookie.setMaxAge(0);
                        response.addCookie(cookie);
                    }
                }
            }
            request.getSession().invalidate();
        }
        return null;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public int filterOrder() {
        return 1;
    }

    @Override
    public String filterType() {
        return "post";//处理请求iu之后，会进入该过滤器
    }
}
