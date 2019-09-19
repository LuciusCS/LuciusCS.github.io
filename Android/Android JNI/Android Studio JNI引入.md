

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

在Andorid的Module下，右键选择 **Link C++ Project with Gradle**，选择新建的CMakeLists.txt文件的路径；构建完成后，在moudle的build.gradle会增加如下代码

```xml
    android {
      …
      externalNativeBuild {
        cmake {
            path file('src/main/cpp/CMakeLists.txt')
        }
    }
```

在native-lib.cpp添加如下代码，方法名命名规则`Java_demo_lucius_baselib_MainActivity_stringFromJNI`，以`Java`作为开头,`demo_lucius_baselib_MainActivity`是“包名+调用类名”，`stringFromJNI`方法名。



```c++
    #include <jni.h>
    #include <string>
    extern "C" JNIEXPORT jstring JNICALL
    Java_demo_lucius_baselib_MainActivity_stringFromJNI(
        JNIEnv *env,
        jobject /* this */) {
        std::string text = "String from C++";
        return env->NewStringUTF(hello.c_str());
    }

```

在MainActivity中添加C++代码的调用

```java
public class MainActivity extends AppCompatActivity {

    static {
        System.loadLibrary("native-lib");
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        System.out.println(stringFromJNI());
        }

    public native String stringFromJNI();


```


