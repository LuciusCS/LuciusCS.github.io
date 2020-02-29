---
title: "归并排序"
description: ""
tags: [数据结构]



---
modified: 2017-08-04

归并排序（Merge Sort）是建立在归并操作上的一种有效的排序算法，效率为O（n log n）；该算法是采用分治法一种典型的应用，且各层分治递归可以同时进行。

归并排序的基本思路是

* 将序列每相邻两个数字进行归并操作，形成n/2个序列，排序后每个序列包含两个元素；
* 将上述序列再次归并，形成n/4个序列，每个序列包含四个元素；
* 重复步骤2，直到所有元素排序完毕；


	/images/DataStructure/Merge_sort.gif



	/images/DataStructure/Merge_sort_01.gif



要理解归并算法首先要理解归并操作（Merge），归并操作（Merge）也叫归并算法，指的是将两个已经排好的序列合并成一个序列的操作；归并算法依赖于归并操作。

使用C语言实现一个数组的左右两部分有序数列的归并操作，即将左右两部分看成两个有序数列合并成一个有序数列


```c

//a[]是要进行排序的数组，first、mid、last分别代表左侧有序部分数组的起始位置，
//左右有序两部分的分界点，右侧有序部分的终点，
//tmp[]是大小为last-first的数组，用于临时存放排序的数列

void mergeArray(int a[],int first,int mid,int last,int tmp[]) {
	int i = first;
	int j = mid+1;
	int k = 0;    //K用作tmp[]的索引

    //将a[]左右有序的两部分按照由小到大的顺序存入tmp[]中
	while (i<=mid&&j<=last)
		a[i] < a[j] ? tmp[k++] = a[i++] : tmp[k++] = a[j++];
	while (i <= mid)
		tmp[k++] = a[i++];
	while (j <= last)
		tmp[k++] = a[j++];
   
	while (k > 0)
		a[--j] = tmp[--k];
}
```


```c
void mergeSort(int a[],int first,int last,int tmp[]) {
	if (first<last)
	{
		int mid = (first + last) / 2;
		mergeSort(a,first,mid,tmp);  //左边有序
		mergeSort(a, mid+1, last, tmp);//右边有序
		mergeArray(a,first,mid,last,tmp);  //将两个数组合并
	}
}

````
有序数组的归并以及归并排序的测试

```c

int main() {

	int a[7] = {7,8,9,10,1,2,3};
	int tmp[7];
	printf("测试数组归并\n");

	mergeArray(a, 1, 3, 5, tmp);
	for (int i = 0; i < 7; i++)
	{
		printf("%d\n", a[i]);
	}

	printf("测试数组归并排序\n");
	mergeSort(a,0,6,tmp);

	for (int i = 0; i < 7; i++)
	{
		printf("%d\n", a[i]);
	}

	system("pause");
	return 0;
}

```