


## 使用 Architecture Components 注意问题

### Fragment中的观察者泄露

当Fragment 触发 deatch然后再次调用attach时，并不是总会调用destory方法，如：当 configuration 发生改变时，fragment重建不会调用onDestory，在这种情况下，fragment的实例还存在，只是视图销毁了，onDestroy() 没有被调用，没有到达生命周期中的 DESTROYED状态 ；


```
class BooksFragment: Fragment() {

    private lateinit var viewModel: BooksViewModel

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_books, container)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(BooksViewModel::class.java)

        viewModel.liveData.observe(this, Observer { updateViews(it) })  // Risky: Passing Fragment as LifecycleOwner
    }
    

}

```
 代码在onCreateView()中添加Livedata的观察者，或者在 onActivityCreated()中添加Fragment作为 LifecycleOwner，当Fragment重新绑定至Activity时，将会重新传递一个观察者的实例，但是Livedata不会将原有的观察者移除，因为Fragment没有进入DESTROYED状态。

 解决方法：通过调用getViewLifecycleOwner() 或者 getViewLifecycleOwnerLiveData() 使用View的生命周期，这样当View被销毁时，LiveData都会把观察者移除；
     