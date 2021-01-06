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