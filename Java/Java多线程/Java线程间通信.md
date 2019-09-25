# 线程间通信

* 使用单向管道（Pipe）传递数据
* 共享内存（Shared Memory）通信
* 使用阻塞队列（Blocking Queue）实现生产者-消费者模式
* 处理消息队列（Message Queue）


## wait/notify机制

等待/通知机制主要由Object类中的三个方法进行保证

1、wait()；notify();notifyAll()
上述三个方法均为Object类中声明的方法，而非在Thread类中进行声明；每一个对象都拥有monitor，等待该对象的锁，应该通过操作该对象进行操作，而非通过当前线程来操作；`wait();notify();notifyAll()`只有在被`synchronized `修饰的方法中，或者在锁中，可以进行调用，如果在其他地点调用，则会抛出`IllegalMonitorStateException`异常。

1)wait()
让当前线程（Thread.cocurrentThread()方法所返回的线程）释放对象所锁并进入阻塞状态,等待另一线程改变外界变量唤醒；调用`notify()`或者`notifyAll()`时唤醒当前线程。`wait()`也可以作为任务同步的一种方式。

**注：调用`sleep()`和`yield()`方法不能释放当前的对象锁**
`wait()`方法有两种用法：
* ` wait(long timeout)`等待一定的时间，但与`sleep()`方法不同，其会释放对象锁
* 使用`wait()`等待`notify()`或者`notifyAll()`唤醒。 


2)notify()
唤醒一个正在等待相应对象锁的线程，使其进入就绪队列；

3)notifyAll()
唤醒所有正在等待相应对象锁的线程，相对于，使他们进入就绪队列，在调用该方法时，首先需要获取到对象锁，在可以进行调用;通过`synchronized(x)`来获取对象锁。

```java
     synchronized(x) { 
       x.notifyAll();
     }

```


2、方法调用与线程状态关系

每个对象锁都有两个队列，一个是就绪队列，一个是阻塞队列

## Condition

Condition是在Java 1.5中出现的，用于替代传统的Object的wait()/notify(),它的使用依赖于Lock;Condition的await()/sigmal()比Object的wait()/notify()更高效与安全。Condition的await()/signal()的使用都必须在lock的保护之内，即在lock.lock()与lock.unlock()之间使用；

对应关系

* Condition中的await()对应Object的wait()
* Condition中的signal()对应Object的notify()
* Condition中的signalAll()对应Object中的notifyAll();

**Condition实现一种分组机制，将所有对临街资源进行访问的线程进行分组，以便实现线程间更精细化的操作，例如通知部分线程；多个线程可以竞争一把锁，一把锁也可以关联多个Condition,以便多个线程进行通信和协同**

### 生产者消费者模型

### 线程间通信管道模式

#### CountDownLatch的使用

用于同步一个或者多个任务，强制它们等待一系列的其他任务操作的结束。


#### CyclicBarrier的使用

`CyclicBarrier`类用于创建一组并行的类，等待它们全部执行完成进入后续的任务(类似于`join`)，与`CountDownLatch`类的使用类似，`CountDownLatch`类只能执行一次，而`CyclicBarrier`可以进行多次使用。


#### `DelayQueue`的使用

`DelayQueue`是一个无界的阻塞队列，实现`Delayed`接口。只有当`delay`被激发时，该对象才能从队列中获取数据














