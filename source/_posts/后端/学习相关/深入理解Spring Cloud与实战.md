

Spring Boot 把配置文件的加载封装成了 PropertySourceLoader 接口，该接口的定义如下：

```
public interface PropertySourceLoader {
 // 支持的文件后缀
 String[] getFileExtensions();
 // 把资源 Resource 加载成 PropertySource
 PropertySource<?> load(String name, Resource resource, String profile)
 throws IOException; }
```

Spring Boot 对于该接口只有两种实现：  PropertiesPropertySourceLoader：加载 properties 或 xml 文件。
 YamlPropertySourceLoader：加载 yaml 或 yml 文件。


提示：resources/application.properties 或 resources/application.yaml 配置文件就是被这两
种 ProperySourceLoader 所加载的。



提示：Spring Cloud 在加载过程中把 spring.config.name 配置设置成了 bootstrap，所以加
载的文件名是 bootstrap.properties 或 bootstrap.yml。



负载均衡是一个通用的特性，所有的 RPC 框架都会有这个概念的实现。比如，Apache 
Dubbo 内部提供了 LoadBalance 组件来完成负载均衡。
Spring Cloud 官方也提供了两种客户端负载均衡的实现：  Spring Cloud LoadBalancer：2019 年 7 月 3 日，在 Hoxton.M1 的发布公告上，Spring 
宣布更新该项目来代替 Netflix Ribbon。  Spring Cloud Netflix Ribbon：Netflix 开发的一款客户端负载均衡组件。
由于 Netflix Ribbon 和 Spring Cloud Netflix Ribbon 组件都已进入维护模式，目前官方推荐
使用 Spring Cloud LoadBalancer（后文简称 SCL）。目前 SCL 的功能跟 Ribbon 相比还比较弱
（比如，Ribbon 提供了熔断特性，当同一个实例发生 3 次错误后，就会被“熔断”一段时间，
这段时间内该实例永远不会被选择）。笔者现阶段还是推荐使用 Ribbon，预计 SCL 在未来的
版本中会逐渐更新更多的功能，并达到可以替换 Ribbon 的状态。