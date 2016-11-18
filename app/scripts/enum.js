export const StatusEnum = Object.freeze({
    STATUS_WAITING_FOR_UPLOAD : null,
    STATUS_SUCCESS : 1,
    STATUS_RETRY : 2,
    STATUS_UPLOADING : 3,
    STATUS_FAILED : 4,
    MAX_RETRY : 2
});

export const Path = Object.freeze({
    ACTIVITIES: 'activities/',
    AGENT: 'software_agents/',
    CURRENT_USER: 'current_user/',
    FILE: 'files/',
    FILE_VERSION: 'file_versions/',
    FOLDER : 'folders/',
    META: 'meta/',
    PROJECT : 'projects/',
    PROPERTIES : '/properties',
    TAGS: 'tags/',
    TEMPLATES: 'templates/',
    TEMPLATE_PROPERTIES: 'template_properties/',
    UPLOAD: 'uploads/'
});

