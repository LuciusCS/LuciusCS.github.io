


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
    严谨地说，RC的继任者其实并不是Deployment，而是ReplicaSet， 因为ReplicaSet进一步增强了RC标签选择器的灵活性。之前RC的标签选 择器只能选择一个标签，而ReplicaSet拥有集合式的标签选择器，
K8S 主要使用deployment 少用 RS 和 RC   随着Kubernetes的发展，RC也出现了 新的继任者——Deployment，用于更加自动地完成Pod副本的部署、版 本更新、回滚等功能。

我们不应该直接使用底层的ReplicaSet来控制Pod副本，而应该 通过管理ReplicaSet的Deployment对象来控制副本，这是来自官方的建 议。



NodeAffinity意为Node亲和性的调度策略，是用于替换NodeSelector 的全新调度策略。目前有两种节点亲和性表达。


RS可以进行多标签匹配


推荐使用滚动更新


matchLabels需要一次规划好，不建议再进行更新，一旦变了pod会脱离管理状态，同时导致RS RC 的标签出错


知识更新 ReplicationController(老版) 和 ReplicaSet(新版)