package com.emp.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ResultBuilder {

    private static final Logger logger = LoggerFactory.getLogger(ResultBuilder.class);
    private Object payload;
    private int code;
    private String tips;
    private String exception;

    private ResultBuilder() {
    }

    public static ResultBuilder withPayload(Object payload) {
        ResultBuilder builder = new ResultBuilder();
        builder.payload = payload;
        builder.code = 1;
        builder.tips = "success";
        return builder;
    }

    public static ResultBuilder error(Throwable e) {
        logger.error("", e);
        ResultBuilder builder = new ResultBuilder();
        builder.code = 0;
        builder.tips = e.getMessage();
        builder.exception = ExceptionUtils.getPrintMessage(e);
        return builder;
    }

    public static ResultBuilder error(String tips, Throwable e) {
        logger.error(tips, e);
        ResultBuilder builder = new ResultBuilder();
        builder.code = 0;
        builder.tips = tips;
        builder.exception = ExceptionUtils.getPrintMessage(e);
        return builder;
    }

    public static ResultBuilder error(String tips, Throwable e, Object payload) {
        logger.error(tips, e);
        ResultBuilder builder = new ResultBuilder();
        builder.code = 0;
        builder.tips = tips;
        builder.exception = ExceptionUtils.getPrintMessage(e);
        builder.payload = payload;
        return builder;
    }

    public static ResultBuilder error(String tips) {
        ResultBuilder builder = new ResultBuilder();
        builder.code = 0;
        builder.tips = tips;
        return builder;
    }

    public static ResultBuilder success() {
        ResultBuilder builder = new ResultBuilder();
        builder.code = 1;
        builder.tips = "success";
        return builder;
    }

    public ResultBuilder tips(String tips) {
        this.tips = tips;
        return this;
    }

    public ResultBuilder code(int code) {
        this.code = code;
        return this;
    }

    public Result build() {
        Result result = new Result();
        result.setCode(this.code);
        result.setPayload(this.payload);
        result.setTips(this.tips);
        result.setException(this.exception);
        return result;
    }
}
