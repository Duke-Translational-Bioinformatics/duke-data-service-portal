import Reflux from 'reflux';


var ProjectListActions = Reflux.createActions([
    'loadProjects',
    'loadProjectsSuccess',
    'loadProjectsError'
]);

ProjectListActions.loadProjects.preEmit = function (data) {
    // fetch call example
    //let url = 'https://raw.githubusercontent.com/caseychoiniere/duke-data-service-portal/develop/test-utils/mock-json/project-list.json';
    //fetch(url)
    //    .then(function(response) {
    //        return response.json()
    //    }).then(function(json) {
    //        ProjectListActions.loadProjectsSuccess(json.projects)
    //    }).catch(function(ex) {
    //        ProjectListActions.loadProjectsError(ex)
    //    })
    //fetch('https://raw.githubusercontent.com/caseychoiniere/duke-data-service-portal/develop/test-utils/mock-json/project-list.json')
    //    .then(function(response) {
    //        return response.json()
    //    }).then(function(json) {
    //        console.log('parsed json', json)
    //    }).catch(function(ex) {
    //        console.log('parsing failed', ex)
    //    })
    let x = {
        "id": "ae759205-8246-45be-b4b6-3463c7894a9a",
        "name": "proin interdum mauris non",
        "description": "Limb shorten-tib/fibula",
        "is_deleted": false
    }
    ProjectListActions.loadProjectsSuccess([x])
};


export default ProjectListActions;