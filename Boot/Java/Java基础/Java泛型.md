# Generics(泛型)

一个接口或类可能被声明为一个或者多个类型的参数，该类或接口写在尖括号中，提供的实体类需要属于该接口或类。

Generic Programming\(泛型编程\)，泛型类可以是编码更安全以及方便阅读，尤其是在集合类中；Java中的泛型与C++中的模板类有着相似之处。Generic Programming\(泛型编程\)可以使得对象\(object\)在多种场合下被重复使用。例如：ArrayList类可以表示各种不同类的集合。

如果没有泛型，参数的类型会被忽略，



## 装箱和拆箱

在Java中使用引用类型或基础类型，引用类型有class、interface、array所有的引用类型都是类对象，；每一个基础类型都在java.lang包中有一个相应的引用类型。

将基础类型转换为引用类型称为装箱，将引用类型转换为基础类型称为拆箱。在自动装箱的过程中value会被缓存，当int值在-128~127之间、char值在 '\u0000'在'\u007f'、byte类型、boolean类型，**会返回之前缓存的对象**，

```java
    
    int a=100;
    int b=100;
    int c=200;
    int d=200;
    System.out.println(a==b);
    System.out.println(c==d);

```
输出结果为

```java
    true;
    false;
```

Java通过泛型可以自动进行装箱与拆箱。

```java

    Integer i=new Integer(xx);

```
**会触发自动装箱**

```java
    Integer i=xx;
```
**不会触发自动装箱**

**注意：**操作符`==` 在基础类型中以及引用类型中采用不同的定义方式，在`int`类型中，`==`用于通过值的大小定义的，而在`Integer`中是通过对象定义的。在比较两个类对象时应使用euqal



## 遍历循环

for循环可以被用于实现Iterable<E>接口的任何类中，

```java
    List<Integer>ints=Arrays.asList(1,2,3);
    int s=0;
    for(int n:ints){
       s+=n;
    }
```
等价于

```java
    for(Iterators<Integer>it=ints.iterator();it.hasNext();){
       int n=it.next();
       s+=n;
    }
```


## Iterable<E>接口

所有的`Collection`都实现了Iterable<E>接口


## 泛型方法和可变参数(Generic Methods and Varargs)

将任意类型的array转换成List

```java
    class List{
       public static<T> List<T> toList(T[] arr){
           List<T>list=new ArrayList<T>();
           for(T elt:arr)list.add(elt);
           return list;
       }
    }
```

将参数写进数组中显的麻烦，可变参数的作用是将数组参数使用一种更方便与简洁的编码方式来代替，将`T[]`使用`T...`来替代。

```java

class Lists{
        public static<T>List<T>toList(T...arr){
            List<T>list=new ArrayList<T>();
            for(T elt:arr)list.add(elt);
            return list;
        }
}
```
调用方式

```java
     List<Integer> ints = Lists.toList(1, 2, 3); 
     List<String> words = Lists.toList("hello", "world");
```

### 子类型和通配符(SubTyping and Wildcards)

**子类型和替换原则**

子类型具有传递性，即A是B的子类型，B是C的子类型，那么A也是C的子类型。在替换原则中当需要某一类型时可以提供该类型的子类型。如：Integer、Double都是Number的子类型。

```java
    List<Number>nums=new ArrayList<Number>();
    nums.add(2);
    nums.add(3.14);
```

根据替换规则可以在Number的List中添加`Integer`和`Double`类型的对象。


```java
    List<Integer>ints=new ArrayList<Integer>();
    ints.add(2);
    ints.add(3);
    List<Number>nums=ints;    //在编译时报错
    nums.add(3.14);

```

报错的原因是List<Integer>不是List<Number>的子类型，反过来写也不要可以。但可以使用`List<? extends Number>nums=ints`，因为List<Integer>是List<? extends Number>的子类型。

### 带有extends的通配符

以Collection接口中的addAll方法为例

```java
    interface Collection<E>{
     
     ...
     public boolean addAll(Collection<? extends E>c);
     ...
    
    }
```

`? extends E`表示可以使用E的子类型作为参数添加到Collection中

```java

    List<Number>nums=new ArrayList<Number>();
    List<Integer>ints=Array.asList(1,2);
    List<Double>dbls=Array.asList(2.23,3.55);
    nums.addAll(ints);
    nums.addAll(dbls);
```
在此情况下是被允许的，因为List<Number>是Collection<Number>的一个子类型，同时ints的数据类型List<Integer>是Collection<? extends Number>的子类型。如果addAll(Collection<? extends E>c)中没有通配符，那么上面的语句在编译时会报错。

