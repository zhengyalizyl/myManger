import React from "react";

interface ImageInputProps {
  onChange?: (files: FileReaderEventMap) => void;
}

const ImageInput:React.FC<ImageInputProps>=({onChange}) =>{
  const changeFile=(e)=>{
        if(onChange){
          if(e.target.files&&e.target.files.length>0){
            onChange(e.target.files[0])
          }
 
        }
  }

  const handleDragOver=(e)=>{
    console.log(e,'一进来')
    e.preventDefault();
  }

  const hanleDragLeave=(e)=>{
    console.log(e,'移除')
    e.preventDefault();
  }
  return (
    <input  type="file"   onChange={changeFile} onDragOver={handleDragOver} onDragLeave={hanleDragLeave} />
  )
}

export default ImageInput;