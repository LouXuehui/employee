package com.emp.kit;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EncryptKit {
    private static final Logger logger = LoggerFactory.getLogger(EncryptKit.class);

    public EncryptKit() {
    }

    public static String md5(String text) {
        try {
            MessageDigest md5 = MessageDigest.getInstance("MD5");
            md5.update(text.getBytes());
            String result = toHex(md5.digest());
            return result;
        } catch (NoSuchAlgorithmException var3) {
            throw new RuntimeException("不存在MD5算法实现类", var3);
        }
    }

    private static String toHex(byte[] bytes) {
        char[] HEX_DIGITS = "0123456789abcdef".toCharArray();
        StringBuilder ret = new StringBuilder(bytes.length * 2);

        for(int i = 0; i < bytes.length; ++i) {
            ret.append(HEX_DIGITS[bytes[i] >> 4 & 15]);
            ret.append(HEX_DIGITS[bytes[i] & 15]);
        }

        return ret.toString();
    }
}
