---
title: 顺序栈的表示与实现
description:
tags: [数据结构]
thumbnail: /thumbnail/img37.jpg
toc: true
categories: 数据结构
date: 2017/07/27
---

modified: 2017-7-28
本文采用C语言，利用结构体来实现顺序栈

* 用于定义栈的大小，以及再栈满的时候，扩充栈
<!--more-->
```c
#define STACK_SIZE 50
#define STACK_INCREMENT 10
```

* 采用顺序结构来实现栈，使用的是结构体，以一个结构体来表示栈

```c
typedef struct {
	int stackSize;  //栈容量
	int *base;      //栈底指针
	int *top;       //栈顶指针
}SqStack, *pStack;

```

* 初始化栈，base和top相当于栈中的索引,Top是栈顶，Base是栈底,传入的参数是结构体指针

```c
void initStack(pStack p) {
	p->base = (int *)malloc(STACK_SIZE * sizeof(int));
	if (p->base != NULL)
	{
		p->top = p->base;
		p->stackSize = STACK_SIZE;
	}
	else
	{
		printf("分配内存失败");
	}
}

```

* 栈判空，通过判断栈顶Top指针和栈底Base指针指向的地址是否相等,栈空返回true，否则返回false

```c
bool isEmpty(pStack p) {
	return p->top == p->base ? true : false;
}
```

* 栈判满，通过栈顶指针的地址与栈底指针的差值与栈初始化的大小进行比较

```c
bool isFull(pStack p) {
	return (p->top - p->base) >= STACK_SIZE ? true : false;
}

```

* 入栈，传入结构体指针和将要入栈的元素，先存储数据，然后再将栈顶指针地址加一（栈中数据存储的地址是由小至大）；

```c
void push(pStack p, int topElement) {
	int *q = NULL;
	if (isFull(p))
	{
		q = (int *)realloc(p->base, STACK_INCREMENT * sizeof(int));  // 重新调整内存块的大小

		p->base = q;
		p->stackSize = p->stackSize + STACK_INCREMENT;
	}
	*(p->top)++ = topElement;
}

```

* 出栈，传入结构体指针和保存栈顶元素的指针，先将栈顶指针的地址减一，然后再取址；

```c
void pop(pStack p, int *topElement) {
	if (isEmpty(p))
	{
		printf("空栈");

	}

	p->top--;
	*topElement = *p->top;
}


```

* 求栈顶元素，与栈顶元素出栈相同，只是不需要讲栈顶指针的地址减一

```c
int getStackTop(SqStack s) {
	int topElement;
	if (isEmpty(&s))
	{
		return 0;
	}
	topElement = *(s.top - 1);
	return topElement;

}

```

* 清空栈，不断将让栈中元素出栈，直至栈空

```c
void clearStack(SqStack s) {
	while (!isEmpty(&s))
	{
		int tmp;
		pop(&s, &tmp);
	}

}
```

* 求栈当前大小

```c
int getStackLength(SqStack s) {
	int i = 0;
	int *q = s.top;

	while (q != s.base)
	{
		q--;
		i++;
	}
	return i;
}
```

