package com.github.wangdasong.scwbasecore.utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;


/**
 * @author 王大嵩  创建时间2016-12-16
 * 功能
 * 修改     日期      版本      描述
 */

@Component
public class JsonDateSerializer extends JsonSerializer<Date> {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    @Override 
    public void serialize(Date date, JsonGenerator gen, SerializerProvider provider)
             throws IOException, JsonProcessingException {
        String formattedDate = dateFormat.format(date); 
        gen.writeString(formattedDate); 
    }
}

