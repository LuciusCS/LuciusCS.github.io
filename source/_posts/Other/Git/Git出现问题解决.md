---
title:  Permission to LuciusCS/test.git denied to Lrici.
cover:  /cover/img67.jpg
toc: true
type: [Git]
description: Permission to LuciusCS/test.git denied to Lrici.
categories: Other
date: 2017/07/27
---




modified: 2017-07-27


###　问题一：remote: Permission to LuciusCS/test.git denied to Lrici.
fatal: unable to access 'https://github.com/LuciusCS/test.git/': The requested URL returned error: 403

<!--more-->
![](/public/img/other/Image3.png)


没错，LuciusCS是我原来的账号的名字，Lrici是我现在的账号的名字；
都说谷歌大法好，本宝宝恨不得把所有的方法都尝试了；

方法一：修改配置文件，或者只在本仓库中设置用户名

git config –global user.name “name” 

git config –global user.email “email” 

方法二：重新创建生成SSH KEY

方法三：删除Config文件，再重建

方法四：在Git上配置多账号（特喵的，都不知道账号在哪里）

方法五：按照The requested URL returned error: 403 403错误的解决方法

重装大法：卸载Git，然后清除注册表（就差重装系统了）

## 以上方法都没有用！！！，以上方法都没有用！！！以上方法都没有用！！！

还是显示上面的错误！！！！

## 终极方法：在凭证管理器中删除不需要账号的信息

## 步骤：

  Control Panel(控制面板)——>User Account and family Safety(用户账号和家庭安全)——>Manage Windows Credential(凭证管理)——>将跟Git有关的账号删除


![](public/img/other/Image1.png)
![](public/img/other/Image4.png)



再次提交的时候就会让你输入账号和密码，输入完成后就可以提交啦


![](public/img/other/Image5.png)
![](public/img/other/Image6.png)




### 问题二：推送错误

```xml
sign_and_send_pubkey: signing failed: agent refused operation
Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.

```

解决方式：

```
eval "$(ssh-agent -s)"
ssh-add

```

