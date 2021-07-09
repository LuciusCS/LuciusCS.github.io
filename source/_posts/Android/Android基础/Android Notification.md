



### 创建通知渠道
* channelId 通知渠道的ID 可以是任意的字符串，全局唯一就可以
* channelName 通知渠道的名称，这个是用户可见的，开发者需要认真规划的命名
* importance 通知渠道的重要等级，有一下几个等级，不过这个用户都是可以手动修改的



### 添加通知出现的问题
#### 1、不能发出通知
日志打印内容

```
E/NotificationService: No Channel found for pkg=×××, channelId=null, id=952, tag=null, opPkg=×××, callingUid=10080, userId=0, incomingUserId=0, notificationUid=10080, notification=Notification(channel=null pri=1 contentView=null vibrate=default sound=default tick defaults=0x3 flags=0x10 color=0x00000000 vis=PRIVATE)


```

源码位置 `NotificationManagerService.java -> enqueueNotificationInternal()` 

源码

```
String channelId = notification.getChannelId();

final NotificationChannel channel = mRankingHelper.getNotificationChannel(pkg,
        notificationUid, channelId, false /* includeDeleted */);
if (channel == null) {
    final String noChannelStr = "No Channel found for "
            + "pkg=" + pkg
            + ", channelId=" + channelId
            + ", id=" + id
            + ", tag=" + tag
            + ", opPkg=" + opPkg
            + ", callingUid=" + callingUid
            + ", userId=" + userId
            + ", incomingUserId=" + incomingUserId
            + ", notificationUid=" + notificationUid
            + ", notification=" + notification;
    Log.e(TAG, noChannelStr);
    doChannelWarningToast("Developer warning for package \"" + pkg + "\"\n" +
            "Failed to post notification on channel \"" + channelId + "\"\n" +
            "See log for more details");
    return;
}
```

源码位置   `RankingHelper.java -> createDefaultChannelIfNeeded()`

源码

```

private boolean shouldHaveDefaultChannel(Record r) throws NameNotFoundException {
    final int userId = UserHandle.getUserId(r.uid);
    final ApplicationInfo applicationInfo = mPm.getApplicationInfoAsUser(r.pkg, 0, userId);
    if (applicationInfo.targetSdkVersion >= Build.VERSION_CODES.O) {
        // O apps should not have the default channel.
        return false;
    }

    // Otherwise, this app should have the default channel.
    return true;
}

```

当targetSdk>=26时，系统不会添加默认Channel，反之，低版本则会默认添加

如果targetSdk<26,只要compileSdk>=26，也是可以设置Channel的，同样也会生效

通常NotificationChannel在程序初始化时就已经创建并注册了，不需要每一次发通知的时候都去重新创建一次


### 创建通知后，震动、声音、呼吸灯都不起作用了
在NotificationChannel里也有一整套设置通知属性的方法

```
    // 传入参数：通道ID，通道名字，通道优先级（类似曾经的 builder.setPriority()）
    NotificationChannel channel =
            new NotificationChannel(NOTIFICATION_CHANNELID, name, NotificationManager.IMPORTANCE_HIGH);

    // 配置通知渠道的属性
    channel.setDescription(description);
    // 设置通知出现时声音，默认通知是有声音的
    channel.setSound(null, null);
    // 设置通知出现时的闪灯（如果 android 设备支持的话）
    channel.enableLights(true);
    channel.setLightColor(Color.RED);
    // 设置通知出现时的震动（如果 android 设备支持的话）
    channel.enableVibration(true);
    channel.setVibrationPattern(new long[]{100, 200, 300, 400, 500, 400, 300, 200, 400});

    //最后在 notificationManager 中创建该通知渠道
    mNotificationManager.createNotificationChannel(channel);
```
当APP创建了Channel，并传入了ChannelId，系统就可能只会读取该Channel中的属性；而以前在Build时设置的属性全都无效了。

源码位置 `NotificationRecord.java -> mPreChannelsNotification`

```
private boolean isPreChannelsNotification() {
    try {
        if (NotificationChannel.DEFAULT_CHANNEL_ID.equals(getChannel().getId())) {
              final ApplicationInfo applicationInfo =
                    mContext.getPackageManager().getApplicationInfoAsUser(sbn.getPackageName(),
                            0, UserHandle.getUserId(sbn.getUid()));
            if (applicationInfo.targetSdkVersion < Build.VERSION_CODES.O) {
                return true;
            }
        }
    } catch (NameNotFoundException e) {
        Slog.e(TAG, "Can't find package", e);
    }
    return false;
}
```