### 带有super的通配符

将一个List拷贝到另外一个List

```java

    public static <T>void copy(List<? super T>dst,List<? extend T>src)
    {
       for(int i=0;i<src.size();i++){
           dst.set(i,src.get(i));
       }
    }

```

`? super T`的表达方式表示目的List中的元素是T的supertype,源List是T的subtype;
典型例子

```java
    List<Object>objs=Array.<Object>asList(2,3,"four");
    List<Integer>ints=Array.asList(5,6);
    Collection.copy(objs,ints);
    Collection.<Object>copy(objs,ints);
    Collection.<Number>copy(objs,ints);
    Collection.<Integer>copy(objs,ints);
    
```

通过泛型方法，可以通过显式的方式指定复制的类型，上述四种写法都是正确的。

### Get和Put原则
？？？？协变（covariance）与逆变（contravariance）统称为变体或变型（variance）   不变（invariant）的

### 数组

在Java中数组的子类型是协变（covariance）的，当S是T的子类型时，可认为S[]是T[]的子类型。
```java
    
    Integer[] ints=new Integer[]{1,2,3};
    Number[] nums=ints;
    num[2]=3.14;  //运行时错误

```

Integer[]可被视为Number[]的子类型，根据替换原则第二行是正确的。当一个数组被赋值后，就会被打上它的实例的标签（在这种状态下是Integer）,因此第三行赋值为Double类型在运行是会出错。

与数组的替换原则相反的是，泛型的子类型时不变的（invarient）,即List<S>不会被认为是List<T>的子类型。引入通配符协变(convariance)泛型，在此情况下当S是T的子类型时，List<S>会被认为是List<? extends T>的子类型。

```java
    List<Integer>ints=Array.asList(1,2,3);
    List<Number nums>=ints;      //在编译时会报错
    List<? extends Number>nums1=ints; //编译通过
    nums1.set(2,3.14)           //编译错误

```

第四行中的赋值，在数组中是运行时报错而在List是运行时报错，根据Get和Put原则不能为已经声明的具有extends的通配符赋值不同的类型。


在通配符中同时会给泛型引入逆变（contravariance），在此情况下当S是T的超类型，List<S>被认为是List<? super T>的子类型，数组不支持子类型的逆变。

Arrays和Collection各有自己的优势，Collection支持很多操作而Arrays中没有。基础类型（primary type）的数组，具有更高的效率，因为其没有装箱和拆箱操作，基础类型的数组没有自己的子类型，因此在数组中存储是不进行类型验证，因此其存储错误在代码运行时进行检验；而Collection的数据存储在代码编译的过程中进行错误检验。

### 通配符VS（Versus）类型参数（Wildcard Versus Type Parameters）

* 使用通配符判断Collection中是否有指定的对象

```java
    interface Collection<E>{
        ...
        public boolean contains(Object o);
        public boolean containsAll(Collection<?>c);
        ...
    }
    
    ...
    Object obj="one";
    List<Object>objs=Arrays.<Object>asList("one",2,3.14,4);
    List<Integer>ints=Arrays.asList(2,4);
    objs.contains(obj);
    objs.containsAll(ints);
    ints.contains(obj);
    ints.containsAll(objs);
    ...
```

在`containsAll(Collection<?>c)`方法中 `Collection<?>c`是`Collection<?>c`的缩写(abbreviation)，继承Object是通配符常用的方式。

* 类型参数
可以通过类型参数来替换通配符的编码方式

```java

    interface Collection<E>{
        ...
        public boolean contains(E o);
        public boolean containsAll(Collection<? extend E>c);
        ...
    }
    


```

但实际在编译的过程中使用

```java
    ...
    Object obj="one";
    List<Object>objs=Arrays.<Object>asList("one",2,3.14,4);
    List<Integer>ints=Arrays.asList(2,4);
    objs.contains(obj);
    objs.containsAll(ints);
    ints.contains(obj);     //编译时报错
    ints.containsAll(objs); //编译时报错
    ...
```

两行代码在编译时报错，因为类型声明后只能来判断list是否含有该类型的对象，或者该类型的子类型对象，所以判断非类型声明的中对象会报错。

### 







