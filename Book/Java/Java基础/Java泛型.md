# Java泛型介绍

## Generic Programming\(泛型编程\)

泛型类可以是编码更安全以及方便阅读，尤其是在集合类中；Java中的泛型与C++中的模板类有着相似之处。Generic Programming\(泛型编程\)可以使得对象\(object\)在多种场合下被重复使用。例如：ArrayList类可以表示各种不同类的集合。

## 定义一个简单的泛型类

泛型类有一个或者多个类型变量，下面代码中是一个最简单的泛型类，没有多余的的数据代码

```java
public class Pair<T>
{
    private T first;
    private T second;

    public Pair(){}

}
```

