




## 官方开源库





## 用于捕捉错误的插件

https://pub.dev/packages/catcher


## DIO用于网络请求，进行缓存

Dio-http-cache 是 Flutter 的 http 缓存库，为 Dio 设计，就像 Android 中的 RxCache 一样。

Dio-http-cache 的原理


HTTP 的缓存可以分为两种：
强制缓存：需要服务端参与判断是否继续使用缓存，当客户端第一次请求数据是，服务端返
回了缓存的过期时间（Expires 与 Cache-Control），没有过期就可以继续使用缓存，否则则
不适用，无需再向服务端询问。 对比缓存：需要服务端参与判断是否继续使用缓存，当客
户端第一次请求数据时，服务端会将缓存标识（Last-Modified/If-Modified-Since 与
Etag/If-None-Match）与数据一起返回给客户端，客户端将两者都备份到缓存中 ，再次请
求数据时，客户端将上次备份的缓存 标识发送给服务端，服务端根据缓存标识进行判断，
如果返回 304，则表示通知客户端可以继续使用缓存。 强制缓存优先于对比缓存。