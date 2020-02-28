# Handler介绍

Handler直接继承于Object类

Handler与一个线程的`MessageQueue`进行绑定，可以用于`Message`的发送与处理以及`Runnable`对象的处理。Handler对象被创建时，就与创建自己的线程以及该线程的`Message Queue`相绑定，它可以将messages以及runnables对象传递到`Message Queue`，并对`Message Queue`中的messages以及runnables对象进行处理。

Handler使用的两个主要方面：
1、对messages以及runnables在将来某一个节点执行进行调度；
2、在非当前线程执行其他操作

Handler对Message的调度通过`post(Runnable)`, `postAtTime(Runnable, long)`, `postDelayed(Runnable, Object, long)`, `sendEmptyMessage(int)`, `sendMessage(Message)`, `sendMessageAtTime(Message, long)`, 以及·、`sendMessageDelayed(Message, long) `等方法进行，`post`方法可以将`Runnable`对象插入到队列中，当消息队列收到`Runnable`对象时，可以执行。`sendMessage`方法可以将`Message`对象（其中包含大量数据）插入到队列中，通过`HandlerMessage`方法进行处理。

当向Handler发送消息时，既可以立刻处理消息，也可以指定延时处理。

当应用程序创建一个进程之后，它的主线程用于持有的`Message Queue`用于管理“顶级”的应用对象(`Activity` `Broadcast Receiver`等)和他们创建的窗口。当创建自己的线程时，可以通过`Handler`与应用的主线程进行信息交换。

# Looper介绍

Looper直接继承于Object

Looper类用于运行一个线程中的message loop，线程在默认状态下没有message loop与之相关联；需要通过调用thread类中的`prepare()`方法来运行一个loop，`loop()`方法用来处理message。

与message loop进行大部分交互都是通过`Handler`类来进行。

下列代码是实现一个`Looper`线程的方式，通过分离开的`prepare()`以及`loop()`方法初始化一个Handler与Looper进行交互。


```java

 class LooperThread extends Thread {
  
      public Handler mHandler;

      public void run() {
          Looper.prepare();

          mHandler = new Handler() {
              public void handleMessage(Message msg) {
                  // process incoming messages here
              }
          };

          Looper.loop();
      }
  }

```

# MessageQueue介绍

MessageQueue直接继承于Object

Message不能直接添加至`Message Queue`中，需要通过与`Looper`相关联的`Handler`对象来实现。通过`Looper.myQueue`方法可以从当前线程中获取`MessageQueue`


### 从源码角度分析Handler、Looper、MessageQueue三者之间的关系

`Handler`默认构造函数`Handler()`，将自己与当前线程的`Looper`进行绑定，如果当前线程中没有`Looper`对象，会报出异常。

```
  
    //Handler源码117行
    public Handler() {
        this(null, false);
    }
    
    //Handler源码131行
      public Handler(Callback callback) {
        this(callback, false);
    }
    
    
```

通过`Looper.prepare();`为当前线程设置一个`Looper`
具体流程：
其中`prepare()`方法是`Looper`类中的静态方法；在`prepare(boolean quitAllowed)`方法中调用`sThreadLocal.set(new Looper(quitAllowed));`当前线程设置一个新的`Looper`在构造函数`Looper(boolean quitAllowed)`中，该`Looper`创建了一个新的`MessageQueue`(mQueue = new MessageQueue(quitAllowed););

```

    //Looper源码97行
       public static void prepare() {
        prepare(true);
    }

    private static void prepare(boolean quitAllowed) {
        if (sThreadLocal.get() != null) {
            throw new RuntimeException("Only one Looper may be created per thread");
        }
        sThreadLocal.set(new Looper(quitAllowed));
    }
    
    
    //Looper源码267行
        private Looper(boolean quitAllowed) {
        mQueue = new MessageQueue(quitAllowed);
        mThread = Thread.currentThread();
    }

```


在Handler源码的192行中，通过`mLooper = Looper.myLooper();`来获取当前线程中的`Looper`

```

     //Handler源码192行
  public Handler(Callback callback, boolean async) {
      
        mLooper = Looper.myLooper();
        if (mLooper == null) {
            throw new RuntimeException(
                "Can't create handler inside thread " + Thread.currentThread()
                        + " that has not called Looper.prepare()");
        }
        mQueue = mLooper.mQueue;
        mCallback = callback;
        mAsynchronous = async;
    }

   //Looper71行
    static final ThreadLocal<Looper> sThreadLocal = new ThreadLocal<Looper>();

   //Looper97行

   //Looper源码254行
     public static @Nullable Looper myLooper() {
        return sThreadLocal.get();
    }

```


## Handler发送消息机制

Handler调用` sendMessage(Message msg)`方法最终会一步一步调用`sendMessageAtTime(Message msg, long uptimeMillis)`在该方法中通过`MessageQueue queue = mQueue;`获取到MessageQueue，调用  用`enqueueMessage(MessageQueue queue, Message msg, long uptimeMillis)`方法将`Message`加入到消息队列中

```
   //Handler源码中的689行
       public boolean sendMessageAtTime(Message msg, long uptimeMillis) {
        MessageQueue queue = mQueue;
        if (queue == null) {
            RuntimeException e = new RuntimeException(
                    this + " sendMessageAtTime() called with no mQueue");
            Log.w("Looper", e.getMessage(), e);
            return false;
        }
        return enqueueMessage(queue, msg, uptimeMillis);
    }
```

## Handler消息处理机制
















