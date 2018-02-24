package com.github.wangdasong.scwbasecore.controller.base;

import com.github.wangdasong.scwbasecore.utils.request.ScwRequestBody;
import net.sf.json.JSONObject;
import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.condition.PatternsRequestCondition;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.servlet.support.RequestContextUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.Set;

@RestController
public class BaseController {
    protected String toJsonString(Object object){
        if(object == null) return null;
        return JSONObject.fromObject(object).toString();
    }

    protected String  doCommonBusiness(HttpServletRequest request, HttpServletResponse response, String requestData){
        Object returnObject = null;
        JSONObject.fromObject(requestData);
        ScwRequestBody srb = ScwRequestBody.fromObject(requestData);

        WebApplicationContext wc = WebApplicationContextUtils.getRequiredWebApplicationContext(request.getSession().getServletContext());
        RequestMappingHandlerMapping rmhp = wc.getBean(RequestMappingHandlerMapping.class);
        Map<RequestMappingInfo, HandlerMethod> handlerMethods = rmhp.getHandlerMethods();
        HandlerMethod handlerMethod = null;
        for (RequestMappingInfo rmi : handlerMethods.keySet()) {
            PatternsRequestCondition prc = rmi.getPatternsCondition();
            Set<String> patterns = prc.getPatterns();
            boolean isMatched = false;
            for (String uStr : patterns) {
                if(uStr.equalsIgnoreCase(srb.getRequestUrl())){
                    handlerMethod = handlerMethods.get(rmi);
                    isMatched = true;
                    break;
                }
            }
            if(isMatched){
                break;
            }
        }

        if(handlerMethods.size() > 0){
            Class[] pramtpyesClasses = handlerMethod.getMethod().getParameterTypes();
            Object[] objs = new Object[pramtpyesClasses.length];
            int index = 0;
            for (Class paraClass : pramtpyesClasses) {
                if("HttpServletRequest".equals(paraClass.getName())){
                    objs[index] = request;
                }else if("HttpServletResponse".equals(paraClass.getName())){
                    objs[index] = response;
                }else{
                    objs[index] = JSONObject.toBean(srb.getParaJsonBody(), paraClass);
                }
                index ++;
            }
            try {
                ApplicationContext sac = RequestContextUtils.getWebApplicationContext(request);
                Object controllerBean = sac.getBean(handlerMethod.getBean().toString());
                returnObject = handlerMethod.getMethod().invoke(controllerBean, objs);
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        return this.toJsonString(returnObject);
    }

}
