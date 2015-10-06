import Reflux from 'reflux';

var mockUrl = 'http://localhost:3000/';

var FileActions = Reflux.createActions ([
    'loadFiles',
    'loadFilesSuccess',
    'loadFilesError'
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


export default FileActions;