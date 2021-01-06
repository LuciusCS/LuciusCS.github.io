---
title: 自定义View实现倒计时功能
cover: /cover/img20.jpg
toc: true
description: 自定义View实现倒计时功能
categories: Android
type: [Android]
date: 2018/06/20
---


# 使用自定义View实现倒计时功能

当手机应用在安装后进行资源加载初始化的时候，为提高用户的使用体验，通常会以倒计时的形式给予用户一一定的提示。
<!--more-->
## 倒计时控件实现的功能

* 显示时间进度
* 计时结束后将会自动跳转到下一个Activity中

实现效果如图所示

在本篇博客中的代码会有部分缺省，源码链接

## 对自定义View的尺寸进行测量并绘制中间的大圆

View在绘制的过程中对于尺寸的测量主要在OnMeasure中进行，绘制中间的大圆需要指定圆心、半径、画笔样式、背景样式等信息。倒计时功能控件显示的为圆，因此以View中的长和宽的最小值作为直径。

```text
public class CountDownView extends android.support.v7.widget.AppCompatTextView {

    private int circleRadius;

    private int circleColor=0xff33b5e5;

    private Paint circlePaint;
    private Rect bounds;

    private int centerX;
    private int centerY;

    public CountDownView(Context context) {
        super(context);
        init();
    }

    public void init(){
        circlePaint=new Paint();
        bounds=new Rect();

    }

    public CountDownView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public CountDownView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }


    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec,heightMeasureSpec);

        circleRadius=getMeasuredWidth()>getMeasuredHeight()?getMeasuredHeight()/2:getMeasuredWidth()/2;
        setMeasuredDimension(getMeasuredWidth(),getMeasuredHeight());
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        getDrawingRect(bounds);      //获取控件的边界

        centerX=bounds.centerX();
        centerY=bounds.centerY();

        //绘制中间的大圆的背景
        circlePaint.setAntiAlias(true);
        circlePaint.setStyle(Paint.Style.FILL);
        circlePaint.setColor(circleColor);
        canvas.drawCircle(bounds.centerX(),bounds.centerY(),circleRadius,circlePaint);

    }
}
```

在activity\_main.xml中添加自定义控件

```text
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center"
    tools:context=".MainActivity">

    <com.example.wyw.countdowndemo.CountDownView
        android:layout_width="100dp"
        android:layout_height="100dp"
        />

</LinearLayout>
```

运行结果

## 绘制进度边框

```text
    private int cirlceBoundColor=0xff00ddff;

    @Override
    protected void onDraw(Canvas canvas) {

        circlePaint.setStyle(Paint.Style.STROKE);
        circlePaint.setStrokeWidth(5);
        circlePaint.setColor(cirlceBoundColor);
        canvas.drawCircle(bounds.centerX(),bounds.centerY(),circleRadius-8,circlePaint);

    }
```

## 绘制进度条的一条弧线

进度条的绘制过程弧线不断增加绘制角度，然后更新视图显示的，先绘制一条角度为45度的弧线

```text
    private RectF arcRectF;
    private int processColor=0xff99cc00;

    public void init(){
        arcRectF=new RectF();
    }

    @Override
    protected void onDraw(Canvas canvas) {

        circlePaint.setColor(processColor);
        //设置线冒样式
        circlePaint.setStrokeCap(Paint.Cap.ROUND);
        arcRectF.set(bounds.left+8,bounds.top+8,bounds.right-8,bounds.bottom-8);
        canvas.drawArc(arcRectF,-90,40,false,circlePaint);

    }
```

## 进度条按照通过Timer不断控制绘制角度的增加

```text
    private int currentDrawTime;    //已经绘制的次数
    private Timer timer;

    public void init(){
        timer=new Timer();
        arcRectF=new RectF();
    }

    @Override
    protected void onDraw(Canvas canvas) {

        arcRectF.set(bounds.left+8,bounds.top+8,bounds.right-8,bounds.bottom-8);
        canvas.drawArc(arcRectF,-90,currentDrawTime*45,false,circlePaint);

    }

    public void drawProcess(){

        currentDrawTime=0;
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
               postInvalidate();
               currentDrawTime++;
               if (currentDrawTime==8)
                   timer.cancel();
            }
        },500,500);

    }
```

## 倒计时时间绘制，倒计时的绘制，需要根据timer来进行倒计时

```text
    @Override
    protected void onDraw(Canvas canvas) {
     Paint paint = getPaint();
        float textY = centerY - (circlePaint.descent() + circlePaint.ascent()) / 2;
        paint.setAntiAlias(true);  //防锯齿
        paint.setColor(Color.WHITE);
        paint.setTextAlign(Paint.Align.CENTER);
        canvas.drawText((4000-500*currentDrawTime)/500+"s",centerY,textY,paint);

    }
```

