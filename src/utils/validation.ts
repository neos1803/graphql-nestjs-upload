export function fileSizeValidation(stream?: any, maxSize?: number, callback?): Promise<any> {

  return new Promise((resolve, reject) => {
    let bytes=0;

    stream.on("data", (chunk) => {
      bytes += chunk.length;
    });

    stream.on("end", () => {
      if (bytes > maxSize) {
        reject(`File exceeds the maximum size ${maxSize}`);
      } else {
        resolve(bytes);
      }
    });

    stream.on("error", (e) => {
      reject(e);
    });
  });

}