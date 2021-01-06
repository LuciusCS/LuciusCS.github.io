---
title: Android序列化
cover: /cover/img10.jpg
toc: true
description: Android序列化
type: [Android]
categories: Android
date: 2018/09/10
---
## Android序列化

Android序列化对象的方法有两种：

* 实现Serializable接口，Java自带
* 实现Parcelable接口，android特有接口，效率高于Serializable接口，支持Intent数据传递，也可用于跨进程通讯（IPC）
<!--more-->