export const getImageUtils = (file: Blob) => {
  const fileReader = new FileReader();
  return new Promise((reslove) => {
    fileReader.onload = (e) => {
      const { result } = e.target;
      const ret = [...new Uint8Array(result)]
        .map((v) => v.toString(16).toUpperCase())
        .map((v) => v.padStart(2, '0'));
      reslove(ret);
    };
    fileReader.readAsArrayBuffer(file);
  });
};


export const isPng=async (file:File)=>{
 const ret= await getImageUtils(file.slice(0,8));
 return ret.join(' ')==='89 50 4E 47 0D 0A 1A 0A'
}
export const isGif=async (file:File)=>{
 const ret= await getImageUtils(file.slice(0,6))
 return ret.join(' ')==='47 49 46 38 39 61'||ret.join(' ')==='47 49 46 38 37 61'
}


export const isJpg=async (file:File)=>{
  const ret=await getImageUtils(file.slice(0,2));
  const ret2=await getImageUtils(file.slice(-2));
  return ret.join(' ')==='FF D8'&&ret2.join(' ')==='FF D9';
}


export const isExeccedMaxSize=(file:File,size:number)=>{
  const fileSize=file.size/(1024*1024);
  return fileSize<=size;
}

export const getBase64FromImg= (file:File)=>{
  const fsReader=new FileReader();
  return new Promise((resolve)=>{
    fsReader.onload=(e)=>{
      const {result}=e.target;
           resolve(result)
    }
    fsReader.readAsDataURL(file)
  })

}

export const CHUNK_SIZE = 1 * 1024 * 1024; // 1M
export const createFileChunk=(file:File,size=CHUNK_SIZE)=>{
  const  chunks=[];
 let cur=0;
  while(cur<file.size){
    chunks.push({
      index:cur,
      file:file.slice(cur,cur+size)
    })
    cur+=size;
  }
  return  chunks;
  
}