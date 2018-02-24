package com.github.wangdasong.scwbasecore.utils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ConvertObject {
	
	public static Map modelsToMap(Object... obj) throws Exception{
		Map<String, Object> resultMap = new HashMap<String, Object>();
		if(obj == null){
			return resultMap;
		}
		for(int i = 0; i < obj.length; i++){
			if(obj[i] == null){
				continue;
			}
			String className = obj[i].getClass().getName();
			String shortClassName = className.substring(className.lastIndexOf(".")+1);
			Class clazzModel = Class.forName(className);
			Field fields[] = clazzModel.getDeclaredFields();

			List fieldNameList = new ArrayList();
			for (int j = 0; j < fields.length; j++ ){
				String fieldName = fields[j].getName();
				fieldNameList.add(fieldName);
				String headChar = fieldName.substring(0,1);
				headChar = headChar.toUpperCase();
				String methodName = "get" + headChar + fieldName.substring(1);
				try{
					Object fieldValue = clazzModel.getMethod(methodName).invoke(obj[i]);
					if(obj.length == 1 ){
						resultMap.put(fieldName, fieldValue);
					}else{
						resultMap.put(shortClassName+"_"+fieldName, fieldValue);
					}
				}catch(Exception e){
					//System.out.println("methodName["+methodName+"] is not fond");
				}
			}
			superClassToMap(resultMap, fieldNameList, obj.length, shortClassName, obj[i].getClass(), obj[i]);
//			if(obj[i].getClass().getSuperclass() != null){
//				String superClassName = obj[i].getClass().getSuperclass().getName();
//				Class superClazzModel = Class.forName(superClassName);
//				Field superFields[] = superClazzModel.getDeclaredFields();
//				for (int j = 0; j < superFields.length; j++ ){
//					String fieldName = superFields[j].getName();
//					if(fieldNameList.contains(fieldName)){
//						continue;
//					}
//					String headChar = fieldName.substring(0,1);
//					headChar = headChar.toUpperCase();
//					String methodName = "get" + headChar + fieldName.substring(1);
//					try{
//						Object fieldValue = superClazzModel.getMethod(methodName).invoke(obj[i]);
//						if(obj.length == 1 ){
//							resultMap.put(fieldName, fieldValue);
//						}else{
//							resultMap.put(shortClassName+"_"+fieldName, fieldValue);
//						}
//					}catch(Exception e){
//						//System.out.println("methodName["+methodName+"] is not fond");
//					}
//				}
//			}
		}
		return resultMap;
	}
	private static Map<String, Object> superClassToMap(Map<String, Object> resultMap, List fieldNameList, int ObjCount, String shortClassName, Class clazz, Object obj) throws ClassNotFoundException{
		if(clazz.getSuperclass() != null){
			String superClassName = clazz.getSuperclass().getName();
			Class superClazzModel = Class.forName(superClassName);
			Field superFields[] = superClazzModel.getDeclaredFields();
			for (int j = 0; j < superFields.length; j++ ){
				String fieldName = superFields[j].getName();
				if(fieldNameList.contains(fieldName)){
					continue;
				}
				String headChar = fieldName.substring(0,1);
				headChar = headChar.toUpperCase();
				String methodName = "get" + headChar + fieldName.substring(1);
				try{
					Object fieldValue = superClazzModel.getMethod(methodName).invoke(obj);
					if(ObjCount == 1 ){
						resultMap.put(fieldName, fieldValue);
					}else{
						resultMap.put(shortClassName+"_"+fieldName, fieldValue);
					}
				}catch(Exception e){
					//System.out.println("methodName["+methodName+"] is not fond");
				}
			}
		}
		if(clazz.getSuperclass().getSuperclass() != null){
			superClassToMap(resultMap, fieldNameList, ObjCount, shortClassName, clazz.getSuperclass(), obj);
		}
		return resultMap;
	}

	public static String objectToString(Object obj){
		if(obj == null){
			return "";
		}
		if(obj.getClass() == int.class || obj.getClass() == Integer.class){
			if(obj.equals(0)){
				return "";
			}else{
				return obj + "";
			}
		}
		return obj + "";
	}
}
