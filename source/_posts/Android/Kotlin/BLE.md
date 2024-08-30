


https://github.com/tdcolvin/BLEServer/blob/master/app/src/main/java/com/tdcolvin/bleserver/BluetoothCTFServer.kt

https://github.com/tdcolvin/BLEClient



https://proandroiddev.com/android-bluetooth-and-ble-the-modern-way-a-complete-guide-4e95138998a0

https://developer.android.com/develop/connectivity/bluetooth/ble/background



Android BLE permissions are crazy complex
Permissions for Bluetooth are a bit unnecessarily complicated. They have been much improved since Android 12, but usually we need to support API levels earlier than that, so we also have to handle the complexity of what went before.
In the old days — Android 11 (API 30) and before — you needed BLUETOOTH and BLUETOOTH_ADMIN permissions. Broadly speaking, BLUETOOTH was for connecting to devices and BLUETOOTH_ADMIN was to scan for them, though in practice the differentiation wasn’t quite as neat as that.
But scanning for Bluetooth beacons can end up revealing location information. So Google (rightly, but somewhat confusingly) said: in order to scan for BLE devices the user also needs to give you location permission. Specifically ACCESS_COURSE_LOCATION. You might have seen this in apps that connect to headphones etc. Since Android 10, the requirement has been strengthened to requiring ACCESS_FINE_LOCATION.
Android 12 and above dramatically simplifies this. To connect, use BLUETOOTH_CONNECT and to scan use BLUETOOTH_SCAN. And — hurrah! — we no longer need to ask for location permissions if we don’t need location information. We can specify android:usesPermissionFlags="neverForLocation" , and the OS will just chop out any location information from the scans.
In total, then, here are the manifest permissions needed:





```
<uses-permission android:name="android.permission.BLUETOOTH"
    android:maxSdkVersion="30" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN"
    android:maxSdkVersion="30" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"
    android:maxSdkVersion="30" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"
    android:maxSdkVersion="30" />

<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN"
    android:usesPermissionFlags="neverForLocation"
    tools:targetApi="s" />

```


This handles all cases from Android 4.4 onwards (which is when BLE was added).
And then to request the permissions we use this (Jetpack Compose):


```

val ALL_BLE_PERMISSIONS = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
    arrayOf(
        Manifest.permission.BLUETOOTH_CONNECT,
        Manifest.permission.BLUETOOTH_SCAN
    )
}
else {
    arrayOf(
        Manifest.permission.BLUETOOTH_ADMIN,
        Manifest.permission.BLUETOOTH,
        Manifest.permission.ACCESS_FINE_LOCATION
    )
}

@Composable
fun GrantPermissionsButton(onPermissionGranted: () -> Unit) {
    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { granted ->
        if (granted.values.all { it }) {
            // User has granted all permissions
            onPermissionGranted()
        }
        else {
            // TODO: handle potential rejection in the usual way
        }
    }
    
    // User presses this button to request permissions
    Button(onClick = { launcher.launch(ALL_BLE_PERMISSIONS) }) {
        Text("Grant Permission")
    }
}

```

```
fun haveAllPermissions(context: Context) =
    ALL_BLE_PERMISSIONS
        .all { context.checkSelfPermission(it) == PackageManager.PERMISSION_GRANTED }
view raw

```


Read, write, notify and indicate
A characteristic’s descriptor will tell you whether it can be read or written. If readable, it will also tell you how it can be read. There are three possibilities:
A normal read: Ask for, and receive, the data
A notify: Ask the device to keep you updated on the value of the characteristic. It will send you the new value whenever there’s a change. You don’t have to do anything.
An indicate: As for notify, but you have to acknowledge receipt of every update. This makes indicate more reliable but slower and less battery-efficient.
Devices often support multiple types of read to suit the client.





1. 属性（Properties）
BluetoothGattCharacteristic 提供了一些常量来标识这些属性，可以通过 getProperties() 方法来获取特征支持的属性。

READ: PROPERTY_READ (0x02)
表示特征支持读取操作。这意味着主设备（如手机）可以从这个特征读取数据。
WRITE: PROPERTY_WRITE (0x08)
表示特征支持写入操作。这意味着主设备可以向这个特征写入数据。
WRITE WITHOUT RESPONSE: PROPERTY_WRITE_NO_RESPONSE (0x04)
表示特征支持无响应的写入操作。这种方式写入后不会收到确认消息，适合对时延敏感的应用。
NOTIFY: PROPERTY_NOTIFY (0x10)
表示特征支持通知。这意味着设备会主动将数据推送到主设备，而无需主设备主动读取。这通常用于状态更新。
INDICATE: PROPERTY_INDICATE (0x20)
表示特征支持指示，与通知类似，但具有确认机制。主设备会在收到数据后确认接收，确保数据可靠传输。



