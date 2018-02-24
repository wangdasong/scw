package com.github.wangdasong.scwbasecore.service.base;

import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;
import com.github.wangdasong.scwbasecore.dao.entity.base.DataSrcEntity;

import java.util.List;

public interface DataSrcService<T extends BaseEntity> {

	List<DataSrcEntity> getDataSrcListByCondition(T t);
}
