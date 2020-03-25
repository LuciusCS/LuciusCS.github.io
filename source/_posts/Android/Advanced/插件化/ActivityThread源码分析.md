---
title: "ActivityThread源码分析"
description: "ActivityThread源码分析"
tags: [Android]
toc: true
thumbnail: /thumbnail/img80.jpg
categories: Android
date: 2019/08/10
---

# ActivityThread源码分析

startActivity ———》 Activity ———》 mInstrumentation.execStartActivity() ————》 ActivityManagerNative.getDefault().startActivity() ——》 AMS.startActivity(检测，当前要启动的Activity是都注册) ———》 ActivityThread(即将加载) ————》 mH LAUNCH_ACTIVITY（自己处理LoadApk中的classLoader） ————》（handleLaunchActivity 类加载 Activity performLaunchActivity）
<!--more-->
```java
       case LAUNCH_ACTIVITY: {
                Trace.traceBegin(Trace.TRACE_TAG_ACTIVITY_MANAGER, "activityStart");
                //跳转Activity的记录
                final ActivityClientRecord r = (ActivityClientRecord) msg.obj;
                //如果缓存mPackages中有loadApk 就直接返回，如果没有loadApk就创建出loadApk————》宿主中的LoadAPk.ClassLoader

                //如果是加载插件，从mPackages中取出插件专用的LadedApk，自定义ClassLoader 
                r.packageInfo = getPackageInfoNoCheck(
                        r.activityInfo.applicationInfo, r.compatInfo);
                //真正的即将 实例化Activity 然后启动
                handleLaunchActivity(r, null, "LAUNCH_ACTIVITY");
                Trace.traceEnd(Trace.TRACE_TAG_ACTIVITY_MANAGER);
              } break;

```

ActivityClientRecord用于对Activity的每次跳转做一下记录


1、public final LoadApk getPackageInfoNoCheck == 宿主的

2、缓存中的final ArrayMap<String,WeakReference<LoadApk>> mPackages默认保存的是宿主的LoadedApk

LoadedApk -- 宿主的 ——》 LoadedApk.ClassLoader ———— 》 宿主中的class 

实例化的Activity是宿主中的loadApk里面的ClassLoader去实例化的

宿主中的LoadedApk.ClassLoader去加载 宿主中的class ，然后实例化


———————— 自定义一个LoadedApk 自定义一个ClassLoader 用于专门加载插件里面的 class 然后实例化

自定义一个LoadedApk 然后保存 ——》 mPackages

LoadApk ————》 插件的 ————》 LoadedApk.ClassLoader ——》插件中的class 

3、梳理流程

宿主：startActivity ———》 Activity ———》 mInstrumentation.execStartActivity() ————》 ActivityManagerNative.getDefault().startActivity() ——》 AMS.startActivity(检测，当前要启动的Activity是都注册) ———》 ActivityThread(即将加载)    mPackages.value中取出LoadedApk.ClassLoader ——实例化 Activity （只能加载宿主的）

插件：startActivity ———》 Activity ———》 mInstrumentation.execStartActivity() ————》 ActivityManagerNative.getDefault().startActivity() ——》 AMS.startActivity(检测，当前要启动的Activity是都注册) ———》 ActivityThread(即将加载)    mPackages.value中取出插件专用LoadedApk.ClassLoader ——实例化插件的Activity 


绕过PMS的检查：

流程： startActivity ——》 Activity ——》 Instrument ——AMS检查 ——》 ActivityThread——》
    获取自定义的LoadedApk.ClassLoader ——》 实例化 initializeJavaContextClassLoader （PMS检查要启动的包名是否安装） ——》 生命周期方法的处理（才能真正启动加载到插件包里的Activity）


PMS检测 插件包包名是否安装，如果没有安装则抛出异常，
    Hook 要在getPackageInfo 执行之前给Hook拦截住，控制pi 不为null


分析 pm.package  客户端进程 ---》 系统进程

54:07 能看到代码的浏览 