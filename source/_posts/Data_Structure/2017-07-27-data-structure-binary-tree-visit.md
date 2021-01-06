---

title: "二叉树的前序、中序、后序遍历"
description: "递归构建二叉树、二叉树的三种遍历方式都是通过递归进行"
type: [数据结构]
cover: /cover/img36.jpg
toc: true
categories: 数据结构
date: 2017/07/27

---

* 二叉树的结构体
modified: 2017-07-27
<!--more-->
```c
typedef struct binaryTree {
	char item;
	struct binaryTree *lChild;
	struct binaryTree *rChild;

}binaryTree, *pBinaryTree;

```

* 二叉树的初始化创建，二叉树创建的过程中按照先序遍历的方式输入一颗满二叉树，缺失的节点元素使用#补足；构建的过程中先递归创建左子树，然后递归创建右子数；'#'作为递归的结束；

```c
pBinaryTree createBinaryTree() {

	char tmp = '0';
	pBinaryTree treeNode = NULL;
	scanf("%c", &tmp);
	if (tmp == '#')
	{
		treeNode = NULL;
	}
	else
	{
		//为加入的节点分配新的内存空间
		treeNode = (binaryTree*)malloc(sizeof(binaryTree));
		treeNode->item = tmp;

		//递归调用产生二叉树
		treeNode->lChild = createBinaryTree();
		treeNode->rChild = createBinaryTree();

	}
	return treeNode;

}

```

* 先序遍历二叉树

```c
void preVisitBiTree(pBinaryTree root) {
	if (root)
	{
		//先遍历根节点
		printf("%c", root->item);
		//遍历左子树
		preVisitBiTree(root->lChild);
		//遍历右子树
		preVisitBiTree(root->rChild);

	}
}
```

* 中序遍历二叉树

```c
void inVisitBiTree(pBinaryTree inRoot) {

	if (inRoot)
	{
		//先遍历左子树
		inVisitBiTree(inRoot -> lChild );
		//遍历根节点
		printf("%c", inRoot->item);
		//遍历右子树
		inVisitBiTree(inRoot->rChild);
	}

}


```

* 后序遍历二叉树

```c
void lastVisitBiTree(pBinaryTree lastRoot) {

	if (lastRoot)
	{
		//遍历左子树
		inVisitBiTree(lastRoot->lChild);
		//遍历右子树
		inVisitBiTree(lastRoot->rChild);
		//遍历根节点
		printf("%c", lastRoot->item);
	}
}

```

### 三种遍历二叉树的递归结构是相似的，只是递归遍历的先后有区别


### 测试：

测试用例：ABC##D##E#F##


```c

int main() {

	//构建一颗二叉树
	pBinaryTree binaryTree = createBinaryTree();
	//采用先序遍历的方式遍历输出二叉树
	preVisitBiTree(binaryTree);
	printf("\n");
	//采用中序遍历的方式输出二叉树
	inVisitBiTree(binaryTree);
	printf("\n");
	lastVisitBiTree(binaryTree);
	printf("测试二叉树");
	return 0;
}

```