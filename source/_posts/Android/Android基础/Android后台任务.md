---
title: Android后台处理
cover: /cover/img9.jpg
toc: true
description: Android后台处理介绍
type: [Android]
categories: Android
date: 2019/09/30
---
# Android后台处理介绍

Android手机应用通过主线程来控制UI，包括计算以及View绘制；当有太多的工作在主线程中进行，会造成App假死或者运行缓慢，会给用户较差的体验。很多耗时操作包括编码与解码Bitmap、读取存储器内容或者网络处理工作可以在一个独立的后台进程中进行。
<!--more-->
## 推荐在后台进行处理的三种情况

### App处理操作是否可以滞后进行，或者需要实时处理

例如：当用户需要获取数据并显示时，不能将此数据获取放在后台；如果需要将App输出的log日志传递到服务器中，则需要将传输工作放置在后台中进行

### App的处理操作开始的时候，Android操作系统是否需要将App进行“保活”（Keep Alive）处理

例如：当对Bitmap进行解码显示处理的时候，通常需要App保持运行；当使用手机播放器进行音乐播放的时候,手机播放器需要可以再后台运行。

### App操作处理是否是由系统进行触发

系统触发的内容包括：手机网络状态、电量状态、存储器容量以及其他的触发。例如：当你需要在手机处于网络可应用的状态下与服务器进行通信，如果此时App进程已经死掉，你需要重新启动一个。

#### 加一个选择策略图片

## 线程池

对于处理工作只能在App前台工作的情况使用线程池，线程池提供了一组后台线程，接收任务提交队列。如果需要监控操作系统的触发机制，需要使用动态注册Broadcast receivers,去监控操作系统的状态以及触发任务。

* 注：在需要线程池进行网络、存储器以及计算操作时，这些任务通常需要是独立的避免引发死锁

## Foreground Service操作

对于需要尽快完成的工作，使用Foreground Servie通知操作系统App正在进行一些重要的工作，不可以被杀死。Foreground Service对于用户是可见的，它显示在通知栏中。

## Workmanager

对于那些可以进行演示进行但必须要完成的任务，可以使用WorkManager。WorkManager是Android的一个库，用以运行可以延时触发后台任务（如：网络状态触发，或者电池状态触发）。WorkManager使用的是framework层的JobScheduler,当设备的版本低于Android 6.0\(API 23\)，如果已经在App中添加依赖，WorkManager就会使用Workbase JobDispatcher,否则将会使用AlarmManager来对后台任务进行处理。

## 后台进程操作的限制

为了最大化利用电池以及更好的App使用体验，Android会限制App\(或者一个forceground service notification\)，当其对用户不可见时。

* Android 6.0\(Api 23\)使用休眠状态或者standby状态，当屏幕关闭或者未操作状态时，App处于standby状态时，是未使用的应用进入到网络、任务以及同步都被限制的状态。
* Android 7.0\(Api 24\)限制隐式广播。
* Android 8.0\(Api 26\)限制更多的后台操作，包括后台获取地址信息以及释放缓存。

