# Android 蓝牙4.0开发

这是一条优雅的分割线

### 写在前面：

本篇教程使用的蓝牙版本为4.0，测试系统版本为Android 7.0

尽管蓝牙已经推出5.0版本了，不过目前手机上大部分适配的还是4.0 4.2，但蓝牙的教程以及Demo还是较少，尤其是可以运行的Demo,现有的Demo中以及教程中没有注明可以使用的版本以及运行的环境。


### 首先对蓝牙进行非专业的介绍，

蓝牙4.0又被称为低功耗蓝牙，即BLE，是基于GATT协议实现，而蓝牙4.0以下是传统蓝牙，基于socket的方式实现。所以蓝牙4.0以上没有使用官方文档介绍的 BluetoothSocket，敲重点！！！！

### 对GATT的介绍





按照惯例先上代码

优雅的代码

##3 权限的获取

蓝牙4.0有一个坑爹的权限是位置信息的获取


### 蓝牙搜索
蓝牙的搜索有三种方式
* 方法一：`BluetoothAdapter.startDiscovery()`是通用的扫描方法，扫描时间持续10秒后会自动停止；当扫描到蓝牙设备后，会发出广播通知；
蓝牙扫描广播接收器

```java

//注册此广播，监听BluetoothDevice.ACTION_FOUND，以接收系统消息取得扫描结果
private class DeviceReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if(BluetoothDevice.ACTION_FOUND.equals(action)){
            BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);  
        }
    }
}
```

* 方法二：`BluetoothAdapter.startScan(ScanCallback callback)`
* 方法三：`BluetoothAdapter.startLeScan(BluetoothAdapter.LeScanCallback callback)`
  该方法已经被舍弃









