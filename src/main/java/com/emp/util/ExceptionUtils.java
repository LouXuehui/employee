package com.emp.util;

import java.io.PrintWriter;
import java.io.StringWriter;

public class ExceptionUtils {

    public static String getPrintMessage(Throwable e) {
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        e.printStackTrace(printWriter);
        String string = stringWriter.toString();
        CloseableUtils.close(printWriter);
        CloseableUtils.close(stringWriter);
        return string;
    }
}
