import Reflux from 'reflux';


var LoginActions = Reflux.createActions([
    'handleLogout',
    'handleExpiredToken',
    'alertUser',
    'handleInvalidAccessToken',
    'validateAccessToken',
    'handleInvalidSignedToken',
    'getApiToken',
    'handleAjaxError',
    'handleValidationErrors',
    'getResourceWithToken',
    'getCurrentUser',
    'loadCurrentUser',

]);


//LoginActions.loadProjects.preEmit = function (data) {
//    let url = 'https://raw.githubusercontent.com/caseychoiniere/duke-data-service-portal/develop/test-utils/mock-json/project-list.json';
//    fetch(url)
//        .then(function(response) {
//            return response.json()
//        }).then(function(json) {
//            ProjectListActions.loadProjectsSuccess(json.projects)
//        }).catch(function(ex) {
//            ProjectListActions.loadProjectsError(ex)
//        })
//};





export default LoginActions;