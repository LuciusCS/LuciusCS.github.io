

## Toast在Fragment中使用报空

```
2021-07-06 13:24:31.469 27900-27900/com.android.example.common.power E/AndroidRuntime: FATAL EXCEPTION: main
    Process: com.android.example.common.power, PID: 27900
    java.lang.NullPointerException: Attempt to invoke virtual method 'java.lang.String android.content.Context.getPackageName()' on a null object reference
        at android.widget.Toast.<init>(Toast.java:122)
        at android.widget.Toast.makeText(Toast.java:294)
        at android.widget.Toast.makeText(Toast.java:284)
        at com.android.example.common.ui.monitor.base.AnalyseBaseFragment.showToastInfo(AnalyseBaseFragment.java:242)

```

在Fragment中Toast的context应该为`ApplicationContext`

不能使用 `getActivity().getApplicationContext`

错误写法
```
 Toast.makeText(AnalyseBaseFragment.this.getActivity().getApplicationContext(), info, Toast.LENGTH_LONG).show();
  Toast.makeText(AnalyseBaseFragment.this.getActivity(), info, Toast.LENGTH_LONG).show();
    Toast.makeText(AnalyseBaseFragment.this..getContext(), info, Toast.LENGTH_LONG).show();
```

正确写法

```
        Toast.makeText(CommonApplication.getContext(), info, Toast.LENGTH_LONG).show();

```