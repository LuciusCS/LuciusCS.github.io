


## Harbor 安装与使用

链接： https://zhuanlan.zhihu.com/p/547358630

### 安装Harbor需要修改Host

```

sudo vim /etc/hosts

### 192.168.2.12  myharbor.com
```


### 下载Harbor并解压

```

wget https://github.com/goharbor/harbor/releases/download/v2.6.0/harbor-offline-installer-v2.6.0.tgz

tar xf harbor-offline-installer-v2.6.0.tgz -C /usr/local/src/

```

### 安装docker-compose

```
curl -SL https://github.com/docker/compose/releases/download/v2.10.2/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
```

### 生成证书颁发CA证书


```
cd /usr/local/src/harbor
mkdir certs

cd certs

///生成 CA 证书私钥
openssl genrsa -out ca.key 4096

生成 CA 证书 
openssl req -x509 -new -nodes -sha512 -days 3650 \
 -subj "/C=CN/ST=Beijing/L=Beijing/O=example/OU=Personal/CN=myharbor.com" \
 -key ca.key \
 -out ca.crt

```

### 生成harbor服务器证书

```
   // 生成私钥。
  openssl genrsa -out myharbor.key 4096
  //生成证书签名请求
  openssl req -sha512 -new \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=example/OU=Personal/CN=myharbor.com" \
    -key myharbor.key \
    -out  myharbor.csr
  //生成 x509 v3 扩展名文件
  cat > v3.ext <<-EOF
    authorityKeyIdentifier=keyid,issuer
    basicConstraints=CA:FALSE
    keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
    extendedKeyUsage = serverAuth
    subjectAltName = @alt_names

    [alt_names]   #alt_names必须要包含harbor服务的域名信息
    DNS.1=myharbor.com
    DNS.2=myharbor.com.cn
    DNS.3=myharbor
    EOF  

   使用该v3.ext文件为您的 Harbor 主机生成证书

   openssl x509 -req -sha512 -days 3650 \
    -extfile v3.ext \
    -CA ca.crt -CAkey ca.key -CAcreateserial \
    -in myharbor.csr \
    -out myharbor.crt 

```

### 生成Harbor客户端证书

```
openssl x509 -inform PEM -in myharbor.crt -out myharbor.cert

```

### 修改harbor.yml 


```
cd ../
cp  harbor.yml.tmpl  harbor.yml  
cat harbor.yml 

```

```
//harbor.yml 中的内容
# Configuration file of Harbor

# The IP address or hostname to access admin UI and registry service.
# DO NOT use localhost or 127.0.0.1, because Harbor needs to be accessed by external clients.
hostname: myharbor.com   #证书签署的域名

# http related config
http:
  # port for http, default is 80. If https enabled, this port will redirect to https port
  port: 80

# https related config
https:
  # https port for harbor, default is 443
  port: 443
  # The path of cert and key files for nginx
  certificate: /usr/local/src/harbor/certs/myharbor.crt  #指定证书文件
  private_key: /usr/local/src/harbor/certs/myharbor.key  #指定私钥文件

```

### 安装 Harbor

```
./install.sh --with-trivy
///检查服务
docker-compose -f docker-compose.yml ps 
```

```
出现错误：
[Step 0]: checking if docker is installed ...

Note: docker version: 20.10.18

[Step 1]: checking docker-compose is installed ...
/usr/local/src/harbor/common.sh: line 119: /usr/local/bin/docker-compose: Permission denied
✖ Failed to parse docker-compose version.


```

解决

```
chmod +x /usr/local/bin/docker-compose
```

```
  docker login myharbor.com


```

  出现错误：Error response from daemon: Get "https://myharbor.com/v2/": x509: certificate signed by unknown authority
  解决：

 ```
   vim /etc/docker/daemon.json
{
"insecure-registries":["myharbor.com"]
}

#重启服务
systemctl daemon-reload
systemctl restart docker.service
 ``` 

### 访问

访问地址：myharbor

用户名: admin
密码：  Harbor12345


### 重启Harbor  

操作目录 /usr/local/src/harbor/


```
 docker-compose down
 ./prepare
 docker-compose up -d

```