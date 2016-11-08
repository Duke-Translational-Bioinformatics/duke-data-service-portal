import Reflux from 'reflux';
import MainActions from '../actions/mainActions';
import MainStore from '../stores/mainStore';
import ProjectStore from '../stores/projectStore';
import urlGen from '../../util/urlGen.js';
import appConfig from '../config';
import { StatusEnum, Path } from '../enum';
import { checkStatus, getAuthenticatedFetchParams } from '../../util/fetchUtil.js';

var ProjectActions = Reflux.createActions([
    'deleteMetadataProperty',
    'deleteMetadataPropertySuccess',
    'getMetadataTemplateProperties',
    'getMetadataTemplatePropertiesSuccess',
    'showMetaDataTemplateDetails',
    'createMetadataProperty',
    'createMetadataPropertySuccess',
    'showTemplatePropManager',
    'deleteTemplate',
    'deleteTemplateSuccess',
    'updateMetadataTemplate',
    'updateMetadataTemplateSuccess',
    'createMetadataTemplateSuccess',
    'createMetadataTemplate',
    'toggleMetadataManager',
    'getMetadataTemplateDetails',
    'getMetadataTemplateDetailsSuccess',
    'loadMetadataTemplates',
    'loadMetadataTemplatesSuccess',
    'expandProvenanceGraph',
    'clearProvFileVersions',
    'clearSearchFilesData',
    'searchFiles',
    'searchFilesSuccess',
    'deleteProvItem',
    'deleteProvItemSuccess',
    'openProvEditorModal',
    'closeProvEditorModal',
    'switchRelationFromTo',
    'getFromAndToNodes',
    'buildRelationBody',
    'startAddRelation',
    'addFileToGraph',
    'addProvRelation',
    'addProvRelationSuccess',
    'addProvActivity',
    'addProvActivitySuccess',
    'editProvActivity',
    'editProvActivitySuccess',
    'getActivities',
    'getActivitiesSuccess',
    'hideProvAlert',
    'toggleGraphLoading',
    'toggleProvView',
    'toggleProvEditor',
    'toggleProvNodeDetails',
    'toggleAddEdgeMode',
    'showRemoveFileFromProvBtn',
    'showProvControlBtns',
    'showDeleteRelationsBtn',
    'selectNodesAndEdges',
    'getProvenance',
    'getWasGeneratedByNode',
    'getProvenanceSuccess',
    'saveGraphZoomState',
    'clearSelectedItems',
    'getScreenSize',
    'toggleUploadManager',
    'toggleTagManager',
    'addNewTag',
    'addNewTagSuccess',
    'appendTags',
    'appendTagsSuccess',
    'getTagAutoCompleteList',
    'getTagAutoCompleteListSuccess',
    'getTagLabels',
    'getTagLabelsSuccess',
    'getTags',
    'getTagsSuccess',
    'deleteTag',
    'deleteTagSuccess',
    'getDeviceType',
    'hashFile',
    'postHash',
    'checkForHash',
    'openModal',
    'closeModal',
    'openMoveModal',
    'openVersionModal',
    'closeVersionModal',
    'moveItemWarning',
    'moveFolder',
    'moveFolderSuccess',
    'moveFile',
    'moveFileSuccess',
    'selectMoveLocation',
    'handleBatch',
    'closeErrorModal',
    'getFileVersions',
    'getFileVersionsSuccess',
    'addFileVersion',
    'addFileVersionSuccess',
    'deleteVersion',
    'deleteVersionSuccess',
    'editVersion',
    'editVersionSuccess',
    'getUser',
    'getUserSuccess',
    'getPermissions',
    'getPermissionsSuccess',
    'getUserKey',
    'getUserKeySuccess',
    'createUserKey',
    'createUserKeySuccess',
    'deleteUserKey',
    'deleteUserKeySuccess',
    'getUsageDetails',
    'getUsageDetailsSuccess',
    'handleErrors',
    'addAgent',
    'addAgentSuccess',
    'editAgent',
    'editAgentSuccess',
    'deleteAgent',
    'deleteAgentSuccess',
    'loadAgents',
    'loadAgentsSuccess',
    'createAgentKey',
    'createAgentKeySuccess',
    'getAgentKey',
    'getAgentKeySuccess',
    'getAgentApiToken',
    'getAgentApiTokenSuccess',
    'clearApiToken',
    'loadProjects',
    'loadProjectsSuccess',
    'deleteItemSuccess',
    'addProject',
    'addProjectSuccess',
    'deleteProject',
    'deleteProjectSuccess',
    'editProject',
    'editProjectSuccess',
    'showDetails',
    'showDetailsSuccess',
    'addFolder',
    'addFolderSuccess',
    'deleteFolder',
    'editFolder',
    'editFolderSuccess',
    'addFile',
    'addFileSuccess',
    'deleteFile',
    'editFile',
    'editFileSuccess',
    'getEntity',
    'getEntitySuccess',
    'getProjectMembers',
    'getProjectMembersSuccess',
    'getUserName',
    'getUserNameSuccess',
    'getUserId',
    'getUserIdSuccess',
    'addProjectMember',
    'addProjectMemberSuccess',
    'deleteProjectMember',
    'deleteProjectMemberSuccess',
    'getDownloadUrl',
    'getDownloadUrlSuccess',
    'showBatchOptions',
    'setBatchItems',
    'batchDeleteItems',
    'startUpload',
    'startUploadSuccess',
    'updateChunkProgress',
    'updateAndProcessChunks',
    'allChunksUploaded',
    'uploadError',
    'getChunkUrl',
    'getWindowSize',
    'search',
    'setSearchText',
    'getChildren',
    'getChildrenSuccess',
    'removeErrorModal',
    'removeFailedUploads',
    'toggleModals'
]);

