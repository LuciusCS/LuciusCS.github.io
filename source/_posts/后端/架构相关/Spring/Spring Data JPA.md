



### Spring Data JPA悲观锁


在生产环境中要慎用悲观锁，因为其是阻塞的，一旦发生服务异常，可能会造成死锁现象