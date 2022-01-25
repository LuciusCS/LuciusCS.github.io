




### 常用概念的说明

PPI（Pixels Per Inch）即像素密度，指每英寸包含的物理像素的数量。ppi 是设备在物理上的属性值，取决于屏幕自身


DPI（Dots Per Inch）原先用于在印刷行业中描述每英寸包含有多少个点，在 Android 开发中则用来描述屏幕像素密度。屏幕像素密度决定了在软件概念上单位距离对应的像素总数，是手机在出厂时就会被写入系统配置文件中的一个属性值，一般情况下用户是无法修改该值的，但在开发者模式中有修改该值的入口，是软件上一个可以修改的值，可以通过DisplayMetrics 来获取。

计算公式为：px = dp * (dpi / 160)

```
val displayMetrics = applicationContext.resources.displayMetrics
Log.e("TAG", "densityDpi: " + displayMetrics.densityDpi)
Log.e("TAG", "density: " + displayMetrics.density)
Log.e("TAG", "widthPixels: " + displayMetrics.widthPixels)
Log.e("TAG", "heightPixels: " + displayMetrics.heightPixels)


```
输出为

```
TAG: densityDpi: 480     //表示屏幕像素密度为 480dpi
TAG: density: 3.0        //说明该设备下 1dp等于 3px1
TAG: widthPixels: 1080    //屏幕宽度为1080px=360dp
TAG: heightPixels: 2259   //屏幕高度为2259px=753dp
```



### 采用传统的dp适配的方式

Google 官方推荐开发者尽量使用 dp 作为单位值，因为系统会根据屏幕的实际情况自动完成 dp 与 px 之间的对应换算；dp指的是设备独立像素，以dp为尺寸单位的控件，在不同分辨率和尺寸的手机上代表了不同的真实像素，比如在分辨率较低的手机中，可能1dp=1px,而在分辨率较高的手机中，可能1dp=2px，这样的话，一个96*96dp的控件，在不同的手机中就能表现出差不多的大小了。

将屏幕密度为160dpi的中密度设备屏幕作为基准屏幕，在这个屏幕中，1dp=1px。其他屏幕密度的设备按照比例换算，具体如下表：

[图片]{}

dp转px、px转dp：

```
public class Dp2Px {
    //说明：0.5 是为了避免损失精度。
    public static int dp2px(Context context, int dp) {
        return (int) (dp * context.getResources().getDisplayMetrics().density + 0.5);
    }

    public static int px2dp(Context context, int px) {
        return (int) (px / context.getResources().getDisplayMetrics().density + 0.5);
    }
}

```


不同屏幕像素密度的设备就对应了不同的配置限定符。例如，在 320 到 480 dpi 之间的设备就对应 xxhdpi，该类型设备在取图片时就会优先从 drawable-xxhdpi 文件夹下取

[图片]{}


在layout之外，根据不同分辨率，创建不同的布局文件夹：

* layout-800 * 480
* layout-1280 * 720
手机会根据分辨率去找设定的不同大小的layout的布局。实际开发中这种使用的情况非常少，因为占用太多资源，慎用。


开发者主要关注设计稿的两个方面：

* 开发效率上：在声明宽高值时，能够直接套用设计稿上给出来的尺寸值，这个尺寸值映射到项目中可能是对应一个具体的值，也可能是对应多套 dimens 文件中的值，在开发阶段无需手动计算。

* 适配结果：适配后的界面最终在不同屏幕上的空间比例都能保持一致。




 假设设计师给出来的设计稿是按照 1080 x 1920 px，420 dpi 的标准来进行设计的，那么设计稿的宽高即 411 x 731 dp，那对于一个希望占据屏幕一半宽度的 ImageView 来说，在设计稿中的宽即 205.5 dp
那么，对于一台 1440 x 2880 px，560 dpi 的真机来说，其宽高即 411 x 822 dp，此时我们在布局文件中就可以直接使用设计稿中给出来的宽度值，使得 ImageView 在这台真机上也占据了屏幕一半宽度。虽然设计稿和真机的屏幕像素并不相同，但由于屏幕像素密度的存在，使得两者的 dp 宽度是一样的，从而令开发者可以只使用同一套 dp 尺寸值就完成设计要求了。


 dp 只适用于大部分正常情况了。1440  / 1080 = 560 / 420 = 1.3333，设计稿和真机的 px 长宽比例和 dp 长宽比例相同刚好适配，此时使用 dp 才能刚好适用。

如果设计稿的 px 长宽比例和 dp长宽比例不同则不能适配。

