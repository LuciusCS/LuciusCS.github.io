# 结构化组件介绍

结构化组件\(Android Architecture Components\)是Android Jetpack的一部分，这些集合库可以使得开发更容易测试与维护。

* 使用life-aware components组件可以用于管理activity以及fragment的生命周期。用于配置信息的改变、避免内存泄漏以及更加方便在UI中加载数据。
* 使用LiveData建立数据对象，当底层数据发生改变时通知View进行刷新。
* ViewModel可以保存与UI相关的数据，保证用户在屏幕旋转时数据不会被销毁
* Room是SQLite数据库对象的映射，使用Room可以很容易将SQLite数据表转换为Java对象。Room提供了在编译过程中对SQLite声明的check，可以返回RxJava、Flowable以及LiveData的observables。

## 结构化组件推荐

结构化组件的工作原理介绍如图所示，

* Entity\(实体\)：当使用结构化组件时，使用注解的方式表示数据库中的一张数据表。
* SQLite database:在手机中将数据存储在SQLite数据中，Room持久化库创建和控制这一个数据库。
* Dao：用于获取数据的Object，将Sql语句映射为`Funcation`，通常需要在`SQLite OpenHelper`中进行定义，但使用Room持久化层，只需调用方法即可，不需要再`SQLite OpenHelper`中进行定义。
* Room Database：Room数据库层是在SQLite Database的上一层，用于处理复杂的任务（之前是在`SQLite Openhelper`中进行处理），Room数据库使用Dao来操作SQLite Database。
* Repository：使用Repository来操作多种数据源。
* ViewModel：向UI界面提供数据，作为Repository与UI数据媒介，向UI隐藏数据源，
* LiveData：是一个数据持有类，可以被订阅（感知），持有/缓存最新的数据。当数据发生改变时，将会通知它的订阅者。`LiveData`可以感知组件的生命周期，UI组件只是订阅与之相关的生命周期，不会停止或者暂停订阅，`LiveData`可以自动感知与它相关的组件的生命周期的改变。

