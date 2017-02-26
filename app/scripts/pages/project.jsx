import React from 'react';
import { observer, inject } from 'mobx-react';
import ProjectActions from '../actions/projectActions';
import projectStore from '../stores/projectStore';
import ListItems from '../components/globalComponents/listItems.jsx';
import ProjectDetails from '../components/projectComponents/projectDetails.jsx';
import FileOptions from '../components/fileComponents/fileOptions.jsx';
import FolderOptions from '../components/folderComponents/folderOptions.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx'
import VersionUpload from '../components/fileComponents/versionUpload.jsx';
import {Path} from '../../util/urlEnum';

@inject('mainStore', 'projectStore') @observer
class Project extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        //this.state = {
        //    listItems: projectStore.listItems,
        //    responseHeaders: projectStore.responseHeaders,
        //    currentUser: projectStore.currentUser,
        //    drawerLoading: projectStore.drawerLoading,
        //    filesChecked: projectStore.filesChecked,
        //    filesToUpload: projectStore.filesToUpload,
        //    filesRejectedForUpload: projectStore.filesRejectedForUpload,
        //    foldersChecked: projectStore.foldersChecked,
        //    loading: false,
        //    metaObjProps: projectStore.metaObjProps,
        //    moveItemList: projectStore.moveItemList,
        //    moveToObj: projectStore.moveToObj,
        //    objectTags: projectStore.objectTags,
        //    openTagManager: projectStore.openTagManager,
        //    openUploadManager: projectStore.openUploadManager,
        //    projects: projectStore.projects,
        //    project: projectStore.project,
        //    screenSize: projectStore.screenSize,
        //    searchValue: projectStore.searchValue,
        //    selectedEntity: projectStore.selectedEntity,
        //    tagAutoCompleteList: projectStore.tagAutoCompleteList,
        //    tagLabels: projectStore.tagLabels,
        //    tagsToAdd: projectStore.tagsToAdd,
        //    toggleModal: projectStore.toggleModal,
        //    uploads: projectStore.uploads,
        //    users: projectStore.users
        //};
    }

    componentDidMount() {
        let id = this.props.params.id;
        //this.unsubscribe = projectStore.listen(state => this.setState(state));
        if(projectStore.openTagManager) ProjectActions.toggleTagManager();
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
        //this.unsubscribe();
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