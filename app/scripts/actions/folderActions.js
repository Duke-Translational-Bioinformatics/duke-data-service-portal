import Reflux from 'reflux';

var mockUrl = 'http://localhost:3000/';

var FolderActions = Reflux.createActions ([
    'loadFolders',
    'loadFoldersSuccess',
    'loadFoldersError',
    'addFolder',
    'addFolderSuccess',
    'addFolderError'
])

FolderActions.loadFolders.preEmit = function () {
    let url = mockUrl + 'db';
    fetch(url)
        .then(function(response) {
            console.log('parsed json', response)
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
            //"project": {"id": parent},
            "is_deleted": false
        })
    }).then(function(response) {
        console.log('parsed json', response)
        return response.json()
    }).then(function(json) {
        FolderActions.addFolderSuccess()
    }).catch(function(ex) {
        FolderActions.addFolderError(ex)
    })
};

export default FolderActions;