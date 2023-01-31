

nacos学习

nacos有单机启动模式，有集群启动模式


nacos中的配置是用于热更新的配置，不需要将工程的所有配置，都放在其中； 


nacos配置文件优先级
  服务名-profile.yaml > 服务名称.yaml > 本地配置


nacos搭建集群，初始化的数据库表在官网中有，需要使用nginx进行反向代理