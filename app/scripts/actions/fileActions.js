import Reflux from 'reflux';
import MainActions from '../actions/mainActions';

var mockUrl = 'http://localhost:3000/';

var FileActions = Reflux.createActions ([
    'loadFiles',
    'loadFilesSuccess',
    'loadFilesError',
    'deleteFile',
    'deleteFileSuccess',
    'deleteFileError',
    'editFile',
    'editFileSuccess',
    'editFileError'
])

FileActions.loadFiles.preEmit = function () {
    let url = mockUrl + 'db';
    fetch(url)
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            FileActions.loadFilesSuccess(json.files)
        }).catch(function(ex) {
            FileActions.loadFilesError(ex)
        })
};

FileActions.deleteFile.preEmit = function (id, ref) {
    let url = mockUrl + 'files/' + id;
    fetch(url, {
        method: 'delete'
    }).then(function(response) {
        return response.json()
    }).then(function(json) {
        MainActions.addToast('File Deleted!');
        FileActions.deleteFileSuccess(ref)
    }).catch(function(ex) {
        MainActions.addToast('Failed to Delete File!');
        FileActions.deleteFileError(ex)
    });
};

FileActions.editFile.preEmit = function (id) {
    let url = mockUrl + 'files/' + id;
    fetch(url, {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": document.getElementById('fileNameText').value,
            "is_deleted": false
        })
    }).then(function(response) {
        return response.json()
    }).then(function(json) {
        MainActions.addToast('File Updated!');
        FileActions.editFileSuccess()
    }).catch(function(ex) {
        MainActions.addToast('Failed to Update File');
        FileActions.editFileError(ex)
    });
};


export default FileActions;