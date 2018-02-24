package com.github.wangdasong.scwproviderwebeditor.controller.base;

import com.github.wangdasong.scwbasecore.CoreConstants;
import com.github.wangdasong.scwbasecore.controller.base.BaseController;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

@RestController
public class BaseCommonBusinessController extends BaseController{


    @RequestMapping(value = CoreConstants.FEIGN_COMMON_BUSINESS_URL, method = RequestMethod.POST)
    public String doPostCommonBusinessController(HttpServletRequest request, HttpServletResponse response, @RequestBody String requestBody){
        return doCommonBusiness(request, response, requestBody);
    }
    @RequestMapping(value = CoreConstants.FEIGN_COMMON_BUSINESS_URL, method = RequestMethod.GET)
    public String doGetCommonBusinessController(HttpServletRequest request, HttpServletResponse response, @RequestParam String requestBody){
        try {
            requestBody = URLDecoder.decode(requestBody, "utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return doCommonBusiness(request, response, requestBody);
    }
}
