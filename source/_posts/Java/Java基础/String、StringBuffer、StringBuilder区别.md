### String、StringBuffer、StringBuilder

`String`类对象是immutable,即不可改变的，在源码对String操作的方法中，返回的都是一个新的`String`对象；

`StringBuffer`和`StringBuilder`对象是可以改变的，变化时基于原来的对象基础上机型改变。

### StringBuffer VS. String Builder

StringBuffer是线程安全的，有加锁开销，效率低；StringBuilder非线程安全，不需要加锁，效率高；StringBuilder是JDK 1.5之后引入的，之前只能使用StringBuilder。

### '+' VS. StringBuilder



### byte[]和String类型相互转化

byte[]转换为String,如果是非法值，可能转换不成功

```
    //用于测试String和byte之间的相互转化
    String testString="1234566789";
    byte[] testByte=testString.getBytes();
    try {
        String string=new String(testByte, "UTF-8");
        System.out.println(string);
    } catch (UnsupportedEncodingException e) {
        e.printStackTrace();
    }
```