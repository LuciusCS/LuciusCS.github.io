---
title: Java单例模式
cover:  /cover/img60.jpg
toc: true
description: Java单例模式
categories: Java
type: [Java]
date: 2019/03/25
---

### 不同单例模式在多线程下的特点
单例模式有很多实现方法，饿汉、懒汉、静态内部类、枚举类，试分析每种实现下获取单例对象（即调用getInstance）时的线程安全，并思考注释中的问题

饿汉式：类加载就会导致该单实例对象被创建
懒汉式：类加载不会导致该单实例对象被创建，而是首次使用该对象时才会创建

* 懒汉式：该加载模式是非线程安全的，当有多个线程并行调用getInstance()时，会创建多个实例；


懒汉式线程安全代码，将整个getInstance()方法设置为同步(synchronized)；但在任何一个时候只能有一个线程调用getInstance()方式，而同步操作只需要在第一次调用时需要。
<!--more-->
```java

public class Singleton {
    private static Singleton instance=null;
    private Singleton (){}


    ///锁的范围比较大，每一次调用都要加锁
    public static synchronized  Singleton getInstance() {
     if (instance == null) {
         instance = new Singleton();
     }
     return instance;
    }
}
```

* 双重检测锁双重检验锁模式（double checked locking pattern），是一种使用同步块加锁的方法；因为会有两次检查 instance == null，一次是在同步块外，一次是在同步块内。为什么在同步块内还要再检验一次？因为可能会有多个线程一起进入同步块外的 if，如果在同步块内不进行二次检验的话就会生成多个实例了。

重要！！！ 双重监测模式完整代码



```java

public class Singleton {
    private Singleton (){}

   //问题1：解释为什么要加volatile?： synchronized中的指令会重排序，防止下面的instance重排序(在volatile原理中有),instance可以被赋值了，但是却没有实例化
    private static volatile Singleton instance=null;

   //问题2：对比上一个实现,说出这样做的意义：上一个锁的范围比较大，每一次调用都要加锁，影响性能
    public static Singleton getSingleton() {

        if(instance!=null){
         return instance;
        }
        synchronized (Singleton.class) {
       //问题3：为什么还要在这里加为空判断,之前不是判断过了吗：防止首次创建instance多个线程并发，t1执行到此锁住对象，t2又执行到到此，如果没有判断则t2又创建一个新的实例
          if(instance!=null){
              return instance;
           }
          instance = new Singleton();
          return instance ;
                
     }
    }

}

```


**在使用`synchronized`关键字之后，每次只有一个线程可以进入到该方法中，但是使用`synchronized`关键字会造成开销过大**

于instance = new Singleton()这条语句，这并非是一个原子操作，在 JVM 中这句话大概做了下面 3 件事情。

1、给 instance 分配内存
2、调用 Singleton 的构造函数来初始化成员变量
3、将instance对象指向分配的内存空间（执行完这步 instance 就为非 null 了）

但是在 JVM 的即时编译器中存在指令重排序的优化。上面的第二步和第三步的顺序是不能保证的，最终的执行顺序可能是 1-2-3 也可能是 1-3-2。如果是后者，则在 3 执行完毕、2 未执行之前，被线程二抢占了，这时 instance 已经是非 null 了（但却没有初始化），所以线程二会直接返回 instance，然后使用，然后报错；我们只需要将 instance 变量声明成 volatile 即可。

```java

public class Singleton {
    private volatile static Singleton instance; //声明成 volatile
    private Singleton (){}

    public static Singleton getSingleton() {
        if (instance == null) {                         
            synchronized (Singleton.class) {
                if (instance == null) {       
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
   
}

```
`volatile`具有可见性；还有另一个特性：禁止指令重排优化。在 volatile 变量的赋值操作后面会有一个内存屏障（生成的汇编代码上），读操作不会被重排序到内存屏障之前。比如上面的例子，取操作必须在执行完 1-2-3 之后或者 1-3-2 之后，不存在执行到 1-3 然后取到值的情况。从「先行发生原则」的角度理解的话，就是对于一个 volatile 变量的写操作都先行发生于后面对这个变量的读操作（这里的“后面”是时间上的先后顺序）


* 饿汉式( static final field)单例的实例被声明成 static 和 final 变量了，在第一次加载类到内存中时就会初始化，所以创建实例本身是线程安全的。

```java

public class Singleton{
    //类加载时就初始化
    private static final Singleton instance = new Singleton();
    
    private Singleton(){}

    public static Singleton getInstance(){
        return instance;
    }
}
```


```java

    //问题1：为什么加final ： 防止有子类，子类有可能修改了父类的方法
    //问题2：如果实现了序列化接口,还要做什么来防止反序列化破坏单例： 加一个readResolve()方法，反序列化的过程中会采用readResolve()方法中返回的对象，而不是字节码反序列化返回的结果；
public final class Singleton implements Serializable{
    //问题3：为什么设置为私有?是否能防止反射创建新的实例? ： 如果设置成public，其他类可以无限生成对象，就不是单例模式了；不能防止反射创建新的实例
    private Singleton(){}
    //问题4：这样初始化是否能保证单例对象创建时的线程安全?：可以保证线程安全，静态成员变量是在类加载的过程中生成，类加载阶段由jvm保证线程安全；类加载阶段静态成员变量赋值都是线程安全的
    private static final Singleton INSTANCE=new Singleton();
    //问题5：为什么提供静态方法而不是直接将INSTANCE设置为public,说出你知道的理由：用方法可以提供更好的封装性、对单例对象的创建有更好的控制、提供范型的支持
    public static Singleton getInstance(){

        return INSTANCE;
    }


    public Object readResolve(){
        return INSTANCE;
    }
}

````


单例会在加载类后一开始就被初始化，即使客户端没有调用 getInstance()方法。饿汉式的创建方式在一些场景中将无法使用：譬如 Singleton 实例的创建是依赖参数或者配置文件的，在 getInstance() 之前必须调用某个方法设置参数给它，那样这种单例写法就无法使用了。

* 静态内部类 static nested class,这种方法也是《Effective Java》上所推荐的。属于懒汉式的创建

```java
public class Singleton {  

    private Singleton (){}  
    private static class SingletonHolder {  
        private static final Singleton INSTANCE = new Singleton();  
    }  

    
    public static final Singleton getInstance() {  
        return SingletonHolder.INSTANCE; 
    }  
}

```

这种写法仍然使用JVM本身机制保证了线程安全问题；由于 SingletonHolder 是私有的，除了 getInstance() 之外没有办法访问它，因此它是懒汉式的；同时读取实例的时候不会进行同步，没有性能缺陷；也不依赖 JDK 版本。





* 使用枚举实现单例

```java
//问题1：枚举单例是如何限制实例个数的: 枚举类的静态成员变量，单实例的
//问题2：枚举单例在创建时是否有并发问题：没有，静态成员变量在类加载的时候赋值
//问题3：枚举单例能否被反射破坏单例：不能
//问题4：枚举单例能否被反序列化破坏单例：枚举类默认实现反序列化接口，但是在实现反序列化接口时，考虑到了，不会破坏单例
//问题5：枚举单例属于懒汉式还是饿汉式：饿汉式
//问题6：枚举单例如果希望加入一些单例创建时的初始化逻辑该如何做：加一个构造方法，加入初始化逻辑
enum Singleton{
   INSTANCE;
}
```











