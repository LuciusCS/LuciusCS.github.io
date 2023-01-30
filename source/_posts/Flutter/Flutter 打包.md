





 ## 不同Flavor 打包方式

 ```xml
//开发环境：
flutter build apk --debug --flavor flavordev -t lib/main_android_dev.dart
flutter build apk --release --flavor flavordev -t lib/main_android_dev.dart
//测试环境：
flutter build apk --debug --flavor flavortest -t lib/main_android_test.dart
flutter build apk --release --flavor flavortest -t lib/main_android_test.dart
//生产环境：
flutter build apk --debug --flavor flavoronline -t lib/main_android_online.dart
flutter build apk --release --flavor flavoronline -t lib/main_android_online.dart

 ```



 ##  生成 keystore

 ```
   keytool -genkey -v -keystore ~/key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias key

 ```


 记录：

