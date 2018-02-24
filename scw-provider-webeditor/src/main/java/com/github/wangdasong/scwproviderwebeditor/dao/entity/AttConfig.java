/********************************************************************
 *
 * Copyright 2016-2017 nsw All rights reserved
 *
 ********************************************************************/
package com.github.wangdasong.scwproviderwebeditor.dao.entity;


import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;

import java.util.Date;

public class AttConfig extends BaseEntity {

	private static final long serialVersionUID = 985972471391063282L;

	private String code;
    private String name;
    private String type;
    private String attValue;
    private String nullAble;
    private String attDefault;
    private String attComment;
    private String belongType;
    private String belongId;


    public String getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public String getAttValue() {
        return attValue;
    }

    public String getNullAble() {
        return nullAble;
    }

    public String getAttDefault() {
        return attDefault;
    }

    public String getAttComment() {
        return attComment;
    }

    public String getBelongType() {
        return belongType;
    }

    public String getBelongId() {
        return belongId;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public String getCreateUserId() {
        return createUserId;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public String getUpdateUserId() {
        return updateUserId;
    }



    public void setId(String id) {
        this.id = id;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setAttValue(String attValue) {
        this.attValue = attValue;
    }

    public void setNullAble(String nullAble) {
        this.nullAble = nullAble;
    }

    public void setAttDefault(String attDefault) {
        this.attDefault = attDefault;
    }

    public void setAttComment(String attComment) {
        this.attComment = attComment;
    }

    public void setBelongType(String belongType) {
        this.belongType = belongType;
    }

    public void setBelongId(String belongId) {
        this.belongId = belongId;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public void setCreateUserId(String createUserId) {
        this.createUserId = createUserId;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public void setUpdateUserId(String updateUserId) {
        this.updateUserId = updateUserId;
    }


}
