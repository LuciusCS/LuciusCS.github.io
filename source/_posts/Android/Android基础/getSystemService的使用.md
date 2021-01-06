---
title: getSystemService的使用
cover: /cover/img12.jpg
toc: true
description: getSystemService的使用
type: [Android]
categories: Android
date: 2019/09/30
---

getSystemService是Activity的一个方法，根据传入的name得到对应的Object,然后转换成相应的服务对象；
<!--more-->
|传入的Name|返回的对象|说明|
|------|------|------|
|WINDOW_SERVICE|WindowManager|管理打开的窗口程序|
|LAYOUT_INFLATER_SERVICE|	LayoutInflater	|取得xml里定义的view
|ACTIVITY_SERVICE	|ActivityManager	|管理应用程序的系统状态
|POWER_SERVICE	|PowerManger	|电源的服务
|ALARM_SERVICE	|AlarmManager|	闹钟的服务
|NOTIFICATION_SERVICE	|NotificationManager	|状态栏的服务
|KEYGUARD_SERVICE	|KeyguardManager	|键盘锁的服务
|LOCATION_SERVICE	|LocationManager	|位置的服务，如GPS
|SEARCH_SERVICE	|SearchManager	|搜索的服务
|VEBRATOR_SERVICE|	Vebrator|	手机震动的服务
|CONNECTIVITY_SERVICE	|Connectivity	|网络连接的服务
|WIFI_SERVICE	|WifiManager	|Wi-Fi服务
|TELEPHONY_SERVICE	|TeleponyManager	|电话服务