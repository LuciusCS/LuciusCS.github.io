---
title: 将Hexo博客部署到云服务器上
thumbnail: /thumbnail/img96.jpg
toc: true
description: 将Hexo博客部署到云服务器上
tags: [Other]
categories: Other
date: 2020/03/25
---


## 将Hexo博客部署到云服务器上

在云服务器上部署Hexo博客主要包含两个步骤，配置 nginx 和搭建git仓库，配置自动化部署；
在本文中使用华为云的Ubuntu服务器

### 安装并配置 nginx

nginx是一个高性能的HTTP和反向代理服务器，同时也是一个IMAP/POP3/SMTP 代理服务器。

1、安装 ngixn

```xml
    apt-get install nginx
```


2、配置 ngixn
ngixn 安装完完成后的默认配置路径是 /etc/nginx/

在 /etc/nginx/ 文件夹下创建新的文件夹vhost，并创建 blog.conf 文件
即 /etc/nginx/vhost/blog.conf

```xml
mkdir vhost
vim blog.conf

```

在blog.conf 文件中写入配置信息

listen表示监听的端口；root 表示博客存放的路径；server_name 表示域名或公网ip

```
server{
    listen  80;  
    root /home/www/blog;
    server_name  www.zhaohanchao.com;
    location /{

    }
}

```

配置 /etc/nginx/nginx.conf 信息

在其中写入 `include /etc/nginx/vhost/blog.conf`，刚刚创建的配置信息

![](/public/img/other/blog1.png)

创建 /home/www/blog目录，用于保存博客的源码


3、启动 ngixn

```xml
systemctl start nginx
systemctl enable nginx
```

### 配置git仓库，并设置自动部署

1、安装git

```xml
apt-get install git
```

2、创建gitserver用户，并切换至改用户

```
adduser gitserver
su git server

```
3、创建 .ssh 目录获取权限，并生成 公钥秘钥文件

```xml
mkdir .ssh && chmod 700 .ssh
cd .ssh
ssh-keygen

```
![](/public/img/other/blog2.png)
![](/public/img/other/blog3.png)

4、创建空仓库

```
git init --bare hexo.git
```
空仓库创建完成后可以在本地进行下载，查看是否配置成功，路径为`git clone gitserver@ip:/home/gitserver/hexo.git`

5、配置hook进行自动化部署

进入 hexo.git目录，创建post-receive文件,并进行编辑

```
cd hexo.git
vim post-receive

```

post-receive文件中的内容如下，其中 `work-tree`表示最终发布的博客的目录，`git-dir`表示git仓库的目录

```
#!/bin/sh
git --work-tree=/home/www/blog --git-dir=/home/gitserver/hexo.git checkout -f

```
给post-receive赋予可执行权限

```
chmod +x post-receive
```

6、将本地hexo文件生成目录的git仓库添加远程仓库地址`gitserver@ip:/home/gitserver/hexo.git`进行post博客就会自动发布

博客访问地址为服务器ip



### 在搭建过程中遇到的问题

1、云服务器ping不通，但能连接

在安全组设置中添加 ICMP 入方向的规则

2、访问网站显示403错误

在安全组中天添加 TCP 80端口的入方向规则

3、博客 post 之后，在`/home/www/blog`没有任何文件

可能是git配置的hook的路径错误或者没有权限