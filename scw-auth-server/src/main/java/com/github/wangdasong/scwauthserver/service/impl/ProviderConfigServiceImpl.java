package com.github.wangdasong.scwauthserver.service.impl;

import com.github.wangdasong.scwauthserver.dao.entity.ProviderConfig;
import com.github.wangdasong.scwauthserver.dao.persistence.ProviderConfigMapper;
import com.github.wangdasong.scwauthserver.service.ProviderConfigService;
import com.github.wangdasong.scwbasecore.dao.persistence.base.BaseDaoMapper;
import com.github.wangdasong.scwbasecore.service.impl.BaseServiceImpl;
import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import com.github.wangdasong.scwbasecore.utils.paging.TablePagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProviderConfigServiceImpl extends BaseServiceImpl<ProviderConfig> implements ProviderConfigService, TablePagingService {

    @Autowired
    ProviderConfigMapper providerConfigMapper;
    @Override
    public BaseDaoMapper<ProviderConfig> getCurrDaoMapper() {
        return providerConfigMapper;
    }
    @Override
    public List<ProviderConfig> getProviderConfigsByCode(
            String providerConfigCode) {
        ProviderConfig providerConfig = new ProviderConfig();
        providerConfig.setCode(providerConfigCode);
        return providerConfigMapper.getListByCondition(providerConfig);
    }
    @Override
    public int getCount(Pagination page) {
        return providerConfigMapper.getCount(page);
    }
    @Override
    public List<ProviderConfig> findPageData(Pagination page) {
        return providerConfigMapper.findPageData(page);
    }
    @Override
    public Pagination getProviderConfigPage(int pageNo, int size, String sort,
                                            ProviderConfig providerConfig) {
        Pagination pr = new Pagination(pageNo, size, sort, this);
        try {
            pr.doPage(providerConfig);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return pr;
    }
    @Override
    public void add(ProviderConfig providerConfig) {
        providerConfigMapper.save(providerConfig);
    }
    @Override
    public void edit(ProviderConfig providerConfig) {
        providerConfigMapper.update(providerConfig);
    }
    @Override
    public void del(String pcid) {
        providerConfigMapper.deleteById(pcid);
    }

}
