

## Android 在已有的项目中引入JNI 最简方式

### JNI与NDK

JNI：JNI是一套编程接口，用来实现Java代码与本地的C/C++代码进行交互；
NDK: NDK是Google开发的一套开发和编译工具集，可以生成动态链接库，主要用于Android的JNI开发；

            
### 下载NDK和编译工具
* NDK:一个工具集，能够在 Android 应用中使用 C 和 C++ 代码；它提供各种平台库，可以管理原生 Activity 并访问实际设备组件，例如传感器和轻触输入。
* CMake：一款外部编译工具，可与 Gradle 搭配使用来编译原生库。
* LLDB：Android Studio 用于调试原生代码的调试程序。 

安装方式：

Android Studio Tools—>SDK manager—>SDK Tools 选择LLDB、CMake、NDK点击Apply进行下载

![](/assets/Android JNI.png)

在cpp文件夹下新建CMakeLists.txt和native-lib.cpp文件，CMakeLists.txt可以建在工程的任意位置
![](/assets/Android JNI1.png)



### 添加CMakeLists.txt和native-lib-cpp文件

现在CMakeLists.txt中添加如下代码，native-lib-cpp可以先不添加代码
```xml

     # 设置cmake的最低版本
     cmake_minimum_required(VERSION 3.4.1)

    # 设置生成的so库的信息
    add_library( 
        #生成的so库的名字
        native-lib
        # 生成的so库的类型，类型分为两种：
        #  STATIC：静态库，为目标文件的归档文件
        #  SHARED：动态库，会被动态链接，在运行时被加载
        SHARED
        # 设置源文件的位置，可以是很多个源文件，都需要添加进去
        native-lib.cpp)
    # 从系统里查找依赖库，可添加多个
    find_library(
        log-lib
        # liblog.so库指定的名称为 log，libjnitest.so的名称为jnitest
        log)
     # 配置目标库的链接，即相互依赖关系
  target_link_libraries(
        # 目标库（最终生成的库）
        native-lib
        # 需要依赖的log库，一般情况下，如果依赖的是系统中的库，需要加${}进行引用
        # 如果是第三方库，可以直接引用
        # 每行引用一个库
        ${log-lib})


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

在native-lib.cpp添加如下代码，方法名命名规则`Java_demo_lucius_baselib_MainActivity_stringFromJNI`，以`Java`作为开头,`demo_lucius_baselib_MainActivity`是“包名+调用类名”，`stringFromJNI`方法名。即` Java_{package_and_classname}_{function_name}(JNI_arguments)`，包名的`.`被下划线替代。

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
在上述函数`JNI_arguments`有`JNIEnv*`和`jobject`
* JNIEnv*，代表JNI的环境，可以获取到所有的JNI方法。
* jobject，指向Java对象的`object`。

`extern "C"`只会被C++编译器识别，C++编译器在编译时会按照C语言方法的命名规则，而非C++的命名规则进行编译。C和C++的有不同方法命名规则,C++支持方法的重载，同时C++使用mangling scheme识别方法的重载。


在MainActivity中添加C++代码的调用，启动MainActivity后会输出"String from C++"

```java
public class MainActivity extends AppCompatActivity {

