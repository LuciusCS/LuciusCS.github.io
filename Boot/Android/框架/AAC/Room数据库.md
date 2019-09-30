
### 1、数据库在表中可以指定多个主键

```java

    @Entity(primaryKeys = {"firstName", "lastName"})
    public class User{
         
         public String firstName;
         public String lastName;
         
         
         //使用Ignore使得该变量不生成表段名
         
         @Ignore
         Bitmap bitmap;
    }

```
如果有类继承自上述Person类，但不想bitmap生成数据表中的列，可以使用ignoredColumns

```
    public class RemotePerson extends Person {
        @PrimaryKey
        public int id;

        public boolean hasVpn;
    }

```

### 2、Entity进行嵌套

如果定义的Entity类中有某一对象，并且在表列字段生成该对象的变量，使用@Embedded

```
    public class Address {
        public String street;
        public String state;
        public String city;
    
        @ColumnInfo(name = "post_code")
        public int postCode;
    }    

    @Entity
    public class Person{
        @PrimaryKey
        public int id;

        public String firstName;

        @Embedded
        public Address address;
    }

```

这样在Person表中有id,firstName,street,state,city,post_code等字段

### 3、插入数据产生冲突时操作

```
    @Dao
    public interface UserDao{
        //插入如果冲突则替换    
        @Insert(onConflict = OnConflictStrategy.REPLACE)
        public void insertUser(User ... users);
    
    }

```

### 用于对数据表中某一列进行更新

```
     @Query("UPDATE item SET quantity = quantity + 1 WHERE id = :id")
     void updateQuantity(int id)
     //item为表名

```






