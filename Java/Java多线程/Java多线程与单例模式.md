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