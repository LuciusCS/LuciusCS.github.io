



## Android 原生屏幕适配 xml适配

https://www.youtube.com/watch?v=5lSQcJjZPFs




支持不同分辨率的屏幕，以及竖屏和横屏切换，使用多个布局xml

主要使用 constraintlayout ， 使用各种比例来进行适配

```

<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <ImageView
        android:id="@+id/imageView"
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:scaleType="centerCrop"
        app:layout_constraintBottom_toTopOf="@+id/imageView2"
        app:layout_constraintDimensionRatio="1:1"
        app:layout_constraintEnd_toEndOf="@id/guideline2"
        app:layout_constraintHorizontal_bias="0.5"
        app:layout_constraintStart_toStartOf="@id/guideline"
        app:layout_constraintTop_toTopOf="parent"
        app:srcCompat="@drawable/kermit1" />

    <ImageView
        android:id="@+id/imageView2"
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:scaleType="centerCrop"
        app:layout_constraintBottom_toTopOf="@+id/imageView3"
        app:layout_constraintDimensionRatio="1:1"
        app:layout_constraintEnd_toEndOf="@id/guideline2"
        app:layout_constraintHorizontal_bias="0.5"
        app:layout_constraintStart_toStartOf="@id/guideline"
        app:layout_constraintTop_toBottomOf="@+id/imageView"
        app:srcCompat="@drawable/kermit2" />

    <ImageView
        android:id="@+id/imageView3"
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:scaleType="centerCrop"
        app:layout_constraintBottom_toTopOf="@+id/imageView4"
        app:layout_constraintDimensionRatio="1:1"
        app:layout_constraintEnd_toEndOf="@id/guideline2"
        app:layout_constraintHorizontal_bias="0.5"
        app:layout_constraintStart_toStartOf="@id/guideline"
        app:layout_constraintTop_toBottomOf="@+id/imageView2"
        app:srcCompat="@drawable/kermit3" />

    <ImageView
        android:id="@+id/imageView4"
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:scaleType="centerCrop"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintDimensionRatio="1:1"
        app:layout_constraintEnd_toEndOf="@id/guideline2"
        app:layout_constraintHorizontal_bias="0.5"
        app:layout_constraintStart_toStartOf="@id/guideline"
        app:layout_constraintTop_toBottomOf="@+id/imageView3"
        app:srcCompat="@drawable/kermit4" />

    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/guideline"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        app:layout_constraintGuide_percent="0.35" />

    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/guideline2"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        app:layout_constraintGuide_percent="0.65" />

</androidx.constraintlayout.widget.ConstraintLayout>

```


其他方案： 重要

今日头条方案：  https://mp.weixin.qq.com/s/d9QCoBP6kV9VSWvVldVVwA
基于系统将 dp 转换为 px 的公式 px = dp * density 来实现适配，通过在运行时动态修改 density 值的大小，使得修改后计算出的屏幕宽度就等于设计稿的宽度，从而使得在不同屏幕尺寸下我们都可以直接使用设计稿给出的 dp 值，且无需准备多套 dimens 文件。


```

    private static float sNoncompatDensity;
    private static float sNoncompatScaledDensity;

    private static void setCustomDensity(@NonNull Activity activity, @NonNull final Application application) {
        final DisplayMetrics appDisplayMetrics = application.getResources().getDisplayMetrics();
        if (sNoncompatDensity == 0) {
            sNoncompatDensity = appDisplayMetrics.density;
            sNoncompatScaledDensity=appDisplayMetrics.scaledDensity;
            application.registerComponentCallbacks(new ComponentCallbacks() {

                @Override
                public void onConfigurationChanged(Configuration newConfig) {
                    if (newConfig != null & newConfig.fontScale > 0) {
                        sNoncompatScaledDensity = application.getResources().getDisplayMetrics().scaledDensity;
                    }
                }

                @Override
                public void onLowMemory() {

                }
            });
            final float targetDensity = appDisplayMetrics.widthPixels / 360;
            final float targetScaledDensity = targetDensity * (sNoncompatScaledDensity / sNoncompatDensity);
            int targetDensityDpi = (int) (160 * targetDensity);
            appDisplayMetrics.density = targetDensity;
            appDisplayMetrics.scaledDensity = targetScaledDensity;
            appDisplayMetrics.densityDpi = targetDensityDpi;
            final DisplayMetrics activityDisplayNetrics = activity.getResources().getDisplayMetrics();
            activityDisplayNetrics.density = targetDensity;
            activityDisplayNetrics.scaledDensity = targetScaledDensity;
            activityDisplayNetrics.densityDpi = targetDensityDpi;
        }
    }

```


今日头条方案中，对于第三方组件的适配不友好，所以直接


https://github.com/JessYanCoding/AndroidAutoSize

https://juejin.cn/post/6844903681524006925


## Android jetpack compose 屏幕适配

Compose 默认的适配机制
再来看下 Jetpack Compose 默认是如何进行屏幕适配的
在 View 体系下，不管我们在布局文件中使用的是什么尺寸单位，最终系统在使用时都需要将其转换为 px，对应 TypedValue 的 applyDimension 方法。
例如，dp 值最终都需要通过 px = dp * density 公式来完成换算，这个规则对于 Jetpack Compose 也一样适用


根据以上线索，我们可以推断出 Jetpack Compose 目前采用的屏幕适配机制其实就和 Android 原生的 View 体系一样，都是以 屏幕像素密度 作为适配基础
这使得 Jetpack Compose 一样存在文章开头介绍的问题，在不同手机屏幕上的显示效果相比设计稿都会有一点点误差


想要满足此前提，对于 View 体系来说是很麻烦的，但对于 Jetpack Compose 来说，今日头条方案则真正成为了最优解：UI 还原度最高、无需生成多套 dimens 文件、作用范围自由可控、我甚至想不到会有什么缺点


使用 CompositionLocalProvider


重要适配

https://juejin.cn/post/7113953940282015758

https://www.dandroid.cn/21925


https://juejin.cn/post/7415723701948481577


## Flutter 屏幕适配

水平和竖直屏幕切换，使用不同的布局进行；

可获取屏幕尺寸，指定屏幕中控件的比例进行适配；

或者使用工具

```
  flutter_screenutil: ^5.9.3
```

https://juejin.cn/post/7041021257562718239


## Android适配其他方案

https://juejin.cn/post/7113953940282015758

在去年，我就已经写了一篇文章，详细地介绍了 Android 开发中目前处于主流或曾经主流的屏幕适配方案：一文读懂 Android 主流屏幕适配方案，一共介绍了三种适配方案：

今日头条方案
宽高限定符方案
smallestWidth 方案

三种方案的基本适配原理：

今日头条方案。基于系统将 dp 转换为 px 的公式 px = dp * density 来实现适配，通过在运行时动态修改 density 值的大小，使得修改后计算出的屏幕宽度就等于设计稿的宽度，从而使得在不同屏幕尺寸下我们都可以直接使用设计稿给出的 dp 值，且无需准备多套 dimens 文件
宽高限定符方案。通过穷举市面上所有 Android 手机的屏幕像素尺寸来实现适配，通过比例换算来为不同分辨率的屏幕分别准备一套 dimens 文件，应用在运行时再去引用和当前设备 完全匹配 的 dimens 文件，以此来实现屏幕适配
smallestWidth 方案。适配原理和宽高限定符方案一样，也是通过比例换算来为不同尺寸的屏幕分别准备一套 dimens 文件，应用在运行时再去引用和当前设备 最匹配 的 dimens 文件，以此来实现屏幕适配

作者：业志陈
链接：https://juejin.cn/post/7113953940282015758
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。