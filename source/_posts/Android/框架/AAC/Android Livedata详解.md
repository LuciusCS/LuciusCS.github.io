---
title: LiveData介绍与使用
cover: /cover/img26.jpg
toc: true
description: LiveData介绍与使用
categories: Android
type: [Android]
date: 2019/04/23

---

## LiveData介绍
`LiveData`是一个被观察的类，其具有生命周期感知，即只有Android组件，Activity、Fragment、Service处于活动状态时，它才会通知组件数据发生变化。`LiveData`是一个抽象类，其继承关系如下：
<!--more-->
![](/public/img/Android/livedata.png)

#### LiveData的优势
* 保证UI界面与数据相匹配
* 无内存泄漏
    
    观察者绑定至`Lifecycle`，当观察者的生命周期结束后，其会自动清理
* 不会由于Activity stop而发生崩溃

    如果观察者的生命周期进入inactive状态，那么其将不会收到LiveData的数据
* 合理的数据配置
         
    如果Activity和Fragment由于屏幕旋转重建导致页面配置发生变化，则可以通过LiveData获取到最新数据 
* 数据共享

    可以使用继承自Livedata的单例类，定义系统所需要的数据，并在整个App中进行共享。

### 在具有生命周期的对象中使用LiveData

#### 定义被观察者
在定义被观察者对象时通常使用`MutableLiveData`类，在Activity中定义一个被观察的对象：

```java
  
    MutableLiveData<String> mutableLiveData=new MutableLiveData<>();

```

#### 注册观察者：

```java
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mutableLiveData.observe(this, new Observer<String>() {
            @Override
            public void onChanged(String s) {
                Log.i("输出数据：",s);
            }
        });
    }
```

被观察者`mutableLiveData`的数据修改有两种方式：`setValue(T value)`和`postValue(T value) `。当被观察者数据在UI主线程中进行修改时，使用`setValue(T value)`，当被观察者在子线程中使用时，使用`postValue(T value) `；

#### 通过`setValue(T value)`修改被观察者并通知观察者

```
    mutableLiveData.setValue("TEST");
```

`setValue(T value)`源码：
```java
    @MainThread
    protected void setValue(T value) {
        assertMainThread("setValue"); //用于判断是否在主线程，否则抛出异常
        mVersion++;
        mData = value;
        dispatchingValue(null);  //用于数据分发通知观察者
    }

```
在`setValue(T value)`中调用`dispatchingValue(null)`，用于通知观察者。

`dispatchingValue(@Nullable ObserverWrapper initiator)`源码
```java
    //参数ObserverWrapper是每一个观察者的封装
    void dispatchingValue(@Nullable ObserverWrapper initiator) {
       
        //...
        do {
            mDispatchInvalidated = false;
                //...
                //遍历所有的观察者，并进行通知
                for (Iterator<Map.Entry<Observer<? super T>, ObserverWrapper>> iterator =
                        mObservers.iteratorWithAdditions(); iterator.hasNext(); ) {
                    //considerNotify用于通知观察者
                    considerNotify(iterator.next().getValue());
                    if (mDispatchInvalidated) {
                        break;
                    }
            }
        } while (mDispatchInvalidated);
        mDispatchingValue = false;
    }

```

在`dispatchingValue(@Nullable ObserverWrapper initiator)`方法中调用`considerNotify(ObserverWrapper observer)`通知观察者

```java
    private void considerNotify(ObserverWrapper observer) {
        if (!observer.mActive) {
            return;
        }
        if (!observer.shouldBeActive()) {
            observer.activeStateChanged(false);
            return;
        }
        if (observer.mLastVersion >= mVersion) {
            return;
        }
        observer.mLastVersion = mVersion;
        observer.mObserver.onChanged((T) mData);
    }
```


#### 通过`postValue(T value) `修改被观察者并通知观察者

```
        new Thread(new Runnable() {
            @Override
            public void run() {
                mutableLiveData.postValue("TEST");
            }
        }).start();

```

`postValue(T value) `源码：

```java
    protected void postValue(T value) {
        boolean postTask;
        synchronized (mDataLock) {
            postTask = mPendingData == NOT_SET;
            mPendingData = value;
        }
        if (!postTask) {
            return;
        }
        
        //postToMainThread将任务放入主线程中进行，即mPostValueRunnable将会在主线程执行
        ArchTaskExecutor.getInstance().postToMainThread(mPostValueRunnable);
    }
```
`mPostValueRunnable`源码：
```java
    private final Runnable mPostValueRunnable = new Runnable() {
        @Override
        public void run() {
            //...
            //依然是调用setValue对数据进行修改
            setValue((T) newValue);
        }
    };

```

#### 在不具有生命周期的对象中使用LiveData

