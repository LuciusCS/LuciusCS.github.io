---
title: "Android 打包流程"
description: "Android 打包流程"
type: [Android]
toc: true
cover:  /cover/img97.jpg
categories: Android
date: 2020/5/30
---

## Android 打包流程

Android打包签名

签名三步：

    1、计算摘要
    2、对原始数据私钥非对称加密
    3、将签名写入签名区块

一个key store可以放置多个秘钥，同一个签名文件，给多个应用进行签名。

V2签名在Android 7.0之后出现的。


## Android签名机制


### 消息摘要

消息摘要 - Message Digest
    消息摘要（Message Digest），又称数字摘要（Digital Digest）或数字指纹（Finger Print）。简单来说，消息摘要就是在消息数据上，执行一个单向的Hash函数，生成一个固定长度的Hash值，这个Hash值即是消息摘要。

上面提到的的加密Hash函数就是消息摘要算法。它有以下特征：
    
* 无论输入的消息有多长，计算出来的消息摘要的长度总是固定的。例如应用MD5算法摘要的消息有128个比特位，用SHA-1算法摘要的消息最终有160比特位的输出，SHA-1的变体可以产生192比特位和256比特位的消息摘要。一般认为，摘要的最终输出越长，该摘要算法就越安全。 
        
* 消息摘要看起来是“随机的”。这些比特看上去是胡乱的杂凑在一起的。可以用大量的输入来检验其输出是否相同，一般，不同的输入会有不同的输出，而且输出的摘要消息可以通过随机性检验。但是，一个摘要并不是真正随机的，因为用相同的算法对相同的消息求两次摘要，其结果必然相同；而若是真正随机的，则无论如何都是无法重现的。因此消息摘要是“伪随机的”。
        
* 消息摘要函数是单向函 数，即只能进行正向的信息摘要，而无法从摘要中恢复出任何的消息，甚至根本就找不到任何与原信息相关的信息。当然，可以采用强力攻击的方法，即尝试每一个 可能的信息，计算其摘要，看看是否与已有的摘要相同，如果这样做，最终肯定会恢复出摘要的消息。但实际上，要得到的信息可能是无穷个消息之一，所以这种强力攻击几乎是无效的。
        
* 好的摘要算法，没有人能从中找到“碰撞”，虽然“碰撞”是肯定存在的（由于长明文生成短摘要的Hash必然会产生碰撞）。即对于给定的一个摘要，不可能找到一条信息使其摘要正好是给定的。或者说，无法找到两条消息，使它们的摘要相同。摘要算法有RSA公司的MD5算法和SHA-1算法及其大量的变体。

### 数字签名

事实上，任何一个公钥密码体制都可以单独地作为一种数字签名方案使用。如RSA作为数字签名方案使用时，可以定义如下：
这种签名实际上就是用信源的私钥加密消息，加密后的消息即成了签体；而用对应的公钥进 行验证，若公钥解密后的消息与原来的消息相同，则消息是完整的，否则消息不完整。它正好和公钥密码用于消息保密是相反的过程。因为只有信源才拥有自己地私 钥，别人无法重新加密源消息，所以即使有人截获且更改了源消息，也无法重新生成签体，因为只有用信源的私钥才能形成正确地签体。同样信宿只要验证用信源的 公钥解密的消息是否与明文消息相同，就可以知道消息是否被更改过，而且可以认证消息是否是确实来自意定的信源，还可以使信源不能否认曾经发送的消息。所以这样可以完成数字签名的功能。

