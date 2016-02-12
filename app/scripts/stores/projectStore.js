import Reflux from 'reflux';
import ProjectActions from '../actions/projectActions';
import MainActions from '../actions/mainActions';
import StatusEnum from '../enum.js';

var ProjectStore = Reflux.createStore({

    init() {
        this.listenToMany(ProjectActions);
        this.audit = {};
        this.children = [];
        this.currentUser = {};
        this.projects = [];
        this.project = {};
        this.entityObj = {};
        this.projectMembers = [];
        this.users = [];
        this.uploadCount = [];
        this.uploads = {};
        this.filesChecked = [];
        this.foldersChecked = [];
        this.showBatchOps = false;
    },

    showBatchOptions () {
        this.showBatchOps = false;
        this.trigger({
            showBatchOps: this.showBatchOps
        })
    },

    batchDelete (files, folders) {
        this.filesChecked = files;
        this.foldersChecked = folders;
        this.showBatchOps = true;
        this.trigger({
            filesChecked: this.filesChecked,
            foldersChecked: this.foldersChecked,
            showBatchOps: this.showBatchOps
        })
    },

    getUserSuccess (json) {
        this.currentUser = json;
        this.trigger({
            currentUser: this.currentUser
        });
    },

    getUserError (error) {
        let msg = error && error.message ? error.message : 'An error occurred.';
        this.trigger({
            error: msg
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

    loadProjectsError(error) {
        let msg = error && error.message ? "Error: " : +'An error occurred while loading projects.';
        this.trigger({
            error: msg,
            loading: false
        })
    },

    loadProjectChildren() {
        this.trigger({
            loading: true
        })
    },

    loadProjectChildrenSuccess(results) {
        this.children = results;
        this.trigger({
            children: this.children,
            loading: false
        })
    },

    loadProjectChildrenError(error) {
        let msg = error && error.message ? "Error: " : +'An error occurred while loading projects.';
        this.trigger({
            error: msg,
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

    showDetailsError(error) {
        let msg = error && error.message ? "Error: " + error : '';
        this.trigger({
            error: msg,
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

    addProjectError(error) {
        let msg = error && error.message ? "Error: " + error : '';
        this.trigger({
            error: msg,
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
        this.trigger({
            loading: false
        })
    },

    deleteProjectError(error) {
        let msg = error && error.message ? "Error: " + error : '';
        this.trigger({
            error: msg,
            loading: false
        });
    },

    editProject(id) {
        ProjectActions.showDetails(id);
        this.trigger({
            loading: true
        })
    },

    editProjectSuccess() {
        ProjectActions.loadProjects();
        this.trigger({
            loading: false
        })
    },

    editProjectError(error) {
        let msg = error && error.message ? "Error: " + error : '';
        this.trigger({
            error: msg,
            loading: false
        });
    },

    loadFolderChildren() {
        this.trigger({
            loading: true
        })
    },

    loadFolderChildrenSuccess(results) {
        this.children = results;
        this.trigger({
            children: this.children,
            loading: false
        })
    },

    loadFolderChildrenError(error) {
        let msg = error && error.message ? "Error: " + error : '';
        this.trigger({
            error: msg,
            loading: false
        })
    },

    addFolder() {
        this.trigger({
            loading: true
        })
    },

    addFolderSuccess(id, parentKind) { //todo: remove this and check for new children state in folder.jsx & project.jsx
        if (parentKind === 'dds-project') {
            ProjectActions.loadProjectChildren(id);
        } else {
            ProjectActions.loadFolderChildren(id);
        }
        this.trigger({
            loading: false
        })
    },

    addFolderError(error) {
        let msg = error && error.message ? "Error: " + error : '';
        this.trigger({
            error: msg,
            loading: false
        });
    },

    deleteFolder() {
        this.trigger({
            loading: true
        })
    },

    deleteFolderSuccess(id, parentKind) {
        if (parentKind === 'dds-project') {
            ProjectActions.loadProjectChildren(id);
        } else {
            ProjectActions.loadFolderChildren(id);
        }
        this.showBatchOps = false;
        this.trigger({
            loading: false,
            showBatchOps: this.showBatchOps
        })
    },

    deleteFolderError(error) {
        let errMsg = error && error.message ? 'Error: ' + error : '';
        this.trigger({
            error: errMsg,
            loading: false
        });
    },

    editFolder() {
        this.trigger({
            loading: true
        })
    },

    editFolderSuccess(id) {
        let kind = 'folders/';
        ProjectActions.loadFolderChildren(id);
        ProjectActions.getEntity(id, kind);
        this.trigger({
            loading: false
        })
    },

    editFolderError(error) {
        let msg = error && error.message ? "Error: " : +'An error occurred while trying to edit this project.';
        this.trigger({
            error: msg,
            loading: false
        });
    },

    addFile() {
        this.trigger({
            loading: true
        })
    },

    addFileSuccess(id, parentKind, uploadId) {
        if (parentKind === 'dds-project') {
            ProjectActions.loadProjectChildren(id);
        } else {
            ProjectActions.loadFolderChildren(id);
        }
        if (this.uploads.hasOwnProperty(uploadId)) {
            delete this.uploads[uploadId];
        }
        this.trigger({
            uploads: this.uploads
        })
    },

    addFileError(error) {
        let msg = error && error.message ? "Error: " + error : '';
        this.trigger({
            error: msg,
            loading: false
        });
    },

    deleteFile() {
        this.trigger({
            loading: true
        })
    },

    deleteFileSuccess(id, parentKind) {
        if (parentKind === 'dds-project') {
            ProjectActions.loadProjectChildren(id);
        } else {
            ProjectActions.loadFolderChildren(id);
        }
        this.showBatchOps = false;
        this.trigger({
            loading: false,
            showBatchOps: this.showBatchOps
        })
    },

    deleteFileError(error) {
        let errMsg = error && error.message ? "Error: " : +'An error occurred while trying to delete this file.';
        this.trigger({
            error: errMsg,
            loading: false
        });
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

    editFileError(error) {
        let errMsg = error && error.message ? "Error: " + error : '';
        this.trigger({
            error: errMsg,
            loading: false
        });
    },


    getEntity() {
        this.trigger({
            loading: true
        })
    },

    getEntitySuccess(json) {
        this.entityObj = json;
        this.trigger({
            entityObj: this.entityObj,
            loading: false
        })
    },

    getEntityError(error) {
        let errMsg = error && error.message ? "Error: " + error : '';
        this.trigger({
            error: errMsg,
            loading: false
        });
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

    getProjectMembersError(error) {
        let errMsg = error && error.message ? "Error: " : +'An error occurred while trying to delete this file.';
        this.trigger({
            error: errMsg,
            loading: false
        });
    },

    getUserNameSuccess(results) {
        this.users = results.map(function(users) {return users.full_name});
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

    getUserIdError(error) {
        let errMsg = error && error.message ? "Error: " : +'An error occurred while trying to delete this file.';
        this.trigger({
            error: errMsg,
            loading: false
        });
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

    addProjectMemberError(error) {
        let errMsg = error && error.message ? alert('This member could not be added. Check the name and try again or verify they have access to the Duke Data Service application') : '';
        this.trigger({
            error: errMsg,
            loading: false
        });
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

    deleteProjectMemberError(error) {
        let errMsg = error && error.message ? "Error: " + error : '';
        this.trigger({
            error: errMsg,
            loading: false
        });
    },

    getDownloadUrl() {
        this.trigger({
            loading: true
        })
    },

    getDownloadUrlSuccess(json) {
        let host = json.host;
        let url = json.url;
        var win = window.open(host + url, '_blank');
        if (win) {
            win.focus();
        } else {
            alert('Please allow popups for this site and try downloading again');
        }
        this.trigger({
            loading: false
        })
    },

    getDownloadUrlError(error) {
        let msg = error && error.message ? "Error: " : +'An error occurred while loading projects.';
        this.trigger({
            error: msg,
            loading: false
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

    getUsageDetailsError(error) {
        let errMsg = error && error.message ? "Error: " + error : '';
        this.trigger({
            error: errMsg,
            loading: false
        });
    },

    startUpload() {
        this.trigger({
            uploading: true
        })
    },

    startUploadSuccess(uploadId, details) {
        this.uploads[uploadId] = details;
        ProjectActions.updateAndProcessChunks(uploadId, null, null);
        this.trigger({
            uploads: this.uploads,
        })
    },

    startUploadError(error) {
        let errMsg = error && error.message ? "Error: " + error : '';
        this.trigger({
            error: errMsg,
            uploading: false
        });
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
        let allDone = null;
        for (let i = 0; i < chunks.length; i++) {
            let chunk = chunks[i];
            if (chunk.chunkUpdates.status === StatusEnum.STATUS_WAITING_FOR_UPLOAD || chunk.chunkUpdates.status === StatusEnum.STATUS_RETRY) {
                chunk.chunkUpdates.status = StatusEnum.STATUS_UPLOADING;
                ProjectActions.getChunkUrl(uploadId, upload.blob.slice(chunk.start, chunk.end), chunk.number, upload.size, upload.parentId, upload.parentKind, upload.name, chunk.chunkUpdates);
                return;
            }
            allDone = chunk.chunkUpdates.status !== StatusEnum.STATUS_UPLOADING ? true : false;
        }
        if (allDone === true)ProjectActions.allChunksUploaded(uploadId, upload.parentId, upload.parentKind, upload.name);
    },

    uploadError(uploadId, fileName) {
        MainActions.addToast('Failed to upload ' + fileName + '!  Please try again.');
        if (this.uploads.hasOwnProperty(uploadId)) {
            delete this.uploads[uploadId];
        }
        this.trigger({
            uploads: this.uploads
        })
    }
});

export default ProjectStore;