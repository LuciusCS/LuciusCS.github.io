

### 获取定位权限
定位权限的获取在Android 10 上是一个大坑



#### 分两步对定位权限进行获取

* 第一步获取`ACCESS_COARSE_LOCATION` 和 `ACCESS_FINE_LOCATION`，在获取时选择**仅运行时使用**

```
    <!--用于进行网络定位-->
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"></uses-permission>
    <!--用于访问GPS定位-->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"></uses-permission>

```

*  第二步需要获取`ACCESS_BACKGROUND_LOCATION`权限，在获取时选择**始终允许**

```xml
  <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION"></uses-permission>
```

<big>获取权限的过程中不能改变顺序，否则在高德地图以及百度地图都会显示未获取权限<big>


### 启动前台服务需要注意

* 添加`FOREGROUND_SERVICE`权限 
```xml
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
```

百度地图定位成功，经纬度显示 0.0 将` option.setOpenGps(true);`修改为` option.setOpenGps(false);`

百度地图定位显示 `Code: NetWork location failed because baidu location service can not decrypt the request query, please check the so file !`

上面两个问题都是因为删掉了百度地图定位的一部分 so 文件


### 在Android 10中如果缺少 `ACCESS_FINE_LOCATION`

使用高德地图定位会报错：
```xml
缺少定位权限 请到http://lbs.amap.com/api/android-location-sdk/guide/utilities/errorcode/查看错误码说明,错误详细信息:定位权限被禁用,请授予应用定位权限#1201
```

使用百度地图定位会报错：

```xml
Longitude:4.9E-324   latitude4.9E-324
Code: 62
Code: Location failed beacuse we can not get any loc information!

```