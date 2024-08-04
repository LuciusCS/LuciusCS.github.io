


重要链接

```
https://juejin.cn/post/7024043812188061703
```


关键代码

```
import 'dart:async';
import 'package:flutter/material.dart';

void main() {
  // 捕获 Flutter 框架的异常
  FlutterError.onError = (FlutterErrorDetails details) async {
    // 输出到控制台
    FlutterError.dumpErrorToConsole(details);
    // 转储到设备日志
    print('捕获到 Flutter 异常: ${details.exceptionAsString()}');
    print('堆栈信息: ${details.stack.toString()}');
    await _uploadError(details.exceptionAsString(), details.stack.toString());
  };

  // 捕获 Dart 异步代码的异常
  runZonedGuarded(() {
    runApp(MyApp());
  }, (Object error, StackTrace stack) async {
    // 转储到设备日志
    print('捕获到 Dart 异常: $error');
    print('堆栈信息: $stack');
    await _uploadError(error.toString(), stack.toString());
  });
}

Future<void> _uploadError(String error, String stackTrace) async {
  // 这里实现将错误信息上传到服务器的逻辑
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Error Handling Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Flutter Error Handling Demo'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            // 模拟一个异常
            throw Exception('模拟异常');
          },
          child: Text('抛出异常'),
        ),
      ),
    );
  }
}
```



Flutter需要捕捉的数据


···

页面渲染时间
页面帧率
页面打开次数
页面异常率
页面崩溃率


···


Flutter监测内容

1、崩溃率
2、UI卡顿
3、线上日志
4、网络监控