```
    public class TestLiveDataBean {

        MutableLiveData<String> mutableLiveData = new MutableLiveData<>();
        
        Observer<String> observer;

        public TestLiveDataBean() {
            observer = new Observer<String>() {
                @Override
                public void onChanged(String s) {
                    LogUtils.printInfo(s);
                }
            };
            //添加观察者
            mutableLiveData.observeForever(observer);
        }

        public void setValue() {
            //无论setValue是否在UI主线程中，都可以用postValue
            mutableLiveData.postValue("测试");
            //当在子线程中调用setValue报错
            //mutableLiveData.setValue("测试");
        }
    
          public void removeObserver() {
            mutableLiveData.removeObserver(observer);
        }
    }

```
`observeForever()`与`removeOberver()`方法需要成对进行使用，通过`observeForever()`方法添加观察者，该方法只能在主线程中调用;如果在子线程中订阅会抛出异常；

```java

    @MainThread
    public void observeForever(@NonNull Observer<? super T> observer) {
        assertMainThread("observeForever");
        AlwaysActiveObserver wrapper = new AlwaysActiveObserver(observer);
        ObserverWrapper existing = mObservers.putIfAbsent(observer, wrapper);
        if (existing instanceof LiveData.LifecycleBoundObserver) {
            throw new IllegalArgumentException("Cannot add the same observer"
                    + " with different lifecycles");
        }
        if (existing != null) {
            return;
        }
        wrapper.activeStateChanged(true);
    }

```


观察者使用完毕后，需要通过`removeOberver()`方法，将观察者从观察者队列中移除，该方法只能在主线程中进行调用

`removeObserver(@NonNull final Observer<? super T> observer)`源码：
```java

    @MainThread
    public void removeObserver(@NonNull final Observer<? super T> observer) {
        assertMainThread("removeObserver");
        ObserverWrapper removed = mObservers.remove(observer);
        if (removed == null) {
            return;
        }
        removed.detachObserver();
        removed.activeStateChanged(false);
    }


```

### MediatorLiveData介绍

`MediatorLiveData`是`LiveData`的一个子类，可以将`LiveData`的数据源合并至一起；当任一`LiveData`数据源的数据发生改变后，都会触发`MediatorLiveData`的观察者。


### Android Livedata Observer发生多次调用
LiveData会一直向活跃的应用组件观察者发送数据，而使用Naviagtion组件时，导致了每次切换页面都会重走一次Fragment的生命周期，也就是处于“STARTED 或 RESUMED 状态”，导致了从其他页面切换回来之后，会触发LiveData的数据回调。

解决方式：
1、合理管理ViewModel的范围，虽然ViewModel可以用来Fragment之间的数据共享，但如果业务范围只跟某个Fragment有关，那么最好就只给这个Fragment使用。这样Fragment在销毁或者创建的时候，也会销毁ViewModel与创建ViewModel，ViewModel携带的LiveData就是全新的不会在发送之前设置的数据

2、使用一个google大神实现的一个复写类 SingleLiveEvent，其中的机制是用一个原子 AtomicBoolean记录一次setValue。在发送一次后在将AtomicBoolean设置为false，阻止后续前台重新触发时的数据发送



### LiveData 数据丢失问题

由于 LiveData 数据始终保持最新状态的特性，LiveData 只会保留最新一条数据到缓存中，在平时开发过程中，常常发现数据丢失的情况。

 LiveData调用数据丢失会有多种情况，UI可见、UI不可见、同时调用两次`postValue(T value)`、同时调用两次`setValue(T value)`，先调用`postValue(T value)`后调用`setValue(T value)`，先调用`setValue(T value)`后调用`postValue(T value)`，等多种情况下都会有数据丢失的情况发生。


#### 跟踪 `postValue` 源码

```
   protected void postValue(T value) {
        boolean postTask;
        synchronized (mDataLock) {
            postTask = mPendingData == NOT_SET;
            mPendingData = value;
        }
        if (!postTask) {
            return;
        }
        ArchTaskExecutor.getInstance().postToMainThread(mPostValueRunnable);
    }

    private final Runnable mPostValueRunnable = new Runnable() {
        @SuppressWarnings("unchecked")
        @Override
        public void run() {
            Object newValue;
            synchronized (mDataLock) {
                newValue = mPendingData;
                mPendingData = NOT_SET;
            }
            setValue((T) newValue);
        }
    };


```
`postValue` 执行了 `postToMainThread` 方法，实际上调用的是 `handler.post` 实现的线程切换，线程切换需要几十毫秒的时间开销，当连续发送多条数据时，由于第一条数据的 mPostValueRunnable 未执行完成，postTask 为 false ,后面的 postValue 只会执行 mPendingData = value 赋值操作，当mPostValueRunnable 的 run 方法执行后会拿到最新的 mPendingData 调用 setValue 进行数据分发，因此只会发送最后一条数据，导致前面几条数据丢失。


