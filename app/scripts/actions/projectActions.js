import Reflux from 'reflux';
import MainActions from '../actions/mainActions';
import mainStore from '../stores/mainStore';
import authStore from '../stores/authStore';
import projectStore from '../stores/projectStore';
import { UrlGen, Kind, Path } from '../../util/urlEnum';
import appConfig from '../config';
import { StatusEnum } from '../enum';
import { checkStatus, getFetchParams } from '../../util/fetchUtil';

const ProjectActions = {

    //searchObjects(value, includeKinds, includeProjects) {
    //    if (includeKinds === null || !includeKinds.length) includeKinds = ['dds-file', 'dds-folder'];
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + '/search',
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //            "include_kinds": includeKinds,
    //            "search_query": {
    //                "query": {
    //                    "bool": {
    //                        "must": {
    //                            "multi_match": {
    //                                "query": value,
    //                                "type": "phrase_prefix",
    //                                "fields": [
    //                                    "label",
    //                                    "meta",
    //                                    "name",
    //                                    "tags.*"
    //                                ]
    //                            }
    //                        },
    //                        "filter": {
    //                            "bool": {
    //                                "must_not": {"match": {"is_deleted": true}},
    //                                "should": includeProjects
    //                            }
    //                        }
    //                    }
    //                },
    //                size: 1000
    //            }
    //        }))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.searchObjectsSuccess(json.results);
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //getMoveItemList(id, path) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + path + id + Path.CHILDREN,
    //        getFetchParams('get', authStore.appConfig.apiToken)
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getMoveItemListSuccess(json.results)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //getObjectMetadata(id, kind) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.META + kind + "/" + id,
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getObjectMetadataSuccess(json.results);
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //createMetadataObject(kind, fileId, templateId, properties) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.META + kind + "/" + fileId + "/" + templateId,
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //                "properties": properties
    //            }
    //        )
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('A new metadata object was created.');
    //            projectStore.createMetadataObjectSuccess(fileId, kind);
    //        }).catch((ex) => {
    //            if (ex.response.status === 409) {
    //                projectStore.updateMetadataObject(kind, fileId, templateId, properties);
    //            } else {
    //                mainStore.addToast('Failed to add new metadata object');
    //                projectStore.handleErrors(ex)
    //            }
    //        })
    //},

    //updateMetadataObject(kind, fileId, templateId, properties) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.META + kind + "/" + fileId + "/" + templateId,
    //        getFetchParams('put', authStore.appConfig.apiToken, {
    //            "properties": properties
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('This metadata object was updated.');
    //            projectStore.createMetadataObjectSuccess(fileId, kind);
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to update metadata object');
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //deleteMetadataProperty(id, label) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TEMPLATE_PROPERTIES + id,
    //        getFetchParams('delete', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //        }).then((json) => {
    //            mainStore.addToast('The ' + label + ' property has been deleted');
    //            projectStore.deleteMetadataPropertySuccess(id);
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to delete ' + label);
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //getMetadataTemplateProperties(id) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TEMPLATES + id + Path.PROPERTIES,
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getMetadataTemplatePropertiesSuccess(json.results)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //createMetadataProperty(id, name, label, desc, type) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TEMPLATES + id + Path.PROPERTIES,
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //            "key": name,
    //            "label": label,
    //            "description": desc,
    //            "type": type
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('A new template property called ' + label + ' was added');
    //            projectStore.createMetadataPropertySuccess(json);
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to add new template property');
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //deleteTemplate(id, label) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TEMPLATES + id,
    //        getFetchParams('delete', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //        }).then((json) => {
    //            mainStore.addToast('The ' + label + ' template has been deleted');
    //            projectStore.deleteTemplateSuccess();
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to delete ' + label);
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //updateMetadataTemplate(id, name, label, desc) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TEMPLATES + id,
    //        getFetchParams('put', authStore.appConfig.apiToken, {
    //            "name": name,
    //            "label": label,
    //            "description": desc
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast(label + ' has been updated.');
    //            projectStore.getMetadataTemplateDetailsSuccess(json);
    //            projectStore.loadMetadataTemplates('');
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to update ' + label);
    //            projectStore.handleErrors(ex)
    //        })
    //},


    //createMetadataTemplate(name, label, desc) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TEMPLATES,
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //            "name": name,
    //            "label": label,
    //            "description": desc
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('A new template called ' + label + ' was added');
    //            projectStore.getMetadataTemplateDetailsSuccess(json);
    //            projectStore.createMetadataTemplateSuccess(json);
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to add new template');
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //getMetadataTemplateDetails(id) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TEMPLATES + id,
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getMetadataTemplateDetailsSuccess(json)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},
    //
    //loadMetadataTemplates(value) {
    //    let searchQuery = value !== null ? '?name_contains=' + value : '';
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TEMPLATES + searchQuery,
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.loadMetadataTemplatesSuccess(json.results)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //addProvRelation(kind, body) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'relations/' + kind,
    //        getFetchParams('post', authStore.appConfig.apiToken, body)
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('New relation Added');
    //            projectStore.addProvRelationSuccess(json);
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to add new relation');
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //deleteProvItem(data, id) {
    //    let kind = data.hasOwnProperty('from') ? 'relations/' : 'activities/';
    //    let msg = kind === 'activities/' ? data.label : data.type;
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + kind + data.id,
    //        getFetchParams('delete', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //        }).then((json) => {
    //            mainStore.addToast(msg + ' deleted');
    //            projectStore.deleteProvItemSuccess(data);
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to delete ' + msg);
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //addProvActivity(name, desc) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.ACTIVITIES,
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //            "name": name,
    //            "description": desc
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('New Activity Added');
    //            projectStore.addProvActivitySuccess(json);
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to add new actvity');
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //editProvActivity(id, name, desc, prevName) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.ACTIVITIES + id,
    //        getFetchParams('put', authStore.appConfig.apiToken, {
    //            "name": name,
    //            "description": desc
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            if (name !== prevName) {
    //                mainStore.addToast(prevName + ' name was changed to ' + name);
    //            } else {
    //                mainStore.addToast(prevName + ' was edited');
    //            }
    //            projectStore.editProvActivitySuccess(json);
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //getActivities() {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.ACTIVITIES,
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getActivitiesSuccess(json.results)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //getProvenance(id, kind, prevGraph) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'search/provenance?max_hops=1',
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //            'start_node': {
    //                kind: kind,
    //                id: id
    //            }
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getProvenanceSuccess(json.graph, prevGraph);
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //getFromAndToNodes(id, kind, prevGraph) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'search/provenance/origin',
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //            'file_versions': [{
    //                id: id
    //            }]
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getProvenanceSuccess(json.graph, prevGraph);
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //searchFiles(text, id) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id + '/children?name_contains=' + text,
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.searchFilesSuccess(json.results);
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //addNewTag(id, kind, tag) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TAGS + kind + '/' + id,
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //            'label': tag
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('Added ' + json.label + ' tag');
    //            projectStore.addNewTagSuccess(id);
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to add new tag');
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //appendTags(id, kind, tags) {
    //    let msg = tags.map((tag)=> {
    //        return tag.label
    //    });
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TAGS + kind + '/' + id + '/append',
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //            tags
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('Added ' + msg + ' as tags to all selected files.');
    //            projectStore.appendTagsSuccess(id);
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to add tags');
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //deleteTag(id, label, fileId) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TAGS + id,
    //        getFetchParams('delete', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //        }).then(() => {
    //            mainStore.addToast(label + ' tag deleted!');
    //            projectStore.deleteTagSuccess(fileId)
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to delete ' + label);
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //getTagLabels() {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'tags/labels/?object_kind=dds-file',
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            //projectStore.getTagLabelsSuccess(json.results)
    //        }).catch((ex) => {
    //            //projectStore.handleErrors(ex)
    //        })
    //},


    //getTagAutoCompleteList(text) {
    //    let query = text === null ? '' : '&label_contains=' + text;
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'tags/labels/?object_kind=dds-file' + query,
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getTagAutoCompleteListSuccess(json.results)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //getTags(id, kind) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TAGS + kind + '/' + id,
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getTagsSuccess(json.results)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //getFileVersions(id, prov) { // prov = boolean used for file selection in prov editor
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FILE + id + '/versions',
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getFileVersionsSuccess(json.results, prov)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //addFileVersion(uploadId, label, fileId) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FILE + fileId,
    //        getFetchParams('put', authStore.appConfig.apiToken, {
    //            'upload': {
    //                'id': uploadId
    //            },
    //            'label': label
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('Created New File Version!');
    //            projectStore.addFileVersionSuccess(fileId, uploadId)
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to Create New Version');
    //            projectStore.uploadError(uploadId, label);
    //            projectStore.handleErrors(ex);
    //        });
    //},

    //deleteVersion(id) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FILE_VERSION + id,
    //        getFetchParams('delete', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //        }).then(() => {
    //            mainStore.addToast('Version Deleted!');
    //            projectStore.deleteVersionSuccess()
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to Delete Version!');
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //editVersion(id, label) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FILE_VERSION + id,
    //        getFetchParams('put', authStore.appConfig.apiToken, {
    //            "label": label
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('Label Updated!');
    //            projectStore.editVersionSuccess(id)
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to Update Label');
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //addAgent(name, desc, repo) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT,
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //            "name": name,
    //            "description": desc,
    //            "repo_url": repo
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('New software agent added');
    //            projectStore.addAgentSuccess()
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to add new software agent');
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //editAgent(id, name, desc, repo) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT + id,
    //        getFetchParams('put', authStore.appConfig.apiToken, {
    //            "name": name,
    //            "description": desc,
    //            "repo_url": repo
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('Software Agent Updated');
    //            projectStore.editAgentSuccess(id)
    //        }).catch((ex) => {
    //            mainStore.addToast('Software Agent Update Failed');
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //deleteAgent(id) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT + id,
    //        getFetchParams('delete', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //        }).then((json) => {
    //            mainStore.addToast('Software Agent Deleted');
    //            projectStore.deleteAgentSuccess(json)
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to delete software agent');
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //loadAgents() {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT,
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.loadAgentsSuccess(json.results)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //createAgentKey(id) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT + id + '/api_key',
    //        getFetchParams('put', authStore.appConfig.apiToken)
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('API Key created successfully');
    //            projectStore.createAgentKeySuccess(json);
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to create new API key');
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //getAgentKey(id) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT + id + '/api_key',
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getAgentKeySuccess(json)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //getAgentApiToken(agentKey, userKey) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.AGENT + 'api_token',
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //            'agent_key': agentKey,
    //            'user_key': userKey
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getAgentApiTokenSuccess(json)
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to generate an API token');
    //            projectStore.handleErrors(ex)
    //        })
    //},
    //
    //getUser(id) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'current_user',
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getUserSuccess(json, id)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        });
    //},
    //
    //getPermissions(id, userId) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id + '/permissions/' + userId,
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getPermissionsSuccess(json)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //getUserKey() {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.CURRENT_USER + 'api_key',
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getUserKeySuccess(json)
    //        })
    //        .catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //createUserKey(id) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.CURRENT_USER + 'api_key',
    //        getFetchParams('put', authStore.appConfig.apiToken)
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('User Key created successfully');
    //            projectStore.createUserKeySuccess(json);
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to create new User key');
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //deleteUserKey() {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.CURRENT_USER + 'api_key',
    //        getFetchParams('delete', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //        }).then((json) => {
    //            mainStore.addToast('User key deleted');
    //            projectStore.deleteUserKeySuccess(json)
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to delete user key');
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //getUsageDetails() {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.CURRENT_USER + 'usage',
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getUsageDetailsSuccess(json)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //getProjects(page) {
    //    projectStore.setLoadingState();
    //    if (page == null) page = 1;
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + "?page=" + page + "&per_page=25",
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            const results = response.json();
    //            const headers = response.headers;
    //            return Promise.all([results, headers]);
    //        }).then((json) => {
    //            let results = json[0].results;
    //            let headers = json[1].map;
    //            projectStore.getProjectsSuccess(results, headers, page)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //showDetails(id) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id,
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.showDetailsSuccess(json)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},
    //
    //addProject(name, desc) {
    //    projectStore.setLoadingState();
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT,
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //            "name": name,
    //            "description": desc
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('Project Added');
    //            projectStore.addProjectSuccess(json)
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to add new project');
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //deleteProject(id) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id,
    //        getFetchParams('delete', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //        }).then((json) => {
    //            mainStore.addToast('Project Deleted');
    //            projectStore.deleteProjectSuccess(json)
    //        }).catch((ex) => {
    //            mainStore.addToast('Project Delete Failed');
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //editProject(id, name, desc) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id,
    //        getFetchParams('put', authStore.appConfig.apiToken, {
    //            "name": name,
    //            "description": desc
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('Project Updated');
    //            projectStore.editProjectSuccess(id)
    //        }).catch((ex) => {
    //            mainStore.addToast('Project Update Failed');
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //getChildren(id, path, page) {
    //    if (page == null) page = 1;
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + path + id + Path.CHILDREN + "?page=" + page + "&per_page=25",
    //        getFetchParams('get', authStore.appConfig.apiToken)
    //    ).then(checkStatus).then((response) => {
    //            const results = response.json();
    //            const headers = response.headers;
    //            return Promise.all([results, headers]);
    //        }).then((json) => {
    //            let results = json[0].results;
    //            let headers = json[1].map;
    //            projectStore.getChildrenSuccess(results, headers, page)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //addFolder(id, parentKind, name) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FOLDER,
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //            "name": name,
    //            "parent": {
    //                "kind": parentKind,
    //                "id": id
    //            }
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('Folder Added');
    //            projectStore.addFolderSuccess(json);
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to Add a New Folder');
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //deleteFolder(id, parentId, parentKind) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FOLDER + id,
    //        getFetchParams('delete', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //        }).then(() => {
    //            mainStore.addToast('Folder(s) Deleted!');
    //            projectStore.deleteItemSuccess(parentId, parentKind)
    //        }).catch((ex) => {
    //            mainStore.addToast('Folder Deleted Failed!');
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //moveItem(id, kind, destination, destinationKind) {
    //    let path = kind === Kind.DDS_FILE ? Path.FILE : Path.FOLDER;
    //    let type = kind === Kind.DDS_FILE ? 'File' : 'Folder';
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + path + id + '/move',
    //        getFetchParams('put', authStore.appConfig.apiToken, {
    //            "parent": {
    //                "kind": destinationKind,
    //                "id": destination
    //            }
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast(type + ' moved successfully');
    //            projectStore.moveItemSuccess(id);
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to move ' + type + ' to new location');
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //deleteFile(id, parentId, parentKind) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FILE + id,
    //        getFetchParams('delete', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //        }).then(() => {
    //            mainStore.addToast('File(s) Deleted!');
    //            projectStore.deleteItemSuccess(parentId, parentKind)
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to Delete File!');
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //editItem(id, name, path, kind) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + path + id + '/rename',
    //        getFetchParams('put', authStore.appConfig.apiToken, {
    //            "name": name
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast('Item name updated to ' + name);
    //            projectStore.editItemSuccess(id, json, kind)
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to update item');
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //getEntity(id, kind, requester) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + kind + '/' + id,
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getEntitySuccess(json, requester)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //getProjectMembers(id) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id + '/permissions',
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getProjectMembersSuccess(json.results)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //getUserName(text) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'users?' + 'full_name_contains=' + text + '&page=1&per_page=500',
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getUserNameSuccess(json.results)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //getUserId(fullName, id, role) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'users?' + 'full_name_contains=' + fullName,
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getUserIdSuccess(json.results, id, role)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //addProjectMember(id, userId, role, name) {
    //    let newRole = role.replace('_', ' ');
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id + '/permissions/' + userId,
    //        getFetchParams('put', authStore.appConfig.apiToken, {
    //            'auth_role': {'id': role}
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast(name + ' ' + 'has been added as a ' + newRole + ' to this project');
    //            projectStore.addProjectMemberSuccess(id)
    //        }).catch((ex) => {
    //            mainStore.addToast('Could not add member to this project or member does not exist');
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //deleteProjectMember(id, userId, userName) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id + '/permissions/' + userId,
    //        getFetchParams('delete', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //        }).then((json) => {
    //            mainStore.addToast(userName + ' ' + 'has been removed from this project');
    //            projectStore.deleteProjectMemberSuccess(id, userId);
    //        }).catch((ex) => {
    //            mainStore.addToast('Unable to remove ' + userName + ' from this project');
    //            projectStore.handleErrors(ex)
    //        });
    //},

    //getDownloadUrl(id, kind) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + kind + id + '/url',
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            projectStore.getDownloadUrlSuccess(json)
    //        }).catch((ex) => {
    //            projectStore.handleErrors(ex)
    //        })
    //},

    //startUpload(projId, blob, parentId, parentKind, label, fileId, tags) {
    //    let chunkNum = 0,
    //        fileName = blob.name,
    //        contentType = blob.type,
    //        slicedFile = null,
    //        BYTES_PER_CHUNK, SIZE, NUM_CHUNKS, start, end;
    //    BYTES_PER_CHUNK = 5242880 * 10;
    //    SIZE = blob.size;
    //    NUM_CHUNKS = Math.max(Math.ceil(SIZE / BYTES_PER_CHUNK), 1);
    //    start = 0;
    //    end = BYTES_PER_CHUNK;
    //
    //    var fileReader = new FileReader();
    //
    //    let details = {
    //        name: fileName,
    //        label: label,
    //        tags: tags,
    //        fileId: fileId,
    //        size: SIZE,
    //        blob: blob,
    //        parentId: parentId,
    //        parentKind: parentKind,
    //        projectId: projId,
    //        uploadProgress: 0,
    //        chunks: []
    //    };
    //    // describe chunk details
    //    while (start <= SIZE) {
    //        slicedFile = blob.slice(start, end);
    //        details.chunks.push({
    //            number: chunkNum,
    //            start: start,
    //            end: end,
    //            chunkUpdates: {
    //                status: null,
    //                progress: 0
    //            },
    //            retry: 0
    //        });
    //        // increment to next chunk
    //        start = end;
    //        end = start + BYTES_PER_CHUNK;
    //        chunkNum++;
    //    }
    //    fileReader.onload = function (event, files) {
    //        // create project upload
    //        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + projId + '/' + Path.UPLOAD,
    //            getFetchParams('post', authStore.appConfig.apiToken, {
    //                'name': fileName,
    //                'content_type': contentType,
    //                'size': SIZE
    //            })
    //        ).then(checkStatus).then((response) => {
    //                return response.json()
    //            }).then((json) => {
    //                let uploadObj = json;
    //                if (!uploadObj || !uploadObj.id) throw "Problem, no upload created";
    //                projectStore.startUploadSuccess(uploadObj.id, details);
    //            }).catch((ex) => {
    //                projectStore.handleErrors(ex)
    //            })
    //    };
    //    fileReader.onerror = function (e) {
    //        projectStore.handleErrors(e.target.error);
    //        console.log("error", e);
    //        console.log(e.target.error.message);
    //    };
    //    fileReader.readAsArrayBuffer(slicedFile);
    //},

    //uploadChunk(uploadId, presignedUrl, chunkBlob, size, parentId, parentKind, chunkNum, fileName, chunkUpdates) {
    //    window.addEventListener('offline', function () {
    //        projectStore.uploadError(uploadId, fileName)
    //    });
    //    var xhr = new XMLHttpRequest();
    //    xhr.upload.onprogress = uploadProgress;
    //    function uploadProgress(e) {
    //        if (e.lengthComputable) {
    //            projectStore.updateChunkProgress(uploadId, chunkNum, e.loaded / e.total * (chunkBlob.size));
    //        }
    //    }
    //
    //    xhr.onload = onComplete;
    //    function onComplete() {
    //        let status = null;
    //        if (xhr.status >= 200 && xhr.status < 300) {
    //            chunkUpdates.status = StatusEnum.STATUS_SUCCESS;
    //        }
    //        else {
    //            chunkUpdates.status = StatusEnum.STATUS_RETRY;
    //        }
    //        projectStore.updateAndProcessChunks(uploadId, chunkNum, {status: chunkUpdates.status});
    //    }
    //
    //    xhr.open('PUT', presignedUrl, true);
    //    xhr.send(chunkBlob);
    //},
    //
    //getChunkUrl(uploadId, chunkBlob, chunkNum, size, parentId, parentKind, fileName, chunkUpdates) {
    //    var fileReader = new FileReader();
    //    fileReader.onload = function (event) {
    //        var arrayBuffer = event.target.result;
    //        var wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    //        var md5crc = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
    //        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.UPLOAD + uploadId + '/chunks',
    //            getFetchParams('put', authStore.appConfig.apiToken, {
    //                "number": chunkNum,
    //                "size": chunkBlob.size,
    //                'hash': {
    //                    'value': md5crc,
    //                    'algorithm': 'MD5'
    //                }
    //            })
    //        ).then(checkStatus).then((response) => {
    //                return response.json()
    //            }).then((json) => {
    //                let chunkObj = json;
    //                if (chunkObj && chunkObj.url && chunkObj.host) {
    //                    // upload chunks
    //                    this.uploadChunk(uploadId, chunkObj.host + chunkObj.url, chunkBlob, size, parentId, parentKind, chunkNum, fileName, chunkUpdates)
    //                } else {
    //                    throw 'Unexpected response';
    //                }
    //            }).catch((ex) => {
    //                projectStore.updateAndProcessChunks(uploadId, chunkNum, {status: StatusEnum.STATUS_RETRY});
    //            });
    //    };
    //    fileReader.readAsArrayBuffer(chunkBlob);
    //},
    //
    //allChunksUploaded(uploadId, parentId, parentKind, fileName, label, fileId, hash, projectId) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.UPLOAD + uploadId + '/complete',
    //        getFetchParams('put', authStore.appConfig.apiToken, {
    //            'hash': {
    //                'value': hash,
    //                'algorithm': 'md5'
    //            }
    //        })
    //    ).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            if (fileId == null) {
    //                projectStore.addFile(uploadId, parentId, parentKind, fileName, label);
    //            } else {
    //                projectStore.addFileVersion(uploadId, label, fileId);
    //            }
    //        }).catch((ex) => {
    //            projectStore.uploadError(uploadId, fileName, projectId);
    //        })
    //},

    //addFile(uploadId, parentId, parentKind, fileName) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FILE,
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //            'parent': {
    //                'kind': parentKind,
    //                'id': parentId
    //            },
    //            'upload': {
    //                'id': uploadId
    //            }
    //        })).then(checkStatus).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            mainStore.addToast(fileName + ' uploaded successfully');
    //            projectStore.addFileSuccess(parentId, parentKind, uploadId, json.id)
    //        }).catch((ex) => {
    //            mainStore.addToast('Failed to upload ' + fileName + '!');
    //            projectStore.handleErrors(ex)
    //        })
    //},