当 ChannelId 存在且非默认值（应用添加的均为非默认值，默认值只能由系统添加）时，mPreChannelsNotification 为false，则部分通知属性会采用 NotificationChannel 里设置的参数，而非Notification Build时设置的参数。涉及参数有：通知声音、呼吸灯、震动、优先级。


### 通知声音不能关闭、通知铃声不能更改，以及震动、呼吸灯、优先级这些属性在Channel中更改无效

源码位置 `RankingHelper.java -> createNotificationChannel()`

```
NotificationChannel existing = r.channels.get(channel.getId());
    // Keep most of the existing settings
    if (existing != null && fromTargetApp) {
        if (existing.isDeleted()) {
            existing.setDeleted(false);

            // log a resurrected channel as if it's new again
            MetricsLogger.action(getChannelLog(channel, pkg).setType(
                    MetricsProto.MetricsEvent.TYPE_OPEN));
        }

        existing.setName(channel.getName().toString());
        existing.setDescription(channel.getDescription());
        existing.setBlockableSystem(channel.isBlockableSystem());

        // Apps are allowed to downgrade channel importance if the user has not changed any
        // fields on this channel yet.
        if (existing.getUserLockedFields() == 0 &&
                channel.getImportance() < existing.getImportance()) {
            existing.setImportance(channel.getImportance());
        }

        updateConfig();
        return;
    }


```


APP创建的 Channel 最终是在NMS（通知服务）中完成初始化并注册的；如上述逻辑片段，系统首先会判断此 ChannelId 是否已经存在，如果存在的话，捞出来继续用！！！
你可以更新的属性也只有通道Name和Description，另外也可以把通道优先级往低了调，前提是用户没有手动更改过。不难看出，上面说的声音、震动、呼吸灯这些属性是没法改了。。。

聪明的你一定想到办法了，那我可以先把这个ChannelId的通知通道删了，在创建个相同ChannelId的。其实开始我也是这么想的，不过智慧的谷歌工程师，把这条路堵死了。当你调用 deleteNotificationChannel() 删除通知通道时，其实系统里除了给这个通道打个 “deleted” 的标签外，啥也没干。。。当你再次创建相同 ChannelId 的通道时，它只是把旧的那个捞出来，去掉 “deleted” 标签继续用。

此刻，你应该发现了一个“小漏洞”，那我可以创建个新的ChannelId，不就可以了。答案是肯定的，当然可以了。不过就是，系统会把你删除通道的这个行为记录下来，用小字儿在你APP的通知设置页面显示出来 —— "n categories deleted"。

如果想彻底删除已经创建注册的Channel，只有清除应用数据或者卸载应用。

Android官方是这么解释这个设计的：NotificationChannel 就像是开发者送给用户的一个精美礼物，一旦送出去，控制权就在用户那里了。即使用户把通知铃声设置成《江南style》，你可以知道，但不可以更改。

解决办法：

刚适配Android O时，发现通知声音关不掉；主要是因为Android在 NotificationChannel 中将声音设置成默认开启了，而已经设置的 Channel 属性又不能更改，所以无论如何调试也不会生效。其它属性原理与此类似。
若要新的 Channel 属性生效，只有三个办法：更换ChannelId、清除应用数据、卸载应用



### 通知的优先级
Android O之前，叫通知“优先级”，通过在Build时，setPriority() 设置，共分为5档（-2 ～ 2）；
默认值：Notification.PRIORITY_DEFAULT

Android O之后，叫通知“重要性”，通过NotificationChannel的 setImportance() 设置，也是5档（0 ～ 4）；
默认值：NotificationManager.IMPORTANCE_DEFAULT

即使你设置了通知声音、震动这些属性，其“重要性”也必须满足下表对应的档位：


图片 Android nNotification1



### 最后的总结
Android每次版本升级，均会对通知中心作出较大改动。Android O 引入的通知通道，相比于L时引入的通知分组，对APP的影响更大，系统的态度也更加强硬。另一方面也体现了Android非常重视用户的选择权，杜绝无意义的通知打扰，希望将这些权限完全掌控在用户手中。

由于国内各大ROM定制厂商，虽然升级到了Android O，但由于其UI及交互，与原生差异较大；这部分逻辑往往是残缺的。要么废弃了通知通道功能，要么屏蔽了通知通道的设置页面。就像当年Android L的通知分组和通知回复那样，并不是所有的国内定制ROM都支持的。

所以对那些比较看重通知场景的应用（如信息提醒类），最稳妥的做法或许是：

不适配Android O，保持TargetSDK在26以下

适配Android O，自己实现震动、铃声；如微信、QQ

适配Android O，每次更新“声音、振动、呼吸灯、重要性”属性时，创建新的channelId



参考：https://www.jianshu.com/p/99bc32cd8ad6