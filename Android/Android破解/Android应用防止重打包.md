
Android防止重打包主要通过对签名文件的验证来进行

### 应用签名文件查看

* 已有.jks文件

在cmd中输入
```xml

keytool -list -v -keystore path/android.jks -storepass password

```


* 只有.apk文件

使用解压工具解压APK文件，在META-INF文件夹拿到CERT.RSA文件,在CMD中输入
```xml
keytool -printcert -file path/android.jks
```







### 在Java代码中进行验证，通过PackageManager获取签名信息。



##### 使用Java代码尽心签名信息验证，通过修改smali文件可以绕过，容易破解



### 在native层进行签名验证
使用NDK开发出来的原生C++代码编译后生成的so库是一个二进制文件，可以增加了破解的难度，但在实现中将用于对比的签名HASH串明文存放在代码中，可能会被取出。

因此在编写时需要对签名内容进行加密，使用自定义加密算法，在使用时进行解密。

### 在服务端对签名文件进行验证
服务器校验即将本地的程序信息，传输到服务器进行校验，然后返回一段核心代码进行执行（非校验结果，防本地修改；同时也不建议服务器下发校验信息，本地校验，原理同）


