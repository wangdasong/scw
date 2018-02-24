package com.github.wangdasong.scwbasecore.service.impl;

import com.github.wangdasong.scwbasecore.dao.entity.base.BaseEntity;
import com.github.wangdasong.scwbasecore.dao.entity.base.BaseUser;
import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.service.base.BaseService;
import com.github.wangdasong.scwbasecore.utils.ThreadVariable;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwbasecore.utils.paging.TablePagingService;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.*;

public abstract class BaseServiceImpl<T extends BaseEntity> implements BaseService<T>, TablePagingService {

	private Class<T> persistentClass;

	public abstract BaseDaoMapper<T> getCurrDaoMapper();

	/** 
     * 通过反射, 获得定义Class时声明的父类的泛型参数的类型. 如无法找�?, 返回Object.class. 
     *  
     *@param clazz 
     *            clazz The class to introspect 
     * @param index 
     *            the Index of the generic ddeclaration,start from 0. 
     * @return the index generic declaration, or Object.class if cannot be 
     *         determined 
     */  
    @SuppressWarnings("unchecked")  
    public static Class getSuperClassGenricType(final Class clazz, final int index) {  
          
        //返回表示Class �?表示的实体（类接口基本类型或 void）的直接超类�? Type�?  
        Type genType = clazz.getGenericSuperclass();  
  
        if (!(genType instanceof ParameterizedType)) {  
           return Object.class;  
        }  
        //返回表示此类型实际类型参数的 Type 对象的数组�??  
        Type[] params = ((ParameterizedType) genType).getActualTypeArguments();  
  
        if (index >= params.length || index < 0) {  
                     return Object.class;  
        }  
        if (!(params[index] instanceof Class)) {  
              return Object.class;  
        }  
  
        return (Class) params[index];  
    }

	@Override
	public T addEntity(T t) {
		Date currTime = new Date();
		BaseUser loginUser = null;
		loginUser = (BaseUser) ThreadVariable.getUser();
		t.setCreateDate(currTime);
		t.setUpdateDate(currTime);
		if(loginUser != null){
			t.setCreateUserId(loginUser.getCreateUserId());
			t.setUpdateUserId(loginUser.getCreateUserId());
		}
		this.getCurrDaoMapper().save(t);
		return t;
	}

	@Override
	public T editEntity(T t) {
		Date currTime = new Date();
		BaseUser loginUser = null;
		loginUser = (BaseUser) ThreadVariable.getUser();
		t.setCreateDate(currTime);
		t.setUpdateDate(currTime);
		if(loginUser != null){
			t.setCreateUserId(loginUser.getCreateUserId());
			t.setUpdateUserId(loginUser.getCreateUserId());
		}
		this.getCurrDaoMapper().update(t);
		return t;
	}

	@Override
	public T getEntityById(String id){
		return this.getCurrDaoMapper().getById(id);
	}
	@Override
	public T getEntityDetailById(String id){
		return this.getCurrDaoMapper().getDetailById(id);
	}
	@Override
	public T delEntity(String id) {
		//获取删除前的Entity
		T t = this.getCurrDaoMapper().getById(id);
		//按照ID删除Entity
		this.getCurrDaoMapper().deleteById(id);
		return t;
	}

	@Override
	public List<T> getEntityListByCondition(T t) {
		return this.getCurrDaoMapper().getListByCondition(t);
	}

	@Override
	public Pagination getEntityPage(int pageNo, int size, String sort, T t) {
		Pagination pr = new Pagination(pageNo, size, sort, this);
		try {
			pr.doPage(t);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return pr;
	}

	@Override
	public int getCount(Pagination page) {
		return this.getCurrDaoMapper().getCount(page);
	}

	@Override
	public List findPageData(Pagination page) {
		return this.getCurrDaoMapper().findPageData(page);
	}
}
