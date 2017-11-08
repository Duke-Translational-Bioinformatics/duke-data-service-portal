export const StatusEnum = Object.freeze({
    STATUS_WAITING_FOR_UPLOAD : null,
    STATUS_SUCCESS : 1,
    STATUS_RETRY : 2,
    STATUS_UPLOADING : 3,
    STATUS_FAILED : 4,
    MAX_RETRY : 5,
});

export const ChunkSize = Object.freeze({
    BYTES_PER_CHUNK : 25000000,
    BYTES_PER_HASHING_CHUNK : 5000000,
});

export const Roles = Object.freeze({
    project_admin : 'project_admin',
    system_admin : 'system_admin',
    project_viewer : 'project_viewer',
    file_uploader : 'file_uploader',
    file_downloader : 'file_downloader',
    file_editor : 'file_editor',
});