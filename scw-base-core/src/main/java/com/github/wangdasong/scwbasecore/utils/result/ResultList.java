package com.github.wangdasong.scwbasecore.utils.result;

import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;

import java.util.List;

public class ResultList<T extends BaseEntity> extends ResultBaseBean<List<T>> {

    public ResultList(List<T> ts) {
        super(ts);
    }
}
