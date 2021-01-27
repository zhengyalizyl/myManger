/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */
import React, { useState, useRef } from 'react';
import { PageHeader, message, Modal } from 'antd';
import { FileSearchOutlined, PlusOutlined } from '@ant-design/icons';
import SparkMd5 from 'spark-md5';
import { connect } from 'umi';
import { ConnectState } from '../../models/connect';
import styles from './index.less';
import {
  isPng,
  isGif,
  isJpg,
  isExeccedMaxSize,
  getBase64FromImg,
  createFileChunk,
} from './checkImg';

interface UploadAddProps {
  onChange?: (files: FileReaderEventMap) => void;
}

const UploadAdd: React.FC<UploadAddProps> = (props) => {
  const [dragIn, setDragIn] = useState(false);
  const uploadFileInput = useRef(null);
  const [imgFileUrl, setImgFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [chunks, setChunks] = useState([{}]);
  const [hashProgress, setHashProgress] = useState(0);
  const [visiblePreviewImg, setVisiblePreviewImg] = useState(false);
  const offset = 0.01 * 1024 * 1024;

  const changeImg = async (file: File) => {
    // 这里需要判断是否是图片
    const isCheckPng = await isPng(file);
    const isCheckJpg = await isJpg(file);
    const isCheckGif = await isGif(file);
    const isimg = isCheckGif || isCheckJpg || isCheckPng;
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
  };

  const cancelPreview = (e) => {
    e.preventDefault();
    setVisiblePreviewImg(false);
  };
  const changeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    const file = e.target?.files[0];
    await changeImg(file);
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

  const appendToSpark = async (spark, count, newChunks) => {
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
    // 请求后端,分开发送请求，
    for (let index = 0; index < newChunks.length; index += 1) {
      const form = new FormData();
      const name = `${hash}-${index}`;
      const chunk=newChunks[index].file;
      form.append('name', name);
      form.append('hash', hash);
      form.append('chunk', chunk);
      console.log(form.get("name"),'======');
      console.log(form,form.get("name"),newChunks[index],'============')
      dispatch({
        type: 'upload/fetchCurrent',
        payload: {
          form,
        },
      });
    }

    // 并且监听后台传过来的值，如果都成功，给后端一个标志位，告诉这段已经结束了，你可以把这些请求合并了，否则就不发送和并请求
    dispatch({
      type:'upload/mergeUploadfile',
      payload:{
        hash,
        ext:fileUrl.name.split('.').pop(),
        size:offset
      }
    })


  };


  // <Modal
  //           title='编辑我的头像'
  //           visible={ visiblePreviewImg }
  //           footer={null}
  //           onCancel={cancelPreview}
  //       >
  //           <div style={{
  //              marginTop:20,
  //              height:470,
  //              display:'flex',
  //              justifyContent:'center',
  //               alignItems:'center'}}>
  //               <img
  //                   alt="example"
  //                   style={{width: '100%',height:'100%' }}
  //                   src={imgFileUrl}
  //               />
  //           </div>
  //           {/* <div style={{clear:'both'}} /> */}
  //       </Modal>

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
    </>
  );
};

export default connect(({ upload }: ConnectState) => {
  return {
    upload,
  };
})(UploadAdd);
