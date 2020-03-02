---
title: gradle介绍
thumbnail: /thumbnail/img17.jpg
toc: true
description: gradle介绍
tags: [Android]
categories: Android
date: 2019/08/10
---

### gradle介绍

gradle和make以及ant不同，它基于Groovy语言，而非一种配置；

Gradle是一个自动化构建的开源工具，使用基于Groovy的领域专用语言(domain specific language (DSL))，来替代使用xml文件对工程的配置。其支持增量编译，可以使用cache，

<!--more-->

#### 在Moudle的build.gradle中添加依赖包

```java
    android { ... }

    dependencies {
        // 依赖于本地模块，在添加本地模块依赖时，需要在`settings.gradle`文件中添加`include:mylibrary`
        implementation project(":mylibrary")

        // 依赖于本地库,需要将jar文件添加至 `module_name/libs/`文件夹中 
        implementation fileTree(dir: 'libs', include: ['*.jar'])

        // 依赖于远程库
        implementation 'com.example.android:app-magic:12.3'
    }

```

依赖包的配置有以下类型：`implementation`、`api`、`compileOnly`、`runtimeOnly`、`annotationProcessor`、`lintChecks`、`lintPublish`
在上述配置中，会将所有的依赖在构建的时候进行打包；如果需要将特定的依赖打包到特定的版本中，需要在依赖配置前添加响应的前缀,下述依赖只会打包到falvor为free的生成包中。

```java
    dependencies {
        freeImplementation 'com.google.firebase:firebase-ads:9.8.0'
    }

```
如果需要将依赖作为变量，与flavor和build type进行结合，要在`configurations`代码块中进行初始化。
```java
    configurations {
        //初始化只与freeDebugRuntimeOnly相关的依赖
        freeDebugRuntimeOnly {}
    }

    dependencies {
        freeDebugRuntimeOnly fileTree(dir: 'libs', include: ['*.jar'])
    }

```


### 在Debug模式下使用正式签名

在moudle.gradle进行配置,signingConfigs配置需要在buildTypes配置之后,否则会报错`ERROR: Could not get unknown property 'release' for SigningConfig container of type org.gradle.api.internal.FactoryNamedDomainObjectContainer.`

```java

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

### 加速项目的构建速度

#### 优化项目配置
有一些打包的配置，在进行开发的过程中不需要，这些不需要的配置会拖慢增量编译，以及clean up的速度；我们可以配置仅在打包的时候进行使用的编译变量，下述示例是创建一个`dev`flavor和`prod`flavor(发布版本)。

```java

android {
  ...
  defaultConfig {...}
  buildTypes {...}
  productFlavors {
    //当在构件时使用下述flavor，则会覆盖`defaultConfig`代码块；
    dev {
      
      minSdkVersion 21
      versionNameSuffix "-dev"
      applicationIdSuffix '.dev'
    }

    prod {
      // 如果使用默认配置发布版本，则这一代码块可以设置为空，但不能省略`prob`，否则所有的编译版本都会使用`dev`中的配置。
      
    }
  }
}

```

可以使用flavor维度设置，可以创建出组合的flavor；如下述示例中创建出`devDemo`和`prodFull`

```java

android {
  ...
  defaultConfig {...}
  buildTypes {...}

  // 定义需要使用的flavor dimensions，定义的顺序就是它们从高到底的优先级；使用flavor维度后，需要在每一项flavor配置中定义指定维度
  flavorDimensions "stage", "mode"

  productFlavors {
    dev {
      dimension "stage"
      minSdkVersion 21
      versionNameSuffix "-dev"
      applicationIdSuffix '.dev'
      
      //可以通过配置`resConfigs`仅配置英文，以及`xxhdpi`尺寸的图片
      resConfigs "en", "xxhdpi"
      ...
    }

    prod {
      dimension "stage"
      ...
    }

    demo {
      dimension "mode"
      ...
    }

    full {
      dimension "mode"
      ...
    }
  }
}

```
#### 编译类型配置

```java
    android {
      ...
      buildTypes {
        debug {
          //如果不需要Crashlytics 报告可以设置为`diable`加快编译速度`
          ext.enableCrashlytics = false
          //防止Crashlytics 每次更新编译的id
          ext.alwaysUpdateBuildId = false
        }
}

```
#### 在Debug版本构建的过程中使用静态常量
在Debug版本中总是使用静态常量，或者硬编码的方式进行编译。

```java

int MILLIS_IN_MINUTE = 1000 * 60
int minutesSinceEpoch = System.currentTimeMillis() / MILLIS_IN_MINUTE

android {
    ...
    defaultConfig {
  
        //如果将下述两个值设置为动态的，会在`AndroidManifest.xml`的影响下进行更新，编译出完整版本apk
        versionCode 1
        versionName "1.0"
        ...
    }

    //进行上述默认配置后，在进行增量变异的时候不需要重新构建`manifest`，重新构建会导致构建完整apk，拖慢构建速度。
    //下面的语句会在构建的时候遍历`buildType.name`并进行相应的处理
    applicationVariants.all { variant ->
        if (variant.buildType.name == "release") {
            variant.mergedFlavor.versionCode = minutesSinceEpoch;
            variant.mergedFlavor.versionName = minutesSinceEpoch + "-" + variant.flavorName;
        }
    }
}

```

#### 使用增量注解处理（incremental annotation processors）
Android Studio的Gradle插件版本高于3.3.0支持增量注解处理，如果您使用一个或多个不支持增量编译的注解处理器，则增量 Java 编译不会启用。如果需要使用不支持此优化的注解处理器，可以再 gradle.properties 文件中添加以下标记。添加后，Android Gradle 插件会在一个单独的任务中执行所有注解处理器，并允许 Java 编译任务以增量方式运行。

```xml
     android.enableSeparateAnnotationProcessing = true
```


#### 其他方式

* 使用确定的依赖，避免使用`+`，如：'com.android.tools.build:gradle:2.+'
* 使用离线模式进行编译
* 创建library modules，使用这种方式，该模块可以编译输出至缓存中，仅在模块编辑后才会重新编译。
* 创建自定义编译任务
* 将图片转换为WebP
   
   WebP可以像PNG一样透明，使用与JPEG一样是有损压缩，但比JPG和JPEG压缩更优秀。重新更改图片的尺寸，而非在编译时压缩可以加快编译速度。可以使用Android Studio进行图片的转换。
* 禁用PNG压缩

  ```java
  
  android {
    buildTypes {
        release {
            //禁用PNG压缩
            crunchPngs false
        }
    }

    // 如果使用的gradle插件版本小于3.0.0，使用下述方式禁用PNG压缩
    //  aaptOptions {
    //      cruncherEnabled false
    //  }
}
  ```
  
* 使用编译缓存
在编译缓存中会保存Gradle插件在编译过程中的输出（如：未打包的AAR文件，提前下载的远程库），当使用编译缓存，`clean build`会变得更快，因为其会调用缓存中的文件，而非重新生成。
在gradle.gradle.properties 中指定编译缓存的路径，默认路径为`<user-home>/.android/build-cache/`

```xml
    // 执行绝对路径或者相对路径
    android.buildCacheDir=<path-to-directory>
    android.enableBuildCache=true
```

#### 打包编译多个版本的apk，待续




