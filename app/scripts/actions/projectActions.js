import Reflux from 'reflux';
import MainActions from '../actions/mainActions';
import MainStore from '../stores/mainStore';
import urlGen from '../../util/urlGen.js';
import appConfig from '../config';
import { checkStatus, getAuthenticatedFetchParams } from '../../util/fetchUtil.js';

var ProjectActions = Reflux.createActions([
    'getUsageDetails',
    'getUsageDetailsSuccess',
    'getUsageDetailsError',
    'loadProjects',
    'loadProjectsSuccess',
    'loadProjectsError',
    'loadProjectChildren',
    'loadProjectChildrenSuccess',
    'loadProjectChildrenError',
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
    'showDetailsError',
    'loadFolderChildren',
    'loadFolderChildrenSuccess',
    'loadFolderChildrenError',
    'getFolderInfo',
    'getFolderInfoSuccess',
    'getFolderInfoError',
    'addFolder',
    'addFolderSuccess',
    'addFolderError',
    'deleteFolder',
    'deleteFolderSuccess',
    'deleteFolderError',
    'editFolder',
    'editFolderSuccess',
    'editFolderError',
    'loadFiles',
    'loadFilesSuccess',
    'loadFilesError',
    'deleteFile',
    'deleteFileSuccess',
    'deleteFileError',
    'editFile',
    'editFileSuccess',
    'editFileError',
    'getEntity',
    'getEntitySuccess',
    'getEntityError',
    'getProjectMembers',
    'getProjectMembersSuccess',
    'getProjectMembersError',
    'getUserId',
    'getUserIdSuccess',
    'getUserIdError',
    'addProjectMember',
    'addProjectMemberSuccess',
    'addProjectMemberError',
    'deleteProjectMember',
    'deleteProjectMemberSuccess',
    'deleteProjectMemberError',
    'getDownloadUrl',
    'getDownloadUrlSuccess',
    'getDownloadUrlError'
]);

ProjectActions.getUsageDetails.preEmit = function () {
    fetch(urlGen.routes.ddsUrl + 'current_user/usage', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getUsageDetailsSuccess(json)
    }).catch(function (ex) {
        ProjectActions.getUsageDetailsError(ex)
    })
};

ProjectActions.loadProjects.preEmit = function () {
    fetch(urlGen.routes.ddsUrl + 'projects/', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.loadProjectsSuccess(json.results)
    }).catch(function (ex) {
        ProjectActions.loadProjectsError(ex)
    })
};

ProjectActions.loadProjectChildren.preEmit = function (id) {
    fetch(urlGen.routes.ddsUrl + 'projects/' + id + '/children', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.loadProjectChildrenSuccess(json.results)
    }).catch(function (ex) {
        ProjectActions.loadProjectChildrenError(ex)
    })
};

ProjectActions.showDetails.preEmit = function (id) {
    fetch(urlGen.routes.ddsUrl + 'projects/' + id, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.showDetailsSuccess(json)
    }).catch(function (ex) {
        ProjectActions.showDetailsError(ex)
    })
};

ProjectActions.addProject.preEmit = function (name, desc) {
    fetch(urlGen.routes.ddsUrl + 'projects/', {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "description": desc
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Project Added');
        ProjectActions.addProjectSuccess()
    }).catch(function (ex) {
        MainActions.addToast('Failed to add new project');
        ProjectActions.addProjectError(ex)
    })
};

ProjectActions.deleteProject.preEmit = function (id) {
    fetch(urlGen.routes.ddsUrl + 'projects/' + id, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function (json) {
        MainActions.addToast('Project Deleted');
        ProjectActions.deleteProjectSuccess(json)
    }).catch(function (ex) {
        MainActions.addToast('Project Delete Failed');
        ProjectActions.deleteProjectError(ex)
    });
};

ProjectActions.editProject.preEmit = function (id, name, desc) {
    fetch(urlGen.routes.ddsUrl + 'projects/' + id, {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "description": desc
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Project Updated');
        ProjectActions.editProjectSuccess()
    }).catch(function (ex) {
        MainActions.addToast('Project Update Failed');
        ProjectActions.editProjectError(ex)
    });
};

ProjectActions.loadFolderChildren.preEmit = function (id) {
    fetch(urlGen.routes.ddsUrl + 'folders/' + id + '/children', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.loadFolderChildrenSuccess(json.results)
    }).catch(function (ex) {
        ProjectActions.loadFolderChildrenError(ex)
    })
};

