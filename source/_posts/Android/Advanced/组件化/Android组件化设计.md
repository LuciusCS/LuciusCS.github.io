


### Android组件化结构

使用单Activity 多Moudule的当时进行组件化   

参考的仓库：

android-multimodule-navigation-example 

单Activity 多Fragment 使用Navigation 控制页面的跳转，可以进行页面间参数的传递，缺少其他工具

LifeHepler 

没运行起来
多模块组件，可以进行使用，Retrofit网络请求每一个模块单独写




代码复用 提高复用性很简单，直接把需要复用的代码做成Android Module，打包AAR并上传代码仓库


### 不同的工程的介绍


https://github.com/1170762202/WanAndroid ： 组件化 + Arouter + Jetpack + Rxjava + Retrofit + AOP等框架




### 模仿的工程

 使用 navigation 在不同的模块之间切换Fragment：

  android-multimodule-navigation-example 

使用 navigation 在本模块中切换 Fragment

  


 资源添加不同的前缀，使用ARouter

    NavigationAdvancedSample 


### 需要具有的能力



### 实现组件的跳转方式

#### 通用方式
1、通过Intent方式进行跳转
2、通过aidl的方式进行跳转
3、通过scheme协议的方式进行跳转

#### 为什么需要路由组件

1、显示Intent：项目庞大以后，类依赖耦合太大，不适合组件化拆分
2、隐式Intent：协作困难，调用时候不知道调什么参数
3、每个注册了Scheme的Activity都可以直接打开，有安全风险
4、AndroidMainfest集中式管理比较臃肿
5、无法动态修改路由，如果页面出错，无法动态降级
6、无法动态拦截跳转，譬如未登录的情况下，打开登录页面，登录成功后接着打开刚才想打开的页面
7、H5、Android、iOS地址不一样，不利于统一跳转


### 网络请求

每一个模块的网络请求单独设置，在ViewModel中进行实现

 