


K8S负载均衡

nodePort

Cloud Loadbalance 适合在云上

Ingress直接访问pod


K8S自动膨胀

pod驱离

污点、容忍度

污点以及污点的使用场景

调度的污点只是在部署的时候有效，如果部署完了，再修改就不起作用了

默认配置部署pod， pod不在master上运行是因为master节点上有两个污点（Taints）


亲和性优先级计算：


K8S从 24版本开始要使用 replicates.apps (RS) 而不是 replicationcontrollers (RC)
K8S 主要使用deployment 少用 RS 和 RC

RS可以进行多标签匹配


推荐使用滚动更新


matchLabels需要一次规划好，不建议再进行更新，一旦变了pod会脱离管理状态，同时导致RS RC 的标签出错


知识更新 ReplicationController(老版) 和 ReplicaSet(新版)