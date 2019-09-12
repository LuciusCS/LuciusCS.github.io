## 在Android 6.0及以上需要对手机权限进行动态获取

如果手机版本为Android 6.0(API 23)或更高版本，以及app的`targetSdkVersion`为23或者更高，用户在安装的时候未被提示权限获取，则用户在使用应用的时候需要动态获取权限。如果在获取用户权限时，用户选择“不再提醒”，则app再次获取权限时，系统将不再对用户进行提示。


### 对于可选硬件功能权限的获取

使用蓝牙以及相机等硬件权限时，手机上可以没有蓝牙或者相机设备，因此在获取相机设备权限时，需要添加`<uses-feature> `
```html
<uses-feature android:name="android.hardware.camera" android:required="false" />
```