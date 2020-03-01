---
title: AsyncTask异步操作
thumbnail: /thumbnail/img14.jpg
toc: true
description: AsyncTask异步操作
tags: [Android]
categories: Android
---

**知识点：AsyncTask适合短时间的异步操作，如果需要长时间操作，最好使用线程池Executor**

一个AsyncTask对象被创建出来后,就只能执行一个异步任务。
<!--more-->

AsyncTask<Params,Progress,Result>是一个抽象类，继承AsyncTask需要指定三个泛型参数
* Params：启动任务时输入的参数类型
* Progress：后台任务执行中返回进度值的类型
* Result：后台任务执行完成后返回结果类型

AsyncTask中三个重要函数

* doInBackground：异步执行后台线程要完成的任务在此方法中进行
* onPreExecute：执行后台耗时操作前调用，通常用于初始化操作
* onPostExecute：当doInbackground方法完成后，系统自动调用此方法，并将doInBackground方法的返回值传入此方法中，通过此方法更新UI
* onProgressUpdate：当在doInBackground方法中调用publishProgress方法更新任务进度后，可以在此方法中更细UI进度。
