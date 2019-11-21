

### Lambda介绍
Lambda 表达式”(lambda expression)是一个匿名函数，Lambda表达式基于数学中的λ演算得名，直接对应于其中的lambda抽象(lambda abstraction)，是一个匿名函数，即没有函数名的函数。Lambda表达式可以表示闭包，它是推动 Java 8 发布的最重要新特性。
Lambda 允许把函数作为一个方法的参数（函数作为参数传递进方法中）。

在Java中Lambda表达式与函数式接口是不可分割的，都是结合起来使用的；


#### 函数式接口
把只有一个抽象方法的接口叫做函数式接口（functional interface）


#### Lambda表达式使用注意事项

在Lambda表达式中不能有指向其自己的引用，关键字`this`指向的是闭包，而在匿名内部类中`this`关键字指向的是匿名函数自己，


### Lambda表达式的常用方法

#### 使用lambda表达式替换匿名类
使用lambda表达式替换匿名类，需要用到函数式接口,如`Runnable接口`；在匿名类中只有函数式接口可以使用Lambda表达式进行替代，如果需要一个抽象类的匿名实例，只能使用功匿名类的形式。

``` java
    //使用匿名内部类表达式方法
    new Thread(new Runnable(){
        @Override
        public void run() {
        System.out.println("Test Runnable 1");
    }
    
    ).start();
    
    //使用匿名内部类的方式
    new Thread( () -> System.out.println("Test Runnable 2") ).start();

```

在使用lambda表达式进行排序时，`Comparator<String>`中的参数类型以及返回值，都没有显式地写出，编译器会根据上下文推断出使用的数据类型    


```java
    //使用匿名内部类方式对list进行排序
    Collections.sort(words, new Comparator<String>() {
    public int compare(String s1, String s2) {
        return Integer.compare(s1.length(), s2.length());
        }
    });
    //使用lambda表达式方式对list进行排序
    Collections.sort(words, (s1, s2) -> Integer.compare(s1.length(), s2.length()));

```



#### 使用Lambda表达式进行点击事件处理

```java
    //非lambda表达式方法
    button.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
        Log.i("info","点击");
        }
    });

    //使用lambda表达式方式
    button.setOnClickListener((e)->{
        Log.i("info","点击");
    });


```

但在使用Kotlin添加点击事件，Java中使用lambda表达式不同，`setOnClickListener()`方法在Kotlin中调用时只支持匿名内部类的方式，不支持lambda表达式

```
        hello.setOnClickListener(object : View.OnClickListener {
            override fun onClick(v: View?) {
                TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
            }
        })
        
        //或者
       hello.setOnClickListener{
          Log.i("info","点击");
        }


```


#### 在Java中使用lambda表达式和函数式接口Predicate

在`java.util.function`包中，包含多个类用于支持Java的函数式编程，使用`java.util.function.Predicate`函数式接口以及lambda表达式，可以向API方法添加逻辑，用更少的代码支持更的动态行为







