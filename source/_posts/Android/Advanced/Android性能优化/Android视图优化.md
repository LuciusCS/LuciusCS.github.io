---
title: "Android视图优化"
description: "Android视图优化"
type: [Android,优化]
toc: true
cover:  /cover/img78.jpg
categories: Android
date: 2019/08/16
---

### 视图优化

60fps，16ms，只有在60fps及以上，眼睛大脑才会感到流畅.

VSYNC(刷新率)：硬件刷新频率 60Hz
帧率：GPU一秒钟绘制的帧数 30fpd, 60fps

刷新率 > 帧率 ： 屏幕在连续两次刷新的时候，会出现图像暂停或者卡顿现象。

帧率 > 刷新率 ：图像会差生割裂的现象。
<!--more-->
施工双缓冲机制

BackBuffer：GPU渲染的数据会写入BackBuffer；
FrameBuffer：屏幕显示的数据只会从FrameBuffer中进行读取。

BackBuffer和FrameBuffer会进行同步；


### 避免UI卡顿

* 避免在onDraw中创建对象，使用对象池；频繁创建对象会造成内存抖动
* 减少View层级，每一个层级的测量绘制会花费过多时间，以及造成过度绘制。
* 避免在UI顶层使用RelativeLayout，measure了两次
* 自定义控件控制绘制复杂度

### 优化过度绘制

* 降低View的层级,使用merge标签
* 去掉不必要的背景，去掉window的背景
* ClipRect指定当前的绘制区域，QuickReject落在制定区域之外的像素不会被绘制
* ViewStub，刚开始不需要显示，不会参与measure和layout过程
* .9图用作背景