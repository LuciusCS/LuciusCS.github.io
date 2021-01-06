---
title: Java集合
type: [Java]
description: Java集合
cover:  /cover/img56.jpg
toc: true
categories: Java
---



# Collection的使用方法

接口`Collection`继承自`Iterable`接口    

用于表示一系列的独立元素，其中List按照元素插入的顺序存储，Set中不能含有相同的元素，Queue用于队列的表示，并按照插入的顺序进行存储。
<!--more-->
## Queue 接口

只能在队尾入队，队首出队
### BlockingQueue接口
实现类 
* ArrayBlockingQueue 有界阻塞队列，内部使用数组实现，初始化大小后无法改变大小
* DelayQueue 注入其中的元素必须实现 java.util.concurrent.Delayed 接口
* LinkedBlockingQueue 内部以链表的形式实现
* PriorityBlockingQueue 无界并发队列
* SynchronousQueue 其是一个特殊的队列，内部只能容纳单个元素；

方法
* add 增加一个元索，如果队列已满，则抛出一个IIIegaISlabEepeplian异常
* remove   移除并返回队列头部的元素，如果队列为空，则抛出一个NoSuchElementException异常
* element  返回队列头部的元素，如果队列为空，则抛出一个NoSuchElementException异常
* offer  添加一个元素并返回true，如果队列已满，则返回false
* poll  移除并返问队列头部的元素，，如果队列为空，则返回null
* peek  返回队列头部的元素，如果队列为空，则返回null
* put  添加一个元素，如果队列满，则阻塞
* take 移除并返回队列头部的元素，如果队列为空，则阻塞

## Deque接口

队首、队尾都可以进行入队和出队操作


 

## List接口：实现类 ArrayList LinkedList Vector
### ArrayList

ArrayList使用数组实现，在频繁做增删元素的时候效率会降低，底层需要判断新建一个多长的数组存放操作之后的数组；其可以精确设置数组长度；查询快，增删慢；

ArrayList在循环中删除元素可能会出现问题：
1、使用for(;;)正序删除，会有元素发生位移，导致删除遗漏
2、使用for-each进行删除，实际是调用它的迭代器来实现，

### LinkedList
LinkedList使用双向链表实现；增删快，查询慢（按照下标增删元素一样慢） 

### Vector

Vector使用数组实现，线程安全，ArrrayList线程不安全；Java不建议使用此类，使用ArrayList进行代替；

    
    
**Java Doc里建议用Deque替代Stack接口完成栈的功能**


## Set接口：实现类 Hashset、TreeSet、LinkedHashSet

*  Hashset：按照哈希算法存取集合中的对象，不保证有序，存取速度快；允许null数据；
*  TreeSet：实现Sorted接口，能够对集合中的对象进行排序，插入速度最慢；
* LinkedHashSet：主要用于保证FIFO，集合有序；允许null数据；

共同点：非线程安全，如果需要线程安全需要使用 `collection.synchronized()`

### TreeSet的排序方式

1、实现Comparable接口

```java

public class TestBean implements Comparable<TestBean> {
    @Override
    public int compareTo(TestBean testBean) {
        return 0;
    }
}

```


2、实现Comparator接口

```java
public class TestBean implements Comparator<TestBean> {

    @Override
    public int compare(TestBean testBean, TestBean t1) {
        return 0;
    }
}

```



## Map接口

### HashMap和HashTable
1、HashMap是非线程安全的，HashTable是线程安全的；
2、HashMap的键值都为null,HashTable不可；
3、HashMap的效率高于HashTable;


### LinkedHashMap

LinkedHashMap<K,V>可以进行访问排序

LruCache可以使用LinkedHashMap进行实现

### WeakHashMap

WeakHashMap继承AbstractMap，实现Map接口，是一个散列表；将一组 key-value 插入WeakHashMap中不能阻止改key被GC回收，除非在WeakHashMap外对该Key有强引用；因此其可用来做缓存。


### HashMap遍历



##  Iterable和Iterator(迭代器)



## TreeMap和TreeSet



