### java 内部类

内部类依赖于外部类而存在，即内部类存在指向外部类的引用，可以访问外部类private类型的属性。


### 内部类的作用

实现多重继承，每个内部类都能独立继承一个类，在Java中没有多重继承，如果一个类需要同时继承两个类，则可以使用内部类。

内部类可以同时用多个实例，每个实例都有自己的状态信息；

内部类有更好的封装，除了其自身的外部类，其他类都不能访问内部类；


### 内部类分类

#### 局部内部类

嵌套在方法里或者某个作用域内，内部类非公共可用，在方法外或者作用域外不能进行使用。

#### 静态内部类

静态内部类创建不依赖于外部类，没有指向外部类的引用，不能使用外部类任何非static的静态成员方法，可以用来创建线程安全的单例模式

 
```java
    public class Singleton {  
        private static class SingletonHolder {  
            private static final Singleton INSTANCE = new Singleton();  
        }  
        private Singleton (){}  
        public static final Singleton getInstance() {  
            return SingletonHolder.INSTANCE; 
        }  
    }
 
```   

#### 匿名内部类

匿名内部类依赖于接口实现，如果匿名内部类需要访问局部变量，则该局部变量需要表示为final类型

```java

    new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("hello");
            }
        }).start();


```


#### 内部类与闭包

内部类会包含对外部类的引用，形成闭包

```java
        
    public class Outer{
        private int a=1;
        
        public class Inner{
            private int b=2;
            public int multi(){
            return a*b;
        }
    }
        

```