但这种方案过于单纯，它仅可以保证消息的完整性，而无法确保消息的保密性。而且这种方案要对所有的消息进行加密操作，这在消息的长度比较大时，效率是非常低的，主要原因在于公钥体制的加解密过程的低效性。所以这种方案一般不可取。几乎所有的数字签名方案都要和快速高效的摘要算法（Hash函数）一起使用，当公钥算法与摘要算法结合起来使用时，便构成了一种有效地数字签名方案。
   
    这个过程是：
    
        
            用摘要算法对消息进行摘要。
        
        
            再把摘要值用信源的私钥加密。
        
    
    通过以上两步得到的消息就是所谓的原始信息的数字签名，发送者需要将原始信息和数字签名一同发送给接收者。而接收者在接收到原始信息和数字签名后，通过以下3步验证消息的真伪：
    
        
            先把接收到的原始消息用同样的摘要算法摘要，形成“准签体”。
        
        
            对附加上的那段数字签名，使用预先得到的公钥解密。
        
        
            比较前两步所得到的两段消息是否一致。如果一致，则表明消息确实是期望的发送者发的，且内容没有被篡改过；相反，如果不一致，则表明传送的过程中一定出了问题，消息不可信。
        
    
    这种方法使公钥加密只对消息摘要进行操作，因为一种摘要算法的摘要消息长度是固定的，而且都比较“短”（相对于消息而言），正好符合公钥加密的要求。这样效率得到了提高，而其安全性也并未因为使用摘要算法而减弱。
    综上所述，数字签名是非对称加密技术 + 消息摘要技术的结合。


3、数字证书 - Certificate
    通过数字签名技术，确实可以解决可靠通信的问题。一旦验签通过，接收者就能确信该消息是期望的发送者发送的，而发送者也不能否认曾经发送过该消息。大家有没有注意到，前面讲的数字签名方法，有一个前提，就是消息的接收者必须事先得到正确的公钥。如果一开始公钥就被别人篡改了，那坏人就会被你当成好人，而真正的消息发送者给你发的消息会被你视作无效的。而且，很多时候根本就不具备事先沟通公钥的信息通道。那么如何保证公钥的安全可信呢？这就要靠数字证书来解决了。
    数字证书是一个经证书授权（Certificate Authentication）中心数字签名的包含公钥拥有者信息以及公钥的文件。数字证书的格式普遍采用的是X.509V3国际标准，一个标准的X.509数字证书通常包含以下内容：
    
        
            证书的发布机构（Issuer）
            - 该证书是由哪个机构（CA中心）颁发的。
        
        
            证书的有效期（Validity）
            - 证书的有效期，或者说使用期限。过了该日期，证书就失效了。
        
        
            证书所有人的公钥（Public-Key）
            - 该证书所有人想要公布出去的公钥。
        
        
            证书所有人的名称（Subject）
            - 这个证书是发给谁的，或者说证书的所有者，一般是某个人或者某个公司名称、机构的名称、公司网站的网址等。
        
        
            证书所使用的签名算法（Signature algorithm）
            - 这个数字证书的数字签名所使用的加密算法，这样就可以使用证书发布机构的证书里面的公钥，根据这个算法对指纹进行解密。
        
        
            证书发行者对证书的数字签名（Thumbprint）
            - 也就是该数字证书的指纹，用于保证数字证书的完整性，确保证书没有被修改过。其原理就是在发布证书时，CA机构会根据签名算法（Signature algorithm）对整个证书计算其hash值（指纹）并和证书放在一起，使用者打开证书时，自己也根据签名算法计算一下证书的hash值（指纹），如 果和证书中记录的指纹对的上，就说明证书没有被修改过。
        
    
    可以看出，数字证书本身也用到了数字签名技术，只不过签名的内容是 整个证书（里面包含了证书所有者的公钥以及其他一些内容）。与普通数字签名不同的是，数字证书的签名者不是随随便便一个普通机构，而是CA机构。这就好像 你的大学毕业证书上签名的一般都是德高望重的校长一样。一般来说，这些CA机构的根证书已经在设备出厂前预先安装到了你的设备上了。所以，数字证书可以保 证证书里的公钥确实是这个证书所有者的，或者证书可以用来确认对方的身份。可见，数字证书主要是用来解决公钥的安全发放问题。
    综上所述，总结一下，数字签名和签名验证的大体流程如下图所示：




参考内容：
https://juejin.cn/post/6844903557037047815