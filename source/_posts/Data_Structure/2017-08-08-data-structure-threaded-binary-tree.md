---
title: "线索化二叉树"
description: ""
tags: [数据结构]
thumbnail: /thumbnail/img46.jpg
toc: true
categories: 数据结构
date: 2017/08/08

---

modified: 2017-08-04
使用二叉树作为存储结构时，只能找到结点的左、右孩子的信息，而不能直接得到结点的前驱和后继的信息；
<!--more-->
在有n个结点的二叉树中有n+1个空指针，利用这n+1个空指保存前驱和后继的信息；若结点有左子树，则其lChild指向其左孩子，否则指向其前驱；若结点有右子树，则其rChild指向其右孩子，否则指向其后继；为避免结点指向前驱与后继发生混淆，则在结点上增加两个标志域。

/source/img/DataStructure/threaded_binary_tree.jpg

以这种结点结构构成的二叉链表作为二叉树的存储结构，叫做线索链表，其中指向结点的前驱和后继的指针叫做线索；加上线索的二叉树叫做线索二叉树（Threaded Binary Tree）

根据中序遍历的规律可知，结点的后继应是遍历其右子树时访问的第一个结点，即右子树最左下的结点；在中序线索树中找结点前驱的规律是：若其左标志位‘1’，则左链为线索，指示其前驱，否则遍历左子树最后访问的一个结点(左子树最右下的结点)为其前驱。