华为 nova5：1080 x 2259 px，480 dpi，屏幕宽度为 1080 / (480 / 160) = 360 dp
三星 Galaxy S10：1080 x 2137 px，420 dpi，屏幕宽度为 1080 / (420 / 160) = 411 dp

在像素宽度相同的情况下，不同手机的像素密度是有可能不一样的。手机厂家有可能是根据屏幕像素和屏幕尺寸来共同决定该值的大小，但不管怎样，这就造成了应用的实际效果与设计稿之间无法对应的情况：对于一个 180 dp 宽度的 View 来说，在华为 nova5 上能占据一半的屏幕宽度，但在三星 Galaxy S10 上却只有 180 / 411 = 0.43，这就造成了一定偏差
以上情况就是直接使用 dp 值无法解决的问题，使用 dp 只能适配大部分宽高比例比较常规的机型。



### 适配方案

#### 今日头条适配方案

源码 https://github.com/JessYanCoding/AndroidAutoSize

其适配思路基于以下几条换算公式：

* px = density * dp
* density = dpi / 160
* px = dp * (dpi / 160)

在布局文件中声明的 dp 值，最终都需要通过 TypedValue 的 applyDimension 方法来转换为 px，转换公式即：density * dp

```
    public static float applyDimension(int unit, float value, DisplayMetrics metrics) {
        switch (unit) {
        case COMPLEX_UNIT_PX:
            return value;
        case COMPLEX_UNIT_DIP:
            return value * metrics.density;
        case COMPLEX_UNIT_SP:
            return value * metrics.scaledDensity;
        case COMPLEX_UNIT_PT:
            return value * metrics.xdpi * (1.0f/72);
        case COMPLEX_UNIT_IN:
            return value * metrics.xdpi;
        case COMPLEX_UNIT_MM:
            return value * metrics.xdpi * (1.0f/25.4f);
        }
        return 0;
    }

```

如果我们能够动态修改 density 值的大小，要求修改后计算出的屏幕宽度就等于设计稿的宽度，就可以在布局文件中直接使用设计稿给出的各个 dp 宽高值，且使得 View 在不同手机屏幕上都能占据同样的比例.


假设设计师给出来的设计稿是按照 **1080 x 1920 px，density 2.625，420 dpi ** 的标准来进行设计的，设计稿的宽高即 411 x 731 dp。那么对于一个宽度为 100 dp 的 View，占据设计稿的宽度比例是：100 * 2.625 / 1080 = 0.2430

用以下两台真机的数据为例，在适配前：

* 华为 nova5：1080 x 2259 px，480 dpi。正常情况下其 density 为 3，View 占据的屏幕宽度比例是：100 x 3 / 1080 = 0.2777
* Pixel 2 XL：1440 x 2800 px，560 dpi。正常情况下其 density 为 3.5，View 占据的屏幕宽度比例是：100 x 3.5 / 1440 = 0.2430

采用字节跳动技术团队的方案动态改变 density 进行适配，适配后的 density = 设备真实宽度(单位 px)  / 设计稿的宽度（单位 dp）：

* 华为 nova5：适配后 density 变成 1080 / 411 = 2.6277，View 占据的屏幕宽度比例是：100 x 2.6277 / 1080 = 0.2433
* Pixel 2 XL：适配后 density 变成 1440 / 411 = 3.5036，View 占据的屏幕宽度比例是：100 x 3.5036 / 1440 = 0.2433

可以看出来，虽然由于除法运算会导致一点点精度丢失，但完全可以忽略不计，只要我们能动态改变手机的 density，最终 View 在宽度上就都能保持和设计稿完全相同的比例了

实际上 density 只是 DisplayMetrics 类中的一个 public 变量，不涉及任何私有 API，修改后理论上也不会影响到应用的稳定性。因此，只要我们在 Activity 的 onCreate 方法中完成对 density 和 densityDpi 的修改，我们就可以在布局文件中直接使用设计稿给出的 dp 值，不用准备多套 dimens 就能完成适配，十分简洁

```
 fun setCustomDensity(activity: Activity, application: Application, designWidthDp: Int) {
        val appDisplayMetrics = application.resources.displayMetrics
        val targetDensity = 1.0f * appDisplayMetrics.widthPixels / designWidthDp
        val targetDensityDpi = (targetDensity * 160).toInt()
        appDisplayMetrics.density = targetDensity
        appDisplayMetrics.densityDpi = targetDensityDpi
        val activityDisplayMetrics = activity.resources.displayMetrics
        activityDisplayMetrics.density = targetDensity
        activityDisplayMetrics.densityDpi = targetDensityDpi
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        setCustomDensity(this, application, 420)
        super.onCreate(savedInstanceState)
    }


```




