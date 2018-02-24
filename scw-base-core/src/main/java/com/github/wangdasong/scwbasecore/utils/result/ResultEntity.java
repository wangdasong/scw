package com.github.wangdasong.scwbasecore.utils.result;

import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;

public class ResultEntity<T extends BaseEntity> extends ResultBaseBean<T> {

    public ResultEntity(T t) {
        super(t);
    }
}