为了方便代码的解释可能不会直接将代码完整地贴在文章中，源码地址：[二叉线索树源码](https://github.com/LuciusCS/DataStructure/blob/master/DataStructure/DataStructure/6.3ThreadingBinaryTree.cpp)

如果二叉树的构造、以及遍历不熟悉的可以先看[二叉树](https://luciuscs.github.io/2017/07/27/data-structure-binary-tree-visit.html)；


### 线索二叉树的结构体

```c

//声明一个枚举类型来表示指针域的状态,Link=0表示指向左右孩子，Thread表示指向前驱或后继
typedef enum {
	Link = 0, Thread = 1     //Link==0:指针，Thread==1,线索
}PointerTag;
typedef struct BinaryTree {
	char item;
	BinaryTree *lChild;
	BinaryTree *rChild;
	PointerTag lTag, rTag;
}BinaryTree, *pBinaryTree;

```

### 二叉树的先序构造

要进行二叉树的线索化，需要先构造一棵二叉树；这里采用的是二叉树的先序构造法：在进行二叉树先序构造时，输入的序列为一个二叉树的先序遍历；在进行先序遍历时如果没有孩子，则将孩子置为'#'，第一个被遍历的结点不需要加上'#'

如图：先序遍历的结果为：cba###d#e#f##
/source/img/DataStructure/binary_tree.jpg

```c
pBinaryTree createBinaryTree() {
	pBinaryTree treeNode=NULL;
	char tmp = '0';
	scanf("%c", &tmp);
	if (tmp == '#')
	{
		treeNode = NULL;
	}
	else
	{
		treeNode = (BinaryTree *)malloc(sizeof(BinaryTree));
		treeNode->item = tmp;
		
		treeNode->lChild=createBinaryTree();
		if (treeNode->lChild)
			treeNode->lTag = Link;
		treeNode->rChild=createBinaryTree();
		if (treeNode->rChild)
			treeNode->rTag = Link;
	}
	return treeNode;
}
```

### 二叉树的线索化，代码过程说明：

将二叉树线索化的实质是将二叉链表中的空指针改为指向前驱或者后继的线索，而前驱或后继的信息只有在遍历时才能得到，因此线索化二叉树的过程即在遍历的过程中修改空指针的过程；

<font color="LightCoral">注：由于二叉树的第一个结点没有前驱，最后一个结点没有后继，二叉树在线索化的过程中需要引入头结点；二叉树先序遍历的第一个结点的前驱是头结点，最后一个结点的后继的后继也是头结点。</font>


+ [二叉树](https://luciuscs.github.io/2017/07/27/data-structure-binary-tree-visit.html)的中序遍历

```c
void inVisitBiTree(pBinaryTree biTree) {
	if (biTree)
	{
		inVisitBiTree(biTree->lChild);
		printf("%c",biTree->item);
		inVisitBiTree(biTree->rChild);
	}
}
```


+ 二叉树线索化函数的整体框架

二叉树的中序线索化的实质是在二叉树中序遍历的过程中，将空指针改为前驱或者后继的过程；首先进行的是二叉树的遍历（不需要输出结点的值）；

```c
void InThreading(pBinaryTree biTree) {
	if (biTree)
	{
		InThreading(biTree->lChild);
		//printf("%c",biTree->item);  
         {
           //进行指针修改的代码块；
         }
		InThreading(biTree->rChild);
	}
}
```


+ 对访问结点记录，即对前驱的记录

在进行中序遍历过程中打印的操作其实就是后面结点的前驱；用一个全局变量pre指针记录前一个被访问过的结点；
```c
void InThreading(pBinaryTree biTree) {
	if (biTree)
	{
		InThreading(biTree->lChild);
		//printf("%c",biTree->item);  
         {
           //进行指针修改的代码块，两个大括号是为了方便说明；
         }
		pre = binaryTree;   //保持pre指向前驱；
		InThreading(binaryTree->rChild);
	}
}
```
<font color="LightCoral">全局变量会被赋初值head，在下文中有介绍：</font>

如果访问过的结点没有左孩子，那么左孩子的指针应该指向前驱，即左孩子的指针指向pre，并将令lTag=Thread;

```c
void InThreading(pBinaryTree biTree) {
	if (biTree)
	{
		InThreading(biTree->lChild);
		//printf("%c",biTree->item);  
         {
           //进行指针修改的代码块，两个大括号是为了方便说明；
	       	if (!binaryTree->lChild)
		{
			binaryTree->lTag = Thread;
			binaryTree->lChild = pre;
		}
         }
        pre->biTree;
		InThreading(biTree->rChild);
	}
}
```

+ 对后继的记录

如果访问过的结点没有右孩子，那么右孩子的指针应该指向后继；我们定义的全局变量pre对访问过的结点进行了记录,因此我们只需要将pre的右孩子指向下一个结点即可；


```c
void InThreading(pBinaryTree biTree) {
	if (binaryTree)
	{
		InThreading(binaryTree->lChild);
		//如果没有左孩子时前驱线索
		if (!binaryTree->lChild)
		{
			binaryTree->lTag = Thread;
			binaryTree->lChild = pre;
		}
		//当没有右孩子，后继线索
		if (!pre->rChild)
		{
			pre->rTag = Thread;
			pre->rChild = binaryTree;
		}
		pre = binaryTree;   //保持pre指向前驱；
		InThreading(binaryTree->rChild);
	}
}
```

<font face="黑体">在进行二叉树线索化时，其实是对每一个结点进行线索化，当每一个结点都线索化后，整个树的线索化也就做好了。</font>
<font color="LightCoral">注：这里有一个疑问就是为什么在指向前驱结点的时候不使用pre记录的结点；在一次递归的结束时将pre->biTree，即pre一直指向的是刚刚访问的结点；在中序遍历中，pre所在的结点是是其左子树的后继；只有一次遍历结束时才进行判断，然后改变指针（这里有些绕，最好逐语句跑一下代码）</font>

### 为已经线索化的二叉树添加头结点

![](/public/img/DataStructure/thread_binary_tree.jpg)



```c
void InOrderThreading(pBinaryTree &binarytree,pBinaryTree &head) {
	head = (pBinaryTree )malloc(sizeof(BinaryTree));

	//初始化头结点
	head->lTag = Link;
	head->rTag = Thread;
	head->rChild = head;  //头指针回指
	if (!binarytree) {
		 head->lChild =head;
	}
	else
	{
		head->lChild = binarytree;  //当binaryTree非空时，指向二叉树的根结点
		pre = head;   //定义的全局变量第一次赋值使用
		InThreading(binarytree);
		//对最后一个结点线索化
		pre->rTag = Thread;
		pre->rChild = head;
		head->rChild = pre;   //头结点指向中序遍历的最后一个结点
	}
}

```

### 对于中序线索树的中序遍历

先从线索树的根出发，一直沿左指针，找到“最左”（它一定是中序的第一个结点）；然后反复找结点的中序后继

一个结点的右指针如果是线索，则右指针的下一个线索就是要遍历的结点，如果右指针不是线索，则它的中序后继是其右子树的“最左”结点。


![](/public/img/DataStructure/thread_binary_tree.jpg)


```c
void InVisitThreadTree(pBinaryTree binarytree) {
	pBinaryTree pBTree;
	pBTree = binarytree->lChild;

	//当未遍历迭代完整棵二叉树继续循环；空树或者遍历结束时，pBTree=binaryTree
	while (pBTree != binarytree)
	{
		//找到最左元素
		while (pBTree->lTag == Link)
		{
			pBTree = pBTree->lChild;
		}
		printf("%c", pBTree->item);

		//如果右孩子是线索，则其指向的是下一个访问的结点
		while ((pBTree->rChild != binarytree) && (pBTree->rTag == Thread))
		{
			pBTree = pBTree->rChild;
			printf("%c", pBTree->item);
		}
		pBTree = pBTree->rChild;

	}
}

```

### 测试:cba###d#e#f##

<font color="LightCoral">需要定义一个全局变量，InVisitThreadTree()函数传入的参数是Head，因为线索二叉树的头结点是Head!!!</font>
```c
//定义全局变量
pBinaryTree pre;

```

```c
int main() {
	pBinaryTree TbinaryTree, Head;
	TbinaryTree = createBinaryTree();
	printf("二叉树的先序遍历\n");
	preVisitBiTree(TbinaryTree);
	printf("\n二叉树的中序遍历\n");
	inVisitBiTree(TbinaryTree);
	InOrderThreading(TbinaryTree, Head);
	printf("\n中序线索二叉树的中序遍历\n");
	InVisitThreadTree(Head);
	system("pause");
	return 0;
}

```

测试结果：


![](/public/img/DataStructure/binary_tree_result.png)













