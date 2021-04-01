


## DataBindingComponent 引用不到

问题：程序在编写一段时间后，所有跟 DataBindingComponent 相关的类都爆红，显示引用不到，在其生成目录又显示存在

![](/public/img/Android/databinding_component1.png)

原因：在本项目中分多个渠道包，当devDebug 生成目录丢失时，会出现 DataBindingComponent 引用不到报错，重新Rebulid即可

![](/public/img/Android/databinding_component2.png)

