


### KTX拓展包


`Android KTX` 是包含在 `Android Jetpack` 及其他 Android 库中的一组 Kotlin 扩展程序。KTX 扩展程序可以为 Jetpack、Android 平台及其他 API 提供简洁而惯用的 Kotlin代码。

#### Uri对象创建

```kotlin
    //Kotlin创建一个Uri对象
    var s = "https://www.google.com"
     var uri = Uri.parse(s)

    //使用Android KTX + Kotlin之后
    var s = "https://www.google.com".toUri()

```

#### SharedPreferences使用

```
 //kotlin
 sharedPreferences.edit().putBoolean(key, value).apply()

 //Kotlin + Android KTX
 sharedPreferences.edit { 
    putBoolean(key, value) 
 }
```

#### View的显示与隐藏

```
//kotlin
view1.visibility = View.VISIBLE
view2.visibility = View.GONE

//Kotlin + Android KTX
view1.isVisible = true
view2.isVisible = false


```


#### Fragment事务
```
    //kotlin
supportFragmentManager
    .beginTransaction()
    .add(R.id.content,Fragment1())
    .commit()

    //Kotlin + Android KTX
supportFragmentManager.commit {
    add<Fragment1>(R.id.content)
}

```

### ViewModel 声明

```
//kotlin
//共享范围activity
val mViewMode1l = ViewModelProvider(requireActivity()).get(UpdateAppViewModel::class.java)
//共享范围fragment 内部
val mViewMode1l = ViewModelProvider(this).get(UpdateAppViewModel::class.java)


//Kotlin + Android KTX
//共享范围activity
private val mViewModel by activityViewModels<MyViewModel>()
//共享范围fragment 内部
private val mViewModel by viewModel<MyViewModel>()

```


更多Android KTX资料  https://developer.android.google.cn/kotlin/ktx
