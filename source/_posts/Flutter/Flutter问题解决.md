---
title: "Flutter开发问题解决"
description: "Flutter开发问题解决"
type: [Android]
toc: true
cover:  /cover/img113.jpg
categories: Android
date: 2020/12/11
---

## Flutter问题解决


### 

```
 Couldn't read file io\flutter\plugins\pathprovider\PathProviderPlugin.java even though it exists. Please verify that this file has read permission and try again.
```
解决方法：https://stackoverflow.com/questions/60480786/flutter-packages-get-failes-with-error-couldnt-read-file-localfile


```xml

    flutter clean
    flutter pub cache repair
    flutter pub get
```

### Flutter 启动是白屏现象

按照原生白屏启动优化的方式进行优化


### Flutter开发过程中 Android模块一直报红


### 在Flutter中调用原生的方法，出现

```xml
 [ERROR:flutter/lib/ui/ui_dart_state.cc(177)] Unhandled Exception: MissingPluginException(No implementation found for method getBatteryLevel on channel samples.flutter.io/battery)
```

解决方法 https://stackoverflow.com/questions/50687801/flutter-unhandled-exception-missingpluginexceptionno-implementation-found-for

直接卸载然后进行重装


### Flutter和原生进行互相跳转，使用 flutter_boost 看起来升级慢，果断弃用


### Transform's input file does not exist

```
Execution failed for task ':app:lintVitalRelease'.                      
> Could not resolve all artifacts for configuration ':app:debugRuntimeClasspath'.
   > Failed to transform libs.jar to match attributes {artifactType=processed-jar, org.gradle.libraryelements=jar, org.gradle.usage=java-runtime}.
      > Execution failed for JetifyTransform: /Users/michaelbui/Projects/counter/build/app/intermediates/flutter/debug/libs.jar.
         > Failed to transform '/Users/michaelbui/Projects/counter/build/app/intermediates/flutter/debug/libs.jar' using Jetifier. Reason: FileNotFoundException, message: /Users/michaelbui/Projects/counter/build/app/intermediates/flutter/debug/libs.jar (No such file or directory). (Run with --stacktrace for more details.)
           Please file a bug at http://issuetracker.google.com/issues/new?component=460323.

```

解决方法

https://github.com/flutter/flutter/issues/58247


```
Run flutter create counter
Update the app to use Android Gradle plugin 4.0.0
Run flutter build apk


```


### The following NoSuchMethodError was thrown building _InheritedConfig

```
The following NoSuchMethodError was thrown building _InheritedConfig:
The method '_debugTypesAreRight' was called on null.
Receiver: null
Tried calling: _debugTypesAreRight(Instance of 'FlutterReduxApp')


```

解决方法 https://stackoverflow.com/questions/62493494/the-method-debugtypesareright-was-called-on-null

代码某一处的 createState 返回值错误 



###  Unsupported Modules Unsupported Modules Detected: 
问题出现在Android 原生集成Flutter，然后运行原生程序的过程中

```
 Unsupported Modules Unsupported Modules Detected: Compilation is not supported for following modules: flutter_module. Unfortunately you can't have non-Gradle Java modules and Android-Gradle modules in one project.

```

###  Settings file 'J:\SVN\PAD\Project\PadStation\settings.gradle' line: 3

A problem occurred evaluating settings 'PadStation'.
> J:\SVN\PAD\Project\PadStation\flutter_module\.android\include_flutter.groovy (J:\SVN\PAD\Project\PadStation\flutter_module\.android\include_flutter.groovy)

在flutter_module目录下不存在 .android

运行
```xml
 flutter pub get
```

### 运行Flutter项目 main.dart时一直卡在 Running Gradle task 'assembleDebug'

解决办法：使用阿里云镜像


### Caused by: org.gradle.process.internal.ExecException: Process 'command 'I:\DevelopmentKit\SDK\flutter\bin\flutter.bat'' finished with non-zero exit value -1073740791

解决办法：需要设置一下flutter sdk路径