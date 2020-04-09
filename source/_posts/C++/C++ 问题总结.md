
## pthread和std::thread

* `std::thread` 是ISO C++ 标准提供的特性，可以在C++ 11 编译下使用；`pthread` 是IEEE标准，而非C++ 标准的一部分。

* 如果代码需要在多个平台下运行，则使用`std::thread`，如果没有多平台问题，则使用`pthread`。

* `pthread`是POSIX的一部分，可以在多种 linux 系统下运行，但不能再Windows的native中调用

* `pthread` 是C语言的API，在C语言中可以方便调用，但在C++中使用没有优势

* `std::thread`是一个标准的C++ API，所以可以任何有C++ 编译器的系统中使用

* `std::thread`是一个标准的C++ API，使得其不能在C语言中进行调用。 
