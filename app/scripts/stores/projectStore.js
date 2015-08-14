import Reflux from 'reflux';
import ProjectListActions from '../actions/projectListActions';

var ProjectStore = Reflux.createStore({

    init() {
        this.projects = [];
        //this.showDetailProject = null;

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
        let msg = error && error.message ? "Error: " : + 'An error occurred.';
        this.trigger({
            error: msg,
            loading: false
        });
    },

    // Loads folders and files contained inside a project
    loadProjectContents() {
        this.trigger({
            loading: true
        });
    },

    addProject() {

    },

    addProjectSuccess() {

    },

    addProjectError() {

    }


});

export default ProjectStore;