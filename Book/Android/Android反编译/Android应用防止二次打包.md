
Android防止二次打包主要通过对签名文件的验证来进行

### 应用签名文件介绍

在Android Studio2.2之后多了对签名版本的选择`V1(Jar Signature)`和`V2(Full APK Signature)`V1就是传统的签名方式，V2则是Android7.0之后引入的。其区别是，V1是通过ZIP条目进行验证，这样APK 签署后可进行许多修改；而V2验证压缩文件的所有字节，而不是单个 ZIP 条目，这样在签名后无法再更改。V2的好处很明显，更安全且验证更迅速。所以，推荐在生成apk时，签名方式选择V1+V2。当然，仅仅选择V1也是可以的。如果仅选择V2呢，这样生成的apk在Android7.0及之后的版本上没有问题，不过会导致7.0以下的版本无法安装，所以要避免这种方式。

#### 签名文件在gradle中配置

    signingConfigs {      
      debug {          
        storeFile file("./hyydev.jks")          
        storePassword "******"         
        keyAlias "**"          
        keyPassword "******"          
        v1SigningEnabled true          
        v2SigningEnabled true      
      }      
      release {          
        storeFile file("./hyydev.jks")          
        storePassword "******"          
        keyAlias "**"          
        keyPassword "******"         
        v1SigningEnabled true          
        v2SigningEnabled true      
      }
    }

### 应用签名文件查看

* 已有.jks文件

在cmd中输入
```xml

keytool -list -v -keystore path/android.jks -storepass password

```
![](/assets/Android safe.png)


* 只有.apk文件

使用解压工具解压APK文件，在META-INF文件夹拿到CERT.RSA文件,在CMD中输入
```xml
keytool -printcert -file path/android.jks
```
![](/assets/Android safe1.png)

**两种方式获取到的签名文件是一致的，使用.jks文件需要密码，而使用.apk文件无需密码**

### 在Java代码中进行验证，通过PackageManager获取签名信息。

使用Java代码进行签名信息验证，通过修改smali文件可以绕过，容易破解


### 在native层进行签名验证
使用NDK开发出来的原生C++代码编译后生成的so库是一个二进制文件，可以增加了破解的难度，但在实现中将用于对比的签名HASH串明文存放在代码中，可能会被取出。

因此在编写时需要对签名内容进行加密，使用自定义加密算法，在使用时进行解密。

### 在服务端对签名文件进行验证
服务器校验即将本地的程序信息，传输到服务器进行校验，然后返回一段核心代码进行执行（非校验结果，防本地修改；同时也不建议服务器下发校验信息，本地校验，原理同）


