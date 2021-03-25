---
title: Databinding点击事件的实现
cover: /cover/img27.jpg
toc: true
description: Databinding点击事件的几种实现方式
categories: Android
type: [Android]
date: 2018/04/06

---

## Databinding点击事件的几种实现方式
<!--more-->
代码片段

```
    //BaseActivity中
    public void click(View view){
    }
    
    public void click1(){
    }
    
    public void click2(int id){
    }
    
    //xml文件中
    <variable
        name="activity"
        type=".BaseActivity" />
    
    <variable
        name="user"
        type=".User" />
    

```

### 1、@{activity.click}
`click`函数带有参数

```
    <TextView
         android:layout_width="match_parent"
         android:layout_height="wrap_content"
         android:text="点击事件"
         android:onClick="@{activity.click}"
    />
```

### 2、@{()->activity.click()}
`click`函数无参数

```
    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="点击事件"
        android:onClick="@{()->activity.click1()}"
    />
```

### 3、@{activity::click}
`click`带参数

```
    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="点击事件"
        android:onClick="@{activity::click}"
    />
```

### 4、@{()->activity.click(user.id)}

```
    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="点击事件"
        android:onClick="@{()->activity.click2(user.id)}"
    />
```

### 5、@{()->activity.click(3)}
```
    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="点击事件"
        android:onClick="@{()->activity.click2(3)}"
    />
```

### 6、自定义View中DataBinding的点击事件



### 7、在RecyclerView中的item添加点击事件

```
    // 按钮点击
            holder.getBinding.getRoot().findViewById(R.id.btn_edit)
            .setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    // todo
                }
            });

```

## DataBinding赋值操作

方法一：





## Databinding特殊用法
```
    <CheckBox
        android:id="@+id/showName"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>
    <TextView
        android:text="@{user.firstName}"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:visibility="@{showName.checked ? View.VISIBLE :             View.GONE}"
        />

```

## 注意事项

**在Databinding使用的过程中，布局文件需要按照规范来写，类的报名应全部为小写，否则会报出错误**


## import androidx.databinding.DataBindingComponent 引入databinding出错

解决方法：https://www.javaer101.com/en/article/66119.html

```
1、Add lines android.enableExperimentalFeatureDatabinding=true and android.databinding.enableV2=false to gradle.properties
2、Sync project
3、Build -> Clean Project
4、Build -> Rebuild Project

```

但是加上去之后会显示，还需要进行删除,又出现了新的错误

```

Build file 'J:\SVN\PAD\Project\PadStation\flutter_module\.android\Flutter\build.gradle' line: 26

A problem occurred evaluating project ':flutter'.
> Failed to apply plugin [id 'com.android.internal.library']
   > The option 'android.enableExperimentalFeatureDatabinding' is deprecated.
     The current default is 'false'.
     It was removed in version 4.0 of the Android Gradle plugin.
     This property has no effect. The features plugin was removed in AGP 4.0.


```

多次尝试后，发现是由Flutter引起的，如果没有Flutter编译框则正常运行；过一段时间后又报红。

最后发现是在navigation中destination的id多用了一个 '+' 号

下面是正确写法

```xml
   <action
            android:id="@+id/action_title_to_electricity"
            app:destination="@id/goto_electricity_fragment" />

```

之前还有在 constraintlayout 的id多使用了 '+' 号，报出的也是Databinding的错；

注：'+' 引起Databinding出错也不一定是它的问题，可能是编译器的问题