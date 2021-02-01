/* eslint-disable no-restricted-globals */
self.importScripts('spark-md5.min.js')

self.onmessage=(e)=>{
  const {chunks}=e.data;
  const spark=new self.SparkMD5.ArrayBuffer();
  const fsReader=new FileReader();

  for (let index = 0; index < chunks.length; index+=1) {
   let  hashProgress=0;
    const chunk = chunks[index];
    fsReader.onload=event=>{
      const file=event.target.result;
         spark.append(file);
          if(index===chunks.length){
               hashProgress=100;
               self.postMessage({
                 hash:spark.end(),
                 hashProgress:100
               })
          }else{
            hashProgress=Number(((index/chunks.length)*100).toFixed(2));
            self.postMessage({
              hashProgress
            })
          }

    }
    fsReader.readAsArrayBuffer(chunk.file)


    
  }
}