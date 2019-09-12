## 在Android 6.0及以上需要对手机权限进行动态获取

如果手机版本为Android 6.0(API 23)或更高版本，以及app的`targetSdkVersion`为23或者更高，用户在安装的时候未被提示权限获取，则用户在使用应用的时候需要动态获取权限。如果在获取用户权限时，用户选择“不再提醒”，则app再次获取权限时，系统将不再对用户进行提示。

**同一组权限不用重复授权，即：同一组的权限只要有一个授权了，那么同一组的其他权限也就授权了，前提是在Manifest.xml中有声明。** *同一组权限在使用某一个权限申请，而该权限未在Manifest.xml声明，则该权限组不能申请成功，不显示权限申请对话框，但会回调；同时非危险权限如`Manifest.permission.BLUETOOTH`在动态申请时同样不会出现权限申请对话框，但会回调*

Android动态权限的申请仅对下图中的9大权限组进行申请
![](/assets/android_basis_permission.png)

### 一、对于可选硬件功能权限的获取

使用蓝牙以及相机等硬件权限时，手机上可以没有蓝牙或者相机设备，因此在获取相机设备权限时，需要添加`<uses-feature> `
```html
<uses-feature android:name="android.hardware.camera" android:required="false" />
```
当声明为`android:required="false"`时，用户即使没有该设备也可以进行安装，在进行权限申请时则需要`PackageManager.hasSystemFeature()`来确定该设备是否存在；当声明为`android:required="true"`时，需要手机上具有该设备，否则不能进行安装操作。

### 二、连续多次申请权限出现问题
在进行连续多次申请时，在回调函数`onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,@NonNull int[] grantResults)`的`permissions`数组会返回长度为零的数组，因为在Activity的`requestPermissions()`方法源码中，mHasCurrentPermissionsRequest标记当前是否有正在请求的权限，方法是异步执行的，如果你在申请权限的时候连续多次执行此方法，会直接执行`onRequestPermissionsResult`方法，返回的permissions和grantResults都是长度为0的空数组。在返回结果处理时需要对数组长度进行判断；

```java

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
