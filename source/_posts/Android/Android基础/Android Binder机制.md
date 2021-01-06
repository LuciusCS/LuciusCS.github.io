---
title: "Android Binder机制介绍"
description: "Android Binder机制介绍"
type: [Android]
toc: true
cover: /cover/img84.jpg
categories: Android
date: 2017/08/01
---

# Andorid Binder机制

## Android Binder介绍

Binder可以实现进程间通信，采用类似于C/S架构的设计模式，性能仅次于共享内存
<!--more-->
![](/public/img/Android/android_base_binder2.png)

Binder机制的优点：

1、高效：Binder机制的数据只拷贝一次，而管道、消息队列、Socket都需要两次；通过驱动在内核拷贝数据，不需要额外的同步处理。
2、安全性高：Binder机制为每个进程分配了UID/PID来作为鉴别身份的标示；在Binder通信时会根据UID/PID进行有效性额检测（传统方式下，对于通信双方的身份没有做出验证）
3、简单易用：采用C/S架构，以及面向对象的方式进行实现。


### Android Binder 组成

![](/public/img/Android/android_base_binder1.png)

1、Server：位于用户空间； 提供服务方，当Server进程向Binder驱动进行注册后，其Binder引用会自动加入到ServiceManager中；
2、Client：位于用户空间； 需求方
3、ServiceManager:位于用户空间；作为Servier和Client之间的桥梁，Client可以通过ServiceManager拿到Server中Binder实体的引用；
4、Binder驱动：位于内核空间；用于进程之间Binder通信实现；连接Service进程、Client进程和Service Manager的桥梁；在实现时采用内存映射的方式进行；

注：
 
 * 用户空间不能进行进程间通信，而内核空间可以进行进程间通信
 * 在Andorid开发中系统服务很多通过Binder进行交互 `context.getSustemService(Context.AUDIO_SERVICE);`

 
### Android Binder机制执行流程

![](/public/img/Android/android_base_binder3.png)

![](/public/img/Android/android_base_binder4.png)

### Linux内核中提供的通信方式
1、管道通信，性能耗费严重；半双工的方式，数据需要复制两次
2、共享内存，多个进程可以访问同一块内存空间，内存管理混乱
3、Socket通信，其主要适合于网络通信


### AIDL介绍

1、IBinder： 代表跨进程通信能力的接口，对象只需要实现IBinder就可以跨进程传输
2、IInterface：代表Server进程提供的功能； 对应AIDL定义的接口；
3、Binder：代表Binder的本地对象BinderProxy
4、Stub：继承Binder，实现IInterface

### Android 9.0 中的Binder

