## 常用Git操作

### 一、将本地已有仓库推送到远程仓库

* 1、将本地仓库与远程仓库建立关联
```
   git remote add github git@github.com:Lucius/GitTest.git
```
   * 查看本地仓库与远程仓库关联情况
```
git remote -v
```
   * 删除与远程仓库关联 
```
 git remote rm origin
```

* 2、设置用户名和密码
```
git config -global user.name ""
git config -global user.email ""
```
* 3、设置SSH Key
  * 生成SSH Key
```
ssh-keygen -t rsa -C "your_email@example.com"
```
** -t 指定密钥类型，默认是 rsa ，可以省略。 **
** -C 设置注释文字，比如邮箱。 **
** -f 指定密钥文件存储文件名。 ** 
  * 在GitHub中设置SSH
  



### 将本地分支提交到远程

### 合并多次提交