READ: 主设备主动读取数据。
WRITE: 主设备主动写入数据。
NOTIFY: 设备主动推送数据，主设备被动接收，无确认。
INDICATE: 设备主动推送数据，主设备被动接收，并且需要确认。



1. 获取写入缓冲区的最大长度
在 Android 8.0 (API level 26) 及以上的版本中，Android 提供了 BluetoothGatt#requestMtu(int mtu) 方法来请求修改 MTU（Maximum Transmission Unit），并使用 BluetoothGattCallback#onMtuChanged() 回调接收结果。MTU 的大小会影响你可以写入特征的最大数据长度。

2. 获取特征支持的写入长度
即使你请求了一个更大的 MTU，特征仍然可能有自己定义的写入数据长度限制。通常，特征支持的写入长度由蓝牙设备的设计决定，可以在设备的规范文档中找到。

3. MTU 和有效负载（Payload）
MTU: 蓝牙 LE 默认的 MTU 是 23 字节，其中 3 字节用于 ATT 操作（如操作码），因此实际有效负载是 20 字节。
MTU 请求: 你可以通过 requestMtu(int mtu) 来请求更大的 MTU。例如，调用 requestMtu(517) 可以请求最大 512 字节的有效负载。
4. 通过 requestMtu 请求更大的 MTU
kotlin
Copy code
bluetoothGatt.requestMtu(517) // 请求更大的 MTU，最大 517 字节
在请求 MTU 后，可以在 BluetoothGattCallback#onMtuChanged() 中获取最终协商的 MTU：

kotlin
Copy code
override fun onMtuChanged(gatt: BluetoothGatt, mtu: Int, status: Int) {
    if (status == BluetoothGatt.GATT_SUCCESS) {
        Log.d("BLE", "MTU size: $mtu")
    } else {
        Log.d("BLE", "MTU request failed")
    }
}





ChatGPT
bluetoothGatt.requestMtu(517) 是用于请求 手机与连接的蓝牙设备之间 的最大 MTU（Maximum Transmission Unit）大小。
这个方法并不是只请求 Android 手机的最大写入长度，而是请求设备端（手机和连接的蓝牙设备）之间通信时的最大数据包大小。

具体流程：
MTU 请求：当你调用 bluetoothGatt.requestMtu(517) 时，你是在请求手机和蓝牙设备之间协商一个更大的 MTU。这个请求会发送到连接的蓝牙设备。
设备响应：连接的蓝牙设备会根据自己的能力回应这个请求。设备可能会同意你请求的 MTU（例如 517 字节），也可能会提供一个较小的 MTU（例如 247 字节），这取决于设备的硬件和协议支持。
最终 MTU 确定：最终协商的 MTU 会在 BluetoothGattCallback#onMtuChanged() 回调中返回。这个 MTU 是手机和蓝牙设备之间可以通信的最大数据包大小。


以下是根据特征属性和需求选择写入类型的示例：

kotlin
Copy code
fun writeToCharacteristic(gatt: BluetoothGatt, characteristic: BluetoothGattCharacteristic, data: ByteArray) {
    val properties = characteristic.properties

    if ((properties and BluetoothGattCharacteristic.PROPERTY_WRITE) != 0) {
        characteristic.writeType = BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT
    } else if ((properties and BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE) != 0) {
        characteristic.writeType = BluetoothGattCharacteristic.WRITE_TYPE_NO_RESPONSE
    } else {
        Log.e("BLE", "Characteristic does not support writing.")
        return
    }

    characteristic.value = data
    val result = gatt.writeCharacteristic(characteristic)

    if (!result) {
        Log.e("BLE", "Failed to write characteristic")
    }
}
总结
检查特征属性：通过 PROPERTY_WRITE 和 PROPERTY_WRITE_NO_RESPONSE 属性判断特征支持的写入类型。
选择写入类型：根据特征支持的写入类型和应用需求选择 WRITE_TYPE_NO_RESPONSE 或 WRITE_TYPE_DEFAULT。
考虑可靠性和速度：对于关键数据选择带响应的写入 (WRITE_TYPE_DEFAULT)，对于速度要求高的场景选择无响应的写入 (WRITE_TYPE_NO_RESPONSE)。