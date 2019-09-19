

## Android 在已有的项目中引入JNI 最简方式
            
### 下载NDK和编译工具
* NDK:一个工具集，能够在 Android 应用中使用 C 和 C++ 代码；它提供各种平台库，可以管理原生 Activity 并访问实际设备组件，例如传感器和轻触输入。
* CMake：一款外部编译工具，可与 Gradle 搭配使用来编译原生库。
* LLDB：Android Studio 用于调试原生代码的调试程序。 

安装方式：

Android Studio Tools—>SDK manager—>SDK Tools 选择LLDB、CMake、NDK点击Apply进行下载

![](/assets/Android JNI.png)

在cpp文件夹下新建CMakeLists.txt和native-lib.cpp文件
![](/assets/Android JNI1.png)


现在CMakeLists.txt中添加如下代码，native-lib-cpp可以先不添加
```xml
cmake_minimum_required(VERSION 3.4.1)


add_library( 
        //设置调用lib的名称
        native-lib
        //将lib设置为SHARED模式
        SHARED
        //依赖的文件
        native-lib.cpp)


```


