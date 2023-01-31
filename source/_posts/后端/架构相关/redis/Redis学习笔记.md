

Redis缓存策略

Redis 是内存数据库，如果没有持久化，数据断电即失，但可以自行设计持久化


数据量超过300万就一定要建立索引了


Redis 默认有16个数据库，默认使用第一个数据库，可以对不同的数据库进行切换

Redis 可以对对象进行保存 

Redis 执行乐观锁和悲观锁，可以在事务前加锁 （watch）


SpringBoot中的所有数据操作全部放在SpringData中， spring-data-jpa, spring-data-jdbc ,spring-data-redis

在SpringBoot2.x之后，原来使用的jedis被替换为了lettuce

Redis默认的序列化方式是JDK序列化，可能会发生转义，可能会使用fastjson或者其他序列化方式

Redis保存的所有对象需要进行序列化



在集群环境中每台服务器的 spring cache 是不同步，这样会出问题，redis可以更好地兼容集群环境