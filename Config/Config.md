### gitalk配置

需要在node_modules/gitbook-plugin-tbfed-pagefooter/index.js文件中添加

```html

	 str += '\n\n<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">'+
      '\n\n<script src="https://unpkg.com/gitalk@latest/dist/gitalk.min.js"></script>'+
      '\n\n<div id="gitalk-container"></div>'+
      '\n\n<script src="https://snowdreams1006.github.io/gitalk-config.js"></script>';

```

### 分支区分

Master分支只进行合并提交文章，只合并EditBranch分支内容，不做任何修改

EditBranch分支只对Gitbook进行配置，不做其他处理