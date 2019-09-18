### Runnable接口

仅调用Runnable的`run()`方法不能产生一个新的线程，新线程的执行必须通过`Thread.start()`方法来执行。

通常将一个Runnable对象转换成一个任务，需要将其传递给一个Thread构造函数。

### Thread类

Thread类的构造函数需要Runnable实例，调用Thread类的`start()`方法，可以对线程进行必要额初始化，然后执行Runnable实例的`run()`方法。

静态方法`Thread.yield()`用于通知CPU从一个线程切换至另外一个线程；


### 多线程框架Executor的使用
Executors在client以及任务之前提供了一个间接层，而不是有client直接执行相应的任务，即用于对线程进行管理操作。

 ExecutorService是一个带有生命周期的服务Executor，可以提供合适的上下文执行Runnable对象。
 
 Executors中的`shutdown()`方法用于停止向Executor中提交新的任务，在`shutdown()`方法调用之前提交的同步线程任务则会继续执行。
 
 
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
 
 
 