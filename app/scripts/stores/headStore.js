//import Reflux from 'reflux';
//import HeaderActions from '../actions/headerActions';
//
//var ProjectStore = Reflux.createStore({
//
//    init() {
//        this.projects = [];
//        this.accountOverview = null;
//        //this.showDetailProject = null;
//
//        this.listenTo(ProjectListActions.loadProjects, this.loadProjects);
//        this.listenTo(ProjectListActions.loadProjectsSuccess, this.loadProjectsSuccess);
//        this.listenTo(ProjectListActions.loadProjectsError, this.loadProjectsError);
//        //this.listenTo(ProjectListActions.showProjectDetail, this.showProjectDetail);
//    },
//
//    loadProjects() {
//        this.trigger({
//            loading: true
//        });
//    },
//
//    loadProjectsSuccess(projects) {
//        this.projects = projects;
//
//        this.trigger({
//            projects: this.projects,
//            loading: false
//        });
//    },
//
//    loadProjectsError(error) {
//        let msg = error && error.message ? "Error: " : + 'An error occurred.';
//        this.trigger({
//            error: msg,
//            loading: false
//        });
//    }
//});
//
//export default ProjectStore;
