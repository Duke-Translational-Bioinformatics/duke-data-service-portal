import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import ListItems from '../components/globalComponents/listItems.jsx';
import ProjectDetails from '../components/projectComponents/projectDetails.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx';
import VersionUpload from '../components/fileComponents/versionUpload.jsx';
import { Path } from '../util/urlEnum';

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
        if(mainStore.leftMenuDrawer.get('open'))mainStore.toggleLeftMenuDrawer();
    }

    render() {
        return (
            <div>
                <ProjectDetails {...this.props} />
                <ListItems {...this.props} />
                <TagManager {...this.props} />
                <VersionUpload {...this.props} />
            </div>
        );
    }
}

export default Project;