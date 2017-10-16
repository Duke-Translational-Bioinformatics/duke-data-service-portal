importScripts('spark-md5.min.js');

function calcMD5(f, id) {
    const blobSlice = Blob.prototype.slice;
    const chunkSize = 2097152;
    const chunks = Math.ceil(f.size/chunkSize);
    const spark = new SparkMD5.ArrayBuffer();
    let currentChunk = 0;

    const fr = new FileReader();
    fr.onload = function(e) {
        spark.append(e.target.result);
        if (currentChunk === chunks) {
            postMessage({id: id, hash: spark.end(), complete: true});
        } else {
            postMessage({id: id, hash: currentChunk+' / '+chunks, complete: false});
            const start = currentChunk * chunkSize;
            const end = ((start + chunkSize) >= f.size) ? f.size : start + chunkSize;
            fr.readAsArrayBuffer(blobSlice.call(f, start, end));
            currentChunk++;
        }
    };
    fr.onerror = function(e) {
        postMessage({id: id, msg: e.message, error: true});
    };
    fr.readAsArrayBuffer(blobSlice.call(f,currentChunk + chunkSize, chunkSize));
}

onmessage = function(e) {
    calcMD5(e.data.blob, e.data.uploadId);
};