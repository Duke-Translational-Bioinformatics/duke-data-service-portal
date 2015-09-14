import Reflux from 'reflux';
import MainActions from '../actions/folderActions';
import cookie from 'react-cookie';

var FolderStore = Reflux.createStore ({
    listenables: FolderActions,

    init() {

    }
});

export default FolderStore;