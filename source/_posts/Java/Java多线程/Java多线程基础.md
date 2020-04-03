---
title: Java多线程基础
thumbnail: /thumbnail/img62.jpg
toc: true
description: Java多线程基础
categories: Android
tags: [Android]
date: 2018/11/25
---

### Runnable接口

仅调用Runnable的`run()`方法不能产生一个新的线程，新线程的执行必须通过`Thread.start()`方法来执行。

通常将一个Runnable对象转换成一个任务，需要将其传递给一个Thread构造函数。
<!--more-->
实现Runnable接口，并在一个独立的线程中运行Runnable.run()方法中的代码；一个或多个Runnable对象执行不同的操作，有时也被称为任务。

Thread以及Runnable是基类，只有有限的功能，事实上他们也是HandlerThread,AsyTask以及IntentService的基类，也同时是ThreadPoolExcutor的基类。ThreadPoolExcutor可以自动管理线程以及任务队列，甚至可以同时运行多个线程。

### Thread类

Thread类的构造函数需要Runnable实例，调用Thread类的`start()`方法，可以对线程进行必要额初始化，然后执行Runnable实例的`run()`方法。

静态方法`Thread.yield()`用于通知CPU从一个线程切换至另外一个线程；

**注：Thread以及Runnable是基类，只有有限的功能，事实上他们也是HandlerThread,AsyTask以及IntentService的基类，也同时是ThreadPoolExcutor的基类。ThreadPoolExcutor可以自动管理线程以及任务队列，甚至可以同时运行多个线程。**


### 多线程框架Executor的使用
Executors在client以及任务之前提供了一个间接层，而不是有client直接执行相应的任务，即用于对线程进行管理操作。

 ExecutorService是一个带有生命周期的服务Executor，可以提供合适的上下文执行Runnable对象。
 
 Executors中的`shutdown()`方法用于停止向Executor中提交新的任务，在`shutdown()`方法调用之前提交的同步线程任务则会继续执行。
 
 ***注：在Java SE 1.5之前使用 thread group来对线程运行过程中出现的异常情况进行处理，在Java SE 1.5之后使用 Executor进行处理***
 
#### Executor、Executors、ExecutorService区别

* Executor是一个接口，用于并发提交的任务，只有`execute()`一个方法，没有返回值，不能对任务进行任何操作。

```java
    public interface Executor {
        void execute(Runnable var1);
    }
```

* Executors类提供不同的工厂方法来创建不同类型的线程池，包括：`newSingleThreadExecutor()`、`newFixedThreadPool(int numOfThreads)`、`newCachedThreadPool()`

```java

    public class Executors {
            //...
            public static ExecutorService newFixedThreadPool(int var0) {
            return new ThreadPoolExecutor(var0, var0, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue());
        }
        
        //...
    }

```


* ExecutorService 是继承自`Exxecutor`的接口，其中有异步执行和关闭线程池的方法。可以通过`submit()`方法来提交任务，同时可以对任务进行取消等操作。

```java
    public interface ExecutorService extends Executor {
        //...
        void shutdown();

        List<Runnable> shutdownNow();

        boolean isShutdown();

        boolean isTerminated();
        //...          
          
    }
```

 
 ### 不同线程池的使用

CachedThreadPool没有线程数量限制，会按照需要创建足够的线程，当循环使用到旧的线程时会停止创建新的线程。

 ```java
     ExecutorService exec = Executors.newCachedThreadPool();
 ```
 
 FixedThreadPool可以控制提交到Executor的任务的数量，线程池中的线程会自动被重新使用。
 
 ```java
     ExecutorService exec = Executors.newFixedThreadPool(5); 
 ```
 
 SingleThreadExecutor可以看做是只有一个线程的FixedThreadPool，当有一个需要长时间存活的任务时使用SingleThreadExecutor。SingleThreadExecutor在执行时使用同一个线程，并将提交的任务使用队列进行管理。当使用文件系统时，可以使用SingleThreadExecutor，这样就不需要对文件资源进行同步处理。
 
 ```java
     Executors.newSingleThreadExecutor(); 
 ```
 
 ### 任务的回调
 
使用Callable和Future,一个产生结果，一个拿到结果
 
每一个**Runnable**都是一个没有返回值的独立的任务，当该任务执行完成后，如果需要一个返回值，可以使用**Callable**接口，而非**Runnable接口**。

Callable接口带有`type`类型参数，该参数表示`call()`方法（非`run()`）方法执行完成后的返回值，必须通过调用` ExecutorService submit()`调用来执行。

`submit()`方法返回一个一个Future对象，可以通过调用Future的`isDone()`方法来判断当前任务是否执行结束。调用Future的`get()`方法，如果当前任务没有结束，则会被阻塞，直至任务结束

```java
     class CallableResult implements Callable<String> {   
        private int id;    
        public TaskWithResult(int id) {     
          this.id = id; 
         } 
           public String call() {    
            return "result" + id;  
           }
        }
        
      public class CallableDemo {   
        public static void main(String[] args) {   
        ExecutorService exec = Executors.newCachedThreadPool();                    
        ArrayList<Future<String>> results = new ArrayList<Future<String>>();               
         for(int i = 0; i < 10; i++)
          results.add(exec.submit(new CallableResult(i)));  
         for(Future<String> fs : results)     
                try {               
                   System.out.println(fs.get()); 
                } catch(InterruptedException e) {
                    System.out.println(e);         
                    return;      
                } catch(ExecutionException e) {     
                    System.out.println(e);      
                } finally{        
                     exec.shutdown(); 
                 } 
             } 
     }

```

