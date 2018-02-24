package com.github.wangdasong.scwbasecore.utils.request;

import net.sf.json.JSONObject;

public class ScwRequestBody {
    public static final String REQUEST_METHOD_GET = "0";
    public static final String REQUEST_METHOD_POST = "1";

    String requestUrl;
    String paraBody;
    String method;

    public String getRequestUrl() {
        return requestUrl;
    }

    public void setRequestUrl(String requestUrl) {
        this.requestUrl = requestUrl;
    }


    public JSONObject getParaJsonBody() {
        return JSONObject.fromObject(paraBody);
    }

    public void setParaBody(String paraBody) {
        this.paraBody = paraBody;
    }

    public String getParaBody() {
        return paraBody;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public static ScwRequestBody fromObject(String jsonString){
        JSONObject jsonObject  = JSONObject.fromObject(jsonString);
        ScwRequestBody scwRequestBody = new ScwRequestBody();
        scwRequestBody.setRequestUrl(jsonObject.get("requestUrl").toString());
        scwRequestBody.setParaBody(jsonObject.get("paraBody").toString());
        return scwRequestBody;
    }
}
