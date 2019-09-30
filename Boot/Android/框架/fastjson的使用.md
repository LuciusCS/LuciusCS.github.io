

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