### 任务的暂停

通过调用`TimeUnit.MILLISECONDS.sleep(100);`来阻塞当前线程指定的时间。


### 线程优先级
 
 JDK有十中不同的优先级。
 
 线程优先级`Thread.MIN_PRIORIT`、`Thread.MAX_PRIORITY`，通过`setPriority()`方法进行设置，以及`getPriority()`方法进行获取。

```
     public void run() {Thread.currentThread().setPriority(priority);
```


### 守护线程Daemon threads 

守护线程试图为程序提供一个后台服务，不是程序必须的线程，当程序即终止时，会杀死所有的守护线程执行。在使用守护线程时，需要在`thread.start();`之前调用`daemon.setDaemon(true)`;

如果一个线程是守护线程，那么其创建的所有子线程都是守护线程，可以通过调用`isDaemon()`方法进行查看是否为守护线程。



### 数据共享

#### synchronized关键字

使用synchronized关键字保护的代码段，在运行在之前会检测是否加锁，如果没有锁则执行。
```java

    synchronized void f() { /* ... */ }
```

当调用被synchronized关键字修饰的方法时，该方法所在的对象会被自动加锁，只有当该锁被释放后，其他方法才可以被调用。

在使用并发操作时，需要将数据域设置为private，否则synchronized关键字不能保证其他线程直接获取数据域操作，造成冲突。


#### Lock对象的使用

在调用`lock()`方法后，一定需要添加在`try-finally`的代码块，并在finally中调用`unlock()`方法。这是唯一可以保证锁可以释放的方式。return关键字一定要在`try`代码块中实现，这样可以保证锁释放之前返回需要的值。***如果`lock.lock()`方法调用失败会出现什么情况***

```
     private Lock lock = new ReentrantLock();
     int num=0;
     
     public int f(){
        lock.lock();    
        try {       
             Thread.yield();   
             return num++;    
         }finally {      
            lock.unlock();  
        }   
```
当使用synchronized关键字不能解决并发问题时，需要使用Lock进行处理，如：使用synchronized不能获取到代码锁，或者尝试多次获取到锁之后停止代码运行。

```java
     boolean captured = false;    
      try {      
        captured = lock.tryLock(2, TimeUnit.SECONDS);   //限制请求次数
        //captured = lock.tryLock();          //不限制请求次数
       } catch(InterruptedException e) {      
         throw new RuntimeException(e);     
       } 
      try {       
         System.out.println("tryLock(2, TimeUnit.SECONDS): " + captured);    
       } finally {     
              if(captured)        
              lock.unlock();    
       }   

```

#### 原子性和波动性（Atomicity and Volality（易变的））
原子性操作不可以被打断，一旦其开始执行，就会执行至操作结束，不需要进行同步。按照《Thinking In Java》书中所讲：“依赖于原子性操作是困难以及危险的，除非开发者是并发的专家，或者是这方面的专家，才可以使用原子操作，来避开线程同步。”所以我们的第一选择是`synchronized`而非`volatile`。

原子操作被应用于除`long`和`double`的基础数据类型中，读和写基础类型保证了对内存的操作是原子性的。JVM将64位数据（`long`和`double`类型）是为两个独立的32位操作，因此在操作的过程中会被打断。在`long`和`double`数据类型使用`volatile`关键字可以保证其操作的原子性。

在多处理器系统中，与单处理器系统相比可见性比原子性更重要。在一个任务对数据做出改变即使其是原子性的，改变的数据其他线程也可能观察不到（数据的改变可能被临时存放在寄存器中），造成不同的任务获取到统一数据的不同状态。在同步操作机制中，可以保证数据的改变可以被不同的任务观察到相同的数据，即将改变的数据刷到内存中。

当一个变量`volatile`关键字，则其在修改后会被其他任务立即观察到数据改变，即使该变量是一个局部变量。`volatile`关键字只在多任务中使用，如果一个变量只在单任务中，那么其改变后一定会被观察到。`volatile`关键字在使用的过程中，如果一个值依赖于其之前的值（自增）那么该关键字将会失效，或者其值有上界或者下界也会失效。

 atomicity和volatility是两个不同的概念，原子性操作如果是非`volatile`类型的，那么其不会被立即刷到内存中；如果一个变量在一个` synchronized `的方法或者代码块中，那么变量也会被刷到内存中。


#### Atomic classes （原子类）

在Java SE 5中介绍了特殊的原子类：`Atomiclnteger`, `AtomicLong`, `AtomicReference`；对其操作时提供了原子类型的状态。

#### 临界区

在多线程操作时只需将对部分代码进行操作，而非整个方法进行同步，则可使用临界区进行实现。


使用`synchronized`创建临界区
```java
     synchronized(syncObject) {  
       // This code can be accessed 
      }
    
    
    class PairManager2 extends PairManager { 
     public void increment() { 
         Pair temp;     
         synchronized(this) {   
             p.incrementX();    
             p.incrementY();     
             emp = getPair();   
         }   
         store(temp); 
        }
    } 
   
```

使用功`Lock`锁创建临界区

```java
    class ExplicitPairManager2 extends PairManager {
      private Lock lock = new ReentrantLock();  
      public void increment() {    
         Pair temp;     
         lock.lock();    
         try {     
           p.incrementX();    
           p.incrementY();     
           temp = getPair();   
           } finally {     
             lock.unlock();   
             }   
           store(temp);  
     } 
    }

```








 
 