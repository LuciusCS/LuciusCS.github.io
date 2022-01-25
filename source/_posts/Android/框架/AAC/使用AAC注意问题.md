


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

 ```
class BooksFragment : Fragment() {

    ...

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(BooksViewModel::class.java)

        viewModel.liveData.observe(viewLifecycleOwner, Observer { updateViews(it) })    // Usually what we want: Passing Fragment's view as LifecycleOwner
    }
    
    ...
}

 ```

### 屏幕旋转后，重新加载数据

   在Activity中的`onCreate()`方法中或者在Fragment中的`onCreateView()`方法中进行数据初始化以及逻辑操作，会触发viewModel加载一些数据，每次旋转加载数据时，可能都不会被注意到。

   例如：

   ```

class ProductViewModel(
    private val repository: ProductRepository
) : ViewModel() {

    private val productDetails = MutableLiveData<Resource<ProductDetails>>()
    private val specialOffers = MutableLiveData<Resource<SpecialOffers>>()

    fun getProductsDetails(): LiveData<Resource<ProductDetails>> {
        repository.getProductDetails()  // Loading ProductDetails from network/database
        ...                             // Getting ProductDetails from repository and updating productDetails LiveData
        return productDetails
    }

    fun loadSpecialOffers() {
        repository.getSpecialOffers()   // Loading SpecialOffers from network/database
        ...                             // Getting SpecialOffers from repository and updating specialOffers LiveData
    }
}

class ProductActivity : AppCompatActivity() {

    lateinit var productViewModelFactory: ProductViewModelFactory

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val viewModel = ViewModelProviders.of(this, productViewModelFactory).get(ProductViewModel::class.java)

        viewModel.getProductsDetails().observe(this, Observer { /*...*/ })  // (probable) Reloading product details after every rotation
        viewModel.loadSpecialOffers()                                       // (probable) Reloading special offers after every rotation
    }
}

```

根据不同的代码逻辑选择不同的解决方法：

* 使用Repository对数据进行缓存，让viewmodel加载缓存中的数据；
* 使用AbsentLiveData 只有但数据为空时，进行加载；
https://github.com/android/architecture-components-samples/blob/master/GithubBrowserSample/app/src/main/java/com/android/example/github/util/AbsentLiveData.kt
* 通过点击事件，让数据只有在需要时进行加载；
* 将数据加载放在ViewModel的构造函数中，通过getter进行调用；


```
class ProductViewModel(
    private val repository: ProductRepository
) : ViewModel() {

    private val productDetails = MutableLiveData<Resource<ProductDetails>>()
    private val specialOffers = MutableLiveData<Resource<SpecialOffers>>()

    init {
        loadProductsDetails()           // ViewModel is created only once during Activity/Fragment lifetime
    }

    private fun loadProductsDetails() { // private, just utility method to be invoked in constructor
        repository.getProductDetails()  // Loading ProductDetails from network/database
        ...                             // Getting ProductDetails from repository and updating productDetails LiveData
    }

    fun loadSpecialOffers() {           // public, intended to be invoked by other classes when needed
        repository.getSpecialOffers()   // Loading SpecialOffers from network/database
        ...                             // Getting SpecialOffers from repository and updating _specialOffers LiveData
    }

    fun getProductDetails(): LiveData<Resource<ProductDetails>> {   // Simple getter
        return productDetails
    }

    fun getSpecialOffers(): LiveData<Resource<SpecialOffers>> {     // Simple getter
        return specialOffers
    }
}

class ProductActivity : AppCompatActivity() {

    lateinit var productViewModelFactory: ProductViewModelFactory

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val viewModel = ViewModelProviders.of(this, productViewModelFactory).get(ProductViewModel::class.java)

        viewModel.getProductDetails().observe(this, Observer { /*...*/ })    // Just setting observer
        viewModel.getSpecialOffers().observe(this, Observer { /*...*/ })     // Just setting observer

        button_offers.setOnClickListener { viewModel.loadSpecialOffers() }
    }
}

```

### ViewModel引起内存泄漏

在任何时候都不能将View的引用传递给ViewModel,同时在其他类引用ViewModel时也需要进行注意，当Activity或者Fragment调用finish后，ViewModel不能在任何一个生命周期比Activity长的类中进行使用，这样Activity才会被回收。

下面的代码中，Repository是一个单例，将ViewModel传递给其一个Listener，在回收时，不能将这一个监听器清除。


```
@Singleton
class LocationRepository() {

    private var listener: ((Location) -> Unit)? = null

    fun setOnLocationChangedListener(listener: (Location) -> Unit) {
        this.listener = listener
    }

    private fun onLocationUpdated(location: Location) {
        listener?.invoke(location)
    }
}


class MapViewModel: AutoClearViewModel() {

    private val liveData = MutableLiveData<LocationRepository.Location>()
    private val repository = LocationRepository()

    init {
        repository.setOnLocationChangedListener {   // Risky: Passing listener (which holds reference to the MapViewModel)
            liveData.value = it                     // to singleton scoped LocationRepository
        }
    }
}

```


解决方法：

* 在 onCleared() 方法中移除监听器；
* 在Repository使用viewModel的弱引用；
* 使用LivewData在Respository和ViewModel之间进行通信；


