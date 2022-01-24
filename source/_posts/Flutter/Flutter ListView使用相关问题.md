


## Flutter 中ListView与Column ListView GridView相互嵌套

在Column中嵌套ListView

```
return ListView.builder(
    //解决无限高度问题  
  shrinkWrap: true,
  //禁用滑动事件
  physics: NeverScrollableScrollPhysics(),

);


```

或者,在ListView中嵌套Column

```
Column(
  mainAxisSize:MainAxisSize.min
)

```

## ListView中元素点击事件不响应

ListView中为item添加点击事件，item在加载时候就触发了点击事件

```
        ListView.builder(
          itemCount: 50,
          shrinkWrap: true,
          physics: NeverScrollableScrollPhysics(),
          itemBuilder: (context, index) {
            return Container(
                child: GestureDetector(
                  onTap:_gotoSelectRoom(),
              child: ListTile(
                title: Text("$index"),
              ),
            ));
          },
        ),

```
修改后，`()=>` 符号表示传递的是回调函数，不使用的话表示直接执行这个函数
```
        ListView.builder(
          itemCount: 50,
          shrinkWrap: true,
          physics: NeverScrollableScrollPhysics(),
          itemBuilder: (context, index) {
            return Container(
                child: GestureDetector(
                  onTap: ()=>_gotoSelectRoom(),
              child: ListTile(
                title: Text("$index"),
              ),
            ));
          },
        ),

```
