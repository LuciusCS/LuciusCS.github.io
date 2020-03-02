---
title: WorkManager介绍与使用
thumbnail: /thumbnail/img32.jpg
toc: true
description: WorkManager介绍与使用
categories: Android
tags: [Android]
date: 2018/12/20

---

WorkManager是一个Job分发服务，用来管理任务,一旦任务进入管理队里，无论是退出当前应用或重启设备，WorkManager都会保证任务的进行。

在默认请状态下WorkManager会立即运行任务，但可以指定在手机在某一特殊状态下运行，如：网络状态、电池状态、或者是内存状态。
<!--more-->
当程序运行时，运行WorkManager,WorkManager会在一个新的后台子线程中进行；如果程序没有运行，WorkManager将会根据设备的API以及是否可以使用Google服务来选择合适的方式运行。当API在23及以上，WorkManager会使用功JobScheduler来运行，在API14-22将会使用Firebase JobDispatcher，如果JobDispatcher不能使用则会调用一个自定义AlarmManager以及BroadcastReceiver来实现后台运行任务。

WorkManager不是为了执行所有不在主线程中的任务，如果任务不需要保证执行，则应该使用intent service或者foreground service

WorkManager可以执行两种类型的任务

* 只执行一次的任务，需要创建一个OneTimeWorkRequest对象，然后加入到任务队列中

```java
    WorkManager workManager=workManager.getInstance();
    workManager.enqueue(new OneTimeWorkRequest.Builder(MyWork.class).build());
    
```

因为没有加其他的限制条件，所以上述任务只会执行一次；

* 多次任务，如：每天将应用数据同步至服务器；

创建多次任务时，需要使用PeriodicWorkRequest.Bulder创建一个PeriodicWorkRequest对象，指定两次任务之间的时间间隔，然后将PeriodWorkRequest加入到执行队列中

```
    new PeriodicWorkRequest.Builder dataCheckBuilder=new PeriodicWorkRequest.Builder(DataCheckWorker.class,12,TimeUnit.HOURS);
    
    PeriodicWorkRequest dataCheckWork=dataCheckBuilder.build();
    WorkManager.getInstance().enqueue(dataCheckWork);
    
```













