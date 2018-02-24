package com.github.wangdasong.scwbasecore.utils;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;


public class MapUtils {

	public static HashMap<String, String> MapEmptyForNull (HashMap<String, String> options) {
		// 取得Map中所有健�?
		Set<String> keys = options.keySet( );
		// 如果keys不为空时进行如下操作
		if(keys != null) {
			// 取得keys的游�?
			Iterator<String> iterator = keys.iterator( );
			// 按照keys游标的行数分进行如下操作
			while(iterator.hasNext( )) {
				// 取得行数分键�?
				String key = iterator.next( );
				// 取得键�?�对应对�?
				Object value = options.get(key);
				// 如果该对象存在�?�且为Empty，那么从options中删除该�?
				if (value==null || "".equals(value.toString().trim())) {
					// 从options中删除该�?
					options.put(key, null);
				}else{
					if (!value.toString().trim().equals(value.toString())) {
						options.put(key, value.toString().trim());
					}
				}
			}
			// 释放资源
			iterator = null;
			keys = null;
		}
		
		// 将处理过的HashMap返回给请求端
		return options;
	}


	public static HashMap<String, String> MapEmptyRemove (HashMap<String, String> options) {
		// 由于直接Map.remove会直接改变序列长度，造成精度溢出系统错误，因此在这里复制options到temp
		HashMap<String, String> temp = options;
		// 取得tempMap中所有健�?
		Set<String> keys = temp.keySet( );
		// 如果keys不为空时进行如下操作
		if(keys != null) {
			// 取得keys的游�?
			Iterator<String> iterator = keys.iterator( );
			// 按照keys游标的行数分进行如下操作
			while(iterator.hasNext( )) {
				// 取得行数分键�?
				String key = iterator.next( );
				// 取得键�?�对应对�?
				Object value = temp.get(key);
				// 如果该对象存在�?�且为Empty，那么从options中删除该�?
				if (value==null || "".equals(value.toString())) {
					// 从options中删除该�?
					options.remove(key);
				}
			}
			// 释放资源
			iterator = null;
			keys = null;
			temp = null;
		}
		// 将处理过的HashMap返回给请求端
		return options;
	}
}
