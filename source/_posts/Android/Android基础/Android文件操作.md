---
title: Android文件操作
thumbnail: /thumbnail/img11.jpg
toc: true
description: Android文件操作
tags: [Android]
categories: Android
date: 2019/09/19
---

## Android文件的读和写

1、apk资源文件在raw和assert文件夹下，只能进行读取不能进行写入，文件大小不能超过1M；
2、SD卡中的文件；
3、数据区(/data/data/..)的文件；
<!--more-->
### 资源文件的读写

raw使用InputStream in = getResources().openRawResource(R.raw.test);
asset使用InputStream in = getResources().getAssets().open(fileName);

### Android应用数据私有目录存储（位于应用功能安装目录下）

该目录使用不需要获取用户权限，不能被其他应用访问，当应用被卸载时，该目录会被删除。在在使用该目录时，需要使用完整的包名进行访问。

文件类型：
/data/data/包名/cache ：存放的是APP的缓存信息
/data/data/包名/code_cache ：在运行时存放应用产生的编译或者优化的代码
/data/data/包名/files ： 存放APP的文件信息

还有其他一些文件，该内部存储文件在Debug模式下，使用Android Studio的Device File Explore工具可以进行访问；以release模式进行安装，则不能进行访问；对App进行反编译，以Debug模式运行则可以进入到该文件下访问；手机在Root模式下也可访问该文件（未进行测试）。

私有目录和 Context 相关，所以使用 context.getExternalXXX获取目录

`context.getCacheDir()`用于获取缓存目录，当Android内存不足时，可以删除该目录进行空间


### 从assets目录下读取文件

```java
    StringBuilder stringBuilder=new StringBuilder();

    try{
        //获取assets资源管理器
        AssetManager assetManager=this.getAssets();
        //通过资源管理器打开文件并进行读取
        BufferedReader bufferedReader=new BufferedReader(new InputStreamReader(
            assetManager.open("test.txt")
        ));

        String line;
        while(((line =bufferedReader.readLine())!=null)){
            stringBuilder.append(line);
        }
    }catch(Exception e){
        e.printStackTrace();
    }


```


### 文件写操作

//将数据保存至文件

```java
     String info="example";
     try{
         FileWriter fileWriter =new FileWriter("/data/data/com.example"+".txt",false);
         fileWriter.write(info);
         fileWriter.close();
     }catch(Exception e){
        e.printStackTrace();
     }


```

#### 文件保存完成后，直接对文件进行读取会抛出异常

解决该异常需要提醒媒体库刷新文件

```java

    Uri localUri=Uri.fromFile(new File(filepath));
    
    Intent localIntent=new Intent(  Intent.ACTION_MEDIA_SCANNER_SCAN_FILE,localUri);

    context.sendBroadcast(localIntent);


```




### Android应用数据外部存储（保存至SD卡，也可以认为非应用安装目录）

该目录使用需要获取用户权限，能被其他应用访问，当应用被卸载时，该目录不会被删除。



* 首先需要获取权限

```xml

     <!--用于获取文件操作的权限-->
     <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
     <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```
* 需要确定写入文件目录是否存在，如果不存在，则需要新建目录



### Android存储公有目录
Andorid开发公有目录与Context无关，使用Environment进行获取

* Environment.DIRECTORY_PICTURES 图片目录
* Environment.DIRECTORY_DCIM 相册目录
* Environment.DIRECTORY_DOCUMENTS 文档目录
* Environment.DIRECTORY_DOWNLOADS 下载目录
* Environment.DIRECTORY_MOVIES 视频

```java
    //有参
    Environment.getExternalStoragePublicDirectory(String type) ;
    //无参
    Environment.getExternalStoragePublicDirectory();

```


### Android本地文件选择
