/* eslint-disable no-restricted-globals */
// 引入spark-md5
self.importScripts('spark-md5.min.js');
self.onmessage=(event)=>{
  // 接受主线程传递的数据
  const {chunks}=event.data;
  const spark=new self.SparkMD5.ArrayBuffer();
  const fileReader=new FileReader();

  for(let i=0;i<chunks.length;i+=1){
    let progress=0;
     fileReader.onload=(e)=>{
        spark.append(e.target.result);
        if(i===chunks.length){
          self.postMessage({
            progress:100,
            hash:spark.end()
          })
          
        }else{
          progress+=100/chunks.length;
             self.postMessage({
               progress
             })
        }
     }
     fileReader.readAsArrayBuffer(chunks[i].file)
  }
  
}