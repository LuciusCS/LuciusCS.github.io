---

title: "堆排序"
description: "堆排序"
type: [数据结构]
cover:  /cover/img50.jpg
toc: true
categories: 数据结构
date: 2017/08/27
---
modified: 2017-08-27

### 堆排序原理
<!--more-->
在[建堆](https://luciuscs.github.io/2017/08/26/data-structure-build-heap.html)完毕后,堆排序就是每次将堆顶元素与最后一个元素进行交换，再进行一次针对堆顶元素向下（0，n-2）调整的过程，直至堆中只有一个元素为止。

#### 使用最大堆将元素按照从小到大的顺序进行排序（最小堆排序方式类似）

* 采用自上而下的调整方法,M标记的是子树的根,这里比在构建最大堆多一个参数n是为了标记每次调整的最末尾元素

```c
void shiftHeapSort(MaxHeapSort &H, int m,int n) {
	int tmp = H.heap[m];
	for (int i = 2 * m + 1; i <= n - 1; i = i * 2 + 1)
	{
		if (i<n - 1 && H.heap[i]<H.heap[i + 1])
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

* 创建最大堆

```c
void createHeapSort(MaxHeapSort &H, int arr[], int n) {
	//将数组的内容赋值给堆中的元素
	for (int i = 0; i < n; i++)
	{
		H.heap[i] = arr[i];
	}
	H.n = n;
	for (int i = (n - 2) / 2; i >= 0; i--)
	{
		shiftHeapSort(H, i,H.n);
	}
}
```

* 对最大堆进行排序

```c
int main(){
	 
	int a[7] = {7,6,5,4,3,2,1};
	//首先构建最大堆
	MaxHeapSort H;
	createHeapSort(H, a, 7);
	//最大堆排序是将每次将堆定的元素与与最后一个元素进行交换，然后再将堆调整为最大堆
	int tmp;
	for (int i = H.n-1; i >=0; i--)
	{
		tmp = H.heap[0];
		H.heap[0] = H.heap[i];
		H.heap[i] = tmp;
		//将其再次调整为最大堆
		for (int j = i/2; j >=0; j--)
		{
			shiftHeapSort(H,j,i);
		}
	}

	for (int i = 0; i < 7; i++)
	{
		printf("%d\n",H.heap[i]);
	}
	system("pause");
	return 0;
}

```

* 运行结果
![](/public/img/DataStructure/heap_sort.jpg)
