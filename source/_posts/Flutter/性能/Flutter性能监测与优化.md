




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





