---
title: "Android Service介绍"
description: "Android Service介绍"
cover: /cover/img4.jpg
type: [Android]
toc: true
categories: Android
date: 2018/07/31
---


# Android开发Service介绍

Service是应用的一个组件，可以在后台处理耗时操作，但没有用户界面，其他的组件可以启动Service,即使用户切换到其他的应用，Service依旧可以在后台运行。另外，一个组件可以绑定一个Service并与其进行通信（IPC机制）。例如：Service可以控制网络传输、播放音乐、对文件进行I/O操作，都可以在后台进行。
<!--more-->
## 不同类型的Service介绍

### Foreground service

Foreground service进行一些可以被用户看到的一些操作，例如：一个audio app会使用foreground service播放audio track,foreground service需要显示一个Notification,当用户切换到其他的应用时Foreground service依旧在后台运行。(音乐播放器类在后台播放，并在通知栏系显示的Service)

### Background service

Background service进行的操作不会被用户感知，如：如果一个App使用Service对手机的存储空间进行进行压缩，会使用一个Background service。

* 注：当App targets Api大于26时，如果App没有在前台运行，那么background service将会受到限制，应该使用schedule job进行替换。

### Bound

当应用功能组件使用bindService时，这个Service就是Bound类型的。Bound service提供client-server接口使得组件和service可以进行通信，通过IPC机制发出请求，获取结果，Bound service存在运行的时间与绑定的它组件相同，多个组件可以绑定同一个service,当所有的组件解绑service时，service将被销毁。


不管你的service是否启动、被绑定或者既启动也被绑定，所有的应用组件都可以使用Intent来启动，可以再manifest文件中将service设置为private,防止被其他的应用调用。


## Service的使用

创建一个Service,需要创建Service的子类，并在其中重写回调函数。

### 函数的介绍

#### onStartCommend()

其他组件调用startService()方法启动Service时，会调用Service中onStartCommend()方法，当着一个方法执行时，service就启动了并在后台运行。如果自己实现了这一个方法，当任务结束时就需要自己调用stopSelf()或者stopService()方法，如果仅仅是要绑定服务，那么就不需要自己实现这一个方法。

#### onBind()

其他组件调用bindService()来绑定服务时，会调用Service中的OnBind()方法。在实现这一个方法时，需要提供一个接口使得组件可以通过返回的IBinder与之进行通讯。**在使用service时这一个方法都需要实现，如果service没有被绑定到其他组件上，返回值为null**

#### onCreate()

在service进行初始化的时候会调用这一个方法（在Service调用onStartCommand()或者onBinde()之前），如果service已经运行了，那么将不会调用这一个方法。

#### onDestory()

当服务不再使用或者将要销毁时，service需要实现这一个方法去清理资源，如：线程、注册的监听以及接收器等。

### 在menifest中声明一个service

```xml
<manifest ... >
  ...
  <application ... >
      <service android:name=".ExampleService" />
      ...
  </application>
</manifest>

```

* 注：为了保证App是安全的，需要使用显示调用的方法，启动一个service,而不是使用intent filter来启动。可以使用android:exported=false属性来防止外部应用启动此service

## 创建一个Started service

当一个服务被启动后，它与启动它的组件有着不同的生命周期，即使当启动service的组件被销毁了它依然可以在后台运行。因此，servive需要通过调用自身的stopSelf()来停止，或者通过其他组件调用stopService()。

应用组件通过使用startService()启动service，通过Intent来启动特定的service并传递数据，servive可以在onStartCommand()方法中获取到intent中的数据。

例如Actvivity需要将数据传递到线上数据库，这一个activity可以启动service组件，将数据通过Intent传递给startService (Intent service)，这一个service在onStartCommand()方法中获取到Intent中携带的数据，连接到网络并将数据传递到线上数据库，在数据传输完成后将会停止并销毁。

* 注：service与应用运行在相同的进程中，当用户在与Activity进行交互的时候，service需要避免影响到Activity，需要在service中启动一个新的Thread。

