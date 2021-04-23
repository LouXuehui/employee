package com.emp.util;

public class Result {
    private int code;
    private Object payload;
    private String tips;
    private String exception;

    public Result() {
    }

    public int getCode() {
        return this.code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public Object getPayload() {
        return this.payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }

    public String getTips() {
        return this.tips;
    }

    public void setTips(String tips) {
        this.tips = tips;
    }

    public String getException() {
        return this.exception;
    }

    public void setException(String exception) {
        this.exception = exception;
    }
}

