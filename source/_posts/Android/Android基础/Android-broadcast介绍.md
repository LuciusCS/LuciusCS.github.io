---
title: "Android Broadcast介绍"
description: "Android Broadcast介绍"
type: [Android]
cover: /cover/img6.jpg
toc: true
categories: Android

date: 2018/08/01
---

# Android Broadcast介绍

modified: 2018-08-01
Android应用可以向系统和其他应用发送或者接收广播信息，手机系统在启动或者电量低的时候会发送不同的广播，也允许手机应用发送广播，来通知用户某些事件。
<!--more-->
手机应用可以注册或者接受特定的广播，当一个广播被发出，系统会自动会自动将广播发送给注册并接收特定广播的手机应用。

广播中的信息被包裹在Intent对象中，Intent中的action会判断出发生的是哪一个事件，如：android.intent.action.AIRPLANE_MODE。在Intent中同时可以携带其他的信息。

### 广播中的一些变化

* 在Android 7.0(API 24)及以上的版本，将不再使用系统广播中的 ACTION_NEW_PICTURE和ACTION_NEW_VIDEO
* 在Android 7.0(API 24)及以上的版本，监听CONNECTIVITY_ACTION广播时，需要使用registerReceiver(BroadcastReceiver, IntentFilter)方法，只在manifest文件中声明receiver将失效
* 从Android 8.0(API 26)开始，对于大部分隐式广播（广播的对象不是针对你开发的APP），不能在menifest中声明receiver，如果需要使用隐式广播，需要使用context-registered reciever 的方法。

## 接收广播

手机应用可以通过两种方式接收广播：通过在menifest文件中声明receiver；使用context-registered的方式。**在Android 8.0(API 26)之后建议使用第二种方式**

### 在menifest文件中声明receiver

通过在menifest文件中声明receiver的方式，但广播被发送的时候，系统会唤醒手机应用。

#### 1、menifest文件配置

```xml
<receiver
       android:name=".receiver.BroadcastReceiverTest"
       android:exported="true">
       <intent-filter>
            <action android:name="android.intent.action.BOOT_COMPLETED"/>
             <action android:name="android.intent.action.ACTION_POWER_CONNECTED"/>
        </intent-filter>
</receiver>

```
### 2、继承BroadcastReceiver类

当用户手机充电时，将会弹出充电的提示。

```java

public class BroadcastReceiverTest extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Toast.makeText(context,intent.getAction().toString(),Toast.LENGTH_LONG).show();
    }
}
```
## 通过Context-register的方式注册Receiver
###1、创建一个BroadcastReceiverTest实例
```
BroadcastReceiverTest br=new BroadcastReceiverTest()
```

###2、创建IntentFilter,通过调用registerReceiver(BroadcastReceiver, IntentFilter)方法注册广播

```java
//用于监控网络的状态变化
IntentFilter intentFilter=new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION);
intentFilter.addAction(Intent.ACTION_AIRPLANE_MODE_CHANGED);
this.registerReceiver(br,intentFilter);
```

* 注：通过Context-register的方式注册广播，只要注册位置的Context没有被注销，那么它就可以收到广播。如果在Application的位置注册广播，那么只要App在运行，就可以收到广播信息。

###3、停止接收广播

停止接收广播需要调用 unregisterReceiver(android.content.BroadcastReceiver)，在此之前需要保证此广播不再被使用。

**一定要记得unregister receiver**，防止造成内存泄漏，如果在onCreate(Bundle)中注册receiver则需要在onDestroy()中unregister；如果在onResume()进行注册，则需要在onPause()中unregister(***防止广播被重复多次注册***)。但不能在onSaveInstanceState(Bundle)中进行unregister，因为当用户回到历史栈中时，这一个方法将不会被调用。

## Broadcast对进程的影响

BroadcastReceiver无论是否是运行状态，都会影响到它所在的进程的状态。例如，当一个进程在正在执行receiver(当前运行onReceive()方法中的代码)，会被认为是一个前台进程，只有当内存极其缺乏的时候，该进程才会去杀死。

