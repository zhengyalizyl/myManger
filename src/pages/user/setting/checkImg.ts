export const getImageUtils = (file: File) => {
  const fileReader = new FileReader();
  return new Promise((reslove) => {
    fileReader.onload = (e) => {
      const { result } = e.target;
      console.log(result, '=========');
      const ret = [...new Uint8Array(result)]
        .map((v) => v.toString(16).toUpperCase())
        .map((v) => v.padStart(2, '0'));
      reslove(ret);
    };
    fileReader.readAsArrayBuffer(file);
  });
};

export const isGif = async (file: File) => {
  const result = await getImageUtils(file.slice(0, 6));
  return result.join(' ') === '47 49 46 38 39 61' || result.join(' ') === '47 49 46 38 37 61';
};

export const isJpg = async (file: File) => {
  const result1 = await getImageUtils(file.slice(0, 2));
  const result2 = await getImageUtils(file.slice(file.size - 2, file.size));
  return result1.join(' ') === 'FF D8' && result2.join(' ') === 'FF D9';
};

export const isPng = async (file: File) => {
  const result = await getImageUtils(file.slice(0, 8));
  return result.join(' ') === '89 50 4E 47 0D 0A 1A 0A';
};
