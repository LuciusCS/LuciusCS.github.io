



## K8S常用命令

### 查看所有节点

```
kubectl get nodes

```

### 查看单个节点信息

```
 kubectl describe node <节点名称>

```

### 检查集群各组件运行状态

```
kubectl get cs

```

### 查看集群信息

```
kubectl cluster-info
```

### 查看containerd 版本号

```

ctr version
```


### 查看pod资源

```
kubectl get pod -n kubernetes-dashboard

```

### 查看dashboard安装情况

```
kubectl get pods --all-namespaces -o wide | grep dashboard
```


### 查看kubelet的状态

```

 systemctl status kubelet
```

### 查看K8S运行日志

```
journalctl -xefu kubelet

```



### k8s pod运行失败，查看日志

```
kubectl logs <pod-name>
kubectl logs --previous <pod-name>

```