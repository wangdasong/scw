package com.github.wangdasong.scwrouteconsumer.controller;

import com.github.wangdasong.scwbasecore.CoreConstants;
import com.github.wangdasong.scwbasecore.utils.request.ScwRequestBody;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Map;

@RestController
@RequestMapping(value = "/api")
public class CommonBusinessController {
    @Autowired
    RestTemplate restTemplate;

    @RequestMapping(value = "/{service}/{controller}/{method}", method = RequestMethod.POST, consumes="application/x-www-form-urlencoded")
    @ResponseBody
    public String doCommonBusinessPostFormData(@PathVariable String service,
                                               @PathVariable String controller,
                                               @PathVariable String method,
                                               @RequestParam Map<String,String> requestMap) {
        ScwRequestBody scwRequestBody = new ScwRequestBody();
        scwRequestBody.setRequestUrl("/" + controller + "/" + method);
        String paraBody = "";
        if(requestMap.size() > 0){
            paraBody = JSONObject.fromObject(requestMap).toString();
        }
        scwRequestBody.setParaBody(paraBody);
        scwRequestBody.setMethod("POST");
        String scwRequestBodyString = JSONObject.fromObject(scwRequestBody).toString();
        return restTemplate.postForObject("http://" + service + CoreConstants.FEIGN_COMMON_BUSINESS_URL, scwRequestBodyString, String.class);
    }

    @RequestMapping(value = "/{service}/{controller}/{method}", method = RequestMethod.POST, consumes="application/json")
    @ResponseBody
    public String doCommonBusinessPostJsonData(@PathVariable String service,
                              @PathVariable String controller,
                              @PathVariable String method,
                              @RequestBody String requestBody) {
        ScwRequestBody scwRequestBody = new ScwRequestBody();
        scwRequestBody.setRequestUrl("/" + controller + "/" + method);
        scwRequestBody.setParaBody(requestBody);
        scwRequestBody.setMethod("POST");
        String scwRequestBodyString = JSONObject.fromObject(scwRequestBody).toString();
        return restTemplate.postForObject("http://" + service + CoreConstants.FEIGN_COMMON_BUSINESS_URL, scwRequestBodyString, String.class);
    }

    @RequestMapping(value = "/{service}/{controller}/{method}", method = RequestMethod.GET)
    @ResponseBody
    public String doCommonBusinessGetData(@PathVariable String service,
                                           @PathVariable String controller,
                                           @PathVariable String method,
                                           @RequestParam Map<String,String> requestMap) {

        ScwRequestBody scwRequestBody = new ScwRequestBody();
        scwRequestBody.setRequestUrl("/" + controller + "/" + method);
        String paraBody = "";
        if(requestMap.size() > 0){
            paraBody = JSONObject.fromObject(requestMap).toString();
        }
        scwRequestBody.setParaBody(paraBody);
        scwRequestBody.setMethod("GET");
        String scwRequestBodyString = "";
        try {
            scwRequestBodyString = URLEncoder.encode( JSONObject.fromObject(scwRequestBody).toString(), "utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return restTemplate.getForObject("http://" + service + CoreConstants.FEIGN_COMMON_BUSINESS_URL + "?requestBody=" + scwRequestBodyString, String.class);
    }
}
