---
title: Glide手写框架实现
tags: [Android]
description:  Glide手写框架实现
thumbnail: /thumbnail/img92.jpg
toc: true
categories: Android
date: 2019/05/08
---

# Glide手写框架实现

## 实现步骤

Glide框架实现主要有以下步骤

图片下载后，先缓存至活动缓存；在获取缓存中通过弱引用监控bitMap的回收，如果活动缓存中bitMap的弱引用被回收，那么会将活动缓存中的bitMap，缓存至内存缓存；当图片被再次使用会从内存缓存中移除，添加到活动缓存中；


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

在活动缓存中需要对被回收的对象的引用进行监听，当对象被回收后，需要将其加入到内存缓存中。

变量`Map<String, WeakReference<BitMapValue>>mapList`用于持有缓存对象的弱引用，`mapList`的`value`是一个弱引用，会被自动回收，需要对该弱引用的回收做监听，处理弱引用回收后的操作，因此需要创建一个`CustomWeakReference`内部类；

变量`Map<String, Bitmap>mapValueList`用于持有缓存对象的引用，其中保存的对象与`mapList`中的对象一致，`mapList`中的弱引用被回收后，需要通过获取`mapValueList`中的Bitmap对象，将其缓存至内存缓存中；

变量`ReferenceQueue<BitMapValue>queue` 将`BitMapValue`的弱引用添加到该队列中，通过调用`remove`这一阻塞方法监听弱引用是否被回收。

变量`boolean isCloseThread` 用于监听是否将弱引用回收监听的线程进行停止；

变量`Thread thread` 用于表示弱引用回收监听线程



方法` put(String path, BitMapValue bitMapValue)`用于添加活动缓存；
方法`get(String key)`用于获取活动缓存；
方法` closeActiveCache()`用于关闭活动缓存

内部类 `class CustomWeakReference `用于在弱引用被回收后，获取该 BitMapValue 的 path和bitmap



```java

public class ActiveCache {


    private Map<String, WeakReference<BitMapValue>>mapList=new HashMap<>();

    private Map<String, Bitmap>mapValueList=new HashMap<>();

    private ReferenceQueue<BitMapValue>queue;    //目的：为了监听弱引用是否被回收

    private boolean isCloseThread;

    private Thread thread;


    private ValueCallback valueCallback;

    public ActiveCache(ValueCallback valueCallback){
        this.valueCallback=valueCallback;
    }

    /**
     * TODO 添加活动缓存
     * @param path
     * @param bitMapValue
     */
    public void put(String path, BitMapValue bitMapValue){

        Tool.checkNotEmpty(path);

        //绑定Value的监听，Value没有被使用了，就会发起这个监听，给外界业务需要来使用)
        bitMapValue.setValueCallback(valueCallback);

        mapList.put(path,new CustomWeakReference(bitMapValue,getQueue(),path));

        mapValueList.put(path,bitMapValue.getBitmap());
    }


    /**
     * TODO 给外界获取value
     * @param path
     * @return
     */
    public BitMapValue get(String path){
        WeakReference<BitMapValue>valueWeakReference=mapList.get(path);
        if (null!=valueWeakReference){
            BitMapValue value=valueWeakReference.get();   //返回value
            value.setBitmap(mapValueList.get(path));
            value.setPath(path);
            return value;   //返回value
        }
        return null;

    }

    //主动释放内存缓存，并将线程进行关闭
    public void closeActiveCache(){
        isCloseThread=true;
        mapList.clear();;
        System.gc();
    }


    //监听弱引用，成为弱引用的子类，为了监听弱引用是否被回收，并获取弱引用回收后的 path和 BitMapValue
    public class CustomWeakReference extends WeakReference<BitMapValue>{

        private String path;
        private BitMapValue value;

        public CustomWeakReference(BitMapValue referent, ReferenceQueue<? super BitMapValue> q,String path) {
            super(referent, q);
            this.path =path;
            this.value=referent;
        }

    }


    //创建弱引用队列，并对弱引用的回收进行监听
    private ReferenceQueue<BitMapValue>getQueue(){
        if (queue==null){
            queue=new ReferenceQueue<>();
            thread= new Thread(){
                @Override
                public void run() {
                    super.run();
                    while (!isCloseThread){
                        try {
                            //阻塞式方法 如果有引用被回收，则会执行该方法，并返回被回收的对象
                            Reference<? extends BitMapValue> remove = queue.remove(); 
                            CustomWeakReference weakReference = (CustomWeakReference) remove;

                             //将引用移除容器
                            if (mapList != null && !mapList.isEmpty()) {
                                    mapList.remove(weakReference.path);
                                    mapValueList.remove(weakReference.path);
                            }

                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        } } }
            };
            thread.start();
        }
        return queue;
    }
}



```