#### 宽度限定符方案

宽高限定符是系统原生支持的一种适配方案，通过穷举市面上所有 Android 手机的屏幕像素尺寸来实现适配。实现思路很简单，就是通过比例换算来为不同分辨率的屏幕分别生成一套 dimens 文件
首先，以设计稿的尺寸作为基准分辨率，假设设计稿是 1920 x 1080 px，那么就可以先生成默认的 dimens 文件，生成规则：

* 将屏幕宽度均分为 1080 份，每份 1 px，声明 1080 个 key 值，值从 1 px 开始递增，每次递增 1 px
* 将屏幕高度均分为 1920 份，每份 1 px，声明 1920 个 key 值，值从 1 px 开始递增，每次递增 1 px

最终 dimens 文件就像以下这样：

```
<resources>
	<dimen name="x1">1px</dimen>
	<dimen name="x2">2px</dimen>
	···
	<dimen name="x1080">1080px</dimen>

	<dimen name="y1">1px</dimen>
	<dimen name="y2">2px</dimen>
	···
	<dimen name="y1920">1920px</dimen>
</resources>



```

类似地，再来为屏幕尺寸为 1440 x 720 px 的手机生成专属的 dimens 文件，生成规则：

将屏幕宽度均分为 1080 份，每份 720 / 1080 = 0.666 px，声明 1080 个 key 值，值从 0.666 px 开始递增，每次递增 0.666 px
将屏幕高度均分为 1920 份，每份 1440 / 1920 =  0.75 px，声明 1920 个 key 值，值从 0.75 px 开始递增，每次递增 0.75 px

最终 dimens 文件就像以下这样：

```
<resources>
	<dimen name="x1">0.666px</dimen>
	<dimen name="x2">1.332px</dimen>
	···
	<dimen name="x1080">720px</dimen>

	<dimen name="y1">0.75px</dimen>
	<dimen name="y2">1.5px</dimen>
	···
	<dimen name="y1920">1440px</dimen>
</resources>
```
最终，为市面上主流的屏幕尺寸均按照如上规则生成一套专属的 dimens 文件，每套文件均放到以像素尺寸进行命名的 value 文件夹下，就像以下这样：

```
values
values-1440x720
values-1920x1080
values-2400x1080
values-2408x1080
values-2560x1440

```


之后，我们就可以直接套用设计稿中的像素尺寸进行开发了，设计稿写的是 100 x 200 px，那么我们在布局文件中就可以直接引用 x100 和 y200。当应用运行在不同分辨率的手机中时，应用会自动去引用相同分辨率的 dimens 文件，此时引用到的实际 px 值具有和设计稿相同的比例大小，这样就实现了适配需求了
需要注意，宽高限定符方案有一个致命缺陷：需要精准命中分辨率才能实现适配。比如 1920 x 1080 px 的手机就一定要引用到 values-1920x1080文件夹内的 dimens 文件，否则就只能去引用默认的 values 文件夹，此时引用到的尺寸值就有可能和实际需求有很大出入，从而导致界面变形。而对于市面上层出不穷的各种分辨率，开发者想穷举完其实很麻烦，所以说，宽高限定符方案的容错率很低


#### smallestWidth 适配方案


smallestWidth 也是系统原生支持的一种适配方案。smallestWidth 即最小宽度，指的是最短的那一个边长，而不考虑屏幕的方向，适配原理和宽高限定符方案一样，本质上都是通过比例换算来为不同尺寸的屏幕分别准备一套 dimens 文件，应用在运行时再去引用相匹配的 dimens 文件，以此来实现屏幕适配
首先，我们要以设计稿的尺寸作为基准分辨率，假设设计师给出来的设计稿是按照 **1080 x 1920 px **的标准来进行设计的，那么基准分辨率就是设计稿的宽度 1080 px
先为宽度为 360 dp 的设备生成 dimens 文件，生成规则：

将 360 dp 均分为 1080 份，每份 360 / 1080 dp，声明 1080 个 key 值，值从 360 / 1080 dp 开始递增，每次递增 360 / 1080 dp

最终 dimens 文件就像以下这样：

```
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <dimen name="DIMEN_1PX">0.33dp</dimen>
    <dimen name="DIMEN_2PX">0.67dp</dimen>
    ···
    <dimen name="DIMEN_1078PX">359.33dp</dimen>
    <dimen name="DIMEN_1079PX">359.67dp</dimen>
    <dimen name="DIMEN_1080PX">360.00dp</dimen>
</resources>



```

