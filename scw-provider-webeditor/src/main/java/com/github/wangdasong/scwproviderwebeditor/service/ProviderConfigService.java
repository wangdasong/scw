package com.github.wangdasong.scwproviderwebeditor.service;

import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwproviderwebeditor.dao.entity.ProviderConfig;

import java.util.List;

public interface ProviderConfigService {
    public List<ProviderConfig> getProviderConfigsByCode(String providerConfigCode);
    public Pagination getProviderConfigPage(int pageNo, int size, String sort, ProviderConfig providerConfig);
    public void add(ProviderConfig providerConfig);
    public void edit(ProviderConfig providerConfig);
    public void del(String pcid);
}
