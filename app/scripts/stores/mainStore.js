import React from 'react';
import { observable, computed, action, map } from 'mobx'; //Todo: remove unused imports (computed, map)
import cookie from 'react-cookie';
import UAParser from 'ua-parser-js';
import authStore from '../stores/authStore';
import navigatorStore from '../stores/navigatorStore';
import provenanceStore from '../stores/provenanceStore';
import transportLayer from '../transportLayer';
import BaseUtils from '../util/baseUtils.js';
import { StatusEnum, ChunkSize } from '../enum';
import { Kind, Path } from '../util/urlEnum';
import { checkStatus, checkStatusAndConsistency } from '../util/fetchUtil';

export class MainStore {
    @observable addTeamAfterProjectCreation
    @observable allItemsSelected
    @observable autoCompleteLoading
    @observable audit
    @observable counter
    @observable currentUser
    @observable currentLocation
    @observable destination
    @observable destinationKind
    @observable device
    @observable drawerLoading
    @observable entityObj
    @observable errorModals
    @observable expandUploadProgressCard
    @observable failedUploads
    @observable filesChecked
    @observable filesToUpload
    @observable filesRejectedForUpload
    @observable fileHashes
    @observable foldersChecked
    @observable fileVersions
    @observable hideUploadProgress
    @observable isListItem
    @observable isSafari
    @observable isFirefox
    @observable itemsSelected
    @observable leftNavIndex
    @observable leftMenuDrawer
    @observable listItems
    @observable loading
    @observable metadataTemplate
    @observable metaProps
    @observable metaTemplates
    @observable modal
    @observable phiModalOpen
    @observable moveItemList
    @observable moveItemLoading
    @observable moveToObj
    @observable nextPage
    @observable objectMetadata
    @observable objectTags
    @observable openMetadataManager
    @observable openTagManager
    @observable openUploadManager
    @observable parent
    @observable prevLocation
    @observable project
    @observable projects
    @observable projectMembers
    @observable projectRole
    @observable projectRoles
    @observable projectTeams
    @observable metaObjProps
    @observable responseHeaders
    @observable screenSize
    @observable searchFilesList
    @observable searchFilters
    @observable searchProjectsPostFilters
    @observable searchTagsPostFilters
    @observable searchResults
    @observable searchResultsFiles
    @observable searchResultsFolders
    @observable searchResultsProjects
    @observable searchResultsTags
    @observable searchValue
    @observable selectedEntity
    @observable selectedTeam
    @observable showAlert
    @observable showBackButton
    @observable serviceOutageNoticeModalOpen
    @observable showFilters
    @observable showPropertyCreator
    @observable showTagCloud
    @observable showTeamManager
    @observable showTemplateCreator
    @observable showTemplateDetails
    @observable showUserInfoPanel
    @observable showSearch
    @observable tableBodyRenderKey
    @observable tagLabels
    @observable tagsToAdd
    @observable templateProperties
    @observable toasts
    @observable totalItems
    @observable toggleModal
    @observable totalUploads
    @observable uploadCount
    @observable uploads
    @observable usage
    @observable users
    @observable userKey
    @observable versionModal

    constructor() {
        this.addTeamAfterProjectCreation = false;
        this.allItemsSelected = false;
        this.autoCompleteLoading = false;
        this.audit = {};
        this.currentLocation = null;
        this.counter = observable.map();
        this.currentUser = {};
        this.device = {};
        this.destination = null;
        this.destinationKind = null;
        this.drawerLoading = false;
        this.entityObj = null;
        this.errorModals = [];
        this.expandUploadProgressCard = true;
        this.failedUploads = [];
        this.filesChecked = [];
        this.filesToUpload = [];
        this.filesRejectedForUpload = [];
        this.fileHashes = [];
        this.foldersChecked = [];
        this.fileVersions = [];
        this.hideUploadProgress = false;
        this.isFolderUpload = false;
        this.isListItem = false;
        this.isSafari = false;
        this.isFirefox = false;
        this.itemsSelected = null;
        this.leftNavIndex = null;
        this.leftMenuDrawer = observable.map({'open': false, 'width': 240});
        this.listItems = [];
        this.loading = false;
        this.metadataTemplate = {};
        this.metaProps = [];
        this.metaTemplates = [];
        this.modal = false;
        this.phiModalOpen = cookie.load('phiModalOpen');
        this.moveItemList = [];
        this.moveItemLoading = false;
        this.moveToObj = {};
        this.nextPage = null;
        this.objectMetadata = [];
        this.objectTags = [];
        this.openMetadataManager = false;
        this.openTagManager = false;
        this.openUploadManager = false;
        this.parent = {};
        this.prevLocation = null;
        this.project = {};
        this.projects = [];
        this.projectMembers = [];
        this.projectRole = null;
        this.projectRoles = observable.map();
        this.projectTeams = observable.map();
        this.metaObjProps = [];
        this.responseHeaders = {};
        this.screenSize = {width: 0, height: 0};
        this.searchFilesList = [];
        this.searchFilters = [];
        this.searchProjectsPostFilters = {"project.name": []};
        this.searchTagsPostFilters = {"tags.label": []};
        this.searchResults = [];
        this.searchResultsFiles = [];
        this.searchResultsFolders = [];
        this.searchResultsProjects = [];
        this.searchResultsTags = [];
        this.searchValue = null;
        this.serviceOutageNoticeModalOpen = cookie.load('serviceOutageNoticeModalOpen');
        this.selectedEntity = null;
        this.selectedTeam = [];
        this.showAlert = false;
        this.showBackButton = true;
        this.showFilters = false;
        this.showPropertyCreator = false;
        this.showTagCloud = false;
        this.showTeamManager = false;
        this.showTemplateCreator = false;
        this.showTemplateDetails = false;
        this.showUserInfoPanel = false;
        this.showSearch = false;
        this.tableBodyRenderKey = 0;
        this.tagLabels = [];
        this.tagsToAdd = [];
        this.templateProperties = [];
        this.toasts = [];
        this.totalItems = null;
        this.toggleModal = {open: false, id: null};
        this.totalUploads = {inProcess: 0, complete: 0};
        this.uploadCount = [];
        this.uploads = observable.map();
        this.usage = null;
        this.users = [];
        this.userKey = {};
        this.versionModal = false;
        this.warnUserBeforeLeavingPage = false;
        this.transportLayer = transportLayer;
    }

