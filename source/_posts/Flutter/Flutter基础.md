---
title: "Flutter开发基础"
description: "Flutter开发基础"
type: [Android]
toc: true
cover:  /cover/img108.jpg
categories: Android
date: 2020/12/10
---

# Flutter基础


Flutter学习网站：https://guoshuyu.cn/home/wx/Flutter-1.html

## pubspec.yaml

yaml文件格式严格控制，需要注意其中的空格； 

相当于gradle中配置文件 


### 视图树

树更新：
    全局更新：调用runApp(rootWidget)，一般flutter启动时调用后不会再调用

    局部子树更新：将子树座位StatefulWidget的一个子Widget，并创建对应的State类实例，通过调用State.setState()出发子树的刷新




 #### StatefulWidget

 * StatefulWidget：存在中间状态变化的widget

   

 #### Scaffold脚手架

 相当于TitleBar   


 #### Flutter手势

 触摸


 #### Flutter中的页面管理

 在Flutter中通过Navigator来负责维护页面的堆栈管理

 ```dart

    压一个新的页面到屏幕上
    Navigator.of(context).push
    把路由顶层的页面移除
    Navigator.of(context).pop

 ```

在构建应用的时候没有主动创建Navigator，它是由MaterialApp提供的，但是如果home，routes，onGenerateRoute和onUnknownRoute都为null，并且builder不为null，MaterialApp则不会创建任何Navigator。




