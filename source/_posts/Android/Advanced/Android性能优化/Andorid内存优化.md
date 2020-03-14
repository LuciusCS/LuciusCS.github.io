


### 垃圾回收
垃圾回收器负责回收程序中已经不适用，但仍然被各种对象占用的内存，Android具有垃圾回收机制，自动追踪所有的对象。


### Android中的垃圾回收机制

![](public/img/Android/Android_performance.png)

1、 Young Generation
 * 大多数新建对象都位于Eden区
 * 当Eden被对象填满时，就会执行Minor GC，并把所有存活下来的对象转移到其中一个Servivor区
 * Survivor Space: S0、S1 有两个，存放每次垃圾回收后存活的对象
 * Minor GC 同样会检查survivor区中存活的对象，并把他们转移到另一个survivor区，这样在一段时间内，总会有一个空的survivor区。

2、Old Generation
* 存放长期存活的对象和经过多次Minor GC后依然存活下来的对象
* 满了进行Major GC(花时间比Minor时间长)

3、Permanent Generation
* 存放方法区，方法区中有要加载的类信息、静态变量、final类型的常量、属性和方法信息。

### 垃圾回收机制和FPS 

1、Android系统每隔16ms发出VSVNYC信号，触发对UI的渲染，那个整个过程就能保证在16ms以内就能达到一个流畅的画面。16FPS

2、如果某一帧的操作超过了16ms就会让用户感觉到卡顿。

3、UI渲染过程发生GC，导致某一帧绘制时间超过16ms。


### 内存泄露

1、应用程序分配了大量不能被回收的对象
2、系统可分配的内存越来越少
3、新对象的创建需要的内存不够
4、GC之后再分配
5、60fps

### 常见的内存泄露

1、单例造成的泄露

在单例中使用Context对象，应该使用Application的Context，使用其他的容易造成内存泄露。

注：静态对象在程序运行期间是不会被垃圾回收，在下方代码中会一直持有一个context引用，造成内存泄露。

```java
public class AppManager{
    private static AppManager instance;
    private Context context;
    private AppManager(Context context){
        this.context=context;
    }

    public static AppManager getInstance(Context context){
        if(instance!=null){
            instance=new AppManager(context);
        }
        return instance;
    }
}
```


2、非静态内部类的静态实例造成的泄露

`sResource`变量会间接持有MainActivity实例的引用，导致内存泄露

```java

public class MainActivity extends Activity{
    private static TestResource sResource=null;

    @Override
    protected void onCreate(Bundle saveInstanceState){
        super.onCreate(saveInstanceState);
        setContentView(R.layout.activity_main);
        if(sResource==null){
            sResource=new TestResource();
        }

        //...
    }

    class TestResource{
        //...
    }

}

```

3、`Handler`造成的内存泄露

通过匿名对象创建mHandler，会持有MainActivity实例的引用，Handler对象的生命周期会比MainActivity长，造成MainActivit不能被回收

```java
    public class MainActivity extends Activity{
        private Handler mHandler=new Handler(){
            @Override
            public void handleMessage(Message msg){

            }
        }；
        @Override
        protected void onCreate(Bundle saveInstanceState){
            super.onCreate(saveInstanceState);
            setContentView(R.layout.activity_main);
            loadData();
        }

        private void loadData(){
            //... request
            Message message=Message.obtain();
            mHandler.sendMessage(message);
        }
      }
    }

```

### 避免内存泄露的方法
1、尽量不要让静态变量引用Activity

2、使用WeakReference

3、使用静态内部类来代替内部类

4、静态内部类使用弱引用来引用外部类

5、在生命周期结束时释放资源

### 减少内存的使用

* 使用更轻量的数据结构（比如SpareArray代替HashMap）
* 避免在onDraw方法中创建对象，onDraw方法调用频率比较高，建议使用对象池(Message.obtain())
* LruCache
* Bitmap内存复用，压缩(inSampleSize,inBitmap)
* StringBuilder代替Stirng,主要是String的拼接
* App多次申请内存会造成内存抖动，内存碎片的问题
* 使用复用池避免内存抖动和内存碎片