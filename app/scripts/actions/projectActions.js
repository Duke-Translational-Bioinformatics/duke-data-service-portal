import Reflux from 'reflux';
import MainActions from '../actions/mainActions';
import MainStore from '../stores/mainStore';
import ProjectStore from '../stores/projectStore';
import { UrlGen, Kind, Path } from '../../util/urlEnum';
import appConfig from '../config';
import { StatusEnum } from '../enum';
import { checkStatus, getFetchParams } from '../../util/fetchUtil';

var ProjectActions = Reflux.createActions([
    'toggleUserInfoPanel',
    'setIncludedSearchProjects',
    'setIncludedSearchKinds',
    'toggleSearchFilters',
    'searchObjects',
    'searchObjectsSuccess',
    'toggleSearch',
    'createMetaPropsList',
    'getObjectMetadata',
    'getObjectMetadataSuccess',
    'createMetadataObject',
    'createMetadataObjectSuccess',
    'updateMetadataObject',
    'showMetadataTemplateList',
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
    'defineTagsToAdd',
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
    'openVersionModal',
    'closeVersionModal',
    'moveItem',
    'moveItemSuccess',
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
    'getProjects',
    'getProjectsSuccess',
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
    'editItem',
    'editItemSuccess',
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
    'processFilesToUpload',
    'startUpload',
    'startUploadSuccess',
    'updateChunkProgress',
    'updateAndProcessChunks',
    'allChunksUploaded',
    'uploadError',
    'cancelUpload',
    'getChunkUrl',
    'getWindowSize',
    'getChildren',
    'getChildrenSuccess',
    'removeFailedUploads',
    'toggleModals',
    'setSelectedEntity',
    'setSelectedEntitySuccess',
    'getMoveItemList',
    'getMoveItemListSuccess'
]);

ProjectActions.searchObjects.preEmit = (value, includeKinds, includeProjects) => {
    if (includeKinds === null || !includeKinds.length) includeKinds = ['dds-file', 'dds-folder'];
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix +'/search',
        getFetchParams('post', appConfig.apiToken, {
            "include_kinds": includeKinds,
            "search_query": {
                "query": {
                    "bool": {
                        "must": {
                            "multi_match" : {
                                "query": value,
                                "type": "phrase_prefix",
                                "fields": [
                                    "label",
                                    "meta",
                                    "name",
                                    "tags.*"
                                ]
                            }
                        },
                        "filter": {
                            "bool" : {
                                "must_not" : {"match" : {"is_deleted": true}},
                                "should" : includeProjects
                            }
                        }
                    }
                },
                size: 1000
            }
        }))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.searchObjectsSuccess(json.results);
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.getMoveItemList.preEmit = (id, path) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + path + id + Path.CHILDREN,
        getFetchParams('get', appConfig.apiToken)
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getMoveItemListSuccess(json.results)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.getObjectMetadata.preEmit = (id, kind) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.META+kind+"/"+id,
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getObjectMetadataSuccess(json.results);
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.createMetadataObject.preEmit = (kind, fileId, templateId, properties) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.META+kind+"/"+fileId+"/"+templateId,
        getFetchParams('post', appConfig.apiToken, {
                "properties": properties
            }
        )
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('A new metadata object was created.');
            ProjectActions.createMetadataObjectSuccess(fileId, kind);
        }).catch((ex) => {
            if(ex.response.status === 409) {
                ProjectActions.updateMetadataObject(kind, fileId, templateId, properties);
            } else {
                MainActions.addToast('Failed to add new metadata object');
                ProjectActions.handleErrors(ex)
            }
        })
};

