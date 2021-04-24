

### @+id 和 @id的区别

* 对于@+id/some_value: 如果R.java中没有some_value这个值, 则在R.java中生成一个some_value值; 如果有则直接使用已经存在的值.
* 对于@id/some_value: 如果R.java中存在some_value这个值, 则使用此值; 否则会造成编译错误.



### @+id 和 @id 使用最佳实践
* 为了重用id, 可以在res/values目录下创建一个ids.xml文件, 在其中定义可以重用的id, 然后在其他布局文件中使用@id引用之 (这样可以减少R.java文件中生成的id数量)

* 对于没有在ids.xml文件中定义的id, 尽量使用@+id来引用. (这样可以避免由于View定义顺序而导致编译错误)

