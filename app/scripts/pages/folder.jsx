import React from 'react'
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import FolderPath from '../components/folderComponents/folderPath.jsx';
import FileOptions from '../components/fileComponents/fileOptions.jsx';
import FolderOptions from '../components/folderComponents/folderOptions.jsx';
import ListItems from '../components/globalComponents/listItems.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx'
import VersionUpload from '../components/fileComponents/versionUpload.jsx';

class Folder extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: ProjectStore.currentUser,
            listItems: ProjectStore.listItems,
            responseHeaders: ProjectStore.responseHeaders,
            filesChecked: ProjectStore.filesChecked,
            filesToUpload: ProjectStore.filesToUpload,
            filesRejectedForUpload: ProjectStore.filesRejectedForUpload,
            foldersChecked: ProjectStore.foldersChecked,
            loading: false,
            metaObjProps: ProjectStore.metaObjProps,
            moveItemList: ProjectStore.moveItemList,
            moveModal: ProjectStore.moveModal,
            moveErrorModal: ProjectStore.moveErrorModal,
            objectTags: ProjectStore.objectTags,
            openTagManager: ProjectStore.openTagManager,
            openUploadManager: ProjectStore.openUploadManager,
            uploads: ProjectStore.uploads,
            projPermissions: ProjectStore.projPermissions,
            screenSize: ProjectStore.screenSize,
            selectedEntity: ProjectStore.selectedEntity,
            tagAutoCompleteList: ProjectStore.tagAutoCompleteList,
            tagLabels: ProjectStore.tagLabels,
            tagsToAdd: ProjectStore.tagsToAdd
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
        return (
            <div>
                <FolderPath {...this.state} {...this.props} />
                <ListItems {...this.props} {...this.state} />
                <FileOptions {...this.props} {...this.state}/>
                <FolderOptions {...this.props} {...this.state}/>
                <TagManager {...this.props} {...this.state} />
                <VersionUpload {...this.props} {...this.state}/>
            </div>
        );
    }
}

export default Folder;