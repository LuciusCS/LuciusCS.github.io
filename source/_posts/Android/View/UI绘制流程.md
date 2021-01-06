---
title: Android UI 绘制流程
type: [Android]
description:  Android UI 绘制流程
cover: /cover/img90.jpg
toc: true
categories: Android
date: 2018/06/15
---



##  UI绘制流程

### View被添加到屏幕窗口的过程
1、创建顶层布局容器DecroView，DecroView是一个ViewGroup容器，继承FrameLayout，是PhoneWindow类中持有的实例，所有应用程序的顶层View，在系统内部进行初始化，当DecroView初始化完成后，系统会根据应用的主题特性，加载一个基础容器，如NoActionBar或DarkActionBar，不同主题加载的基础容器不同，基础容器中一定有OnDraw.R.id.content的容器，该容器是一个FrameLayout，通过setCOntentView的xml文件被解析后添加到FrameLayout中
2、在顶层布局中加载基础布局ViewGroup
3、将ContentView添加到基础布局中的FrameLayout中


View的绘制流程
1、绘制入口
    Actvityhread.handleResumeActivity
    ——>WindowManagerImpl.addView(decorView,layoutParams) 
    ——>WindowManagerGlobal.addView()
2、绘制类及方法
    ViewRootImpl.setView(decorView,layoutParama,parentView)
    ——>ViewRootImpl.requestLayout()——>scheduleTraversals()——> doTraversal()
    ——> perfoemTraversals()
3、绘制三大步骤
    测量：ViewRootImpl.performMeasure
    布局：ViewRootImpl.performLayout
    绘制：ViewRootImpl.performDraw       



### 在Android 7.0 下的绘制流程
1、从setContentView()开始
在Activity源码中

```java
    public void setContentView(@LayoutRes int layoutResID) {
        getWindow().setContentView(layoutResID);
        initWindowDecorActionBar();
    }
```
`Window`是一个抽象类，其只有一个实现类是`android.view.PhoneWindow`
```java
    //...
    public Window getWindow() {
        return mWindow;
    }
```
`PhoneWindow`中`setContentView()`方法
```java

 @Override
    public void setContentView(int layoutResID) {
        // Note: FEATURE_CONTENT_TRANSITIONS may be set in the process of installing the window
        // decor, when theme attributes and the like are crystalized. Do not check the feature
        // before this happens.
        if (mContentParent == null) {
            installDecor();
        } else if (!hasFeature(FEATURE_CONTENT_TRANSITIONS)) {
            mContentParent.removeAllViews();
        }

        if (hasFeature(FEATURE_CONTENT_TRANSITIONS)) {
            final Scene newScene = Scene.getSceneForLayout(mContentParent, layoutResID,
                    getContext());
            transitionTo(newScene);
        } else {
            mLayoutInflater.inflate(layoutResID, mContentParent);
        }
        mContentParent.requestApplyInsets();
        final Callback cb = getCallback();
        if (cb != null && !isDestroyed()) {
            cb.onContentChanged();
        }
        mContentParentExplicitlySet = true;
    }


```

