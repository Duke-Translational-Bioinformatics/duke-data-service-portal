import Reflux from 'reflux';
import FileActions from '../actions/fileActions';
import cookie from 'react-cookie';

var FileStore = Reflux.createStore ({

    init() {
        this.file = [];
        this.listenToMany(FileActions);
    },

    loadFiles() {
        this.trigger({
            loading: true
        })
    },
    loadFilesSuccess(files) {
        this.files = files;
        this.trigger({
            files: this.files,
            loading: false
        })
    },
    loadFilesError() {
        let msg = error && error.message ? "Error: " : + 'An error occurred while loading files.';
        this.trigger({
            error: msg,
            loading: false
        })
    },
    deleteFile() {
        this.trigger({
            loading: true
        })
    },
    deleteFileSuccess() {
        FileActions.loadFiles();
        this.trigger({
            loading: false
        })
    },
    deleteFileError() {
        let errMsg = error && error.message ? "Error: " : + 'An error occurred while trying to delete this file.';
        this.trigger({
            error: errMsg,
            loading: false
        });
    },
    editFile() {
        this.trigger({
            loading: true
        })
    },
    editFileSuccess() {
        FileActions.loadFiles();
        this.trigger({
            loading: false
        })
    },
    editFileError() {
        let errMsg = error && error.message ? "Error: " : + 'An error occurred while trying to delete this file.';
        this.trigger({
            error: errMsg,
            loading: false
        });
    }

});

export default FileStore;