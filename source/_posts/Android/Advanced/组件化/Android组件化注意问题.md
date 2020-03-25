---
title: "Andoid组件化注意问题"
description: "Andoid组件化注意问题"
tags: [Android]
toc: true
thumbnail: /thumbnail/img83.jpg
categories: Android
date: 2020/01/08
---

## 注意问题：
1、使用组件化化开发时需要避免循环依赖

2、子模块之间的Activity调用，通过类加载的方式或通过在Common模块中设置全局Map的形式，才可以调用
<!--more-->

## 阿里云router架构源码查看缺点

1、全局Map缓存多达5个之多，还有一个全局List

com.alibaba.android.arouter.core.Warehouse 路由和其他数据存储

2、加载私有目录下apk中的所有dex并遍历，获取所有包名为xxx的类，并开启了线程工作

com.alibaba.android.arouter.utils.ClassUtils

getFileNameByPackageName()  80行
tryLoadInstantRunDexFil()  173行

3、ClassUtils这一个类在华为手机兼容失败

4、耗时操作，就需要线程池：67行

