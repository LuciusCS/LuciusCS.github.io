


# 在Android Studio 中使用Flutter


http://liweijia.site/archives/2132


Android原生页面跳转Flutter页面

基本思路就是将Flutter编写的页面嵌入到Activity中，官方提供了两种方式：通过FlutterView和FlutterFragment，下面我们分别看一下这两种方式是如何实现的。
1.使用FlutterView
首先新建一个Activity，命名为FlutterPageActivity（名称随意起），在onCreate()方法中添加以下代码：


```
@Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // 通过FlutterView引入Flutter编写的页面
    View flutterView = Flutter.createView(this, getLifecycle(), "route1");
    FrameLayout.LayoutParams layout = new FrameLayout.LayoutParams(600, 800);
    layout.leftMargin = 100;
    layout.topMargin = 200;
    addContentView(flutterView, layout);
}

```

Flutter.createView()方法返回的是一个FlutterView，它继承自View，我们可以把它当做一个普通的View，调用addContentView()方法将这个View添加到Activity的contentView中。我们注意到Flutter.createView()方法的第三个参数传入了”route1″字符串，表示路由名称，它确定了Flutter中要显示的Widget，接下来需要在之前创建好的Flutter Module中编写逻辑了，修改main.dart文件中的代码：

```
import 'dart:ui';
import 'package:flutter/material.dart';

void main() => runApp(_widgetForRoute(window.defaultRouteName));

Widget _widgetForRoute(String route) {
  switch (route) {
    case 'route1':
      return MaterialApp(
        home: Scaffold(
          appBar: AppBar(
            title: Text('Flutter页面'),
          ),
          body: Center(
            child: Text('Flutter页面，route=$route'),
          ),
        ),
      );
    default:
      return Center(
        child: Text('Unknown route: $route', textDirection: TextDirection.ltr),
      );
  }
}

```

在runApp()方法中通过window.defaultRouteName可以获取到我们在Flutter.createView()方法中传入的路由名称，即”route1″，之后编写了一个_widgetForRoute()方法，根据传入的route字符串显示相应的Widget。
最后在MainActivity中添加一个Button，编写点击事件，点击Button跳转到FlutterPageActivity。

```
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    Button btnJumpToFlutter = findViewById(R.id.btn_jump_to_flutter);
    btnJumpToFlutter.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Intent intent = new Intent(MainActivity.this, FlutterPageActivity.class);
            startActivity(intent);
        }
    });

```