当执行代码一旦从onReceive()方法中返回后，BroadcastReceiver就不再处于活跃状态，它所在的进程与应用的其他组件有着相同的优先级。如果进程中只有一个在menifest中声明的receiver，执行完onReceiver()方法返回后，系统将会将将该进程设置为低优先级，有时会被杀死。

因此在broadcast的receiver中不能启动长时间运行的后台进程，在执行完onReceiver()方法之后，系统在任何时间都可以杀死进程。为了避免进程被杀死，可以调用goAsync()方法(当需要在后台执行一些耗时操作)，或者使用JobService，通过receiver使用JobScheduler，这样系统就会知道进程正在执行任务。

```java
public class BroadcastReceiverTest extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Toast.makeText(context,intent.getAction().toString(),Toast.LENGTH_LONG).show();
        final PendingResult pendingResult=goAsync();

        AsyncTask<String,Integer,String>asyncTask=new AsyncTask<String, Integer, String>() {
            @Override
            protected String doInBackground(String... strings) {
                Log.i("+++++++++","++++");
                pendingResult.finish();
                return "测试";
            }
        };

        asyncTask.execute();

    }
}

```

## 发送广播

### Android提供三种方式发送广播

* 通过 sendOrderedBroadcast(Intent, String) 的方式一次向一个receiver发送一个广播,接收到广播的receiver,可以将运行结果传递到下一个receiver或者直接将广播丢弃。
* 通过 sendBroadcast(Intent) 的方式向所有的receiver发送广播，具有更高的效率，但是其他广播不能获取某些广播的执行的结果，也不能发散广播或者将广播取消。
* 通过 LocalBroadcastManager.sendBroadcast 的方式发送广播，这种方式只能讲广播发送给本App，这种实现方式会更高效，而且不用担心其他App接收到广播引起的安全问题。

**发送广播的例子**

```java
Intent intent = new Intent();
intent.setAction("com.example.broadcast.MY_NOTIFICATION");
intent.putExtra("data","Notice me senpai!");
sendBroadcast(intent);
```

广播发送的内容被包裹在Intent对象中，intent的action字符串需要唯一确定广播事件，可以在intent中通过putExtra(String, Bundle) 方法携带更多的信息。也可以限制广播发送到组织中的一系列应用，通过intent调用setPackage(String)方法。

* 注：尽管intent被用作发送广播以及启动Activity，但这些活动都是不想关的。Broadcast不能看到或者捕获用于启动activity的intent。

## 通过permissions限制广播的发送

广播可以发送到具有某一权限的一些列的应用中，不仅可以在sender中设置限制，也可以在receiver中进行权限设置。

### 带有权限的广播发送

当调用sendBroadcast(Intent, String) 或者 sendOrderedBroadcast(Intent, String, BroadcastReceiver, Handler, int, String, Bundle)方法时可以指定一个权限参数，只有已经在manifest文件中声明了权限的App才会接收到这一个广播。
例如：
```
sendBroadcast(new Intent("com.example.NOTIFY"), Manifest.permission.SEND_SMS);
```

这一条广播的接收者，只能是已经在manifest文件中申请了权限的App

```
<uses-permission android:name="android.permission.SEND_SMS"/>

```

### 带有权限的广播接收
无论是使用registerReceiver(BroadcastReceiver, IntentFilter, String, Handler) 还是在manifest中使用标签 <receiver>来注册广播，当对receiver进行权限限制时，只能接收到已经获取到已经取得权限的App的广播。**发送广播的App一定要取得相应的权限**

例如：在manifest文件中添加权限限制。

```xml
<receiver android:name=".MyBroadcastReceiver"
          android:permission="android.permission.SEND_SMS">
    <intent-filter>
        <action android:name="android.intent.action.AIRPLANE_MODE"/>
    </intent-filter>
</receiver>

``` 

使用context-register方式注册广播权限限制

```java
IntentFilter filter = new IntentFilter(Intent.ACTION_AIRPLANE_MODE_CHANGED);
registerReceiver(receiver, filter, Manifest.permission.SEND_SMS, null );
```