#### 跟踪 setValue 源码

```
    @MainThread
    protected void setValue(T value) {
        assertMainThread("setValue");
        mVersion++;
        mData = value;
        dispatchingValue(null);
    }

    void dispatchingValue(@Nullable ObserverWrapper initiator) {
        if (mDispatchingValue) {
            mDispatchInvalidated = true;
            return;
        }
        mDispatchingValue = true;
        do {
            mDispatchInvalidated = false;
            if (initiator != null) {
                considerNotify(initiator);
                initiator = null;
            } else {
                for (Iterator<Map.Entry<Observer<? super T>, ObserverWrapper>> iterator =
                        mObservers.iteratorWithAdditions(); iterator.hasNext(); ) {
                    considerNotify(iterator.next().getValue());
                    if (mDispatchInvalidated) {
                        break;
                    }
                }
            }
        } while (mDispatchInvalidated);
        mDispatchingValue = false;
    }
    private void considerNotify(ObserverWrapper observer) {
        if (!observer.mActive) {
            return;
        }
        // Check latest state b4 dispatch. Maybe it changed state but we didn't get the event yet.
        //
        // we still first check observer.active to keep it as the entrance for events. So even if
        // the observer moved to an active state, if we've not received that event, we better not
        // notify for a more predictable notification order.
        if (!observer.shouldBeActive()) {
            observer.activeStateChanged(false);
            return;
        }
        if (observer.mLastVersion >= mVersion) {
            return;
        }
        observer.mLastVersion = mVersion;
        observer.mObserver.onChanged((T) mData);
    }

```


LiveData 只有在 Activity 的 onPause、onStart、onResume 状态时才会发送数据，在其他生命周期时只会保存数据到全局变量 mData 中，并且在 onDestroy 状态时会移出观察者，从而避免了出现内存泄漏的情况。并且在 ObserverWrapper 的 activeStateChanged 方法中当 mActive = true 时会调用 dispatchingValue 方法，即 UI 恢复可见状态时发送最新数据


### LiveData『数据倒灌』的问题

LiveData的设计原则，在页面重建时，LiveData自动推送最后一次数据，而不必重新去向后台请求；LiveData自动推送最后一次数据条件是页面重建，也就是Activity生命周期经过了销毁到重建。

如果生命周期变为非活跃状态，它会在再次变为活跃状态时接收最新的数据。例如，曾经在后台的 Activity 会在返回前台后立即接收最新的数据。


LiveData内部对每次修改数据时都会对当前数据版本号进行++处理.而每次以生命周期绑定方式观察LiveData时,都会创建一个新的缓存观测对象,且该对象自己的版本号默认为-1.当生命周期>=STARTED时,如果LiveData存在旧数据会马上通知被观察者.此为LiveData的默认机制，

在使用 Fragment 时，可能会出现 LiveData 多次订阅的情况，当 LiveData 中有数据时，在重新订阅后就会发送一次数据，然后有时我们一个数据只需要接收一次。只针对这个问题，有用户在 Stack Overflow 实现了一个复写类 SingleLiveEvent，其中的机制是用一个原子 AtomicBoolean 记录一次 setValue。在发送一次后在将 AtomicBoolean 设置为 false，阻止后续前台重新触发时的数据发送。

```
import androidx.annotation.MainThread;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Observer;

import java.util.concurrent.atomic.AtomicBoolean;

public class SingleLiveEvent<T> extends MutableLiveData<T> {
    private final AtomicBoolean mPending = new AtomicBoolean(false);
    @Override
    public void observe(@NonNull LifecycleOwner owner, @NonNull final Observer<? super T> observer) {
        super.observe(owner, new Observer<T>() {
            @Override
            public void onChanged(@Nullable T t) {
                if (mPending.compareAndSet(true, false)) {
                    observer.onChanged(t);
                }
            }
        });
    }

    @MainThread
    public void setValue(@Nullable T t) {
        mPending.set(true);
        super.setValue(t);
    }

    /**
     * Used for cases where T is Void, to make calls cleaner.
     */
    @MainThread
    public void call() {
        setValue(null);
    }
}

```


官方防止数据倒灌 https://github.com/android/architecture-samples/blob/dev-todo-mvvm-live/todoapp/app/src/main/java/com/example/android/architecture/blueprints/todoapp/SingleLiveEvent.java

美团 LivedataBus  https://tech.meituan.com/2018/07/26/android-livedatabus.html




### LiveData 的 observeForever 和 removeObserver 方法要配套使用

在某些情况下，我们需要在页面不可见时也想收到数据，则会使用 observeForever 订阅被观察者对象，这时观察者对象不会自动移除引用，会导致内存泄漏问题，就需要我们在对应的生命周期下调用 removeObserver 方法移除引用。






