package com.github.wangdasong.scwbasecore.service.base;


import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;
import com.github.wangdasong.scwbasecore.dao.entity.base.TreeDataEntity;

public interface TreeDataService<T extends BaseEntity>{
	TreeDataEntity getTreeDataListByParentId(String parentId, T queryCondition);
}
