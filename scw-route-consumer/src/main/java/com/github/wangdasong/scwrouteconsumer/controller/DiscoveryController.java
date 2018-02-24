package com.github.wangdasong.scwrouteconsumer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/discovery")
public class DiscoveryController {

    @Autowired
    DiscoveryClient discoveryClient;

    @RequestMapping(value = "/service/names")
    @ResponseBody
    public List<String> findServiceNameList() {
        List<String> services = discoveryClient.getServices();
        return services;
    }

    @RequestMapping(value = "/service/instance")
    @ResponseBody
    public List<ServiceInstance> findServiceInstances(String service) {
        List<ServiceInstance> serviceInstances = discoveryClient.getInstances(service);
        return serviceInstances;
    }

}
