package com.emp.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CloseableUtils {

    private static final Logger logger = LoggerFactory.getLogger(CloseableUtils.class);

    private CloseableUtils() {
    }

    public static void close(AutoCloseable s) {
        if (s != null) {
            try {
                s.close();
                s = null;
            } catch (Exception var2) {
                logger.error("关闭失败", var2);
            }
        }
    }
}
