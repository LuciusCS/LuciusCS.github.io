

## Spring 事务管理

  * 统一事务编程模型
  * 编程式事务及声明式事务（AOP）


## 微服务构架
  * 使用spring boot快速构建一个应用；
  * 使用spring cloud完成大型分布式网络服务的调用，实现分布式；
  * 使用spring cloud data flow进行流式数据计算、批处理


## Springboot启动类

  * @SpringBootApplication: Springboot启动类注解
  * @SpringBootConfiguration: Springboot配置类注解
  * @EnableAutoConfiguration: 开启自动配置注解
  * @ComponentScan：组件扫描、自动装配注解



## Restful理解

 * 遵循了rest原则的web服务，rest式的web服务是一种ROA（The Resource-Oriented Architecture: 面向资源的架构），Restful架构的一个核心资源是 “资源” (Resource)

 * Spring Boot全面支持开发Restful程序，通过不同的注解来支持前端的请求：
  - @GetMapping, 处理Get请求
  - @PostMapping, 处理Post请求
  - @PutMapping, 用于更新资源
  - @DeleteMapping, 用于删除请求
  - @PatchMapping, 用于更新部分资源

  * Controller中的映射注解
   - @PathVariable, 用于接受url路径上的参数
   - @ModelAttribute, 用于直接接受 url?后面的参数入url?id=123&name=456 ，然后直接为Pojo






## 数据库事务

  **事务的概念**
  数据库事务是访问并可能更新数据库中各种数据项的一个程序执行单元
  **事务的组成**
  一个数据库事务通常包含对数据库进行读或写的一个操作序列

  **一个典型的数据库事务**
  ```
  BEGIN TRANSACTION  //事务开始
  SQL1
  SQL2
  COMMIT/ROLLBACK   //事务提交或回滚
  ```

  **事务隔离级别**
  事务并发操作同一批数据的时候所导致的问题可以通过设置隔离级别来解决

  **隔离级别的分类（从低到高）**
  * 读未提交（READ UNCOMMITTED）
  * 读已提交(READ COMMITTED)--Oracle默认级别
  * 可重复读(REPEATABLE READ)--MySQL默认级别
  * 串行化（SERIALIZABLE）




## 容器镜像可移植性的限制
如果一
个容器化的应用需要一个特定的内核版本，那它可能不能在每台机器上都工作。如
果一台机器上运行了一个不匹配的Linux内核版本，或者没有相同内核模块可用，
那么此应用就不能在其上运行。
。一个在特定硬件架构之上编译的容器化应用，只能在有
相同硬件架构的机器上运行。不能将一个x86架构编译的应用容器化后，又期望它
能运行在ARM架构的机器上。你仍然需要一台虚拟机来做这件事情。



## 日志和监控查看


### 本地查看
  
   * docker status (容器名) : cpu、内存、流量使用情况

### promethus stack
   * 专业级容器监控，需要额外部署
   * cadvisor(采) + prometheus (存、查) +grafana (看)   