

#### JSONString与HashMap之间的转换

* HashMap转换为JsonString

```java
    Map<String, String> hashMap = new HashMap<>();
    String JSONString=JSON.toJSONString(hashMap);
```


* JsonString转换为HashMap
```java
    Map<String, String> hashMap = new HashMap<>();
    hashMap= JSON.parseObject(JSONString, Map.class);
    
    //错误方式
    hashMap= (Map<String, String>) JSON.parse(JSONString);
```

**注：使用错误方式将JsonString转换为HashMap，会导致HashMap中只有一组数据**


#### 知识点

* 在使用fastjson进行转换的过程中，需要保证Object需要有默认的构造函数，如果Object中有其他Object变量，Object变量也需要有默认构造函数，否则会造成转化失败
