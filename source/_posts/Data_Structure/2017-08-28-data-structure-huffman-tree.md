---

title: "Huffman树的算法实现"
description: "Huffman树的算法实现"
tags: [数据结构]
thumbnail: /thumbnail/img51.jpg
toc: true
categories: 数据结构

---

modified  2017-08-27
## Huffman树

Huffman树，又称最优二叉树或哈夫曼树，是一类加权路径长度最短的二叉树；
<!--more-->
### Huffman算法

设给定的权重集合为{7，5，2，4，6}，构造Huffman树的过程如下图所示。首先构造每棵树只有一个结点的森林，然后每次选择两个根结点权重最小的二叉树，以它们为左、右子树构造新的二叉树，最后得到一棵二叉树
/source/img/DataStructure/huffman_tree2.jpg


### 构造Huffman树的算法实现
* Huffman树的结点结构定义

```c
typedef struct HuffmanNode {
	char data;              //数据
	int weight;             //权重
	int lChild, rChild, parent; //指针
};
```
* Huffman树的结构定义

```c
typedef struct HuffmanTree {
	HuffmanNode elem[totalNumber];  //树的存储数组
	int n;                          //当前外结点的个数
};
```

* 构造Huffman树

```c
void createHuffmanTree(HuffmanTree &HT,int weight[],int n) {
	//给出n个权重的数组，构造Huffman树HT
	int p1,p2, min1, min2;                   //p1记最小的位置，p2记次小的位置，min1是最小的值，min2是次小的值
	for (int i = 0; i < n; i++)
		HT.elem[i].weight = weight[i];        //权重传到树中
	for (int i = 0; i < 2*n-1; i++)            //元素初始化
		HT.elem[i].parent = HT.elem[i].lChild = HT.elem[i].rChild = -1;
	p1 = p2 = 0;
	for ( int i = n; i <2*n-1; i++)          //逐个非叶节点构造
	{
		min1 = min2 = 100;
		for ( int j = 0; j < i; j++)          //寻找具有最小、次小值的根建树
		{
			if (HT.elem[j].parent== -1) {    //父指针为-1，则此时该节点没有父亲
				if (HT.elem[j].weight<min1)   //比原来最小的还要小
				{
					p2 = p1;                   
					min2 = min1;               //原来最小的变为最小
					p1 = j;
					min1 = HT.elem[j].weight;   //记下新的最小值
				}
				else if (HT.elem[j].weight<min2) //比原来的次小还要小
				{
					p2 = j;
					min2 = HT.elem[j].weight;    //记下新的次小值
				}
			}
		}
		HT.elem[i].lChild = p1;
		HT.elem[i].rChild = p2;        //左最小，右次小链接
		HT.elem[i].weight = HT.elem[p1].weight + HT.elem[p2].weight;
		HT.elem[p1].parent = HT.elem[p2].parent =i ;          //链接父节点
	}
	HT.n = 2 * n - 1;
}
```
##### 上图构建Huffman树之后的结果


![](/public/img/DataStructure/huffman_tree.png)
![](/public/img/DataStructure/huffman_tree1.png)


* 上述代码运行

```c

int main() {
	int weight[5] = {7,5,2,4,6};
	HuffmanTree ht;
    createHuffmanTree(ht,weight,5);
	for (int i = 0; i < 9; i++)
	{
		printf("%d %d %d\n",ht.elem[i].parent, ht.elem[i].lChild, ht.elem[i].rChild);
	}
	system("pause");
	return 0;
}
```
* 运行结果
![](/public/img/DataStructure/huffman_tree3.png)



[源码地址](https://github.com/LuciusCS/DataStructure/blob/master/DataStructure/DataStructure/6.5HuffmanTree.cpp)