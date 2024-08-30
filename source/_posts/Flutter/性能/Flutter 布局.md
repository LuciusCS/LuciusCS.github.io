


Flutter 提出了与布局边界对应的机制——重绘边界（Repaint Boundary）



重绘边界的一个典型场景是 Scrollview。ScrollView 滚动的时候需要刷新视图内容，从而触发内容重绘。而当滚动内容重绘时，一般情况下其他内容是不需要重绘的，这时候重绘边界就派上用场了。




在 CustomScrollView 中，这些彼此独立的、可滚动的 Widget 被统称为 Sliver。

视差滚动



与 Android、iOS 开发类似，Flutter 也遵循了基于像素密度的管理方式，如 1.0x、2.0x、3.0x 或其他任意倍数，Flutter 可以根据当前设备分辨率加载最接近设备像素比例的图片资源。而为了让 Flutter 更好地识别，我们的资源目录应该将 1.0x、2.0x 与 3.0x 的图片资源分开管理。
以 background.jpg 图片为例，这张图片位于 assets 目录下。如果想让 Flutter 适配不同的分辨率，我们需要将其他分辨率的图片放到对应的分辨率子目录中，如下所示：
rootBundle.loadString('assets/result.json').then((msg)=>print(msg));
assets
├── background.jpg    //1.0x 图
├── 2.0x
│   └── background.jpg  //2.0x 图
└── 3.0x
    └── background.jpg  //3.0x 图
而在 pubspec.yaml 文件声明这个图片资源时，仅声明 1.0x 图资源即可：
flutter:
  assets:
    - assets/background.jpg   #1.0x 图资源
1.0x 分辨率的图片是资源标识符，而 Flutter 则会根据实际屏幕像素比例加载相应分辨率的图片。这时，如果主资源缺少某个分辨率资源，Flutter 会在剩余的分辨率资源中选择最低的分辨率资源去加载




字体则是另外一类较为常用的资源。手机操作系统一般只有默认的几种字体，在大部分情况下可以满足我们的正常需求。但是，在一些特殊的情况下，我们可能需要使用自定义字体来提升视觉体验。
在 Flutter 中，使用自定义字体同样需要在 pubspec.yaml 文件中提前声明。需要注意的是，字体实际上是字符图形的映射。所以，除了正常字体文件外，如果你的应用需要支持粗体和斜体，同样也需要有对应的粗体和斜体字体文件。
在将 RobotoCondensed 字体摆放至 assets 目录下的 fonts 子目录后，下面的代码演示了如何将支持斜体与粗体的 RobotoCondensed 字体加到我们的应用中：
fonts:
  - family: RobotoCondensed  # 字体名字
    fonts:
      - asset: assets/fonts/RobotoCondensed-Regular.ttf # 普通字体
      - asset: assets/fonts/RobotoCondensed-Italic.ttf 
        style: italic  # 斜体
      - asset: assets/fonts/RobotoCondensed-Bold.ttf 
        weight: 700  # 粗体
这些声明其实都对应着 TextStyle 中的样式属性，如字体名 family 对应着 fontFamily 属性、斜体 italic 与正常 normal 对应着 style 属性、字体粗细 weight 对应着 fontWeight 属性等。在使用时，我们只需要在 TextStyle 中指定对应的字体即可：
Text("This is RobotoCondensed", style: TextStyle(
    fontFamily: 'RobotoCondensed',// 普通字体
));
Text("This is RobotoCondensed", style: TextStyle(
    fontFamily: 'RobotoCondensed',
    fontWeight: FontWeight.w700, // 粗体
));
Text("This is RobotoCondensed italic", style: TextStyle(
  fontFamily: 'RobotoCondensed',
  fontStyle: FontStyle.italic, // 斜体
));



对于包，我们通常是指定版本区间，而很少直接指定特定版本，因为包升级变化很频繁，如果有其他的包直接或间接依赖这个包的其他版本时，就会经常发生冲突。
而对于运行环境，如果是团队多人协作的工程，建议将 Dart 与 Flutter 的 SDK 环境写死，统一团队的开发环境，避免因为跨 SDK 版本出现的 API 差异进而导致工程问题。
比如，在上面的示例中，我们可以将 Dart SDK 写死为 2.3.0，Flutter SDK 写死为 1.2.1。
environment:
  sdk: 2.3.0
  flutter: 1.2.1




  手势操作在 Flutter 中分为两类：
第一类是原始的指针事件（Pointer Event），即原生开发中常见的触摸事件，表示屏幕上触摸（或鼠标、手写笔）行为触发的位移行为；
第二类则是手势识别（Gesture Detector），表示多个原始指针事件的组合操作，如点击、双击、长按等，是指针事件的语义化封装。



```
class _AnimateAppState extends State<AnimateApp> with SingleTickerProviderStateMixin {
  AnimationController controller;
  Animation<double> animation;
  @override
  void initState() {
    super.initState();
    // 创建动画周期为 1 秒的 AnimationController 对象
    controller = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 1000));
    // 创建从 50 到 200 线性变化的 Animation 对象
    animation = Tween(begin: 50.0, end: 200.0).animate(controller)
      ..addListener(() {
        setState(() {}); // 刷新界面
      });
    controller.forward(); // 启动动画
  }
...
}

```


需要注意的是，我们在创建 AnimationController 的时候，设置了一个 vsync 属性。这个属性是用来防止出现不可见动画的。vsync 对象会把动画绑定到一个 Widget，当 Widget 不显示时，动画将会暂停，当 Widget 再次显示时，动画会重新恢复执行，这样就可以避免动画的组件不在当前屏幕时白白消耗资源。



现在的问题是，这些动画只能执行一次。如果想让它像心跳一样执行，有两个办法：
在启动动画时，使用 repeat(reverse: true)，让动画来回重复执行。
监听动画状态。在动画结束时，反向执行；在动画反向执行完毕时，重新启动执行。

```
// 以下两段语句等价
// 第一段
controller.repeat(reverse: true);// 让动画重复执行
 
// 第二段
animation.addStatusListener((status) {
    if (status == AnimationStatus.completed) {
      controller.reverse();// 动画结束时反向执行
    } else if (status == AnimationStatus.dismissed) {
      controller.forward();// 动画反向执行完毕时，重新执行
    }
});
controller.forward();// 启动动画

```