ProjectActions.deleteMetadataProperty.preEmit = function (id, label) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.TEMPLATE_PROPERTIES + id, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function (json) {
        MainActions.addToast('The '+label+' property has been deleted');
        ProjectActions.deleteMetadataPropertySuccess(id);
    }).catch(function (ex) {
        MainActions.addToast('Failed to delete '+label);
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.getMetadataTemplateProperties.preEmit = function (id) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.TEMPLATES +id+'/properties', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getMetadataTemplatePropertiesSuccess(json.results)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.createMetadataProperty.preEmit = function (id, name, label, desc, type) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.TEMPLATES +id+'/properties', {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "key": name,
            "label": label,
            "description": desc,
            "type": type
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('A new template property called '+label+' was added');
        //ProjectActions.getMetadataTemplateProperties(id);
        ProjectActions.createMetadataPropertySuccess(json);
    }).catch(function (ex) {
        MainActions.addToast('Failed to add new template property');
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.deleteTemplate.preEmit = function (id, label) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.TEMPLATES + id, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function (json) {
        MainActions.addToast('The '+label+' template has been deleted');
        ProjectActions.deleteTemplateSuccess();
    }).catch(function (ex) {
        MainActions.addToast('Failed to delete '+label);
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.updateMetadataTemplate.preEmit = function (id, name, label, desc) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.TEMPLATES + id, {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "label": label,
            "description": desc
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast(label+' has been updated.');
        ProjectActions.getMetadataTemplateDetailsSuccess(json);
        ProjectActions.loadMetadataTemplates();
    }).catch(function (ex) {
        MainActions.addToast('Failed to update '+label);
        ProjectActions.handleErrors(ex)
    })
};


ProjectActions.createMetadataTemplate.preEmit = function (name, label, desc) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.TEMPLATES, {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "label": label,
            "description": desc
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('A new template called '+label+' was added');
        ProjectActions.getMetadataTemplateDetailsSuccess(json);
        ProjectActions.createMetadataTemplateSuccess(json);
    }).catch(function (ex) {
        MainActions.addToast('Failed to add new template');
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.getMetadataTemplateDetails.preEmit = function (id) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.TEMPLATES + id, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getMetadataTemplateDetailsSuccess(json)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.loadMetadataTemplates.preEmit = function (value) {
    let searchQuery = value !== null ? '?name_contains='+ value : '';
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.TEMPLATES + searchQuery, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.loadMetadataTemplatesSuccess(json.results)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.addProvRelation.preEmit = function (kind, body) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'relations/' + kind, {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('New relation Added');
        ProjectActions.addProvRelationSuccess(json);
    }).catch(function (ex) {
        MainActions.addToast('Failed to add new relation');
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.deleteProvItem.preEmit = function (data, id) {
    let kind = data.hasOwnProperty('from') ? 'relations/' : 'activities/';
    let msg = kind === 'activities/' ? data.label : data.type;
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + kind + data.id, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function (json) {
        MainActions.addToast(msg + ' deleted');
        ProjectActions.deleteProvItemSuccess(data);
    }).catch(function (ex) {
        MainActions.addToast('Failed to delete ' + msg);
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.addProvActivity.preEmit = function (name, desc) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.ACTIVITIES, {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "description": desc
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('New Activity Added');
        ProjectActions.addProvActivitySuccess(json);
    }).catch(function (ex) {
        MainActions.addToast('Failed to add new actvity');
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.editProvActivity.preEmit = function (id, name, desc, prevName) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.ACTIVITIES + id, {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "description": desc
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        if (name !== prevName) {
            MainActions.addToast(prevName + ' name was changed to ' + name);
        } else {
            MainActions.addToast(prevName + ' was edited');
        }
        ProjectActions.editProvActivitySuccess(json);
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.getActivities.preEmit = function () {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.ACTIVITIES, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getActivitiesSuccess(json.results)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.getProvenance.preEmit = function (id, kind, prevGraph) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'search/provenance?max_hops=1', {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'start_node': {
                kind: kind,
                id: id
            }
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getProvenanceSuccess(json.graph, prevGraph);
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.getWasGeneratedByNode.preEmit = function (id, kind, prevGraph) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'search/provenance/was_generated_by', {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'file_versions': [{
                id: id
            }]
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getProvenanceSuccess(json.graph, prevGraph);
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.search.preEmit = function (text, id) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.PROJECT + id + '/children?name_contains=' + text, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getChildrenSuccess(json.results);
        ProjectActions.setSearchText(text);
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.searchFiles.preEmit = function (text, id) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.PROJECT + id + '/children?name_contains=' + text, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.searchFilesSuccess(json.results);
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.addNewTag.preEmit = function (id, kind, tag) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.TAGS + kind + '/' + id, {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'label': tag
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Added ' + json.label + ' tag');
        ProjectActions.addNewTagSuccess(id);
    }).catch(function (ex) {
        MainActions.addToast('Failed to add new tag');
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.appendTags.preEmit = function (id, kind, tags) {
    let msg = tags.map((tag)=> {
        return tag.label
    });
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.TAGS + kind + '/' + id + '/append', {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            tags
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Added ' + msg + ' as tags to all selected files.');
        ProjectActions.appendTagsSuccess(id);
    }).catch(function (ex) {
        MainActions.addToast('Failed to add tags');
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.deleteTag.preEmit = function (id, label, fileId) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.TAGS + id, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function () {
        MainActions.addToast(label + ' tag deleted!');
        ProjectActions.deleteTagSuccess(fileId)
    }).catch(function (ex) {
        MainActions.addToast('Failed to delete ' + label);
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.getTagLabels.preEmit = function () {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'tags/labels/?object_kind=dds-file', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getTagLabelsSuccess(json.results)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};


ProjectActions.getTagAutoCompleteList.preEmit = function (text) {
    let query = text === null ? '' : '&label_contains=' + text;
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'tags/labels/?object_kind=dds-file' + query, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getTagAutoCompleteListSuccess(json.results)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.getTags.preEmit = function (id, kind) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.TAGS + kind + '/' + id, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getTagsSuccess(json.results)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.getFileVersions.preEmit = function (id, prov) { // prov = boolean used for file selection in prov editor
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.FILE + id + '/versions', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getFileVersionsSuccess(json.results, prov)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.addFileVersion.preEmit = function (uploadId, label, fileId) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.FILE + fileId, {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'upload': {
                'id': uploadId
            },
            'label': label
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Created New File Version!');
        ProjectActions.addFileVersionSuccess(fileId, uploadId)
    }).catch(function (ex) {
        MainActions.addToast('Failed to Create New Version');
        ProjectActions.uploadError(uploadId, label);
        ProjectActions.handleErrors(ex);
    });
};


ProjectActions.deleteVersion.preEmit = function (id) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.FILE_VERSION + id, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function () {
        MainActions.addToast('Version Deleted!');
        ProjectActions.deleteVersionSuccess()
    }).catch(function (ex) {
        MainActions.addToast('Failed to Delete Version!');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.editVersion.preEmit = function (id, label) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.FILE_VERSION + id, {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "label": label
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Label Updated!');
        ProjectActions.editVersionSuccess(id)
    }).catch(function (ex) {
        MainActions.addToast('Failed to Update Label');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.addAgent.preEmit = function (name, desc, repo) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.AGENT, {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "description": desc,
            "repo_url": repo
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('New software agent added');
        ProjectActions.addAgentSuccess()
    }).catch(function (ex) {
        MainActions.addToast('Failed to add new software agent');
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.editAgent.preEmit = function (id, name, desc, repo) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.AGENT + id, {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "description": desc,
            "repo_url": repo
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Software Agent Updated');
        ProjectActions.editAgentSuccess(id)
    }).catch(function (ex) {
        MainActions.addToast('Software Agent Update Failed');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.deleteAgent.preEmit = function (id) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.AGENT + id, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function (json) {
        MainActions.addToast('Software Agent Deleted');
        ProjectActions.deleteAgentSuccess(json)
    }).catch(function (ex) {
        MainActions.addToast('Failed to delete software agent');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.loadAgents.preEmit = function () {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.AGENT, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.loadAgentsSuccess(json.results)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.createAgentKey.preEmit = function (id) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.AGENT + id + '/api_key', {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('API Key created successfully');
        ProjectActions.createAgentKeySuccess(json);
    }).catch(function (ex) {
        MainActions.addToast('Failed to create new API key');
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.getAgentKey.preEmit = (id) => {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.AGENT + id + '/api_key', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getAgentKeySuccess(json)
    })
        .catch(function (ex) {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getAgentApiToken.preEmit = function (agentKey, userKey) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.AGENT + 'api_token', {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'agent_key': agentKey,
            'user_key': userKey
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getAgentApiTokenSuccess(json)
    }).catch(function (ex) {
        MainActions.addToast('Failed to generate an API token');
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.getUser.preEmit = (id) => {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'current_user', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    })
        .then(function (response) {
            return response.json()
        }).then(function (json) {
            ProjectActions.getUserSuccess(json, id)
        })
        .catch(function (ex) {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getPermissions.preEmit = (id, userId) => {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.PROJECT + id + '/permissions/' + userId, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    })
        .then(function (response) {
            return response.json()
        }).then(function (json) {
            ProjectActions.getPermissionsSuccess(json)
        })
        .catch(function (ex) {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getUserKey.preEmit = () => {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.CURRENT_USER + 'api_key', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    })
        .then(function (response) {
            return response.json()
        }).then(function (json) {
            ProjectActions.getUserKeySuccess(json)
        })
        .catch(function (ex) {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.createUserKey.preEmit = function (id) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.CURRENT_USER + 'api_key', {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('User Key created successfully');
        ProjectActions.createUserKeySuccess(json);
    }).catch(function (ex) {
        MainActions.addToast('Failed to create new User key');
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.deleteUserKey.preEmit = function () {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.CURRENT_USER + 'api_key', {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function (json) {
        MainActions.addToast('User key deleted');
        ProjectActions.deleteUserKeySuccess(json)
    }).catch(function (ex) {
        MainActions.addToast('Failed to delete user key');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.getUsageDetails.preEmit = function () {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.CURRENT_USER + 'usage', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getUsageDetailsSuccess(json)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.loadProjects.preEmit = function () {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.PROJECT, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.loadProjectsSuccess(json.results)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.showDetails.preEmit = function (id) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.PROJECT + id, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.showDetailsSuccess(json)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.addProject.preEmit = function (name, desc) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.PROJECT, {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "description": desc
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Project Added');
        ProjectActions.addProjectSuccess()
    }).catch(function (ex) {
        MainActions.addToast('Failed to add new project');
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.deleteProject.preEmit = function (id) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.PROJECT + id, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function (json) {
        MainActions.addToast('Project Deleted');
        ProjectActions.deleteProjectSuccess(json)
    }).catch(function (ex) {
        MainActions.addToast('Project Delete Failed');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.editProject.preEmit = function (id, name, desc) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.PROJECT + id, {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "description": desc
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Project Updated');
        ProjectActions.editProjectSuccess(id)
    }).catch(function (ex) {
        MainActions.addToast('Project Update Failed');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.getChildren.preEmit = function (id, path) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + path + id + '/children', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getChildrenSuccess(json.results)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.addFolder.preEmit = function (id, parentKind, name) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.FOLDER, {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "parent": {
                "kind": parentKind,
                "id": id
            }
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Folder Added');
        ProjectActions.addFolderSuccess(id, parentKind);
    }).catch(function (ex) {
        MainActions.addToast('Failed to Add a New Folder');
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.deleteFolder.preEmit = function (id, parentId, parentKind) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.FOLDER + id, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function () {
        MainActions.addToast('Folder(s) Deleted!');
        ProjectActions.deleteItemSuccess(parentId, parentKind)
    }).catch(function (ex) {
        MainActions.addToast('Folder Deleted Failed!');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.editFolder.preEmit = function (id, name) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.FOLDER + id + '/rename', {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": name
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Folder Updated!');
        ProjectActions.editFolderSuccess(id)
    }).catch(function (ex) {
        MainActions.addToast('Failed to Update Folder');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.moveFolder.preEmit = function (id, destination, destinationKind) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.FOLDER + id + '/move', {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "parent": {
                "kind": destinationKind,
                "id": destination
            }
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Folder moved successfully');
        ProjectActions.moveFolderSuccess();
    }).catch(function (ex) {
        MainActions.addToast('Failed to move folder to new location');
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.deleteFile.preEmit = function (id, parentId, parentKind) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.FILE + id, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function () {
        MainActions.addToast('File(s) Deleted!');
        ProjectActions.deleteItemSuccess(parentId, parentKind)
    }).catch(function (ex) {
        MainActions.addToast('Failed to Delete File!');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.editFile.preEmit = function (id, fileName) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.FILE + id + '/rename', {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "name": fileName
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('File Updated!');
        ProjectActions.editFileSuccess(id)
    }).catch(function (ex) {
        MainActions.addToast('Failed to Update File');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.moveFile.preEmit = function (id, destination, destinationKind) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.FILE + id + '/move', {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "parent": {
                "kind": destinationKind,
                "id": destination
            }
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('File moved successfully');
        ProjectActions.moveFileSuccess();
    }).catch(function (ex) {
        MainActions.addToast('Failed to move file to new location');
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.getEntity.preEmit = (id, kind, requester) => {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + kind + '/' + id, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getEntitySuccess(json, requester)
    })
        .catch(function (ex) {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getProjectMembers.preEmit = (id) => {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.PROJECT + id + '/permissions', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getProjectMembersSuccess(json.results)
    })
        .catch(function (ex) {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getUserName.preEmit = (text) => {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'users?' + 'full_name_contains=' + text, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getUserNameSuccess(json.results)
    })
        .catch(function (ex) {
            console.log('Error occurred while filling autocomplete field');
        });
};

ProjectActions.getUserId.preEmit = (fullName, id, role) => {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'users?' + 'full_name_contains=' + fullName, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getUserIdSuccess(json.results, id, role)
    })
        .catch(function (ex) {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.addProjectMember.preEmit = (id, userId, role, name) => {
    let newRole = role.replace('_', ' ');
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.PROJECT + id + '/permissions/' + userId, {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'auth_role': {'id': role}
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast(name + ' ' + 'has been added as a ' + newRole + ' to this project');
        ProjectActions.addProjectMemberSuccess(id)
    })
        .catch(function (ex) {
            MainActions.addToast('Could not add member to this project or member does not exist');
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.deleteProjectMember.preEmit = (id, userId, userName) => {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.PROJECT + id + '/permissions/' + userId, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function (json) {
        MainActions.addToast(userName + ' ' + 'has been removed from this project');
        ProjectActions.deleteProjectMemberSuccess(id, userId);
    })
        .catch(function (ex) {
            MainActions.addToast('Unable to remove ' + userName + ' from this project');
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getDownloadUrl.preEmit = function (id, kind) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + kind + id + '/url', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getDownloadUrlSuccess(json)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.startUpload.preEmit = function (projId, blob, parentId, parentKind, label, fileId, tags) {
    let chunkNum = 0,
        fileName = blob.name,
        contentType = blob.type,
        slicedFile = null,
        BYTES_PER_CHUNK, SIZE, NUM_CHUNKS, start, end;
    BYTES_PER_CHUNK = 5242880 * 10;
    SIZE = blob.size;
    NUM_CHUNKS = Math.max(Math.ceil(SIZE / BYTES_PER_CHUNK), 1);
    start = 0;
    end = BYTES_PER_CHUNK;

    var fileReader = new FileReader();

    let details = {
        name: fileName,
        label: label,
        tags: tags,
        fileId: fileId,
        size: SIZE,
        blob: blob,
        parentId: parentId,
        parentKind: parentKind,
        uploadProgress: 0,
        chunks: []
    };
    // describe chunk details
    while (start <= SIZE) {
        slicedFile = blob.slice(start, end);
        details.chunks.push({
            number: chunkNum,
            start: start,
            end: end,
            chunkUpdates: {
                status: null,
                progress: 0
            },
            retry: 0
        });
        // increment to next chunk
        start = end;
        end = start + BYTES_PER_CHUNK;
        chunkNum++;
    }
    fileReader.onload = function (event, files) {
        // create project upload
        fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.PROJECT + projId + '/' + Path.UPLOAD, {
            method: 'post',
            headers: {
                'Authorization': appConfig.apiToken,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'name': fileName,
                'content_type': contentType,
                'size': SIZE
            })
        }).then(checkResponse).then(function (response) {
            return response.json()
        }).then(function (json) {
            let uploadObj = json;
            if (!uploadObj || !uploadObj.id) throw "Problem, no upload created";
            ProjectActions.startUploadSuccess(uploadObj.id, details);
        }).catch(function (ex) {
            ProjectActions.handleErrors(ex)
        })
    };
    fileReader.onerror = function (e) {
        ProjectActions.handleErrors();
        console.log("error", e);
        console.log(e.target.error.message);
    };
    fileReader.readAsArrayBuffer(slicedFile);
};

ProjectActions.getChunkUrl.preEmit = function (uploadId, chunkBlob, chunkNum, size, parentId, parentKind, fileName, chunkUpdates) {
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
        var arrayBuffer = event.target.result;
        var wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        var md5crc = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
        fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.UPLOAD + uploadId + '/chunks', {
            method: 'put',
            headers: {
                'Authorization': appConfig.apiToken,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "number": chunkNum,
                "size": chunkBlob.size,
                'hash': {
                    'value': md5crc,
                    'algorithm': 'MD5'
                }
            })

        }).then(checkResponse).then(function (response) {
            return response.json()
        }).then(function (json) {
            let chunkObj = json;
            if (chunkObj && chunkObj.url && chunkObj.host) {
                // upload chunks
                uploadChunk(uploadId, chunkObj.host + chunkObj.url, chunkBlob, size, parentId, parentKind, chunkNum, fileName, chunkUpdates)
            } else {
                throw 'Unexpected response';
            }
        }).catch(function (ex) {
            ProjectActions.updateAndProcessChunks(uploadId, chunkNum, {status: StatusEnum.STATUS_RETRY});
        });
    };
    fileReader.readAsArrayBuffer(chunkBlob);
};

function uploadChunk(uploadId, presignedUrl, chunkBlob, size, parentId, parentKind, chunkNum, fileName, chunkUpdates) {
    window.addEventListener('offline', function () {
        ProjectActions.uploadError(uploadId, fileName)
    });
    var xhr = new XMLHttpRequest();
    xhr.upload.onprogress = uploadProgress;
    function uploadProgress(e) {
        if (e.lengthComputable) {
            ProjectActions.updateChunkProgress(uploadId, chunkNum, e.loaded / e.total * (chunkBlob.size));
        }
    }

    xhr.onload = onComplete;
    function onComplete() {
        let status = null;
        if (xhr.status >= 200 && xhr.status < 300) {
            chunkUpdates.status = StatusEnum.STATUS_SUCCESS;
        }
        else {
            chunkUpdates.status = StatusEnum.STATUS_RETRY;
        }
        ProjectActions.updateAndProcessChunks(uploadId, chunkNum, {status: chunkUpdates.status});
    }

    xhr.open('PUT', presignedUrl, true);
    xhr.send(chunkBlob);
}

ProjectActions.allChunksUploaded.preEmit = function (uploadId, parentId, parentKind, fileName, label, fileId, hash) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.UPLOAD + uploadId + '/complete', {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'hash': {
                'value': hash,
                'algorithm': 'md5'
            }
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        if (fileId == null) {
            ProjectActions.addFile(uploadId, parentId, parentKind, fileName, label);
        } else {
            ProjectActions.addFileVersion(uploadId, label, fileId);
        }
    }).catch(function (ex) {
        ProjectActions.uploadError(uploadId, fileName);
    })
};

ProjectActions.addFile.preEmit = function (uploadId, parentId, parentKind, fileName) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + Path.FILE, {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'parent': {
                'kind': parentKind,
                'id': parentId
            },
            'upload': {
                'id': uploadId
            }
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast(fileName + ' uploaded successfully');
        ProjectActions.addFileSuccess(parentId, parentKind, uploadId, json.id)
    }).catch(function (ex) {
        MainActions.addToast('Failed to upload ' + fileName + '!');
        ProjectActions.handleErrors(ex)
    })
};

// File Hashing
ProjectActions.hashFile.preEmit = function (file, id) {
    if(file.blob.size < 5242880 * 10) {
        function calculateMd5(blob, id) {
            let reader = new FileReader();
            reader.readAsArrayBuffer(blob);
            reader.onloadend = function () {
                let wordArray = CryptoJS.lib.WordArray.create(reader.result),
                    hash = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
                ProjectActions.postHash({id: id, hash: hash});
            };
        }
        calculateMd5(file.blob, id);
    } else {
        function series(tasks, done) {
            if (!tasks || tasks.length === 0) {
                done();
            } else {
                tasks[0](function () {
                    series(tasks.slice(1), done);
                });
            }
        }

        function webWorkerOnMessage(e) {
            function arrayBufferToWordArray(ab) {
                let i8a = new Uint8Array(ab);
                let a = [];
                for (let i = 0; i < i8a.length; i += 4) {
                    a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
                }
                return CryptoJS.lib.WordArray.create(a, i8a.length);
            }

            if (e.data.type === "create") {
                md5 = CryptoJS.algo.MD5.create();
                postMessage({type: "create"});
            } else if (e.data.type === "update") {
                md5.update(arrayBufferToWordArray(e.data.chunk));
                postMessage({type: "update"});
            } else if (e.data.type === "finish") {
                postMessage({type: "finish", id: e.data.id, hash: "" + md5.finalize()});
            }
        }

// URL.createObjectURL
        window.URL = window.URL || window.webkitURL;

// "Server response"
        let assetPath = location.protocol + '//' + location.host + '/lib/md5.js';
        let response =
            "importScripts(" + "'" + assetPath + "'" + ");" +
            "var md5, cryptoType;" +
            "self.onmessage = " + webWorkerOnMessage.toString();

        let blob;
        try {
            blob = new Blob([response], {type: 'application/javascript'});
        } catch (e) { // Backwards-compatibility
            window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
            blob = new BlobBuilder();
            blob.append(response);
            blob = blob.getBlob();
        }

        let worker = new Worker(URL.createObjectURL(blob));
        let chunksize = 5242880;
        let f = file.blob; // FileList object
        let i = 0,
            chunks = Math.ceil(f.size / chunksize),
            chunkTasks = [],
            startTime = (new Date()).getTime();
        worker.onmessage = function (e) {
            // create callback
            for (let j = 0; j < chunks; j++) {
                (function (j, f) {
                    chunkTasks.push(function (next) {
                        let blob = f.slice(j * chunksize, Math.min((j + 1) * chunksize, f.size));
                        let reader = new FileReader();

                        reader.onload = function (e) {
                            let chunk = e.target.result;
                            worker.onmessage = function (e) {
                                // update callback
                                next();
                            };
                            worker.postMessage({type: "update", chunk: chunk});
                        };
                        reader.readAsArrayBuffer(blob);
                    });
                })(j, f);
            }
            series(chunkTasks, function () {
                worker.onmessage = function (e) {
                    // finish callback
                    ProjectActions.postHash({id: e.data.id, hash: e.data.hash});
                };
                worker.postMessage({type: "finish", id: id});
            });
        };
        worker.postMessage({type: "create"});
    }
};

function checkResponse(response) {
    return checkStatus(response, MainActions);
}

export default ProjectActions;