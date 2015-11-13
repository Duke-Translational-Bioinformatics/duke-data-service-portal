import Reflux from 'reflux';
import FolderActions from '../actions/folderActions';
import MainActions from '../actions/mainActions';

var FolderStore = Reflux.createStore ({

    init() {
        this.folders = [];
        this.listenToMany(FolderActions);
        this.toastState = null;
        this.ref = '';
        this.msg = '';
    },
    loadFolders() {
        this.trigger({
            loading: true
        })
    },
    loadFoldersSuccess(results) {
        this.folders = results;
        this.trigger({
            folders: this.folders,
            loading: false
        })
    },
    loadFoldersError() {
        let msg = error && error.message ? "Error: " : + 'An error occurred while loading folders.';
        this.trigger({
            error: msg,
            loading: false
        })
    },
    addFolder() {
        this.trigger({
            loading: true
        })
    },

    addFolderSuccess(id) {
        FolderActions.loadFolders(id);
        this.trigger({
            loading: false
        })
    },

    addFolderError() {
        let msg = error && error.message ? "Error: " : + 'An error occurred.';
        this.trigger({
            error: msg,
            loading: false
        });
    },
    deleteFolder() {
        this.trigger({
            loading: true
        })
    },
    deleteFolderSuccess(folders) {
        FolderActions.loadFolders();
        this.trigger({
            loading: false
        })
    },
    deleteFolderError() {
        let errMsg = error && error.message ? "Error: " : + 'An error occurred while trying to delete this project.';
        this.trigger({
            error: errMsg,
            loading: false
        });
    },
    editFolder() {
        this.trigger({
            loading: true
        })
    },
    editFolderSuccess() {
        //FolderActions.loadFolders();
        this.trigger({
            loading: false
        })
    },
    editFolderError() {
        let msg = error && error.message ? "Error: " : + 'An error occurred while trying to edit this project.';
        this.trigger({
            error: msg,
            loading: false
        });
    }

});

export default FolderStore;