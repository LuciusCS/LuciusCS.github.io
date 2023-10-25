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




### FAILURE: Build failed with an exception.

* Where:
Script 'I:\DevelopmentKit\SDK\flutter\packages\flutter_tools\gradle\flutter.gradle' line: 904

* What went wrong:
Execution failed for task ':flutter:compileFlutterBuildDebug'.
> Process 'command 'I:\DevelopmentKit\SDK\flutter\bin\flutter.bat'' finished with non-zero exit value 1

解决办法：重启


###

Failed to send crash report due to a network error: SocketException: OS Error: The semaphore timeout period has expired.
, errno = 121, address = clients2.google.com, port = 56324
Oops; flutter has exited unexpectedly: "FileSystemException: Failed to decode data using encoding 'utf-8', path = 'I:\DevelopmentKit\SDK\flutter\.pub-cache\hosted\pub.flutter-io.cn\android_intent-2.0.0\android\src\main\java\io\flutter\plugins\androidintent\AndroidIntentPlugin.java'".
A crash report has been written to J:\SVN\PAD\Project\app_platform\flutter_04.log.

```
#0      _File._tryDecode (dart:io/file_impl.dart:564:7)
#1      _File.readAsStringSync (dart:io/file_impl.dart:584:7)
#2      ForwardingFile.readAsStringSync (package:file/src/forwarding/forwarding_file.dart:96:16)
#3      ErrorHandlingFile.readAsStringSync.<anonymous closure> (package:flutter_tools/src/base/error_handling_io.dart:221:22)
#4      _runSync (package:flutter_tools/src/base/error_handling_io.dart:573:14)
#5      ErrorHandlingFile.readAsStringSync (package:flutter_tools/src/base/error_handling_io.dart:220:12)
#6      AndroidPlugin._getSupportedEmbeddings (package:flutter_tools/src/platform_plugins.dart:137:53)
#7      AndroidPlugin._supportedEmbedings (package:flutter_tools/src/platform_plugins.dart:91:70)
#8      AndroidPlugin.toMap (package:flutter_tools/src/platform_plugins.dart:83:30)
#9      _extractPlatformMaps (package:flutter_tools/src/plugins.dart:606:40)
#10     _writeAndroidPluginRegistrant (package:flutter_tools/src/plugins.dart:622:5)
#11     injectPlugins (package:flutter_tools/src/plugins.dart:1202:11)


问题解决：

```xml

    flutter doctor -v
    flutter clean
    flutter pub cache repair
    flutter pub get
```


## flutter2声名变量报 ”Non-nullable instance field ‘***‘ must be initialized.“
  
  因flutter2.0添加了Sound null safety空安全声明，目的是通过显式声明可能为null的变量，增加Dart语言的鲁棒性。

因为Dart语言变量可以存null或者具体的值，因此在日常的开发中可能因为忘记赋值或者变量延迟赋值，导致访问某个变量时为null，导致程序运行时抛出exception。
这个功能推出后，可以从源码级解决null异常导致的错误。
简单的操作是在类型声明后添加？以标识这个变量是可以为null的


## 页面跳转后第二个页面没有返回按钮

https://www.jianshu.com/p/1109d11f2f12


https://blog.csdn.net/weixin_30321709/article/details/97508106

### Exception: CocoaPods not installed or not in valid state.

已经安装 CocoaPods 之后，运行安装到iphone显示该错误

解决方法

```

chmod +x /Applications/Android\ Studio.app/Contents/bin/printenv、
///使用命令行打开
open /Applications/Android\ Studio.app

```



### Module 'camera_avfoundation' not found


```
Parse Issue (Xcode): Module 'camera_avfoundation' not found
/Users/eastsoft/Documents/Development/ESProject/app_new/es_platform/ios/Runner/GeneratedPluginRegistrant.m:11:8

Could not build the application for the simulator.
Error launching application on iPhone 11 Pro Max.

```

* scheme 需要进行对应，debug 模式下就要用debug模式的scheme, 而不能用release模式
* 在虚拟机环境下需要配置  Architectures  -> Excluded Architectures -> Any IOS Simulator  ->  i386  arm64
* 需要在 XCode 打开 Runner.xcworkspace 而不是 Runner.xcodepro


参考资料  https://www.jianshu.com/p/c10632015e02
         https://github.com/flutter/flutter/issues/41033
         https://blog.devlxx.com/2021/12/02/M1设备的Xcode编译问题深究/