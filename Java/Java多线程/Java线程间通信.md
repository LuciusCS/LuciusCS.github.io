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

线程锁控制代码
```java
public class Service {

    //线程锁
    private ReentrantLock lock=new ReentrantLock();
    //生产者线程控制
    private Condition conditionCustomer=lock.newCondition();
    //消费者线程控制
    private Condition conditionProducer=lock.newCondition();
    //用于表示需要生产
    private boolean hasValue=false;
    //用于随机消费时间；
    private static Random rand = new Random(2000);

    //用于生产者
    public void produce(){
        try {
            lock.lock();
            while (hasValue){
                System.out.println("生产线程："+Thread.currentThread().getName()+"await");
                conditionCustomer.await();
            }
            System.out.println("线程："+Thread.currentThread().getName()+"生产中");
            Thread.sleep(rand.nextInt(500));
            hasValue=true;
            System.out.println("线程："+Thread.currentThread().getName()+"生产完毕");
            System.out.println(Thread.currentThread().getName()+"唤醒所有消费者线程 "+"....");
            System.out.println("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.");
            //唤起所有的消费者线程
            conditionProducer.signalAll();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    //用于消费者
    public void custome(){
        try{
            lock.lock();
            while (!hasValue){
                System.out.println("消费线程："+Thread.currentThread().getName()+"await");
                conditionProducer.await();
            }
            System.out.println("线程："+Thread.currentThread().getName()+"消费中");
            Thread.sleep(rand.nextInt(4000));
            hasValue=false;
            System.out.println("线程："+Thread.currentThread().getName()+"消费完毕");
            System.out.println(Thread.currentThread().getName()+"唤醒所有生产者线程 ");
            System.out.println("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.");
            //唤起所有的生产者线程
            conditionCustomer.signalAll();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    }
}

```

消费者线程

```java
public class CustomerThread extends Thread {

    private Service service;
    public CustomerThread(Service service) {
        this.service = service;
    }
    @Override
    public void run() {
        while (true){
            service.custome();
        }
    }
}

```
测试代码
```java

public class Customer_ServiceMain {

    public static void main(String[] args) throws InterruptedException {
        Service service=new Service();
        CustomerThread[] customerThread=new CustomerThread[10];
        ProducerThread[] producerThreads=new ProducerThread[10];
        for (int i=0;i<3;i++){
            customerThread[i]=new CustomerThread(service);
            customerThread[i].setName("生产者Thread："+i);
            producerThreads[i]=new ProducerThread(service);
            producerThreads[i].setName("消费者Thread："+i);
            customerThread[i].start();
            producerThreads[i].start();

        }
    }
    }

```

运行结果,出现未被唤起的线程，我认为是当前线程正在执行生产或者消费任务，无需进行唤起操作。

```xml
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.
消费线程：生产者Thread：1await
消费线程：生产者Thread：0await
线程：消费者Thread：2生产中
线程：消费者Thread：2生产完毕
消费者Thread：2唤醒所有消费者线程 ....
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.
生产线程：消费者Thread：2await
生产线程：消费者Thread：1await
生产线程：消费者Thread：0await
线程：生产者Thread：2消费中
线程：生产者Thread：2消费完毕
生产者Thread：2唤醒所有生产者线程 
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.
生产线程：消费者Thread：1await
生产线程：消费者Thread：0await
线程：生产者Thread：2消费中
线程：生产者Thread：2消费完毕
生产者Thread：2唤醒所有生产者线程 
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.
消费线程：生产者Thread：2await
消费线程：生产者Thread：1await
消费线程：生产者Thread：0await
线程：消费者Thread：2生产中
线程：消费者Thread：2生产完毕
消费者Thread：2唤醒所有消费者线程 ....
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.

```


### 线程间通信管道模式

#### CountDownLatch的使用

用于同步一个或者多个任务，强制它们等待一系列的其他任务操作的结束。

任务执行线程
```java
    public class Task extends Thread {

    private static Random random = new Random(100);

    private final CountDownLatch latch;

    //使用CountDownLatch会被自动要求加上此构造函数
    public Task(CountDownLatch latch, String name) {
        this.latch = latch;
        this.setName(name);
    }

    @Override
    public void run() {

        try {
            doWork();
            //用于倒数技术
            latch.countDown();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void doWork() throws InterruptedException {
        //random.nextInt(2000)在Java中是线程安全的来自TIJ
        TimeUnit.MILLISECONDS.sleep(random.nextInt(1000));
        System.out.println(this.getName() + "completed");
    }
}
```
等待任务执行完毕，需要唤醒的线程
```java
  public class WaitingTask implements Runnable {
    
    private final CountDownLatch latch;

    public WaitingTask(CountDownLatch latch) {
        this.latch = latch;
    }

    @Override
    public void run() {
        try {
            latch.await();
            System.out.println("Latch阻塞运行至waiting class");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
 }


```
测试代码
```java
public class TestCountDown {

    static final int SIZE = 10;

    public static void main(String[] args) throws Exception {

        ExecutorService exec = Executors.newFixedThreadPool(5);
        //所有需要同时结束的线程，需要使用同一个CountDownLatch对象，构造函数用于表示需要等待的线程的个数
        CountDownLatch latch = new CountDownLatch(SIZE);
      // for (int i=0;i<10;i++){   //可以有多个等待线程
        exec.execute(new WaitingTask(latch));
      // }
        for (int i = 0; i < SIZE; i++) {
            exec.execute(new Task(latch,"线程"+i));
        }
        System.out.println("启动所有任务");
        exec.shutdown();  //任务只有在执行完毕后才会结束
    }
}

```
任务执行结果
```xml
启动所有任务
线程0completed
线程4completed
线程1completed
线程2completed
线程3completed
Latch阻塞运行至waiting class

Process finished with exit code 0

```


#### CyclicBarrier的使用

`CyclicBarrier`类用于创建一组并行的类，等待它们全部执行完成进入后续的任务(类似于`join`)，与`CountDownLatch`类的使用类似，`CountDownLatch`类只能执行一次，而`CyclicBarrier`可以进行多次使用。


#### `DelayQueue`的使用

`DelayQueue`是一个无界的阻塞队列，实现`Delayed`接口。只有当`delay`被激发时，该对象才能从队列中获取数据



### 线程间通信管道模式











