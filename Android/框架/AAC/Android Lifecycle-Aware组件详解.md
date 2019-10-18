
## Android生命周期感知组件详解

使用Lifecycle-aware components（生命周期感知组件），可以将与Activity、Fragemnt、Service生命周期相关方法如 `onStart()` `onStop()`中的调用，放入单独的模块中,lifecycle-aware components可以自动根据生命周期进行不同的处理。

### Lifecycle类



Lifecycle可以持有组件的生命周期的信息，其使用两个枚举类型来跟踪与之相关的组件的生命周期。

* Event

* State