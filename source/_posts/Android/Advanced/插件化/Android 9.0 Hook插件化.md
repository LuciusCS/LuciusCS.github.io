---
title: Android 9.0 Hook插件化
thumbnail: /thumbnail/img4.jpg
toc: true
description: Android 9.0 Hook插件化
tags: [Android]
categories: Android
date: 2020/03/02
---

### 第一步：绕过AMS对Activity的检查
注：如果Activity没有在Manifest.xml中进行注册则会报错

    1、Hook绕过AMS检查，采用代理的方式
    2、Hook还原目标Activity
    3、Hook方式融合宿主和插件DexElement
<!--more-->
### 第二步 还原ProxyActivity

要在ActivityThread的  class H extends Handler {}类中的的 handleMessage(Message msg)执行之前，将ProxyActivity换成需要进行启动的Activity， 而handleMessage(Message msg)会在Handler dispatchMessage()中进行调用

需要在替换之前使得mCallback部位不为空，替换之后将会调用自己定义的MyCallback.handleMessage,然后进行相应的处理

```java
   public void dispatchMessage(@NonNull Message msg) {
        if (msg.callback != null) {
            handleCallback(msg);
        } else {
            if (mCallback != null) {
                if (mCallback.handleMessage(msg)) {
                    return;
                }
            }
            handleMessage(msg);
        }
    }
```

在 handleMessage()中需要拿到 mIntent进行替换
```java
private class  MyCallback implements android.os.Handler.Callback{

        @Override
        public boolean handleMessage(@NonNull Message msg) {
        }
}

```


## Hook式插件化框架化Android版本兼容