```

@Singleton
class LocationRepository() {

    private var listener: ((Location) -> Unit)? = null

    fun setOnLocationChangedListener(listener: (Location) -> Unit) {
        this.listener = listener
    }

    fun removeOnLocationChangedListener() {
        this.listener = null
    }

    private fun onLocationUpdated(location: Location) {
        listener?.invoke(location)
    }
}


class MapViewModel: AutoClearViewModel() {

    private val liveData = MutableLiveData<LocationRepository.Location>()
    private val repository = LocationRepository()

    init {
        repository.setOnLocationChangedListener {   // Risky: Passing listener (which holds reference to the MapViewModel)
            liveData.value = it                     // to singleton scoped LocationRepository
        }
    }
  
    override onCleared() {                            // GOOD: Listener instance from above and MapViewModel
        repository.removeOnLocationChangedListener()  //       can now be garbage collected
    }  
}

```

### 将可编辑LiveData暴露给view使用

虽然这不算是一个Bug，但是不符合视图操作分离，View、Fragment、Activity不应该对LiveData进行操作或者更改其状态，这些应该由viewModel进行操作，因此对数据的操作我们应该进行封装。

```
class CatalogueViewModel : ViewModel() {

    // BAD: Exposing mutable LiveData
    val products = MutableLiveData<Products>()


    // GOOD: Encapsulate access to mutable LiveData through getter
    private val promotions = MutableLiveData<Promotions>()

    fun getPromotions(): LiveData<Promotions> = promotions


    // GOOD: Encapsulate access to mutable LiveData using backing property
    private val _offers = MutableLiveData<Offers>()
    val offers: LiveData<Offers> = _offers


    fun loadData(){
        products.value = loadProducts()     // Other classes can also set products value
        promotions.value = loadPromotions() // Only CatalogueViewModel can set promotions value
        _offers.value = loadOffers()        // Only CatalogueViewModel can set offers value
    }
}

```


### 每次 configuration 发生变化后，创建ViewModel的依赖

当屏幕旋转后，configuration都会发生变化，而ViewModel还存活，因此每次创建它们的依赖会变得多余，而且会出现其他问题，这些很容易被忽略。

ViewModelProvider提供ViewModel的实例，而不是ViewModelFactory的实例。

```

class MoviesViewModel(
    private val repository: MoviesRepository,
    private val stringProvider: StringProvider,
    private val authorisationService: AuthorisationService
) : ViewModel() {
    
    ...
}


class MoviesViewModelFactory(   // We need to create instances of below dependencies to create instance of MoviesViewModelFactory
    private val repository: MoviesRepository,
    private val stringProvider: StringProvider,
    private val authorisationService: AuthorisationService
) : ViewModelProvider.Factory {

    override fun <T : ViewModel> create(modelClass: Class<T>): T {  // but this method is called by ViewModelProvider only if ViewModel wasn't already created
        return MoviesViewModel(repository, stringProvider, authorisationService) as T
    }
}


class MoviesActivity : AppCompatActivity() {

    @Inject
    lateinit var viewModelFactory: MoviesViewModelFactory

    private lateinit var viewModel: MoviesViewModel

    override fun onCreate(savedInstanceState: Bundle?) {    // Called each time Activity is recreated
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_movies)

        injectDependencies() // Creating new instance of MoviesViewModelFactory

        viewModel = ViewModelProviders.of(this, viewModelFactory).get(MoviesViewModel::class.java)
    }
    
    ...
}

```

每一次configuration发生变化时，我们都会创建 ViewModelFactory 的实例，没有必要的创建了很多依赖的实例。

解决方法：
    直到 create()方法真正被调用时，才去创建依赖的实例，因为其在Activity/Fragment只会被调用一次，如使用lazy进行加载。




```


class MoviesViewModel(
    private val repository: MoviesRepository,
    private val stringProvider: StringProvider,
    private val authorisationService: AuthorisationService
) : ViewModel() {
    
    ...
}


class MoviesViewModelFactory(
    private val repository: Provider<MoviesRepository>,             // Passing Providers here 
    private val stringProvider: Provider<StringProvider>,           // instead of passing directly dependencies
    private val authorisationService: Provider<AuthorisationService>
) : ViewModelProvider.Factory {

    override fun <T : ViewModel> create(modelClass: Class<T>): T {  // This method is called by ViewModelProvider only if ViewModel wasn't already created
        return MoviesViewModel(repository.get(),                    
                               stringProvider.get(),                // Deferred creating dependencies only if new insance of ViewModel is needed
                               authorisationService.get()
                              ) as T
    }
}


class MoviesActivity : AppCompatActivity() {

    @Inject
    lateinit var viewModelFactory: MoviesViewModelFactory

    private lateinit var viewModel: MoviesViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_movies)
      
        injectDependencies() // Creating new instance of MoviesViewModelFactory

        viewModel = ViewModelProviders.of(this, viewModelFactory).get(MoviesViewModel::class.java)
    }
    
    ...
}

```




参考资料:https://proandroiddev.com/5-common-mistakes-when-using-architecture-components-403e9899f4cb

