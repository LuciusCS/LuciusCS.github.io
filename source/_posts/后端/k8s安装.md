



Ubuntu 20.02 安装k8s 1.24.4

https://www.jianshu.com/p/af16633cf4c5

### 1.关闭swap


```
 sudo swapoff -a

 sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

```

## 一.安装containerd

### 1.安装依赖项

```
$ sudo apt-get update
$ sudo apt-get install -y ca-certificates curl gnupg lsb-release
```

### 2.添加GPG秘钥

```
$ sudo mkdir -p /etc/apt/keyrings
$ curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

```

### 3. 设置apt仓库

```

$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

```

### 4.安装containerd

```
$ sudo apt-get update
$ sudo apt-get install -y containerd.io
# 锁定 containerd.io 版本
$ sudo apt-mark hold containerd.io

```

### 5. 启用 cri 和 systemd

```

$ containerd config default | sudo tee /etc/containerd/config.toml
```

找到下面的配置项并修改。

```

[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.aliyuncs.com/google_containers/pause:3.7"
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
    ...
    [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
        SystemdCgroup = true

```

重启 containerd 并设置 containerd 自启动。

```
$ sudo systemctl restart containerd.service
$ sudo systemctl enable containerd.service

```



二、安装 Kubeadm

1. 允许 iptables 检查桥接流量

```
$ cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
$ sudo modprobe overlay
$ sudo modprobe br_netfilter
$ cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
$ sudo sysctl --system


```

2. 安装必要依赖

```
$ sudo apt-get update
$ sudo apt-get install -y apt-transport-https ca-certificates curl

```

3. 添加 GPG 密钥

```

$ sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg
```


4. 设置 apt 仓库

```
$ echo \
  "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://mirrors.aliyun.com/kubernetes/apt/ \
  kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list

```

5. 安装 kubelet、kubeadm 和 kubectl，并锁定其版本

```
$ sudo apt-get update
$ sudo apt-get install -y kubelet kubeadm kubectl
# 锁定 kubelet kubeadm kubectl 版本
$ sudo apt-mark hold kubelet kubeadm kubectl
```

三、安装 Kubernetes

1. 初始化Master节点

```
$ sudo kubeadm init \
  # 设置控制平面端点，子节点通过这个 host/ip 访问控制平面
  --control-plane-endpoint=<control-plane-host-or-ip> \
  # 设置 pod 的网络的无类别域间路由 ip 段
  --pod-network-cidr=10.244.0.0/16 \
  # 设置容器运行时
  --cri-socket=/run/containerd/containerd.sock
  # 设置镜像拉取的仓库地址，采用阿里云镜像
  --image-repository=registry.aliyuncs.com/google_containers

```

2. 成功之后，会有如下输出：

```
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of control-plane nodes by copying certificate authorities
and service account keys on each node and then running the following as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> \
    --discovery-token-ca-cert-hash sha256:<hash> \
    --control-plane 

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join <control-plane-host>:<control-plane-port> --token <token> \
    --discovery-token-ca-cert-hash sha256:<hash>

```

2. 配置 kubectl 的配置文件

```
$ mkdir -p $HOME/.kube
$ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ sudo chown $(id -u):$(id -g) $HOME/.kube/config

```

3. 子节点创建

```

子节点也需要安装 kubelet kubeadm kubectl ， 子节点不需要init
重复上面的安装步骤即可。

```

4. 子节点加入控制平面节点


```

sudo kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash> --cri-socket=/run/containerd/containerd.sock
```

成功之后，会有如下输出：

```

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.

```


四、安装pod网络附加组件

集群已经搭建起来了，然后我们会发现 coredns 停滞在 Pending 状态。

1. 安装flannel

2. 启动flannel

```
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
```



五、创建dashboard应用


1. 安装dashboard

```

kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.2.0/aio/deploy/recommended.yaml

```

