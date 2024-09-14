


Flutter混合开发工程

Flutter 模块是独立的,可以独立运行，Android工程和IOS工程都需要引用该模块；

工程：https://github.com/flutter/samples.git    add_to_app/multiple_flutters    


Flutter 模块 multiple_flutters_module 中调用原生的方法全部位于  multiple_flutters_android 原生工程中的原生代码中，
实际   multiple_flutters_module 中不存在调用原生代码