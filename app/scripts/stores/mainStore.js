import React from 'react';
import { observable, computed, action, map } from 'mobx';
import cookie from 'react-cookie';
import authStore from '../stores/authStore';
import provenanceStore from '../stores/provenanceStore';
import BaseUtils from '../../util/baseUtils.js';
import { StatusEnum } from '../enum';
import { UrlGen, Kind, Path } from '../../util/urlEnum';
import {graphOptions, graphColors} from '../graphConfig';
import { checkStatus, getFetchParams } from '../../util/fetchUtil';

export class MainStore {

    @observable agents
    @observable agentKey
    @observable agentApiToken
    @observable autoCompleteLoading
    @observable audit
    @observable currentUser
    @observable destination
    @observable destinationKind
    @observable device
    @observable entityObj
    @observable error
    @observable errorModals
    @observable failedUploads
    @observable filesChecked
    @observable filesToUpload
    @observable filesRejectedForUpload
    @observable fileHashes
    @observable foldersChecked
    @observable fileVersions
    @observable includeKinds
    @observable includeProjects
    @observable itemsSelected
    @observable listItems
    @observable loading
    @observable metaDataTemplate
    @observable metaProps
    @observable metaTemplates
    @observable modal
    @observable modalOpen
    @observable moveItemList
    @observable moveItemLoading
    @observable moveToObj
    @observable objectTags
    @observable openMetadataManager
    @observable openTagManager
    @observable openUploadManager
    @observable parent
    @observable projects
    @observable project
    @observable projPermissions
    @observable projectMembers
    @observable metaObjProps
    @observable provEditorModal
    @observable responseHeaders
    @observable screenSize
    @observable searchFilesList
    @observable searchFilters
    @observable searchResults
    @observable searchResultsFiles
    @observable searchResultsFolders
    @observable searchResultsProjects
    @observable searchValue
    @observable selectedEntity
    @observable showFilters
    @observable showPropertyCreator
    @observable showTemplateCreator
    @observable showTemplateDetails
    @observable showUserInfoPanel
    @observable showSearch
    @observable tagLabels
    @observable tagsToAdd
    @observable templateProperties
    @observable toasts
    @observable toggleModal
    @observable uploadCount
    @observable uploads
    @observable usage
    @observable users
    @observable userKey
    @observable versionModal

    constructor() {

        this.agents = [];
        this.agentKey = {};
        this.agentApiToken = {};
        this.autoCompleteLoading = false;
        this.audit = {};
        this.currentUser = {};
        this.device = {};
        this.destination = null;
        this.destinationKind = null;
        this.entityObj = null;
        this.error = null;
        this.errorModals = [];
        this.failedUploads = [];
        this.filesChecked = [];
        this.filesToUpload = [];
        this.filesRejectedForUpload = [];
        this.fileHashes = [];
        this.foldersChecked = [];
        this.fileVersions = [];
        this.includeKinds = [];
        this.includeProjects = [];
        this.itemsSelected = null;
        this.listItems = [];
        this.loading = false;
        this.metaDataTemplate = null;
        this.metaProps = [];
        this.metaTemplates = [];
        this.modal = false;
        this.modalOpen = cookie.load('modalOpen');
        this.moveItemList = [];
        this.moveItemLoading = false;
        this.moveToObj = {};
        this.objectTags = [];
        this.openMetadataManager = false;
        this.openTagManager = false;
        this.openUploadManager = false;
        this.parent = {};
        this.projects = [];
        this.project = {};
        this.projPermissions = null;
        this.projectMembers = [];
        this.metaObjProps = [];
        this.responseHeaders = {};
        this.screenSize = {};
        this.searchFilesList = [];
        this.searchFilters = [];
        this.searchResults = [];
        this.searchResultsFiles = [];
        this.searchResultsFolders = [];
        this.searchResultsProjects = [];
        this.searchValue = null;
        this.selectedEntity = null;
        this.showFilters = false;
        this.showPropertyCreator = false;
        this.showTemplateCreator = false;
        this.showTemplateDetails = false;
        this.showUserInfoPanel = false;
        this.showSearch = false;
        this.tagLabels = [];
        this.tagsToAdd = [];
        this.templateProperties = [];
        this.toasts = [];
        this.toggleModal = {open: false, id: null};
        this.uploadCount = [];
        this.uploads = observable.map();
        this.usage = null;
        this.users = [];
        this.userKey = {};
        this.versionModal = false;
    }

    checkResponse(response) {
        return checkStatus(response, authStore);
    }

    clearSelectedItems() {
        this.filesChecked = [];
        this.foldersChecked = [];
    }

