import Reflux from 'reflux';
import MainActions from '../actions/mainActions';

var mockUrl = 'http://localhost:3000/';

var FolderActions = Reflux.createActions ([
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
])

FolderActions.loadFolders.preEmit = function () {
    let url = mockUrl + 'db';
    fetch(url)
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            FolderActions.loadFoldersSuccess(json.folders)
        }).catch(function(ex) {
            FolderActions.loadFoldersError(ex)
        })
};

FolderActions.addFolder.preEmit = function () {
    fetch(mockUrl + 'folders/', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            //"kind": 'dds#folder',
            "name": document.getElementById('folderNameText').value,
            //"description": document.getElementById('folderDescriptionText').value,
            //"parent": {"id": parent},
            //"Folder": {"id": parent},
            "is_deleted": false
        })
    }).then(function(response) {
        return response.json()
    }).then(function(json) {
        MainActions.addToast('Folder Added');
        FolderActions.addFolderSuccess()
    }).catch(function(ex) {
        MainActions.addToast('Failed to Add a New Folder');
        FolderActions.addFolderError(ex)
    })
};

FolderActions.deleteFolder.preEmit = function (currentPath, ref) {
    let url = mockUrl + 'folders/' + currentPath;
    fetch(url, {
        method: 'delete'
    }).then(function(response) {
        return response.json()
    }).then(function(json) {
        MainActions.addToast('Folder Deleted!');
        FolderActions.deleteFolderSuccess(ref)
    }).catch(function(ex) {
        MainActions.addToast('Folder Deleted Failed!');
        FolderActions.deleteFolderError(ex)
    });
};

FolderActions.editFolder.preEmit = function (currentPath) {
    let url = mockUrl + 'folders/' + currentPath;
    fetch(url, {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": document.getElementById('folderNameText').value,
            //"description": document.getElementById('folderDescriptionText').value,
            "is_deleted": false
        })
    }).then(function(response) {
        return response.json()
    }).then(function(json) {
        MainActions.addToast('Folder Updated!');
        FolderActions.editFolderSuccess()
    }).catch(function(ex) {
        MainActions.addToast('Failed to Update Folder');
        FolderActions.editFolderError(ex)
    });
};

export default FolderActions;