import Reflux from 'reflux';
import FolderActions from '../actions/folderActions';
import cookie from 'react-cookie';

var FolderStore = Reflux.createStore ({
    listenables: FolderActions,

    init() {

    },
    addFolder() {
        this.trigger({
            addFolderLoading: true
        })
    },

    addFolderSuccess() {
        //FolderActions.loadFolders();
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