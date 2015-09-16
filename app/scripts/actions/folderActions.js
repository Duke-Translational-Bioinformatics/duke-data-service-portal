import Reflux from 'reflux';
var mockUrl = 'http://localhost:3000/';

var FolderActions = Reflux.createActions ([
    'addFolder',
    'addFolderSuccess',
    'addFolderError'
])

FolderActions.addFolder.preEmit = function () {
    fetch(mockUrl + 'folders/', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": document.getElementById('folderNameText').value,
            "description": document.getElementById('folderDescriptionText').value,
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