---

title: "Android生命周期感知组件"
description: "Android生命周期感知组件介绍"
tags: [Android]
thumbnail: /thumbnail/img7.jpg
toc: true
categories: Android

---

modified: 2018-08-09
# Android生命周期感知组件介绍(Android lifecycle-aware components)

## lifecycle-aware组件介绍
<!--more-->
* **ViewModel：**为绑定在特定生命周期的对象提供创建以及恢复的方法，`ViewModel`通常保存`View`的数据或者用于与其他组件进行通信，例如data repository
* **LifecycleOwner/LifecycleRegisterOwner：**`LifecycleOwner`以及`LifecycleRegisterOwner`都是需要在`AppCompatActivity`或者`Support Fragment`类中实现的接口。可以订阅实现这些接口的其他组件的对象，来观察这些对象的生命周期。
* **LiveData:**通过`LiveData`可以通过多个组件来观察到数据的变化。`LiveData`不会影响应用中的组件如：Activity、Service、Fragment或者其他`LifecycleOwner`的生命周期。`LiveData`可以对观察者订阅的内容进行管理，主要的方式有：停止或者取消订阅。

## 布局文件中添加计时器

```xml
    <Chronometer
        android:id="@+id/chronometer"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

```

```java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Chronometer chronometer=(Chronometer)findViewById(R.id.chronometer);
        chronometer.start();
    }
}


```

**当旋转屏幕时，由于Activity重建，使得计时器被重置**

## 添加ViewMedel

添加`ViewModel`来保持Activity或者Fragment整个生命周期中的数据.Activity以及Fragment是short-lived类型的对象，它们在用户操作App的过程中会被频繁地创建以及销毁。使用`ViewModel`也可以很好地处理与网络请求相关的数据，以及数据的操作和持久化。

### 使用ViewModel来留存计时器（`Chronometer`）的状态

ChronometerViewModel中的代码

```java
public class ChronometerViewModel extends ViewModel {
    
    private MutableLiveData<Long>mElapsedTime=new MutableLiveData<>();

    private long mInitialTime;

    public ChronometerViewModel(){
        mInitialTime= SystemClock.elapsedRealtime();

        Timer timer=new Timer();

        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                 final long newValue=(SystemClock.elapsedRealtime()-mInitialTime)/1000;
                 mElapsedTime.postValue(newValue);
            }
        },1000,1000);
    }

    public LiveData<Long>getElapsedTime(){

        return mElapsedTime;
    }
}


```

在MainActivity中添加代码
```java
     chronometerViewModel= ViewModelProviders.of(this).get(ChronometerViewModel.class);

```

`this`指代的是`LifecycleOwner`的一个实例，`ViewModel`与`LifecycleOwner`保活时间一样长，当`ViewModel`的所有者的配置信息（如：屏幕旋转）发生变化时，`ViewModel`不会被销毁，当其所有者重新被实例化时，会与已经存在的`ViewModel`重新建立联系。其生命周期如图所示：

![](public/img/Android/view_model.png)


## 将Activity中使用的数据使用LiveData进行封装

将计时控件`chronometer`使用`Timer`来设置，每隔一秒钟更新一次UI，将相应的代码放在`ChronometerViewModel`中，而让Activity只保持用户与UI之间的交流操作。


MainActivity中的完整代码
```java

public class MainActivity extends AppCompatActivity {

    private ChronometerViewModel chronometerViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
         chronometerViewModel= ViewModelProviders.of(this).get(ChronometerViewModel.class);
         subscribe();

    }
    
    private void subscribe(){
        final Observer<Long>elapseTimeObserver=new Observer<Long>() {
            @Override
            public void onChanged(@Nullable Long aLong) {

                ((TextView)findViewById(R.id.chronometer_text)).setText(aLong+"秒");
            }
        };
        chronometerViewModel.getElapsedTime().observe(this,elapseTimeObserver);
    }
}


```

当`timer`每隔一秒***通知***`MainActivity`时，`MainActivity`将会更新一下UI，为避免内存泄漏，`ViewModel`中没有指向Activity的引用。

`ViewModel`并不直接改变View，在使用`ViewModel`中需要配置Activity以及Fragment去观察数据源的变化，当观察到数据源发生变换时UI发生相应的改变，这被称为观察者模式。

**注：为了将数据暴露给观察者，需要使用`LiveData`对数据进行封装**

`LiveData`是一个特殊的可观察类，是lifecycle-aware类型的，只会通知处于活跃状态的观察者。

**运行结果：**

![](public/img/Android/view_model1.png)
![](public/img/Android/view_model2.png)


在旋转屏幕后计时器继续未重置。






