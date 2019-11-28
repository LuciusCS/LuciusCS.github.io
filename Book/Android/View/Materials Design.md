 ## CoordinatorLayout
 CoordinatorLayout布局遵循Materials Design风格，可以实现各种控件之间的联动效果，在联动控件实现的过程中需要Behavior来协助。
 
 CoordinatorLayout是一个顶级父View，其子View包括FloatingActionButton、SnackBar
 
 **CoordinatorLayout+AppBarLayout+CollapsingToolbarLayout 需要结合起来使用**
 
 ## AppBarLayout
 
 AppBarLayout是LinearLayout的子类，必须在它的子View上设置app:layout_scrollFlags属性，或者在代码中调用setScrollFlags()设置这个属性。
 
 AppBarLayout有五种滚动标识：
 * scroll：所有想滚动出屏幕的view都要设置这个flag，否则view将会被固定在屏幕顶部
 * enterAlways：让任意向下的滚动都会导致该view变为可见
 * enterAlwaysCollapsed：假设定义minHeight同时定义enterAlways，view将会在达到最小高度时显示，直至展开玩。
 * exitUntilCollapsed：当定义minHeight，view在滚到最小布局时折叠
 * snap：当一个滚动事件结束，如果视图部分是可见的，那么它将滚动到收缩或展开
 
 ## CollapsingToolbarLayout
 CollapsingToolbarLayout作用是提供一个可以折叠的ToolBar，它继承自FrameLayout，
 
 ## Behavior
 
 Behavior只有是CoordinatorLayout的直接View才有意义，只要将Behavior绑定到CoordinatorLayout的直接子元素上，就能对触摸事件（touch event）、window inserts、layout以及嵌套滑动(nested scrolling)等动作进行拦截。Behavior不能直接发挥作用，必须绑定到CoordinatorLayout的子元素上。
 
 
# SnackBar
SnackBar是Material Design的一个组件，可以对用户的操作在屏幕低端提供一个轻量的操作提示。在SnackBar中可以添加Action,如：取消；SnackBar主要用于给用户相应提示，同时需要用户进行可选择的操作。

如：用户删除订单时，在屏幕下方显示“删除”、“取消”Action Button；

###SnackBar的使用方式
```

```


# Toast
Toast是在SnackBar之前就存在的操作提示，可以显示在APP的任意位置，


### SnackBar和Toast之间的对比

|不同|Toast|SnackBar|
|---|-----|-----|
|1|Toast从API1就存在|SnackBar在API23添加|
|2|不需要Activity，可以显示在Android Home或者其他应用才|只能显示在某一个Activity中|
|3|不能根据用户的操作执行Action|可以根据用户的操作执行Action|
|4|在用户滑动时不能消失|在用户滑动时可以消失| 