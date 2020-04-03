---
title: Ubuntu使用
tags: [Ubuntu]
description:  Ubuntu使用
thumbnail: /thumbnail/img93.jpg
toc: true
categories: Android
date: 2018/07/08
---

## Ubuntu 使用`apt-get update` 或者 `apt-get install`失败

出现错误：


使用的镜像被墙

修改 /etc/apt/sources.list中的

cn.archive.ubuntu.com换成mirrors.aliyun.com

更换为

```java
deb http://mirrors.aliyun.com/ubuntu/ xenial main
deb-src http://mirrors.aliyun.com/ubuntu/ xenial main

deb http://mirrors.aliyun.com/ubuntu/ xenial-updates main
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-updates main

deb http://mirrors.aliyun.com/ubuntu/ xenial universe
deb-src http://mirrors.aliyun.com/ubuntu/ xenial universe
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates universe
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-updates universe

deb http://mirrors.aliyun.com/ubuntu/ xenial-security main
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-security main
deb http://mirrors.aliyun.com/ubuntu/ xenial-security universe
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-security universe


```

## 给文件添加权限

### 给post-receive脚本添加可执行权限

```
chmod +x post-receive
```


## 网路相关

1、查看端口占用

```
netstat -ntlp
```



## Ubuntu 使用win10共享文件夹

1、在Windows创建共享文件夹

2、在Ubuntu下安装samba-client

![](public/img/other/ubuntu_file_share1.png)

3、在Ubuntu下安装cifs-utils

![](public/img/other/ubuntu_file_share2.png)

4、在Ubuntu下新建挂载目录

![](public/img/other/ubuntu_file_share3.png)

5、挂载共享文件

![](public/img/other/ubuntu_file_share4.png)

操作完成后就可以在mnt/Shared共享文件了