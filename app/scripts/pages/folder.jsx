import React from 'react'
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import FolderPath from '../components/folderComponents/folderPath.jsx';
import FolderChildren from '../components/folderComponents/folderChildren.jsx';

class Folder extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            children: ProjectStore.children,
            error: ProjectStore.error,
            errorModal: ProjectStore.errorModal,
            filesChecked: ProjectStore.filesChecked,
            foldersChecked: ProjectStore.foldersChecked,
            loading: false,
            moveModal: ProjectStore.moveModal,
            moveErrorModal: ProjectStore.moveErrorModal,
            project: ProjectStore.project,
            uploads: ProjectStore.uploads
        };
    }

    componentDidMount() {
        let kind = 'folders';
        let id = this.props.params.id;
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        this._loadFolder(id, kind);
    }

    componentDidUpdate(prevProps) {
        let kind = 'folders';
        let id = this.props.params.id;
        if(prevProps.params.id !== this.props.params.id) {
            this._loadFolder(id, kind);
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _loadFolder(id, kind) {
        ProjectActions.loadFolderChildren(id, kind);
        ProjectActions.getEntity(id, kind);
    }

    render() {
        return (
            <div>
                <FolderPath {...this.state} {...this.props} />
                <FolderChildren {...this.state} {...this.props} />
            </div>
        );
    }
}

export default Folder;