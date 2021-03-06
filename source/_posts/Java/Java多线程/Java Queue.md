---
title: Java Queue
cover: /cover/img98.jpg
toc: true
description: Java Queue
type: [Java]
categories:  Java 
date: 2019/04/03
---

## 队列（Queue）

## 阻塞队列（Blocking Queue）
当插入数据时，如果队列已满，则插入操作会被阻塞；在取出数据是，如果队列为空，则取出操作会被阻塞；

阻塞队列支持生产者和消费者模式，在阻塞队列中生产者和消费者，不能同时对队列进行操作；其会将要操作的对象，放入"to do"列表，在某时间后进行处理，而不是对数据立即进行处理。在阻塞队列的生产者和消费者的模式下，当生产者可操作时，将数据插入队列中；当消费者可操作时，其从队列中取出数据。可以具有多个生产者和多个消费者；


### 子类

* LinkedBlockingQueue
   与LinkedList相似
   `put()` 在队列满的时候会阻塞，直到有成员被消费;
   `take()`在队列空的时候会被阻塞，直到有成员被加入队列；

* ArrayBlockingQueue
   与ArrayList相似 
* PriorityBlockingQueue 
    是一个优先级队列，可以对实现 Comparable 接口的元素进行优先级排序
* SynchronousQueue
    不是一个真正的队列，其没有用于保存元素的空间。它持有一个队列线程列表，等待入队或者出队，节省从生产者将数据移交给消费者的时间延时。因为其没有存储空间，在有足够多的消费者，且总有一个在等待处理信息的消费者的时候进行使用。


## 并发队列（ConcurrentLinkedQueue）  

基于链表实现的队列，队列中每一个Node同时拥有下一个Node的的引用
