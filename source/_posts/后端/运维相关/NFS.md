


### 挂载NFS到容器

安装NFS Server 进行配置

生产环境不建议 NFS挂载数据共享，不保证安全

推荐 PV/pvc



NFSv4将所有共享使用一个虚拟文件系统展示给客户端。伪文件系统根目录(/)使用fsid=0标示，只有一个共享可以是fsid=0。客户端需要使用“nfs server ip:/”挂载伪文件系统，伪文件系统一般使用RO方式共享，其他共享可以通过mount –bind选项在伪文件系统目录下挂载。客户端挂载过程需要通过mount –t nfs4指定NFS版本为4，默认采用nfsv3

mount -t nfs4 ipxxxxx:/data/nfs   /mnt/nfs/


参考：https://blog.weiyigeek.top/2019/5-16-104.html


具体实现：