### 内存缓存的实现

内存缓存将使用的图片资源缓存至内存中，采用LRU算法进行回收,继承`LruCache<K, V>`接口，并在初始化的时候设置图片缓存的最大值。内存缓存的图片在每一次调用之后，都会进行移除后再次加入到活动缓存中；

与活动缓存一样，内存缓存在缓存中的BitMapValue被移除后，需要进行回调，内存缓存回调接口如下：

```
public interface MemoryCacheCallback {

    /**
     * 内存缓存中移除的path
     * @param path
     * @param oldBitMapValue
     */
    public void entryRemoveMemoryCache(String path,@NonNull BitMapValue oldBitMapValue);
}

```
内存缓存的源码如下：

```java
public class MemoryCache extends LruCache <String, BitMapValue>{

    private boolean manualRemove;

    //TODO 手动移除 Manual
    public BitMapValue manualRemove(String path){
        manualRemove=true;
       BitMapValue bitMapValue =remove(path);
        manualRemove=false;
       return bitMapValue;
    }


    private MemoryCacheCallback memoryCacheCallback;

    public void setMemoryCacheCallback(MemoryCacheCallback memoryCacheCallback) {
        this.memoryCacheCallback = memoryCacheCallback;
    }

    // 传入元素最大值给 LruCache
    public MemoryCache(int maxSize) {
        super(maxSize);
    }

    @Override
    protected int sizeOf(@NonNull String key, @NonNull BitMapValue bitMapValue) {
//        return super.sizeOf(key, value);
        Bitmap bitmap= bitMapValue.getBitmap();

        //最开始的的时候
//        int result=bitmap.getRowBytes()*bitmap.getHeight();
        //API 12  3.0
//        int result=bitmap.getByteCount();  //bitmap内存复用上有区别(所属的)
        //API 19 4.4
//        int result=bitmap.getAllocationByteCount();//bitmap内存复用上有区别(整个的)
        int sdkInt= Build.VERSION.SDK_INT;
        if (sdkInt>=Build.VERSION_CODES.KITKAT){
            return bitmap.getAllocationByteCount();
        }

        return bitmap.getByteCount();

    }

    /**
     * 1. 重复的key
     * 2. 最少使用的元素会被移除
     * @param evicted
     * @param key
     * @param oldBitMapValue
     * @param newBitMapValue
     */

    @Override
    protected void entryRemoved(boolean evicted, @NonNull String key, @NonNull BitMapValue oldBitMapValue, @Nullable BitMapValue newBitMapValue) {
        super.entryRemoved(evicted, key, oldBitMapValue, newBitMapValue);
        if (memoryCacheCallback!=null&&!manualRemove){  //被动删除
            memoryCacheCallback.entryRemoveMemoryCache(key, oldBitMapValue);
        }
    }
}


```

### 磁盘缓存的实现

以文件的形式保存至本地磁盘，文件名称需要通过`Path`类进行设置，在磁盘缓存中借助于 https://github.com/JakeWharton/DiskLruCache 中的  `DiskLruCache.java` `StrictLineReader.java` `Util.java ` 并对DiskLruCache进行封装。在封装的过程中，需要指定磁盘缓存的路径、缓存文件的最大值，以及put和get方法