    checkResponse(response) {
        return checkStatus(response, authStore);
    }

    @action addTeamMembersPrompt () {
        this.addTeamAfterProjectCreation = !this.addTeamAfterProjectCreation;
    }

    @action setSelectedTeam (id) {
        this.selectedTeam = !this.selectedTeam.includes(id) ? [id] : [];
        if(this.showAlert) this.toggleAlert();
    }

    @action toggleTeamManager() {
        this.showTeamManager = !this.showTeamManager;
    }

    @action toggleAlert() {
        this.showAlert = !this.showAlert;
    }

    @action setLeftNavIndex(index) {
        this.leftMenuDrawer.set('index', index);
    }
    
    @action toggleLeftMenuDrawer() {
        this.leftMenuDrawer.get('open') ? navigatorStore.openDrawer() : navigatorStore.closeDrawer();
        this.leftMenuDrawer.set('open', !this.leftMenuDrawer.get('open'));
    }

    @action closeLeftMenuDrawer() {
        this.leftMenuDrawer.set('open', false);
        navigatorStore.openDrawer();
    }
    
    @action openLeftMenuDrawer() {
        this.leftMenuDrawer.set('open', true);
        navigatorStore.closeDrawer();
    }

    @action toggleBackButtonVisibility(bool, prevLocation){
        this.showBackButton = bool;
        this.prevLocation = prevLocation;
    }

    @action toggleAllItemsSelected(bool) {
        this.allItemsSelected = bool;
    }

    @action setCurrentRouteLocation(location) {
        this.currentLocation = location;
    }

    @action toggleUploadProgressCard() {
        this.expandUploadProgressCard = !this.expandUploadProgressCard;
    }

    tryAsyncAgain(func, args, delay, counterId, message, isUpload) {
        const sleep = (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        };
        if(!this.counter.has(counterId)) {
            this.counter.set(counterId, 0);
        } else {
            let c = this.counter.get(counterId);
            c++;
            this.counter.set(counterId, c);
        }
        if(this.counter.get(counterId) < StatusEnum.MAX_RETRY) {
            mainStore.addToast(`${message}. Retrying in ${BaseUtils.timeConversion(delay)}...`);
            const tryAgain = async () => {
                await sleep(delay);
                func(...args);
            };
            tryAgain();
        } else {
            this.counter.delete(counterId);
            mainStore.addToast(`Failed to complete operation. Please try again in a few minutes`);
            mainStore.loading = false;
            if(!isUpload && (location.href.includes('file') || location.href.includes('folder'))) {
                window.location.href = window.location.protocol + '//' + window.location.host + '/#/home';
            } else {
                mainStore.uploadError(counterId)
            }
        }
    }

    @action incrementTableBodyRenderKey() {
        this.tableBodyRenderKey = this.tableBodyRenderKey + 1;
    }

    @action clearSelectedItems() {
        this.filesChecked = [];
        this.foldersChecked = [];
    }

