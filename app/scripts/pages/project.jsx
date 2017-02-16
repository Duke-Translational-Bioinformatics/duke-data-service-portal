import React from 'react';
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import ListItems from '../components/globalComponents/listItems.jsx';
import ProjectDetails from '../components/projectComponents/projectDetails.jsx';
import FileOptions from '../components/fileComponents/fileOptions.jsx';
import FolderOptions from '../components/folderComponents/folderOptions.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx'
import VersionUpload from '../components/fileComponents/versionUpload.jsx';
import {Path} from '../../util/urlEnum';

class Project extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            listItems: ProjectStore.listItems,
            responseHeaders: ProjectStore.responseHeaders,
            currentUser: ProjectStore.currentUser,
            drawerLoading: ProjectStore.drawerLoading,
            filesChecked: ProjectStore.filesChecked,
            filesToUpload: ProjectStore.filesToUpload,
            filesRejectedForUpload: ProjectStore.filesRejectedForUpload,
            foldersChecked: ProjectStore.foldersChecked,
            loading: false,
            metaObjProps: ProjectStore.metaObjProps,
            moveItemList: ProjectStore.moveItemList,
            moveToObj: ProjectStore.moveToObj,
            objectTags: ProjectStore.objectTags,
            openTagManager: ProjectStore.openTagManager,
            openUploadManager: ProjectStore.openUploadManager,
            projects: ProjectStore.projects,
            project: ProjectStore.project,
            screenSize: ProjectStore.screenSize,
            searchValue: ProjectStore.searchValue,
            selectedEntity: ProjectStore.selectedEntity,
            tagAutoCompleteList: ProjectStore.tagAutoCompleteList,
            tagLabels: ProjectStore.tagLabels,
            tagsToAdd: ProjectStore.tagsToAdd,
            toggleModal: ProjectStore.toggleModal,
            uploads: ProjectStore.uploads,
            users: ProjectStore.users
        };
    }

    componentDidMount() {
        let id = this.props.params.id;
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        if(ProjectStore.openTagManager) ProjectActions.toggleTagManager();
        ProjectActions.getChildren(id, Path.PROJECT);
        ProjectActions.showDetails(id);
        ProjectActions.getProjectMembers(id);
        ProjectActions.getUser(id);
        ProjectActions.getTagLabels(); // Used to generate a list of tag labels
        ProjectActions.clearSelectedItems(); // Clear checked files and folders from list
    }

    componentDidUpdate(prevProps) {
        let id = this.props.params.id;
        if(prevProps.objectTags !== this.props.objectTags) {
            ProjectActions.getTags(id, 'dds-file');
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <div>
                <ProjectDetails {...this.props} {...this.state} />
                <ListItems {...this.props} {...this.state} />
                <FileOptions {...this.props} {...this.state}/>
                <FolderOptions {...this.props} {...this.state}/>
                <TagManager {...this.props} {...this.state} />
                <VersionUpload {...this.props} {...this.state}/>
            </div>
        );
    }
}

export default Project;