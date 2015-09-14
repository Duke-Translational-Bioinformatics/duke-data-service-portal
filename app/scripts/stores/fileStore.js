import Reflux from 'reflux';
import MainActions from '../actions/folderActions';
import cookie from 'react-cookie';

var FileStore = Reflux.createStore ({
    listenables: FileActions,

    init() {

    }
});

export default FileStore;