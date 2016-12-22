import React from 'react'
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import FolderPath from '../components/folderComponents/folderPath.jsx';
import FolderChildren from '../components/folderComponents/folderChildren.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx'

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
            objectTags: ProjectStore.objectTags,
            openTagManager: ProjectStore.openTagManager,
            openUploadManager: ProjectStore.openUploadManager,
            uploads: ProjectStore.uploads,
            projPermissions: ProjectStore.projPermissions,
            screenSize: ProjectStore.screenSize,
            tagAutoCompleteList: ProjectStore.tagAutoCompleteList,
            tagLabels: ProjectStore.tagLabels
        };
    }

    componentDidMount() {
        let kind = 'folders';
        let path = 'folders/';
        let id = this.props.params.id;
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        if(ProjectStore.openTagManager) ProjectActions.toggleTagManager();
        this._loadFolder(id, kind, path);
    }

    componentDidUpdate(prevProps) {
        let kind = 'folders';
        let path = 'folders/';
        let id = this.props.params.id;
        if(prevProps.params.id !== this.props.params.id) {
            this._loadFolder(id, kind, path);
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _loadFolder(id, kind, path) {
        ProjectActions.getChildren(id, path);
        ProjectActions.getEntity(id, kind);
        ProjectActions.clearSelectedItems(); // Clear checked files and folders from list
        ProjectActions.getTagLabels(); // Used to generate a list of tag labels
    }

    render() {
        if(this.state.entityObj && this.props.currentUser && this.props.currentUser.id) {
            let projId = this.state.entityObj && this.state.entityObj.project ? this.state.entityObj.project.id : null;
            let userId = this.props.currentUser && this.props.currentUser.id ? this.props.currentUser.id : null;
            if (this.state.projPermissions === null) ProjectActions.getPermissions(projId, userId);
        }
        return (
            <div>
                <FolderPath {...this.state} {...this.props} />
                <FolderChildren {...this.state} {...this.props} />
                <TagManager {...this.props} {...this.state} />
            </div>
        );
    }
}

export default Folder;