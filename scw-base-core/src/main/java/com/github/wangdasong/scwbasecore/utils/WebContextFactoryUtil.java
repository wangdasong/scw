package com.github.wangdasong.scwbasecore.utils;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Service;

@Service
public class WebContextFactoryUtil implements ApplicationContextAware {
    /** 
     * Spring 应用上下文环�? 
     */  
    private static ApplicationContext applicationContext;
  
    /** 
     * 实现ApplicationContextAware接口的回调方�?,设置上下文环�? 
     *  
     * @param applicationContext 
     * @throws BeansException
     */  
    @SuppressWarnings("static-access")
    @Override
    public void setApplicationContext(ApplicationContext applicationContext)
            throws BeansException
    {  
        this.applicationContext = applicationContext;  
    }  
  
    /** 
     * @return ApplicationContext 
     */  
    public static ApplicationContext getApplicationContext()
    {  
        return applicationContext;  
    }  
  
    /** 
     * 获取对象 
     *  
     * @param beanName
     * @return Object bean的实�? 
     * @throws BeansException
     */  
    public static Object getBean(String beanName) throws BeansException
    {  
        if (!WebContextFactoryUtil.containsBean(beanName))  
        {  
            return null;  
        } else  
        {  
            return applicationContext.getBean(beanName);  
        }  
    }  
  
    /** 
     * 获取类型为requiredType的对�? 
     * 如果bean不能被类型转换，相应的异常将会被抛出（BeanNotOfRequiredTypeException�? 
     *  
     * @param name 
     *            bean注册�? 
     * @param requiredType 
     *            返回对象类型 
     * @return Object 返回requiredType类型对象 
     * @throws BeansException
     */  
    @SuppressWarnings({ "unchecked", "rawtypes" })  
    public static Object getBean(String name, Class requiredType)  
            throws BeansException
    {  
        return applicationContext.getBean(name, requiredType);  
    }  
  
    /** 
     * 如果BeanFactory包含�?个与�?给名称匹配的bean定义,则返回true 
     *  
     * @param name 
     * @return boolean 
     */  
    public static boolean containsBean(String name)  
    {  
        return applicationContext.containsBean(name);  
    }  
  
    /** 
     * 判断以给定名字注册的bean定义是一个singleton还是�?个prototype�? 
     * 如果与给定名字相应的bean定义没有被找�?,将会抛出�?个异常（NoSuchBeanDefinitionException�? 
     *  
     * @param name 
     * @return boolean 
     * @throws NoSuchBeanDefinitionException
     */  
    public static boolean isSingleton(String name)  
            throws NoSuchBeanDefinitionException
    {  
        return applicationContext.isSingleton(name);  
    }  
  
    /** 
     * @param name 
     * @return Class 注册对象的类�? 
     * @throws NoSuchBeanDefinitionException
     */  
    @SuppressWarnings("rawtypes")  
    public static Class getType(String name)  
            throws NoSuchBeanDefinitionException
    {  
        return applicationContext.getType(name);  
    }  
  
    /** 
     * 如果给定的bean名字在bean定义中有别名,则返回这些别�? 
     *  
     * @param name 
     * @return 
     * @throws NoSuchBeanDefinitionException
     */  
    public static String[] getAliases(String name)  
            throws NoSuchBeanDefinitionException
    {  
        return applicationContext.getAliases(name);  
    } 
}