```java
public class DiskLruCacheImpl {

    //SD/disk_lru_cache_dir/ac43474d52403e60fe21894520a67d6f417a6868994c145eeb26712472a78311
    private final String DISKLRU_CACHE_DIR="disk_lru_cache_dir";  //磁盘缓存的目录

    private final int APP_VERSION=1;   //我们的版本号，一旦修改这个版本号，之前的缓存失效

    private final int VALUE_COUNT=1;  //通常情况下是1

    private final long MAX_SIZE=1024*1024*10l; //指定缓存文件最大值

    private DiskLruCache diskLruCache;

    public DiskLruCacheImpl() {

        File file=new File(Environment.getExternalStorageDirectory()+File.separator+DISKLRU_CACHE_DIR);


        try {
            diskLruCache= DiskLruCache.open(file,APP_VERSION,VALUE_COUNT,MAX_SIZE);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    //TODO put
    public void put(String path){

        DiskLruCache.Editor editor=null;

        OutputStream outputStream=null;

        try {
            editor=diskLruCache.edit(path);

           outputStream=editor.newOutputStream(0);  //index不能大于 VALUE_COUNT

            Bitmap bitmap= bitMapValue.getBitmap();

            bitmap.compress(Bitmap.CompressFormat.PNG,100,outputStream);  //吧把BitMap 写入outputStream

            outputStream.flush();

        } catch (IOException e) {
            //....省略
        }

        //....省略提交，流输出、关闭

    }

    public BitMapValue get(String path, BitmapPool bitmapPool){

        InputStream inputStream=null;
        try {
            DiskLruCache.Snapshot snapshot=diskLruCache.get(key);
            //判断快照不为null的情况下，再去读操作
            if (null!=snapshot){
                BitMapValue bitMapValue = BitMapValue.getInstance();
                inputStream=snapshot.getInputStream(0); 

                int w=1092;
                int h=1080;
                BitmapFactory.Options options2 = new BitmapFactory.Options();
                options2.inMutable=true;
                options2.inPreferredConfig=Bitmap.Config.RGB_565;
                options2.inJustDecodeBounds=false;
                //inSampleSize是采样率，当inSampleSize为2时，一个2000 1000的图片，将被缩小至 1000 500
                options2.inSampleSize= Tool.sampleBitmapSize(options2,w,h);
                final Bitmap bitmap = BitmapFactory.decodeStream(inputStream,null,options2);
                bitMapValue.setBitmap(bitmap);
                //保存key唯一标识
                bitMapValue.setPath(path);
                return bitMapValue;
            }


        } catch (IOException e) {
            e.printStackTrace();
        }
        //....省略提交、流输出、关闭

        return null;
    }

}


```

### 复用池的实现

复用池的作用是将已经不需要使用的数据空间重新拿来使用，可以避免频繁申请内存，减少内存的抖动；在未使用复用池的情况下，每张图片都需要一块内存，在使用复用池的情况下，如果存在能被复用的图片就会重复使用改图片的内存。

`inMutable`是bitmapFactory的一个参数，表示该bitmap是可变的，支持复用的，在复用Bitmap之前需要设置`inMutable`为true
`inBitmap`设置想要存储的bitmap

复用池接口

```java
public interface BitmapPool {
    /**
     * 存入到Bitmap
     * @param bitmap
     */
    void put(Bitmap bitmap);

    /**
     * 获取匹配 可用复用 Bitmap
     * @param w
     * @param h
     * @return
     */
    Bitmap get(int w,int h,Bitmap.Config config);
}

```

在复用池接口实现的过程中，继承`LruCache` 类，实现LRU算法；在复用池中通过Treemap对图片的内存空间进行排序，并通过TreeMap的`ceilingKey()`方法获取到合适的Bitmap内存；当Bitmap从内存缓存中移除后，会将其内存空间添加到复用池中；当Bitmap从磁盘中取出后，会先去查找复用池中是否有合适的空间，如果有则直接使用，否则开辟新的内存空间；

