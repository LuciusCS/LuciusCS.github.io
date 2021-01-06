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






