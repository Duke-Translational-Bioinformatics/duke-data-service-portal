import Reflux from 'reflux';
import MainActions from '../actions/mainActions';
import MainStore from '../stores/mainStore';
import urlGen from '../../util/urlGen.js';

var mockUrl = 'http://localhost:3000/';

var FolderActions = Reflux.createActions([
    'loadFolders',
    'loadFoldersSuccess',
    'loadFoldersError',
    'addFolder',
    'addFolderSuccess',
    'addFolderError',
    'deleteFolder',
    'deleteFolderSuccess',
    'deleteFolderError',
    'editFolder',
    'editFolderSuccess',
    'editFolderError'
]);

FolderActions.loadFolders.preEmit = function (id) {
    fetch(urlGen.routes.ddsUrl + 'projects/' + id + '/children', {
        method: 'get',
        headers: {
            'Authorization': MainStore.appConfig.apiToken,
            'Accept': 'application/json'
        }
    })
        .then(function (response) {
            return response.json()
        }).then(function (json) {
                FolderActions.loadFoldersSuccess(json.results)
        }).catch(function (ex) {
            FolderActions.loadFoldersError(ex)
        })
};

FolderActions.addFolder.preEmit = function (id) {
    fetch(urlGen.routes.ddsUrl + 'folders/', {
        method: 'post',
        headers: {
            'Authorization': MainStore.appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "name": document.getElementById('folderNameText').value,
            "parent": {
                "kind": "dds-project",
                "id": id
            }
        })
    }).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Folder Added');
        FolderActions.addFolderSuccess(id)
    }).catch(function (ex) {
        MainActions.addToast('Failed to Add a New Folder');
        FolderActions.addFolderError(ex)
    })
};

FolderActions.deleteFolder.preEmit = function (id, ref) {
    fetch(urlGen.routes.ddsUrl + 'folders/' + id, {
        method: 'delete'
    }).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Folder Deleted!');
        FolderActions.deleteFolderSuccess(ref)
    }).catch(function (ex) {
        MainActions.addToast('Folder Deleted Failed!');
        FolderActions.deleteFolderError(ex)
    });
};

FolderActions.editFolder.preEmit = function (id) {
    fetch(urlGen.routes.ddsUrl + 'folders/' + id + '/rename', {
        method: 'put',
        headers: {
            'Authorization': MainStore.appConfig.apiToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": document.getElementById('folderNameText').value,
        })
    }).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Folder Updated!');
        FolderActions.editFolderSuccess()
    }).catch(function (ex) {
        MainActions.addToast('Failed to Update Folder');
        FolderActions.editFolderError(ex)
    });
};

export default FolderActions;