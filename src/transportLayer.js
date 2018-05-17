import { UrlGen, Path, Kind } from './util/urlEnum';
import { getFetchParams } from './util/fetchUtil';
import authStore from './stores/authStore';

const DDS_BASE_URI = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DDS_API_URL : 'https://apidev.dataservice.duke.edu';
const apiPrefix = UrlGen.routes.apiPrefix;
console.log(process.env);
console.log(process.env.REACT_APP_DDS_API_URL)
console.log(process.env.NODE_ENV);

const transportLayer = {
    getAuthProviders: () => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.AUTH_PROVIDERS, getFetchParams('get'))
    },
    getApiToken: (accessToken, appConfig) => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.ACCESS_TOKEN+accessToken}&authentication_service_id=${appConfig.serviceId}`, getFetchParams('get'))
    },
    getCurrentUser: () => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.CURRENT_USER, getFetchParams('get', authStore.appConfig.apiToken))
    },
    getUserKey: () => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.CURRENT_USER}api_key`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    createUserKey: () => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.CURRENT_USER}api_key`, getFetchParams('put', authStore.appConfig.apiToken))
    },
    deleteUserKey: () => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.CURRENT_USER}api_key`, getFetchParams('delete', authStore.appConfig.apiToken))
    },
    getActivities: () => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.ACTIVITIES, getFetchParams('get', authStore.appConfig.apiToken))
    },
    getWasGeneratedByNode: (id) => {
        const body = {
            'file_versions': [{
                id: id
            }]
        };
        return fetch(`${DDS_BASE_URI+apiPrefix}search/provenance/origin`, getFetchParams('post', authStore.appConfig.apiToken, body))
    },
    getProvenance: (id, kind) => {
        const body = {
            'start_node': {
                kind: kind,
                id: id
            }
        };
        return fetch(`${DDS_BASE_URI+apiPrefix}search/provenance?max_hops=5`, getFetchParams('post', authStore.appConfig.apiToken, body))
    },
    addProvRelation: (kind, body) => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.RELATIONS+kind, getFetchParams('post', authStore.appConfig.apiToken, body))
    },
    deleteProvItem: (id, kind) => {
        return fetch(DDS_BASE_URI+apiPrefix+kind+id, getFetchParams('delete', authStore.appConfig.apiToken))
    },
    addProvActivity: (name, desc) => {
        const body = {
            "name": name,
            "description": desc
        };
        return fetch(DDS_BASE_URI+apiPrefix+Path.ACTIVITIES, getFetchParams('post', authStore.appConfig.apiToken, body))
    },
    editProvActivity: (id, name, desc) => {
        const body = {
            "name": name,
            "description": desc
        };
        return fetch(DDS_BASE_URI+apiPrefix+Path.ACTIVITIES+id, getFetchParams('put', authStore.appConfig.apiToken, body))
    },
    getProvFileVersions: (id) => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.FILE+id}/${Path.VERSIONS}`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    createAgentKey: (id) => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.AGENT+id}/api_key`, getFetchParams('put', authStore.appConfig.apiToken))
    },
    getAgentKey: (id) => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.AGENT+id}/api_key`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    getAgentApiToken: (agentKey, userKey) => {
        const body = {
            'agent_key': agentKey,
            'user_key': userKey
        };
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.AGENT}api_token`, getFetchParams('post', authStore.appConfig.apiToken, body))
    },
    getAgents: () => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.AGENT}?per_page=1000`,getFetchParams('get', authStore.appConfig.apiToken))
    },
    addAgent: (name, desc, repo) => {
        const body = {
            "name": name,
            "description": desc,
            "repo_url": repo
        };
        return fetch(DDS_BASE_URI+apiPrefix+Path.AGENT, getFetchParams('post', authStore.appConfig.apiToken, body))
    },
    editAgent: (id, name, desc, repo) => {
        const body = {
            "name": name,
            "description": desc,
            "repo_url": repo
        };
        return fetch(DDS_BASE_URI+apiPrefix+Path.AGENT+id, getFetchParams('put', authStore.appConfig.apiToken, body))
    },
    deleteAgent: (id) => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.AGENT+id, getFetchParams('delete', authStore.appConfig.apiToken))
    },
    getUsageDetails: () => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.CURRENT_USER}usage`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    getProjects: (page, perPage) => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.PROJECT}?page=${page}&per_page=${perPage}`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    getProjectMembers: (id) => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.PROJECT+id+Path.PERMISSIONS, getFetchParams('get', authStore.appConfig.apiToken))
    },
    addProject: (name, desc) => {
        const body = {
            "name": name,
            "description": desc
        };
        return fetch(DDS_BASE_URI+apiPrefix+Path.PROJECT, getFetchParams('post', authStore.appConfig.apiToken, body))
    },
    editProject: (id, name, desc) => {
        const body = {
            "name": name,
            "description": desc
        };
        return fetch(DDS_BASE_URI+apiPrefix+Path.PROJECT+id, getFetchParams('put', authStore.appConfig.apiToken, body))
    },
    deleteProject: (id) => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.PROJECT+id, getFetchParams('delete', authStore.appConfig.apiToken))
    },
    getProjectDetails: (id) => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.PROJECT+id, getFetchParams('get', authStore.appConfig.apiToken))
    },
    addFolder: (id, parentKind, name) => {
        const body = {
            "name": name,
            "parent": {
                "kind": parentKind,
                "id": id
            }
        };
        return fetch(DDS_BASE_URI+apiPrefix+Path.FOLDER, getFetchParams('post', authStore.appConfig.apiToken, body))
    },
    deleteFolder: (id) => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.FOLDER+id, getFetchParams('delete', authStore.appConfig.apiToken))
    },
    deleteFile: (id) => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.FILE+id, getFetchParams('delete', authStore.appConfig.apiToken))
    },
    editVersionLabel: (id, label) => {
        const body = {
            "label": label
        };
        return fetch(DDS_BASE_URI+apiPrefix+Path.FILE_VERSION+id, getFetchParams('put', authStore.appConfig.apiToken, body))
    },
    deleteVersion: (id) => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.FILE_VERSION+id, getFetchParams('delete', authStore.appConfig.apiToken))
    },
    editItem: (id, name, path) => {
        const body = {
            "name": name
        };
        return fetch(`${DDS_BASE_URI+apiPrefix+path+id}/rename`, getFetchParams('put', authStore.appConfig.apiToken, body))
    },
    getMoveItemList: (id, path) => {
        return fetch(DDS_BASE_URI+apiPrefix+path+id+Path.CHILDREN, getFetchParams('get', authStore.appConfig.apiToken))
    },
    moveItem: (id, path, destination, destinationKind) => {
        const body = {
            "parent": {
                "kind": destinationKind,
                "id": destination
            }
        };
        return fetch(`${DDS_BASE_URI+apiPrefix+path+id}/move`, getFetchParams('put', authStore.appConfig.apiToken, body))
    },
    getEntity: (id, path) => {
        return fetch(DDS_BASE_URI+apiPrefix+path+id, getFetchParams('get', authStore.appConfig.apiToken))
    },
    setSelectedEntity: (id, path) => {
        return fetch(DDS_BASE_URI+apiPrefix+path+id, getFetchParams('get', authStore.appConfig.apiToken))
    },
    getObjectMetadata: (id, kind) => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.META+kind}/${id}`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    getUserNameFromAuthProvider: (text, id) => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.AUTH_PROVIDERS+id}/affiliates?full_name_contains=${text}`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    registerNewUser: (id) => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.AUTH_PROVIDERS+authStore.appConfig.authServiceId}/affiliates/${id}/dds_user`, getFetchParams('post', authStore.appConfig.apiToken))
    },
    getUserId: (fullName) => {
        return fetch(`${DDS_BASE_URI+apiPrefix}users?full_name_contains=${fullName}&page=1&per_page=500`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    addProjectMember: (id, userId, role) => {
        const body = {
            'auth_role': {'id': role}
        };
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.PROJECT+id}/permissions/${userId}`, getFetchParams('put', authStore.appConfig.apiToken, body))
    },
    deleteProjectMember: (id, userId) => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.PROJECT+id}/permissions/${userId}`, getFetchParams('delete', authStore.appConfig.apiToken))
    },
    getTagAutoCompleteList: (query) => {
        return fetch(`${DDS_BASE_URI+apiPrefix}tags/labels/?object_kind=dds-file${query}`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    getTagLabels: () => {
        return fetch(`${DDS_BASE_URI+apiPrefix}tags/labels/?object_kind=dds-file`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    getTags: (id, kind) => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.TAGS+kind}/${id}`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    addNewTag: (id, kind, tag) => {
        const body = {
            'label': tag
        };
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.TAGS+kind}/${id}`, getFetchParams('post', authStore.appConfig.apiToken, body))
    },
    appendTags: (id, kind, tags) => {
        const body = {
            tags
        };
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.TAGS+kind}/${id}/append`, getFetchParams('post', authStore.appConfig.apiToken, body))
    },
    deleteTag: (id) => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.TAGS+id, getFetchParams('delete', authStore.appConfig.apiToken))
    },
    startUpload: (projId, fileName, contentType, SIZE) => {
        const body = {
            'name': fileName,
            'content_type': contentType,
            'size': SIZE
        };
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.PROJECT+projId}/${Path.UPLOAD}`, getFetchParams('post', authStore.appConfig.apiToken, body))
    },
    getChunkUrl: (uploadId, chunkNum, size, md5crc, algorithm) => {
        const body = {
            "number": chunkNum,
            "size": size,
            'hash': {
                'value': md5crc,
                'algorithm': algorithm
            }
        };
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.UPLOAD+uploadId}/chunks`, getFetchParams('put', authStore.appConfig.apiToken, body))
    },
    allChunksUploaded: (uploadId, hash, algorithm) => {
        const body = {
            'hash': {
                'value': hash,
                'algorithm': 'md5'
            }
        };
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.UPLOAD+uploadId}/complete`, getFetchParams('put', authStore.appConfig.apiToken, body))
    },
    addFile: (uploadId, parentId, parentKind) => {
        const body = {
            'parent': {
                'kind': parentKind,
                'id': parentId
            },
            'upload': {
                'id': uploadId
            }
        };
        return fetch(DDS_BASE_URI+apiPrefix+Path.FILE, getFetchParams('post', authStore.appConfig.apiToken, body))
    },
    addFileVersion: (uploadId, label, fileId) => {
        const body = {
            'upload': {
                'id': uploadId
            },
            'label': label
        };
        return fetch(DDS_BASE_URI+apiPrefix+Path.FILE+fileId, getFetchParams('put', authStore.appConfig.apiToken, body))
    },
    getFileVersions: (id) => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.FILE+id}/${Path.VERSIONS}`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    getDownloadUrl: (id, kind) => {
        return fetch(`${DDS_BASE_URI+apiPrefix+kind+id}/url`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    getChildren: (id, path, page) => {
        return fetch(`${DDS_BASE_URI+apiPrefix+path+id+Path.CHILDREN}?page=${page}&per_page=25`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    getUser: (id) => {
        return fetch(`${DDS_BASE_URI+apiPrefix}current_user`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    getPermissions: (id, userId) => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.PROJECT+id}/permissions/${userId}`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    searchFiles: (text, id) => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.PROJECT+id}/children?name_contains=${text}`, getFetchParams('get', authStore.appConfig.apiToken))
    },
    loadMetadataTemplates: (searchQuery) => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.TEMPLATES+searchQuery, getFetchParams('get', authStore.appConfig.apiToken))
    },
    createMetadataTemplate: (name, label, desc) => {
        const body = {
            "name": name,
            "label": label,
            "description": desc
        };
        return fetch(DDS_BASE_URI+apiPrefix+Path.TEMPLATES, getFetchParams('post', authStore.appConfig.apiToken, body))
    },
    getMetadataTemplateDetails: (id) => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.TEMPLATES+id, getFetchParams('get', authStore.appConfig.apiToken))
    },
    getMetadataTemplateProperties: (id) => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.TEMPLATES+id+Path.PROPERTIES, getFetchParams('get', authStore.appConfig.apiToken))
    },
    updateMetadataTemplate: (id, name, label, desc) => {
        const body = {
            "name": name,
            "label": label,
            "description": desc
        };
        return fetch(DDS_BASE_URI+apiPrefix+Path.TEMPLATES+id, getFetchParams('put', authStore.appConfig.apiToken, body))
    },
    deleteTemplate: (id) => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.TEMPLATES+id, getFetchParams('delete', authStore.appConfig.apiToken))
    },
    deleteMetadataProperty: (id) => {
        return fetch(DDS_BASE_URI+apiPrefix+Path.TEMPLATE_PROPERTIES+id, getFetchParams('delete', authStore.appConfig.apiToken))
    },
    deleteObjectMetadata: (object, templateId) => {
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.META+object.kind}/${object.id}/${templateId}`, getFetchParams('delete', authStore.appConfig.apiToken))
    },
    createMetadataObject: (kind, id, templateId, properties) => {
        const body = {
            "properties": properties
        };
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.META+kind}/${id}/${templateId}`, getFetchParams('post', authStore.appConfig.apiToken, body))
    },
    updateMetadataObject: (kind, id, templateId, properties) => {
        const body = {
            "properties": properties
        };
        return fetch(`${DDS_BASE_URI+apiPrefix+Path.META+kind}/${id}/${templateId}`, getFetchParams('put', authStore.appConfig.apiToken, body))
    },
    createMetadataProperty: (id, name, label, desc, type) => {
        const body = {
            "key": name,
            "label": label,
            "description": desc,
            "type": type
        };
        return fetch(DDS_BASE_URI+apiPrefix+Path.TEMPLATES+id+Path.PROPERTIES, getFetchParams('post', authStore.appConfig.apiToken, body))
    },
    searchObjects: (query, kindFilter, projectPostFilter, tagPostFilter, page) => {
        const kind = kindFilter.length ? kindFilter : [Kind.DDS_FILE, Kind.DDS_FOLDER];
        const postFilters = [];
        if(projectPostFilter['project.name'].length) postFilters.push(projectPostFilter);
        if(tagPostFilter['tags.label'].length) postFilters.push(tagPostFilter);
        const body =  {
            "query_string": {
                "query": query
            },
            "filters": [
                {"kind": kind}
            ],
            "aggs": [
                {
                    "field": "project.name",
                    "name": "project_names",
                    "size": 50
                },
                {
                    "field": "tags.label",
                    "name": "tags",
                    "size": 50
                },
            ],
            "post_filters": postFilters
        };
        return fetch(`${DDS_BASE_URI+apiPrefix}search/folders_files?page=${page}&per_page=25`, getFetchParams('post', authStore.appConfig.apiToken, body))
    },
};

export default transportLayer