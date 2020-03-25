---
title: "Android AIDL介绍"
description: "Android接口定义语言AIDL"
tags: [Android]
toc: true
thumbnail: /thumbnail/img79.jpg
categories: Android
date: 2019/10/30
---

## Android接口定义语言AIDL

使用AIDL可以进行进程间通信(IPC)，包含客户端与服务，

注：不同通信方式适合环境;
* 使用Binder创建接口，跨不同应用，执行并发IPC
* 使用Messager 实现接口，执行IPC，但不需要并发IPC
<!--more-->