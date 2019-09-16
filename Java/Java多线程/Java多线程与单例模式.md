### 不同单例模式在多线程下的特点

* 懒汉式：该加载模式是非线程安全的，当有多个线程并行调用getInstance()时，会创建多个实例；

```java

public class Singleton {
    private static Singleton instance;
    private Singleton (){}

    public static Singleton getInstance() {
     if (instance == null) {
         instance = new Singleton();
     }
     return instance;
    }
}
```

懒汉式线程安全代码，将整个getInstance()方法设置为同步(synchronized)；但在任何一个时候只能有一个线程调用getInstance()方式，而同步操作只需要在第一次调用时需要。

```java

public static synchronized Singleton getInstance() {
    if (instance == null) {
        instance = new Singleton();
    }
    return instance;
}

```
* 双重检测锁双重检验锁模式（double checked locking pattern），是一种使用同步块加锁的方法；因为会有两次检查 instance == null，一次是在同步块外，一次是在同步块内。为什么在同步块内还要再检验一次？因为可能会有多个线程一起进入同步块外的 if，如果在同步块内不进行二次检验的话就会生成多个实例了。

```java
public static Singleton getSingleton() {
    if (instance == null) {                         //Single Checked
        synchronized (Singleton.class) {
            if (instance == null) {                 //Double Checked
                instance = new Singleton();
            }
        }
    }
    return instance ;
}

```

于instance = new Singleton()这条语句，这并非是一个原子操作，在 JVM 中这句话大概做了下面 3 件事情。

1、给 instance 分配内存
2、调用 Singleton 的构造函数来初始化成员变量
3、将instance对象指向分配的内存空间（执行完这步 instance 就为非 null 了）

但是在 JVM 的即时编译器中存在指令重排序的优化。上面的第二步和第三步的顺序是不能保证的，最终的执行顺序可能是 1-2-3 也可能是 1-3-2。如果是后者，则在 3 执行完毕、2 未执行之前，被线程二抢占了，这时 instance 已经是非 null 了（但却没有初始化），所以线程二会直接返回 instance，然后使用，然后报错；
















