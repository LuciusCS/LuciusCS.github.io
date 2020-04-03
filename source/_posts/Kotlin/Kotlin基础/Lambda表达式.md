---
title: Kotlin Lambda表达式
thumbnail: /thumbnail/img66.jpg
toc: true
description: Kotlin Lambda表达式
categories: Kotlin
tags: [Kotlin]
date: 2019/07/30
---



### 使用Lambda表达式遍历数组

```kotlin
    //val
    stringArrays.forEach({
        it->println(it)
     })

```
<!--more-->
Kotlin中Array的`forEach()`函数源码如下，它是一个扩展方法，在for循环中调用我们传入的lambda表达式；`action: (T) -> Unit`中`(T) -> Unit`是lambda表达式的类型，即函数的类型，此函数参数类型为`T`返回值为`Unit`

```kotlin

    public inline fun <T> Array<out T>.forEach(action: (T) -> Unit): Unit {
        for (element in this) action(element)
    }
```

lambda表达式作为形参的类型

```kotlin
    ()->Int          //无参数，返回Int类型
    (Int,Int)->Int   //两个整型参数，返回Int
    (()->Unit,Int)->Int //一个lambda表达式参数，一个整型参数，返回Int 

```


在kotlin中，可以把函数的最后一个lambda表达式移到括号外

```kotlin
    stringArrays.forEach(){
        it->println(it)
    }

```

如果lambda表达式里只有一个函数调用，并且这个函数的参数也是Lambda表达式的参数，那么可以使用函数引用

```kotlin
    stringArrays.forEach(::println)

```

使用标签从Lambda表达式中返回,其中`forEachItem`为自定义标签，`@forEachItem`与return之间不能存在空格
```kotlin
    stringArrays.forEach forEachItem@{
            if (it==1) return@forEachItem
    }
```



在Lambda中最后一个表达式的值是默认的返回值



#### 高阶函数

高阶函数是将函数用作参数或返回值的函数
