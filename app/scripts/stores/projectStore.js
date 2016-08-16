import Reflux from 'reflux';
import ProjectActions from '../actions/projectActions';
import MainActions from '../actions/mainActions';
import { StatusEnum, Path } from '../enum';

var ProjectStore = Reflux.createStore({

    init() {
        this.listenToMany(ProjectActions);
        this.agents = [];
        this.agentKey = {};
        this.agentApiToken = {};
        this.audit = {};
        this.children = [];
        this.currentUser = {};
        this.destination = null;
        this.destinationKind = null;
        this.device = {};
        this.entityObj = null;
        this.error = {};
        this.errorModal = false;
        this.filesChecked = [];
        this.fileHashes = [];
        this.foldersChecked = [];
        this.fileVersions = [];
        this.itemsSelected = null;
        this.modal = false;
        this.moveModal = false;
        this.moveToObj = {};
        this.moveErrorModal = false;
        this.objectTags = [];
        this.openTagManager = false;
        this.openUploadManager = false;
        this.parent = {};
        this.projects = [];
        this.project = {};
        this.projPermissions = null;
        this.projectMembers = [];
        this.screenSize = {};
        this.searchText = '';
        this.showBatchOps = false;
        this.tagLabels = [];
        this.uploadCount = [];
        this.uploads = {};
        this.users = [];
        this.userKey = {};
        this.versionModal = false;
    },

    getScreenSize(height, width) {
        this.screenSize.height = height;
        this.screenSize.width = width;
        this.trigger({
            screenSize: this.screenSize
        })
    },

    toggleUploadManager() {
        this.openUploadManager = !this.openUploadManager;
        this.trigger({
            openUploadManager: this.openUploadManager
        })
    },

    toggleTagManager() {
        this.openTagManager = !this.openTagManager;
        this.trigger({
            openTagManager: this.openTagManager
        })
    },

    addNewTagSuccess(fileId) {
        ProjectActions.getTags(fileId, 'dds-file');
    },

    appendTagsSuccess(fileId) {
        ProjectActions.getTags(fileId, 'dds-file');
        this.showBatchOps = false;
        this.trigger({
            showBatchOps: this.showBatchOps
        })
    },

    deleteTagSuccess(fileId) {
        ProjectActions.getTags(fileId, 'dds-file');
    },

    getTagAutoCompleteListSuccess(list) {
        this.tagAutoCompleteList = list.map((item) => {return item.label});
        this.trigger({
            tagAutoCompleteList: this.tagAutoCompleteList
        })
    },

    getTagLabelsSuccess(labels) {
        this.tagLabels = labels;
        this.trigger({
            tagLabels: this.tagLabels
        })
    },

    getTagsSuccess(tags) {
        this.objectTags = tags;
        this.trigger({
            objectTags: this.objectTags
        })
    },

    getDeviceType(device) {
        this.device = device;
        this.trigger({
            device: this.device
        })
    },

    setSearchText(text) {
        if(!text.indexOf(' ') <= 0) this.searchText = text;
            this.trigger({
            searchText: this.searchText,
            itemsSelected: null,
            showBatchOps: false
        })
    },

    search() {
        this.trigger({
            loading: true
        })
    },

    getFileVersions() {
        this.trigger({
            loading: true
        })
    },

    getFileVersionsSuccess(results) {
        this.fileVersions = results;
        this.trigger({
            fileVersions: this.fileVersions,
            loading: false
        })
    },

    addFileVersionSuccess(id, uploadId) {
        let kind = 'files/';
        ProjectActions.getEntity(id, kind);
        ProjectActions.getFileVersions(id);
        if (this.uploads.hasOwnProperty(uploadId)) {
            delete this.uploads[uploadId];
        }
        this.trigger({
            uploads: this.uploads
        })
    },

    deleteVersion() {
        this.trigger({
            loading: true
        })
    },

    deleteVersionSuccess() {
        this.trigger({
            loading: false
        })
    },

    editVersion() {
        this.trigger({
            loading: true
        })
    },

    editVersionSuccess(id) {
        let kind = 'file_versions';
        ProjectActions.getEntity(id, kind);
        this.trigger({
            loading: false
        })
    },

    openModal() {
        this.modal = true;
        this.trigger({
            modal: true
        })
    },

    closeModal() {
        this.modal = false;
        this.trigger({
            modal: false
        })
    },

    openVersionModal() {
        this.versionModal = true;
        this.trigger({
            versionModal: true
        })
    },

    closeVersionModal() {
        this.versionModal = false;
        this.trigger({
            versionModal: false
        })
    },

    loadAgents () {
        this.trigger({
            loading: true
        })
    },

    loadAgentsSuccess (results) {
        this.agents = results;
        this.trigger({
            agents: this.agents,
            loading: false
        })
    },

    addAgent () {
        this.trigger({
            loading: true
        })
    },

    addAgentSuccess () {
        ProjectActions.loadAgents();
        this.trigger({
            loading: false
        })
    },

    editAgent(id) {
        this.trigger({
            loading: true
        })
    },

    editAgentSuccess(id) {
        let kind = 'software_agents';
        ProjectActions.getEntity(id, kind);
        this.trigger({
            loading: false
        })
    },

    deleteAgent() {
        this.trigger({
            loading: true
        })
    },

    deleteAgentSuccess() {
        ProjectActions.loadAgents();
        this.trigger({
            loading: false
        })
    },

    createAgentKey() {
        this.trigger({
            loading: true
        })
    },

    createAgentKeySuccess(json) {
        this.agentKey = json;
        this.trigger({
            agentKey: this.agentKey,
            loading: false
        })
    },

    getAgentKey() {
        this.trigger({
            loading: true
        })
    },

    getAgentKeySuccess(json) {
        this.agentKey = json;
        this.trigger({
            agentKey: this.agentKey,
            loading: false
        })
    },

    getAgentApiToken() {
        this.trigger({
            loading: true
        })
    },

    getAgentApiTokenSuccess(json) {
        this.agentApiToken = json;
        ProjectActions.openModal();
        this.trigger({
            agentApiToken: this.agentApiToken,
            loading: false
        })

    },

    clearApiToken() {
        this.agentApiToken = {};
        this.trigger({
            agentApiToken: this.agentApiToken
        })
    },

    openMoveModal (open) {
        this.moveModal = open;
        this.trigger({
            moveModal: this.moveModal
        })
    },

    selectMoveLocation (id,kind){
        this.destination = id;
        this.destinationKind = kind;
        this.trigger({
            destination: this.destination,
            destinationKind: this.destinationKind
        })
    },

    moveItemWarning (error) {
        this.moveErrorModal = error;
        this.trigger({
            moveErrorModal: this.moveErrorModal
        })
    },

    showBatchOptions () {
        this.showBatchOps = false;
        this.trigger({
            showBatchOps: this.showBatchOps
        })
    },

    handleBatch (files, folders) {
        this.filesChecked = files;
        this.foldersChecked = folders;
        this.itemsSelected = files.length + folders.length;
        this.showBatchOps = true;
        this.trigger({
            filesChecked: this.filesChecked,
            foldersChecked: this.foldersChecked,
            itemsSelected: this.itemsSelected,
            showBatchOps: this.showBatchOps
        })
    },

    clearSelectedItems() {
        this.filesChecked = [];
        this.foldersChecked = [];
        this.trigger({
            filesChecked: this.filesChecked,
            foldersChecked: this.foldersChecked
        })
    },

    closeErrorModal(){
        this.errorModal = false;
        this.trigger({
            errorModal: this.errorModal
        });
    },

    handleErrors (error) {
        this.errorModal = error && error.response.status === 403 ? true : false;
        let err = error && error.message ? {msg: error.message, response: error.response.status} : null;
        this.trigger({
            error: err,
            errorModal: this.errorModal,
            loading: false
        })
    },

    getUserSuccess (json, id) {
        this.currentUser = json;
        ProjectActions.getPermissions(id, json.id);
        this.trigger({
            currentUser: this.currentUser
        });
    },

    getPermissionsSuccess (json) {
        let id = json.auth_role.id;
        if(id === 'project_viewer') this.projPermissions = 'viewOnly';
        if(id === 'project_admin' || id === 'system_admin') this.projPermissions = 'prjCrud';
        if(id === 'file_editor') this.projPermissions = 'flCrud';
        if(id === 'file_uploader') this.projPermissions = 'flUpload';
        if(id === 'file_downloader') this.projPermissions = 'flDownload';
        this.trigger({
            projPermissions: this.projPermissions
        });
    },

    getUserKeySuccess (json) {
        this.userKey = json;
        this.trigger({
            userKey: this.userKey
        });
    },

    createUserKeySuccess (json) {
        this.userKey = json;
        this.trigger({
            userKey: this.userKey
        });
    },

    deleteUserKeySuccess () {
        this.userKey = {};
        this.trigger({
            userKey: this.userKey
        });
    },

    loadProjects() {
        this.trigger({
            loading: true
        })
    },

    loadProjectsSuccess(results) {
        this.projects = results;
        this.trigger({
            projects: this.projects,
            loading: false
        })
    },

    showDetails() {
        this.trigger({
            loading: true
        })
    },

    showDetailsSuccess(json) {
        this.project = json;
        this.trigger({
            project: this.project,
            loading: false
        })
    },

    addProject() {
        this.trigger({
            loading: true
        })
    },

    addProjectSuccess() {
        ProjectActions.loadProjects();
        this.trigger({
            loading: false
        })
    },

    deleteProject() {
        this.trigger({
            loading: true
        })
    },

    deleteProjectSuccess() {
        ProjectActions.loadProjects();
        ProjectActions.getUsageDetails();
        this.trigger({
            loading: false
        })
    },

    editProject(id) {
        this.trigger({
            loading: true
        })
    },

    editProjectSuccess(id) {
        ProjectActions.showDetails(id);
        this.trigger({
            loading: false
        })
    },

    getChildren() {
        this.trigger({
            loading: true
        })
    },

    getChildrenSuccess(results) {
        this.children = results;
        this.trigger({
            children: this.children,
            loading: false
        })
    },

    addFolder() {
        this.trigger({
            loading: true
        })
    },

    addFolderSuccess(id, parentKind) {
        if (parentKind === 'dds-project') {
            ProjectActions.getChildren(id, 'projects/');
        } else {
            ProjectActions.getChildren(id, 'folders/');
        }
        this.trigger({
            loading: false
        })
    },

    deleteFolder() {
        this.trigger({
            loading: true
        })
    },

    deleteFolderSuccess(id, parentKind) {
        if (parentKind === 'dds-project') {
            ProjectActions.getChildren(id, 'projects/');
        } else {
            ProjectActions.getChildren(id, 'folders/');
        }
        this.showBatchOps = false;
        this.trigger({
            loading: false,
            showBatchOps: this.showBatchOps
        })
    },

    editFolder() {
        this.trigger({
            loading: true
        })
    },

    editFolderSuccess(id) {
        let kind = 'folders/';
        ProjectActions.getChildren(id, 'folders/');
        ProjectActions.getEntity(id, kind);
        this.trigger({
            loading: false
        })
    },

    moveFolder() {
        this.trigger({
            loading: true
        })
    },

    moveFolderSuccess() {
        this.trigger({
            loading: false
        })
    },

    addFile() {
        this.trigger({
            loading: true
        })
    },

    addFileSuccess(parentId, parentKind, uploadId, fileId) {
        if (this.uploads[uploadId].tags.length) {
            ProjectActions.appendTags(fileId, 'dds-file', this.uploads[uploadId].tags);
        }
        if(Object.keys(this.uploads).length === 1) {
            if (parentKind === 'dds-project') {
                ProjectActions.getChildren(parentId, 'projects/');
            } else {
                ProjectActions.getChildren(parentId, 'folders/');
            }
        }
        if(this.uploads.hasOwnProperty(uploadId)) {
            delete this.uploads[uploadId];
        }
        this.trigger({
            uploads: this.uploads
        })
    },


    deleteFile() {
        this.trigger({
            loading: true
        })
    },

    deleteFileSuccess(id, parentKind) {
        if (parentKind === 'dds-project') {
            ProjectActions.getChildren(id, 'projects/');
        } else {
            ProjectActions.getChildren(id, 'folders/');
        }
        this.showBatchOps = false;
        this.trigger({
            loading: false,
            showBatchOps: this.showBatchOps
        })
    },

    editFile() {
        this.trigger({
            loading: true
        })
    },

    editFileSuccess(id) {
        let kind = 'files/';
        ProjectActions.getEntity(id, kind);
        this.trigger({
            loading: false
        })
    },

    moveFile() {
        this.trigger({
            loading: true
        })
    },

    moveFileSuccess() {
        this.trigger({
            loading: false
        })
    },

    getEntity() {
        this.trigger({
            loading: true
        })
    },

    getEntitySuccess(json, requester) {
        if(requester === undefined) this.entityObj = json;
        if(requester === 'optionsMenu') {
            this.parent = json.parent;
            this.moveToObj = json;
        }
        if(requester === 'moveItemModal') {
            this.moveToObj = json;
        }
        this.trigger({
            entityObj: this.entityObj,
            moveToObj: this.moveToObj,
            parent: this.parent,
            loading: false
        })
    },


    getProjectMembers() {
        this.trigger({
            loading: true
        })
    },

    getProjectMembersSuccess(results) {
        this.projectMembers = results;
        this.trigger({
            projectMembers: this.projectMembers,
            loading: false
        })
    },

    getUserNameSuccess(results) {
        this.users = results.map((users) => {return users.full_name});
        this.trigger({
            users: this.users
        });
    },

    getUserId() {
        this.trigger({
            loading: true
        })
    },

    getUserIdSuccess(results, id, role) {
        let userInfo = results.map((result) => {
            return result.id
        });
        let getName = results.map((result) => {
            return result.full_name
        });
        let userId = userInfo.toString();
        let name = getName.toString();
        ProjectActions.addProjectMember(id, userId, role, name);
        this.trigger({
            loading: false
        })
    },

    addProjectMember() {
        this.trigger({
            loading: true
        })
    },

    addProjectMemberSuccess(id) {
        ProjectActions.getProjectMembers(id);
        this.trigger({
            loading: false
        })
    },

    deleteProjectMember() {
        this.trigger({
            loading: true
        })
    },

    deleteProjectMemberSuccess(id) {
        ProjectActions.getProjectMembers(id);
        this.trigger({
            loading: false
        })
    },

    getDownloadUrl() {
        this.trigger({
            loading: true
        })
    },

    getDownloadUrlSuccess(json) {
        if(this.itemsSelected) this.itemsSelected = this.itemsSelected -1;
        !this.itemsSelected || !this.itemsSelected.length ? this.showBatchOps = false : this.showBatchOps;
        let host = json.host;
        let url = json.url;
        var win = window.open(host + url, '_blank');
        if (win) {
            win.focus();
        } else { // if browser blocks popups use location.href instead
            window.location.href = host + url;
        }
        this.trigger({
            loading: false,
            itemsSelected: this.itemsSelected,
            showBatchOps: this.showBatchOps
        })
    },

    getUsageDetails() {
        this.trigger({
            loading: true
        })
    },

    getUsageDetailsSuccess(json) {
        this.usage = json;
        this.trigger({
            usage: this.usage,
            loading: false
        })
    },

    startUpload() {
        this.trigger({
            uploading: true
        })
    },

    startUploadSuccess(uploadId, details) {
        this.uploads[uploadId] = details;
        ProjectActions.hashFile(this.uploads[uploadId], uploadId);
        ProjectActions.updateAndProcessChunks(uploadId, null, null);
        window.onbeforeunload = function (e) {// If uploading files and user navigates away from page, send them warning
            let preventLeave = true;
            if(preventLeave){
                return "If you refresh the page or close your browser, files being uploaded will be lost and you" +
                    " will have to start again. Are" +
                    " you sure you want to do this?";
            }
        };
        this.trigger({
            uploads: this.uploads
        })
    },

    updateChunkProgress(uploadId, chunkNum, progress) {
        if (!uploadId && !this.uploads[uploadId]) {
            return;
        }
        let upload = this.uploads[uploadId];
        let chunks = this.uploads[uploadId] ? this.uploads[uploadId].chunks : '';
        if (chunkNum !== null) {
            for (let i = 0; i < chunks.length; i++) {
                // find chunk to update
                if (chunks[i].number === chunkNum) {
                    // update progress of chunk in bytes
                    if(progress) chunks[i].chunkUpdates.progress = progress;
                    break;
                }
            }
        }
        // calculate % uploaded
        let bytesUploaded = 0;
        if(chunks) {
            chunks.map(chunk => bytesUploaded += chunk.chunkUpdates.progress);
            upload.uploadProgress = upload.size > 0 ? (bytesUploaded/upload.size)*100 : 0;
        }

        this.trigger({
            uploads: this.uploads
        });
    },

    updateAndProcessChunks(uploadId, chunkNum, chunkUpdates) {
        if (!uploadId && !this.uploads[uploadId]) {
            return;
        }
        let upload = this.uploads[uploadId];
        let chunks = this.uploads[uploadId] ? this.uploads[uploadId].chunks : '';
        if (chunkNum !== null) {
            for (let i = 0; i < chunks.length; i++) {
                // find chunk to update
                if (chunks[i].number === chunkNum) {
                    //update status
                    if(chunkUpdates.status !== undefined) chunks[i].chunkUpdates.status = chunkUpdates.status;
                    if (chunks[i].chunkUpdates.status === StatusEnum.STATUS_RETRY && chunks[i].retry > StatusEnum.MAX_RETRY) {
                        chunks[i].chunkUpdates.status = StatusEnum.STATUS_FAILED;
                        ProjectStore.uploadError(uploadId, chunks[i].name);
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
                ProjectActions.getChunkUrl(uploadId, upload.blob.slice(chunk.start, chunk.end), chunk.number, upload.size, upload.parentId, upload.parentKind, upload.name, chunk.chunkUpdates);
                return;
            }
            if(chunk.chunkUpdates.status !== StatusEnum.STATUS_SUCCESS) allDone = false;
        }
        if (allDone === true)ProjectActions.checkForHash(uploadId, upload.parentId, upload.parentKind, upload.name, upload.label, upload.fileId);
        window.onbeforeunload = function (e) { // If done, set to false so no warning is sent.
            let preventLeave = false;
        };
    },

    uploadError(uploadId, fileName) {
        MainActions.addToast('Failed to upload ' + fileName + '!  Please try again.');
        if (this.uploads.hasOwnProperty(uploadId)) {
            delete this.uploads[uploadId];
        }
        this.trigger({
            uploads: this.uploads
        })
    },

    checkForHash(uploadId, parentId, parentKind, name, label, fileId) {
        let hash = this.fileHashes.find((fileHash)=>{
            return fileHash.id === uploadId;
        });
        if(!hash) {
            ProjectActions.updateAndProcessChunks(uploadId, null, null);
        }else{
            ProjectActions.allChunksUploaded(uploadId, parentId, parentKind, name, label, fileId, hash.hash);
        }
    },

    postHash(hash) {
        let fileHashes = this.fileHashes.push(hash);
        this.trigger({
            fileHashes: fileHashes
        })
    }
});

export default ProjectStore;