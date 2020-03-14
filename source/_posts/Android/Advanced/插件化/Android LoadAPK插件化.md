

## Android采用LoadAPK式的框架


### Android 7.0 启动流程

startActivity ———》 Activity ———》 mInstrumentation.execStartActivity() ————》 ActivityManagerNative.getDefault().startActivity() ——》 AMS.startActivity(检测，当前要启动的Activity是都注册) —— 》 ActivityThread(即将加载启动Activity) —— 》 将ProxyActivity换回 TestActivity

如果开发插件化，需要在AMS.startActivity() 之前添加Hook，换成ProxyAcivity(已经在Manifest中进行注册)

ActivityManagerNative.getDefault() 方法源码
`gDefault.get()`获取的是IActivityManager的单例

```java
    static public IActivityManager getDefault() {
        return gDefault.get();
    }


    private static final Singleton<IActivityManager> gDefault = new Singleton<IActivityManager>() {
        protected IActivityManager create() {
            IBinder b = ServiceManager.getService("activity");
            if (false) {
                Log.v("ActivityManager", "default service binder = " + b);
            }
            IActivityManager am = asInterface(b);
            if (false) {
                Log.v("ActivityManager", "default service = " + am);
            }
            return am;
        }
    };

```

采用动态代理的方式在startActivity()方法之前，执行自定义的方法(把未注册的Activity替换成已经注册的Activity)


2、AMS检查过后，需要将未注册的Activity换回去

在ActivityThread中启动Activity，需要对 `case LAUNCH_ACTIVITY` 后面的代码进行Hook


```java
  private class H extends Handler {
     public void handleMessage(Message msg) {
            switch (msg.what) {
                case LAUNCH_ACTIVITY: {
                    Trace.traceBegin(Trace.TRACE_TAG_ACTIVITY_MANAGER, "activityStart");
                    final ActivityClientRecord r = (ActivityClientRecord) msg.obj;

                    r.packageInfo = getPackageInfoNoCheck(
                            r.activityInfo.applicationInfo, r.compatInfo);
                    handleLaunchActivity(r, null, "LAUNCH_ACTIVITY");
                    Trace.traceEnd(Trace.TRACE_TAG_ACTIVITY_MANAGER);
                } break;

            }
     }
  }
```
