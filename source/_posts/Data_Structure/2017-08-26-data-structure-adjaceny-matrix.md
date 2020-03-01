---
title: "图的邻接矩阵表示"
description: "图的邻接矩阵表示"
tags: [数据结构]
thumbnail: /thumbnail/img47.jpg
toc: true
categories: 数据结构



---

modified: 2017-08-04
### 邻接矩阵

>邻接矩阵（adjacency materix）表示又称为数组表示，它使用了两个数组存储图，首先将所有顶点的组织信息组织成一个顶点表，然后利用一个称之为邻接矩阵的二维数组来表示各顶点间的邻接关系。
<!--more-->
有向图的邻接矩阵表示:

![](/public/img/DataStructure/adjacency_matrix.jpg)

无向图的邻接矩阵的表示(图中边的权重为1)：

![](/public/img/DataStructure/adjacency_matrix1.png)


### 带权无向图邻接矩阵的代码实现

* 图的结构定义

```c
typedef struct MGraph {
	int numVertices, numEdges;                          //图中实际顶点的个数和边的条数
	char VerticesList[maxVertices];                     //顶点数组
	int Edge[maxVertices][maxVertices];                 //邻接矩阵，使用二维数组表示
};
```

* 图的初始化

```c
void InitGraph(MGraph &G) {
	G.numVertices = 0;
	G.numEdges = 0;
	for (int i = 0; i < maxVertices; i++)                //邻接矩阵初始化
	{
		G.VerticesList[i] = '0'; 
		for (int j = 0; j < maxVertices; j++)            //若为非带权图，全部赋值为0
			G.Edge[i][j] = ((i == j) ? 0 : maxWeight);   //maxWeight代表无穷大
	}
}
```

* 从顶点数组中找出顶点的位置，若输入的顶点不在数组中则返回-1

```c
int GetVertexPos(MGraph G, char x) {
	for (int i = 0; i < G.numVertices; i++)
	{
		if (G.VerticesList[i] == x)
		{
			return i;
		}
	}
	return -1;
}

```

* 输入创建使用邻接矩阵表示的带权无向图

```c
void CreateGraph(MGraph &G, int numVertex, int numEdge) {
	//从键盘输入n个顶点和m条边的信息，建立一个带权的无向图
	char e;
	G.numVertices = numVertex;
	G.numEdges = numEdge;
	printf("请输入顶点\n");
	for (int i = 0; i < numVertex; i++)
	{
		scanf("%c", &e);
		G.VerticesList[i] = e;
	}
	printf("请输入顶点和权重\n");
	for (int i = 0; i < numEdge;)
	{
		char e1, e2;
		int weight;
		getchar();                  //如果不使用getchar(),则缓冲区内还会有回车键
		scanf("%c %c %d", &e1, &e2, &weight);
		if (GetVertexPos(G, e1) !=-1&& GetVertexPos(G, e2) !=-1)
		{
			G.Edge[GetVertexPos(G, e1)][GetVertexPos(G, e2)] = weight;
			G.Edge[GetVertexPos(G, e2)][GetVertexPos(G, e1)] = weight;     
			i++;
		}
		else
		{
			printf("输入顶点错误，请重新输入\n");
		}
	}
}
```

注：若需要带权的有向图只需将```G.Edge[GetVertexPos(G, e2)][GetVertexPos(G, e1)] = weight;  ```注释即可

* 以下图为例测试

![](/public/img/DataStructure/adjacency_matrix2.png)



```c
int main() {

	MGraph G;
	InitGraph(G);
	CreateGraph(G, 5, 7);
	printf("\n结果输出\n");
	for (int i = 0; i < 7; i++)
	{
		for (int j = 0; j < 7; j++)
		{
			printf("%d ",G.Edge[i][j]);
		}
		printf("\n");
	}
	system("pause");
	return 0;
}
```
* 测试结果
![](/public/img/DataStructure/adjacency_matrix3.png)


[源码下载](https://github.com/LuciusCS/DataStructure/blob/master/DataStructure/DataStructure/7.2AdjacencyMatrix.cpp)