类似地，我们再按照上述规则为宽度为 380 dp 的设备生成 dimens 文件：

```
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <dimen name="DIMEN_1PX">0.35dp</dimen>
    <dimen name="DIMEN_2PX">0.70dp</dimen>
    ···
    <dimen name="DIMEN_1078PX">379.30dp</dimen>
    <dimen name="DIMEN_1079PX">379.65dp</dimen>
    <dimen name="DIMEN_1080PX">380.00dp</dimen>
</resources>

```

最终，为市面上主流的屏幕宽度均按照如上规则生成一套专属的 dimens 文件，每套文件均放到以宽度进行命名的 value 文件夹内，就像以下这样：

```

values
values-sw360dp
values-sw380dp
values-sw400dp
values-sw420dp
```

这样，我们就可以直接在布局文件中套用设计稿的 px 值了，应用在运行时就会自动去匹配最符合当前屏幕宽度的资源文件。例如，如果我们引用了 DIMEN_1080PX，那么不管是在宽度为 360 dp 还是 380 dp 的设备中，该引用对应的 dp 值都是刚好占满屏幕宽度，这样就实现了适配需求了
smallestWidth 方案和宽高限定符方案最大的差别就在于容错率，smallestWidth 方案具有很高的容错率，即使应用中没有找到符合当前屏幕宽度的 dimens 文件，应用也会向下寻找并采用最接近当前屏幕宽度的 dimens 文件，只有都找不到时才会去引用默认的 dimens 文件。只要我们准备的 dimens 足够多，且每套 dimens 文件以 5 ~ 10 dp 作为步长递增，那么就能够很好地满足市面上的绝大部分手机了。此外，我们不仅可以使用设计稿的 px 宽度作为基准分辨率，也可以改为使用 dp 宽度，计算规则还是保持一致





适配方案比较

* 今日头条方案。优点：可以直接使用设计稿中的 dp 值，无需生成多套 dimens 文件进行映射，因此不会增大 apk 体积。此外，此方案的 UI 还原度在三种方案中应该是最高的了，其它两种方案都需要精准命中屏幕尺寸后才能达到此方案的还原度。缺点：由于此方案会影响到应用全局，因此如果我们引入了一些第三方库的话，三方库中的界面也会随之被影响到，可能会造成效果变形，此时就需要进行额外处理了
* 宽高限定符方案。容错率太低，且需要准备很多套 dimens 文件，在 Android 刚兴起，屏幕类型还比较少的时候比较吃香，目前应该已经很少有项目采用此方案了，读者可以直接忽略
* smallestWidth 方案。优点：容错率高，在 320 ~ 460 dp 之间每 10 dp 就提供一套 dimens 文件就足够使用了，想要囊括更多设备的话也可以再缩短步长，基本不用担心最终效果会与设计稿相差太多，且此方案不会影响到三方库。缺点：需要生成多套 dimens 文件，增大了 apk 体积


以上三种方案其实都存在一个问题：我们只能实现对单个方向的适配，无法同时兼顾宽高。之所以只能单个方向，是因为当前手机屏幕的宽高比并不是按照一个固定的比例进行递增的，4 : 3、16 : 9、甚至其它宽高比都有，这种背景下我们要达到百分百还原设计稿是不现实的，我们只能选择一个维度来进行适配。幸运的是大部分情况下我们也只需要根据屏幕宽度来进行适配，以上方案已经能够满足我们绝大多数时候的开发需求了。对于少部分需要根据高度进行适配的页面，今日头条方案可以很灵活的进行切换，smallestWidth 方案就比较麻烦了，此时可以通过 ConstraintLayout 来精准按比例控制控件的宽高大小或者是位置，同样也能达到适配要求




### 


参考资料：
https://juejin.cn/post/6999445137491230728
https://developer.android.com/training/multiscreen/screendensities?hl=zh-cn
https://juejin.cn/post/6844903838801985550
https://mp.weixin.qq.com/s/X-aL2vb4uEhqnLzU5wjc4Q
https://mp.weixin.qq.com/s?__biz=MzI1MzYzMjE0MQ==&mid=2247484502&idx=2&sn=a60ea223de4171dd2022bc2c71e09351&scene=21#wechat_redirect

https://blog.csdn.net/lmj623565791/article/details/45460089

https://blog.csdn.net/wq6ylg08/article/details/115558322


https://mp.weixin.qq.com/s/X-aL2vb4uEhqnLzU5wjc4Q  重要重看


https://www.jianshu.com/p/00af3fdf0472  重要重看