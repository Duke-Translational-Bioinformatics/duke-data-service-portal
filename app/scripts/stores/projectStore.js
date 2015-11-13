import Reflux from 'reflux';
import ProjectActions from '../actions/projectActions';
import MainActions from '../actions/mainActions';
import cookie from 'react-cookie';

var ProjectStore = Reflux.createStore({

    init() {
        this.listenToMany(ProjectActions);
        this.audit = {};
        this.children = [];
        this.projects = [];
        this.project = {};
        this.parentObj = {};
        this.file = {};
        this.projectMembers = [];
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

    showDetailsSuccess(projectName, createdOn, createdBy, lastUpdatedOn, lastUpdatedBy, audit, json) {
        this.projectName = projectName;
        this.createdOn = createdOn;
        this.createdBy = createdBy;
        this.lastUpdatedOn = lastUpdatedOn;
        this.lastUpdatedBy = lastUpdatedBy;
        this.audit = audit;
        this.project = json;
        this.trigger({
            projectName: this.projectName,
            createdOn: this.createdOn,
            createdBy: this.createdBy,
            lastUpdatedOn: this.lastUpdatedOn,
            lastUpdatedBy: this.lastUpdatedBy,
            audit: this.audit,
            project: this.project,
            loading: false
        })
    },

    showDetailsError(error) {
        let msg = error && error.message ? "Error: " : +'An error occurred.';
        this.trigger({
            error: msg,
            loading: false
        })
    },

    addProject() {
        this.trigger({
            addProjectLoading: true
        })
    },

    addProjectSuccess() {
        ProjectActions.loadProjects();
        this.trigger({
            addProjectLoading: false
        })
    },

    addProjectError(error) {
        let msg = error && error.message ? "Error: " : +'An error occurred while trying to add a new project.';
        this.trigger({
            error: msg,
            addProjectLoading: false
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
        let msg = error && error.message ? "Error: " : +'An error occurred while trying to add a new project.';
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
        let msg = error && error.message ? "Error: " : +'An error occurred while trying to add a new project.';
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
        let msg = error && error.message ? "Error: " : +'An error occurred while loading folders.';
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

    addFolderSuccess(id, parentKind) {
        if(parentKind === 'dds-project'){
            ProjectActions.loadProjectChildren(id);
        } else {
            ProjectActions.loadFolderChildren(id);
        }
        this.trigger({
            loading: false
        })
    },

    addFolderError(error) {
        let msg = error && error.message ? "Error: " : +'An error occurred.';
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

    deleteFolderSuccess(id, parentId, parentKind) {
        if(parentKind === 'dds-folder'){
            ProjectActions.loadFolderChildren(id);
        } else {
            ProjectActions.loadProjectChildren(id);
        }
        this.trigger({
            loading: false
        })
    },

    deleteFolderError(error) {
        let errMsg = error && error.message ? "Error: " : +'An error occurred while trying to delete this project.';
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

    editFolderSuccess() {
        //ProjectActions.loadFolders();
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

    loadFiles() {
        this.trigger({
            loading: true
        })
    },

    loadFilesSuccess(results) {
        this.folderChildren = results;
        this.trigger({
            folderChildren: this.folderChildren,
            loading: false
        })
    },

    loadFilesError(error) {
        let msg = error && error.message ? "Error: " : + 'An error occurred while loading files.';
        this.trigger({
            error: msg,
            loading: false
        })
    },

    deleteFile() {
        this.trigger({
            loading: true
        })
    },

    deleteFileSuccess() {
        ProjectActions.loadFiles();
        this.trigger({
            loading: false
        })
    },

    deleteFileError(error) {
        let errMsg = error && error.message ? "Error: " : + 'An error occurred while trying to delete this file.';
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

    editFileSuccess() {
        ProjectActions.loadFiles();
        this.trigger({
            loading: false
        })
    },
    
    editFileError(error) {
        let errMsg = error && error.message ? "Error: " : + 'An error occurred while trying to delete this file.';
        this.trigger({
            error: errMsg,
            loading: false
        });
    },

    getParent() {
        this.trigger({
            loading: true
        })
    },

    getParentSuccess(parent) {
        this.parentObj = parent;
        this.trigger({
            parentObj: this.parentObj,
            loading: false
        })
    },

    getParentError(error) {
        let errMsg = error && error.message ? "Error: " : + 'An error occurred while trying to delete this file.';
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
        let errMsg = error && error.message ? "Error: " : + 'An error occurred while trying to delete this file.';
        this.trigger({
            error: errMsg,
            loading: false
        });
    },

    getUserId() {
        this.trigger({
            loading: true
        })
    },

    getUserIdSuccess(results, id) {
        let userInfo = results.map((result) => {
            return result.id
        });
        let userId = userInfo.toString();
        console.log(id)
        ProjectActions.addProjectMember(id, userId);
        this.trigger({
            loading: false
        })
    },

    getUserIdError(error) {
        let errMsg = error && error.message ? "Error: " : + 'An error occurred while trying to delete this file.';
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
        let errMsg = error && error.message ? "Error: " : + 'An error occurred while trying to delete this file.';
        this.trigger({
            error: errMsg,
            loading: false
        });
    }





});

export default ProjectStore;