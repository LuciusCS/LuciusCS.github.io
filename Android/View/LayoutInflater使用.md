
LayoutInflater用于给相应的View对象实例化一个layout(即：将一个xml文件转化为一个View对象),在开发过程中不会直接使用，而是通过Activity.getLayoutInflater()或者Context.getSystemService(Class)方法，获取一个标准的实例，该实例已经与当前Context相关联。

* LayoutInflater通常用于动态载入的页面，使用LayoutInflater的inflate方法动态接入layout文件。

* findViewById用于已载入的界面，使用findViewById来获取其中的界面元素


## 获取LayoutInflater实例的方法

* 1、通过系统服务获取布局加载器
```
    LayoutInflater inflater = (LayoutInflater) getSystemService(Context.LAYOUT_INFLATER_SERVICE);
```
* 2、通过activity中的getLayoutInflater()方法
```
    LayoutInflater inflater = getLayoutInflater();
```

* 3、通过LayoutInflater的from静态方法

```
    LayoutInflater inflater = LayoutInflater.from(this)
```

**这三种方式本质都是调用Context.getSystemService()**

## 使用inflate方法加载布局

LayoutInflater提供四种加载布局的方法

* public View inflate (int resource, ViewGroup root)
* public View inflate (int resource, ViewGroup root, boolean attachToRoot)
* public View inflate (XmlPullParser parser, ViewGroup root)
* public View inflate (XmlPullParser parser, ViewGroup root, boolean attachToRoot)


**ViewGroup root：指实例的布局所要放入的根视图**
**boolean attachToToot：指是否附加到传入的根视图**


1、当root为null，attachToRoot为任何值都毫无意义，只会单纯加载布局文件。
2、当root不为null，attachToRoot设为true,第一个参数指定的layout文件将会inflate并且绑定到root上。
3、当root不为null，attachToRoot为false，此时View并没有添加到root,但view的layout属性被保留下来，如果调用addView(View child)，layout属性会自动生效。

**即attachToRoot为true,布局文件的View将会与root绑定，如果为false View将会通过其他方式添加到ViewGroup中，为false时返回View**

### 示例：将button布局添加到LinearLayout上

```
    <Button xmlns:android=”http://schemas.android.com/apk/res/android"
     android:layout_width=”match_parent”
     android:layout_height=”wrap_content”
     android:text=”@string/action_attach_to_root_true”
     android:id=”@+id/button_ok”>
    </Button>
```
Button的layout params类型是LinearLayout.LayoutParams

**将attachRoot设置为true**

```
    inflater.inflate(R.layout.view_button, mLinearLayout, true);
```
**将attachRoot设置为false**
当attachRoot设置为false后，

```
    Button btn = (Button)inflater.inflate
                    (R.layout.view_button,parent,false);
    parent.addView(btn);
```

同样的在RecyclerView中需要将attachRoot设置为false，因为在RecyclerView中时由RecyclerView来决定什么时候将childView inflate而不是开发人员。    

**在AlertDialog使用功时，无需传递ViewGroup参数，指定为null即可**





