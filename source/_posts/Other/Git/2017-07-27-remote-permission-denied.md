---
title: "remote: Permission to LuciusCS/test.git denied to Lrici."
description: "Examples and code for displaying images in posts."
tags: [error, git]

---



modified: 2017-07-27
作死小能手又一次把自己玩挂了，明明有一个Github的账号，又申请了一个账号，用于测试权限的控制；然后添加到Git中，结果在Push自己原来项目的时候总是报错；

remote: Permission to LuciusCS/test.git denied to Lrici.
fatal: unable to access 'https://github.com/LuciusCS/test.git/': The requested URL returned error: 403


	/20170727/Image3.png


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


	/20170727/Image1.png
	/20170727/Image4.png



再次提交的时候就会让你输入账号和密码，输入完成后就可以提交啦


	/20170727/Image5.png
	/20170727/Image6.png






