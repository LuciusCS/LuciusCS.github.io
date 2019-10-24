

### Lambda介绍
Lambda 表达式”(lambda expression)是一个匿名函数，Lambda表达式基于数学中的λ演算得名，直接对应于其中的lambda抽象(lambda abstraction)，是一个匿名函数，即没有函数名的函数。Lambda表达式可以表示闭包，它是推动 Java 8 发布的最重要新特性。
Lambda 允许把函数作为一个方法的参数（函数作为参数传递进方法中）。

在Java中Lambda表达式与函数式接口是不可分割的，都是结合起来使用的；



### Java Lambda表达式的写法

Java中的Lambda表达式通常用`(argument)->(body)`的语法表示

```java
    (arg1, arg2...) -> { body }
    (type1 arg1, type2 arg2...) -> { body }
```

* 一个Lambda表达式可以有零个或多个参数；
* Lambda表达式的主体可以包括零条或多条语句；
* 如果Lambda表达式的主体包含一条以上语句，则表达式必须包括在花括号{}中，返回值与代码块的返回类型一致，若没有则返回值为空。


### 函数式接口
把只有一个抽象方法的接口叫做函数式接口（functional interface），`java.lang.Runnable`接口是只有一个`run()`方法的函数式接口；Lambda表达式能隐式地赋值给函数式接口，通过Lambda表达式创建`Runnable`接口引用如下：

```java
    Runnable r=()->Log.i("测试","Hello Word");
    //当不指明函数式接口时，编译器会自动解释这种转化,将Lambda表达式赋值给Runnable接口
    new Thread(()->Log.i("测试","Hello Word")).start();
 
```

###  Lambda表达式与匿名类的区别


