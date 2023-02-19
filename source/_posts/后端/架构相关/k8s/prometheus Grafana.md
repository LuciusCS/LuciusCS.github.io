
参考链接


https://blog.csdn.net/Pluto372/article/details/122835180?spm=1001.2014.3001.5502


Prometheus+Grafana作为监控K8S的解决方案，大都是在K8S集群内部部署，这样可以直接调用集群内的cert及各种监控url，但是增加了集群的资源开销。因此在资源有限的情况下，我更倾向于K8S集群外独立部署Prometheus+Grafana。


kubectl create -f node-exporter.yaml


# 首先部署 rbac-setup.yaml
kubectl create -f rbac-setup.yaml
# 部署configmap
kubectl create -f configmap.yaml
# 部署deployment
kubectl create -f prometheus.deploy.yml
# 部署svc
kubectl create -f prometheus.svc.yaml


# 创建deployment
kubectl create -f grafana-deploy.yaml
# 创建svc
kubectl create -f grafana-svc.yaml
# 创建 ing
kubectl create -f grafana-ing.yaml


### grafana 设置 Prometheus data source出错

url 需要加 http://

```
http://10.109.51.213:9090

```

Readiness probe failed: Get "http://10.105.144.199:3000/login": dial tcp 10.105.144.199:3000: connect: connection refused
