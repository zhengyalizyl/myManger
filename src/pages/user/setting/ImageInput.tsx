import React,{useState} from "react";

interface ImageInputProps {
  onChange?: (files: FileReaderEventMap) => void;
}

const ImageInput:React.FC<ImageInputProps>=({onChange}) =>{
  const [dragIn, setDragIn] = useState(false);
  const changeFile=(e)=>{
        if(onChange){
          if(e.target.files&&e.target.files.length>0){
            onChange(e.target.files[0])
          }
 
        }
  }

  const handleDragOver=(e)=>{
    // console.log(e,'一进来')
    e.preventDefault();
    setDragIn(true);
  }

  const hanleDragLeave=(e)=>{
    // console.log(e,'移除')
    e.preventDefault();
    setDragIn(false);
  }

const handleDrop=(e)=>{
  console.log(e,'加下')
  setDragIn(false)
}

  return (
    <input  
    className={"image-input "+(dragIn?'active':'') }
    type="file"   
    onChange={changeFile} 
    onDragOver={handleDragOver} 
    onDragLeave={hanleDragLeave}
    onDrop={handleDrop}
     />
  )
}

export default ImageInput;