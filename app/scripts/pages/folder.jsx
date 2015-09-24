import React from 'react'
import FileActions from '../actions/fileActions';
import FileStore from '../stores/fileStore';
import FolderActions from '../actions/folderActions';
import FolderStore from '../stores/folderStore';
import FolderPath from '../components/folderPath.jsx';
import FileList from '../components/fileList.jsx';

class Folder extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            folders: [],
            loading: false
        };
    }

    componentDidMount() {
        this.unsubscribe = FileStore.listen(this.onStatusChange.bind(this));
        FolderActions.loadFolders();
        FileActions.loadFiles();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange(state) {
        this.setState(state);
    }

    render() {

        return (
            <div>
                <FolderPath {...this.state} {...this.props} />
                <FileList {...this.state} {...this.props} />
            </div>
        );
    }
}

var styles = {
    container: {
        marginTop: 20,
        padding: '10px 0px 10px 0px'
    },
    arrow: {
        textAlign: 'left'
    },
    detailsTitle: {
        textAlign: 'left',
        float: 'left'
    },
    breadcrumbs: {
        fontSize: 24
    },
    folderName: {
        fontSize: 14
    },
    moreIcon: {
        fontSize: 36,
        verticalAlign: -11
    },
    backIcon: {
        fontSize: 24,
        verticalAlign: -6
    }
};

export default Folder;