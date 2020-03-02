---
title: 栈的应用——需要再次进行编辑
description: 使用栈实现进制转换、括号匹配的检验、行编辑程序
tags: [数据结构]
thumbnail: /thumbnail/img43.jpg
toc: true
categories: 数据结构
date: 2017/08/02
---

modified: 2017-08-02
##　使用栈实现进制转换、括号匹配的检验、行编辑程序

### 使用栈实现进制的转换
<!--more-->
* 将十进制转换为二进制

C语言实现代码

```c
void conversion(int num) {
	SqStack stack;
	initStack(&stack);
	while (num / 2)
	{
		push(&stack, num % 2);
		num /= 2;
	}
	push(&stack, num);

	int tmp = 0;
	while (!isEmpty(&stack))
	{
		pop(&stack, &tmp);
		printf("%d", tmp);

	}
}

```

### 使用栈实现括号匹配的检验

```c
void check_symbol() {
	char s[50] = { 0 };
	printf("请输入一串括号");
	scanf("%s", s);
	SqStack stack;
	initStack(&stack);
	push(&stack, s[0]);
	for (int i = 1; s[i] != 0; i++)
	{
		if (!isEmpty(&stack))
		{
			if (getStackTop(stack) == (int) '{'&&s[i] == (int)'}' || getStackTop(stack) == (int) '('&&s[i] == (int)')') {
				int tmp;
				pop(&stack, &tmp);
			}
			else
			{
				push(&stack, s[i]);
			}
		}
		else
		{
			int tmp;
			push(&stack, s[i]);
		}


	}
	if (isEmpty(&stack))
	{
		printf("括号匹配");
	}
	else
	{
		printf("括号不匹配");
	}

}

```

### 使用栈实现行编辑器

```c

void lineEdit() {
	//首先初始化栈
	SqStack stack;
	initStack(&stack);
	char ch = getchar();
	while (ch != EOF)
	{
		while (ch != EOF&&ch!='\n') {
			switch (ch)
			{
			case '@':clearStack(stack);
				break;
			case '#':if (isEmpty(&stack))
				break;
					 else
					 {
						 int tmp;
						 pop(&stack, &tmp);
						 break;
					 }
			default:
				push(&stack, ch); break;
			}
			ch = getchar();
		}
		ch = getchar();
	}

	//用于将存储在栈中的内容输出
	if (ch == EOF) {
		while (!isEmpty(&stack))
		{
			int tmp;
			pop(&stack, &tmp);
			printf("%c", tmp);
		}
	}
}

```