////File Hashing
//    hashFile(file, id) {
//        if (file.blob.size < 5242880 * 10) {
//            function calculateMd5(blob, id) {
//                let reader = new FileReader();
//                reader.readAsArrayBuffer(blob);
//                reader.onloadend = function () {
//                    let wordArray = CryptoJS.lib.WordArray.create(reader.result),
//                        hash = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
//                    projectStore.postHash({id: id, hash: hash});
//                };
//            }
//
//            calculateMd5(file.blob, id);
//        } else {
//            function series(tasks, done) {
//                if (!tasks || tasks.length === 0) {
//                    done();
//                } else {
//                    tasks[0](function () {
//                        series(tasks.slice(1), done);
//                    });
//                }
//            }
//
//            function webWorkerOnMessage(e) {
//                function arrayBufferToWordArray(ab) {
//                    let i8a = new Uint8Array(ab);
//                    let a = [];
//                    for (let i = 0; i < i8a.length; i += 4) {
//                        a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
//                    }
//                    return CryptoJS.lib.WordArray.create(a, i8a.length);
//                }
//
//                if (e.data.type === "create") {
//                    md5 = CryptoJS.algo.MD5.create();
//                    postMessage({type: "create"});
//                } else if (e.data.type === "update") {
//                    md5.update(arrayBufferToWordArray(e.data.chunk));
//                    postMessage({type: "update"});
//                } else if (e.data.type === "finish") {
//                    postMessage({type: "finish", id: e.data.id, hash: "" + md5.finalize()});
//                }
//            }
//
//// URL.createObjectURL
//            window.URL = window.URL || window.webkitURL;
//
//// "Server response"
//            let assetPath = location.protocol + '//' + location.host + '/lib/md5.js';
//            let response =
//                "importScripts(" + "'" + assetPath + "'" + ");" +
//                "var md5, cryptoType;" +
//                "self.onmessage = " + webWorkerOnMessage.toString();
//
//            let blob;
//            try {
//                blob = new Blob([response], {type: 'application/javascript'});
//            } catch (e) { // Backwards-compatibility
//                window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
//                blob = new BlobBuilder();
//                blob.append(response);
//                blob = blob.getBlob();
//            }
//
//            let worker = new Worker(URL.createObjectURL(blob));
//            let chunksize = 5242880;
//            let f = file.blob; // FileList object
//            let i = 0,
//                chunks = Math.ceil(f.size / chunksize),
//                chunkTasks = [],
//                startTime = (new Date()).getTime();
//            worker.onmessage = function (e) {
//                // create callback
//                for (let j = 0; j < chunks; j++) {
//                    (function (j, f) {
//                        chunkTasks.push(function (next) {
//                            let blob = f.slice(j * chunksize, Math.min((j + 1) * chunksize, f.size));
//                            let reader = new FileReader();
//
//                            reader.onload = function (e) {
//                                let chunk = e.target.result;
//                                worker.onmessage = function (e) {
//                                    // update callback
//                                    next();
//                                };
//                                worker.postMessage({type: "update", chunk: chunk});
//                            };
//                            reader.readAsArrayBuffer(blob);
//                        });
//                    })(j, f);
//                }
//                series(chunkTasks, function () {
//                    worker.onmessage = function (e) {
//                        // finish callback
//                        projectStore.postHash({id: e.data.id, hash: e.data.hash});
//                    };
//                    worker.postMessage({type: "finish", id: id});
//                });
//            };
//            worker.postMessage({type: "create"});
//        }
//    },

    //setSelectedEntity(id, kind) {
    //    if (id === null) {
    //        projectStore.setSelectedEntitySuccess(null);
    //    } else {
    //        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + kind + '/' + id,
    //            getFetchParams('get', authStore.appConfig.apiToken))
    //            .then(checkStatus).then((response) => {
    //                return response.json()
    //            }).then((json) => {
    //                projectStore.setSelectedEntitySuccess(json)
    //            }).catch((ex) => {
    //                projectStore.handleErrors(ex)
    //            });
    //    }
    //},
};

export default ProjectActions;