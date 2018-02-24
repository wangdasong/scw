package com.github.wangdasong.scwauthserver.controller;

import com.github.wangdasong.scwauthserver.dao.entity.CommonUser;
import com.github.wangdasong.scwauthserver.service.UserService;
import com.github.wangdasong.scwbasecore.controller.base.BaseController;
import com.github.wangdasong.scwbasecore.utils.MD5Util;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.AuthorizationServerTokenServices;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/user")
public class UserController extends BaseController {
    @Autowired
    UserService userService;

    @Qualifier("defaultAuthorizationServerTokenServices")
    @Autowired
    private AuthorizationServerTokenServices authorizationServerTokenServices;


    @RequestMapping("")
    public Principal user(Principal user) {
        return user;
    }

    @RequestMapping("/logout")
    public void logout(Principal principal, HttpServletRequest request, HttpServletResponse response) throws IOException {
        OAuth2Authentication oAuth2Authentication = (OAuth2Authentication) principal;
        DefaultTokenServices defaultTokenServices = (DefaultTokenServices) authorizationServerTokenServices;
        OAuth2AccessToken accessToken = authorizationServerTokenServices.getAccessToken(oAuth2Authentication);
        defaultTokenServices.revokeToken(accessToken.getValue());
        request.getSession().invalidate();
        String currReferer = request.getHeader("Referer");
        response.sendRedirect(currReferer);
        return;
    }

    @RequestMapping("/detailInfo")
    public CommonUser detailInfo(Principal user){
        CommonUser commonUser = new CommonUser();
        String username = user.getName();
        commonUser.setUsername(username);
        commonUser = userService.getEntityListByCondition(commonUser).get(0);
        return commonUser;
    }


    /**
     * 构造页面请求
     */
    @RequestMapping("/list")
    public Pagination findUserPage(Pagination page, CommonUser user){
        Pagination rePage = null;
        rePage = userService.getEntityPage(page.getPageNumber(), page.getPageSize(),page.getPageSort(), user);
        return rePage;
    }

    /**
     * 批量删除请求
     */
    @RequestMapping(value = "/batdel")
    public Pagination batDel(Pagination page, CommonUser user, String[] ids){
        Pagination rePage = null;
        for(String id : ids){
            System.out.println("id = "+ id);
        }
        rePage = userService.getEntityPage(page.getPageNumber(), page.getPageSize(),page.getPageSort(), user);
        return rePage;
    }
    /**
     * 修改
     */
    @RequestMapping(value = "/edit")
    public CommonUser edit(CommonUser user){
        userService.editEntity(user);
        return user;
    }
    /**
     * 新增
     */
    @RequestMapping(value = "/add")
    public CommonUser add(CommonUser user){
        if("".equals(user.getId())){
            user.setId(null);
        }
        if("".equals(user.getPassword()) || null == user.getPassword()){
            user.setPassword(MD5Util.getMd5Value("123456"));
        }
        userService.addEntity(user);
        return user;
    }
    /**
     * 删除
     */
    @RequestMapping(value = "/del")
    public CommonUser del(CommonUser user){
        userService.delEntity(user.getId());
        return user;
    }


}
