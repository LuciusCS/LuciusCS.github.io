




### POJO类，定义class时添加 `data` 关键字

```kotlin

  data class Persion(val name: String, val age: Int)

  fun main(args: Array<String>) {
    var p = Person("lizo",18);
    println(p.component1()) //获取第一个成员变量
    println(p.component2()) //获取第二个成立变量

    var (name,age) = p;  //把第一个和第二个变量分别赋值给 name 和age ，根据顺序进行赋值
    println("name : $name ,age : $age")
}

```



### 方法默认值

```kotlin
   fun function(var1: String = "default1", var2: Int, var3: String = "default2") {
     print("$var1,$var2,$var3")
   }

   fun main(args: Array<String>) {
     function(var2 = 18,var3 = "lizo123")
   }


```

### 类型判断

```kotlin

when(a){
    is String -> print(a.length)
    is Int -> print(a)
    ...
    else -> throw RuntimeException();
}

```

### 遍历 list/map

```kotlin
    for (l in list) {
        println("$l")
    }

    for ((k, v) in map) {
        println("$k -> $v")
    }


```

### 使用数字区间

```kotlin
    for (i in 1..100) { ... }  // 闭区间：包含100
    for (i in 1 until 100) { ... } // 不包含100
    for (x in 2..10 step 2) { ... } // 按照步长为2增长
    for (x in 10 downTo 1) { ... } // 
    if (x in 1..10) { ... } //判断x是否在1到10这个区间内

```

### 延迟加载，使用by lazy属性

```
class Clazz() {
    val p: String by lazy {
        println("lazy!")
        "haha"
    }
}

fun main(args: Array<String>) {
    var clazz = Clazz()
    println(clazz.p)
    println(clazz.p)
}
```
输出为：

```
lazy!
haha
haha

```


### 类拓展方法

```
fun String.myToLowerCase(): String {
    return this.toLowerCase()
}

fun main(args: Array<String>) {
    println("tHIs iS TeST".myToLowerCase())
}

```
输出为：

```
this is test
```

### 根据条件，进行语句赋值

```kotlin

var a = if(b > 0){1}else{-1}

val c = when (d){
        "red" -> 1
        "blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
    }
}

//函数返回
fun someCall(a:Int) = if(a>0){1}else if(){-1}
```

### lambda 表达式

```
//正常情况
view.setOnClickListener({ v -> v.setVisibility(View.INVISIBLE) })

//当lambda是函数的最后一个参数时，可以将其移到括号外面
view.setOnClickListener() { v -> v.setVisibility(View.INVISIBLE) }

//当函数只有一个lambda类型的参数，可以去省去括号
view.setOnClickListener { v -> v.setVisibility(View.INVISIBLE) }

//当lambda只有一个参数，可省去参数列表，在表达式部分用it引用参数
view.setOnClickListener { it.setVisibility(View.INVISIBLE) }
```

### 空安全  `?.`

```kotlin
fun getCountry(): String? {
    return person.company?.address?.country
}

//通过在可空的后面通过?:指定为null时返回的默认值
fun getCountry(): String {
    return person.company?.address?.country ?:""
}
```

### Kotlin中常用的拓展函数

| 函数 |返回值 |调用者角色|如何引用调用者|
|----|----|----|----|
|also	|调用者本身|	作为lambda参数	|it|
|apply	|调用者本身	|作为lambda接收者	|this|
|let	|lambda返回值|	作为lambda参数	|it|
|with	|lambda返回值|	作为lambda接收者|this|

#### apply的使用

```kotlin

//java
Intent intent = new Intent(this, Activity1.class);
intent.setAction("actionA");
Bundle bundle = new Bundle();
bundle.putString("content","hello");
bundle.putString("sender","taylor");
intent.putExtras(bundle);
startActivity(intent);

//kotlin
Intent(this,Activity1::class.java).apply {
    action = "actionA"
    putExtras(Bundle().apply {
        putString("content","hello")
        putString("sender","taylor")
    })
    startActivity(this)
}

```

#### also的使用

```kotlin
//java
String var2 = "testLet";
int var4 = var2.length();
System.out.println(var4);
System.out.println(var2);

//kotlin
val result = "testLet".also {
    println(it.length)
}
println(result)
```

#### with的使用

```kotlin
//java
@Override
public void onBindViewHolder(ViewHolder holder, int position) {

   ArticleSnippet item = getItem(position);
        if (item == null) {
            return;
        }
        holder.tvNewsTitle.setText(StringUtils.trimToEmpty(item.titleEn));
        holder.tvNewsSummary.setText(StringUtils.trimToEmpty(item.summary));
        String gradeInfo = "难度：" + item.gradeInfo;
        String wordCount = "单词数：" + item.length;
        String reviewNum = "读后感：" + item.numReviews;
        String extraInfo = gradeInfo + " | " + wordCount + " | " + reviewNum;
        holder.tvExtraInfo.setText(extraInfo);
        ...
}

//kotlin
override fun onBindViewHolder(holder: ViewHolder, position: Int){
   val item = getItem(position)?: return
   
   with(item){
      holder.tvNewsTitle.text = StringUtils.trimToEmpty(titleEn)
       holder.tvNewsSummary.text = StringUtils.trimToEmpty(summary)
       holder.tvExtraInf.text = "难度：$gradeInfo | 单词数：$length | 读后感: $numReviews"
       ...   
   
   }
}

```
#### let的使用

```kotlin
//java
if(mContext!=null){
    textView.setText(mContext.getString(R.string.app_name))
    ...
}

//kotlin
mContext?.let{
    textView.setText(it.getString(R.string.app_name))
}
```

### 数据集合的使用

#### `forEach()` 和 `forEachIndexed()` 循环遍历

```kotlin
    val list = mutableListOf<String>().apply{
    add("A")
    add("B")
    add("C")
    add("D")
    add("E")
    }
    //遍历
    list.forEach{print(it)}
    //遍历带角标
    list.forEachIndexed{content:String,index:Int -> print("$content $index")}

```

#### map() 在集合的每一个元素上应用一个自定义的变化

```kotlin

list.map {
            it.apply {
                name = name.replace(name.first(), name.first().toUpperCase())
            }
        }

```

#### filter() 只保留满足条件的集合元素

```
val reslutList = list.filter {it.length > 3}

```

#### toSet() 将集合元素去重

