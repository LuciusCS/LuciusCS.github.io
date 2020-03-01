---
title: Android生命周期感知组件详解
thumbnail: /thumbnail/img25.jpg
toc: true
description: Android生命周期感知组件详解
categories: Android
tags: [Android]
---


## Android生命周期感知组件详解

使用Lifecycle-aware components（生命周期感知组件），可以将与Activity、Fragemnt、Service生命周期相关方法如 `onStart()` `onStop()`中的调用，放入单独的模块中,lifecycle-aware components可以自动根据生命周期进行不同的处理。
<!--more-->
### Lifecycle类

![](public/img/Android/lifecycle.png)

Lifecycle可以持有组件的生命周期的信息，其使用两个枚举类型来跟踪与之相关的组件的生命周期。

* Event

    由framework层分发的以及`Lifecycle`类分发的生命周期事件，这些事件映射到Activity以及Fragemnt的回调

* State
   
    表示由`Lifecycle`对象跟踪的组件的当前的状态
    
### LifecycleOwner

`LifecycleOwner`是只有一个方法的接口，在代码编写的过程中任何一个类都可以实现该接口。

源码：

```java
public interface LifecycleOwner {
    /**
     * Returns the Lifecycle of the provider.
     *
     * @return The lifecycle of the provider.
     *
    @NonNull
    Lifecycle getLifecycle();
}

```

一个常用的生命周期感知用于Android组件的中回调，如果回调函数发生在组件的不合理生命周期则会造成崩溃的发生。在Support Library 26.1.0 以及更新的版本中，Fragment以及Activity已经实现`LifecycleOwner`接口。


### LifecycleObserver

`LifecycleObserver`接口可以与实现`LifecycleOwner`接口的类配合使用，实现`LifecycleOwner`接口的类提供`Lifecycle`，而`LifecycleObserver`可以注册至被观察者。





