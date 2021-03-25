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
`observeForever()`与`removeOberver()`方法需要成对进行使用，通过`observeForever()`方法添加观察者，该方法只能在主线程中调用;

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

LiveData的Observer在Fragment中的应该，只注册一次









