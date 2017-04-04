import DDS_PORTAL_CONFIG from '../ddsPortalConfig';

export const UrlGen = {
    routes: {
        authServiceUri: DDS_PORTAL_CONFIG.authServiceUri,
        baseUrl: DDS_PORTAL_CONFIG.baseUrl,
        apiPrefix: '/api/v1/',
        login: () => '/login',
        home: () => '/',
        metadata: () => '/#/metadata',
        publicPrivacy: () => '/#/public_privacy',
        privacy: () => '/#/privacy',
        project: (projectId) => '/#/project/' + projectId,
        folder: (folderId) => '/#/folder/' + folderId,
        file: (fileId) => '/#/file/' + fileId,
        version: (versionId) => '/#/version/' + versionId,
        agents: () => '/#/agents',
        agent: (agentId) => '/#/agent/' + agentId
    }
};

export const Path = Object.freeze({
    ACCESS_TOKEN: '/user/api_token?access_token=',
    ACTIVITIES: 'activities/',
    AUTH_PROVIDERS: 'auth_providers/',
    AGENT: 'software_agents/',
    CHILDREN: '/children',
    CURRENT_USER: 'current_user/',
    FILE: 'files/',
    FILE_VERSION: 'file_versions/',
    FOLDER : 'folders/',
    META: 'meta/',
    PERMISSIONS: '/permissions',
    PROJECT : 'projects/',
    PROPERTIES : '/properties',
    RELATIONS: 'relations/',
    SEARCH: '/search',
    TAGS: 'tags/',
    TEMPLATES: 'templates/',
    TEMPLATE_PROPERTIES: 'template_properties/',
    UPLOAD: 'uploads/',
    VERSIONS: 'versions/'
});

export const Kind = Object.freeze({
    DDS_FILE: 'dds-file',
    DDS_FOLDER: 'dds-folder',
    DDS_PROJECT: 'dds-project'
});