### 两个可以继承启动的service类

#### Service类

Service类是所有service的基类，当在继承这一个类的时候，**需要创建一个新的线程，使得service可以再其中完成它的工作** ***（很重要）***，service会默认在应用的主线程中使用，这样会使得应用中的activity变得缓慢。

#### IntentService类

IntentService是Service的一个子类，其调用工作进程来处理在service启动时的请求操作，当不需要service同时处理多个请求时可以使用IntentService。实现onHandlerIntent()方法，接收到请求的intent，在后台完成任务。

### 继承IntentService类

在大多数情况下启动一个service不需要同时处理复杂的工作，所以推荐使用IntentService类

**IntentService类所做的工作**

* 创建一个默认的工作线程处理所有传递到onStartCommand()方法中的intent，从应用主线程中分离。
* 创建一个工作队列，每一次传递一个intent到onHandleIntent方法中，所以无需担心多线程的问题。
* 当所有的请求都被处理后，停止service，不需要调用stopSelf()方法来停止service。
* 提供onBind()的默认实现方法，并返回null。
* 提供onStartCommand()的默认实现方法，并将intent传递到工作队列，然后传递到onHandleIntent()的实现方法中。

为了完成client传递的任务，需要实现onHandleIntent()方法，同时需要为定义的service添加一个构造方法。




## 创建一个Bound Service

Bound Service允许应用组件调用bindService()绑定到service上，它通常不允许使用startService()来创建Service。当需要service与其他应用组件进行信息交换或者将自己的应用的function，通过IPC暴露给其他应用调用时，使用Bound Service。


## 给用户发送notifications

当一个服务在运行时，可以通过Toast Notifications或者Status Bar Notification向用户发通知。Toast Notification就是在Activity中使用的普通Toast,Status Bar可以有一个图标以及信息，用户可以点击启动相应的activity


## 运行foreground service

foreground service可以被用户感知，即使在系统内存偏低的状态下也不会被杀死。foreground service需要在Status Bar中提供一个notification,除非这一个service被杀死，否则这个notification不会消失。

**谨慎使用foreground service 当需要执行一项需要被用户感知的任务时，使用foreground service，它需要在Status Bar中显示一条notification，优先级设置为PRIORITY_LOW或者高一点的优先级。**

让service运行在foreground，需要调用startForeground (int id, Notification notification)，第一个参数是Notification的唯一标识符ID。



```

//代码

```

注意：
1、在启动Service时，需要使用显示Intent，且不能为Service声明Intent过滤器，在API21开始，如果使用隐式Intent调用bindService(), 系统会抛出异常。
2、不应在Activity的onCreate()和onDestory()方法中，绑定启动service,在Activity生命周期改变时，这两个方法会发生回调。

## service的生命周期

通过startService() 启动服务，会调用Service的 `onStartService`方法，

service的生命周期从创建至销毁有两种情况；


### 通过调用startService()创建service

其他组件调用startService()会创建一个service，以这种方式启动的service需要主动停止，否则将会一直存在，service自身可以调用stopSelf()，其他组件可以调用stopService()方式来实现，当service停止后，系统将会销毁这一个service

### 通过调用bindService()创建service

其他组件调用bindService()方法创建一个service,启动service的客户端（组件）通过IBinder接口与service进行信息的交互，客户端可以通过调用unbindService()方法来取消与service之间的联系。多个客户端通过调用bindService()绑定同一个service,只有所有的客户端调用unBindService()方法后，service才会被系统销毁，而不能通过调用stopSelf()或者stopService()方法。

如果组件通过调用bindServer来创建服务，且未调用onStartCommand，则服务只会在该组件与其绑定时运行，当该服务与其所有组件取消绑定后，系统会将其销毁。



![](/source/img/201807/service_lifecycle.png)



## 绑定服务

在对服务进行绑定时，需要实现`onBind()`方法，该方法返回 `IBinder`对象。





## 不同版本启动Service

### Android 8.0 之前版本启动Service


