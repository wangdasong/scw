package com.github.wangdasong.scwbasecore;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public abstract class CoreConstants {
    public static final String FEIGN_COMMON_BUSINESS_URL = "/api/cbc";

    public static final Gson GSON;
    public static final Gson GSON_FULL;
    public static final Gson DEFAULT_GSON;

    public static final String REST_COMMON_PREFIX = "/common";
    public static final String REST_IMPORT = "/import/{serviceName}/{tableId}";
    public static final String REST_EXPORT = "/export/{serviceName}";
    public static final String DATA_SRC_LIST = "/dataSrcList/{serviceName}";
    public static final String TREE_DATA_LIST = "/treeDataList/{serviceName}/{parentId}";
    public static final String UPLOAD_FILE = "/uploadfile";

    static {

        DEFAULT_GSON = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss")
                .create();

        GSON = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd HH:mm:ss").create();
        GSON_FULL = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd HH:mm:ss").create();
    }
}
