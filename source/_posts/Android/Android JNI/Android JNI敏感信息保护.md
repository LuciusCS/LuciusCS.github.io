---
title: Android JNI敏感信息保护
cover:  /cover/img2.jpg
toc: true
description: Android JNI敏感信息保护
type: [JNI,Android]
categories: Android
date: 2019/09/21
---


# Android JNI对敏感信息进行保护

## Android反编译

在Android开发的过程中我们通常使用混淆、加壳的方式来对apk文件进行加固，但是Java开发中的，一些常量不能被混淆，对于常量我们需要做特殊处理。

<!--more-->

## 将敏感信息保存使用native代码实现

相对于java代码容易被反编译，使用NDK开发出来的原生C++代码编译后生成的so库是一个二进制文件，可以增加了破解的难度；如果将整个so文件拷贝进行调用，那么敏感信息依旧会被提取。







