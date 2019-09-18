### Runnable接口

仅调用Runnable的`run()`方法不能产生一个新的线程，新线程的执行必须通过`Thread.start()`方法来执行。

通常将一个Runnable对象转换成一个任务，需要将其传递给一个Thread构造函数。

### Thread类

Thread类的构造函数需要Runnable实例，调用Thread类的`start()`方法，可以对线程进行必要额初始化，然后执行Runnable实例的`run()`方法。

静态方法`Thread.yield()`用于通知CPU从一个线程切换至另外一个线程；

``


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


### join

当一个在线程**m**中调用`t.join()`，**m**线程会被挂起，直至**t**执行结束(`t.isAlive`为false)；如果**t**线程调用`t.interrupt()`(在**m**线程之外)，则线程**m**中的`t.join()`将不会执行。




 
 