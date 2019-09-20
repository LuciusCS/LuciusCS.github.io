### 在Debug模式下使用正式签名

在moudle.gradle进行配置,signingConfigs配置需要在buildTypes配置之后,否则会报错`ERROR: Could not get unknown property 'release' for SigningConfig container of type org.gradle.api.internal.FactoryNamedDomainObjectContainer.`

```xml

    android{
           ...
        signingConfigs {
            release {
                //.jks文件放在项目目录（app目录）
                storeFile file("app.jks")//签名文件名
                storePassword "password"//密码
                keyAlias"key0"//别名
                keyPassword"password"//密码
                }

            debug {
                storeFile file("app.jks")
                storePassword"password"
                keyAlias"key0"//别名
                keyPassword"password"
            }
        }   
           
        buildTypes {
            release {
                minifyEnabled false
                proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
                signingConfig signingConfigs.release
            }
            debug {
            signingConfig signingConfigs.release
            }
        }

       ....
    }
```