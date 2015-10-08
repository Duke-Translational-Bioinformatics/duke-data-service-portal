import Reflux from 'reflux';
import ProjectListActions from '../actions/projectListActions';
import MainActions from '../actions/mainActions';

var ProjectStore = Reflux.createStore({

    init() {
        this.listenToMany(ProjectListActions);
        this.projects = [];
        this.toastState = null;
        this.ref = '';
        this.msg = '';
        this.project = [];
    },

    loadProjects() {
        this.trigger({
            loading: true
        })
    },

    loadProjectsSuccess(projects) {
        this.projects = projects;
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

    // Loads folders and files contained inside a project
    // TODO: NEED TO CHANGE THIS TO LOAD FILES & FOLDERS FROM PARENT
    loadProjectContents() {
        this.trigger({
            loading: true
        })
    },
    loadProjectContentsSuccess(projects) {
        this.projects = projects;
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

    showDetailsError() {
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
        ProjectListActions.loadProjects();
        this.trigger({
            addProjectLoading: false
        })
    },

    addProjectError() {
        let msg = error && error.message ? "Error: " : +'An error occurred while trying to add a new project.';
        this.trigger({
            error: msg,
            addProjectLoading: false
        })
    },

    deleteProject() {

    },

    deleteProjectSuccess() {
        ProjectListActions.loadProjects();
    },

    deleteProjectError() {
        let msg = error && error.message ? "Error: " : +'An error occurred while trying to delete this project.';
        this.trigger({
            error: msg,
            loading: false
        });
    },

    editProject() {
        this.trigger({
            editProjectLoading: true
        })
    },

    editProjectSuccess() {
        ProjectListActions.loadProjects();
        this.trigger({
            addProjectLoading: false
        })
    },

    editProjectError() {
        let msg = error && error.message ? "Error: " : +'An error occurred while trying to edit this project.';
        this.trigger({
            error: msg,
            loading: false
        });
    }

});

export default ProjectStore;