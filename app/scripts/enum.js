export const StatusEnum = Object.freeze({
    STATUS_WAITING_FOR_UPLOAD : null,
    STATUS_SUCCESS : 1,
    STATUS_RETRY : 2,
    STATUS_UPLOADING : 3,
    STATUS_FAILED : 4,
    MAX_RETRY : 2
});

export const Path = Object.freeze({
    AGENT: 'software_agents/',
    CURRENT_USER: 'current_user/',
    FILE: 'files/',
    FILE_VERSION: 'file_versions/',
    FOLDER : 'folders/',
    PROJECT : 'projects/',
    UPLOAD: 'uploads/'
});

