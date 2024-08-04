



#### Flutter中使用JSON

使用JSONConvert

https://developer.school/flutter-using-json_serializable-to-serialise-dart-classes/



接收udp广播

```
  void startUDPClent() async {
    try {
      RawDatagramSocket rawDgramSocket = await RawDatagramSocket.bind(
          '0.0.0.0', 5000);
      
      print("开启端口");
      //监听套接字事件
      await for (RawSocketEvent event in rawDgramSocket.asBroadcastStream()) {
        if (event == RawSocketEvent.read) {
          // 接收数据
          print("接收数据1");

          print(Uint8List.fromList(rawDgramSocket
              .receive()
              ?.data ?? []));
        }
        // print("接收数据"+event.toString());
      }

    }catch(e){
      print("输出错误"+e.toString() );
    }
  }

```




