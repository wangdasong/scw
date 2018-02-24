/********************************************************************
 *
 * Copyright 2016-2017 nsw All rights reserved
 *
 ********************************************************************/
package com.github.wangdasong.scwbasecore.dao.entity.base;

import org.springframework.security.core.userdetails.UserDetails;

public abstract class BaseUser extends BaseEntity implements UserDetails {
	private static final long serialVersionUID = -4349769851650560670L;
	private String username;
    private String password;

    public String getUsername() {
        return username == null ? null : username.trim();
    }

    public String getPassword() {
        return password == null ? null : password.trim();
    }

    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }

    public void setPassword(String password) {
    	this.password = password == null ? null : password.trim();
    }
    
}
