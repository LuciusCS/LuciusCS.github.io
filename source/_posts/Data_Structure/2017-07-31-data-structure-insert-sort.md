---
title: "排序算法"
description: "插入排序"
tags: [数据结构]
---

# 排序算法
modified: 2017-08-02

## 插入排序有直接插入排序、折半插入排序、希尔排序等

### 直接插入排序

直接插入排序的核心是不断将后面的数字，不断插入前面已经排好序的数列中；在进行插入排序时需要不断将需要插入的元素与前面已经排好序的元素进行比较，并不断将已排好序的元素后移。

	/images/20170731/insertsort.gif


C语言代码实现

```c

void StrightInsertSort(int array[], int length) {

	int tmp;     //用于保存将要插入的array[i]
	for (int i = 1; i < length; i++) {
		tmp = array[i];
		for (int j = i; j >= 0; j--)
		{
			if (tmp >= array[j - 1] || j == 0)
			{
				array[j] = tmp;
				break;
			}
			else {
				array[j] = array[j - 1];
			}
		}
	}
}

```

### 折半插入排序

折半插入排序是直接插入排序的一种优化，直接插入排序需要不断移动元素的位置；而折半插入排序是通过折半查找的方式，直接定位到插入元素的位置，然后进行一次元素平移；

C语言代码实现

```c
void BInsertSort(int array[], int length) {
	int tmp;
	int start, end, mid;


	for (int i = 1; i < length; i++)
	{
		tmp = array[i];
		start = 0; end = i - 1; mid = (end + start) / 2;

		//判断将要插入的元素是否大于已经排好序的元素的最大值，或者已经排好序的最小值
		if (tmp >= array[i - 1])
		{
			array[i] = tmp;
		}
		else if (tmp <= array[0]) {
			for (int j = i; j > 0; j--)
			{
				array[j] = array[j - 1];
			}
			array[0] = tmp;
		}
        //进行折半查找排序
		else
		{
			while (start < end)
			{
				if (tmp > array[mid])
				{
					start = mid + 1;
					mid = (start + end) / 2;
				}
				else if (tmp < array[mid])
				{
					end = mid - 1;
					mid = (start + end) / 2;
				}
			}

			for (int j = i; j > start; j--)
			{
				array[j] = array[j - 1];
			}
			array[start] = tmp;

		}
	}

}

```


### 希尔排序

希尔排序（Shell's Sort）又称为“最小增量排序”（Diminishing Increment Sort），基本思想是：先将整个序列中的记录“基本有序”再对全体记录进行一次直接插入排序（当gap=0时）；


	/images/20170731/001.png


* 颜色相同的为一个分组

C语言代码实现

```c

void shell_sort(int arr[], int length) {
	int gap, i, j;
	int tmp;
	for (gap = length / 2; gap > 0; gap /= 2)
	{
        //下面两个for循环是对每一个分组进行插入排序
		for (i = gap; i < length; i++)
		{
			tmp = arr[i];
			for (j = i - gap; j >= 0 && arr[j] > tmp; j-=gap)
			{
				arr[j + gap] = arr[j];
			}
			arr[j + gap] = tmp;
		}
	}

}

```