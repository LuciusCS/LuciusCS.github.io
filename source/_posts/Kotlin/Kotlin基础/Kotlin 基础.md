


## Kotlin关键字

### Kotlin 的延迟初始化: lateinit var 和 by lazy

    Kotlin中属性在声明的同时也要求被初始化，否则会报错

    ```kotlin

       private var name0: String; //报错
       private var name1: String="xiaoming"; //不报错
       private var name2: String?=null;     //不报错 

    ```

   如果不能在声明的时候进行初始化，那么可以使用Kotlin延时初始化： lateinit var或者 by lazy

**lateinit var**
  ```kotlin
    private lateinit var name:String

  ```
  `lateinit var`只能用来修饰类属性，不能用来修饰局部变量，并且只能用来修饰对象，不能修饰基本类型（因为基本属性类型在类加载阶段都会被除初始化默认值）。

   `lateinit var`的作用是防止代码在编译期检查时因为变量未初始化而报错；不能自动初始化，需要程序员自己进行初始化；

**by lazy**

``` 
  val name: Int by lazy {1}; //用于属性延迟初始化

  public fun foo(){
      val bar by lazy {"hello"};
      println(bar);
  }  

```

  `by lazy` 是一种属性委托，使用属性委托关键字`by`，可以用来修饰类属性或局部变量；在属性被第一次使用时能自动初始化；

   `by lazy`要求属性声明为val，不可变变量，相当于java中的final，该变量被初始化不可被修改。`{}` 中的操作就是初始化操作。对于变量的初始化操作本身是线程安全的。 