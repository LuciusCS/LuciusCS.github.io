---
title: "Android中使用的集合"
description: "Android中使用的集合介绍"
type: [Android]
toc: true
cover:  /cover/img101.jpg
categories: Android
date: 2019/5/16
---
## Android中使用的集合介绍

### HashMap、ArrayMap和SparseArray

1、HashMap本质上是一个基于HashMapEntry的数组，每个Entry的实体都包括:

*  一个非基本类型的key
*  一个非基本类型的value
*  一个key的Hashcode
*  指向下一个Entry的指针


```java
  final K key;
  V value;
  HashMapEntry<K,V> next;
  int hash;

```

因为使用泛型，所以不能使用基本类型作为key和value，当插入基本类型时，会产生自动装箱操作
查找的时间复杂度为O(1)



HashMap的缺点

* 自动装箱意味着需要产生额外的对象，这对于内存的使用和垃圾回收产生影响。
* HashMapEntity自己本身也会产生额外的对象，这同样会影响内存的使用和垃圾回收产生。
* 每次HashMap的存储对象减少或都增加的时候，这个开销会随着Hashmap的size增加而增加。
* 需要存储它的key和对应的hash值。这种冗余有助于解决冲突。 
*

2、android.util.ArrayMap

ArrayMap用了两个数组，在其内部使用`Object[] mArray`来存储object,使用`int[] mHashes`来存储hashCode，相对于HashMap来说，每一次put会少创建一个对象 HashMapEntry

* Key/Value可以被自动装箱
* Key和Value在mArray中交叉存储，key在 2 index位置，value在 2 index+1的位置；
* Key的哈希值会被计算出来并存储在mHashed[]中
* 在查找时，计算key的hashcode并在，mHashes[]中对hashcode进行二分法查找，时间复杂度为O(logN)




3、android.support.v4.util.ArrayMap

android.util.ArrayMap只能在api不小于19（Kitkat）的平台才能使用。而Support library则支持在旧平台上提供相同的功能。
4、android.support.v4.util.SimpleArrayMap

这个类没有entrySet()这个支持迭代的方法,java标准集合中方法大部分也没有，有助于减少大部分没有使用的Collection api代码，内部工作和android.util.ArrayMap是一样的
 
5、android.util.SparseArray

其与ArrayMap一样，里面也是两个数组，一个int[] mKeys和Object[] mValues

SparseArray只接受 int 类型作为key，

注：

* key(不是hashcode)保存在 mKeys[]的下一个可用位置上，所以不会对key进行自动装箱
* value保存在  mValues[] 的下一个可用的位置上，如果其是基本类型，需要进行自动装箱
* 查找key采用二分法查找，时间复杂度为O(logN)
* 相较于HashMap，放弃了HashCode并依赖于二分查找，在添加和删除操作时会有更好的性能

6、android.util.LongSparseArray

实现原理与android.util.SparseArray一致，其key为long类型

7、android.util.SparseBooleanArray

实现原理与android.util.SparseArray一致，其key为boolean类型




注：

* ArrayMap和SparseArray不能保证保留它们的插入顺序，在迭代的时候应该注意。


Map在put时创建对象的个数 HashMap>ArrayMap>SparseArray

||HashMap|ArrayMap|SparseArray|
| ------ | ------ | ------ | ------ |
|put创建对象个数|3|2|0|
|是否装箱|是|是|否|
|查找时间复杂度|O(1)|O(logN)|O(logN)|

