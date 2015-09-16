import Reflux from 'reflux';
import ProjectListActions from '../actions/projectListActions';

var ProjectStore = Reflux.createStore({

    init() {
        this.projects = [];
        this.listenToMany(ProjectListActions);
    },

    loadProjects() {
        this.trigger({
            loading: true
        });
    },

    loadProjectsSuccess(projects) {
        this.projects = projects;
        this.trigger({
            projects: this.projects,
            loading: false
        });
    },

    loadProjectsError(error) {
        let msg = error && error.message ? "Error: " : + 'An error occurred while loading projects.';
        this.trigger({
            error: msg,
            loading: false
        });
    },

    // Loads folders and files contained inside a project
    // TODO: NEED TO CHANGE THIS TO LOAD FILES & FOLDERS PROPERLY
    // TODO: MOVE TO FOLDER AND FILE STORES?????
    loadProjectContents() {
        this.trigger({
            loading: true
        });
    },
    loadProjectContentsSuccess(folders) {
        this.folders = folders;
        this.trigger({
            folders: this.folders,
            loading: false
        });
    },

    showProjectDetails() {

    },

    addProject() {
        this.trigger({
            addProjectLoading: true
        })
    },

    addProjectSuccess() {
        ProjectListActions.loadProjects();
        this.trigger({
            addProjectLoading: false
        })
    },

    addProjectError() {
        let msg = error && error.message ? "Error: " : + 'An error occurred while trying to add a new project.';
        this.trigger({
            error: msg,
            addProjectLoading: false
        });
    },
    deleteProject() {
        this.trigger({
            loading: true
        });
    },
    deleteProjectSuccess(projects) {
        this.projects = projects;
        this.trigger({
            projects: this.projects,
            loading: false
        });
    },
    deleteProjectError() {
        let msg = error && error.message ? "Error: " : + 'An error occurred while trying to delete this project.';
        this.trigger({
            error: msg,
            loading: false
        });
    }


});

export default ProjectStore;