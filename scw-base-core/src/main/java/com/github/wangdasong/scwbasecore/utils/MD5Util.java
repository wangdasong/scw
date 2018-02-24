package com.github.wangdasong.scwbasecore.utils;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MD5Util {
/*	public static String MD5(String sourceStr) {
		try {
			// 获得MD5摘要算法�? MessageDigest对象
			MessageDigest mdInst = MessageDigest.getInstance("MD5");
			// 使用指定的字节更新摘�?
			mdInst.update(sourceStr.getBytes());
			// 获得密文
			byte[] md = mdInst.digest();
			// 把密文转换成十六进制的字符串形式
			StringBuffer buf = new StringBuffer();
			for (int i = 0; i < md.length; i++) {
				int tmp = md[i];
				if (tmp < 0)
					tmp += 256;
				if (tmp < 16)
					buf.append("0");
				buf.append(Integer.toHexString(tmp));
			}
			return buf.toString().substring(8, 24);// 16位加�?
			// return buf.toString();// 32位加�?
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}*/


    /**
     * 32位MD5加密方法
     * 16位可以采取截取字符串的方法getMd5Value("xxx").substring(8, 24);
     *
     * @param sSecret
     * @return
     */
    public static String getMd5Value(String sSecret) {
        try {
            MessageDigest bmd5 = MessageDigest.getInstance("MD5");
            bmd5.update(sSecret.getBytes());
            int i;
            StringBuffer buf = new StringBuffer();
            byte[] b = bmd5.digest();// 加密
            for (int offset = 0; offset < b.length; offset++) {
                i = b[offset];
                if (i < 0)
                    i += 256;
                if (i < 16)
                    buf.append("0");
                buf.append(Integer.toHexString(i));
            }
            return buf.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return "";
    }

/*
	public static void main(String[] args) {
		String str = "a123456";
		//String encryptStr = MD5(str);
		String encryptStr2 = getMd5Value(str);
		System.out.println("加密前：" + str);
		//System.out.println("加密后：" + encryptStr);
		System.out.println("16位加密后�?" + encryptStr2.substring(8, 24));
		System.out.println("32位加密后�?" + encryptStr2);
	}
	*/
}