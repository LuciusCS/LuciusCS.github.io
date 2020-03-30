

# Glide手写框架实现

## 实现步骤

Glide框架实现主要有以下步骤

* 活动缓存的实现

* 内存缓存的实现

* 磁盘缓存的实现

* 声明周期的管理

### 实现前的准备

1、在图片加载的过程中，采用<Key,BitMap>的形式获取图片对象；在使用的过程中，需要对图片文件的名称和路径进行加密，定义一个专门的类对名称和路径进行加密和解密，这样可以避免图片路径过长的问题。

```java
public class Path {

    private String key;  //例如  ac43474d52403e60fe21894520a67d6f417a6868994c145eeb26712472a78311

    /**
     * 加密前 sha256 (https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy90cm01Vk1lRnA5blVESWdHaWJkVnlFSnk3MmlieVdXOElDWGlhamZDNlliNTc3YnVRTUdtYmUxR1hxSmhwVjNvUzhyWktENTIzODNVZDFpYkh6VTJDakxrUUEvNjQw?x-oss-process=image/format,png)
     * 加密后  ac43474d52403e60fe21894520a67d6f417a6868994c145eeb26712472a78311
     * @param key
     */
    public Path(String key) {
        this.key = Tool.getSHA256StrJava( key);
    }

    //添加getter和setter方法。
}

```

2、在使用的过程中，需要对BitMap的使用状态以及回收状态进行处理，设置一个专门的类进行管理。在对BitMap进行管理的过程中，需要对BitMap的引用次数进行标记，当引用次数等于零时，回收BitMap的空间；BitMap回收采用回调的方式由外部进行回收

回调接口

```java
public interface ValueCallback {

    //活动缓存监听的方法（BitMap不再使用了）
    public void valueNonUseAction(String path, BitMapValue bitMapValue);
}

```

在BitMap中 `bitmap`变量用于持有正在使用的图片对象，`count`变量用于对该对象的引用进行计数，会进行加一或者减一操作，`path`变量用于标记图片的路路径，`valueCallback`用于引用次数为零时的回调；

```java

public class BitMapValue {

    private BitMapValue(){}

    //采用单利模式
    private static BitMapValue bitMapValue;
    
    public static BitMapValue getInstance(){
        //.....
        //省略单例实现
        return bitMapValue;
    }

    private Bitmap bitmap;

    private int count;

    //互动缓存监听
    private ValueCallback valueCallback;

    private String path;

    public void useAction(){
        if (bitmap.isRecycled()){   //已经被回收
            return;
        }
        count++;

    }

    public void nonUseAction(){
        count--;
        if (count<=0){
            valueCallback.valueNonUseAction(path,this);
            recycleBitmap();
        };
    }

    //释放bitmap
    public void recycleBitmap(){
    
        bitmap.recycle();

        bitMapValue =null;

        System.gc();
    }
    //添加getter和setter方法
}


```

### 活动缓存的实现
活动缓存用于存储应用中正在使用的图片资源，采用弱引用的方式便于系统及时回收；在活动缓存中采用<Path,Bitmap>的方式表示的正在使用的图片信息;

在活动缓存中`Map<String, WeakReference<BitMapValue>>mapList`变量用于持有缓存对象的弱引用，`ReferenceQueue<BitMapValue>queue`用于监听弱引用是否被回收，`boolean isAutoRemove`用于标记弱引用是否为自动移除。

方法` put(String path, BitMapValue bitMapValue)`用于添加活动缓存，方法`get(String key)`用于获取活动缓存，






### 内存缓存的实现

内存缓存将使用的图片资源缓存至内存中，采用LRU算法进行回收。

### 磁盘缓存的实现

以文件的形式保存至本地磁盘，

### 声明周期的管理
