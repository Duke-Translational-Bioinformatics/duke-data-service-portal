import Reflux from 'reflux';
import MainActions from '../actions/mainActions';

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
    'showDetails',
    'showDetailsSuccess',
    'showDetailsError'
]);
ProjectListActions.loadProjects.preEmit = function () {
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

ProjectListActions.showDetails.preEmit = function (id) {
    let url = mockUrl + 'projects?id=' + id;
    fetch(url)
        .then(function(response) {
            console.log('parsed json', response);
            return response.json()
        }).then(function(json) {
            ProjectListActions.showDetailsSuccess(json)
        }).catch(function(ex) {
            ProjectListActions.showDetailsError(ex)
        })
};

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
            return response.json()
        }).then(function(json) {
            MainActions.addToast('Project Added');
            ProjectListActions.addProjectSuccess()
        }).catch(function(ex) {
            MainActions.addToast('Failed to add new project');
            ProjectListActions.addProjectError(ex)
        })
};

ProjectListActions.deleteProject.preEmit = function (currentPath) {
    let url = mockUrl + 'projects/' + currentPath;
    fetch(url, {
        method: 'delete'
    }).then(function(response) {
        return response.json()
    }).then(function(json) {
        MainActions.addToast('Project Deleted');
        ProjectListActions.deleteProjectSuccess()
    }).catch(function(ex) {
        MainActions.addToast('Project Delete Failed');
        ProjectListActions.deleteProjectError(ex)
    });
};

ProjectListActions.editProject.preEmit = function (id) {
    let url = mockUrl + 'projects/' + id;
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
        MainActions.addToast('Project Updated');
        ProjectListActions.editProjectSuccess()
    }).catch(function(ex) {
        MainActions.addToast('Project Update Failed');
        ProjectListActions.editProjectError(ex)
    });
};


export default ProjectListActions;

