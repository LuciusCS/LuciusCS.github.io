---
title: Java多线程之间的协作
cover:  /cover/img61.jpg
toc: true
description: Java多线程之间的协作
categories: Java
type: [Java]
date: 2019/02/15
---

## Java多线程协作

Java多线程之间的协作需要解决的一个问题是任务之间的握手操作，要完成握手操作，需要互斥量，互斥量可以保证每次只有一个任务可以获取该信号，在某一互斥量的状态下将任务挂起，或通过某一操作恢复任务操作。在`Object`对象中有`wait()`和`notifyAll()`方法，在Java  SE 5多任务库中添加`Condition`类，其中有`await()`和`singal()`方法。
<!--more-->

### join

当一个在线程**m**中调用`t.join()`，**m**线程会被挂起，直至**t**执行结束(`t.isAlive`为false)；如果**t**线程调用`t.interrupt()`(在**m**线程之外)，则线程**m**中会继续执行任务。




### 线程同步

monitor、synchronized 、wait/notify 
synchronized 
park & unpark
ReentrantLock