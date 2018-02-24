package com.github.wangdasong.scwauthserver.service.impl;

import com.github.wangdasong.scwauthserver.dao.entity.*;
import com.github.wangdasong.scwauthserver.dao.persistence.*;
import com.github.wangdasong.scwauthserver.service.UserService;
import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.service.impl.BaseServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service(value = "userServiceImpl")
public class UserServiceImpl extends BaseServiceImpl<CommonUser> implements UserService, UserDetailsService {

    @Autowired
    UserMapper userMapper;

    @Autowired
    ResourceMapper resMapper;

    @Autowired
    UserRoleMapper urMapper;

    @Autowired
    RoleMapper roleMapper;

    @Autowired
    RolePermissionMapper rpMapper;

    @Autowired
    PermissionMapper pMapper;

    @Autowired
    PermissionResourceMapper presMapper;

    @Override
    public BaseDaoMapper getCurrDaoMapper() {
        return userMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDetails commonUser = userMapper.selectByUsername(username);
        this.loadResourceList((CommonUser)commonUser);
        return commonUser;
    }


    public void loadResourceList(CommonUser commonUser) {
        List<Resource> retResList = new ArrayList<Resource>();

        List<Permission> permissionList = new ArrayList<Permission>();

        List<Role> roleList = new ArrayList<Role>();
        List<String> roleIds = urMapper.getRoleId(commonUser.getId());
        for (String rid : roleIds) {
            Role role = roleMapper.getById(rid);
            roleList.add(role);
            commonUser.setRoleList(roleList);
        }

        for (Role role : roleList) {
            List<Permission> pList = new ArrayList<Permission>();
            List<String> pidList = rpMapper.getPermissionIdList(role.getId());
            for (String pid : pidList) {
                Permission permission = pMapper.getById(pid);
                pList.add(permission);
            }
            role.setPermissionList(pList);
            permissionList.addAll(pList);

        }
        for (Permission permission : permissionList) {
            List<Resource> resourceList = presMapper.getResourceList(permission.getId());
            retResList.addAll(resourceList);
            permission.setResourceList(resourceList);
        }
        return;
    }
}
