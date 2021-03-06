---
title: "Android 插件化介绍"
description: "Android 插件化介绍"
type: [Android]
toc: true
cover:  /cover/img86.jpg
categories: Android
date: 2020/03/05
---

## 占位式插件
插件开发，必须使用宿主中的环境

<!--more-->
## Hook式插件

宿主和插件的element进行融合，插件可以使用宿主的环境

缺点，插件越多，内存中的newDexElements就会越大

### 在宿主中启动宿主的Activity

```java

    Intent intent =new Intent();
    intent.setComponent(new ComponentName("com.example","com.example.TestActivity"))
    startActivity(intent);

```

### 在宿主中启动插件里面的Activity

```java

    Intent intent =new Intent();
    intent.setComponent(new ComponentName("com.example.plugin","com.example.plugin.TestActivity"))
    startActivity(intent);

```

startActivity ———》 Activity ———》 mInstrumentation.execStartActivity() ————》 ActivityManagerNative.getDefault().startActivity() ——》 AMS.startActivity(检测，当前要启动的Activity是都注册) ———》 ActivityThread(即将加载)————》（handleLaunchActivity 类加载 Activity performLaunchActivity）




Android的ClassLoader在启动的过程中在ActivityThread中有调用         

Android中的ClassLoader =PathClassLoader


Android中ClassLoader的过程：
    1、Java中的ClassLoader 和 Android中的ClassLoader 是不一样的
    2、ClassLoader == PathClassLoader
    3、PathClassLoader==cl.loadClass(className).newInstance();

PathClassLoader.loadClass —— 》 BaseDexClassLoader ——>ClassLoader .loadClass ——》 findClass(空方法)，让覆盖的子类实现 ——》 BaseDexClassLoader实现findClass() ——》 pathList.loadClass —— 》 遍历dexElements ——》DexFile.loadClassBinaryName（系列步骤后NDK）

PathClassLoader继承自 BaseDexClassLoader 
BaseDexClassLoader 继承自 ClassLoader 


ClassLoader .loadClass

Android中的ClassLoader介绍
1、Java中的 ClassLoader 和Android中的ClassLoader不一样:
        Java中的ClassLoader以Jar包为中心思想，而Android中以dex文件为中心思想
2、Andorid中的ClassLoader分为两类，
        系统提供的ClassLoader ——》 BootClassLoader、PathClassLoader、DexClassLoader        
        自定义ClassLoader

     BootClassLoader： 给系统预加载使用
     PathClassLoader： 给系统/系统程序/应用程序
     DexClassLoader：加载apk、zip apk文件的DexClassLoader

1、内核启动
2、init第一个进程
3、zygote进程
   ——》 zygoteInit ——》 BootClassLoaser.getInstance(); | handleSystemServerProcess PathClassLoaderFactory ——》 PahtClassLoader
4、zygote 进程孵化 SystemServer
5、SystemServer 启动系统服务 —— (AMS、PSM ...)         



### Hook式插件化，宿主与插件融合

    //第一步： 找到宿主的 dexElements得到此对象  PathClassLoader代表是宿主

    //第二步： 找到插件的dexElements得到此对象  代表插件 DexClassLoader 
    //第三步：创建出新的dexElements[]  必须是数组对象
    //第四步：宿主dexElements+插件dexElements = ——》新的dexElements
    //第五步：把新的DexElements，设置到宿主中去   

还需要加载插件里面的布局


## LoadApk式，插件化

在LoadApk式的插件化中，需要控制 ClassLoader

该方法解决newElements在插件中过大的问题

PathClassLoader —— 》 使用宿主的class
自定义ClassLoader —— 》 插件的class



