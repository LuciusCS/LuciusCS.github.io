---
title: Android 6.0及以上手机权限进行动态获取
cover: /cover/img8.jpg
toc: true
categories: Android
type: [Android]
date: 2019/09/19
---


## 在Android 6.0及以上需要对手机权限进行动态获取

如果手机版本为Android 6.0(API 23)或更高版本，以及app的`targetSdkVersion`为23或者更高，用户在安装的时候未被提示权限获取，则用户在使用应用的时候需要动态获取权限。如果在获取用户权限时，用户选择“不再提醒”，则app再次获取权限时，系统将不再对用户进行提示。

<!--more-->

**同一组权限不用重复授权，即：同一组的权限只要有一个授权了，那么同一组的其他权限也就授权了，前提是在Manifest.xml中有声明。** *同一组权限在使用某一个权限申请，而该权限未在Manifest.xml声明，则该权限组不能申请成功，不显示权限申请对话框，但会回调；同时非危险权限如`Manifest.permission.BLUETOOTH`在动态申请时同样不会出现权限申请对话框，但会回调*
< !--more-->
Android动态权限的申请仅对下图中的9大权限组进行申请
![](/public/img/Android/android_basis_permission.png)

### 一、对于可选硬件功能权限的获取

使用蓝牙以及相机等硬件权限时，手机上可以没有蓝牙或者相机设备，因此在获取相机设备权限时，需要添加`<uses-feature> `
```html
<uses-feature android:name="android.hardware.camera" android:required="false" />
```
当声明为`android:required="false"`时，用户即使没有该设备也可以进行安装，在进行权限申请时则需要`PackageManager.hasSystemFeature()`来确定该设备是否存在；当声明为`android:required="true"`时，需要手机上具有该设备，否则不能进行安装操作。

### 二、代码实现

```java

    String[] permissions = {Manifest.permission.BLUETOOTH};

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //只有系统API大于23时，才需要判断权限是否需要获取
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            //用于判断权限是否已经获取
            int i = ContextCompat.checkSelfPermission(this, permissions[0]);
            //权限是否已经获取 GRANTED--授权 DINED--拒绝
            if (i != PackageManager.PERMISSION_GRANTED) {
                //如果没有被授予该权限，提示用户请求该权限
                ActivityCompat.requestPermissions(this, permissions, 1);
            }else {
                Toast.makeText(this,"权限已获取",Toast.LENGTH_LONG).show();
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode==1){
            //未获取到权限
            if (grantResults[0] != PackageManager.PERMISSION_GRANTED) {
                //判断用户是否点击了不再提醒；检测该权限是否还可以再申请
                boolean result = this.shouldShowRequestPermissionRationale(permissions[0]);
                //如果不可以再申请
                if (!result) {
                    //用户需要继续使用App
                    //提示用户去应用设置界面手动开启权限，各大厂商权限开启的方法各不相同，需要进行不同厂商适配，因此只给予提示
                    LogUtils.printInfo("请到设置界面开启相应权限");
                }else {
                    //如果可以再申请
                    Toast.makeText(this,"请开启权限权限",Toast.LENGTH_LONG).show();
                }
            }
        }
    }
```

### 三、连续多次申请权限出现问题
在进行连续多次申请时，在回调函数`onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,@NonNull int[] grantResults)`的`permissions`数组会返回长度为零的数组，因为在Activity的`requestPermissions()`方法源码中，mHasCurrentPermissionsRequest标记当前是否有正在请求的权限，方法是异步执行的，如果你在申请权限的时候连续多次执行此方法，会直接执行`onRequestPermissionsResult`方法，返回的permissions和grantResults都是长度为0的空数组。在返回结果处理时需要对数组长度进行判断；

```java
    //Activity源码
    public final void requestPermissions(@NonNull String[] permissions, int requestCode) {
        //省略部分代码
        if (mHasCurrentPermissionsRequest) {
            Log.w(TAG, "Can request only one set of permissions at a time");
            // Dispatch the callback with empty arrays which means a cancellation.
            onRequestPermissionsResult(requestCode, new String[0], new int[0]);
            return;
        }
        Intent intent = getPackageManager().buildRequestPermissionsIntent(permissions);
        startActivityForResult(REQUEST_PERMISSIONS_WHO_PREFIX, intent, requestCode, null);
        mHasCurrentPermissionsRequest = true;
    }
```


### 四、其他

有些apk需要系统权限，比如实现关机指令，需要在AndroidMainfest.xml进行声明；用到系统权限的apk，签名必须使用系统签名，否则安装不上。
```xml

```