```java
 private void installDecor() {
        mForceDecorInstall = false;
        if (mDecor == null) {
            mDecor = generateDecor(-1);
            mDecor.setDescendantFocusability(ViewGroup.FOCUS_AFTER_DESCENDANTS);
            mDecor.setIsRootNamespace(true);
            if (!mInvalidatePanelMenuPosted && mInvalidatePanelMenuFeatures != 0) {
                mDecor.postOnAnimation(mInvalidatePanelMenuRunnable);
            }
        } else {
            mDecor.setWindow(this);
        }
        if (mContentParent == null) {
            mContentParent = generateLayout(mDecor);

            // Set up decor part of UI to ignore fitsSystemWindows if appropriate.
            mDecor.makeOptionalFitsSystemWindows();

            final DecorContentParent decorContentParent = (DecorContentParent) mDecor.findViewById(
                    R.id.decor_content_parent);

            if (decorContentParent != null) {
                mDecorContentParent = decorContentParent;
                mDecorContentParent.setWindowCallback(getCallback());
                if (mDecorContentParent.getTitle() == null) {
                    mDecorContentParent.setWindowTitle(mTitle);
                }

                final int localFeatures = getLocalFeatures();
                for (int i = 0; i < FEATURE_MAX; i++) {
                    if ((localFeatures & (1 << i)) != 0) {
                        mDecorContentParent.initFeature(i);
                    }
                }

                mDecorContentParent.setUiOptions(mUiOptions);

                if ((mResourcesSetFlags & FLAG_RESOURCE_SET_ICON) != 0 ||
                        (mIconRes != 0 && !mDecorContentParent.hasIcon())) {
                    mDecorContentParent.setIcon(mIconRes);
                } else if ((mResourcesSetFlags & FLAG_RESOURCE_SET_ICON) == 0 &&
                        mIconRes == 0 && !mDecorContentParent.hasIcon()) {
                    mDecorContentParent.setIcon(
                            getContext().getPackageManager().getDefaultActivityIcon());
                    mResourcesSetFlags |= FLAG_RESOURCE_SET_ICON_FALLBACK;
                }
                if ((mResourcesSetFlags & FLAG_RESOURCE_SET_LOGO) != 0 ||
                        (mLogoRes != 0 && !mDecorContentParent.hasLogo())) {
                    mDecorContentParent.setLogo(mLogoRes);
                }

                // Invalidate if the panel menu hasn't been created before this.
                // Panel menu invalidation is deferred avoiding application onCreateOptionsMenu
                // being called in the middle of onCreate or similar.
                // A pending invalidation will typically be resolved before the posted message
                // would run normally in order to satisfy instance state restoration.
                PanelFeatureState st = getPanelState(FEATURE_OPTIONS_PANEL, false);
                if (!isDestroyed() && (st == null || st.menu == null) && !mIsStartingWindow) {
                    invalidatePanelMenu(FEATURE_ACTION_BAR);
                }
            } else {
                mTitleView = (TextView) findViewById(R.id.title);
                if (mTitleView != null) {
                    if ((getLocalFeatures() & (1 << FEATURE_NO_TITLE)) != 0) {
                        final View titleContainer = findViewById(R.id.title_container);
                        if (titleContainer != null) {
                            titleContainer.setVisibility(View.GONE);
                        } else {
                            mTitleView.setVisibility(View.GONE);
                        }
                        mContentParent.setForeground(null);
                    } else {
                        mTitleView.setText(mTitle);
                    }
                }
            }

            if (mDecor.getBackground() == null && mBackgroundFallbackResource != 0) {
                mDecor.setBackgroundFallback(mBackgroundFallbackResource);
            }

            // Only inflate or create a new TransitionManager if the caller hasn't
            // already set a custom one.
            if (hasFeature(FEATURE_ACTIVITY_TRANSITIONS)) {
                if (mTransitionManager == null) {
                    final int transitionRes = getWindowStyle().getResourceId(
                            R.styleable.Window_windowContentTransitionManager,
                            0);
                    if (transitionRes != 0) {
                        final TransitionInflater inflater = TransitionInflater.from(getContext());
                        mTransitionManager = inflater.inflateTransitionManager(transitionRes,
                                mContentParent);
                    } else {
                        mTransitionManager = new TransitionManager();
                    }
                }
                 //.... 
                 //用于对主题进行处理
                mEnterTransition = getTransition(mEnterTransition, null,
                        R.styleable.Window_windowEnterTransition);
                 //....
            }
        }
    }


```

在布局资源加载的过程中，创建出一个`DecrorView`
```java
    protected DecorView generateDecor(int featureId) {
        // System process doesn't have application context and in that case we need to directly use
        // the context we have. Otherwise we want the application context, so we don't cling to the
        // activity.
        /....
        return new DecorView(context, featureId, this, getAttributes());
    }


```


`DecrorView`继承自`FramLayout`，其是一个容器;

```java
    public class DecorView extends FrameLayout implements RootViewSurfaceTaker, WindowCallbacks {

    }

```

```java
  protected ViewGroup generateLayout(DecorView decor) {
        // Apply data from current theme.

        TypedArray a = getWindowStyle();

        //根据 `R.styleable`设置窗口的主题
        // .....
        // Inflate the window decor.，解析窗口的View

        int layoutResource;
        int features = getLocalFeatures();
        // System.out.println("Features: 0x" + Integer.toHexString(features));
        if ((features & (1 << FEATURE_SWIPE_TO_DISMISS)) != 0) {
            layoutResource = R.layout.screen_swipe_dismiss;
        } 

        //根据features的不同，加载不同的layoutResources

        mDecor.startChanging();
        //对layoutResource对应的不同布局进行解析，解析完成后加载到DecorView上
        mDecor.onResourcesLoaded(mLayoutInflater, layoutResource);

        //ID_ANDROID_CONTENT主容器ID具有的值，而且一定存在
        ViewGroup contentParent = (ViewGroup)findViewById(ID_ANDROID_CONTENT);
        if (contentParent == null) {
            throw new RuntimeException("Window couldn't find content container view");
        }

        return contentParent;
    }


```

`onResourcesLoaded()`永不解析布局文件，并将解析出的布局文件,通过`addView`添加到`DecorView`中

```java
    void onResourcesLoaded(LayoutInflater inflater, int layoutResource) {
        mStackId = getStackId();

       // .....
        final View root = inflater.inflate(layoutResource, null);
        if (mDecorCaptionView != null) {
            if (mDecorCaptionView.getParent() == null) {
                addView(mDecorCaptionView,
                        new ViewGroup.LayoutParams(MATCH_PARENT, MATCH_PARENT));
            }
            mDecorCaptionView.addView(root,
                    new ViewGroup.MarginLayoutParams(MATCH_PARENT, MATCH_PARENT));
        } 
          // .....
      
    }

```

### 在Android 9.0 下的绘制流程

<center/>
```flow
st=>start: Start
op=>operation: Your
cond=>condition: Yes or No?
e=>end: End
st->op->cond
cond(yes)->e
cond(no)->op
```
</center>

### 
