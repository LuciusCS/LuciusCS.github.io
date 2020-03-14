

# Andorid Binder机制

## Android Binder介绍

Binder可以实现进程间通信，采用类似于C/S架构的设计模式，性能仅次于共享内存

### Android Binder 组成

1、Servcer：位于用户空间； 提供服务方
2、Client：位于用户空间； 需求方
3、ServiceManager:位于用户空间；作为Servier和Client之间的桥梁，Client可以通过ServiceManager拿到Server中Binder实体的引用；
4、Binder驱动：位于内核空间

用户空间不能进行进程间通信，而内核空间可以进行进程间通信

### Linux内核中提供的通信方式
1、管道通信，性能耗费严重；半双工的方式；
2、共享内存，多个进程可以访问同一块内存空间，内存管理混乱
3、Socket通信，其主要适合于网络通信
