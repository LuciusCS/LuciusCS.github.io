



https://zhuanlan.zhihu.com/p/174124127

https://juejin.cn/post/6844904065881604109#heading-3

在Flutter中显示原生界面有两种方式，虚拟显示模式 (Virtual displays) 和混合集成模式 (Hybrid composition) 

https://flutter.cn/docs/development/platform-integration/platform-views


### 虚拟显示模式 (Virtual displays)

该种模式缺点明显，嵌入的原生界面，与触摸事件、文字输入和键盘焦点等方面存在很多诸多需要处理的问题

### 混合集成模式 (Hybrid composition) 



Hybrid composition 在 Android 10 以上的性能表现不错，在 10 以下的版本中，Flutter 界面在屏幕上呈现的速度会变慢，这个开销是因为 Flutter 帧需要与 Android 视图系统同步造成的。

为了缓解此问题，应该避免在 Dart 执行动画时显示原生控件，例如可以使用placeholder 来原生控件的屏幕截图，并在这些动画发生时直接使用这个 placeholder。





### Android原生项目引入Flutter
http://www.flutterj.com/?post=171