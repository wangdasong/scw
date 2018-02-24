package com.github.wangdasong.scwrouteconsumer.service;

import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@FeignClient("webeditor-service")
public interface WebEditorService {
    @RequestMapping(value = "/page/list")
    public String findPagePage(@RequestBody Pagination pagination);
}
