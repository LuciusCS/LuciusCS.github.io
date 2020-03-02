---
title: Dagger2 介绍与使用
thumbnail: /thumbnail/img33.jpg
toc: true
description: Dagger2 介绍与使用
categories: Android
tags: [Android]
date: 2019/10/10
---

# 在Android中使用Dagger2

## Dagger2介绍

### 为什么我们需要注解依赖注入？

Dependency Injection\(注解依赖\)是在IOC\(Inversion of cnontrol\)的基础上实现的，为了将类的实例的实现与类进行分离。

如果一个类使用`new`操作符来实例化另外一个类，那么这两个类直接就产生依赖关系，被称为Hard dependency。
<!--more-->
### 注入模式

* 构造函数注入：以传递参数的方式
* 字段注入：以变量的方式
* 方法注入：

“依赖调用者”通过一个“连接器”从“依赖提供者”调用“依赖对象”

* Dependency provider:使用注解`@Module`表示的类，用于提供可以进行注入的对象。类中的方法使用注解`@Providers`表示该方法的返回对象可以被依赖注入。`@Moudle`可将引用的类（非自己编码的类）的注入，如果是自己编码的类仅用`@Inject`即可
* Dependency consumer：注解`@Inject`用于定义一个依赖。
* Connection consumer and producer：使用注解`@Component`的接口定义module对象中`provider`与依赖对象之间的连接，接口的实现类由Dagger自动生成。

## Dagger2的局限性

* Dagger2不能自动注入域
* Dagger2不能注入private类型
* Dagger2

## 工程结构图

假装有图

