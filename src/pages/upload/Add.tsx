/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */
import React, { useState, useRef } from 'react';
import { PageHeader, message, Modal, Button } from 'antd';
import { FileSearchOutlined, PlusOutlined } from '@ant-design/icons';
import SparkMd5 from 'spark-md5';
import { connect } from 'umi';
import Column from 'antd/lib/table/Column';
import { ConnectState } from '../../models/connect';
import { UploadModelState } from '../../models/upload';
import styles from './index.less';
import {
  isPng,
  isGif,
  isJpg,
  isExeccedMaxSize,
  getBase64FromImg,
  createFileChunk,
} from './checkImg';

export const offset = 0.01 * 1024 * 1024;
interface UploadAddProps {
  onChange?: (files: FileReaderEventMap) => void;
  upload: UploadModelState;
}

// 获取元素相对于屏幕左边的距离 offsetLeft，offsetTop
const getPosition = (node: any) => {
  let left = node.offsetLeft;
  let top = node.offsetTop;
  let parent = node.offsetParent;
  while (parent != null) {
    left += parent.offsetLeft;
    top += parent.offsetTop;
    parent = parent.offsetParent;
  }
  return { left, top };
};

const UploadAdd: React.FC<UploadAddProps> = (props) => {
  const { status, uploadUrl } = props.upload;
  const [dragIn, setDragIn] = useState(false);
  const uploadFileInput = useRef<HTMLElement>(null);
  const mainBox = useRef<HTMLElement>(null);
  const originImg = useRef<HTMLElement>(null);
  const originImg2 = useRef<HTMLElement>(null);
  const originImg3 = useRef<HTMLElement>(null);
  const [imgFileUrl, setImgFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [chunks, setChunks] = useState([{}]);
  const [hashProgress, setHashProgress] = useState(0);
  const [visiblePreviewImg, setVisiblePreviewImg] = useState(false);
  const [width, setWidth] = useState(150);
  const [height, setHeight] = useState(150);
  const [direction, setDirection] = useState('');
  const [ifKeyDown, setIfKeyDown] = useState(false);
  const { left: minX, top: minY } =
    originImg && originImg.current ? getPosition(originImg.current) : { left: 0, top: 0 };
  const originImgWidth = originImg && originImg.current ? originImg.current.offsetWidth : 0;
  const originImgHeight = originImg && originImg.current ? originImg.current.offsetHeight : 0;
  const maxX = minX + originImgWidth;
  const maxY = minY + originImgHeight;

  const dataUrlToBlob = (dataUrl:any) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while ((n -= 1)) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const blobToFile=(theBlob:any)=>{
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileUrl? fileUrl.name:'';
    return theBlob;
  }

  const changeImg = async (file: File) => {
    // 这里需要判断是否是图片
    const isCheckPng = await isPng(file);
    const isCheckJpg = await isJpg(file);
    const isCheckGif = await isGif(file);
    const isimg = isCheckGif || isCheckJpg || isCheckPng;
    console.log(file,isimg,'==============')
    // 1.
    if (!isimg) {
      message.error('所传的图片不是png/gif/jpg');
      return false;
    }
    // 2.
    const isSize = isExeccedMaxSize(file, 20);
    if (!isSize) {
      message.error('所传的图片超过2M');
      return false;
    }
    setFileUrl(file);
    // 3.转换
    const imgUrl = await getBase64FromImg(file);
    setImgFile(imgUrl);
    setVisiblePreviewImg(true);
    setPreview();
  };

  const setPreview = () => {
    if (
      originImg3 &&
      originImg3.current &&
      originImg2 &&
      originImg2.current &&
      mainBox &&
      mainBox.current
    ) {
      const left = mainBox.current.offsetLeft;
      const right = left + mainBox.current.offsetWidth;
      const top = mainBox.current.offsetTop;
      const bottom = mainBox.current.offsetTop + mainBox.current.offsetHeight;
      originImg3.current.style.left = `${-left}px`;
      originImg3.current.style.top = `${-top}px`;
      originImg3.current.style.clip = `rect(${top}px,${right}px,${bottom}px,${left}px)`;
      originImg3.current.style.width = `${originImg2.current.offsetWidth}px`;
      originImg3.current.style.height = `${originImg2.current.offsetHeight}px`;
      console.log(originImg3.current, '===============');
      console.log(fileUrl,imgFileUrl)
      // 将base64转换成file
      const blob=dataUrlToBlob(originImg3.current.getAttribute('src'));
      const file= blobToFile(blob)
      changeImg(file)
      // setImgFile(originImg3)
    }
  };


  const cancelPreview = (e) => {
    e.preventDefault();
    setVisiblePreviewImg(false);
  };
  const confirmPreview = () => {
    // 此时的图片的
  };
  const changeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      e.stopPropagation();
      await changeImg(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragIn(true);
  };

  const hanleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragIn(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragIn(false);
    changeImg(e.dataTransfer.files[0]);
  };
  const onImgClick = () => {
    if (!uploadFileInput || !uploadFileInput.current) {
      return;
    }
    uploadFileInput.current.click();
  };

  const calculateHashWorker = (newChunks: FileList) => {
    return new Promise((resolve) => {
      const worker = new Worker('/worker');
      worker.postMessage({ chunks: newChunks });
      worker.onmessage = (e) => {
        const { progress, hash } = e.data;
        const newHashProgress = Number(progress.toFixed(2));
        setHashProgress(newHashProgress);
        if (hash) {
          resolve({
            hash,
            newHashProgress,
          });
        }
      };
    });
  };

  const appendToSpark = async (spark, count: number, newChunks: any[]) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(newChunks[count].file);
      reader.onload = (e) => {
        spark.append(e.target.result);
        resolve();
      };
    });
  };

  const calculateHashRequestIdle = (newChunks: FileList) => {
    window.requestIdleCallback =
      window.requestIdleCallback ||
      function (cb) {
        const start = Date.now();
        return setTimeout(() => {
          cb({
            didTimeout: false,
            timeRemaining() {
              return Math.max(0, 50 - (Date.now() - start));
            },
          });
        }, 1);
      };
    // 如果帧有富余时间或者超时
    //  对每个chunks进行添加
    let count = 0;
    let newHashProgress = 0;
    let hash = '';
    const spark = new SparkMd5.ArrayBuffer();
    return new Promise((resolve) => {
      const workLoop = async (deadline: any) => {
        while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && count < newChunks.length) {
          // 做一个分析
          await appendToSpark(spark, count, newChunks);
          count += 1;
          if (count < newChunks.length) {
            newHashProgress = Number(((count * 100) / newChunks.length).toFixed(2));
            setHashProgress(newHashProgress);
          } else {
            newHashProgress = 100;
            setHashProgress(newHashProgress);
            hash = spark.end();
            resolve({
              hash,
            });
          }
        }
        window.requestIdleCallback(workLoop);
      };
      window.requestIdleCallback(workLoop);
    });
  };

  const calculateHashSample = () => {
    console.log(fileUrl, '=========');
    // 第一个2M,最后一个区块数据全要
    // 中间的，取前中后各2个字节
    return new Promise((resolve) => {
      const spark = new SparkMd5.ArrayBuffer();
      const fileReader = new FileReader();
      const newChunks = [fileUrl.slice(0, offset)];
      let cur = 0;
      while (cur < fileUrl.size) {
        if (cur + offset >= fileUrl.size) {
          newChunks.push(fileUrl.slice(cur, fileUrl.size));
        } else {
          const mid = cur + offset / 2;
          const end = cur + offset;
          newChunks.push(fileUrl.slice(cur, cur + 2));
          newChunks.push(fileUrl.slice(mid, mid + 2));
          newChunks.push(fileUrl.slice(end - 2, end));
        }
        cur += offset;
      }

      // 得到了chunks
      fileReader.readAsArrayBuffer(new Blob(newChunks));
      fileReader.onload = (e) => {
        spark.append(e.target?.result);
        setHashProgress(100);
        resolve({
          hash: spark.end(),
        });
      };
    });
  };

  const calculateHashWorker2 = (newChunks: FileList) => {
    const worker = new Worker('./newWoker.js');
    worker.postMessage({ chunks: newChunks });
  };
  const calculateHashRequestIdle2 = (newChunks: FileList) => {
    window.requestIdleCallback =
      window.requestIdleCallback ||
      function (cb) {
        const start = Date.now();
        return setTimeout(() => {
          cb({
            timeRemaining() {
              return Math.max(0, 50 - (Date.now() - start));
            },
            didTimeout: false,
          });
        }, 1);
      };
    let count = 0;
    const spark = new SparkMd5.ArrayBuffer();
    return new Promise((resolve) => {
      const loadNext = async (deadline: any) => {
        while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && count < newChunks.length) {
          await appendToSpark(spark, count, chunks);
          count += 1;
          if (count === newChunks.length) {
            resolve({
              hash: spark.end(),
              hashProgress: 100,
            });
            setHashProgress(100);
          } else {
            resolve({
              hashProgress: Number(((count / newChunks.length) * 100).toFixed(2)),
            });

            setHashProgress(Number(((count / newChunks.length) * 100).toFixed(2)));
          }
        }

        window.requestIdleCallback(loadNext);
      };
      window.requestIdleCallback(loadNext);
    });
  };

  const calculateHashSample2 = () => {
    // 布隆过滤器
    // 对fileUrl进行分段
    const newChunks = [fileUrl.slice(0, offset)];
    let cur = 0;
    while (cur < fileUrl.size) {
      if (cur + offset >= fileUrl.size) {
        newChunks.push(fileUrl.slice(cur, fileUrl.size));
      } else {
        const mid = cur + offset / 2;
        newChunks.push(fileUrl.slice(cur, cur + 2));
        newChunks.push(fileUrl.slice(mid, mid + 2));
        newChunks.push(fileUrl.slice(cur + offset - 2, cur + offset));
      }
      cur += offset;
    }

    console.log(newChunks, '===========');
    // 将得到newchunks,转换成hash
    return new Promise((resolve) => {
      const fsReader = new FileReader();
      const spark = new SparkMd5.ArrayBuffer();
      fsReader.readAsArrayBuffer(new Blob(newChunks));
      fsReader.onload = (e) => {
        spark.append(e.target?.result);
        setHashProgress(100);
        resolve({
          hash: spark.end(),
        });
      };
    });
  };

  const upMove = (e: any) => {
    if (mainBox.current) {
      const mainBoxTop = getPosition(mainBox.current).top;
      const y = e.clientY;
      if (y > maxY || y < minY) {
        return;
      }
      const heightBefore = mainBox.current.offsetHeight - 2;
      const offsetTopBefore = mainBox.current.offsetTop;
      const addHeight = mainBoxTop - y;
      const heightAfter = addHeight + heightBefore;
      if (heightAfter < 1) {
        return;
      }
      const topAfter = offsetTopBefore - addHeight;
      mainBox.current.style.height = `${heightAfter}px`;
      mainBox.current.style.top = `${topAfter}px`;
    }
  };
  const leftMove = (e: MouseEvent) => {
    // 1.先要知道裁剪框的位置
    if (mainBox.current) {
      const mainBoxLeft = getPosition(mainBox.current).left;
      const x = e.clientX; // 此时左移鼠标的位置
      if (x > maxX || x < minX) {
        return;
      }
      const widthBefore = mainBox.current.offsetWidth - 2;
      const offsetBefore = mainBox.current.offsetLeft;
      const addWidth = mainBoxLeft - x; // 鼠标移动后，裁剪框增加的宽度
      const widthAfter = addWidth + widthBefore;
      if (widthAfter < 1) {
        return;
      }
      const leftAfter = offsetBefore - addWidth; // 裁剪框变化后，设置到父元素左边的距离
      mainBox.current.style.width = `${widthAfter}px`;
      mainBox.current.style.left = `${leftAfter}px`;
    }
  };

  // 鼠标向右移动，实际上就相当于将裁剪框的宽度增加。
  const rightMove = (e: MouseEvent) => {
    if (mainBox.current) {
      const mainBoxLeft = getPosition(mainBox.current).left;
      const x = e.clientX; // 此时左移鼠标的位置
      if (x > maxX || x < minX) {
        return;
      }
      const widthBefore = mainBox.current.offsetWidth - 2;
      const addWidth = x - mainBoxLeft - widthBefore;
      const widthAfter = addWidth + widthBefore;
      if (widthAfter < 1) {
        return;
      }
      mainBox.current.style.width = `${widthAfter}px`;
    }
  };

  const downMove = (e: MouseEvent) => {
    if (mainBox.current) {
      const mainBoxTop = getPosition(mainBox.current).top;
      const y = e.clientY; // 此时左移鼠标的位置
      if (y > maxY || y < minY) {
        return;
      }
      const heightBefore = mainBox.current.offsetHeight - 2;
      const addHeight = y - mainBoxTop - heightBefore;
      const heightAfter = addHeight + heightBefore;
      if (heightAfter < 1) {
        return;
      }
      mainBox.current.style.height = `${heightAfter}px`;
    }
  };
  const setDirectionFun = () => {
    const directionObj = {
      'left-up': function (e: any) {
        leftMove(e);
        upMove(e);
      },
      left (e: any) {
        leftMove(e);
      },
      up (e: any) {
        upMove(e);
      },
      right (e: any) {
        rightMove(e);
      },
      down (e: any) {
        downMove(e);
      },
      'right-down': function (e: any) {
        rightMove(e);
        downMove(e);
      },
      'right-up': function (e: any) {
        rightMove(e);
        upMove(e);
      },
      'left-down': function (e: any) {
        leftMove(e);
        downMove(e);
      },
    };
    return directionObj;
  };

  window.onmouseover = (e: MouseEvent) => {
    e.stopPropagation();
    if (ifKeyDown) {
      setDirectionFun()[direction](e);
      if (originImg2 && originImg2.current && mainBox && mainBox.current) {
        const left = mainBox.current.offsetLeft;
        const right = left + mainBox.current.offsetWidth;
        const top = mainBox.current.offsetTop;
        const bottom = mainBox.current.offsetTop + mainBox.current.offsetHeight;
        originImg2.current.style.clip = `rect(${top}px,${right}px,${bottom}px,${left}px)`;
        setPreview();
      }
    }
  };

  const mouseDownLeftUp = (e:MouseEvent) => {
    e.stopPropagation();
    setIfKeyDown(true);
    setDirection('left-up');
  };
  const mouseDownUp = (e:MouseEvent) => {
    e.stopPropagation();
    setIfKeyDown(true);
    setDirection('up');
  };
  const mouseDownRightUp = (e:MouseEvent) => {
    e.stopPropagation();
    setDirection('right-up');
    setIfKeyDown(true);
  };
  const mouseDownLeft = (e:MouseEvent) => {
    e.stopPropagation();
    setIfKeyDown(true);
    setDirection('left');
  };
  const mouseDownRight = (e:MouseEvent) => {
    e.stopPropagation();
    setIfKeyDown(true);
    setDirection('right');
  };
  const mouseDownLeftDown = (e:MouseEvent) => {
    e.stopPropagation();
    setIfKeyDown(true);
    setDirection('left-down');
  };
  const mouseDownDown = (e:MouseEvent) => {
    e.stopPropagation();
    setIfKeyDown(true);
    setDirection('down');
  };
  const mouseDownRightDown = (e:MouseEvent) => {
    e.stopPropagation();
    setIfKeyDown(true);
    setDirection('right-down');
  };

  window.onmouseup =  (e:MouseEvent)=>{
    e.stopPropagation();
    setIfKeyDown(false);
    setDirection('');
  };

  // 提交之前先裁剪再做处理（https://www.jianshu.com/p/b32205226e04）
  // 1.1能够切换待裁剪图片。
  // 1.2能够实现图片裁剪相关功能，如拖动裁剪框，改变裁剪框的大小等。
  // 1.3能够时时预览裁剪效果。
  // 1.4点击保存按钮，能够获取图片裁剪相关信息。

  // 点击提交的时后先判断网速
  const clickUpload = async () => {
    // 1.切片
    // 1.1先把图片切片
    const newChunks = createFileChunk(fileUrl);
    setChunks(newChunks);
    // 2.计算hash
    // 2.1采用web-worker分片
    // const {hash,hashProgress}=await calculateHashWorker(newChunks)
    // const {hash,hashProgress}=await calculateHashWorker2(newChunks)

    // 2.2采用window.requestIdleCallback
    // const {hash}=await calculateHashRequestIdle(newChunks);
    // const { hash } = await calculateHashRequestIdle2(newChunks);

    // 2.3采用布隆过滤器
    // const { hash } = await calculateHashSample();
    const { hash } = await calculateHashSample2();

    console.log(hash, '==============');

    const { dispatch } = props;

    // 先请求后端是否传过此图片
    dispatch({
      type: 'upload/checkFile',
      payload: {
        hash,
        chunks: newChunks,
        fileUrl,
      },
    });
    // // 请求后端,分开发送请求，
    // dispatch({
    //   type: 'upload/fetchCurrent',
    //   payload:{
    //     hash,
    //     chunks:newChunks,
    //     fileUrl
    //   }
    // })
    // for (let index = 0; index < newChunks.length; index += 1) {
    //   const form = new FormData();
    //   const name = `${hash}-${index}`;
    //   const chunk=newChunks[index].file;
    //   form.append('name', name);
    //   form.append('hash', hash);
    //   form.append('chunk', chunk);
    //   console.log(form.get("name"),'======');
    //   console.log(form,form.get("name"),newChunks[index],'============')
    //   dispatch({
    //     type: 'upload/fetchCurrent',
    //     payload: {
    //       form,
    //     },
    //   });
    // }

    // 并且监听后台传过来的值，如果都成功，给后端一个标志位，告诉这段已经结束了，你可以把这些请求合并了，否则就不发送和并请求
    // dispatch({
    //   type:'upload/mergeUploadfile',
    //   payload:{
    //     hash,
    //     ext:fileUrl.name.split('.').pop(),
    //     size:offset
    //   }
    // })
  };

  return (
    <>
      <PageHeader title="上传图片" />
      进度条: {hashProgress}
      <div className={styles['flex-align-center']}>
        <div
          className={`${styles['image-input']} ${styles['flex-center']} ${dragIn ? 'active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={hanleDragLeave}
          onDrop={handleDrop}
          onClick={onImgClick}
        >
          <input
            style={{ display: 'none' }}
            ref={uploadFileInput}
            type="file"
            onChange={changeFile}
          />
          {imgFileUrl ? (
            <>
              <img alt="example" style={{ width: '100%', height: '100%' }} src={imgFileUrl} />
            </>
          ) : (
            <>
              <PlusOutlined />
              <div>upload</div>
            </>
          )}
        </div>
        <div>
          <button onClick={clickUpload}>上传</button>
        </div>
      </div>
      {imgFileUrl && (
        <Modal
          title="编辑我的头像"
          visible={visiblePreviewImg}
          footer={
            <div>
              <Button type="primary" onClick={confirmPreview}>
                确定
              </Button>
              <Button onClick={cancelPreview}>取消</Button>
            </div>
          }
          style={{
            marginTop: 350,
          }}
          onCancel={cancelPreview}
        >
          <div
            style={{
              marginTop: 20,
              height: 300,
              width: 800,
              display: 'flex',
              // flexDirection:'column',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: 400,
                height:300,
                display: 'flex',
                position: 'relative',
              }}
            >
              <img
                ref={originImg}
                alt="example"
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  opacity: 0.5,
                  top: 0,
                  left: 0,
                }}
                src={imgFileUrl}
              />
              <img
                ref={originImg2}
                alt="example"
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  clip: 'rect(150px, 300px,300px, 150px)',
                  // clipPath: 'inset(150px,170px,170px,150px)',
                }}
                src={imgFileUrl}
              />
              <div
                ref={mainBox}
                className={styles.mainBox}
                style={{
                  width,
                  height,
                }}
              >
                <div
                  className={`${styles.minBox} ${styles['left-up']}`}
                  onMouseDown={mouseDownLeftUp}
                />
                <div className={`${styles.minBox} ${styles.up}`} onMouseDown={mouseDownUp} />
                <div
                  className={`${styles.minBox} ${styles['right-up']}`}
                  onMouseDown={mouseDownRightUp}
                />
                <div className={`${styles.minBox} ${styles.left}`} onMouseDown={mouseDownLeft} />
                <div className={`${styles.minBox} ${styles.right}`} onMouseDown={mouseDownRight} />
                <div
                  className={`${styles.minBox} ${styles['left-down']}`}
                  onMouseDown={mouseDownLeftDown}
                />
                <div className={`${styles.minBox} ${styles.down}`} onMouseDown={mouseDownDown} />
                <div
                  className={`${styles.minBox} ${styles['right-down']}`}
                  onMouseDown={mouseDownRightDown}
                />
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <img
                style={{ width: 200, position: 'absolute' }}
                ref={originImg3}
                src={imgFileUrl}
                alt="preview"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default connect(({ upload }: ConnectState) => {
  return {
    upload,
  };
})(UploadAdd);
