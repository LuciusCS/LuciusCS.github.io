








## 体积优化


1、配置编译选项 

（Levels选项内）Generate Debug Symbols  设置为NO，这个配置选项应该会让你减去小半的体积。注意这个如果设置成NO就不会在断点处停下



Android 体积优化
https://juejin.cn/post/6844904186446872584



```
    buildTypes {
        release {
            //之前看QQ微信等大佬都只用"armeabi"
            signingConfig signingConfigs.release
            ndk{
                //之前看QQ微信等大佬都只用"armeabi"
                abiFilters "armeabi-v7a"
            }
        }
        debug {
            ndk {
                //这里配置开发调试时的，根据个人需要增减少，x86建议加上不然部分模拟器回报错
                abiFilters  "armeabi-v7a","arm64-v8a", "x86"
            }
        }

    }

```    


目前android支持如下7中CPU架构:
。armeabi 第5代 ARM v5TE，使用软件浮点运算，兼容所有ARM设备，通用性强，速度慢 (只支持armeabi)
·armeabi-v7a 第7代 ARMv7，使用硬件浮点运算，具有高级扩展功能(支持armeabi和armeabiv7a,
目前大部分手机都是这个架构)
·arm64-v8a 第8代，64位，包含AArch32、AArch64两个执行状态对应32、64bit (支持 armeabi-v7a.armeabi 和 arm64-v8a)
。x86 intel 32位，一般用于平板 (支持 armeabi(性能有所损耗)和 x86)
。x86 64 intel 64位，一般用于平板 (支持 x86和x86_64)
。mips 基本没见过(支持 mips)
。mips64 基本没见过(支持 mips  mips 64)




## 提升编译速度

复杂的room语句会减缓编译速度


## 台区大师原生打包  Pad_Master 工程


Android Studio左下方 Build Vaiants 选择不同的打包配置