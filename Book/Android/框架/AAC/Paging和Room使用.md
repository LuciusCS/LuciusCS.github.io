# Android框架组件paging+room的使用

## 简介：

### DataSource

DataSource持有数据库的数据或者来自于网络的数据提供给PagedLists使用，PagedListed由LivePagedListBuilder产生，具有多个可以进行选择的参数。PagedList会持有DataSource的一个副本，


创建一个`PagedList`被观察者的对象，需要将一个`DataSource.Factory`的实例传递给`LivePagedListBuilder`对象。一个DataSource对象为单一的`PagedList`加载pages。当数据更新时，工厂类会创建一个`PagedSource`的实例，如：数据库的表更新或者网络数据更新。Room持久化数据层可以提供`DataSource.Factory`对象，或者可以自己创建`DataSource.Factory`

Room持久化数据层提供与Paging library相关的dataSource相关的原生支持。对于通过Room从数据库中查询的数据，Room从Dao中返回一个DataSource.Factory，并将DataSource的实现类返回给用户。相应代码如下：

```java
@Query("SELECT * FROM COUNTRIES")
public abstract DataSource.Factory<Integer,Country> getCountries();
```

### PagedList

PagedList是paging库的一个重要组成类，可以使得RecyclerView从DataSource中加载大量的数据。PagedList采用异步的方式将数据加载在界面中。

### PagedListAdapter

PagedListAdapter是一个`RecyclerView.Adapter`用于表示来自PagedList的数据。PagedListAdapter listens to PagedList loading callbacks as pages are loaded, and uses DiffUtil to compute fine grained updates as new PagedLists are received and then display the list to user in your UI with a recyclerView. ？？？

## 将架构组件添加到项目中

在build.gradle中添加下面的依赖

```markup
    //recyclerView
    implementation 'com.android.support:recyclerview-v7:27.1.0'

    // ViewModel and LiveData
    implementation "android.arch.lifecycle:extensions:1.1.1"
    annotationProcessor "android.arch.lifecycle:compiler:1.1.1"

   // Room
    implementation "android.arch.persistence.room:runtime:1.1.1"
    annotationProcessor "android.arch.persistence.room:compiler:1.1.1"

    // Paging
    implementation "android.arch.paging:runtime:1.0.1"
```

## 创建DataSource

### 创建实体

### 创建Dao层

DataSource.Factory\(在Room中实现\)创建

### 创建数据库

### 创建ViewModel

LivePagedListBuilder会使用

LivePagedListBuilder需要创建PageList对象，当一个新的PagedList被创建出，Livedata会将新的PagedList传递到ViewModel中，相应的数据也将传送给UI，当UI观察到PagedList发生变化，会使用它的PagedListAdapter更新RecyclerView的界面，显示出PagedList中的数据。

创建和配置LiveData，需要使用LivePagedBuilder以及DataSource.Factory,并对PagedList的部分属性进行设置，主要包括以下几个方法：

* setPageSize\(int\)：
* setPrefetchDistance\(int\)：
* setInitialLoadSizeHint\(int\)：设置页面中第一次显示的数量
* setEnablePlaceholders\(boolean\) ：

在`onCreate`方法中，需要对ViewModel进行实例化，在ViewModel中LiveData类发送新的PagedList到ViewModel, 再相应地传递到UI中，UI观察到PagedList发生改变，会调用PagedListAdapter更新显示在RecyclerView中的数据。

## 创建Adapter

使用PagedAdapter将PagedList数据与RecyclerView进行绑定，使用`DiffCallback`来帮助PagedAdapter区分不同的适配元素，在实现DiffCallback类的时候需要重写两个方法：

* areItemsTheSame:判断是否指向了同一个数据元素。
* areContentsTheSame:判断

