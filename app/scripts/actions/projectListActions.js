import Reflux from 'reflux';

var mockUrl = 'http://localhost:3000/';

var ProjectListActions = Reflux.createActions([
    'loadProjects',
    'loadProjectsSuccess',
    'loadProjectsError',
    'loadProjectContents',
    'loadProjectContentsSuccess',
    'handleFloatingErrorInputChange',
    'addProject',
    'addProjectSuccess',
    'addProjectError',
    'deleteProject',
    'deleteProjectSuccess',
    'deleteProjectError',
    'editProject',
    'editProjectSuccess',
    'editProjectError',
    'showProjectDetails'
]);
ProjectListActions.loadProjects.preEmit = function () {
    let url = mockUrl + 'db';
    fetch(url)
        .then(function(response) {
            console.log('parsed json', response);
            return response.json()
        }).then(function(json) {
            ProjectListActions.loadProjectsSuccess(json.projects)
        }).catch(function(ex) {
            ProjectListActions.loadProjectsError(ex)
        })
};

ProjectListActions.loadProjectContents.preEmit = function (id) {
    let url = mockUrl + 'db';
    fetch(url)
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            ProjectListActions.loadProjectsSuccess(json.projects)
        }).catch(function(ex) {
            ProjectListActions.loadProjectsError(ex)
        })
};

//ProjectListActions.loadProjectContents.preEmit = function (projectId) {
//    let url = mockUrl + 'projects?id=' + projectId;
//    fetch(url)
//        .then(function(response) {
//            console.log('parsed json', response);
//            return response.json()
//        }).then(function(json) {
//            ProjectListActions.loadProjectsSuccess(json.projects)
//        }).catch(function(ex) {
//            ProjectListActions.loadProjectsError(ex)
//        })
//};

//ProjectListActions.showProjectDetails.preEmit = function (currentPath) {
//    let url = mockUrl + 'projects/' + currentPath;
//    fetch(url)
//        .then(function(response) {
//            console.log('parsed json', response);
//            return response.json()
//        }).then(function(json) {
//            ProjectListActions.loadProjectsSuccess(json.projects)
//        }).catch(function(ex) {
//            ProjectListActions.loadProjectsError(ex)
//        })
//};

ProjectListActions.addProject.preEmit = function () {
    fetch(mockUrl + 'projects/', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": document.getElementById('projectNameText').value,
            "description": document.getElementById('projectDescriptionText').value,
            "is_deleted": false
        })
    }).then(function(response) {
            console.log('parsed json', response)
            return response.json()
        }).then(function(json) {
            ProjectListActions.addProjectSuccess()
        }).catch(function(ex) {
            ProjectListActions.addProjectError(ex)
        })
};

ProjectListActions.deleteProject.preEmit = function (currentPath) {
    let url = mockUrl + 'projects/' + currentPath;
    console.log(url);
    fetch(url, {
        method: 'delete'
    }).then(function(response) {
        return response.json()
    }).then(function(json) {
        ProjectListActions.deleteProjectSuccess()
    }).catch(function(ex) {
        ProjectListActions.deleteProjectError(ex)
    });
};

ProjectListActions.editProject.preEmit = function (currentPath) {
    let url = mockUrl + 'projects/' + currentPath;
    console.log(url);
    fetch(url, {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": document.getElementById('projectNameText').value,
            "description": document.getElementById('projectDescriptionText').value,
            "is_deleted": false
        })
    }).then(function(response) {
        return response.json()
    }).then(function(json) {
        console.log('parsed json: ', json);
        ProjectListActions.editProjectSuccess()
    }).catch(function(ex) {
        console.log('parsing failed: ', ex);
        ProjectListActions.editProjectError(ex)
    });
};


export default ProjectListActions;

