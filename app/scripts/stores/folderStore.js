import Reflux from 'reflux';
import FolderActions from '../actions/folderActions';

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
    loadFoldersSuccess(folders) {
        this.folders = folders;
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

    addFolderSuccess() {
        FolderActions.loadFolders();
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
        this.msg = 'Folder Deleted!';
        this.ref = 'snackbarDelete';
        this.toastState = true;
        this.trigger({
            toastState: this.toastState,
            msg: this.msg,
            ref: this.ref,
            loading: true
        })
    },
    deleteFolderSuccess(folders) {
        FolderActions.loadFolders();
        this.ref = '';
        this.toastState = null;
        this.trigger({
            toastState: this.toastState,
            ref: this.ref,
            loading: false
        })
    },
    deleteFolderError() {
        let errMsg = error && error.message ? "Error: " : + 'An error occurred while trying to delete this project.';
        this.msg = "There was an error and your folder didn't delete";
        this.ref = 'snackbarDelete';
        this.toastState = true;
        this.trigger({
            toastState: this.toastState,
            msg: this.msg,
            ref: this.ref,
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
        FolderActions.loadFolders();
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