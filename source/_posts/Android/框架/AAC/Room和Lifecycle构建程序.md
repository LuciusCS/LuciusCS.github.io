---
title: 使用框架组件Room和Lifecycle来创建应用
thumbnail: /thumbnail/img30.jpg
toc: true
description: 使用框架组件Room和Lifecycle来创建应用
categories: Android
tags: [Android]
date: 2018/11/19

---

# 使用框架组件Room和Lifecycle来创建应用

## 在build.gradle\(Module:app\)中添加依赖
<!--more-->
```markup
//Room组件
implementation "android.arch.persistence.room:runtime:$rootProject.roomVersion"
annotationProcessor "android.arch.persistence.room:compiler:$rootProject.roomVersion"
androidTestImplementation "android.arch.persistence.room:testing:$rootProject.roomVersion"

//lifestyle组件
implementation "android.arch.lifecycle:extensions:$rootProject.archLifecycleVersion"
annotationProcessor "android.arch.lifecycle:compiler:$rootProject.archLifecycleVersion"
```

## 创建一个Entity实体

在应用中数据是words，每一个word都是一个实体，创建一个`Word`类，同时需要创建构造函数以及`getter`方法，只要这样Room才会实例化`Object`

假装右图！！！！

代码如下：

```java
public class Word {

   private String mWord;

   public Word(@NonNull String word) {this.mWord = word;}

   public String getWord(){return this.mWord;}
}
```

要使得`Word`类对Room数据库有意义，需要为其添加注解。注解定义了该类的每一部分与数据库中的实体的关系，Room通过注解的信息生成相应代码。

* `@Entity(tableName = "word_table")`

  每一个`@Entity`类代表数据表中的一个实体。

* `@PrimaryKey`

  每一个实体都需要一个主键，为了表示方便，在这里将每一个`word`自身作为其主键。

* `@NonNull`

  声明参数、域或者方法的返回值不为空。

* `@ColumnInfo(name = "word")`

  当需要指定与类中的成员变量不同的列名时使用。

```java
@Entity(tableName = "word_table")
public class Word {

   @PrimaryKey
   @NonNull
   @ColumnInfo(name = "word")
   private String mWord;

   public Word(String word) {this.mWord = word;}

   public String getWord(){return this.mWord;}
}
```

## 创建Dao

在`Dao`\(data access object\)中，指定sql查询语句并将其与调用方法相联结。Dao需要为接口或者抽象类，**在默认状态下，所有的查询语句都需要在单独的线程中运行**。Room使用`Dao`可以使得代码更加简洁。

* 创建一个新的接口声明为`WordDao`
* 使用功注解`@Dao`来定义该类为Room的一个Dao类
* 声明插入一个word的方法`void insert(Word word)`
* 为该方法添加`@Insert`注解，**在方法中不需要提供任何sql语句**（还有`@Delete`以及`@Update`等注解）。
* 声明一个删除所有words的方法`void deleteAll();`
* 使用`@Query`注解，用于查询以及其他操作，`@Query("DELETE FROM word_table")`。
* 创建一个获取所有单词的方法，`getAllWords();`返回值为List,通过注解的方式为此方法添加SQL查询语句`@Query("SELECT * from word_table ORDER BY word ASC")`

```text
@Dao
public interface WordDao {

   @Insert
   void insert(Word word);

   @Query("DELETE FROM word_table")
   void deleteAll();

   @Query("SELECT * from word_table ORDER BY word ASC")
   List<Word> getAllWords();
}
```

## LiveData类的使用

当数据发生改变时，通常需要进行更新UI或者显示UI的操作，需要观察到数据的改变。通过复杂的组件观察到数据改变会很麻烦，在组件之间会有各种依赖关系的产生。

`LiveData`是一个数据生命周期观察库\(lifecycle\_library\)，为了解决上面的问题，使用`LiveData`类型的数据返回值，当数据库更新时，Room会生成所有必要的代码来更新`LiveData`

> 当你需要离开Room独立使用`LiveData`时，你需要更新数据，因为`LiveData`方法没有公有的方法来更新已经存储的数据。