ProjectActions.updateMetadataObject.preEmit = (kind, fileId, templateId, properties) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.META+kind+"/"+fileId+"/"+templateId,
        getFetchParams('put', appConfig.apiToken, {
            "properties": properties
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('This metadata object was updated.');
            ProjectActions.createMetadataObjectSuccess(fileId, kind);
        }).catch((ex) => {
            MainActions.addToast('Failed to update metadata object');
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.deleteMetadataProperty.preEmit = (id, label) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TEMPLATE_PROPERTIES + id,
        getFetchParams('delete', appConfig.apiToken))
        .then(checkResponse).then((response) => {
        }).then((json) => {
            MainActions.addToast('The '+label+' property has been deleted');
            ProjectActions.deleteMetadataPropertySuccess(id);
        }).catch((ex) => {
            MainActions.addToast('Failed to delete '+label);
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getMetadataTemplateProperties.preEmit = (id) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TEMPLATES +id+Path.PROPERTIES,
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getMetadataTemplatePropertiesSuccess(json.results)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.createMetadataProperty.preEmit = (id, name, label, desc, type) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TEMPLATES +id+Path.PROPERTIES,
        getFetchParams('post', appConfig.apiToken, {
            "key": name,
            "label": label,
            "description": desc,
            "type": type
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('A new template property called '+label+' was added');
            ProjectActions.createMetadataPropertySuccess(json);
        }).catch((ex) => {
            MainActions.addToast('Failed to add new template property');
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.deleteTemplate.preEmit = (id, label) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TEMPLATES + id,
        getFetchParams('delete', appConfig.apiToken))
        .then(checkResponse).then((response) => {
        }).then((json) => {
            MainActions.addToast('The '+label+' template has been deleted');
            ProjectActions.deleteTemplateSuccess();
        }).catch((ex) => {
            MainActions.addToast('Failed to delete '+label);
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.updateMetadataTemplate.preEmit = (id, name, label, desc) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TEMPLATES + id,
        getFetchParams('put', appConfig.apiToken, {
            "name": name,
            "label": label,
            "description": desc
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast(label+' has been updated.');
            ProjectActions.getMetadataTemplateDetailsSuccess(json);
            ProjectActions.loadMetadataTemplates('');
        }).catch((ex) => {
            MainActions.addToast('Failed to update '+label);
            ProjectActions.handleErrors(ex)
        })
};


ProjectActions.createMetadataTemplate.preEmit = (name, label, desc) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TEMPLATES,
        getFetchParams('post', appConfig.apiToken, {
            "name": name,
            "label": label,
            "description": desc
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('A new template called '+label+' was added');
            ProjectActions.getMetadataTemplateDetailsSuccess(json);
            ProjectActions.createMetadataTemplateSuccess(json);
        }).catch((ex) => {
            MainActions.addToast('Failed to add new template');
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.getMetadataTemplateDetails.preEmit = (id) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TEMPLATES + id,
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getMetadataTemplateDetailsSuccess(json)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.loadMetadataTemplates.preEmit = (value) => {
    let searchQuery = value !== null ? '?name_contains='+ value : '';
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TEMPLATES + searchQuery,
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.loadMetadataTemplatesSuccess(json.results)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.addProvRelation.preEmit = (kind, body) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'relations/' + kind,
        getFetchParams('post', appConfig.apiToken, body)
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('New relation Added');
            ProjectActions.addProvRelationSuccess(json);
        }).catch((ex) => {
            MainActions.addToast('Failed to add new relation');
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.deleteProvItem.preEmit = (data, id) => {
    let kind = data.hasOwnProperty('from') ? 'relations/' : 'activities/';
    let msg = kind === 'activities/' ? data.label : data.type;
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + kind + data.id,
        getFetchParams('delete', appConfig.apiToken))
        .then(checkResponse).then((response) => {
        }).then((json) => {
            MainActions.addToast(msg + ' deleted');
            ProjectActions.deleteProvItemSuccess(data);
        }).catch((ex) => {
            MainActions.addToast('Failed to delete ' + msg);
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.addProvActivity.preEmit = (name, desc) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.ACTIVITIES,
        getFetchParams('post', appConfig.apiToken, {
            "name": name,
            "description": desc
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('New Activity Added');
            ProjectActions.addProvActivitySuccess(json);
        }).catch((ex) => {
            MainActions.addToast('Failed to add new actvity');
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.editProvActivity.preEmit = (id, name, desc, prevName) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.ACTIVITIES + id,
        getFetchParams('put', appConfig.apiToken, {
            "name": name,
            "description": desc
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            if (name !== prevName) {
                MainActions.addToast(prevName + ' name was changed to ' + name);
            } else {
                MainActions.addToast(prevName + ' was edited');
            }
            ProjectActions.editProvActivitySuccess(json);
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.getActivities.preEmit = () => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.ACTIVITIES,
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getActivitiesSuccess(json.results)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.getProvenance.preEmit = (id, kind, prevGraph) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'search/provenance?max_hops=1',
        getFetchParams('post', appConfig.apiToken, {
            'start_node': {
                kind: kind,
                id: id
            }
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getProvenanceSuccess(json.graph, prevGraph);
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.getWasGeneratedByNode.preEmit = (id, kind, prevGraph) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'search/provenance/origin',
        getFetchParams('post', appConfig.apiToken, {
            'file_versions': [{
                id: id
            }]
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getProvenanceSuccess(json.graph, prevGraph);
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.searchFiles.preEmit = (text, id) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id + '/children?name_contains=' + text,
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.searchFilesSuccess(json.results);
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.addNewTag.preEmit = (id, kind, tag) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TAGS + kind + '/' + id,
        getFetchParams('post', appConfig.apiToken, {
            'label': tag
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('Added ' + json.label + ' tag');
            ProjectActions.addNewTagSuccess(id);
        }).catch((ex) => {
            MainActions.addToast('Failed to add new tag');
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.appendTags.preEmit = (id, kind, tags) => {
    let msg = tags.map((tag)=> {
        return tag.label
    });
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TAGS + kind + '/' + id + '/append',
        getFetchParams('post', appConfig.apiToken, {
            tags
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('Added ' + msg + ' as tags to all selected files.');
            ProjectActions.appendTagsSuccess(id);
        }).catch((ex) => {
            MainActions.addToast('Failed to add tags');
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.deleteTag.preEmit = (id, label, fileId) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TAGS + id,
        getFetchParams('delete', appConfig.apiToken))
        .then(checkResponse).then((response) => {
        }).then(() => {
            MainActions.addToast(label + ' tag deleted!');
            ProjectActions.deleteTagSuccess(fileId)
        }).catch((ex) => {
            MainActions.addToast('Failed to delete ' + label);
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getTagLabels.preEmit = () => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'tags/labels/?object_kind=dds-file',
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getTagLabelsSuccess(json.results)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};


ProjectActions.getTagAutoCompleteList.preEmit = (text) => {
    let query = text === null ? '' : '&label_contains=' + text;
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'tags/labels/?object_kind=dds-file' + query,
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getTagAutoCompleteListSuccess(json.results)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.getTags.preEmit = (id, kind) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TAGS + kind + '/' + id,
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getTagsSuccess(json.results)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.getFileVersions.preEmit = (id, prov) => { // prov = boolean used for file selection in prov editor
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FILE + id + '/versions',
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getFileVersionsSuccess(json.results, prov)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.addFileVersion.preEmit = (uploadId, label, fileId) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FILE + fileId,
        getFetchParams('put', appConfig.apiToken, {
            'upload': {
                'id': uploadId
            },
            'label': label
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('Created New File Version!');
            ProjectActions.addFileVersionSuccess(fileId, uploadId)
        }).catch((ex) => {
            MainActions.addToast('Failed to Create New Version');
            ProjectActions.uploadError(uploadId, label);
            ProjectActions.handleErrors(ex);
        });
};


ProjectActions.deleteVersion.preEmit = (id) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FILE_VERSION + id,
        getFetchParams('delete', appConfig.apiToken))
        .then(checkResponse).then((response) => {
        }).then(() => {
            MainActions.addToast('Version Deleted!');
            ProjectActions.deleteVersionSuccess()
        }).catch((ex) => {
            MainActions.addToast('Failed to Delete Version!');
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.editVersion.preEmit = (id, label) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FILE_VERSION + id,
        getFetchParams('put', appConfig.apiToken, {
            "label": label
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('Label Updated!');
            ProjectActions.editVersionSuccess(id)
        }).catch((ex) => {
            MainActions.addToast('Failed to Update Label');
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.addAgent.preEmit = (name, desc, repo) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT,
        getFetchParams('post', appConfig.apiToken, {
            "name": name,
            "description": desc,
            "repo_url": repo
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('New software agent added');
            ProjectActions.addAgentSuccess()
        }).catch((ex) => {
            MainActions.addToast('Failed to add new software agent');
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.editAgent.preEmit = (id, name, desc, repo) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT + id,
        getFetchParams('put', appConfig.apiToken, {
            "name": name,
            "description": desc,
            "repo_url": repo
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('Software Agent Updated');
            ProjectActions.editAgentSuccess(id)
        }).catch((ex) => {
            MainActions.addToast('Software Agent Update Failed');
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.deleteAgent.preEmit = (id) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT + id,
        getFetchParams('delete', appConfig.apiToken))
        .then(checkResponse).then((response) => {
        }).then((json) => {
            MainActions.addToast('Software Agent Deleted');
            ProjectActions.deleteAgentSuccess(json)
        }).catch((ex) => {
            MainActions.addToast('Failed to delete software agent');
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.loadAgents.preEmit = () => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT,
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.loadAgentsSuccess(json.results)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.createAgentKey.preEmit = (id) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT + id + '/api_key',
        getFetchParams('put', appConfig.apiToken)
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('API Key created successfully');
            ProjectActions.createAgentKeySuccess(json);
        }).catch((ex) => {
            MainActions.addToast('Failed to create new API key');
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.getAgentKey.preEmit = (id) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT + id + '/api_key',
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getAgentKeySuccess(json)
        })
        .catch((ex) => {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getAgentApiToken.preEmit = (agentKey, userKey) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT + 'api_token',
        getFetchParams('post', appConfig.apiToken, {
            'agent_key': agentKey,
            'user_key': userKey
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getAgentApiTokenSuccess(json)
        }).catch((ex) => {
            MainActions.addToast('Failed to generate an API token');
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.getUser.preEmit = (id) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'current_user',
        getFetchParams('get', appConfig.apiToken))
        .then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getUserSuccess(json, id)
        })
        .catch((ex) => {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getPermissions.preEmit = (id, userId) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id + '/permissions/' + userId,
        getFetchParams('get', appConfig.apiToken))
        .then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getPermissionsSuccess(json)
        })
        .catch((ex) => {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getUserKey.preEmit = () => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.CURRENT_USER + 'api_key',
        getFetchParams('get', appConfig.apiToken))
        .then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getUserKeySuccess(json)
        })
        .catch((ex) => {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.createUserKey.preEmit = (id) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.CURRENT_USER + 'api_key',
        getFetchParams('put', appConfig.apiToken)
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('User Key created successfully');
            ProjectActions.createUserKeySuccess(json);
        }).catch((ex) => {
            MainActions.addToast('Failed to create new User key');
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.deleteUserKey.preEmit = () => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.CURRENT_USER + 'api_key',
        getFetchParams('delete', appConfig.apiToken))
        .then(checkResponse).then((response) => {
        }).then((json) => {
            MainActions.addToast('User key deleted');
            ProjectActions.deleteUserKeySuccess(json)
        }).catch((ex) => {
            MainActions.addToast('Failed to delete user key');
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getUsageDetails.preEmit = () => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.CURRENT_USER + 'usage',
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getUsageDetailsSuccess(json)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.getProjects.preEmit = (page) => {
    if(page == null) page = 1;
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT+"?page="+page+"&per_page=25",
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            const results = response.json();
            const headers = response.headers;
            return Promise.all([results, headers]);
        }).then((json) => {
            let results = json[0].results;
            let headers = json[1].map;
            ProjectActions.getProjectsSuccess(results, headers, page)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.showDetails.preEmit = (id) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id,
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.showDetailsSuccess(json)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.addProject.preEmit = (name, desc) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT,
        getFetchParams('post', appConfig.apiToken, {
            "name": name,
            "description": desc
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('Project Added');
            ProjectActions.addProjectSuccess()
        }).catch((ex) => {
            MainActions.addToast('Failed to add new project');
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.deleteProject.preEmit = (id) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id,
        getFetchParams('delete', appConfig.apiToken))
        .then(checkResponse).then((response) => {
        }).then((json) => {
            MainActions.addToast('Project Deleted');
            ProjectActions.deleteProjectSuccess(json)
        }).catch((ex) => {
            MainActions.addToast('Project Delete Failed');
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.editProject.preEmit = (id, name, desc) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id,
        getFetchParams('put', appConfig.apiToken, {
            "name": name,
            "description": desc
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('Project Updated');
            ProjectActions.editProjectSuccess(id)
        }).catch((ex) => {
            MainActions.addToast('Project Update Failed');
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getChildren.preEmit = (id, path, page) => {
    if(page == null) page = 1;
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + path + id + Path.CHILDREN+"?page="+page+"&per_page=25",
        getFetchParams('get', appConfig.apiToken)
    ).then(checkResponse).then((response) => {
            const results = response.json();
            const headers = response.headers;
            return Promise.all([results, headers]);
        }).then((json) => {
            let results = json[0].results;
            let headers = json[1].map;
            ProjectActions.getChildrenSuccess(results, headers, page)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.addFolder.preEmit = (id, parentKind, name) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FOLDER,
        getFetchParams('post', appConfig.apiToken, {
            "name": name,
            "parent": {
                "kind": parentKind,
                "id": id
            }
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('Folder Added');
            ProjectActions.addFolderSuccess(json);
        }).catch((ex) => {
            MainActions.addToast('Failed to Add a New Folder');
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.deleteFolder.preEmit = (id, parentId, parentKind) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FOLDER + id,
        getFetchParams('delete', appConfig.apiToken))
        .then(checkResponse).then((response) => {
        }).then(() => {
            MainActions.addToast('Folder(s) Deleted!');
            ProjectActions.deleteItemSuccess(parentId, parentKind)
        }).catch((ex) => {
            MainActions.addToast('Folder Deleted Failed!');
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.moveItem.preEmit = (id, kind, destination, destinationKind) => {
    let path = kind === Kind.DDS_FILE ? Path.FILE : Path.FOLDER;
    let type = kind === Kind.DDS_FILE ? 'File' : 'Folder';
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + path + id + '/move',
        getFetchParams('put', appConfig.apiToken, {
            "parent": {
                "kind": destinationKind,
                "id": destination
            }
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast(type+' moved successfully');
            ProjectActions.moveItemSuccess(id);
        }).catch((ex) => {
            MainActions.addToast('Failed to move '+type+' to new location');
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.deleteFile.preEmit = (id, parentId, parentKind) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FILE + id,
        getFetchParams('delete', appConfig.apiToken))
        .then(checkResponse).then((response) => {
        }).then(() => {
            MainActions.addToast('File(s) Deleted!');
            ProjectActions.deleteItemSuccess(parentId, parentKind)
        }).catch((ex) => {
            MainActions.addToast('Failed to Delete File!');
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.editItem.preEmit = (id, name, path, kind) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + path + id + '/rename',
        getFetchParams('put', appConfig.apiToken, {
            "name": name
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast('Item name updated to '+name);
            ProjectActions.editItemSuccess(id, json, kind)
        }).catch((ex) => {
            MainActions.addToast('Failed to update item');
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getEntity.preEmit = (id, kind, requester) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + kind + '/' + id,
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getEntitySuccess(json, requester)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getProjectMembers.preEmit = (id) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id + '/permissions',
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getProjectMembersSuccess(json.results)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getUserName.preEmit = (text) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'users?' + 'full_name_contains=' + text + '&page=1&per_page=500',
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getUserNameSuccess(json.results)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getUserId.preEmit = (fullName, id, role) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'users?' + 'full_name_contains=' + fullName,
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getUserIdSuccess(json.results, id, role)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.addProjectMember.preEmit = (id, userId, role, name) => {
    let newRole = role.replace('_', ' ');
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id + '/permissions/' + userId,
        getFetchParams('put', appConfig.apiToken, {
            'auth_role': {'id': role}
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast(name + ' ' + 'has been added as a ' + newRole + ' to this project');
            ProjectActions.addProjectMemberSuccess(id)
        }).catch((ex) => {
            MainActions.addToast('Could not add member to this project or member does not exist');
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.deleteProjectMember.preEmit = (id, userId, userName) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id + '/permissions/' + userId,
        getFetchParams('delete', appConfig.apiToken))
        .then(checkResponse).then((response) => {
        }).then((json) => {
            MainActions.addToast(userName + ' ' + 'has been removed from this project');
            ProjectActions.deleteProjectMemberSuccess(id, userId);
        }).catch((ex) => {
            MainActions.addToast('Unable to remove ' + userName + ' from this project');
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getDownloadUrl.preEmit = (id, kind) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + kind + id + '/url',
        getFetchParams('get', appConfig.apiToken))
        .then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            ProjectActions.getDownloadUrlSuccess(json)
        }).catch((ex) => {
            ProjectActions.handleErrors(ex)
        })
};

ProjectActions.startUpload.preEmit = (projId, blob, parentId, parentKind, label, fileId, tags) => {
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
        projectId: projId,
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
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + projId + '/' + Path.UPLOAD,
            getFetchParams('post', appConfig.apiToken, {
                'name': fileName,
                'content_type': contentType,
                'size': SIZE
            })
        ).then(checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                let uploadObj = json;
                if (!uploadObj || !uploadObj.id) throw "Problem, no upload created";
                ProjectActions.startUploadSuccess(uploadObj.id, details);
            }).catch((ex) => {
                ProjectActions.handleErrors(ex)
            })
    };
    fileReader.onerror = function (e) {
        ProjectActions.handleErrors(e.target.error);
        console.log("error", e);
        console.log(e.target.error.message);
    };
    fileReader.readAsArrayBuffer(slicedFile);
};

ProjectActions.getChunkUrl.preEmit = (uploadId, chunkBlob, chunkNum, size, parentId, parentKind, fileName, chunkUpdates) => {
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
        var arrayBuffer = event.target.result;
        var wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        var md5crc = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.UPLOAD + uploadId + '/chunks',
            getFetchParams('put', appConfig.apiToken, {
                "number": chunkNum,
                "size": chunkBlob.size,
                'hash': {
                    'value': md5crc,
                    'algorithm': 'MD5'
                }
            })
        ).then(checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                let chunkObj = json;
                if (chunkObj && chunkObj.url && chunkObj.host) {
                    // upload chunks
                    uploadChunk(uploadId, chunkObj.host + chunkObj.url, chunkBlob, size, parentId, parentKind, chunkNum, fileName, chunkUpdates)
                } else {
                    throw 'Unexpected response';
                }
            }).catch((ex) => {
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

ProjectActions.allChunksUploaded.preEmit = (uploadId, parentId, parentKind, fileName, label, fileId, hash, projectId) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.UPLOAD + uploadId + '/complete',
        getFetchParams('put', appConfig.apiToken, {
            'hash': {
                'value': hash,
                'algorithm': 'md5'
            }
        })
    ).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            if (fileId == null) {
                ProjectActions.addFile(uploadId, parentId, parentKind, fileName, label);
            } else {
                ProjectActions.addFileVersion(uploadId, label, fileId);
            }
        }).catch((ex) => {
            ProjectActions.uploadError(uploadId, fileName, projectId);
        })
};

ProjectActions.addFile.preEmit = (uploadId, parentId, parentKind, fileName) => {
    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FILE,
        getFetchParams('post', appConfig.apiToken, {
            'parent': {
                'kind': parentKind,
                'id': parentId
            },
            'upload': {
                'id': uploadId
            }
        })).then(checkResponse).then((response) => {
            return response.json()
        }).then((json) => {
            MainActions.addToast(fileName + ' uploaded successfully');
            ProjectActions.addFileSuccess(parentId, parentKind, uploadId, json.id)
        }).catch((ex) => {
            MainActions.addToast('Failed to upload ' + fileName + '!');
            ProjectActions.handleErrors(ex)
        })
};

// File Hashing
ProjectActions.hashFile.preEmit = (file, id) => {
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

ProjectActions.setSelectedEntity.preEmit = (id, kind) => {
    if(id === null) {
        ProjectActions.setSelectedEntitySuccess(null);
    } else {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + kind + '/' + id,
            getFetchParams('get', appConfig.apiToken))
            .then(checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                ProjectActions.setSelectedEntitySuccess(json)
            }).catch((ex) => {
                ProjectActions.handleErrors(ex)
            });
    }
};

function checkResponse(response) {
    return checkStatus(response, MainActions);
}

export default ProjectActions;