    static {
        //用于在运行时加载本地库
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

### 在JNI中使用C语言，新建helloJIN.c文件

```c
    #include <jni.h>        // JNI header provided by JDK
    #include <stdio.h>      // C Standard IO Header

    // Implementation of the native method sayHello()
    JNIEXPORT void JNICALL Java_HelloJNI_sayHello(JNIEnv *env, jobject thisObj) {
       printf("Hello World!\n");
       return;
    }

```


### JNI基础类型介绍

在`jni.h`文件中定义了预编译类型，区分Java、C++以及C

```c

/* Primitive types that match up with Java equivalents. */
typedef uint8_t  jboolean; /* unsigned 8 bits */
typedef int8_t   jbyte;    /* signed 8 bits */
typedef uint16_t jchar;    /* unsigned 16 bits */
typedef int16_t  jshort;   /* signed 16 bits */
typedef int32_t  jint;     /* signed 32 bits */
typedef int64_t  jlong;    /* signed 64 bits */
typedef float    jfloat;   /* 32-bit IEEE 754 */
typedef double   jdouble;  /* 64-bit IEEE 754 */

/* "cardinal indices and sizes" */
typedef jint     jsize;

#ifdef __cplusplus
/*
 * Reference types, in C++
 */
class _jobject {};
class _jclass : public _jobject {};
class _jstring : public _jobject {};
class _jarray : public _jobject {};
class _jobjectArray : public _jarray {};
class _jbooleanArray : public _jarray {};
class _jbyteArray : public _jarray {};
class _jcharArray : public _jarray {};
class _jshortArray : public _jarray {};
class _jintArray : public _jarray {};
class _jlongArray : public _jarray {};
class _jfloatArray : public _jarray {};
class _jdoubleArray : public _jarray {};
class _jthrowable : public _jobject {};

typedef _jobject*       jobject;
typedef _jclass*        jclass;
typedef _jstring*       jstring;
typedef _jarray*        jarray;
typedef _jobjectArray*  jobjectArray;
typedef _jbooleanArray* jbooleanArray;
typedef _jbyteArray*    jbyteArray;
typedef _jcharArray*    jcharArray;
typedef _jshortArray*   jshortArray;
typedef _jintArray*     jintArray;
typedef _jlongArray*    jlongArray;
typedef _jfloatArray*   jfloatArray;
typedef _jdoubleArray*  jdoubleArray;
typedef _jthrowable*    jthrowable;
typedef _jobject*       jweak;


#else /* not __cplusplus */

/*
 * Reference types, in C.
 */
typedef void*           jobject;
typedef jobject         jclass;
typedef jobject         jstring;
typedef jobject         jarray;
typedef jarray          jobjectArray;
typedef jarray          jbooleanArray;
typedef jarray          jbyteArray;
typedef jarray          jcharArray;
typedef jarray          jshortArray;
typedef jarray          jintArray;
typedef jarray          jlongArray;
typedef jarray          jfloatArray;
typedef jarray          jdoubleArray;
typedef jobject         jthrowable;
typedef jobject         jweak;

#endif /* not __cplusplus */

```


#### Java基本数据类型与Native层中的数据对应关系
这些基本数据类型可以在Native层直接使用。

![](/assets/Android JNI2.png)

#### Java引用数据类型与Native层中的数据对应关系
Java引用数据类型不能直接在Native层使用，需要根据JNI函数进行类型的转换后，才能使用。多维数组（包括二维数组）都是引用类型，需要转化为`jobjectArray`类型进行使用。    

![](/assets/Android JNI3.png)

在JNI中二维数组的使用
```java
     //获取一维数组的引用，即jintArray类型
     jclass intArrayClass=env->FindClass("[I");  
     //构造一个指向jintArray类的一维数组对象，该对象数组初始大小为length,类型为jsize
     jobjectArray objectIntArray=env->NewObjectArray(length,intArrayClass,Null);
     
```

#### jfieldID 和jmethodID

当Native层需要调用Java的某个方法时，需用`jmethodID`表示，变量则用`jfieldID`表示。`jni.h`中对jfieldID和jmethodID的定义

```c++
    struct _jfieldID;                       /* opaque structure */
    typedef struct _jfieldID* jfieldID;     /* field IDs */

    struct _jmethodID;                      /* opaque structure */
    typedef struct _jmethodID* jmethodID;   /* method IDs */
```

在JNI规则中，用jfieldID 和jmethodID 来表示Java类的成员变量和成员函数，它们通过JNIEnv的下面两个函数可以得到，其中jclass代表Java类，name表示成员函数或成员变量的名字，sig为这个函数和变量的签名信息。

```c++
    //获取jfieldID
      jfieldID GetFieldID(jclass clazz, const char* name, const char* sig)
    { return functions->GetFieldID(this, clazz, name, sig); }

    //获取jmethodID
     jmethodID GetMethodID(jclass clazz, const char* name, const char* sig)
    { return functions->GetMethodID(this, clazz, name, sig); }

```
以Java中的MD5加密在JNI层调用为例，介绍jmethodID的使用







#### JavaVM介绍

JavaVM是虚拟机在JNI层的代表，每一个虚拟机进程只有一个JavaVM，即对JNI来说，JavaVM是一个全局变量。`jni.h`的定义中，在C++模式下，`JavaVM`是一个结构体；在C语言模式下`JavaVM`是是一个指向方法接口指针的指针。

#### JNIEnv介绍

JNIEnv是JavaVM在线程中的代表，是一个与线程相关的，代表JNI环境的结构体，不同线程的JNIEnv彼此独立。`jni.h`的定义中，在C++模式下，`JNIEnv`是一个结构体；在C语言模式下`JNIEnv`是是一个指向方法接口指针的指针。

**作用：**
* 调用Java函数 ：JNIEnv 代表 Java 运行环境, 可以使用 JNIEnv 调用Java中的代码;
* 操作Java对象 : Java对象传入JNI层就是Jobject对象, 需要使用 JNIEnv来操作这个 Java 对象;

```c++

    #if defined(__cplusplus)
    typedef _JNIEnv JNIEnv;
    typedef _JavaVM JavaVM;
    #else
    typedef const struct JNINativeInterface* JNIEnv;
    typedef const struct JNIInvokeInterface* JavaVM;
    #endif

```



#### JNIEnv和JavaVM调用方法

* 对于C语言

```
    (*env)->方法名(env,参数列表)
    (*vm)->方法名(vm,参数列表)

```
* 对于C++

```
    env->方法名(参数列表)
    vm->方法名(参数列表)

```

### 在