在`WordDao`中，将`getAllWords`的返回值包裹在`LiveData`中

```java
 @Query("SELECT * from word_table ORDER BY word ASC")
 LiveData<List<Word>> getAllWords();
```

## 添加Room数据库

### Room数据库层介绍

Room是在SQLite数据库上面的数据库层，Room可以处理之前需要在`SQLiteOpenHelper`中处理的单调的工作。

* Room使用Dao来查询数据库。
* 在默认状态下，Room不可以在主线程中操作数据库，`LiveData`通过自动的方式在后台进程中实现异步查询。
* Room在编译的时候检查数据库的Sql语句
* Room类需要时抽象类并继承自RoomDatabase
* Room数据库在整个App中需要以单例模式初始化。

### 实现Room数据库

1. 创建一个`public abstract`类继承自`RoomDatabase`，`public abstract class WordRoomDatabase extends RoomDatabase {}`
2. 将类使用注解为Room数据库，声明属于数据库的实体类并设置版本号，列出的实体类将在数据库中创建出相应的数据表。`@Database(entities = {Word.class}, version = 1)`
3. 定义与数据库操作相关的Dao，并使用抽象方法，代码如下：

```java
@Database(entities = {Word.class}, version = 1)
public abstract class WordRoomDatabase extends RoomDatabase {
   public abstract WordDao wordDao();

}
```

4.将`WordRoomDatabase`设置为单例模式，防止多次实例化数据库同时出现同时打开的问题。

代码如下：

```java
private static WordRoomDatabase INSTANCE;

public static WordRoomDatabase getDatabase(final Context context) {
   if (INSTANCE == null) {
       synchronized (WordRoomDatabase.class) {
           if (INSTANCE == null) {
               // Create database here
           }
       }
   }
   return INSTANCE;
}
```

5.添加获取到数据库的代码

代码如下：

```java
INSTANCE = Room.databaseBuilder(context.getApplicationContext(),
       WordRoomDatabase.class, "word_database")
       .build();
```

完整代码如下：

```java
@Database(entities = {Word.class}, version = 1)
public abstract class WordRoomDatabase extends RoomDatabase {

   public abstract WordDao wordDao();

   private static WordRoomDatabase INSTANCE;


   static WordRoomDatabase getDatabase(final Context context) {
       if (INSTANCE == null) {
           synchronized (WordRoomDatabase.class) {
               if (INSTANCE == null) {
                   INSTANCE = Room.databaseBuilder(context.getApplicationContext(),
                           WordRoomDatabase.class, "word_database")
                           .build();                

               }
           }
       }
       return INSTANCE;
   }

}
```

## 创建一个Repository

### Repository介绍

Repository是一个抽象类用于获取到多种数据源中的数据，Repository不属于结构化组件库，推荐使用它，用于将代码组件分离，`Repository`类用于操作数据。

假装有图~~~

Repository用于管理查询\(query\)线程，可以使用多个后台线程。在大多数情况下，Repository实现的逻辑用于决定从网络中获取数据还是从本地缓存中获取。

### 实现Repository

1.创建一个名为`WordRepository`的公有类

2.创建Dao类型的成员变量以及word列表

```java
private WordDao mWordDao;
private LiveData<List<Word>> mAllWords;
```

3.添加构造函数，获得数据库的控制并初始化成员变量

```java
WordRepository(Application application) {
    WordRoomDatabase db = WordRoomDatabase.getDatabase(application);
    mWordDao = db.wordDao();
    mAllWords = mWordDao.getAllWords();
}
```

4.添加`getAllWords()`方法，并使用进行封装，Room将所有的查询放置在独立的线程，当数据发生改变时，已经被订阅的`LiveData`将会通知订阅者。

```java
LiveData<List<Word>> getAllWords() {
   return mAllWords;
}
```

5.封装`insert()`方法，`insert()`方法的调用需要在独立的非UI线程中进行，Room可以保证不会在主线程中进行耗时操作。

```java
public void insert (Word word) {
    new insertAsyncTask(mWordDao).execute(word);
}
```

