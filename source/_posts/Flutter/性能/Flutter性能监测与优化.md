




Flutter 性能监测 Android Studio自身监测



滴滴监测工具

https://xingyun.xiaojukeji.com/docs/dokit/#/flutterGuide

https://github.com/didi/DoKit



滴滴booster https://github.com/didi/booster  可以使用


https://juejin.cn/post/7007997663190712350

Sentry服务器 和 Bugly方案



Crash上报

消耗性指标：

流量
电量
CPU
启动时间

应用启动时间
页面启动时间
应用状态

FPS/卡顿/ANR
内存泄露/内存状态侦测






应用程序性能监控会跟踪哪些指标？

应用程序性能监控（APM）会跟踪常见指标，如下所示。

CPU利用率

APM 解决方案可以监控 CPU 指标，如 CPU 利用率和内存需求。它能够确保您的应用程序获得正常运行所需的计算资源。

响应时间

响应时间对于企业来说很重要，因为您的用户希望能够无延迟地访问服务。APM 解决方案根据可接受的响应时间基准性能进行度量，并在响应时间低于阈值时向您发出警报。

错误率

APM 软件会监控应用程序，以记录并报告错误率。一个这类错误的例子比如，Web 查询超时或数据库查询失败。当错误率超过预定义参数时，APM 将发出警报——例如，当最近 50 个请求中有 5% 导致错误时。

交易跟踪

APM 中的交易跟踪为您提供了在应用程序中执行的单个事务的准确情况。在交易跟踪中捕获的信息包括可用的函数调用、外部调用和数据库调用。它会自始至终监控交易请求。

实例

APM 解决方案可以监控和报告您的应用程序所运行的服务器或应用程序实例的数量。它可以提醒您扩大或缩小以满足用户需求。

请求

APM 软件会监控您的应用程序接收到用户请求的数量。通过监控流量，其可以在发现任何异常时发出警报。例如，它可以在请求意外增加、出现来自同一用户的大量请求或请求数量异常低时向您发出警报。

正常运行时间

对于提供在线服务的企业来说，正常运行时间至关重要。许多服务等级协议（SLAs）只允许占整个预定的时间段一个百分点的停机时间。APM 会监控应用程序的可用性，并将其级别与服务供应商和客户商定的级别进行比较。



随着移动互联网技术的发展，安卓APP的功能越来越多，对于APP性能的要求也随之提高。目前有很多应用性能监控(APM:Application perfmance monitor)的工具，如阿里的mobileperf，网易开源的Emmagee，腾讯的Matrix等等。

以上主流的性能监控是针对APP层，对安卓系统性能的监控也非常重要。谈及系统性能，我们很容易想到CPU使用率、CPU使用率TOP5的进程、内存、内存占用TOP5进程、网络速度、磁盘速度这6个常见的系统性能指标，本文针对这6个指标，通过查阅资料和实践，在应用层开发出一套更高效低耗的Android系统性能通用监控工具，本文也争取成为当前网上分析“Android系统性能监控指标获取和上报”最全面的文章。



APM 简介

APM 通常认为是 Application Performance Management 的简写，它主要有三个方面的内容，分别是 「Logs(日志)」 、「Traces(链路追踪)」 和 「Metrics(报表统计)」。以后大家接触任何一个 APM 系统的时候，都可以从这三个方面去分析它到底是什么样的一个系统。




爱奇艺移动端 APM 系统已经建立包括崩溃、网络、卡顿、日志、内存、图片等多项监控功能。


FPS（帧率）、界面渲染速度、Crash率、网络、CPU使用率、电量损耗速度等




Monitoring Flutter App Performance

Flutter performance monitoring involves collecting and analyzing an app’s behavior, resource usage, and user behavior data. This data can tell you how well your app performs and if improvements are necessary.

Here are some of the standard analytics and tools to help you monitor the performance of your Flutter applications.

