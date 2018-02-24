package com.github.wangdasong.scwbasecore.controller;

import com.github.wangdasong.scwbasecore.CoreConstants;
import com.github.wangdasong.scwbasecore.controller.base.BaseController;
import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;
import com.github.wangdasong.scwbasecore.dao.entity.base.DataSrcEntity;
import com.github.wangdasong.scwbasecore.dao.entity.base.TreeDataEntity;
import com.github.wangdasong.scwbasecore.service.base.DataSrcService;
import com.github.wangdasong.scwbasecore.service.base.TreeDataService;
import com.github.wangdasong.scwbasecore.utils.AopTargetUtils;
import com.github.wangdasong.scwbasecore.utils.WebContextFactoryUtil;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;


@RestController
@RequestMapping(CoreConstants.REST_COMMON_PREFIX)
public class CommonRestController extends BaseController {
    /**
     * 根据条件查询控件元素数据
     */
    @RequestMapping(value = CoreConstants.DATA_SRC_LIST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public List<DataSrcEntity> getDataSrcList(@PathVariable("serviceName")String serviceName, String json){
        List<DataSrcEntity> dataSrcEntityList = null;
        try {
            List<DataSrcEntity> objectList = null;
            DataSrcService dataSrcService = (DataSrcService) WebContextFactoryUtil.getBean(serviceName);
            ParameterizedType parameterizedType = (ParameterizedType) AopTargetUtils.getTarget(dataSrcService).getClass().getGenericInterfaces()[0];
            Class clazz = (Class) parameterizedType.getActualTypeArguments()[0];
            BaseEntity baseEntity;
            baseEntity = (BaseEntity) clazz.newInstance();
            if(!"[]".equals(json)){
                baseEntity = (BaseEntity)CoreConstants.GSON_FULL.fromJson(json, clazz);
            }
            dataSrcEntityList = dataSrcService.getDataSrcListByCondition(baseEntity);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return dataSrcEntityList;
    }

    /**
     * 根据父ID取得树控件列�?
     */
    @RequestMapping(value = CoreConstants.TREE_DATA_LIST)
    public TreeDataEntity getTreeDataList(@PathVariable("serviceName")String serviceName, @PathVariable("parentId")String parentId, String json){
        TreeDataEntity treeDataEntity = null;
        try {
            BaseEntity baseEntity = null;
            TreeDataService treeDataService = (TreeDataService)WebContextFactoryUtil.getBean(serviceName);
            Type[] parameterizedTypeList = AopTargetUtils.getTarget(treeDataService).getClass().getGenericInterfaces();
            ParameterizedType parameterizedType = null;
            for(Type currType : parameterizedTypeList){
                if(currType.toString().indexOf("TreeDataService") > -1){
                    parameterizedType = (ParameterizedType)currType;
                }
            }
            Class clazz = (Class) parameterizedType.getActualTypeArguments()[0];
            baseEntity = (BaseEntity) clazz.newInstance();
            if(!"\"non\"".equals(json)){
                baseEntity = (BaseEntity)CoreConstants.GSON_FULL.fromJson(json, clazz);
            }
            treeDataEntity = treeDataService.getTreeDataListByParentId(parentId, baseEntity);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return treeDataEntity;
    }

}
