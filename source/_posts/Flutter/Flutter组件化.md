

### Flutter 组件化


组件化又叫模块化，即基于可重用的目的，将一个大型App按照关注点分离的方式，拆分成多个独立的组件或模块。每个独立的组件都是一个单独App，可以单独维护、升级甚至直接替换。以业务模块作为最基础的代码划分，将业务变化隔离在相应的组件内部。
主框架和业务模块都依赖的部分，放入公共库。(公共库中都是业务无关代码)



#### SOLD原则



单一功能(SRP)：对象应该仅具有一种单一功能
开闭原则(OCP)：程序应该是对于扩展开放的，但是对于修改封闭的
里氏替换(LSP)：程序中的对象应该是可以在不改变程序正确性的前提下被它的子类所替换的
接口隔离(ISP)：多个特定客户端接口要好于一个宽泛用途的接口
依赖反转(DIP)：一个方法应该遵从“依赖于抽象而不是一个实例“



#### 每个业务或者功能，按照package方式创建‘

```
flutter create -t package --org com.example.flutter.network
```

#### 组件通信



```

class CustomNotification extends Notification {

  CustomNotification(this.msg);

  final String msg;

}



class CustomChild extends StatelessWidget {

  @override

  Widget build(BuildContext context) {

    return RaisedButton(

      //按钮点击时分发通知

      onPressed: () => CustomNotification("Hi").dispatch(context),

      child: Text("Fire Notification"),

    );

  }

}





class _MyHomePageState extends State<MyHomePage> {

  String _msg = "通知：";

  @override

  Widget build(BuildContext context) {

    return NotificationListener<CustomNotification>(

        onNotification: (notification) {

          setState(() {_msg += notification.msg+"  ";});//收到子Widget通知，更新msg

        },

        child:Column(

          mainAxisAlignment: MainAxisAlignment.center,

          children: <Widget>[Text(_msg),CustomChild()],//将子Widget加入到视图树中

        )

    );

  }

}



```

#### 页面


```

// 发射

this.emit('Event');

// 订阅

this.subscribe('Event', (event){});


```