Real-time analytics: These analytics offer a live view of the app by tracking metrics like user interactions, load times, and other relevant metrics to help you spot any potential issues. This gives you a chance to resolve any issues before they negatively impact user experience. A tool like Firebase Performance Monitoring provides user-friendly dashboards to monitor these analytics.
Error tracking: Monitoring performance goes hand-in-hand with tracking and resolving errors. By promptly fixing these issues, app developers ensure constant good app performance. A tool like Firebase Crashlytics provides detailed reports on crashes, exceptions, and errors within the app.
User session recording: This captures real user sessions. It helps you understand user flows and identify potential performance pitfalls. Heatmaps is a great tool for tracking user sessions.
There are also specific performance metrics you should monitor. Let’s discuss these in the next section.

Flutter App Performance Metrics

You must track several performance metrics to monitor the performance of your Flutter application effectively. Some of the key metrics include:

Frame Per Second (FPS): Measure how many frames per second the app renders. Flutter renders its UI at 60 fps or 120 fps on devices that support 120Hz updates. Consistently high FPS ensures the smoothest experience. 
Memory usage: Track the app’s memory consumption to identify potential memory leaks or inefficient memory space usage.
CPU usage: Monitor CPU usage to avoid app overload on the device’s processor, which can cause lag or performance issues.
Network performance: Analyze the efficiency of network requests, measuring factors like latency, response times, and error rates.
Crash reports: Track and log instances of app crashes, providing insights into potential stability issues.
UI freeze: Measure the number of times an app user interface becomes unresponsive for a while. A UI freeze indicates UI rendering issues.
App startup time: This metric tracks the amount of time it takes the app to launch and function. A slow startup time frustrates users and leads to high abandonment rates.
You can test Flutter app performance in several ways, including Performance overlay, DevTools performance view, and Benchmark.






在Flutter中，目前没有直接等同于Android平台JankStats的官方工具用于监控应用中的卡顿（jank）。然而，Flutter提供了一些其他方法和工具来帮助开发者监控和诊断性能问题，包括卡顿现象。

1. Performance Overlay（性能叠加层）
Flutter提供了一个内置的性能叠加层，开发者可以启用它来监控帧渲染的性能。这些信息包括UI和GPU线程的帧渲染时间，帮助识别潜在的卡顿问题。

启用性能叠加层的方法：

dart
Copy code
void main() {
  runApp(MyApp());

  }

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Enable performance overlay
    return MaterialApp(
      showPerformanceOverlay: true,
      home: MyHomePage(),
    );
  }
}


在运行应用时，屏幕上方会显示两条图表，绿色表示UI线程的帧渲染时间，橙色表示GPU线程的帧渲染时间。如果任何一条线超出基准线（16ms），说明可能会出现卡顿。

2. Flutter DevTools
Flutter DevTools 是一个强大的工具，提供了各种性能分析功能。它包括一个“帧时间线”（Frame Timeline），可以帮助你分析帧渲染时间，并识别导致卡顿的操作。

使用DevTools可以通过以下方式：

在终端运行flutter run --profile以启动应用的性能模式。
打开浏览器并访问http://localhost:9100，这会启动Flutter DevTools。
在DevTools中，使用“Timeline”页面来分析帧时间线和UI性能。
3. debugPrintStack 和 Timeline API
开发者还可以手动监控特定操作的性能。比如使用Timeline API记录性能数据，或者在怀疑卡顿的地方使用debugPrintStack输出当前的堆栈信息。

4. flutter doctor 和 flutter analyze
这些命令可以帮助你识别可能导致性能问题的代码片段或配置问题。

flutter doctor：检查Flutter环境配置，确保所有组件正常工作。
flutter analyze：分析项目中的代码，查找潜在的问题，包括可能导致性能下降的代码。
5. 第三方工具
虽然Flutter本身没有类似JankStats的工具，但社区有一些第三方库和工具可以帮助监控性能，如performance库或集成到CI/CD管道中的自动性能监控工具。

总结
尽管Flutter没有像JankStats那样的专用工具，但Flutter提供了一系列工具和方法来帮助开发者监控和优化应用的性能。这些工具包括性能叠加层、Flutter DevTools、Timeline API、以及其他性能分析方法。通过合理使用这些工具，开发者可以有效地识别和解决应用中的卡顿问题。