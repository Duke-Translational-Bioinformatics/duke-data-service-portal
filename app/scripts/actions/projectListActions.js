import Reflux from 'reflux';


var ProjectListActions = Reflux.createActions([
    'loadProjects',
    'loadProjectsSuccess',
    'loadProjectsError',
    'loadProjectContents',
    'handleFloatingErrorInputChange'
]);

ProjectListActions.loadProjects.preEmit = function (data) {
    let url = 'https://raw.githubusercontent.com/caseychoiniere/duke-data-service-portal/develop/test-utils/mock-json/project-list.json';
    fetch(url)
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            ProjectListActions.loadProjectsSuccess(json.projects)
        }).catch(function(ex) {
            ProjectListActions.loadProjectsError(ex)
        })
};

ProjectListActions.loadProjectContents.preEmit = function (data) {
    let url = 'https://raw.githubusercontent.com/caseychoiniere/duke-data-service-portal/develop/test-utils/mock-json/project-list.json';
    fetch(url)
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            ProjectListActions.loadProjectsSuccess(json.projects)
        }).catch(function(ex) {
            ProjectListActions.loadProjectsError(ex)
        })
};

export default ProjectListActions;

