---
title: "快速排序"
description: "快速排序3"
tags: [数据结构]
thumbnail: /thumbnail/img45.jpg
toc: true
categories: 数据结构
---
modified: 2017-08-02
快速排序可以理解为：快速排序=挖坑填数+分治算法；

快速排序(Quick Sort)使用分治法（Divide and conquer）策略来把一个序列分为两个子序列，左右两个序列分别大于基准数和小于基准数，递归结束后所有的数都将有序；

步骤为：

* 从数列中选出一个元素，作为基准（pivot）
* 将数列中比基准小的数放在基准前面，将数列中比基准大的数放在基准的后面；在这一次分割结束后将基准放在中间的位置。
* 递归地把小于基准元素的子序列和大于基准的子序列进行排序

递归到最底部时，数列的大小为零或一，也就是已经排好的序列；算法在每次迭代中，至少会把一个元素排到它最后的位置去。 


* 进行一次排序的过程(挖坑填数)
  

![](public/img/DataStructure/quick_sort.jpg)


* 快速排序的全过程


![](public/img/DataStructure/quick_sort_01.jpg)


使用C语言实现代码

```c
#include "stdio.h"
#include "stdlib.h"
//分治算法是基于递归的

void quickSort(int arr[],int left,int right) {
	if (left<right)
	{
		int i = left, j = right, tmp = arr[left];   //将最左边的数选为基准数字
		//先从右向左搜索比tmp小的数
		while (i<j)
		{
			while (i<j&&tmp <= arr[j])
				j--;
			if (i<j)
				arr[i++] = arr[j];   //将右边的数挖出放到左边的位置
			//从左至右搜索比tmp大的数
			while (i<j&&tmp >arr[i])
				i++;
			if (i<j)
				arr[j--] = arr[i];   //将左边的数挖出放入右边的空位
		}
		arr[i] = tmp;     
		quickSort(arr, left, i - 1);   //递归调用
		quickSort(arr, i + 1, right);  //递归调用
	}

}


int main() {
	int a[5] = { 5,4,3,2,1 };
	quickSort(a, 0, 4);
	for (int i = 0; i < 5; i++)
	{
		printf("%d",a[i]);
	}
		
	system("pause");
	return 0;

}

```