ProjectActions.addFolder.preEmit = function (id, parentKind, name) {
    fetch(urlGen.routes.ddsUrl + 'folders/', {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "parent": {
                "kind": parentKind,
                "id": id
            }
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Folder Added');
        ProjectActions.addFolderSuccess(id, parentKind);
    }).catch(function (ex) {
        MainActions.addToast('Failed to Add a New Folder');
        ProjectActions.addFolderError(ex)
    })
};

ProjectActions.deleteFolder.preEmit = function (id) {
    fetch(urlGen.routes.ddsUrl + 'folders/' + id, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function () {
        MainActions.addToast('Folder Deleted!');
        ProjectActions.deleteFolderSuccess()
    }).catch(function (ex) {
        MainActions.addToast('Folder Deleted Failed!');
        ProjectActions.deleteFolderError(ex)
    });
};

ProjectActions.editFolder.preEmit = function (id, name) {
    fetch(urlGen.routes.ddsUrl + 'folders/' + id + '/rename', {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": name
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Folder Updated!');
        ProjectActions.editFolderSuccess(id)
    }).catch(function (ex) {
        MainActions.addToast('Failed to Update Folder');
        ProjectActions.editFolderError(ex)
    });
};

ProjectActions.loadFiles.preEmit = function (id) {
    fetch(urlGen.routes.ddsUrl + 'folders/' + id + '/children', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.loadFilesSuccess(json.results)
    }).catch(function (ex) {
        ProjectActions.loadFilesError(ex)
    })
};

ProjectActions.deleteFile.preEmit = function (id, parentId, parentKind) {
    fetch(urlGen.routes.ddsUrl + 'files/' + id, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function () {
        MainActions.addToast('File Deleted!');
        ProjectActions.deleteFileSuccess(parentId, parentKind)
    }).catch(function (ex) {
        MainActions.addToast('Failed to Delete File!');
        ProjectActions.deleteFileError(ex)
    });
};

ProjectActions.editFile.preEmit = function (id, fileName) {
    fetch(urlGen.routes.ddsUrl + 'files/' + id + '/rename', {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "name": fileName
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('File Updated!');
        ProjectActions.editFileSuccess(id)
    }).catch(function (ex) {
        MainActions.addToast('Failed to Update File');
        ProjectActions.editFileError(ex)
    });
};

ProjectActions.getEntity.preEmit = (id, kind) => {
    fetch(urlGen.routes.ddsUrl + kind + '/' + id, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getEntitySuccess(json)
    })
        .catch(function (ex) {
            ProjectActions.getEntityError(ex)
        });
};

ProjectActions.getProjectMembers.preEmit = (id) => {
    fetch(urlGen.routes.ddsUrl + 'projects/' + id + '/permissions', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getProjectMembersSuccess(json.results)
    })
        .catch(function (ex) {
            ProjectActions.getProjectMembersError(ex)
        });
};

ProjectActions.getUserId.preEmit = (firstName, lastName, id, role) => {
    fetch(urlGen.routes.ddsUrl + 'users?' + 'last_name_begins_with=' + lastName + '&first_name_begins_with=' + firstName, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getUserIdSuccess(json.results, id, role)
    })
        .catch(function (ex) {
            ProjectActions.getUserIdError(ex)
        });
};

ProjectActions.addProjectMember.preEmit = (id, userId, role, name) => {
    fetch(urlGen.routes.ddsUrl + 'projects/' + id + '/permissions/' + userId, {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'auth_role': {'id': role}
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast(name + ' ' + 'has been added to this project');
        ProjectActions.addProjectMemberSuccess(id)
    })
        .catch(function (ex) {
            MainActions.addToast('Could not add member to this project or member does not exist');
            ProjectActions.addProjectMemberError(ex)
        });
};

ProjectActions.deleteProjectMember.preEmit = (id, userId, userName) => {
    fetch(urlGen.routes.ddsUrl + 'projects/' + id + '/permissions/' + userId, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function (json) {
        MainActions.addToast(userName + ' ' + 'has been removed from this project');
        ProjectActions.deleteProjectMemberSuccess(id, userId);
    })
        .catch(function (ex) {
            MainActions.addToast('Unable to remove ' + userName + ' from this project');
            ProjectActions.deleteProjectMemberError(ex)
        });
};

ProjectActions.getDownloadUrl.preEmit = function (id) {
    fetch(urlGen.routes.ddsUrl + 'files/' + id + '/url', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getDownloadUrlSuccess(json)
    }).catch(function (ex) {
        ProjectActions.getDownloadUrlError(ex)
    })
};

function checkResponse(response) {
    return checkStatus(response, MainActions);
}

export default ProjectActions;

