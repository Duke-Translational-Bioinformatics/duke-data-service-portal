export const StatusEnum = Object.freeze({
    STATUS_WAITING_FOR_UPLOAD : null,
    STATUS_SUCCESS : 1,
    STATUS_RETRY : 2,
    STATUS_UPLOADING : 3,
    STATUS_FAILED : 4,
    MAX_RETRY : 5,
});

export const ChunkSize = Object.freeze({
    BYTES_PER_CHUNK : 5000000,
    BYTES_PER_HASHING_CHUNK : 5000000,
});