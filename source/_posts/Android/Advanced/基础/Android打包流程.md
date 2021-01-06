---
title: "Android 打包流程"
description: "Android 打包流程"
type: [Android]
toc: true
cover:  /cover/img97.jpg
categories: Android
date: 2020/5/30
---

## Android 打包流程

Android打包签名

签名三步：

    1、计算摘要
    2、对原始数据私钥非对称加密
    3、将签名写入签名区块

一个key store可以放置多个秘钥，同一个签名文件，给多个应用进行签名。

V2签名在Android 7.0之后出现的。

