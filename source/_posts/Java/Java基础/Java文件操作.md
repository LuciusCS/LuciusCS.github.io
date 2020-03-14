
# Java文件读取

## 以数据流的形式整体进行读入

```java
    try{
        File file=new File(path);
        byte[] fileData=new byte[(int)file.length()];
        DataInputStream dataInputStream=new DataInputStream(new FileInputStream(file));
        dataInputStream.readFully(fileData);
        dataInputStream.close();
    }cache(IOException io){
        e.printStackTrace();
    }

```


## 文件逐行读入
```java
    try{
        StringBuilder stringBuilder=new StringBuilder();
        File file=new File(path);
        InputStream inputStream=new FileInputStream(file);
        if(inputStream!=null){
            InputStreamReader inputReader=new InputStreamReader(inputSream);
            BufferedReader bufferedReader=new BufferedReader(inputReader);
            String line;
            while(line=bufferedReader.readLine()!=null){
               stringBuilder.append(line);
            }
            inputStream.close();
        }

    }cache(IOException io){
        e.printStackTrace();
    }

```