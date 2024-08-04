



基础知识 

Http协议定义了分块传输的响应header字段，但具体是否支持取决于Server的实现，我们可以指定请求头的”range”字段来验证服务器是否支持分块传输。例如，我们可以利用curl命令来验证： 


定好协议。我们用的http库是dio；通过校验md5检测文件缓存完整性；关于代码中的subDir，设计上认为资源会有多种：音频、视频、安装包等，每种资源分开目录进行存储。



    "power_station":UploadItem(),
    "customer_name":UploadItem(),
    "customer_number":UploadItem(),
    "customer_type":UploadItem(),
    "power_collect_type":UploadItem(),
    "voltage_type":UploadItem(),
    "current_type":UploadItem(),



    "inverter_factory":UploadItem(),
    "inverter_type":UploadItem(),
    "pencil_type":UploadItem(),
    "inverter_rated_capacity":UploadItem(),
    "circuit_breaker":UploadItem(),
    "distance":UploadItem(),


    
    "power_station_belong":UploadItem(),
    "communicate_port":UploadItem(),
    "upload_name":UploadItem(),