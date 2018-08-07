package com.github.wangdasong.scwbasetask.redis;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import com.fasterxml.jackson.annotation.PropertyAccessor;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.jedis.JedisConnection;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisConnectionUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;

import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.JedisShardInfo;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

public class RedisService {
	public RedisService(){};
	private RedisTemplate redisTemplate = null;
	public RedisService(RedisConfig redisConfig){
		if(redisTemplate != null){
			return;
		}
		JedisPoolConfig config = new JedisPoolConfig();
		config.setMaxIdle(redisConfig.getMaxIdle());
		config.setMaxWaitMillis(redisConfig.getMaxWait());
		config.setMaxTotal(redisConfig.getMaxActive());
		config.setTestOnBorrow(true);
		config.setTestOnReturn(true);
		config.setTestWhileIdle(true);
		config.setMinEvictableIdleTimeMillis(60000L);
		config.setTimeBetweenEvictionRunsMillis(3000L);
		config.setNumTestsPerEvictionRun(-1);
		JedisConnectionFactory redisConnectionFactory = new JedisConnectionFactory();
		redisConnectionFactory.setHostName(redisConfig.getHost());
		redisConnectionFactory.setPort(redisConfig.getPort());
		redisConnectionFactory.setPassword(redisConfig.getPassword());
		redisConnectionFactory.setTimeout(redisConfig.getTimeOut());
		redisConnectionFactory.setPoolConfig(config);
		StringRedisTemplate template = new StringRedisTemplate(redisConnectionFactory);
		// 定义key序列化方式
//		RedisSerializer<String> redisSerializer = new StringRedisSerializer();// Long类型会出现异常信息;需要我们上面的自定义key生成策略，一般没必要
		// 定义value的序列化方式
		Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(
				Object.class);
		ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL,
                JsonAutoDetect.Visibility.ANY);
		om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
		// template.setKeySerializer(redisSerializer);
		template.setValueSerializer(jackson2JsonRedisSerializer);
		template.setHashValueSerializer(jackson2JsonRedisSerializer);
		template.afterPropertiesSet();
		JedisShardInfo shardInfo =new JedisShardInfo(redisConfig.getHost(), redisConfig.getPort(), redisConfig.getTimeOut());
		redisConnectionFactory.setShardInfo(shardInfo);
		this.redisTemplate = template;
	}
	
	/**
     * 写入缓存
     * @param key
     * @param value
     * @return
     */
    public boolean set(final String key, final String value) {
        boolean result = false;
        try {
            ValueOperations<Serializable, Object> operations = redisTemplate.opsForValue();
            operations.set(key, value);
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
    /**
     * 写入缓存设置时效时间
     * @param key
     * @param value
     * @return
     */
    public boolean set(final String key,final String value, final Long expireTime) {
        boolean result = false;
        try {
            ValueOperations<Serializable, Object> operations = redisTemplate.opsForValue();
            operations.set(key, value);
            redisTemplate.expire(key, expireTime, TimeUnit.SECONDS);
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
    /**
     * 批量删除对应的value
     * @param keys
     */
    public void remove(final String... keys) {
    	redisTemplate.execute(new RedisCallback<Boolean>() {  
            @Override  
            public Boolean doInRedis(RedisConnection connection) throws DataAccessException {  
                RedisSerializer<String> serializer = redisTemplate.getStringSerializer();  
                for (String key : keys) {
                	Boolean exists = connection.exists(serializer.serialize(key));
                	if(exists){
                		 Long del = connection.del(serializer.serialize(key));
                	}
				}
                connection.close();
                return true;
            }  
        }); 
    }

    /**
     * 批量删除key
     * @param pattern
     */
    public void removePattern(final String pattern) {
      /* Set<Serializable> keys = redisTemplate.keys(pattern);
        if (keys.size() > 0)
            redisTemplate.delete(keys);*/
    	redisTemplate.execute(new RedisCallback<Boolean>() {  
            @Override  
            public Boolean doInRedis(RedisConnection connection) throws DataAccessException {  
                RedisSerializer<String> serializer = redisTemplate.getStringSerializer();  
                Set<byte[]> keys = connection.keys(serializer.serialize(pattern));
                if(keys!=null&&keys.size()>0){
                	 for (byte[] bs : keys) {
                		 Boolean exists = connection.exists(bs);
                     	if(exists){
                     		 Long del = connection.del(bs);
                     	}
     				}
                }
                connection.close();
                return true;
            }  
        }); 
    }
    /**
     * 删除对应的value
     * @param key
     */
    public void remove(final String key) {
        /*if (exists(key)) {
            redisTemplate.delete(key);
        }*/
    	redisTemplate.execute(new RedisCallback<Boolean>() {  
            @Override  
            public Boolean doInRedis(RedisConnection connection) throws DataAccessException {  
                RedisSerializer<String> serializer = redisTemplate.getStringSerializer();  
            	Boolean exists = connection.exists(serializer.serialize(key));
            	if(exists){
            		 Long del = connection.del(serializer.serialize(key));
            	}
                connection.close();
                return true;
            }  
        }); 
    }
    /**
     * 判断缓存中是否有对应的value
     * @param key
     * @return
     */
    public boolean exists(final String key) {
        return (boolean) redisTemplate.execute(new RedisCallback<Boolean>() {  
            @Override  
            public Boolean doInRedis(RedisConnection connection) throws DataAccessException {  
                RedisSerializer<String> serializer = redisTemplate.getStringSerializer();  
            	Boolean exists = connection.exists(serializer.serialize(key));
                connection.close();
                return exists;
            }  
        }); 
    }
    /**
     * 读取缓存
     * @param key
     * @return
     */
    public Object get(final String key) {
        Object result = null;
        ValueOperations<Serializable, Object> operations = redisTemplate.opsForValue();
        result = operations.get(key);
        return result;
    	/*return redisTemplate.execute(new RedisCallback<String>() {  
            @Override  
            public String doInRedis(RedisConnection connection) throws DataAccessException {  
                RedisSerializer<String> serializer = redisTemplate.getStringSerializer();  
                byte[] bs = connection.get(serializer.serialize(key));
                
                connection.close();
                return serializer.deserialize(bs);  
            }  
        });  */
    }
    /**
     * 哈希 添加
     * @param key
     * @param hashKey
     * @param value
     */
    public Boolean hmSet(final String key, final String hashKey, final String value){
        HashOperations<String, Object, Object> hash = redisTemplate.opsForHash();
        hash.put(key,hashKey,value);
        return true;
    	/*return (Boolean) redisTemplate.execute(new RedisCallback<Boolean>() {  
             @Override  
             public Boolean doInRedis(RedisConnection connection) throws DataAccessException {  
                 RedisSerializer<String> serializer = redisTemplate.getStringSerializer();  
                 connection.hSet(serializer.serialize(key), serializer.serialize(hashKey),serializer.serialize(value));  
                 connection.close();
                 return true;  
             }  
         });  */
    }

    /**
     * 哈希获取数据
     * @param key
     * @param hashKey
     * @return
     */
    public Object hmGet(final String key,final String hashKey){
        HashOperations<String, Object, Object>  hash = redisTemplate.opsForHash();
        return hash.get(key,hashKey);
    	/*return redisTemplate.execute(new RedisCallback<String>() {  
            @Override  
            public String doInRedis(RedisConnection connection) throws DataAccessException {  
                RedisSerializer<String> serializer = redisTemplate.getStringSerializer();  
                byte[] hGet = connection.hGet(serializer.serialize(key), serializer.serialize(hashKey));
                connection.close();
                return serializer.deserialize(hGet);  
            }  
        });  */
    }

    /**
     * 列表添加
     * @param k
     * @param v
     */
    public void lPush(final String k,final String v){
        ListOperations<String, Object> list = redisTemplate.opsForList();
        list.rightPush(k,v);
    	/*redisTemplate.execute(new RedisCallback<Long>() {  
            @Override  
            public Long doInRedis(RedisConnection connection) throws DataAccessException {  
                RedisSerializer<String> serializer = redisTemplate.getStringSerializer();  
                Long lPush = connection.lPush(serializer.serialize(k), serializer.serialize(v));
                connection.close();
                return lPush;
            }  
        });  */
    }

    /**
     * 列表获取
     * @param k
     * @param l
     * @param l1
     * @return
     */
    public List<Object> lRange(final String k, final long l, final long l1){
        ListOperations<String, Object> list = redisTemplate.opsForList();
        return list.range(k,l,l1);
    /*	return (List<Object>) redisTemplate.execute(new RedisCallback<List<Object>>() {  
            @Override  
            public List<Object> doInRedis(RedisConnection connection) throws DataAccessException {  
                RedisSerializer<String> serializer = redisTemplate.getStringSerializer(); 
                List<byte[]> lRange = connection.lRange(serializer.serialize(k), l, l1);
                List<Object> llist= new ArrayList<Object>();
                for (byte[] bs : lRange) {
					String deserialize = serializer.deserialize(bs);
					llist.add(deserialize);
				}
                connection.close();
                return llist;
            }  
        });  */
    	
    }

    /**
     * 集合添加
     * @param key
     * @param value
     */
    public void add(String key,Object value){
        SetOperations<String, Object> set = redisTemplate.opsForSet();
        set.add(key,value);
    }

    /**
     * 集合获取
     * @param key
     * @return
     */
    public Set<Object> setMembers(String key){
        SetOperations<String, Object> set = redisTemplate.opsForSet();
        return set.members(key);
    }

    /**
     * 有序集合添加
     * @param key
     * @param value
     * @param scoure
     */
    public void zAdd(String key,Object value,double scoure){
        ZSetOperations<String, Object> zset = redisTemplate.opsForZSet();
        zset.add(key,value,scoure);
    }

    /**
     * 有序集合获取
     * @param key
     * @param scoure
     * @param scoure1
     * @return
     */
    public Set<Object> rangeByScore(String key,double scoure,double scoure1){
        ZSetOperations<String, Object> zset = redisTemplate.opsForZSet();
        return zset.rangeByScore(key, scoure, scoure1);
    }
   /**
    * 获取redis服务器时间
    */
    public Long getTime(){
    	RedisConnectionFactory connectionFactory = redisTemplate.getConnectionFactory();
		RedisConnection bindConnection = RedisConnectionUtils.bindConnection(connectionFactory);
		Long time = bindConnection.time();
		RedisConnectionUtils.unbindConnection(connectionFactory);
    	return time;
    }
    /**
     * hdel hash 删除
     */
    public void hdel(final String key,final String field){
    	HashOperations opsForHash = redisTemplate.opsForHash();
    	opsForHash.delete(key, field);
    	/*redisTemplate.execute(new RedisCallback<Long>() {  
            @Override  
            public Long doInRedis(RedisConnection connection) throws DataAccessException {  
                RedisSerializer<String> serializer = redisTemplate.getStringSerializer(); 
                Long hDel = connection.hDel(serializer.serialize(key),serializer.serialize(field));
                connection.close();
                return hDel;
            }  
        });  */
    }
    /**
     * hash 查询全部
     */
    public Map hgetAll(final String key){
    	HashOperations opsForHash = redisTemplate.opsForHash();
    	Map entries = opsForHash.entries(key);
    	return entries;
    	/*return (Map) redisTemplate.execute(new RedisCallback<Map>() {  
            @Override  
            public Map doInRedis(RedisConnection connection) throws DataAccessException {  
                RedisSerializer<String> serializer = redisTemplate.getStringSerializer(); 
                Map<byte[], byte[]> hGetAll = connection.hGetAll(serializer.serialize(key));
                Map<String,String> map = new HashMap<String, String>();
                Set<byte[]> keySet = hGetAll.keySet();
                for (byte[] bs : keySet) {
                	map.put(serializer.deserialize(bs), serializer.deserialize(hGetAll.get(bs)));
				}
                connection.close();
                return map;
            }  
        });  */
    }
    /**
     * 获取jedis
     */
    public RedisTemplate<String, Object> getTemplate(){
    	return redisTemplate;
    }
    /**
     * 关闭连接
     */
    public void close(RedisConnection connection){
    	connection.close();
    }
    public boolean setScheduler(final String key, Object value) {  
        boolean result = false;  
        try {  
            ValueOperations<Serializable, Object> operations = redisTemplate.opsForValue();  
                return operations.setIfAbsent(key, value);  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
        return result;  
    }  
    
}
