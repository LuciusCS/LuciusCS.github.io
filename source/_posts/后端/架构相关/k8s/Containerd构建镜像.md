

##  基于nerdctl + buildkitd + containerd构建容器镜像

链接 https://blog.csdn.net/m0_60244783/article/details/126562809

### 安装nerdctl

```
wget https://github.com/containerd/nerdctl/releases/download/v0.22.2/nerdctl-0.22.2-linux-amd64.tar.gz
tar -zxvf nerdctl-0.22.2-linux-amd64.tar.gz
cp nerdctl /usr/local/bin/

sudo nerdctl version
Version:	v0.22.2

```

### 部署buildkit

```
wget https://github.com/moby/buildkit/releases/download/v0.10.3/buildkit-v0.10.3.linux-amd64.tar.gz
tar -zxvf buildkit-v0.10.3.linux-amd64.tar.gz
# 拷贝服务端与客户端二进制文件到环境变量目录
cp bin/buildkitd bin/buildctl /usr/local/bin/


```

### 编辑套接字文件

```
vim /lib/systemd/system/buildkit.socket

[Unit]
Description=BuildKit
Documentation=https://github.com/moby/buildkit

[Socket]
ListenStream=%t/buildkit/buildkitd.sock

[Install]
WantedBy=sockets.target


```

### 编辑服务文件

```

vim /lib/systemd/system/buildkitd.service

[Unit]
Description=BuildKit
Documentation=https://github.com/moby/buildkit
# Requires=buildkit.socket
After=buildkit.socket

[Service]
ExecStart=/usr/local/bin/buildkitd --oci-worker=false --containerd-worker=true

[Install]
WantedBy=multi-user.target


```

### 启动buildkitd守护进程

```
systemctl daemon-reload
systemctl enable --now buildkitd
systemctl status buildkitd

```

### 修改containerd 的配置文件  

/etc/containerd/config.toml

```

    runtime_root =""
    runtime_type =""
    [plugins."io.containerd.grpc.v1.cri".containerd.untrusted_workload_runtime.options]
[plugins."io.containerd.grpc.v1.cri".image_decryption]
   key_model="node"
[pLugins."io.containerd.grpc.v1.cri".registry]
   config_path = ""
   [plugins."io.containerd.grpc.v1.cri".registry.auths]
   [plugins."io.containerd.grpc.v1.cri".registry.headers]
   [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
      [plugins."io.containerd.grpc.v1.cri".registry.mirrors."myharbor.com"]
      endpoint = ["https://myharbor.com"]
   [plugins."io.containerd.grpc.v1.cri".registry.configs]
      [plugins."io.containerd.grpc.v1.cri".registry.configs."myharbor.com".tls] #跳过 证书校验
       insecure_skip_verify = true
   [plugins."io.containerd.grpc.v1.cri".registry.configs."myharbor.com".auth] #使用 账号密码登入
      username = "admin"
      password = "Harbor12345"
[plugins."io.containerd.grpc.v1.cri".x509_key_pair_streaming] 
   tls_cert_file = ""
   tls_key_file = ""

```


### 构建镜像

自定义基础镜像，带ifconfig, ping, telnet等网络工具的ubuntu系统：

```
vim Dockerfile

FROM ubuntu:20.04

RUN apt-get update
RUN apt-get install -y net-tools inetutils-ping telnet

CMD ["/usr/bin/sh"]

```

启动build命令，nerdctl会引导buildctl读取Dockerfile，再由buildkitd构建镜像：

```
nerdctl build -t easzlab.io.local:5000/base/ubuntu:v1 .
```

### 构建完毕，查看镜像，上传下载镜像


```

nerdctl images
REPOSITORY                           TAG    IMAGE ID        CREATED               PLATFORM       SIZE         BLOB SIZE
myharbor.com/base/ubuntu    v1     cfbaef1014b2    About a minute ago    linux/amd64    113.2 MiB    53.2 MiB

# 上传到私有仓库registry 

```
docker login myharbor.com

nerdctl push --insecure-registry myharbor.com/base/ubuntu:v1


```

#### 出现错误

```
FATA[0000] unexpected status from HEAD request to https://myharbor.com/v2/base/ubuntu/blobs/sha256:e9dcf314e8921c7fb5fcf7e18639d37cbef80c504dfdf602b7939508e9ffab79: 401 Unauthorized

//需要通过网页，建一个base的project
```


# 其它node从仓库下载镜像
nerdctl pull --insecure-registry myharbor.com/base/ubuntu:v1

```



### 需要 crictl pull镜像，Harbor镜像才能部署到k8s上

子节点都需要

### 重启

```
systemctl restart kubelet.service

```