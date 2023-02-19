


### 获取 ingress部署文件 在Server0 上操作

网址 https://github.com/kubernetes/ingress-nginx/blob/main/deploy/static/provider/cloud/deploy.yaml



```

 vim ingress-nginx-deploy.yaml
```

将yaml文件中填入, 需要进行修改 

 网址 https://hub.docker.com/search?q=ingress-nginx-controller


```
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/component: controller
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
    app.kubernetes.io/version: 1.4.0
  name: ingress-nginx-controller
  namespace: ingress-nginx
spec:
  externalTrafficPolicy: Local
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  ports:
  - appProtocol: http
    name: http
    port: 80
    protocol: TCP
    targetPort: http
添加 nodePort: 30080    
  - appProtocol: https
    name: https
    port: 443
    protocol: TCP
    targetPort: https
添加 nodePort:30443
  selector:
    app.kubernetes.io/component: controller
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/name: ingress-nginx
  #type: LoadBalancer
改为 type: NodePort 
---
apiVersion: v1
kind: Service

spec:
  minReadySeconds: 0
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      app.kubernetes.io/component: controller
      app.kubernetes.io/instance: ingress-nginx
      app.kubernetes.io/name: ingress-nginx
  template:
    metadata:
      labels:
        app.kubernetes.io/component: controller
        app.kubernetes.io/instance: ingress-nginx
        app.kubernetes.io/name: ingress-nginx
    spec:
    如果不修改 NodePort 则添加,这种会占用物理机的端口
添加   hostNetwork: true 
      containers:
      - args:
        - /nginx-ingress-controller
        - --publish-service=$(POD_NAMESPACE)/ingress-nginx-controller
        - --election-id=ingress-controller-leader
        - --controller-class=k8s.io/ingress-nginx
        - --ingress-class=nginx
        - --configmap=$(POD_NAMESPACE)/ingress-nginx-controller
        - --validating-webhook=:8443
        - --validating-webhook-certificate=/usr/local/certificates/cert
        - --validating-webhook-key=/usr/local/certificates/key
        env:
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: POD_NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        - name: LD_PRELOAD
          value: /usr/local/lib/libmimalloc.so
        image: registry.k8s.io/ingress-nginx/controller:v1.4.0@sha256:34ee929b111ffc7aa426ffd409af44da48e5a0eea1eb2207994d9e0c0882d143
换成    image: dyrnq/ingress-nginx-controller:v1.4.0                
        
        imagePullPolicy: IfNotPresent
        lifecycle:
          preStop:
            exec:
              command:
              - /wait-shutdown

---

    spec:
      containers:
      - args:
        - create
        - --host=ingress-nginx-controller-admission,ingress-nginx-controller-admission.$(POD_NAMESPACE).svc
        - --namespace=$(POD_NAMESPACE)
        - --secret-name=ingress-nginx-admission
        env:
        - name: POD_NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        image: registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343@sha256:39c5b2e3310dc4264d638ad28d9d1d96c4cbb2b2dcfb52368fe4e3c63f61e10f
    换成 image: dyrnq/kube-webhook-certgen:v20220916-gd32f8c343
        imagePullPolicy: IfNotPresent
        name: create
        securityContext:
          allowPrivilegeEscalation: false
      nodeSelector:
        kubernetes.io/os: linux
      restartPolicy: OnFailure
      securityContext:
        fsGroup: 2000
        runAsNonRoot: true
        runAsUser: 2000
      serviceAccountName: ingress-nginx-admission
---

    spec:
      containers:
      - args:
        - patch
        - --webhook-name=ingress-nginx-admission
        - --namespace=$(POD_NAMESPACE)
        - --patch-mutating=false
        - --secret-name=ingress-nginx-admission
        - --patch-failure-policy=Fail
        env:
        - name: POD_NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        image: registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343@sha256:39c5b2e3310dc4264d638ad28d9d1d96c4cbb2b2dcfb52368fe4e3c63f61e10f
    换成 image: dyrnq/kube-webhook-certgen:v20220916-gd32f8c343        
        imagePullPolicy: IfNotPresent
        name: patch
        securityContext:
          allowPrivilegeEscalation: false
      nodeSelector:
        kubernetes.io/os: linux
      restartPolicy: OnFailure
      securityContext:
        fsGroup: 2000
        runAsNonRoot: true
        runAsUser: 2000
      serviceAccountName: ingress-nginx-admission
---



```

```
 kubectl apply -f  ingress-nginx-deploy.yaml

```

## 查看状态

```
 kubectl get pod --namespace ingress-nginx
 
```


### 在Server1和Server2上操作

```
 mkdir /www/nginx/ -p
 echo "访问 Nginx server 1" > /www/nginx/index.html

```


### 在Server0上进行操作

```
  vim nginx.yaml

  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: nginx
  spec:
    selector:
        matchLabels:
           app: nginx
    replicas: 3 
    template:
        metadata:
            labels: 
               app: nginx
        spec:
            containers:
            - name: nginx
              image: nginx:1.20
              imagePullPolicy: IfNotPresent
              ports:
              - containerPort: 80
              volumeMounts:
              - name: www
                mountPath: /usr/share/nginx/html/
            volumes:
            - name: www
              hostPath:
                path: /www/nginx/


  ---
  apiVersion: v1
  kind: Service
  metadata:
    name: nginxsvc
  spec:
    selector:
      app: nginx
    ports:
    - name: http
      port: 80
      targetPort: 80
                 





```

### ingress单节点暴露

```
 vim ingress-single.yaml

  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: test-ingress
  spec:
    ingressClassName: nginx
    defaultBackend:
      service:
        name: nginxsvc  //上文中的
        port:
          number: 81


    
```