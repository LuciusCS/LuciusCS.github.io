## Queue 接口

# Collection的使用方法

接口`Collection`继承自`Iterable`接口    

用于表示一系列的独立元素，其中List按照元素插入的顺序存储，Set中不能含有相同的元素，Queue用于队列的表示，并按照插入的顺序进行存储。

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


## Set接口：实现类 Hashset、TreeSet

*  Hashset：按照哈希算法存取集合中的对象，存取速度快
*  TreeSet：实现Sorted接口，能够对集合中的对象进行排序

## Map接口



### HashMap遍历



##  Iterable和Iterator(迭代器)






