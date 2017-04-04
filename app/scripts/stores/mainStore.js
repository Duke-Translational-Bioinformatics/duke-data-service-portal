import React from 'react';
import { observable, computed, action, map } from 'mobx';
import cookie from 'react-cookie';
import authStore from '../stores/authStore';
import provenanceStore from '../stores/provenanceStore';
import transportLayer from '../transportLayer';
import BaseUtils from '../util/baseUtils.js';
import { StatusEnum } from '../enum';
import { UrlGen, Kind, Path } from '../util/urlEnum';
import { checkStatus, getFetchParams } from '../util/fetchUtil';

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
    @observable drawerLoading
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
    @observable metadataTemplate
    @observable metaProps
    @observable metaTemplates
    @observable modal
    @observable modalOpen
    @observable moveItemList
    @observable moveItemLoading
    @observable moveToObj
    @observable objectMetadata
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
        this.drawerLoading = false;
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
        this.metadataTemplate = {};
        this.metaProps = [];
        this.metaTemplates = [];
        this.modal = false;
        this.modalOpen = cookie.load('modalOpen');
        this.moveItemList = [];
        this.moveItemLoading = false;
        this.moveToObj = {};
        this.objectMetadata = [];
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

    @action clearSelectedItems() {
        this.filesChecked = [];
        this.foldersChecked = [];
    }

    @action getUsageDetails() {
        transportLayer.getUsageDetails()
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.usage = json;
            }).catch(ex => this.handleErrors(ex))
    }

    @action getProjects(page) {
        this.loading = true;
        if (page == null) page = 1;
        transportLayer.getProjects(page)
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
            }).catch(ex => this.handleErrors(ex))
    }

    @action getProjectMembers(id) {
        transportLayer.getProjectMembers(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.projectMembers = json.results;
            }).catch(ex => this.handleErrors(ex))
    }

    @action addProject(name, desc) {
        this.loading = true;
        transportLayer.addProject(name, desc)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('Project Added');
                this.projects = [json, ...this.projects];
                this.loading = false;
            }).catch((ex) => {
                this.addToast('Failed to add new project');
                this.handleErrors(ex)
            })
    }

    @action editProject(id, name, desc) {
        transportLayer.editProject(id, name, desc)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('Project Updated');
                this.getProjectDetails(id);
            }).catch((ex) => {
                this.addToast('Project Update Failed');
                this.handleErrors(ex)
            });
    }

    @action deleteProject(id) {
        transportLayer.deleteProject(id)
            .then(this.checkResponse)
            .then(response => {})
            .then((json) => {
                this.addToast('Project Deleted');
            }).catch((ex) => {
                this.addToast('Project Delete Failed');
                this.handleErrors(ex)
            });
    }

    @action getProjectDetails(id) {
        transportLayer.getProjectDetails(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.project = json;
            }).catch(ex => this.handleErrors(ex))
    }

    @action addFolder(id, parentKind, name) {
        this.loading = true;
        transportLayer.addFolder(id, parentKind, name)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
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
        transportLayer.deleteFolder(id)
            .then(this.checkResponse)
            .then(response => {})
            .then(() => {
                this.addToast('Folder(s) Deleted!');
                this.deleteItemSuccess(parentId, parentKind, id)
            }).catch((ex) => {
                this.addToast('Folder Deleted Failed!');
                this.handleErrors(ex)
            });
    }

    @action deleteFile(id, parentId, parentKind) {
        this.loading = true;
        transportLayer.deleteFile(id)
            .then(this.checkResponse)
            .then(response => {})
            .then(() => {
                this.addToast('File(s) Deleted!');
                this.deleteItemSuccess(parentId, parentKind, id)
            }).catch((ex) => {
                this.addToast('Failed to Delete File!');
                this.handleErrors(ex)
            });
    }

    @action deleteItemSuccess(parentId, parentKind, id) {
        this.loading = false;
        this.listItems = BaseUtils.removeObjByKey(this.listItems.slice(), {key: 'id', value: id});
    }

    @action batchDeleteItems(parentId, parentKind) {
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

    @action editVersionLabel(id, label) {
        this.loading = true;
        transportLayer.editVersionLabel(id, label)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('Label Updated!');
                this.entityObj = json;
                this.loading = false;
            }).catch((ex) => {
                this.addToast('Failed to Update Label');
                this.handleErrors(ex)
            });
    }

    @action deleteVersion(id) {
        this.loading = true;
        transportLayer.deleteVersion(id)
            .then(this.checkResponse)
            .then(response => {})
            .then(() => {
                this.addToast('Version Deleted!');
                this.loading = false;
            }).catch((ex) => {
                this.addToast('Failed to Delete Version!');
                this.handleErrors(ex)
            });
    }

    @action editItem(id, name, path) {
        this.loading = true;
        transportLayer.editItem(id, name, path)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('Item name updated to ' + name);
                if(BaseUtils.objectPropInArray(this.listItems.slice(), 'id', id)) {
                    this.listItems = this.listItems.filter(obj => obj.id !== id);
                    this.listItems.unshift(json);
                } else if(this.entityObj.id === id) {
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
        transportLayer.getMoveItemList(id, path)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.moveItemList = json.results;
                this.moveItemLoading = false;
            }).catch(ex => this.handleErrors(ex))
    }

    @action selectMoveLocation (id, kind){
        this.destination = id;
        this.destinationKind = kind;
    }

    @action moveItem(id, kind, destination, destinationKind) {
        this.loading = true;
        let path = kind === Kind.DDS_FILE ? Path.FILE : Path.FOLDER;
        let type = kind === Kind.DDS_FILE ? 'File' : 'Folder';
        transportLayer.moveItem(id, path, destination, destinationKind)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast(type + ' moved successfully');
                this.listItems = BaseUtils.removeObjByKey(this.listItems.slice(), {key: 'id', value: id});
                this.loading = false;
            }).catch((ex) => {
                this.addToast('Failed to move ' + type + ' to new location');
                this.handleErrors(ex)
            })
    }

    @action getEntity(id, path, requester) {
        this.loading = requester !== 'moveItemModal' ? true : false;
        transportLayer.getEntity(id, path)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                if(this.projPermissions === null && (json.kind === 'dds-file' || json.kind === 'dds-folder')) this.getUser(json.project.id);
                if(this.projPermissions === null && json.kind === 'dds-file-version') this.getUser(json.file.project.id);
                if (requester === undefined) this.entityObj = json;
                if (requester === 'moveItemModal') this.moveToObj = json;
                if (requester === 'optionsMenu') {
                    this.parent = json.parent;
                    this.moveToObj = json;
                }
                this.loading = false;
            }).catch(ex => this.handleErrors(ex))
    }

    @action setSelectedEntity(id, path) {
        if (id === null) {
            this.selectedEntity = null;
        } else {
            transportLayer.setSelectedEntity(id, path)
                .then(this.checkResponse)
                .then(response => response.json())
                .then((json) => {
                    this.selectedEntity = json;
                }).catch(ex => this.handleErrors(ex))
        }
    }

    @action getObjectMetadata(id, kind) {
        transportLayer.getObjectMetadata(id, kind)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.objectMetadata = json.results;
                this.metaObjProps = json.results.map((prop) => {
                    return prop.properties.map((prop) => {
                        return {key: prop.template_property.key, id: prop.template_property.id, value: prop.value};
                    })
                });
            }).catch(ex => this.handleErrors(ex))
    }

    @action getUserNameFromAuthProvider(text, id) {
        this.drawerLoading = true;
        transportLayer.getUserNameFromAuthProvider(text, id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.users = json.results;
                this.drawerLoading = false;
            }).catch(ex => this.handleErrors(ex));
    }

    @action registerNewUser(id) {
        transportLayer.registerNewUser(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {})
            .catch((ex) => {
                if (ex.response.status !== 409) {
                    this.addToast('Failed to register this user with DDS');
                    this.handleErrors(ex)
                }
            });
    }

    @action getUserId(fullName, id, role) {
        this.loading = true;
        transportLayer.getUserId(fullName)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                let userInfo = json.results.map((result) => {return result.id});
                let getName = json.results.map((result) => {return result.full_name});
                let userId = userInfo.toString();
                let name = getName.toString();
                this.addProjectMember(id, userId, role, name);
            }).catch(ex => this.handleErrors(ex));
    }

    @action addProjectMember(id, userId, role, name) {
        let newRole = role.replace('_', ' ');
        transportLayer.addProjectMember(id, userId, role)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast(name + ' ' + 'has been added as a ' + newRole + ' to this project');
                this.getProjectMembers(id);
                this.loading = false;
            }).catch((ex) => {
                this.addToast('Could not add member to this project or member does not exist');
                this.handleErrors(ex)
            });
    }

    @action deleteProjectMember(id, userId, userName) {
        transportLayer.deleteProjectMember(id, userId)
            .then(this.checkResponse)
            .then(response => {})
            .then((json) => {
                this.addToast(userName + ' ' + 'has been removed from this project');
                this.getProjectMembers(id);
            }).catch((ex) => {
                this.addToast('Unable to remove ' + userName + ' from this project');
                this.handleErrors(ex)
            });
    }

    @action handleBatch (files, folders) {
        this.filesChecked = files;
        this.foldersChecked = folders;
        this.itemsSelected = files.length + folders.length;
    }

    @action toggleTagManager() {
        this.openTagManager = !this.openTagManager;
    }

    @action toggleUploadManager() {
        this.openUploadManager = !this.openUploadManager;
    }

    @action processFilesToUpload(files, rejectedFiles) {
        this.filesToUpload = files;
        this.filesRejectedForUpload = rejectedFiles;
    }

    @action defineTagsToAdd(tags) {
        this.tagsToAdd = tags;
    }

    @action getTagAutoCompleteList(text) {
        let query = text === null ? '' : '&label_contains=' + text;
        transportLayer.getTagAutoCompleteList(query)
            .then(this.checkResponse)
            .then(response => response.json())
            .then(json => this.tagAutoCompleteList = json.results.map((item) => {return item.label}))
            .catch(ex => this.handleErrors(ex))
    }

    @action getTagLabels() {
        transportLayer.getTagLabels()
            .then(this.checkResponse)
            .then(response => response.json())
            .then(json => this.tagLabels = json.results)
            .catch(ex => this.handleErrors(ex))
    }

    @action getTags(id, kind) {
        transportLayer.getTags(id, kind)
            .then(this.checkResponse)
            .then(response => response.json())
            .then(json => this.objectTags = json.results)
            .catch(ex => this.handleErrors(ex))
    }

    @action addNewTag(id, kind, tag) {
        transportLayer.addNewTag(id, kind, tag)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
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
        transportLayer.appendTags(id, kind, tags)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('Added ' + msg + ' as tags to all selected files.');
                this.getTags(id, Kind.DDS_FILE);
                this.handleBatch([], [])
            }).catch((ex) => {
                this.addToast('Failed to add tags');
                this.handleErrors(ex)
            })
    }

    @action deleteTag(id, label, fileId) {
        transportLayer.deleteTag(id)
            .then(this.checkResponse)
            .then(response => {})
            .then(() => {
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
            transportLayer.startUpload(projId, fileName, contentType, SIZE)
                .then(checkStatus)
                .then(response => response.json())
                .then((json) => {
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
                })
                .catch(ex => mainStore.handleErrors(ex))
        };
        fileReader.onerror = function (e) {
            mainStore.handleErrors(e.target.error);
            console.log("error", e);
            console.log(e.target.error.message);
        };
        fileReader.readAsArrayBuffer(slicedFile);
    }

    // File Hashing
    @action hashFile(file, id) {
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

    @action updateChunkProgress(uploadId, chunkNum, progress) {
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

    @action updateAndProcessChunks(uploadId, chunkNum, chunkUpdates) {
        if (!uploadId || !this.uploads.has(uploadId)) return;
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

    @action uploadChunk(uploadId, presignedUrl, chunkBlob, size, parentId, parentKind, chunkNum, fileName, chunkUpdates) {
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
            var algorithm = 'MD5';
            transportLayer.getChunkUrl(uploadId, chunkNum, chunkBlob.size, md5crc, algorithm)
                .then(this.checkResponse)
                .then(response => response.json())
                .then((json) => {
                    let chunkObj = json;
                    if (chunkObj && chunkObj.url && chunkObj.host) {
                        // upload chunks
                        mainStore.uploadChunk(uploadId, chunkObj.host + chunkObj.url, chunkBlob, size, parentId, parentKind, chunkNum, fileName, chunkUpdates)
                    } else {
                        throw 'Unexpected response';
                    }
                }).catch(ex => mainStore.updateAndProcessChunks(uploadId, chunkNum, {status: StatusEnum.STATUS_RETRY}));
        };
        fileReader.readAsArrayBuffer(chunkBlob);
    }

    allChunksUploaded(uploadId, parentId, parentKind, fileName, label, fileId, hash, projectId) {
        let algorithm = 'MD5';
        transportLayer.allChunksUploaded(uploadId, hash, algorithm)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                if (fileId == null) {
                    this.addFile(uploadId, parentId, parentKind, fileName, label);
                } else {
                    this.addFileVersion(uploadId, label, fileId);
                }
            }).catch(ex => this.uploadError(uploadId, fileName, projectId))
    }

    addFile(uploadId, parentId, parentKind, fileName) {
        transportLayer.addFile(uploadId, parentId, parentKind)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast(fileName + ' uploaded successfully');
                this.addFileSuccess(parentId, parentKind, uploadId, json.id)
            }).catch((ex) => {
                this.addToast('Failed to upload ' + fileName + '!');
                this.handleErrors(ex)
            })
    }

    @action addFileSuccess(parentId, parentKind, uploadId, fileId) {
        if (this.uploads.get(uploadId).tags.length) this.appendTags(fileId, 'dds-file', this.uploads.get(uploadId).tags);
        if(this.uploads.size === 1) {
            if (parentKind === 'dds-project') {
                this.getChildren(parentId, Path.PROJECT);
            } else {
                this.getChildren(parentId, Path.FOLDER);
            }
        }
        if(this.uploads.has(uploadId)) this.uploads.delete(uploadId);
    }

    @action addFileVersion(uploadId, label, fileId) {
        transportLayer.addFileVersion(uploadId, label, fileId)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('Created New File Version!');
                this.addFileVersionSuccess(fileId, uploadId)
            }).catch((ex) => {
                this.addToast('Failed to Create New Version');
                this.uploadError(uploadId, label);
                this.handleErrors(ex);
            });
    }

    @action addFileVersionSuccess(id, uploadId) {
        provenanceStore.displayProvAlert();
        this.getEntity(id, Path.FILE);
        this.getFileVersions(id);
        if (this.uploads.has(uploadId)) this.uploads.delete(uploadId);
    }

    @action getFileVersions(id) {
        this.loading = true;
        transportLayer.getFileVersions(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.fileVersions = json.results;
                this.loading = false;
            }).catch(ex => this.handleErrors(ex))
    }

    checkForHash(uploadId, parentId, parentKind, name, label, fileId, projectId) {
        let hash = this.fileHashes.find((fileHash) => {
            return fileHash.id === uploadId;
        });
        if(!hash) {
            this.updateAndProcessChunks(uploadId, null, null);
        }else{
            this.allChunksUploaded(uploadId, parentId, parentKind, name, label, fileId, hash.hash, projectId);
        }
    }

    @action uploadError(uploadId, fileName, projectId) {
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
        if(this.uploads.has(uploadId)) this.uploads.delete(uploadId);
        this.addToast('Canceled upload of '+name);
    }

    @action  getDownloadUrl(id, kind) {
        this.loading = true;
        transportLayer.getDownloadUrl(id, kind)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                let host = json.host;
                let url = json.url;
                var win = window.open(host + url, '_blank');
                if (win) {
                    win.focus();
                } else { // if browser blocks popups use location.href instead
                    window.location.href = host + url;
                }
                this.loading = false;
            }).catch(ex => this.handleErrors(ex))
    }

    @action getChildren(id, path, page) {
        this.loading = true;
        if (page == null) page = 1;
        transportLayer.getChildren(id, path, page)
            .then(this.checkResponse)
            .then((response) => {
                const results = response.json();
                const headers = response.headers;
                return Promise.all([results, headers]);
            })
            .then((json) => {
                let results = json[0].results;
                let headers = json[1].map;
                if(page <= 1) {
                    this.listItems = results;
                } else {
                    this.listItems = [...this.listItems, ...results];
                }
                this.responseHeaders = headers;
                this.loading = false;
            }).catch(ex =>this.handleErrors(ex))
    }

    @action getUser(id) {
        transportLayer.getUser()
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.currentUser = json;
                if(id) this.getPermissions(id, json.id);
            }).catch(ex => this.handleErrors(ex));
    }

    @action getPermissions(id, userId) {
        transportLayer.getPermissions(id, userId)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                let id = json.auth_role.id;
                if (id === 'project_viewer') this.projPermissions = 'viewOnly';
                if (id === 'project_admin' || id === 'system_admin') this.projPermissions = 'prjCrud';
                if (id === 'file_editor') this.projPermissions = 'flCrud';
                if (id === 'file_uploader') this.projPermissions = 'flUpload';
                if (id === 'file_downloader') this.projPermissions = 'flDownload';
            }).catch(ex =>this.handleErrors(ex))
    }

    @action searchFiles(text, id) {
        this.autoCompleteLoading = true;
        transportLayer.searchFiles(text, id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.autoCompleteLoading = false;
                this.searchFilesList = json.results.filter((file)=>{
                    if(file.kind === 'dds-file') return file.name;
                });
            }).catch(ex =>this.handleErrors(ex))
    }

    @action loadMetadataTemplates(value) {
        this.loading = true;
        let searchQuery = value !== null ? '?name_contains=' + value : '';
        transportLayer.loadMetadataTemplates(searchQuery)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.metaTemplates = json.results.sort((a, b) => {
                    a = new Date(a.audit.created_on);
                    b = new Date(b.audit.created_on);
                    return a>b ? -1 : a<b ? 1 : 0;
                });
                this.loading = false;
            }).catch(ex =>this.handleErrors(ex))
    }

    @action createMetadataTemplate(name, label, desc) {
        this.drawerLoading = true;
        transportLayer.createMetadataTemplate(name, label, desc)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('A new template called ' + label + ' was added');
                this.metadataTemplate = json;
                this.metaTemplates.unshift(json);
                this.showTemplateCreator = false;
                this.showTemplateDetails = true;
                this.drawerLoading = false;
            }).catch((ex) => {
                this.addToast('Failed to add new template');
                this.handleErrors(ex)
            })
    }

    @action getMetadataTemplateDetails(id) {
        this.drawerLoading = true;
        transportLayer.getMetadataTemplateDetails(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.openMetadataManager = !this.openMetadataManager;
                this.metadataTemplate = json;
                this.showTemplateCreator = false;
                this.showTemplateDetails = true;
                this.drawerLoading = false;
            }).catch(ex => this.handleErrors(ex))
    }

    @action getMetadataTemplateProperties(id) {
        this.drawerLoading = true;
        transportLayer.getMetadataTemplateProperties(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.templateProperties = json.results;
                this.drawerLoading = false;
            }).catch(ex => this.handleErrors(ex))
    }

    @action updateMetadataTemplate(id, name, label, desc) {
        this.drawerLoading = true;
        transportLayer.updateMetadataTemplate(id, name, label, desc)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast(label + ' has been updated.');
                this.metadataTemplate = json;
                this.showTemplateCreator = false;
                this.showTemplateDetails = true;
                this.drawerLoading = false;
                this.loadMetadataTemplates('');
            }).catch((ex) => {
                this.addToast('Failed to update ' + label);
                this.handleErrors(ex)
            })
    }

    @action deleteTemplate(id, label) {
        transportLayer.deleteTemplate(id)
            .then(this.checkResponse)
            .then(response => {})
            .then((json) => {
                this.addToast('The ' + label + ' template has been deleted');
                this.toggleMetadataManager();
                this.loadMetadataTemplates('');
            }).catch((ex) => {
                this.addToast('Failed to delete ' + label);
                this.handleErrors(ex)
            });
    }

    @action deleteMetadataProperty(id, label) {
        transportLayer.deleteMetadataProperty(id)
            .then(this.checkResponse)
            .then(response => {})
            .then((json) => {
                this.addToast('The ' + label + ' property has been deleted');
                this.templateProperties = BaseUtils.removeObjByKey(this.templateProperties.slice(), {key: 'id', value: id});
            }).catch((ex) => {
                this.addToast('Failed to delete ' + label);
                this.handleErrors(ex)
            });
    }

    @action createMetadataObject(kind, fileId, templateId, properties) {
        this.drawerLoading = true;
        transportLayer.createMetadataObject(kind, fileId, templateId, properties)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('A new metadata object was created.');
                this.createMetadataObjectSuccess(fileId, kind);
            }).catch((ex) => {
                if (ex.response.status === 409) {
                    this.updateMetadataObject(kind, fileId, templateId, properties);
                } else {
                    this.addToast('Failed to add new metadata object');
                    this.handleErrors(ex)
                }
            })
    }

    @action updateMetadataObject(kind, fileId, templateId, properties) {
        transportLayer.updateMetadataObject(kind, fileId, templateId, properties)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('This metadata object was updated.');
                this.createMetadataObjectSuccess(fileId, kind);
            }).catch((ex) => {
                this.addToast('Failed to update metadata object');
                this.handleErrors(ex)
            })
    }

    @action createMetadataProperty(id, name, label, desc, type) {
        this.drawerLoading = true;
        transportLayer.createMetadataProperty(id, name, label, desc, type)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('A new template property called ' + label + ' was added');
                this.templateProperties.push(json);
                this.drawerLoading = false;
            }).catch((ex) => {
                this.addToast('Failed to add new template property');
                this.handleErrors(ex)
            })
    }

    @action createMetadataObjectSuccess(id, kind) {
        this.drawerLoading = false;
        this.showBatchOps = false;
        this.showTemplateDetails = false;
        this.getObjectMetadata(id,kind);
    }

    @action createMetaPropsList(metaProps) {
        this.metaProps = metaProps;
    }

    @action showTemplatePropManager() {
        this.showPropertyCreator = true;
        this.showTemplateCreator = false;
        this.showTemplateDetails = false;
    }

    @action showMetadataTemplateList() {
        this.showTemplateDetails = false;
    }

    @action toggleMetadataManager() {
        if(this.templateProperties.length) this.templateProperties = [];
        this.openMetadataManager = !this.openMetadataManager;
        this.showPropertyCreator = false;
        this.showTemplateCreator = true;
        this.showTemplateDetails = false;
    }

    @action showMetaDataTemplateDetails() {
        this.showPropertyCreator = false;
        this.showTemplateCreator = false;
        this.showTemplateDetails = true;
    }

    @action searchObjects(value, includeKinds, includeProjects) {
        this.searchValue = value;
        this.loading = true;
        if (includeKinds === null || !includeKinds.length) includeKinds = ['dds-file', 'dds-folder'];
        transportLayer.searchObjects(value, includeKinds, includeProjects)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.searchResults = json.results;
                this.searchResultsFiles = json.results.filter((obj)=>{
                    return obj.kind === 'dds-file';
                });
                this.searchResultsFolders = json.results.filter((obj)=>{
                    return obj.kind === 'dds-folder';
                });
                let p = json.results.map((obj) => {
                    return {name: obj.ancestors[0].name, id: obj.ancestors[0].id};
                });
                this.searchResultsProjects = BaseUtils.removeDuplicates(p, 'id');
                this.loading = false;
            }).catch(ex =>this.handleErrors(ex))
    }

    @action toggleSearch() {
        this.searchValue = null;
        this.showSearch = !this.showSearch;
    }

    @action toggleSearchFilters() {
        this.showFilters = !this.showFilters;
    }

    @action setIncludedSearchKinds(includeKinds) {
        this.includeKinds = includeKinds;
        this.searchObjects(this.searchValue, this.includeKinds, this.searchFilters);
    }

    @action setIncludedSearchProjects(includeProjects) {
        this.includeProjects = includeProjects;
        this.setSearchFilters();
    }

    @action setSearchFilters() {
        this.searchFilters = [];
        this.includeProjects.forEach((projectId) => {this.searchFilters.push({"match":{"project.id": projectId}})});
        this.searchObjects(this.searchValue, this.includeKinds, this.searchFilters);
    }

    @action clearSearchFilesData() {
        this.searchFilesList = [];
    }

    @action toggleModals(id) {
        this.toggleModal.open = !this.toggleModal.open;
        this.toggleModal.id = id;
    }

    @action displayErrorModals(error) {
        if (error.response === null) {
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
    }

    @action getDeviceType(device) {
        this.device = device;
    }

    @action getScreenSize(height, width) {
        this.screenSize.height = height;
        this.screenSize.width = width;
    }

    @action handleErrors(error) {
        this.displayErrorModals(error);
        this.error = error;
        this.loading = false;
        this.drawerLoading = false;
        provenanceStore.toggleGraphLoading();
    }

    @action addToast(msg) {
        this.toasts.push({
            msg: msg,
            ref: 'toast' + Math.floor(Math.random() * 10000)
        });
    }

    @action removeToast(refId) {
        for (let i = 0; i < this.toasts.length; i++) {
            if (this.toasts[i].ref === refId) {
                this.toasts.splice(i, 1);
                break;
            }
        }
    }

    @action closePhiModal() {
        let expiresAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000));
        this.modalOpen = false;
        cookie.save('modalOpen', this.modalOpen, {expires: expiresAt});
    }

    @action failedUpload(failedUploads) {
        this.failedUploads = failedUploads;
    }

    @action removeFailedUploads() {
        this.failedUploads = [];
    }

    @action clearErrors(error) {
        this.error = {};
    }

    @action removeErrorModal(refId) {
        for (let i = 0; i < this.errorModals.length; i++) {
            if (this.errorModals[i].ref === refId) {
                this.errorModals.splice(i, 1);
                break;
            }
        }
        this.error = {};
    }

    @action toggleLoading() {
        this.loading = !this.loading
    }

    @action toggleUserInfoPanel() {
        this.showUserInfoPanel = !this.showUserInfoPanel;
    }
}

const mainStore = new MainStore();

export default mainStore;