    @action getUsageDetails() {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.CURRENT_USER + 'usage',
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.usage = json;
            }).catch((ex) => {
                this.handleErrors(ex)
            })
    }

    @action getProjects(page) {
        this.loading = true;
        if (page == null) page = 1;
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + "?page=" + page + "&per_page=25",
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
                const results = response.json();
                const headers = response.headers;
                return Promise.all([results, headers]);
            }).then((json) => {
                let results = json[0].results;
                let headers = json[1].map;
                if(page <= 1) {
                    this.projects = results;
                } else {
                    this.projects = [...this.projects, ...results];
                }
                this.responseHeaders = headers;
                this.loading = false;
            }).catch((ex) => {
                this.handleErrors(ex)
            })
    }

    @action  getProjectMembers(id) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id + '/permissions',
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.projectMembers = json.results;
            }).catch((ex) => {
                this.handleErrors(ex)
            });
    }

    @action addProject(name, desc) {
        this.loading = true;
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT,
            getFetchParams('post', authStore.appConfig.apiToken, {
                "name": name,
                "description": desc
            })
        ).then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.addToast('Project Added');
                this.projects = [json, ...this.projects];
                this.loading = false;
            }).catch((ex) => {
                this.addToast('Failed to add new project');
                this.handleErrors(ex)
            })
    }

    @action editProject(id, name, desc) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id,
            getFetchParams('put', authStore.appConfig.apiToken, {
                "name": name,
                "description": desc
            })
        ).then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.addToast('Project Updated');
                this.showDetails(id);
            }).catch((ex) => {
                this.addToast('Project Update Failed');
                this.handleErrors(ex)
            });
    }

    @action deleteProject(id) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id,
            getFetchParams('delete', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
            }).then((json) => {
                this.addToast('Project Deleted');

            }).catch((ex) => {
                this.addToast('Project Delete Failed');
                this.handleErrors(ex)
            });
    }

    @action showDetails(id) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id,
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.project = json;
            }).catch((ex) => {
                this.handleErrors(ex)
            })
    }

    @action addFolder(id, parentKind, name) {
        this.loading = true;
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FOLDER,
            getFetchParams('post', authStore.appConfig.apiToken, {
                "name": name,
                "parent": {
                    "kind": parentKind,
                    "id": id
                }
            })
        ).then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.addToast('Folder Added');
                this.listItems = [json, ...this.listItems];
                this.loading = false;
            }).catch((ex) => {
                this.addToast('Failed to Add a New Folder');
                this.handleErrors(ex)
            })
    }

    @action deleteFolder(id, parentId, parentKind) {
        this.loading = true;
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FOLDER + id,
            getFetchParams('delete', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {}).then(() => {
                this.addToast('Folder(s) Deleted!');
                this.deleteItemSuccess(parentId, parentKind, id)
            }).catch((ex) => {
                this.addToast('Folder Deleted Failed!');
                this.handleErrors(ex)
            });
    }

    @action deleteFile(id, parentId, parentKind) {
        this.loading = true;
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FILE + id,
            getFetchParams('delete', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
            }).then(() => {
                this.addToast('File(s) Deleted!');
                this.deleteItemSuccess(parentId, parentKind, id)
            }).catch((ex) => {
                this.addToast('Failed to Delete File!');
                this.handleErrors(ex)
            });
    }

    @action deleteItemSuccess(parentId, parentKind, id) {
        this.loading = false;
        this.listItems = BaseUtils.removeObjByKey(this.listItems, {key: 'id', value: id});
    }

    batchDeleteItems(parentId, parentKind) {
        let files = this.filesChecked;
        let folders = this.foldersChecked;
        for (let i = 0; i < files.length; i++) {
            this.deleteFile(files[i], parentId, parentKind);
        }
        for (let i = 0; i < folders.length; i++) {
            this.deleteFolder(folders[i], parentId, parentKind);
        }
        this.handleBatch([], []);
    }

    @action editItem(id, name, path) {
        this.loading = true;
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + path + id + '/rename',
            getFetchParams('put', authStore.appConfig.apiToken, {
                "name": name
            })
        ).then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.addToast('Item name updated to ' + name);
                if(BaseUtils.objectPropInArray(this.listItems.slice(), 'id', id)) {
                    this.listItems = this.listItems.filter(obj => obj.id !== id);
                    this.listItems.unshift(json);
                } else {
                    this.entityObj = json;
                }
                this.loading = false;
            }).catch((ex) => {
                this.addToast('Failed to update item');
                this.handleErrors(ex)
            });
    }

    @action getMoveItemList(id, path) {
        this.moveItemList = [];
        this.moveItemLoading = true;
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + path + id + Path.CHILDREN,
            getFetchParams('get', authStore.appConfig.apiToken)
        ).then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.moveItemList = json.results;
                this.moveItemLoading = false;
            }).catch((ex) => {
                this.handleErrors(ex)
            })
    }

    selectMoveLocation (id, kind){
        this.destination = id;
        this.destinationKind = kind;
    }

    @action moveItem(id, kind, destination, destinationKind) {
        this.loading = true;
        let path = kind === Kind.DDS_FILE ? Path.FILE : Path.FOLDER;
        let type = kind === Kind.DDS_FILE ? 'File' : 'Folder';
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + path + id + '/move',
            getFetchParams('put', authStore.appConfig.apiToken, {
                "parent": {
                    "kind": destinationKind,
                    "id": destination
                }
            })
        ).then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.addToast(type + ' moved successfully');
                this.listItems = BaseUtils.removeObjByKey(this.listItems, {key: 'id', value: id});
                this.loading = false;
            }).catch((ex) => {
                this.addToast('Failed to move ' + type + ' to new location');
                this.handleErrors(ex)
            })
    }

    @action getEntity(id, kind, requester) {
        this.loading = requester !== 'moveItemModal' ? true : false;
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + kind + id,
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                if(this.projPermissions === null && (json.kind === 'dds-file' || json.kind === 'dds-folder')) this.getUser(json.project.id);
                if(this.projPermissions === null && json.kind === 'dds-file-version') this.getUser(json.file.project.id);
                if (requester === undefined) this.entityObj = json;
                if (requester === 'moveItemModal') this.moveToObj = json;
                if (requester === 'optionsMenu') {
                    this.parent = json.parent;
                    this.moveToObj = json;
                }
                this.loading = false;
            }).catch((ex) => {
                this.handleErrors(ex)
            });
    }

    @action setSelectedEntity(id, kind) {
        if (id === null) {
            this.selectedEntity = null;
        } else {
            fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + kind + '/' + id,
                getFetchParams('get', authStore.appConfig.apiToken))
                .then(this.checkResponse).then((response) => {
                    return response.json()
                }).then((json) => {
                    this.selectedEntity = json;
                }).catch((ex) => {
                    this.handleErrors(ex)
                });
        }
    }

    @action getObjectMetadata(id, kind) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.META + kind + "/" + id,
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.objectMetadata = json.results;
                this.metaObjProps = json.results.map((prop) => { //TODO: Make sure this is observable Map
                    return prop.properties.map((prop) => {
                        return {key: prop.template_property.key, id: prop.template_property.id, value: prop.value};
                    })
                });
            }).catch((ex) => {
                this.handleErrors(ex)
            })
    }

    @action getUserName(text) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'users?' + 'full_name_contains=' + text + '&page=1&per_page=500',
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.users = json.results.map((users) => {return users.full_name});
            }).catch((ex) => {
                this.handleErrors(ex)
            });
    }

    @action getUserId(fullName, id, role) {
        this.loading = true;
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'users?' + 'full_name_contains=' + fullName,
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                let userInfo = json.results.map((result) => {
                    return result.id
                });
                let getName = json.results.map((result) => {
                    return result.full_name
                });
                let userId = userInfo.toString();
                let name = getName.toString();
                this.addProjectMember(id, userId, role, name);
            }).catch((ex) => {
                this.handleErrors(ex)
            });
    }

    @action addProjectMember(id, userId, role, name) {
        let newRole = role.replace('_', ' ');
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id + '/permissions/' + userId,
            getFetchParams('put', authStore.appConfig.apiToken, {
                'auth_role': {'id': role}
            })
        ).then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.addToast(name + ' ' + 'has been added as a ' + newRole + ' to this project');
                this.getProjectMembers(id);
                this.loading = false;
            }).catch((ex) => {
                this.addToast('Could not add member to this project or member does not exist');
                this.handleErrors(ex)
            });
    }

    @action deleteProjectMember(id, userId, userName) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id + '/permissions/' + userId,
            getFetchParams('delete', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
            }).then((json) => {
                this.addToast(userName + ' ' + 'has been removed from this project');
                this.getProjectMembers(id);
            }).catch((ex) => {
                this.addToast('Unable to remove ' + userName + ' from this project');
                this.handleErrors(ex)
            });
    }

    handleBatch (files, folders) {
        this.filesChecked = files;
        this.foldersChecked = folders;
        this.itemsSelected = files.length + folders.length;
    }

    toggleTagManager() {
        this.openTagManager = !this.openTagManager;
    }

    toggleUploadManager() {
        this.openUploadManager = !this.openUploadManager;
    }

    processFilesToUpload(files, rejectedFiles) {
        this.filesToUpload = files;
        this.filesRejectedForUpload = rejectedFiles;
    }

    defineTagsToAdd(tags) {
        this.tagsToAdd = tags;
    }

    @action getTagAutoCompleteList(text) {
        let query = text === null ? '' : '&label_contains=' + text;
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'tags/labels/?object_kind=dds-file' + query,
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.tagAutoCompleteList = json.results.map((item) => {return item.label});
            }).catch((ex) => {
                this.handleErrors(ex)
            })
    }

    @action getTagLabels() {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'tags/labels/?object_kind=dds-file',
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.tagLabels = json.results;
            }).catch((ex) => {
                this.handleErrors(ex)
            })
    }

    @action getTags(id, kind) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TAGS + kind + '/' + id,
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.objectTags = json.results;
            }).catch((ex) => {
                this.handleErrors(ex)
            })
    }

    @action addNewTag(id, kind, tag) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TAGS + kind + '/' + id,
            getFetchParams('post', authStore.appConfig.apiToken, {
                'label': tag
            })
        ).then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.addToast('Added ' + json.label + ' tag');
                this.getTags(id, Kind.DDS_FILE);
            }).catch((ex) => {
                this.addToast('Failed to add new tag');
                this.handleErrors(ex)
            })
    }

    @action appendTags(id, kind, tags) {
        let msg = tags.map((tag)=> {
            return tag.label
        });
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TAGS + kind + '/' + id + '/append',
            getFetchParams('post', authStore.appConfig.apiToken, {
                tags
            })
        ).then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.addToast('Added ' + msg + ' as tags to all selected files.');
                this.getTags(id, Kind.DDS_FILE);
                this.handleBatch([], [])
            }).catch((ex) => {
                this.addToast('Failed to add tags');
                this.handleErrors(ex)
            })
    }

    @action deleteTag(id, label, fileId) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.TAGS + id,
            getFetchParams('delete', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
            }).then(() => {
                this.addToast(label + ' tag deleted!');
                this.getTags(fileId, Kind.DDS_FILE);
            }).catch((ex) => {
                this.addToast('Failed to delete ' + label);
                this.handleErrors(ex)
            });
    }

    @action startUpload(projId, blob, parentId, parentKind, label, fileId, tags) {
        let chunkNum = 0,
            fileName = blob.name,
            contentType = blob.type,
            slicedFile = null,
            BYTES_PER_CHUNK, SIZE, NUM_CHUNKS, start, end;
        BYTES_PER_CHUNK = 5242880 * 6;
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
                getFetchParams('post', authStore.appConfig.apiToken, {
                    'name': fileName,
                    'content_type': contentType,
                    'size': SIZE
                })
            ).then(this.checkResponse).then((response) => {
                    return response.json()
                }).then((json) => {
                    let uploadObj = json;
                    if (!uploadObj || !uploadObj.id) throw "Problem, no upload created";
                    mainStore.uploads.set(uploadObj.id, details);
                    mainStore.hashFile(mainStore.uploads.get(uploadObj.id), uploadObj.id);
                    mainStore.updateAndProcessChunks(uploadObj.id, null, null);
                    window.onbeforeunload = function (e) {// If uploading files and user navigates away from page, send them warning
                        let preventLeave = true;
                        if (preventLeave) {
                            return "If you refresh the page or close your browser, files being uploaded will be lost and you" +
                                " will have to start again. Are" +
                                " you sure you want to do this?";
                        }
                    };
                }).catch((ex) => {
                    mainStore.handleErrors(ex)
                })
        };
        fileReader.onerror = function (e) {
            mainStore.handleErrors(e.target.error);
            console.log("error", e);
            console.log(e.target.error.message);
        };
        fileReader.readAsArrayBuffer(slicedFile);
    }

    // File Hashing
    hashFile(file, id) {
        function postHash(hash) {
            let fileHashes = mainStore.fileHashes.push(hash);
        }
        if (file.blob.size < 5242880 * 6) {
            function calculateMd5(blob, id) {
                let reader = new FileReader();
                reader.readAsArrayBuffer(blob);
                reader.onloadend = function () {
                    let wordArray = CryptoJS.lib.WordArray.create(reader.result),
                        hash = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
                    postHash({id: id, hash: hash});
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
                        postHash({id: e.data.id, hash: e.data.hash});
                    };
                    worker.postMessage({type: "finish", id: id});
                });
            };
            worker.postMessage({type: "create"});
        }
    }

    updateChunkProgress(uploadId, chunkNum, progress) {
        if (!uploadId && !this.uploads.has(uploadId)) {
            return;
        }
        let upload = this.uploads.get(uploadId);
        let chunks = upload ? upload.chunks : '';
        if (chunkNum !== null) {
            for (let i = 0; i < chunks.length; i++) {
                // find chunk to update
                if (chunks[i].number === chunkNum) {
                    // update progress of chunk in bytes
                    if (progress) chunks[i].chunkUpdates.progress = progress;
                    break;
                }
            }
        }
        // calculate % uploaded
        let bytesUploaded = 0;
        if (chunks) {
            chunks.map(chunk => bytesUploaded += chunk.chunkUpdates.progress);
            upload.uploadProgress = upload.size > 0 ? (bytesUploaded / upload.size) * 100 : 0;
        }
    }

    updateAndProcessChunks(uploadId, chunkNum, chunkUpdates) {
        if (!uploadId || !this.uploads.has(uploadId)) {
            return;
        }
        let upload = this.uploads.get(uploadId);
        let chunks = upload ? upload.chunks : '';
        if (chunkNum !== null) {
            for (let i = 0; i < chunks.length; i++) {
                // find chunk to update
                if (chunks[i].number === chunkNum) {
                    //update status
                    if (chunkUpdates.status !== undefined) chunks[i].chunkUpdates.status = chunkUpdates.status;
                    if (chunks[i].chunkUpdates.status === StatusEnum.STATUS_RETRY && chunks[i].retry > StatusEnum.MAX_RETRY) {
                        chunks[i].chunkUpdates.status = StatusEnum.STATUS_FAILED;
                        this.uploadError(uploadId, chunks[i].number);
                        return;
                    }
                    if (chunks[i].chunkUpdates.status === StatusEnum.STATUS_RETRY) chunks[i].retry++;
                    break;
                }
            }
        }
        // Decide what action to do next
        let allDone = true;
        for (let i = 0; i < chunks.length; i++) {
            let chunk = chunks[i];
            if (chunk.chunkUpdates.status === StatusEnum.STATUS_WAITING_FOR_UPLOAD || chunk.chunkUpdates.status === StatusEnum.STATUS_RETRY) {
                chunk.chunkUpdates.status = StatusEnum.STATUS_UPLOADING;
                this.getChunkUrl(uploadId, upload.blob.slice(chunk.start, chunk.end), chunk.number, upload.size, upload.parentId, upload.parentKind, upload.name, chunk.chunkUpdates);
                return;
            }
            if (chunk.chunkUpdates.status !== StatusEnum.STATUS_SUCCESS) allDone = false;
        }
        if (allDone === true) this.checkForHash(uploadId, upload.parentId, upload.parentKind, upload.name, upload.label, upload.fileId, upload.projectId);
        window.onbeforeunload = function (e) { // If done, set to false so no warning is sent.
            let preventLeave = false;
        };
    }

    uploadChunk(uploadId, presignedUrl, chunkBlob, size, parentId, parentKind, chunkNum, fileName, chunkUpdates) {
        window.addEventListener('offline', function () {
            mainStore.uploadError(uploadId, fileName)
        });
        var xhr = new XMLHttpRequest();
        xhr.upload.onprogress = uploadProgress;
        function uploadProgress(e) {
            if (e.lengthComputable) {
                mainStore.updateChunkProgress(uploadId, chunkNum, e.loaded / e.total * (chunkBlob.size));
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
            mainStore.updateAndProcessChunks(uploadId, chunkNum, {status: chunkUpdates.status});
        }

        xhr.open('PUT', presignedUrl, true);
        xhr.send(chunkBlob);
    }

    getChunkUrl(uploadId, chunkBlob, chunkNum, size, parentId, parentKind, fileName, chunkUpdates) {
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
            var arrayBuffer = event.target.result;
            var wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
            var md5crc = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
            fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.UPLOAD + uploadId + '/chunks',
                getFetchParams('put', authStore.appConfig.apiToken, {
                    "number": chunkNum,
                    "size": chunkBlob.size,
                    'hash': {
                        'value': md5crc,
                        'algorithm': 'MD5'
                    }
                })
            ).then(this.checkResponse).then((response) => {
                    return response.json()
                }).then((json) => {
                    let chunkObj = json;
                    if (chunkObj && chunkObj.url && chunkObj.host) {
                        // upload chunks
                        mainStore.uploadChunk(uploadId, chunkObj.host + chunkObj.url, chunkBlob, size, parentId, parentKind, chunkNum, fileName, chunkUpdates)
                    } else {
                        throw 'Unexpected response';
                    }
                }).catch((ex) => {
                    mainStore.updateAndProcessChunks(uploadId, chunkNum, {status: StatusEnum.STATUS_RETRY});
                });
        };
        fileReader.readAsArrayBuffer(chunkBlob);
    }

    allChunksUploaded(uploadId, parentId, parentKind, fileName, label, fileId, hash, projectId) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.UPLOAD + uploadId + '/complete',
            getFetchParams('put', authStore.appConfig.apiToken, {
                'hash': {
                    'value': hash,
                    'algorithm': 'md5'
                }
            })
        ).then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                if (fileId == null) {
                    this.addFile(uploadId, parentId, parentKind, fileName, label);
                } else {
                    this.addFileVersion(uploadId, label, fileId);
                }
            }).catch((ex) => {
                this.uploadError(uploadId, fileName, projectId);
            })
    }

    addFile(uploadId, parentId, parentKind, fileName) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FILE,
            getFetchParams('post', authStore.appConfig.apiToken, {
                'parent': {
                    'kind': parentKind,
                    'id': parentId
                },
                'upload': {
                    'id': uploadId
                }
            })).then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.addToast(fileName + ' uploaded successfully');
                this.addFileSuccess(parentId, parentKind, uploadId, json.id)
            }).catch((ex) => {
                this.addToast('Failed to upload ' + fileName + '!');
                this.handleErrors(ex)
            })
    }

    addFileSuccess(parentId, parentKind, uploadId, fileId) {
        if (this.uploads.get(uploadId).tags.length) {
            this.appendTags(fileId, 'dds-file', this.uploads.get(uploadId).tags);
        }
        if(this.uploads.size === 1) {
            if (parentKind === 'dds-project') {
                this.getChildren(parentId, Path.PROJECT);
            } else {
                this.getChildren(parentId, Path.FOLDER);
            }
        }
        if(this.uploads.has(uploadId)) this.uploads.delete(uploadId);
    }

    addFileVersion(uploadId, label, fileId) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FILE + fileId,
            getFetchParams('put', authStore.appConfig.apiToken, {
                'upload': {
                    'id': uploadId
                },
                'label': label
            })
        ).then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.addToast('Created New File Version!');
                this.addFileVersionSuccess(fileId, uploadId)
            }).catch((ex) => {
                this.addToast('Failed to Create New Version');
                this.uploadError(uploadId, label);
                this.handleErrors(ex);
            });
    }

    addFileVersionSuccess(id, uploadId) {
        this.showProvAlert = true;
        this.getEntity(id, Path.FILE);
        this.getFileVersions(id);
        if (this.uploads.has(uploadId)) this.uploads.delete(uploadId);
    }

    @action getFileVersions(id) {
        this.loading = true;
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.FILE + id + '/versions',
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                this.fileVersions = json.results;
                this.loading = false;
            }).catch((ex) => {
                this.handleErrors(ex)
            })
    }

    checkForHash(uploadId, parentId, parentKind, name, label, fileId, projectId) {
        let hash = this.fileHashes.find((fileHash)=>{ //Array.find method not supported in IE. See polyfills.js
            return fileHash.id === uploadId;
        });
        if(!hash) {
            this.updateAndProcessChunks(uploadId, null, null);
        }else{
            this.allChunksUploaded(uploadId, parentId, parentKind, name, label, fileId, hash.hash, projectId);
        }
    }

    uploadError(uploadId, fileName, projectId) { //Todo: Use Map() here to make it observable!!!!!!!!!!!!!!!!!!!!!!!!
        if (this.uploads.has(uploadId)) {
            this.failedUploads.push({
                upload: this.uploads.get(uploadId),
                fileName: fileName,
                id: uploadId,
                projectId: projectId
            });
            this.uploads.delete(uploadId);
            this.failedUpload(this.failedUploads);
        }
    }

    @action cancelUpload(uploadId, name) {
        if(this.uploads.has(uploadId)) {
            this.uploads.delete(uploadId);
        }
        this.addToast('Canceled upload of '+name);
    }

    @action  getDownloadUrl(id, kind) {
        this.loading = true;
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + kind + id + '/url',
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(this.checkResponse).then((response) => {
                return response.json()
            }).then((json) => {
                let host = json.host;
                let url = json.url;
                var win = window.open(host + url, '_blank');
                if (win) {
                    win.focus();
                } else { // if browser blocks popups use location.href instead
                    window.location.href = host + url;
                }
                this.loading = false;
            }).catch((ex) => {
                this.handleErrors(ex)
            })
    }

    @action getChildren(id, path, page) {
        this.loading = true;
        if (page == null) page = 1;
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + path + id + Path.CHILDREN + "?page=" + page + "&per_page=25",
            getFetchParams('get', authStore.appConfig.apiToken)
        ).then(this.checkResponse).then((response) => {
                const results = response.json();
                const headers = response.headers;
                return Promise.all([results, headers]);
            }).then((json) => {
                let results = json[0].results;
                let headers = json[1].map;
                if(page <= 1) {
                    this.listItems = results;
                } else {
                    this.listItems = [...this.listItems, ...results];
                }
                this.responseHeaders = headers;
                this.loading = false;
            }).catch((ex) => {
                this.handleErrors(ex)
            })
    }

    @action getUser(id) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'current_user',
            getFetchParams('get', authStore.appConfig.apiToken))
            .then((response) => {
                return response.json()
            }).then((json) => {
                this.currentUser = json;
                if(id) this.getPermissions(id, json.id);
            }).catch((ex) => {
                this.handleErrors(ex)
            });
    }

    @action getPermissions(id, userId) {
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id + '/permissions/' + userId,
            getFetchParams('get', authStore.appConfig.apiToken))
            .then((response) => {
                return response.json()
            }).then((json) => {
                let id = json.auth_role.id;
                if (id === 'project_viewer') this.projPermissions = 'viewOnly';
                if (id === 'project_admin' || id === 'system_admin') this.projPermissions = 'prjCrud';
                if (id === 'file_editor') this.projPermissions = 'flCrud';
                if (id === 'file_uploader') this.projPermissions = 'flUpload';
                if (id === 'file_downloader') this.projPermissions = 'flDownload';
            }).catch((ex) => {
                this.handleErrors(ex)
            });
    }

    searchFiles(text, id) {
        this.autoCompleteLoading = true;
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.PROJECT + id + '/children?name_contains=' + text,
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(checkStatus).then((response) => {
                return response.json()
            }).then((json) => {
                this.autoCompleteLoading = false;
                this.searchFilesList = json.results.filter((file)=>{
                    if(file.kind === 'dds-file') return file.name;
                });
            }).catch((ex) => {
                this.handleErrors(ex)
            })
    }

    clearSearchFilesData() {
        this.searchFilesList = [];
    }

    //@action getActivities() {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.ACTIVITIES,
    //        getFetchParams('get', authStore.appConfig.apiToken))
    //        .then(this.checkResponse).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            this.activities = json.results;
    //        }).catch((ex) => {
    //            this.handleErrors(ex)
    //        })
    //}
    //
    //@action getWasGeneratedByNode(id, kind, prevGraph) {
    //    this.drawerLoading = true;
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'search/provenance/origin',
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //            'file_versions': [{
    //                id: id
    //            }]
    //        })
    //    ).then(this.checkResponse).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            this.getProvenanceSuccess(json.graph, prevGraph);
    //        }).catch((ex) => {
    //            this.handleErrors(ex)
    //        })
    //}
    //
    //@action getProvenance(id, kind, prevGraph) {
    //    this.drawerLoading = true;
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'search/provenance?max_hops=1',
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //            'start_node': {
    //                kind: kind,
    //                id: id
    //            }
    //        })
    //    ).then(this.checkResponse).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            this.getProvenanceSuccess(json.graph, prevGraph);
    //        }).catch((ex) => {
    //            this.handleErrors(ex)
    //        })
    //}
    //
    //getProvenanceSuccess(prov, prevGraph) {
    //    let edges = prov.relationships.filter((edge) => {
    //        if (edge.properties.audit.deleted_on === null && edge.type !== 'WasAttributedTo') {
    //            return edge;
    //        }
    //    });
    //    let nodes = prov.nodes.filter((node) => {
    //        if (!node.properties.is_deleted && node.properties.hasOwnProperty('kind')) {
    //            return node;
    //        }
    //    });
    //    this.provEdges = edges.map((edge) => {
    //        if (edge.properties.audit.deleted_by === null) {
    //            let color = edge.type === 'Used' ? graphColors.edges.used : graphColors.edges.generated;
    //            return {
    //                id: edge.id,
    //                to: edge.end_node,
    //                from: edge.start_node,
    //                type: edge.type,
    //                properties: edge.properties,
    //                color: color,
    //                arrows: 'to',
    //                title: '<div style="color: #616161"><span>'
    //                + edge.type + '</span></div>'
    //            };
    //        }
    //    });
    //    this.provNodes = nodes.map((node) => {
    //        if(node.properties.hasOwnProperty('audit')) {
    //            if (node.properties.kind === 'dds-activity') {
    //                return {
    //                    id: node.id,
    //                    label: 'Activity: \n' + node.properties.name,
    //                    labels: node.labels.toString(),
    //                    properties: node.properties,
    //                    shape: 'box',
    //                    color: graphColors.activity,
    //                    title: '<div style="margin: 10px; color: #616161"><span>'
    //                    + 'Name: ' + node.properties.name + '</span><br/>' +
    //                    '<span>' + 'Created By: ' + node.properties.audit.created_by.full_name + '</span><br/>' +
    //                    '<span>' + 'Started On: ' + node.properties.started_on + '</span></div>'
    //                }
    //            }
    //            if (node.properties.kind === 'dds-file-version') {
    //                let label = node.properties.label !== null ? node.properties.label : "";
    //                return {
    //                    id: node.id,
    //                    label: node.properties.file.name + '\nVersion: ' + node.properties.version,
    //                    labels: node.labels.toString(),
    //                    properties: node.properties,
    //                    color: graphColors.fileVersion,
    //                    title: '<div style="margin: 10px; color: #616161"><span>'
    //                    + node.properties.file.name + '</span><br/><span>Version: '
    //                    + node.properties.version + '</span><br/><span>'
    //                    + label + '</span></div>'
    //                }
    //            }
    //        } else {
    //            return {
    //                id: node.id,
    //                label: node.properties.kind,
    //                labels: node.labels.toString(),
    //                properties: node.properties,
    //                color: graphColors.noPermissions,
    //                title: '<div style="margin: 10px; color: #616161"><span>'
    //                + 'You do not have permission to view this file.' + '</span></div>'
    //            }
    //        }
    //    });
    //    if(prevGraph !== null && typeof prevGraph === 'object') {
    //        let prevNodes = prevGraph.nodes;
    //        let prevEdges = prevGraph.edges;
    //        for(let i=0; i<prevNodes.length; i++) {
    //            this.provNodes.push(prevNodes[i]);
    //        }
    //        for(let i=0; i<prevEdges.length; i++) {
    //            this.provEdges.push(prevEdges[i]);
    //        }
    //        this.provNodes = this.provNodes.filter((node, index, self) => self.findIndex((t) => {return t.id === node.id}) === index);
    //        this.provEdges = this.provEdges.filter((edge, index, self) => self.findIndex((t) => {return t.id === edge.id}) === index);
    //    }
    //    console.log(this.provNodes)
    //    this.drawerLoading = false;
    //    this.showProvCtrlBtns = false;
    //    this.showProvDetails = false;
    //    this.dltRelationsBtn = false;
    //}
    //
    //getFromAndToNodes(data, relationKind, nodes) {
    //    let from = null;
    //    let to = null;
    //    let node1 = null;
    //    let node2 = null;
    //    nodes.forEach((node) => {
    //        if (data.from === node.id) {
    //            node1 = node;
    //        }
    //        if (data.to === node.id) {
    //            node2 = node;
    //        }
    //    });
    //    if (!node1.properties.hasOwnProperty('kind') || !node2.properties.hasOwnProperty('kind')) {
    //        this.provEditorModal = {open: true, id: 'relWarning'};
    //        this.relMsg = 'invalidRelMsg';
    //    }
    //    if (relationKind !== 'was_derived_from') {
    //        if (node1.properties.kind === 'dds-activity' && node1.properties.audit.created_by.id !== authStore.currentUser.id) {
    //            this.provEditorModal = {open: true, id: 'relWarning'};
    //            this.relMsg = 'permissionError';
    //        } else if (node2.properties.kind === 'dds-activity' && node2.properties.audit.created_by.id !== authStore.currentUser.id){
    //            this.provEditorModal = {open: true, id: 'relWarning'};
    //            this.relMsg = 'permissionError';
    //        } else {
    //            if (node1.properties.kind === 'dds-file-version' && node2.properties.kind === 'dds-file-version') {
    //                this.provEditorModal = {open: true, id: 'relWarning'};
    //                this.relMsg = 'wasDerivedFrom';
    //            }
    //            if (node1.properties.kind === 'dds-activity' && node2.properties.kind === 'dds-activity') {
    //                this.provEditorModal = {open: true, id: 'relWarning'};
    //                this.relMsg = 'actToActMsg';
    //            }
    //            if (node1.properties.kind !== node2.properties.kind) {
    //                if (relationKind === 'used') {
    //                    from = node1.properties.kind === 'dds-activity' ? node1 : node2;
    //                    to = node1.properties.kind === 'dds-activity' ? node2 : node1;
    //                }
    //                if (relationKind === 'was_generated_by') {
    //                    from = node1.properties.kind === 'dds-activity' ? node2 : node1;
    //                    to = node1.properties.kind === 'dds-activity' ? node1 : node2;
    //                }
    //                if (node1.properties.hasOwnProperty('kind') && node2.properties.hasOwnProperty('kind')){
    //                    this.startAddRelation(relationKind, from, to);
    //                }
    //            }
    //        }
    //    } else {
    //        if (node1.properties.kind === 'dds-activity' || node2.properties.kind === 'dds-activity') {
    //            // Send error modal to user explaining rules of was_derived_from relations
    //            this.provEditorModal = {open: true, id: 'relWarning'};
    //            this.relMsg = 'notFileToFile';
    //        } else {
    //            from = node1;
    //            to = node2;
    //            this.confirmDerivedFromRel(from, to);
    //        }
    //    }
    //}
    //
    //confirmDerivedFromRel(from, to) {
    //    this.relFrom = from;
    //    this.relTo = to;
    //    this.provEditorModal = {open: true, id: 'confirmRel'}
    //}
    //
    //startAddRelation(kind, from, to) {
    //    this.buildRelationBody(kind, from, to);
    //    this.provEditorModal = {open: false, id: 'confirmRel'}
    //
    //}
    //
    //buildRelationBody(kind, from, to) {
    //    let body = {};
    //    if (kind === 'used') {
    //        body = {
    //            'activity': {
    //                'id': from.id
    //            },
    //            'entity': {
    //                'kind': 'dds-file-version',
    //                'id': to.id
    //            }
    //        };
    //    }
    //    if (kind === 'was_generated_by') {
    //        body = {
    //            'entity': {
    //                'kind': 'dds-file-version',
    //                'id': from.id
    //            },
    //            'activity': {
    //                'id': to.id
    //            }
    //        };
    //    }
    //    if (kind === 'was_derived_from') {
    //        body = {
    //            'generated_entity': {
    //                'kind': 'dds-file-version',
    //                'id': from.id
    //            },
    //            'used_entity': {
    //                'kind': 'dds-file-version',
    //                'id': to.id
    //            }
    //        };
    //    }
    //    this.addProvRelation(kind, body);
    //}
    //
    //@action addProvRelation(kind, body) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + 'relations/' + kind,
    //        getFetchParams('post', authStore.appConfig.apiToken, body)
    //    ).then(this.checkResponse).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            this.addToast('New relation Added');
    //            let rel = [];
    //            rel.push(json);
    //            this.updatedGraphItem = rel.map((edge) => {//Update dataset in client
    //                let color = edge.kind === 'dds-used_prov_relation' ? graphColors.edges.used : graphColors.edges.generated;
    //                return {
    //                    id: edge.id,
    //                    from: edge.from.id,
    //                    to: edge.to.id,
    //                    type: edge.kind,
    //                    color: color,
    //                    arrows: 'to',
    //                    properties: {
    //                        audit: edge.audit
    //                    },
    //                    title: '<div style="color: #616161"><span>'
    //                    + edge.kind + '</span></div>'
    //                };
    //            });
    //            let edges = this.provEdges;
    //            edges.push(this.updatedGraphItem[0]);
    //            this.provEdges = edges;
    //        }).catch((ex) => {
    //            this.addToast('Failed to add new relation');
    //            this.handleErrors(ex)
    //        })
    //}
    //
    //@action deleteProvItem(data, id) {
    //    let kind = data.hasOwnProperty('from') ? 'relations/' : 'activities/';
    //    let msg = kind === 'activities/' ? data.label : data.type;
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + kind + data.id,
    //        getFetchParams('delete', authStore.appConfig.apiToken))
    //        .then(this.checkResponse).then((response) => {
    //        }).then((json) => {
    //            this.addToast(msg + ' deleted');
    //            let item = [];
    //            item.push(data);
    //            //let edges = this.provEdges.slice(); //TODO: Remove cruft from this method if filter works
    //            //let nodes = this.provNodes.slice();
    //            this.showProvCtrlBtns = false;
    //            if(data.hasOwnProperty('from')){
    //                this.provEdges = this.provEdges.filter(obj => obj.id !== data.id);
    //                //edges = BaseUtils.removeObjByKey(edges, {key: 'id', value: data.id});
    //            } else {
    //                this.provNodes = this.provNodes.filter(obj => obj.id !== data.id);
    //                //nodes = BaseUtils.removeObjByKey(nodes, {key: 'id', value: data.id});
    //                this.getActivities();
    //            }
    //            this.updatedGraphItem = item;
    //            //this.provEdges = edges;
    //            //this.provNodes = nodes;
    //
    //        }).catch((ex) => {
    //            this.addToast('Failed to delete ' + msg);
    //            this.handleErrors(ex)
    //        });
    //}
    //
    //@action addProvActivity(name, desc) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.ACTIVITIES,
    //        getFetchParams('post', authStore.appConfig.apiToken, {
    //            "name": name,
    //            "description": desc
    //        })
    //    ).then(this.checkResponse).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            this.addToast('New Activity Added');
    //            this.addProvActivitySuccess(json);
    //        }).catch((ex) => {
    //            this.addToast('Failed to add new actvity');
    //            this.handleErrors(ex)
    //        })
    //}
    //
    //addProvActivitySuccess(json) {
    //    let act = [];
    //    act.push(json);
    //    this.updatedGraphItem = act.map((json) => {//Update dataset in client
    //        return {
    //            id: json.id,
    //            label: 'Activity: \n'+json.name,
    //            shape: 'box',
    //            color: graphColors.activity,
    //            properties: json,
    //            title: '<div style="margin: 10px; color: #616161"><span>'
    //            +'Name: '+json.name + '</span><br/>' +
    //            '<span>'+'Created By: '+json.audit.created_by.full_name+'</span><br/>' +
    //            '<span>'+'Started On: '+json.started_on+'</span></div>'
    //        };
    //    });
    //    let nodes = this.provNodes;
    //    nodes.push(this.updatedGraphItem[0]);
    //    this.provNodes = nodes;
    //}
    //
    //@action editProvActivity(id, name, desc, prevName) {
    //    fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.ACTIVITIES + id,
    //        getFetchParams('put', authStore.appConfig.apiToken, {
    //            "name": name,
    //            "description": desc
    //        })
    //    ).then(this.checkResponse).then((response) => {
    //            return response.json()
    //        }).then((json) => {
    //            if (name !== prevName) {
    //                this.addToast(prevName + ' name was changed to ' + name);
    //            } else {
    //                this.addToast(prevName + ' was edited');
    //            }
    //            let act = [];
    //            let nodes = this.provNodes.slice();
    //            //nodes = BaseUtils.removeObjByKey(nodes, {key: 'id', value: json.id});
    //            nodes = nodes.filter(obj => obj.id !== json.id);
    //            act.push(json);
    //            this.updatedGraphItem = act.map((json) => {//Update dataset in client
    //                return {
    //                    id: json.id,
    //                    label: 'Activity: \n'+json.name,
    //                    shape: 'box',
    //                    color: graphColors.activity,
    //                    properties: json,
    //                    title: '<div style="margin: 10px; color: #616161"><span>'
    //                    +'Name: '+json.name + '</span><br/>' +
    //                    '<span>'+'Created By: '+json.audit.created_by.full_name+'</span><br/>' +
    //                    '<span>'+'Started On: '+json.started_on+'</span></div>'
    //                };
    //            });
    //            nodes.push(this.updatedGraphItem[0]);
    //            this.provNodes = nodes;
    //            this.showProvCtrlBtns = false;
    //        }).catch((ex) => {
    //            this.handleErrors(ex)
    //        })
    //}
    //
    //switchRelationFromTo(from, to){
    //    this.openConfirmRel = true;
    //    this.relFrom = to;
    //    this.relTo = from;
    //}
    //
    //saveGraphZoomState(scale, position) {
    //    this.scale = scale;
    //    this.position = position;
    //}
    //
    //selectNodesAndEdges(edgeData, nodeData) {
    //    this.selectedEdge = edgeData[0];
    //    this.selectedNode = nodeData;
    //}
    //
    //showProvControlBtns() {
    //    this.showProvCtrlBtns = !this.showProvCtrlBtns;
    //    if(this.removeFileFromProvBtn) this.removeFileFromProvBtn = !this.removeFileFromProvBtn;
    //    if(this.dltRelationsBtn) this.dltRelationsBtn = !this.dltRelationsBtn;
    //}
    //
    //showRemoveFileFromProvBtn() { //To remove unused files from graph (not currently in use)
    //    this.removeFileFromProvBtn = !this.removeFileFromProvBtn;
    //    if(this.showProvCtrlBtns) this.showProvCtrlBtns = !this.showProvCtrlBtns;
    //    if(this.dltRelationsBtn) this.dltRelationsBtn = !this.dltRelationsBtn;
    //}
    //
    //showDeleteRelationsBtn(edges, nodes) {
    //    if (edges !== null && this.dltRelationsBtn && nodes !== null) {
    //        this.dltRelationsBtn = !this.dltRelationsBtn;
    //    } else {
    //        if (edges !== null && this.dltRelationsBtn) {
    //            this.dltRelationsBtn = true;
    //        } else {
    //            this.dltRelationsBtn = !this.dltRelationsBtn;
    //        }
    //        if (this.showProvCtrlBtns && this.dltRelationsBtn) {
    //            this.dltRelationsBtn = !this.dltRelationsBtn;
    //        }
    //    }
    //}
    //
    //toggleAddEdgeMode(value) {
    //    if (value == null) {
    //        this.addEdgeMode = false;
    //    } else {
    //        this.addEdgeMode = true;
    //    }
    //}
    //
    //toggleProvNodeDetails() {
    //    this.showProvDetails = !this.showProvDetails;
    //}
    //
    //toggleProvView() {
    //    this.toggleProv = !this.toggleProv;
    //    if(this.toggleProv !== true) { //clear old graph on close of provenance view
    //        this.provEdges = [];
    //        this.provNodes = [];
    //    }
    //}
    //
    //toggleProvEditor() {
    //    this.toggleProvEdit = !this.toggleProvEdit;
    //}
    //
    //toggleGraphLoading() {
    //    this.drawerLoading = false;
    //}
    //
    //openProvEditorModal(id) {
    //    this.provEditorModal = {open: true, id: id}
    //}
    //
    //closeProvEditorModal(id) {
    //    this.provEditorModal = {open: false, id: id}
    //}
    //
    //hideProvAlert() {
    //    this.showProvAlert = false;
    //}

    toggleModals(id) {
        this.toggleModal.open = !this.toggleModal.open;
        this.toggleModal.id = id;
    }

    displayErrorModals(error) {
        let err = error && error.message ? this.errorModals.push({
            msg: error.message,
            response: error.response ? error.response.status : null
        }) : null;
        if (err.response === null) {
            this.errorModals.push({
                msg: error.message,
                response: 'Folders can not be uploaded',
                ref: 'modal' + Math.floor(Math.random() * 10000)
            });
        } else if (error && error.response.status !== 404) {
            this.errorModals.push({
                msg: error.response.status === 403 ? error.message + ': You don\'t have permissions to view or change' +
                ' this resource' : error.message,
                response: error.response.status,
                ref: 'modal' + Math.floor(Math.random() * 10000)
            });
        } else {
            if (authStore.appConfig.apiToken) {
                setTimeout(()=>window.location.href = window.location.protocol + "//" + window.location.host + "/#/404", 1000);
            } else {
                setTimeout(()=>window.location.href = window.location.protocol + "//" + window.location.host + "/#/login", 1000);
            }
        }
        this.error = err;
    }

    getDeviceType(device) {
        this.device = device;
    }

    getScreenSize(height, width) {
        this.screenSize.height = height;
        this.screenSize.width = width;
    }

    handleErrors(error) {
        this.displayErrorModals(error);
        this.loading = false;
        provenanceStore.drawerLoading = false;
    }

    addToast(msg) {
        this.toasts.push({
            msg: msg,
            ref: 'toast' + Math.floor(Math.random() * 10000)
        });
    }

    removeToast(refId) {
        for (let i = 0; i < this.toasts.length; i++) {
            if (this.toasts[i].ref === refId) {
                this.toasts.splice(i, 1);
                break;
            }
        }
    }

    closePhiModal() {
        let expiresAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000));
        this.modalOpen = false;
        cookie.save('modalOpen', this.modalOpen, {expires: expiresAt});
    }

    failedUpload(failedUploads) {
        this.failedUploads = failedUploads;
    }

    removeFailedUploads() {
        this.failedUploads = [];
    }

    clearErrors(error) {
        this.error = {};
    }

    removeErrorModal(refId) {
        for (let i = 0; i < this.errorModals.length; i++) {
            if (this.errorModals[i].ref === refId) {
                this.errorModals.splice(i, 1);
                break;
            }
        }
        this.error = {};
    }
}

const mainStore = new MainStore();

export default mainStore;