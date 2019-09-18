# 使用SearchView以及RecyclerView实现条目删选

\#\# 使用SearchView以及RecyclerView实现条目删选

## SearchView介绍

SearchView继承图 ![SearchView&#x7EE7;&#x627F;&#x56FE;](https://img-blog.csdn.net/20180609094538321?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM2NDIyNzQz/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70) SearchView为用户提供一个接口，用户在输入到搜索信息后，会从数据源对数据进行筛选，然后获取筛选列表

## RecyclerView介绍

RecyclerView是一个比ListView布局更加强大的与灵活的布局方式，在使用的过程中可以通LayoutManager布局管理器控制每一个item的布局方式,通过ItemAnimator每一个Item增加与删除的动画效果，通过ItemDecoration设置Item之间的间隔控制，如果要是打算为每一个item添加点击事件，自己写吧，哈哈哈哈哈。

## 代码实现

### 搜索框的添加

1、在res/menu文件夹下添加menu\_main，即MainActivity的菜单栏

```text
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">

    <item
        android:id="@+id/action_search"
        android:icon="@android:drawable/ic_menu_search"
        android:title="@string/action_search"
        app:actionViewClass="android.support.v7.widget.SearchView"
        app:showAsAction="always|collapseActionView" />

</menu>
```

2、在MainActivity中添加搜索框，以及为搜索框添加文字输入监听事件

注：有时会出现下面的错误，这时需要将MainActivity导入的import android.widget.SearchView;替换为import android.support.v7.widget.SearchView

```text
 java.lang.ClassCastException: android.support.v7.widget.SearchView cannot be cast to android.widget.SearchView
```

MainActivity中的代码

```java
public class MainActivity extends AppCompatActivity implements SearchView.OnQueryTextListener{
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {

        getMenuInflater().inflate(R.menu.menu_main,menu);
        MenuItem menuItem=menu.findItem(R.id.action_search);
        SearchView searchView=(SearchView) MenuItemCompat.getActionView(menuItem);
        searchView.setOnQueryTextListener(this);
        return true;
    }

    @Override
    public boolean onQueryTextSubmit(String query) {
        return false;
    }

    @Override
    public boolean onQueryTextChange(String newText) {
        return false;
    }
}
```

显示效果如图所示：

!\[这里写图片描述\]\(https://img-blog.csdn.net/20180609095410214?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM2NDIyNzQz/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70\)

### RecylerViewAdapter编写

1、在build.gradle\(Module:app\)中添加依赖

```text
dependencies {
    implementation 'com.android.support:recyclerview-v7:27.1.0'
}
```

2、RecyclerView列表中每一个item布局文件item\_recyclerview的编写

```markup
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical">

    <android.support.v7.widget.CardView
        android:layout_width="match_parent"
        android:layout_height="50dp"
        app:cardCornerRadius="5dp">

        <TextView
            android:id="@+id/word_tv"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:gravity="center"
            android:layout_gravity="center"
            android:text="word"
            android:textSize="25sp" />
    </android.support.v7.widget.CardView>
</LinearLayout>
```

3、RecylerViewAdapter编写

```text
public class RecyclerViewAdapter extends RecyclerView.Adapter<RecyclerViewAdapter.ViewHolder>{

    private List<String>strings;

    public RecyclerViewAdapter(List<String>strings) {
        this.strings=strings;
    }


    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_recyclerview, parent, false);
        ViewHolder viewHolder=new ViewHolder(view);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        ((ViewHolder)holder).words.setText(strings.get(position));
    }

    @Override
    public int getItemCount() {
        return strings.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{

        TextView words;

        public ViewHolder(View itemView) {
            super(itemView);
            words=(TextView)itemView.findViewById(R.id.word_tv);
        }
    }

}
```

### 在MainActivity中添加RecyclerView布局

1、在布局文件activity\_main中添加RecyclerView布局

```text
<android.support.v7.widget.RecyclerView
    android:id="@+id/main_recyclerview"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

</android.support.v7.widget.RecyclerView>
```

2、在MainActivity中为RecyclerView添加适配器

```text
    //省略部分代码

    private RecyclerView recyclerView;
    private RecyclerViewAdapter recyclerViewAdapter;

    private List<String>words;

    private RecyclerView.LayoutManager layoutManager;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        recyclerView=findViewById(R.id.main_recyclerview);
        layoutManager=new LinearLayoutManager(MainActivity.this);
        words=new ArrayList<>();
        words.add("abc");
        words.add("abc");
        words.add("abc");
        recyclerViewAdapter=new RecyclerViewAdapter(words);
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.setAdapter(recyclerViewAdapter);

    }
```

结果显示：

!\[这里写图片描述\]\(https://img-blog.csdn.net/20180609101323167?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM2NDIyNzQz/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70\)

### 在MainActivity中添加筛选方法

```text
    private List<String>filter(List<String>strings,String text){
        filterString=new ArrayList<>();

        for (String word:words){
            if (word.contains(text))
                filterString.add(word);
        }
        return filterString;
    }
```

### 在RecyclerViewAdapter中设置筛选后的单词的显示

```text
   //省略部分代码
 public void setFilter(List<String>filterWords){
        words=filterWords;
        notifyDataSetChanged();
    }
```

### 当检测到SearchView中输入变化时进行单词筛选

```text
    @Override
    public boolean onQueryTextChange(String newText) {

        filterString=filter(words,newText);
        recyclerViewAdapter.setFilter(filterString);
        return true;
    }
```

## 运行结果

!\[这里写图片描述\]\(https://img-blog.csdn.net/20180609101729113?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM2NDIyNzQz/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70\)

[源码地址](https://download.csdn.net/download/qq_36422743/10468538%20源码地址)

