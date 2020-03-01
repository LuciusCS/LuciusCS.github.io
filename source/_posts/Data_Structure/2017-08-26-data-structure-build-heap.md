---
title: "创建大根堆与小根堆"
description: "大根堆与小根堆的建立"
tags: [数据结构]

thumbnail: /thumbnail/img48.jpg
toc: true
categories: 数据结构


---
modified: 2017-08-26
### 堆的概念

> n个元素序列{k0,k1,k2...ki...kn-1},当且仅当满足下列关系时称之为堆：
(ki <= k2i+1,ki <= k2i+2)或者(ki >= k2i+1,ki >= k2i+2), (i = 0,1,2,3,4...(n-2)/2)
<!--more-->
注：i从0开始与从1开始，需要改变末尾元素的下标值

#### 堆的性质

>* 堆是一棵完全二叉树，即除了最底层，其他层的节点都被元素填满，且最底层尽可能地从左到右填入。
>* 任意节点小于（或大于）它的所有后裔，最小元（或最大元）在堆的根上（堆序性）


大根堆与小根堆

![](/public/img/DataStructure/DataStructure/heap.jpg)


### 小根堆的建立[源码](https://github.com/LuciusCS/DataStructure/blob/master/DataStructure/DataStructure/BuildMinHeap.cpp):

#### 小根堆的建立过程

如果元素数组的初始排列是{53，17，78，09，45，65，87，23}，现在把它视为完全二叉树的顺序存储，从编号最大的分支结点i=」(n-2)/2 」=3开始，轮流以i=3,2,1,0为根，将它们控制的子树调整为小根堆，其过程如图所示：

![](/public/img/DataStructure/heap1.jpg)



* 小根堆的结构定义

```c
typedef struct minHeap{
    int heap[HeapSize];      //存放小根堆中元素的数组
    int n;                  //小根堆当前元素的个数，初始值为0
}minHeap;
```

* 自顶向下调整

自顶向下调整，在调整的过程中要将根结点的所有子树调节为最小堆

```c
void shifDown(minHeap &H, int m) {
	//m是开始调整的结点,n是调整结束的点
	int tmp = H.heap[m];  //j是i的左子女
	for (int j = 2 * m + 1; j <= H.n-1; j=2*j+1) {
		if (j<H.n-1&&H.heap[j]>H.heap[j + 1])
			j++;
		if (tmp <= H.heap[j])
			break;
		else {
			tmp = H.heap[m];
			H.heap[m] = H.heap[j];
			H.heap[j] = tmp;
			m = j;
		}
	}
}

```

* 构建小根堆

构建的是从下到上，调整的时候是从上至下


```c
void createMinHeap(minHeap &H, int arr[], int n) {
	for ( int i = 0; i < n; i++)
		H.heap[i] = arr[i];
	H.n = n;
	for (int i = (H.n - 2) / 2; i >=0;i--) {   //自底向上逐步扩大小根堆
		shifDown(H,i);                       //局部自上向下筛选
	}
} 
```

* 自底向上调整小根堆

```c
void shifUp(minHeap &H,int start) {
	int j= start;
	int i = (j - 1) / 2;
	int tmp = H.heap[start];
	while (j>0)
	{
		if (H.heap[i] <= tmp) break;
		else
		{
			H.heap[j] = H.heap[i];
			j = i;
			i = (i - 1) / 2;
		}

	}
	H.heap[j] = tmp;
}

```

* 小根堆的插入，采用局部自下向上调整

小根堆的插入，应该插入堆的最后，堆中插入元素后应该使用```shifUp```自下向上，一层一层向上调整；

```c
void Insert(minHeap &H,int x) {
	if (H.n==HeapSize)
	{
		printf("堆满");
	}
	H.heap[H.n] = x;
	shifUp(H, H.n);
	H.n++;
}
```

* 小根堆的删除

小根堆的删除最小元素，即删除堆顶元素；在把最小元素删除后，一般以堆的最后一个结点填补取走的堆顶元素，并将堆的实际元素个数减1，删除一个元素后会破坏堆，采用```shiftDown```从堆顶向下进行调整

```c
int Remove(minHeap &H,int &x) {
	if (!H.n)
		return 0;               //堆空返回0
	x = H.heap[0];
	H.heap[0] = H.heap[H.n - 1];
	H.n--;
	for (int i = (H.n - 2) / 2; i >= 0; i--) {   //自底向上逐步扩大小根堆
		shifDown(H, i);                          //局部自上向下筛选
	}
	return 1;
}
```

* 运行测试

```c


int main() {
	int arr[8] = { 53,17,78,9,45,65,87,23};
	minHeap H;
	createMinHeap(H,arr,8);

	printf("小根堆的建立\n");

	for (int i = 0; i < 8; i++)
	{
		printf(" %d ",H.heap[i]);
	}
	printf("\n小根堆的插入元素10\n");
	Insert(H,10);
	for (int i = 0; i < 9; i++)
	{
		printf(" %d ", H.heap[i]);
	}
	int x;
	x=Remove(H);
	printf("\n小根堆的删除\n");
	printf("删除的元素为\n%d\n",x);
	printf("删除堆顶元素，进行调整后的元素为\n");
	for (int i = 0; i < 8; i++)
	{
		printf(" %d ", H.heap[i]);
	}
	system("pause");
	return 0;
}

```
* 运行结果


![](/public/img/DataStructure/heap8.jpg)




### 大根堆的建立[源码](https://github.com/LuciusCS/DataStructure/blob/master/DataStructure/DataStructure/BuildMaxHeap.cpp)

大根堆的建立过程与小根堆的建立过程是相似的；

* 大根堆的结构定义

```c
typedef struct MaxHeap {
	int heap[HeapSize];
	int n;
}MaxHeap;

```

* 采用自上而下的调整方法

```c
void shiftHeap(MaxHeap &H,int m) {
	int tmp = H.heap[m];
	for (int i = 2*m+1; i <=H.n-1 ; i=i*2+1)
	{
		if (i<H.n-1&&H.heap[i]<H.heap[i+1])
		{
			i++;
		}
		if (tmp>H.heap[i])
		{
			break;
		}
		else
		{
			H.heap[m] = H.heap[i];
			H.heap[i] = tmp;
			m = i;
		}
	}
}

```

* 大根堆的建立

```c
void createHeap(MaxHeap &H, int arr[],int n) {
	//将数组的内容赋值给堆中的元素
	for (int i = 0; i < n; i++)
	{
		H.heap[i] = arr[i];
	}
	H.n = n;

	for (int i = (n-2)/2; i >=0; i--)
	{
		shiftHeap(H, i);
	}
}

```

* 代码测试

```c
int main() {
	int arr[8] = {1,2,3,4,5,6,7,8};
	MaxHeap H;
	createHeap(H, arr,8);
	printf("大根堆的创建结果\n");
	for (int  i = 0; i < 8; i++)
	{
		printf(" %d ",H.heap[i]);
	}
	system("pause");
	return 0;
}
```

* 测试结果

![](/public/img/DataStructure/heap3.jpg)


* 结果以树的形式表示
![](/public/img/DataStructure/heap2.jpg)





