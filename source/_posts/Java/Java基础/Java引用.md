---
title: Java引用
tags: [Java]
description: Java引用
thumbnail: /thumbnail/img54.jpg
toc: true
categories: Java
---



## Java引用

在`java.lang.ref`包中有一系列可以辅助GC灵活进行处理的类；抽象类`Reference`有三个子类`SoftReference`(软引用),`WeakReference`(弱引用),和`PhantomReference`(虚引用)，三个子类的可达性依次减弱。

当你可能需要再次使用某一个Object，也允许GC处理它时，可以使用`Reference`，如果GC发现一个Object是可达的，那么不会回收该对象。


|引用类型 |GC回收时间 |用途 |生存时间|
|-|-|-|-|
|HardReference|从不|对象的一般状态|JVM停止运行时|
|SoftReference|内存不足时|对象缓存|内存不足时停止|
|WeakReference|GC时|对象缓存|GC后终止|
|PhantomReference|unknown|unknown|unknown|

`SoftReference`和`WeakReference`可以选择是否将其放入`ReferenceQueue`，而`PhantomReference`必须放入`ReferenceQueue`中。

注：`ReferenceQueue`用于`PhantomReference`的清理



### Java基本类型与引用类型

注：Java方法中参数传递的方式（值传递，只是传递的值不同）：如果参数是基本类型，传递的是基本类型的字面值的拷贝；如果参数是引用类型，传递的是该参数变量所引用对象在堆中地址值的拷贝。