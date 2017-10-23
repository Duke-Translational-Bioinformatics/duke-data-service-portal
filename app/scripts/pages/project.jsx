import React from 'react';
import { observer, inject } from 'mobx-react';
import mainStore from '../stores/mainStore';
import ListItems from '../components/globalComponents/listItems.jsx';
import ProjectDetails from '../components/projectComponents/projectDetails.jsx';
import FileOptions from '../components/fileComponents/fileOptions.jsx';
import FolderOptions from '../components/folderComponents/folderOptions.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx';
import VersionUpload from '../components/fileComponents/versionUpload.jsx';
import { Path, Kind } from '../util/urlEnum';

@observer
class Project extends React.Component {

    componentDidMount() {
        let id = this.props.params.id;
        if(mainStore.openTagManager) mainStore.toggleTagManager();
        mainStore.getChildren(id, Path.PROJECT);
        mainStore.getProjectDetails(id);
        mainStore.getProjectMembers(id);
        mainStore.getTagLabels(); // Used to generate a list of tag labels
        mainStore.clearSelectedItems(); // Clear checked files and folders from list
        mainStore.getUser(id);
    }

    render() {
        return (
            <div>
                <ProjectDetails {...this.props} />
                <ListItems {...this.props} />
                <FileOptions {...this.props} />
                <FolderOptions {...this.props} />
                <TagManager {...this.props} />
                <VersionUpload {...this.props} />
            </div>
        );
    }
}

export default Project;