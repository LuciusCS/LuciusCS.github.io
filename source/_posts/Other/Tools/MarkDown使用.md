---
title: MarkDown的使用
type: [Other]
description:  MarkDown的使用
cover:  /cover/img95.jpg
toc: true
categories: Other
date: 2018/06/30
---

### Markdown绘制流程图并居中

```xml
   <center/>
    ```flow
    st=>start: Start
    op=>operation: Your
    cond=>condition: Yes or No?
    e=>end: End
    st->op->cond
    cond(yes)->e
    cond(no)->op
     ```
    </center>

```

实现效果

   <center/>
```flow
    st=>start: Start
    op=>operation: Your
    cond=>condition: Yes or No?
    e=>end: End
    st->op->cond
    cond(yes)->e
    cond(no)->op
``` 
</center>


### MarkDown使内容居中方式

* 方法一：

```xml
    <center>内容居中</center>
    <center>图片居中</center>

```
* 方法二：
```xml

     <div align=center>内容居中</div>

```
