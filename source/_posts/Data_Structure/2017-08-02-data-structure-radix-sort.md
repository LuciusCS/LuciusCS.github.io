---

title: "基数排序（Radix Sort）"
description: "基数排序"
tags: [数据结构]
thumbnail: /thumbnail/img41.jpg
toc: true
categories: 数据结构


---
modified: 2017-08-03

桶排序（Bucket Sort）工作原理是将数列分到有限的桶中，每个桶再分别进行排序；

基数排序（Radix Sort）是一种非比较型整数排序算法，其原理是将整数按位数切割成不同的数字，然后按每个位数分别比较。由于整数也可以表达字符串（比如名字或日期）和特定格式的浮点数，所以基数排序也不是只能使用于整数。

基数排序的方式可以采用LSD（Least significant digital）或MSD（Most significant digital），LSD的排序方式由键值的最右边开始，而MSD则相反，由键值的最左边开始。

基数排序可以看做是多次桶排序



```c
#include "stdio.h"
#include "stdlib.h"

//从个位开始，最低位优先（Least Significant Digital first）
void radixSort(int num[], int length) {

	int *radix[10];
	for (int i = 0; i < 10; i++)
	{
		radix[i] = (int *)malloc(length * sizeof(int));
		radix[i][0] = 0;
	}
	int index = 1;

	for (int i = 1; i < 5; i++)
	{

		//将num数组中的数据放入数组radix中
		//第一次分配
		for (int i = 0; i < length; i++)
		{
			radix[(num[i]/index)% 10][0]++;
			radix[(num[i]/index) % 10][radix[(num[i]/index )% 10][0]] = num[i];
		}
		//第一次回收
		int length = 0;
		for (int i = 0; i < 10; i++)
		{
			for (int j = 1; j < radix[i][0] + 1; j++)
			{
				num[length++] = radix[i][j];
			}
		}
		for (int i = 0; i < 10; i++)
		{
			radix[i][0] = 0;
		}
		index = index * 10;
	}

	for (int i = 0; i < length; i++)
	{
		printf("%d\n",num[i]);
	}

}


//从最高位开始，最高位优先（Most Significant Digit first）
void radixSortMSD(int num[], int length) {

	int *radix[10];
	for (int i = 0; i < 10; i++)
	{
		radix[i] = (int *)malloc(length * sizeof(int));
		radix[i][0] = 0;
	}
	int index = 10000
	for (int i = 1; i < 5; i++)
	{

		//将num数组中的数据放入数组radix中
		//分配
		for (int i = 0; i < length; i++)
		{
			radix[(num[i] / index) % 10][0]++;
			radix[(num[i] / index) % 10][radix[(num[i] / index) % 10][0]] = num[i];
		}
		//回收
		int length = 0;
		for (int i = 0; i < 10; i++)
		{
			for (int j = 1; j < radix[i][0] + 1; j++)
			{
				num[length++] = radix[i][j];
			}
		}
		for (int i = 0; i < 10; i++)
		{
			radix[i][0] = 0;
		}
		index = index /10;
	}

	for (int i = 0; i < length; i++)
	{
		printf("%d\n", num[i]);
	}

}


int main() {
	int num[10] = {0,10,12,5665,285,125,554,26,7895,12};
	radixSortMSD(num, 10);
	system("pause");
	return 0;
}


```