    @action getUsageDetails() {
        this.transportLayer.getUsageDetails()
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.usage = json;
            }).catch(ex => this.handleErrors(ex))
    }

    @action getProjects(page, perPage, getAll) {
        this.loading = true;
        if (page == null) page = 1;
        if (perPage == null) perPage = 25;
        this.transportLayer.getProjects(page, perPage)
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
            const userId = authStore.currentUser.id !== undefined ? authStore.currentUser.id : this.currentUser.id !== undefined ? this.currentUser.id : null;
            this.projects.forEach((p) => {
                userId !== null ? this.getAllProjectPermissions(p.id, userId) : null;
            });
            if(getAll) {
                this.projects.forEach((p) => {
                    this.getProjectTeams(p.id, getAll);
                    navigatorStore.updateDownloadedItem(p);
                });
            };
            this.responseHeaders = headers;
            this.nextPage = headers !== null && !!headers['x-next-page'] ? headers['x-next-page'][0] : null;
            this.totalItems = headers !== null && !!headers['x-total'] ? parseInt(headers['x-total'][0], 10) : null;
            this.loading = false;
        }).catch(ex => this.handleErrors(ex))
    }

    @action getProjectListForProvenanceEditor() {
        this.loading = true;
        const page = 1;
        const perPage = 1000;
        this.transportLayer.getProjects(page, perPage)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.projects = json.results;
                this.loading = false;
            }).catch(ex => this.handleErrors(ex))
    }

    @action getAllProjectPermissions(id, userId) {
        this.transportLayer.getPermissions(id, userId)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.projects.forEach((p) => {
                    let role = json.auth_role.name;
                    if(p.id === id){
                        this.projectRoles.set(p.id, role);
                    }
                })
            }).catch(ex => this.handleErrors(ex))
    }

    @action getPermissions(id, userId) {
        this.transportLayer.getPermissions(id, userId)
           .then(this.checkResponse)
           .then(response => response.json())
           .then((json) => {
               this.projectRole = json.auth_role.id;
        }).catch(ex =>this.handleErrors(ex))
    }

    @action getProjectMembers(id) {
        this.transportLayer.getProjectMembers(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.projectMembers = json.results;
            }).catch(ex => this.handleErrors(ex))
    }

    @action getProjectTeams(id, getAll) {
        this.transportLayer.getProjectMembers(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                if(getAll && !this.projectTeams.has(id) && json.results.length > 1) this.projectTeams.set(id, {name: json.results[0].project.name, members: json.results});
            }).catch(ex => this.handleErrors(ex))
    }

    @action addProject(name, desc) {
        this.loading = true;
        this.transportLayer.addProject(name, desc)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('Project Added');
                this.projects = [json, ...this.projects];
                const userId = authStore.currentUser.id !== undefined ? authStore.currentUser.id : this.currentUser.id !== undefined ? this.currentUser.id : null;
                this.projects.forEach((p) => {
                    userId !== null ? this.getAllProjectPermissions(p.id, authStore.currentUser.id) : null;
                });
                navigatorStore.addDownloadedItem(json);
                this.loading = false;
                if(this.addTeamAfterProjectCreation) {
                    window.location.href = `${window.location.protocol}//${window.location.host}/#/project/${json.id}`;
                    this.toggleTeamManager();
                    this.addTeamMembersPrompt();
                }
            }).catch((ex) => {
            this.addToast('Failed to add new project');
            this.handleErrors(ex)
        })
    }

    @action editProject(id, name, desc) {
        this.transportLayer.editProject(id, name, desc)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('Project Updated');
                this.project = json;
                let index = this.projects.findIndex((p) => p.id === id);
                this.projects.splice(index, 1, json);
                navigatorStore.updateDownloadedItem(json);
            }).catch((ex) => {
            this.addToast('Project Update Failed');
            this.handleErrors(ex);
        });
    }

    @action deleteProject(id) {
        this.transportLayer.deleteProject(id)
            .then(this.checkResponse)
            .then(response => {})
            .then(() => {
                this.addToast('Project Deleted');
                this.projects = this.projects.filter(p => p.id !== id);
                navigatorStore.removeDownloadedItem(id);
                this.totalItems--;
            }).catch((ex) => {
            this.addToast('Project Delete Failed');
            this.handleErrors(ex)
        });
    }

    @action getProjectDetails(id) {
        this.transportLayer.getProjectDetails(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.project = json;
            }).catch(ex => this.handleErrors(ex))
    }

    @action addFolder(id, parentKind, name) {
        this.loading = true;
        this.transportLayer.addFolder(id, parentKind, name)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('Folder Added');
                this.listItems = [json, ...this.listItems];
                navigatorStore.addDownloadedItem(json, id);
                this.loading = false;
            }).catch((ex) => {
            this.addToast('Failed to Add a New Folder');
            this.handleErrors(ex)
        })
    }

    @action deleteFolder(id, parentId, path) {
        this.loading = true;
        this.transportLayer.deleteFolder(id)
            .then(this.checkResponse)
            .then(response => {})
            .then(() => {
                this.addToast('Folder(s) Deleted!');
                this.deleteItemSuccess(id, parentId, path)
            }).catch((ex) => {
            this.addToast('Folder Deleted Failed!');
            this.handleErrors(ex)
        });
    }

    @action deleteFile(id, parentId, path) {
        this.loading = true;
        this.transportLayer.deleteFile(id)
            .then(this.checkResponse)
            .then(response => {})
            .then(() => {
                this.addToast('File(s) Deleted!');
                this.deleteItemSuccess(id, parentId, path)
            }).catch((ex) => {
            this.addToast('Failed to Delete File!');
            this.handleErrors(ex)
        });
    }

    @action deleteItemSuccess(id, parentId, path) {
        this.loading = false;
        navigatorStore.removeDownloadedItem(id, parentId)
        this.listItems = this.listItems.filter(l => l.id !== id);
        this.totalItems--;
        if(this.listItems.length === 0) this.getChildren(parentId, path)
    }

    @action batchDeleteItems(parentId, path) {
        for (let id of this.filesChecked) {
            this.deleteFile(id, parentId, path);
            this.filesChecked = this.filesChecked.filter(file => file !== id);
        }
        for (let id of this.foldersChecked) {
            this.deleteFolder(id, parentId, path);
            this.foldersChecked = this.foldersChecked.filter(folder => folder !== id);
        }
        if(this.allItemsSelected) this.toggleAllItemsSelected(!this.allItemsSelected);
        this.incrementTableBodyRenderKey();
    }

    @action editVersionLabel(id, label) {
        this.loading = true;
        this.transportLayer.editVersionLabel(id, label)
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
        this.transportLayer.deleteVersion(id)
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
        this.transportLayer.editItem(id, name, path)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('Item name updated to ' + name);
                if(this.listItems.some(l => l.id === id)) {
                    let index = this.listItems.findIndex(p => p.id === id);
                    this.listItems.splice(index, 1, json);
                }
                if(this.entityObj && this.entityObj.id === id) this.entityObj = json;
                navigatorStore.updateDownloadedItem(json);
                this.loading = false;
            }).catch((ex) => {
            this.addToast('Failed to update item');
            this.handleErrors(ex)
        });
    }

    @action getMoveItemList(id, path) {
        this.moveItemList = [];
        this.moveItemLoading = true;
        this.transportLayer.getMoveItemList(id, path)
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
        this.transportLayer.moveItem(id, path, destination, destinationKind)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('Item moved successfully');
                if(this.filesChecked.length || this.foldersChecked.length || this.isListItem) {
                    this.listItems = BaseUtils.removeObjByKey(this.listItems.slice(), {key: 'id', value: id});
                    this.filesChecked = this.filesChecked.filter(i => i !== id);
                    this.foldersChecked = this.foldersChecked.filter(i => i !== id);
                    this.handleBatch(this.filesChecked, this.foldersChecked);
                    this.incrementTableBodyRenderKey();
                } else if(!this.isListItem) {
                    this.entityObj = json;
                }
                console.log('navigatorStore.moveDownloadedItem(id, destination);');
                navigatorStore.moveDownloadedItem(id, destination);
                this.loading = false;
            }).catch((ex) => {
            this.addToast('Failed to move ' + type + ' to new location');
            this.handleErrors(ex)
        })
    }

    @action getEntity(id, path, requester) {
        mainStore.parent = {};
        mainStore.loading = requester !== 'moveItemModal' ? true : false;
        let retryArgs = [id, path, requester];
        mainStore.transportLayer.getEntity(id, path)
            .then(checkStatusAndConsistency)
            .then(response => response.json())
            .then((json) => {
                if(!json.error) {
                    if (requester === undefined) mainStore.entityObj = json;
                    if (requester === 'moveItemModal') mainStore.moveToObj = json;
                    if (requester === 'optionsMenu') {
                        mainStore.parent = json.parent;
                        mainStore.moveToObj = json;
                    }
                    navigatorStore.updateDownloadedItem(json);
                    this.project = json.project;
                    if(!this.currentUser.id) this.getUser(json.project.id);
                    mainStore.loading = false;
                } else {
                    if(json.code === 'resource_not_consistent') {
                        this.loading = false;
                        const msg = "The resource you're requesting is temporarily unavailable...";
                        mainStore.tryAsyncAgain(mainStore.getEntity, retryArgs, 5000, id, msg, false )
                    } else {
                        mainStore.handleErrors(json);
                    }
                }
            }).catch(ex => mainStore.handleErrors(ex))
    }

    @action setSelectedEntity(id, path, isListItem) {
        if (id === null) {
            this.selectedEntity = null;
        } else {
            this.transportLayer.setSelectedEntity(id, path)
                .then(this.checkResponse)
                .then(response => response.json())
                .then((json) => {
                    this.selectedEntity = json;
                    this.isListItem = isListItem;
                }).catch(ex => this.handleErrors(ex))
        }
    }

    @action setSelectedProject(id) {
        this.transportLayer.getProjectDetails(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.project = json;
            }).catch(ex => this.handleErrors(ex))
    }

    @action getObjectMetadata(id, kind) {
        this.transportLayer.getObjectMetadata(id, kind)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.objectMetadata = json.results;
                this.metaObjProps = json.results.map((prop) => {
                    return prop.properties.map((prop) => {
                        return {
                            key: prop.template_property.key, id: prop.template_property.id, value: prop.value
                        }
                    })
                });
            }).catch(ex => this.handleErrors(ex))
    }

    @action deleteObjectMetadata(object, template) {
        const index = this.objectMetadata.findIndex(o => o.template.id === template.id);
        const itemToDelete = this.objectMetadata.filter((o) => {return o.template.id === template.id});
        this.objectMetadata = this.objectMetadata.filter((o) => o.template.id !== template.id);
        this.transportLayer.deleteObjectMetadata(object, template.id)
            .then(this.checkResponse)
            .then(response => {})
            .then(() => {
                this.addToast(`Resource metadata from ${template.name} has been deleted`);
            }).catch((ex) => {
            this.addToast(`Failed to delete resource metadata from ${template.name}`);
            this.objectMetadata.splice(index, 1, itemToDelete);
            this.handleErrors(ex)
        });
    }

    @action getUserNameFromAuthProvider(text, id) {
        this.drawerLoading = true;
        this.transportLayer.getUserNameFromAuthProvider(text, id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.users = json.results;
                this.drawerLoading = false;
            }).catch(ex => this.handleErrors(ex));
    }

    @action registerNewUser(id) {
        this.transportLayer.registerNewUser(id)
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
        this.transportLayer.getUserId(fullName)
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

    @action addProjectTeam(id, userId, role, projectName) {
        this.transportLayer.addProjectMember(id, userId, role)
            .then(this.checkResponse)
            .then(response => response.json())
            .then(() => {
                this.addToast(`All members from ${projectName} have been added as a to this project`);
                this.getProjectMembers(id);
                this.loading = false;
            }).catch((ex) => {
            this.addToast('Could not add member to this project or member does not exist');
            this.handleErrors(ex)
        });
    }

    @action addProjectMember(id, userId, role, name) {
        let newRole = role.replace('_', ' ');
        this.transportLayer.addProjectMember(id, userId, role)
            .then(this.checkResponse)
            .then(response => response.json())
            .then(() => {
                this.addToast(name + ' ' + 'has been added as a ' + newRole + ' to this project');
                this.getProjectMembers(id);
                this.loading = false;
            }).catch((ex) => {
            this.addToast('Could not add member to this project or member does not exist');
            this.handleErrors(ex)
        });
    }

    @action deleteProjectMember(id, userId, userName, removeSelf) {
        this.transportLayer.deleteProjectMember(id, userId)
            .then(this.checkResponse)
            .then(response => {})
            .then(() => {
                this.addToast(userName + ' ' + 'has been removed from this project');
                if(!removeSelf) {
                    this.getProjectMembers(id);
                } else {
                    this.projects = this.projects.filter(p => p.id !== id);
                    window.location.href = window.location.protocol + '//' + window.location.host + '/';
                }
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

    @action toggleTagCloud() {
        this.showTagCloud = !this.showTagCloud;
    }

    @action toggleUploadManager() {
        navigatorStore.drawer.set('open', this.openUploadManager);
        this.openUploadManager = !this.openUploadManager;
    }

    @action processFilesToUpload(files, rejectedFiles) {
        if(files.length) mainStore.isFolderUpload = Object.keys(files[0]).some(v => v === 'fullPath');
        this.filesToUpload = files.length || rejectedFiles.length ? [...this.filesToUpload, ...files] : [];
        this.filesToUpload = this.filesToUpload.filter((file, index, self) => self.findIndex(f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified) === index); // Checking and removing duplicate files in file list before starting upload
        this.filesRejectedForUpload = rejectedFiles.length || files.length ? [...this.filesRejectedForUpload, ...rejectedFiles] : [];
        if(this.filesToUpload.length > 5) this.hideUploadProgress = true;
    }

    @action processFilesToUploadDepthFirst(files, parentId, parentKind, projectId) {
        this.loading = true;
        let fileList = files.map((file) => { return {path: file.fullPath, filename: file.name , file: file} });
        const hierarchy = {}; // {folder_name} = { name: <name of folder>, children: {...just like hierarchy...}, files: [] }
        // build tree
        fileList.map(file => {
            const paths = file.path.split('/').slice(0, -1);
            let parentFolder = null;
            // builds the hierarchy of folders.
            paths.map(path => {
                if (!parentFolder) {
                    if (!hierarchy[path]) {
                        hierarchy[path] = {
                            name: path,
                            children: {},
                            files: [],
                        };
                    }
                    parentFolder = hierarchy[path]
                } else {
                    if (!parentFolder.children[path]) {
                        parentFolder.children[path] = {
                            name: path,
                            children: {},
                            files: [],
                        };
                    }
                    parentFolder = parentFolder.children[path];
                }
            });
            parentFolder.files.push(file);
        });

        Object.keys(hierarchy).map(folderName => this.uploadFilesDepthFirst(parentId, parentKind, hierarchy[folderName], projectId));
    }

    @action uploadFilesDepthFirst(parentId, parentKind, folderInfo, projectId) {
        this.transportLayer.addFolder(parentId, parentKind, folderInfo.name)
            .then()
            .then(response => response.json())
            .then((ddsFolder) => {
                Object.keys(folderInfo.children).forEach(childFolderName => this.uploadFilesDepthFirst(ddsFolder.id, ddsFolder.kind, folderInfo.children[childFolderName], projectId));
                folderInfo.files.map(file => {
                    this.startUpload(projectId, file.file, ddsFolder.id, ddsFolder.kind, null, null, this.tagsToAdd);
                });
            }).catch((ex) => {
            this.addToast('Failed to add a new folder');
            this.handleErrors(ex)
        })
    }

    @action removeFileFromUploadList(index) {
        this.filesToUpload.splice(index, 1);
    }

    @action defineTagsToAdd(tags) {
        this.tagsToAdd = tags;
    }

    @action getTagAutoCompleteList(text) {
        let query = text === null ? '' : '&label_contains=' + text;
        this.transportLayer.getTagAutoCompleteList(query)
            .then(this.checkResponse)
            .then(response => response.json())
            .then(json => this.tagAutoCompleteList = json.results.map((item) => {return item.label}))
            .catch(ex => this.handleErrors(ex))
    }

    @action getTagLabels() {
        this.transportLayer.getTagLabels()
            .then(this.checkResponse)
            .then(response => response.json())
            .then(json => this.tagLabels = json.results)
            .catch(ex => this.handleErrors(ex))
    }

    @action getTags(id, kind) {
        this.transportLayer.getTags(id, kind)
            .then(this.checkResponse)
            .then(response => response.json())
            .then(json => this.objectTags = json.results)
            .catch(ex => this.handleErrors(ex))
    }

    @action addNewTag(id, kind, tag) {
        this.transportLayer.addNewTag(id, kind, tag)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('Added ' + json.label + ' tag');
                this.objectTags.push(json);
            }).catch((ex) => {
            this.addToast('Failed to add new tag');
            this.handleErrors(ex)
        })
    }

    @action appendTags(id, kind, tags) {
        let msg = tags.map((tag)=> {
            return tag.label
        });
        this.loading = true;
        this.transportLayer.appendTags(id, kind, tags)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('Added ' + msg + ' as tags to all selected resources.');
                this.objectTags = [...this.objectTags, ...json.results];
                this.loading = false;
            }).catch((ex) => {
            this.addToast('Failed to add tags');
            this.handleErrors(ex)
        })
    }

    @action deleteTag(id, label) {
        this.transportLayer.deleteTag(id)
            .then(this.checkResponse)
            .then(response => {})
            .then(() => {
                this.addToast(label + ' tag deleted!');
                this.objectTags = this.objectTags.filter(t => t.id !== id);
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
            BYTES_PER_CHUNK, SIZE, start, end;
        SIZE = blob.size;
        BYTES_PER_CHUNK = ChunkSize.BYTES_PER_CHUNK;
        start = 0;
        end = BYTES_PER_CHUNK;

        const retryArgs = [projId, blob, parentId, parentKind, label, fileId, tags];
        const fileReader = new FileReader();

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
            mainStore.transportLayer.startUpload(projId, fileName, contentType, SIZE)
                .then(checkStatusAndConsistency)
                .then(response => response.json())
                .then((json) => {
                    if(!json.error) {
                        this.loading = false;
                        let uploadObj = json;
                        if (!uploadObj.id && !uploadObj.error) throw "no upload was created";
                        details.uploadId = uploadObj.id;
                        mainStore.uploads.set(uploadObj.id, details);
                        mainStore.totalUploads.inProcess = mainStore.uploads.size;
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
                    } else {
                        if(json.code === 'resource_not_consistent') {
                            this.loading = false;
                            const msg = "The resource you're requesting is temporarily unavailable...";
                            mainStore.tryAsyncAgain(mainStore.startUpload, retryArgs, 5000, fileId, msg, false)
                        } else {
                            mainStore.handleErrors(json);
                        }
                    }
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

    @action hashFile(file, id) {
        if (file.blob.size <= 5000000) {
            function calculateMd5(blob, id) {
                const md5 = new SparkMD5.ArrayBuffer();
                const reader = new FileReader();
                reader.readAsArrayBuffer(blob);
                reader.onloadend = function () {
                    md5.append(reader.result);
                    const hash = md5.end();
                    mainStore.fileHashes.push({id: id, hash: hash});
                };
            }
            calculateMd5(file.blob, id);
        } else {
            const hashWorker = new Worker('lib/fileHashingWorker.js');
            hashWorker.postMessage(file);
            hashWorker.onmessage = (e) => {
                if(e.data.complete) {
                    mainStore.fileHashes.push({id: e.data.id, hash: e.data.hash});
                }
                if(e.data.error) {
                    console.log(e.msg);
                    mainStore.uploadError(file.uploadId)
                }
            };
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
                        this.uploadError(uploadId);
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
                this.getChunkUrl(uploadId, upload.blob.slice(chunk.start, chunk.end), chunk);
                return;
            }
            if (chunk.chunkUpdates.status !== StatusEnum.STATUS_SUCCESS) allDone = false;
        }
        if (allDone) this.checkForHash(uploadId, upload.parentId, upload.parentKind, upload.name, upload.label, upload.fileId, upload.projectId);
        window.onbeforeunload = function () { // If done, set to false so no warning is sent.
            this.warnUserBeforeLeavingPage = false;
        };
    }

    @action uploadChunk(uploadId, presignedUrl, chunkBlob, chunkNum, chunkUpdates) {
        window.addEventListener('offline', function () {
            mainStore.uploadError(uploadId)
        });
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = uploadProgress;
        function uploadProgress(e) {
            if (e.lengthComputable) {
                mainStore.updateChunkProgress(uploadId, chunkNum, e.loaded / e.total * (chunkBlob.size));
            }
        }

        xhr.onload = onComplete;
        function onComplete() {
            if (xhr.status >= 200 && xhr.status < 300) {
                chunkUpdates.status = StatusEnum.STATUS_SUCCESS;
            } else {
                chunkUpdates.status = StatusEnum.STATUS_RETRY;
            }
            mainStore.updateAndProcessChunks(uploadId, chunkNum, {status: chunkUpdates.status});
        }

        xhr.onerror = onError;
        function onError() {
            mainStore.uploadError(uploadId)
        }

        xhr.open('PUT', presignedUrl, true);
        xhr.send(chunkBlob);
    }

    getChunkUrl(uploadId, chunkBlob, chunk) {
        const chunkNum = chunk.number;
        const chunkUpdates = chunk.chunkUpdates;
        const md5 = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            md5.append(e.target.result);
            const hash = md5.end();
            const algorithm = 'MD5';
            mainStore.transportLayer.getChunkUrl(uploadId, chunkNum, chunkBlob.size, hash, algorithm)
                .then(this.checkResponse)
                .then(response => response.json())
                .then((json) => {
                    const chunkObj = json;
                    if (chunkObj && chunkObj.url && chunkObj.host) {
                        mainStore.uploadChunk(uploadId, chunkObj.host + chunkObj.url, chunkBlob, chunkNum, chunkUpdates)
                    } else {
                        throw 'Unexpected response';
                    }
                }).catch(ex => mainStore.updateAndProcessChunks(uploadId, chunkNum, {status: StatusEnum.STATUS_RETRY}));
        };
        fileReader.readAsArrayBuffer(chunkBlob);
    }

    allChunksUploaded(uploadId, parentId, parentKind, fileName, label, fileId, hash) {
        let algorithm = 'MD5';
        this.transportLayer.allChunksUploaded(uploadId, hash, algorithm)
            .then(this.checkResponse)
            .then(response => response.json())
            .then(() => {
                if (fileId == null) {
                    this.addFile(uploadId, parentId, parentKind, fileName, label);
                } else {
                    this.addFileVersion(uploadId, label, fileId);
                }
            }).catch(ex => this.uploadError(uploadId))
    }

    @action addFile(uploadId, parentId, parentKind, fileName) {
        this.transportLayer.addFile(uploadId, parentId, parentKind)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast(fileName + ' uploaded successfully');
                this.addFileSuccess(parentId, parentKind, uploadId, json.id)
            }).catch((ex) => {
                this.addToast('Failed to upload ' + fileName + '!');
                this.uploadError(uploadId);
            })
    }

    @action addFileSuccess(parentId, parentKind, uploadId, fileId) {
        if (this.uploads.get(uploadId).tags.length) this.appendTags(fileId, Kind.DDS_FILE, this.uploads.get(uploadId).tags);
        if (this.uploads.size === 1 && !this.isFolderUpload) {
            let path = parentKind === 'dds-project' ? Path.PROJECT : Path.FOLDER;
            this.getChildren(parentId, path);
            this.getChildren(parentId, path);
        } else if (this.uploads.size === 1 && this.isFolderUpload) {
            this.isFolderUpload = false;
            let id = this.currentLocation.id;
            let path = this.currentLocation.path.includes('project') ? Path.PROJECT : Path.FOLDER;
            this.getChildren(id, path);
        }
        if(this.uploads.has(uploadId)) this.uploads.delete(uploadId);
        this.totalUploads.complete++;
        if(this.uploads.size < 1) {
           if(this.hideUploadProgress) this.hideUploadProgress = false;
           this.totalUploads = {inProcess: 0, complete: 0};
        }
    }

    @action addFileVersion(uploadId, label, fileId) {
        this.transportLayer.addFileVersion(uploadId, label, fileId)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('Created New File Version!');
                this.addFileVersionSuccess(fileId, uploadId, json);
            }).catch((ex) => {
                this.addToast('Failed to Create New Version');
                this.uploadError(uploadId);
            });
    }

    @action addFileVersionSuccess(id, uploadId, json) {
        provenanceStore.displayProvAlert();
        if(location.href.includes(id)) this.getEntity(id, Path.FILE);
        this.getFileVersions(id);
        if(this.listItems.some(l => l.id === id)) {
            let index = this.listItems.findIndex(p => p.id === id);
            this.listItems.splice(index, 1, json);
        }
        if (this.uploads.has(uploadId)) this.uploads.delete(uploadId);
    }

    @action getFileVersions(id) {
        this.loading = true;
        this.transportLayer.getFileVersions(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.fileVersions = json.results;
                this.loading = false;
            }).catch(ex => this.handleErrors(ex))
    }

    checkForHash(uploadId, parentId, parentKind, name, label, fileId, projectId) {
        const hash = mainStore.fileHashes.find((fileHash) => {
            return fileHash.id === uploadId;
        });
        if(!hash) {
            const msg = `Waiting for the file ${name} to process, this may take a while...`;
            const isUpload = true;
            const retryArgs = [uploadId, parentId, parentKind, name, label, fileId, projectId];
            mainStore.tryAsyncAgain(mainStore.checkForHash, retryArgs, 90000, uploadId, msg, isUpload)
        } else {
            mainStore.allChunksUploaded(uploadId, parentId, parentKind, name, label, fileId, hash.hash, projectId);
        }
    }

    @action uploadError(uploadId) {
        if (this.uploads.has(uploadId)) {
            const upload = this.uploads.get(uploadId);
            this.failedUploads.push({
                upload: upload,
                fileName: upload.name,
                id: uploadId,
                projectId: upload.projectId
            });
            this.uploads.delete(uploadId);
            this.failedUpload(this.failedUploads);
        }
    }

    @action cancelUpload(uploadId, name) {
        if(this.uploads.has(uploadId)) this.uploads.delete(uploadId);
        this.totalUploads.inProcess = this.uploads.size;
        this.addToast('Canceled upload of '+name);
        if(!this.uploads.size && this.warnUserBeforeLeavingPage) this.warnUserBeforeLeavingPage = false;
        if(!this.uploads.size) { // If user cancels last uploads, make sure that page loads with new list items
            let id = this.currentLocation.id;
            let path = this.currentLocation.path.includes('project') ? Path.PROJECT : Path.FOLDER;
            this.getChildren(id, path);
        }
    }

    @action getDownloadUrl(id, kind) {
        this.loading = true;
        this.transportLayer.getDownloadUrl(id, kind)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                let host = json.host;
                let url = json.url;
                let win = window.open(host + url, '_blank');
                if (win) {
                    win.focus();
                } else { // if browser blocks popups use location.href instead
                    window.location.href = host + url;
                }
                this.loading = false;
            }).catch(ex => this.handleErrors(ex))
    }


    @action getChildren(id, path, page) {
        if(this.listItems.length && page === null) this.listItems = [];
        this.loading = true;
        if (page == null) page = 1;
        this.transportLayer.getChildren(id, path, page)
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
                navigatorStore.addDownloadedItemChildren(results, id);
                this.responseHeaders = headers;
                this.nextPage = headers !== null && !!headers['x-next-page'] ? headers['x-next-page'][0] : null;
                this.totalItems = headers !== null && !!headers['x-total'] ? parseInt(headers['x-total'][0], 10) : null;
                this.loading = false;
            }).catch(ex =>this.handleErrors(ex))
    }

    @action getUser(id) {
        this.transportLayer.getUser()
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.currentUser = json;
                this.getPermissions(id, json.id)
            }).catch(ex => this.handleErrors(ex));
    }

    @action searchFiles(text, id) {
        this.autoCompleteLoading = true;
        this.transportLayer.searchFiles(text, id)
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
        this.transportLayer.loadMetadataTemplates(searchQuery)
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
        this.transportLayer.createMetadataTemplate(name, label, desc)
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
        this.transportLayer.getMetadataTemplateDetails(id)
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
        this.transportLayer.getMetadataTemplateProperties(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.templateProperties = json.results;
                this.drawerLoading = false;
            }).catch(ex => this.handleErrors(ex))
    }

    @action updateMetadataTemplate(id, name, label, desc) {
        this.drawerLoading = true;
        this.transportLayer.updateMetadataTemplate(id, name, label, desc)
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
        this.transportLayer.deleteTemplate(id)
            .then(this.checkResponse)
            .then(response => {})
            .then(() => {
                this.addToast('The ' + label + ' template has been deleted');
                this.toggleMetadataManager();
                this.loadMetadataTemplates('');
            }).catch((ex) => {
            this.addToast('Failed to delete ' + label);
            this.handleErrors(ex)
        });
    }

    @action deleteMetadataProperty(id, label) {
        this.transportLayer.deleteMetadataProperty(id)
            .then(this.checkResponse)
            .then(response => {})
            .then(() => {
                this.addToast('The ' + label + ' property has been deleted');
                this.templateProperties = BaseUtils.removeObjByKey(this.templateProperties.slice(), {key: 'id', value: id});
            }).catch((ex) => {
            this.addToast('Failed to delete ' + label);
            this.handleErrors(ex)
        });
    }

    @action createMetadataObject(kind, id, templateId, properties) {
        this.drawerLoading = true;
        this.transportLayer.createMetadataObject(kind, id, templateId, properties)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('A new metadata object was created.');
                this.createMetadataObjectSuccess(json);
            }).catch((ex) => {
            if (ex.response.status === 409) {
                this.updateMetadataObject(kind, id, templateId, properties);
            } else {
                this.addToast('Failed to add new metadata object');
                this.handleErrors(ex)
            }
        })
    }

    @action updateMetadataObject(kind, id, templateId, properties) {
        this.transportLayer.updateMetadataObject(kind, id, templateId, properties)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.addToast('This metadata object was updated.');
                this.createMetadataObjectSuccess(json);
            }).catch((ex) => {
            this.addToast('Failed to update metadata object');
            this.handleErrors(ex)
        })
    }

    @action createMetadataProperty(id, name, label, desc, type) {
        this.drawerLoading = true;
        this.transportLayer.createMetadataProperty(id, name, label, desc, type)
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

    @action createMetadataObjectSuccess(json) {
        this.drawerLoading = false;
        this.showBatchOps = false;
        this.showTemplateDetails = false;
        this.objectMetadata = this.objectMetadata.filter((o) => o.template.id !== json.template.id);
        this.objectMetadata.push(json);
        this.metaObjProps = this.objectMetadata.map((prop) => {
            return prop.properties.map((prop) => {
                return {
                    key: prop.template_property.key, id: prop.template_property.id, value: prop.value
                }
            })
        });
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

    @action searchObjects(query, filter, projectPostFilter, tagPostFilter, page) {
        let filters;
        if(page !== null) {
            filters = [this.searchFilters, this.searchProjectsPostFilters, this.searchTagsPostFilters]
        } else {
            if (projectPostFilter !== null) {
                if (!this.searchProjectsPostFilters['project.name'].includes(projectPostFilter)) {
                    this.searchProjectsPostFilters['project.name'].push(projectPostFilter)
                } else {
                    this.searchProjectsPostFilters['project.name'] = this.searchProjectsPostFilters['project.name'].filter(f => f !== projectPostFilter);
                }
            }
            if (tagPostFilter !== null) {
                if (!this.searchTagsPostFilters['tags.label'].includes(tagPostFilter)) {
                    this.searchTagsPostFilters['tags.label'].push(tagPostFilter)
                } else {
                    this.searchTagsPostFilters['tags.label'] = this.searchTagsPostFilters['tags.label'].filter(f => f !== tagPostFilter);
                }
            }
            if (filter !== null) {
                this.searchFilters.includes(filter) ? this.searchFilters = this.searchFilters.filter(f => f !== filter) : this.searchFilters.push(filter);
            }
            filters = [this.searchFilters, this.searchProjectsPostFilters, this.searchTagsPostFilters]
        }
        if(page == null) page = 1;
        this.searchValue = query;
        query = encodeURI(query).replace(/#/,"%23");
        this.loading = true;
        this.transportLayer.searchObjects(query, ...filters, page)
            .then(this.checkResponse)
            .then(response => {
                const results = response.json();
                const headers = response.headers;
                return Promise.all([results, headers]);
            }).then((json) => {
                if(page <= 1) {
                    this.searchResults = json[0].results;
                } else {
                    this.searchResults = [...this.searchResults, ...json[0].results];
                }
                this.searchResultsProjects = json[0].aggs.project_names.buckets;
                this.searchResultsTags = json[0].aggs.tags.buckets;
                this.searchResultsFiles =  this.searchResults.filter((obj)=>{
                    return obj.kind === 'dds-file';
                });
                this.searchResultsFolders =  this.searchResults.filter((obj)=>{
                    return obj.kind === 'dds-folder';
                });
                this.responseHeaders = json[1].map;
                this.nextPage = this.responseHeaders !== null && !!this.responseHeaders['x-next-page'] ? this.responseHeaders['x-next-page'][0] : null;
                this.totalItems = this.responseHeaders !== null && !!this.responseHeaders['x-total'] ? parseInt(this.responseHeaders['x-total'][0], 10) : null;
                this.loading = false;
            }).catch(ex =>this.handleErrors(ex))
    }

    @action toggleSearch() {
        this.showSearch = !this.showSearch;
    }

    @action toggleSearchFilters() {
        this.showFilters = !this.showFilters;
    }

    @action resetSearchFilters() {
        this.searchFilters = [];
        this.searchProjectsPostFilters = {"project.name": []};
        this.searchTagsPostFilters = {"tags.label": []};
    }

    @action resetSearchResults() {
        this.searchResults = [];
        this.searchResultsProjects = [];
        this.searchResultsTags = [];
        this.searchResultsFiles = [];
        this.searchResultsFolders = [];
        this.searchValue = null;
        this.responseHeaders = {};
        this.nextPage = null;
        this.totalItems = null;
    }

    @action clearSearchFilesData() {
        this.searchFilesList = [];
    }

    @action toggleModals(id) {
        this.toggleModal.open = !this.toggleModal.open;
        this.toggleModal.id = id;
    }

    @action displayErrorModals(error) {
        if (error.message === 'A requested file or directory could not be found at the time an operation was processed.' && error.code === 8) {
            this.errorModals.push({
                msg: 'This feature is not yet supported. Please compress the folder into a zip file if you would like to upload it.',
                response: 'Folders can not be uploaded through the web portal.',
                ref: 'modal' + Math.floor(Math.random() * 10000)
            });
        } else {
            this.errorModals.push({
                msg: error.response.status === 403 ? error.message + ': You don\'t have permissions to view or change' +
                    ' this resource' : error.message,
                response: error.response.status,
                ref: 'modal' + Math.floor(Math.random() * 10000)
            });
        }
    }

    @action getDeviceType(device) {
        this.device = device;
        this.isSafari = UAParser().browser.name === 'Safari';
        this.isFirefox = UAParser().browser.name === 'Firefox';
    }

    @action getScreenSize(height, width) {
        this.screenSize.height = height;
        this.screenSize.width = width;
    }

    @action handleErrors(error) {
        this.loading = false;
        this.drawerLoading = false;
        provenanceStore.toggleGraphLoading();
        if (error && error.response && error.response.status) {
            if (error.response.status === 401) {
                window.location.href = window.location.protocol + '//' + window.location.host + '/#/login';
            } else if (error.response.status === 404 && error.response.statusText !== '' && authStore.appConfig.apiToken) {
                window.location.href = window.location.protocol + '//' + window.location.host + '/#/404';
                console.log(error.response);
            } else {
                this.displayErrorModals(error);
            }
        } else if (error.code === 8) { // Handles error thrown from trying to read folder as a file
            this.displayErrorModals(error);
        } else if (error && error.error && error.error === '404') {
            window.location.href = window.location.protocol + '//' + window.location.host + '/#/404';
        }
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
        let expiresAt = new Date(Date.now() + (9 * 24 * 60 * 60 * 10000));
        this.phiModalOpen = false;
        cookie.save('phiModalOpen', this.phiModalOpen, {expires: expiresAt});
    }

    @action serviceWarningModal(dontShow) {
        let time = !dontShow ? 72 * 100 * 1000 : 18 * 24 * 60 * 60 * 10000;
        let expiresAt = new Date(Date.now() + (time));
        this.serviceOutageNoticeModalOpen = false;
        cookie.save('serviceOutageNoticeModalOpen', this.serviceOutageNoticeModalOpen, {expires: expiresAt});
    }

    @action failedUpload(failedUploads) {
        this.failedUploads = failedUploads;
    }

    @action removeFailedUploads() {
        this.failedUploads = [];
    }

    @action removeErrorModal(refId) {
        for (let i = 0; i < this.errorModals.length; i++) {
            if (this.errorModals[i].ref === refId) {
                this.errorModals.splice(i, 1);
                break;
            }
        }
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