我觉得应该先去看bitmap的内存申请

```java
public class BitmapPoolImpl extends LruCache<Integer,Bitmap> implements BitmapPool {


    //为了筛选出合适的 Bitmap 容器
    private TreeMap<Integer,String>treeMap=new TreeMap<>();

    /**
     * @param maxSize for caches that do not override {@link #sizeOf}, this is
     *                the maximum number of entries in the cache. For all other caches,
     *                this is the maximum sum of the sizes of the entries in this cache.
     */
    public BitmapPoolImpl(int maxSize) {
        super(maxSize);
    }

    @Override
    public void put(Bitmap bitmap) {
        //存入复用池
        bitmap.isMutable();
        //todo 条件一 bitmap.isMutable()==true;
        if (!bitmap.isMutable())
        {
            if (bitmap.isRecycled()==false){
                bitmap.recycle();
            }
            return;
        }

        //todo 条件二 就计算bitmap的大小,
        int bitmapSize = getBitmapSize(bitmap);
        if (bitmapSize>maxSize()){
            if (bitmap.isRecycled()==false){
                bitmap.recycle();
            }
            return;
        }
        //todo bitmap存入 LruCache
        put(bitmapSize,bitmap);
        //存入筛选容器
        treeMap.put(bitmapSize,null);
    }

    //获取可以复用Bitmap
   
    @Override
    public Bitmap get(int w, int h, Bitmap.Config config) {

        /**
         * ALPHA_8 理论上 实际上Android自动做处理的  只有透明度 8 位，一个字节
         * w*h*1
         *
         * RGB_565 理论上 实际上Android自动处理的  R 5位 G 6位 B 5位 没有透明度 两个字节
         * w*h*2
         *
         * ARGB_4444  理论上 实际上Android自动处理的 A 4位 R 4位 G 4位 B 4位  两个字节
         *
         *
         * 质量最高：
         * ARGB_8888  Android默认使用  A 8位 R 8位 G 8位 B 8位  四个字节
         *
         *
         * 常用的 ARGB_8888 RGB_565
         *
         */

        int getSize=w*h*(config==Bitmap.Config.ARGB_8888?4:2);  //只考虑两种，Glide所有的都考虑了

        Integer key = treeMap.ceilingKey(getSize);//可以查找到容器里面 和 getSize一样大的，也可以比getSize还要大的

        //如果treeMap还没有put,那么一定是null
        if (key==null){
            return null;   //没有找到合适的可复用的key
        }

        //查找容器取出来的key ,必须小于计算出来的 (getSize*2)
        if (key<=(getSize*2)){
            Bitmap remove=remove(key);  //复用池如果要取出来，肯定要取出来，不给其他地方用
            Log.e(TAG,"从复用池中取出复用元素 bitmap");
            return remove;
        }
        return null;
    }


    /**
     * 计算Bitmap的大小
     * @param bitmap
     * @return
     */
    private int getBitmapSize(Bitmap  bitmap){
        int sdkInt= Build.VERSION.SDK_INT;
        if (sdkInt>=Build.VERSION_CODES.KITKAT){
            return bitmap.getAllocationByteCount();
        }

        return bitmap.getByteCount();

    }

    //元素的大小
    @Override
    protected int sizeOf(@NonNull Integer key, @NonNull Bitmap value) {
//        return super.sizeOf(key, value);
        return getBitmapSize(value);
    }

    @Override
    protected void entryRemoved(boolean evicted, @NonNull Integer key, @NonNull Bitmap oldValue, @Nullable Bitmap newValue) {
        super.entryRemoved(evicted, key, oldValue, newValue);
        //吧TreeMap里面的给移除
    }
}


```

[源码地址](https://github.com/LuciusCS/AndroidProject) 在`glidemodule`模块中进行实现