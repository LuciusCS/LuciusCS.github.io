

## Flutter UI 自动化测试技术方案

Flutter 页面无法直接使用 Native 测试工具定位元素，给自动化测试带来很多不便。虽然 Google 官方推出了 Flutter driver 和 Integration test，但是在实际使用中存在以下问题：

不适用于混合栈 APP，虽然 appium 中有相关的 driver，但是无法切换环境。

元素定位能力相对薄弱。

依赖于 VMService，需要构建 Profile 或 Debug 包

### Flutter driver

，首先利用 FlutterDriver.connect()来连接 VMService 获取相关的 isolate，之后通过 websocket 来传输操作过程以及数据获取。其中测试脚本侧的所有操作都是被序列化为 json 字符串通过 websocket 传递给 ioslate 来转换为命令在 APP 侧执行，例如我们想要获取某个组件的文本内容，其最终生成的 json 结构体如下：

```
{
    "jsonrpc":"2.0",
    "id":5,
    "method":"ext.flutter.driver",
    "params":{
        "finderType":"ByValueKey",
        "keyValueString":"counter",
        "keyValueType":"String",
        "command":"get_text",
        "isolateId":"isolates/4374098363448227"
    }
}

```


尝试使用该套框架，发现其实 flutter driver 底层提供的能力相对比较薄弱，并不能完全满足我们的需求，主要问题如下：

不能批量操作元素，一旦 finder 定位到的元素超过 1 个时，就会抛出异常。

很多时候开发同学不写 key，元素定位也没那么方便。

因为 flutter 没有 inspect 工具 dump 元素，所以只能利用结合源码去写脚本，代码维护成本比较高。

官方已经放弃维护该项目，所以后续估计也不会有新功能支持。



###  使用 mockito 模拟外部依赖

进行单元测试时我们可能还需要从外部依赖（比如web服务）获取需要测试的数据，我们先来看一个示例，在 lib 中创建一个要测试的类：


```
//mock.dart
 
import 'dart:convert';
import 'package:http/http.dart' as http;
 
class Todo {
  final String title;
 
  Todo({this.title});
 
  //工厂类构造方法，将JSON转换为对象
  factory Todo.fromJson(Map<String, dynamic> json) {
    return Todo(
      title: json['title'],
    );
  }
}
 
Future<Todo> fetchTodo(http.Client client) async {
  //获取网络数据
  final response = await client.get('https://xxx.com/todos/1');
  if (response.statusCode == 200) {
    //请求成功，解析JSON
    return Todo.fromJson(json.decode(response.body));
  } else {
    //请求失败，抛出异常
    throw Exception('Failed to load post');
  }
}



```


### 编写测试用例
使用 when 语句，在其调用 Web 服务时注入 MockClient 并返回相应的数据，代码如下：

```

class MockClient extends Mock implements http.Client {}
 
void main() {
  group('fetchTodo', () {
    test('returns a Todo if successful', () async {
      final client = MockClient();
 
      //使用Mockito注入请求成功的JSON字段
      when(client.get('https://xxx.com/todos/1'))
          .thenAnswer((_) async => http.Response('{"title": "Test"}', 200));
 
      //验证请求结果是否为Todo实例
      expect(await fetchTodo(client), isInstanceOf<Todo>());
    });
 
    test('throws an exception if error', () {
      final client = MockClient();
 
      //使用Mockito注入请求失败的Error
      when(client.get('https://xxx.com/todos/1'))
          .thenAnswer((_) async => http.Response('Forbidden', 403));
 
      //验证请求结果是否抛出异常
      expect(fetchTodo(client), throwsException);
    });
  });
}



```