6.`insertAsyncTask`方法

```text
private static class insertAsyncTask extends AsyncTask<Word, Void, Void> {

    private WordDao mAsyncTaskDao;

    insertAsyncTask(WordDao dao) {
        mAsyncTaskDao = dao;
    }

    @Override
    protected Void doInBackground(final Word... params) {
        mAsyncTaskDao.insert(params[0]);
        return null;
    }
}
```

完整代码：

```text
public class WordRepository {

   private WordDao mWordDao;
   private LiveData<List<Word>> mAllWords;

   WordRepository(Application application) {
       WordRoomDatabase db = WordRoomDatabase.getDatabase(application);
       mWordDao = db.wordDao();
       mAllWords = mWordDao.getAllWords();
   }

   LiveData<List<Word>> getAllWords() {
       return mAllWords;
   }


   public void insert (Word word) {
       new insertAsyncTask(mWordDao).execute(word);
   }

   private static class insertAsyncTask extends AsyncTask<Word, Void, Void> {

       private WordDao mAsyncTaskDao;

       insertAsyncTask(WordDao dao) {
           mAsyncTaskDao = dao;
       }

       @Override
       protected Void doInBackground(final Word... params) {
           mAsyncTaskDao.insert(params[0]);
           return null;
       }
   }
}
```

## 创建一个ViewModel

`ViewModel`是用于向UI提供数据以及服务信息配置改变，`ViewModel`起着Repository与UI之间的交流中心的作用。可以使用`ViewModel`在fragment之间共享数据。`ViewModel`也是lifecycle library的一部分。

`ViewModel`使用的是life-conscious的方式操作APP的UI数据，将UI从Activity以及Fragment类中分离出来，使得编码的过程更加符合以下原则：`Activity`以及`Fragment`的主要作用是在屏幕中绘制UI，而`ViewModel`的作用是控制操作UI需要的所有的数据。

在`ViewModel`中使用`LiveData`来表示那些UI显示过程中会发生改变的数据，使用`LiveData`主要有以下的优点：

* 可以使用为数据添加一个观察者（而不是轮询的方式），只有当数据确实发生改变的时候才更新UI。
* Repository以及UI通过`ViewModel`彻底分离开来，在`ViewModel`中不会调用数据库中的内容。

### 实现ViewModel

* 创建`WordViewModel`类，继承自`AndroidViewModel`

```java
public class WordViewModel extends AndroidViewModel {}
```

* 创建Repository的成员变量

  \`\`\`java

  private WordRepository mRepository;

```text
* 创建LiveData成员变量用于缓存word列表

```java

  private LiveData<List<Word>> mAllWords;
```

* 创建构造函数

```java
     public WordViewModel (Application application) {
       super(application);
       mRepository = new WordRepository(application);
       mAllWords = mRepository.getAllWords();
   }
```

* 创建`getter`方法获取所有的word，对于UI来说数据的获取已经被完全隐藏。

```text
 LiveData<List<Word>> getAllWords() { return mAllWords; }
```

* 创建`insert()`方法，用于调用Repostory中的`insert()`方法，这样随UI可以完全隐藏`insert()`方法的实现。

`WordViewModel`类的完整实现方法如下：

```java
public class WordViewModel extends AndroidViewModel {

   private WordRepository mRepository;

   private LiveData<List<Word>> mAllWords;

   public WordViewModel (Application application) {
       super(application);
       mRepository = new WordRepository(application);
       mAllWords = mRepository.getAllWords();
   }

   LiveData<List<Word>> getAllWords() { return mAllWords; }

   public void insert(Word word) { mRepository.insert(word); }
}
```

**注：不可以向**`ViewModel`**实例中传递**`Context`**参数，也不可以在其实实例化Activity、Fragment或者View以及他们的context。**

**Activity在设备进行旋转的时候，在ViewModel的生命周期中，它有可能会被创建或者被销毁多次。如果你在**`ViewModel`**中引用了Activity，当Activity被销毁的时候，你将会指向一个空的引用，会造成内存泄漏。**

