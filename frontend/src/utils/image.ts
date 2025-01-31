type resizeImageProps = {
  file: File;
  maxHeight: number;
  maxWidth: number;
};
export const resizeImage = ({
  file,
  maxWidth,
  maxHeight,
}: resizeImageProps): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };

    reader.onerror = (err) => {
      reject(err);
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // NOTE: リサイズ
      let width = img.width;
      let height = img.height;
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = (maxHeight / width) * height;
          width = maxWidth;
        } else {
          width = (maxWidth / height) * width;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8); // JPEG形式でエンコード
      resolve(resizedDataUrl);
    };

    img.onerror = (err) => {
      reject(err);
    };

    reader.readAsDataURL(file);
  });
};
