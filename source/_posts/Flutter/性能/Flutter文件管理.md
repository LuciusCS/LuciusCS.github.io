


### 文件

文件是存储在某种介质（比如磁盘）上指定路径的、具有文件名的一组有序信息的集合。从其定义看，要想以文件的方式实现数据持久化，我们首先需要确定一件事儿：数据放在哪儿？这，就意味着要定义文件的存储路径。
Flutter 提供了两种文件存储的目录，即临时（Temporary）目录与文档（Documents）目录：
临时目录是操作系统可以随时清除的目录，通常被用来存放一些不重要的临时缓存数据。这个目录在 iOS 上对应着 NSTemporaryDirectory 返回的值，而在 Android 上则对应着 getCacheDir 返回的值。
文档目录则是只有在删除应用程序时才会被清除的目录，通常被用来存放应用产生的重要数据文件。在 iOS 上，这个目录对应着 NSDocumentDirectory，而在 Android 上则对应着 AppData 目录。


```
// 创建文件目录
Future<File> get _localFile async {
  final directory = await getApplicationDocumentsDirectory();
  final path = directory.path;
  return File('$path/content.txt');
}
// 将字符串写入文件
Future<File> writeContent(String content) async {
  final file = await _localFile;
  return file.writeAsString(content);
}
// 从文件读出字符串
Future<String> readContent() async {
  try {
    final file = await _localFile;
    String contents = await file.readAsString();
    return contents;
  } catch (e) {
    return "";
  }
}

```



### SharedPreferences



文件比较适合大量的、有序的数据持久化，如果我们只是需要缓存少量的键值对信息（比如记录用户是否阅读了公告，或是简单的计数），则可以使用 SharedPreferences。
SharedPreferences 会以原生平台相关的机制，为简单的键值对数据提供持久化存储，即在 iOS 上使用 NSUserDefaults，在 Android 使用 SharedPreferences。



```
/ 读取 SharedPreferences 中 key 为 counter 的值
Future<int>_loadCounter() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  int  counter = (prefs.getInt('counter') ?? 0);
  return counter;
}
 
// 递增写入 SharedPreferences 中 key 为 counter 的值
Future<void>_incrementCounter() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
    int counter = (prefs.getInt('counter') ?? 0) + 1;
    prefs.setInt('counter', counter);
}

```


### 数据库操作