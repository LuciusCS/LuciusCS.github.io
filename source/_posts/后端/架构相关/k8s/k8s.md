


### 修改 host

```
 vim /etc/hosts
```

### 关闭 swap

```
    ///查看 
    free -m
     
     vim /etc/fstab
     // 注释掉 swap
     vim /etc/sysctl.conf
     //添加 vm.swappiness = 0

```

### 安装containerd

网址 https://developer.aliyun.com/mirror/

```

# step 1: 安装必要的一些系统工具
sudo apt-get update
sudo apt-get -y install apt-transport-https ca-certificates curl software-properties-common
# step 2: 安装GPG证书
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
# Step 3: 写入软件源信息
sudo add-apt-repository "deb [arch=amd64] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
# Step 4: 更新并安装Docker-CE
sudo apt-get -y update
sudo apt-get -y install docker-ce



```

### containerd配置

```
  //查看版本
  containerd -v
  ///修改配置
  mkdir -p /etc/containerd
  containerd config default | sudo tee /etc/containerd/config.toml
  vim /etc/containerd/config.toml
  ///  sandbox_image = "registry.aliyuncs.com/google_containers/pause:3.6"
  ///systemd_cgroup = true
  systemctl restart containerd.service
  systemctl status containerd.service
  systemctl enable containerd
```

```
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

```



```

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
 
sudo sysctl --system


```

### 安装k8s

网址： https://developer.aliyun.com/mirror/?spm=a2c6h.13651102.0.0.3e221b11vg5Vmb&serviceType=mirror&tag=%E5%AE%B9%E5%99%A8

```
apt-get update && apt-get install -y apt-transport-https
curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add - 
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF
apt-get update
apt-get install -y kubelet kubeadm kubectl


//查看版本
kubeadm version

```

### 安装命令 tab 提示

```
    apt-install bash-completion
    source <(kubeadm completion bash)
    source <(kubectl completion bash)
    source <(crictl completion bash)
```
添加到bash中

```
   vim .bashrc

```

### 设置  runtime-endpoint image-endpoint

```
 ll /run/containerd/containerd.sock
 crictl config runtime-endpoint unix:///run/containerd/containerd.sock
 vim /etc/crictl.yaml
 //添加  runtime-endpoint unix:///run/containerd/containerd.sock
 //添加  image-endpoint unix:///run/containerd/containerd.sock
 systemctl daemon-reload

```


### 设置 runtime_type

```
vim /etc/containerd/config.toml

//设置 runtime_type = "io.containerd.runtime.v1.linux"

systemctl daemon-reload
systemctl restart containerd.service
crictl images

```

### 初始化k8s

```
systemctl enable kubelet
kubeadm config print init-defaults > init.yaml
vim init.yaml

/// 添加 advertiseaddress:本机ip
/// 添加 name:server1
/// 设置 imageRepository: registry.aliyuncs.com/google_containers
/// 设置 serviceSubnet：10.96.0.0/12

kubeadm init --config=init.yaml

mkdir -p $HOME/.kube
sudo cp -i /etc/     ///上面的输出内容

```



### 安装 calico

网址：https://projectcalico.docs.tigera.io/getting-started/kubernetes/self-managed-onprem/onpremises

```
curl https://raw.githubusercontent.com/projectcalico/calico/v3.24.1/manifests/calico.yaml -O


///设置 calico_ipv4pool_cidr 为上文中的 serviceSubnet


kubectl apply -f calico.yaml

```

### 安装dashboard

网址：https://github.com/kubernetes/dashboard
```
   vim recommended.yaml
   kubectl apply -f recommended.yaml
   get service --namespace kubernetes-dashboard
   kubectl --namespace kubernetes-dashboard edit service kubernetes-dashboard
   ///修改 nodePort 30003
   ///修改 type NodePort

```

///初始化用户


网址： https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md

```
vim admin-user.yaml
kubectl apply -f admin-user.yaml
kubectl --namespace kubernetes-dashboard get serviceaccounts
kubectl --namespace kubernetes-dashboard describe serviceaccounts admin-user
kubectl --namespace kubernetes-dashboard create token admin-user


```