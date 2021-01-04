

## Flutter问题解决


### Couldn't read file io\flutter\plugins\pathprovider\PathProviderPlugin.java even though it exists. Please verify that this file has read permission and try again.

解决方法：https://stackoverflow.com/questions/60480786/flutter-packages-get-failes-with-error-couldnt-read-file-localfile


```xml

    flutter clean
    flutter pub cache repair
    flutter pub get
```