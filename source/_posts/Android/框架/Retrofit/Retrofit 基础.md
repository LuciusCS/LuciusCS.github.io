---
title: "Retrofit基础"
description: "Retrofit使用基础"
type: [Android]
toc: true
cover:  /cover/img105.jpg
categories: Android
date: 2019/5/12
---



## Retrofit注解
### Http请求方法注解

Http请求方法包含`@GET`、`@POST`、`@DELETE`、`@PUT`、`@HEAD`、`@PATCH`、`@TRACE`、`@OPTIONS`、`@HTTP`共8中，除了get外，其他6种都是基于post方法衍生的(需要证实)


* get和post请求的区别在于get没有请求体，而post有请求体


注：（需要证实）

* baseUrl("")中的url必须要用 '/' 进行结尾，否则会报异常


1、`@HTTP`注解可以替换以上七种，对HTTP请求进行拓展

```java
    /**
      * method 表示请的方法，不区分大小写
      * path表示路径
     * hasBody表示是否有请求体
    */
    @HTTP(method = "get", path = "user", hasBody = false)
    LiveData<ApiResponse<User>> getUser();

```

### 标记类注解

Retrofit支持的标记类注解，包括：`@FormUrlEncoded`、`@Multipart`、`@Streaming`

1、`@FormUrlEncoded` 请求体是一个Form表单，`Content-Type=application/x-www-form-urlencoded`，需要和参数类注解@Field，@FieldMap搭配使用
```java
@FormUrlEncoded
@POST("login")
Flowable<HttpResult<UserInfoData>> login(@FieldMap Map<String, String> map);

@FormUrlEncoded
@POST("public")
Call<BaseResult> addUser(@Field("userName") String userName);

```

2、`@Multipart` 支持文件上传的表单From表单`Content-Type=multipart/form-data`，需要和参数类注解@Part，@PartMap搭配使用

使用@Multipart注解方法，并用@Part注解方法参数，类型是List< okhttp3.MultipartBody.Part>
不使用@Multipart注解方法，直接使用@Body注解方法参数，类型是okhttp3.MultipartBody


```java
@Multipart
@POST("public")
Call<BaseResult> uploadFile(@Part MultipartBody.Part file);

 @Multipart
@POST("users/image")
Call<BaseResponse<String>> uploadFilesWithParts(@Part() List<MultipartBody.Part> parts);

 @POST("users/image")
Call<BaseResponse<String>> uploadFileWithRequestBody(@Body  MultipartBody multipartBody);
```


3、`@Streaming` 响应体的数据以流的形式返回，如果不使用，默认会把所有的数据全部加载到内存中，下载文件时，需要使用此注解

```java
@Streaming
@GET("download")
Call<ResponseBody> downloadFile();
```


### 参数类注解

Retrofit支持的参数类注解，包括：`@Headers`、`@Header`、`@Body`、`@Url`、`@Path`、`@Field`、`@FieldMap`、`@Part`、`@PartMap`、`@Query`、`@QueryMap`、`@Body`

1、`@Headers`用于添加请求头，作用于方法

```java
@Headers({
"Cache-Control: max-age=640000"
"User-Agent: Retrofit-Sample-App"
})
@GET("public")
Call<BaseResult<List<User>>> getUser();

```

2、`@Header`用于动态添加头部，作用于方法参数
```java
@GET("public")
Call<BaseResult<List<User>>> getUser(@Header("Token") String token);

```

3、`@Body`用于非表单请求体，作用与方法参数

```java
@POST("user")
  Call<BaseResult<String>> addUser(@Body User user);


```
```java
@POST("{api}")
Observable<String> request(@Path("api") @NonNull String api,
                           @Body  Map<String, Object> para);

```

4、`@Url`用于动态改变Url，作用于方法参数

请求时url会替换掉public

```java

@GET("public")
Call<BaseResult<List<User>>> getUser(@Url String url);
```

5、`@Path` 用于替换请求地址，作用于方法参数

请求url时会替换掉public

```java

@GET("{public}")
Call<BaseResult<List<User>>> getUser(@Path("public") String path);
```

6、`@Field` 用于表单字段参数，需要配合`@FormUrlEncoded`使用，作用于方法参数

```java
@FormUrlEncoded
@POST("public")
Call<BaseResult> addUser(@Field("userName") String userName);

```

7、`@FieldMap`用于表单字段参数，接收MAP实现多个参数，需要配合`@FormUrlEncoded`使用

```java
@FormUrlEncoded
@POST("public")
Call<BaseResult> addUser(@FieldMap Map<String,String> fieldMap);
```

8、`@Part` 用于表单字段参数，适用于文件上传，需要配合`@Multipart`一起使用，作用于方法参数

```java
@Multipart
@POST("public")
Call<BaseResult> uploadFile(@Part MultipartBody.Part file);

```

9、`@PartMap` 用于表单字段参数，适用于文件上传，需要配合`@Multipart`一起使用，作用于方法参数

```java
@Multipart
@POST("public")
Call<BaseResult> uploadFile(@PartMap Map<String,RequestBody> RequestBodyMap);
```
10、`@Query` 用于条件字段参数，作用于方法参数，主要在GET中使用

```java
    @GET("public")
    Call<BaseResult<List<User>>> getUser(@Query("userId") String userId);
```


11、`@QueryMap` 用于条件字段参数，作用于方法参数，主要在GET中使用
```java

@GET("public")
Call<BaseResult<List<User>>> getUser(@QueryMap Map<String,String> map);
```

12、`@Body` 作用于方法参数

```java
 @POST("public")
 Call<BaseResult<List<User>>> getUser(@Body( User user);

```


注：
使用Post请求方式（数据都是被放在请求体中上传到服务器）：
1、表单提交：建议使用Field或FieldMap+FormUrlEncoded，以键值对上传到服务器；
2、JSON提交：建议使用@Body，大部分都是实体类，最后将实体类转换为JSON，上传服务器；

使用GET请求（将参数拼接在url后面的）
1、建议使用Query或QueryMap都是将参数拼接在url后面的；