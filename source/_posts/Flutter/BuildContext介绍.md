

### BuildContext源码


```dart

abstract class BuildContext {
  /// The current configuration of the [Element] that is this [BuildContext].
  Widget get widget;

  /// The [BuildOwner] for this context. The [BuildOwner] is in charge of
  /// managing the rendering pipeline for this context.
  BuildOwner get owner;

}

```

BuildContext是一个抽象类


### Flutter构建视图的过程

在Flutter中一切都是Widget,通过构建Widget来编写UI界面，实际上，Widget并不是真正要显示在屏幕上的东西，只是一个配置信息，它永远都是immutable的，并且可以在多处重复使用。真正在屏幕上使用的是Element Tree ！