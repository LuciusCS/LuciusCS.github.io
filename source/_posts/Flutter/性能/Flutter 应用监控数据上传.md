






无法使用 try-catch 去捕获一个异步调用所抛出的异常的。
同步的 try-catch 和异步的 catchError，为我们提供了直接捕获特定异常的能力，而如果我们想集中管理代码中的所有异常，Flutter 也提供了 Zone.runZoned 方法。


我们可以给代码执行对象指定一个 Zone，在 Dart 中，Zone 表示一个代码执行的环境范围，其概念类似沙盒，不同沙盒之间是互相隔离的。如果我们想要观察沙盒中代码执行出现的异常，沙盒提供了 onError 回调函数，拦截那些在代码执行对象中的未捕获异常。
在下面的代码中，我们将可能抛出异常的语句放置在了 Zone 里。可以看到，在没有使用 try-catch 和 catchError 的情况下，无论是同步异常还是异步异常，都可以通过 Zone 直接捕获到：


```
runZoned(() {
  // 同步抛出异常
  throw StateError('This is a Dart exception.');
}, onError: (dynamic e, StackTrace stack) {
  print('Sync error caught by zone');
});
 
runZoned(() {
  // 异步抛出异常
  Future.delayed(Duration(seconds: 1))
      .then((e) => throw StateError('This is a Dart exception in Future.'));
}, onError: (dynamic e, StackTrace stack) {
  print('Async error aught by zone');
});

```



衡量线上 Flutter 应用整体质量的指标，可以分为以下 3 类：
页面异常率；
页面帧率；
页面加载时长。

https://www.kancloud.cn/alex_wsc/flutter_demo/1572030

### 页面异常率

页面异常率指的是，页面渲染过程中出现异常的概率。它度量的是页面维度下功能不可用的情况，其统计公式为：页面异常率 = 异常发生次数 / 整体页面 PV 数。



### 页面帧率

页面帧率，即 FPS，是图像领域中的定义，指的是画面每秒传输帧数。由于人眼的视觉暂留特质，当所见到的画面传输帧数高于一定数量的时候，就会认为是连贯性的视觉效果。因此，对于动态页面而言，每秒钟展示的帧数越多，画面就越流畅。


 FPS 计算公式最终确定为：FPS=60* 实际渲染的帧数 / 本来应该在这个时间内渲染完成的帧数。


 ```
import 'dart:ui';
 
var orginalCallback;
 
void main() {
  runApp(MyApp());
  // 设置帧回调函数并保存原始帧回调函数
  orginalCallback = window.onReportTimings;
  window.onReportTimings = onReportTimings;
}
 
// 仅缓存最近 25 帧绘制耗时
const maxframes = 25;
final lastFrames = List<FrameTiming>();
// 基准 VSync 信号周期
const frameInterval = const Duration(microseconds: Duration.microsecondsPerSecond ~/ 60);
 
void onReportTimings(List<FrameTiming> timings) {
  lastFrames.addAll(timings);
  // 仅保留 25 帧
  if(lastFrames.length > maxframes) {
    lastFrames.removeRange(0, lastFrames.length - maxframes);
  }
  // 如果有原始帧回调函数，则执行
  if (orginalCallback != null) {
    orginalCallback(timings);
  }
}
 
double get fps {
  int sum = 0;
  for (FrameTiming timing in lastFrames) {
    // 计算渲染耗时
    int duration = timing.timestampInMicroseconds(FramePhase.rasterFinish) - timing.timestampInMicroseconds(FramePhase.buildStart);
    // 判断耗时是否在 Vsync 信号周期内
    if(duration < frameInterval.inMicroseconds) {
      sum += 1;
    } else {
      // 有丢帧，向上取整
      int count = (duration/frameInterval.inMicroseconds).ceil();
      sum += count;
    }
  }
  return lastFrames.length/sum * 60;
}

 ```


 ### 页面加载时长


 ```
class MyHomePage extends StatefulWidget {
  int startTime;
  int endTime;
  MyHomePage({Key key}) : super(key: key) {
    // 页面初始化时记录启动时间
    startTime = DateTime.now().millisecondsSinceEpoch;
  }
  @override
  _MyHomePageState createState() => _MyHomePageState();
}
 
class _MyHomePageState extends State<MyHomePage> {
  @override
  void initState() {
    super.initState();
    // 通过帧绘制回调获取渲染完成时间
    WidgetsBinding.instance.addPostFrameCallback((_) {
      widget.endTime = DateTime.now().millisecondsSinceEpoch;
      int timeSpend = widget.endTime - widget.startTime;
      print("Page render time:${timeSpend} ms");
    });
  }
  ...
}

 ```