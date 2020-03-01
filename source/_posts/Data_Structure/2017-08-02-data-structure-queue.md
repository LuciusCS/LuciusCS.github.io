---

title: "队列的表示与实现"
description: "数据结构中队列的实现"
tags: [数据结构]
thumbnail: /thumbnail/img40.jpg
toc: true
categories: 数据结构

---

modified: 2017-08-02
队列是先进先出的（FIFO）的线性表，在具体应用中通常使用链表或者数组实现；只允许在一端插入，在另一端删除；在队列中允许插入的一端叫队尾，允许删除的一端叫队头；

## 链队列——队列的链式表示和实现

链队列的本质是一个单向链表，头结点front相当于head,再增加一个尾结点。

![](public/img/DataStructure/20170802/002.gif)


* 注意头结点指向的节点为空，在删除队列头节点时应该删除的是该空节点的下一个节点


C语言实现代码

```c
#include "stdlib.h"
#include "stdio.h"
//单链队列，队列的链式存储结构，队列是由队头指向队尾
typedef struct QNode {
	char data;
	struct QNode *next;
}QNode,*QueuePtr;

typedef struct {
	QueuePtr  front;   //队头指针
	QueuePtr rare;     //队尾指针
}LinkQueue;


//用于初始化队列
void initQueue(LinkQueue &lq) {
	lq.front = lq.rare = (QueuePtr)malloc(sizeof(QNode));
	lq.rare->next = NULL;

}
//用于插入队列
void enQueue(LinkQueue &lq,char data) {
	//插入元素为Q的新的队尾元素 data
	QueuePtr p;
	p = (QueuePtr)malloc(sizeof(QNode));
	p->data = data;
	p->next = NULL;
	lq.rare->next = p;
	lq.rare = lq.rare->next;
}
//用于取出头元素，在操作之前首先需要判断是不是空队列
void reQueue(LinkQueue &lq) {
	if (lq.front==lq.rare)
	{
		printf("队列为空");
	}
	else
	{
		QueuePtr q;
        //因为lq.front为一个空节点，因为在初始化队列的时候没有给这一个节点赋值
		printf("%c",lq.front->next->data);  
		q = lq.front;
		lq.front = lq.front->next;
		free(q);
	}
}
int main() {
	LinkQueue lq;
	initQueue(lq);
	enQueue(lq,'a');
	enQueue(lq,'b');
	reQueue(lq);
	reQueue(lq);
	return 0;
}

```

## 循环队列——队列的顺序表示和实现

队列的顺序表示和实现，可以参照栈的顺序表示和实现；在c语言中不能使用动态数组来分实现循环队列，如果要使用循环队列则必须设定一个最大的长度；

![](public/img/DataStructure/004.jpg)


* 初始化建空队列时，令front=rare=0,当插入新元素时rare+1;当删除头元素时front+1;在非空队列中头指针始终指向头元素，尾指针始终指向队尾元素的下一个元素；

![](public/img/DataStructure/003.jpg)


* 当Q.rare==Q.front队列有可能是满的，也有可能是空的；有两种处理办法：一是另设一个标志位以区别是空还是满；二是约定以“队列头指针在队尾指针的下一位时为满”。下面的代码采用的是第二种方法。

C语言代码实现

```c
#include "stdio.h"
#include "stdlib.h"
#define maxsize 100
typedef struct {
	int *base;    //用于为队列分配空间
	int front;
	int rear;
}sqqueue;

//初始化队列
void initqueue(sqqueue &sq) {
	//构造一个空队列
	sq.base = (int *)malloc(maxsize*sizeof(int));
	if (!sq.base)
	{
		printf("构造队列失败");
	}
	sq.front = sq.rear = 0;
}

//入队
void enqueue(sqqueue &sq,int e) {
	//用于判断队列是否为满，通过查看队尾的下一个元素是不是队头
	if ((sq.rear+1)%maxsize==sq.front)
	{
		printf("队列为满");
	}
	sq.base[sq.rear] = e;
	sq.rear = (sq.rear + 1) % maxsize;  //转了一圈后sq.rare会超过maxsize

}

//出队
void requeue(sqqueue &sq) {
	//用于判断队是否为空
	if (sq.rear==sq.front)
	{
		printf("队列为空");
	}
	printf("%d\n",sq.base[sq.front]);
	sq.front = (sq.front + 1) % maxsize;
}

int main() {
	sqqueue sq;
	initqueue(sq);
	enqueue(sq,10);
	enqueue(sq,15);
	requeue(sq);
	requeue(sq);
	return 0;
}

```
