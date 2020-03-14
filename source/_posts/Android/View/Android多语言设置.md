


## Android多语言适配




### 遇到的问题

部分Fragment页面失效，如嵌套的Fragment,使用Navigation进行导航的Fagment

解决方式：在所在的Activity的`onCreate()`方法中进行设置，需要在`setContextView()`之前