import Reflux from 'reflux';
import FolderActions from '../actions/folderActions';

var FolderStore = Reflux.createStore ({

    init() {
        this.folders = [];
        this.listenToMany(FolderActions);

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
            addFolderLoading: true
        })
    },

    addFolderSuccess() {
        FolderActions.loadFolders();
        this.trigger({
            addFolderLoading: false
        })
    },

    addFolderError() {
        let msg = error && error.message ? "Error: " : + 'An error occurred.';
        this.trigger({
            error: msg,
            addFolderLoading: false
        });
    }
});

export default FolderStore;