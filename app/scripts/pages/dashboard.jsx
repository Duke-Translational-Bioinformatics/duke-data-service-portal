import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import dashboardStore from '../stores/dashboardStore';
import TreeList from '../components/dashboardComponents/treeList.jsx';
import Breadcrumbs from '../components/dashboardComponents/breadcrumbs.jsx';
import AccountListItems from '../components/dashboardComponents/accountListItems.jsx';
import FileOptions from '../components/fileComponents/fileOptions.jsx';
import FolderOptions from '../components/folderComponents/folderOptions.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx'
import UploadManager from '../components/globalComponents/uploadManager.jsx';
import VersionUpload from '../components/fileComponents/versionUpload.jsx';

@observer
class Dashboard extends React.Component {
    componentDidMount() {
        if (mainStore.projects.length === 0) {
            mainStore.getProjects(null, null);
        };
        if(mainStore.openTagManager) mainStore.toggleTagManager();
        mainStore.getTagLabels(); // Used to generate a list of tag labels
        dashboardStore.setDrawer();
        mainStore.setRouter(this.props.router);
    }

    render() {
        return (
            <div>
                <TreeList {...this.props} />
                <Breadcrumbs {...this.props} />
                <AccountListItems {...this.props} />
                <FileOptions {...this.props} />
                <FolderOptions {...this.props} />
                <TagManager {...this.props} />
                <UploadManager {...this.props} />
                <VersionUpload {...this.props} />
            </div>
        );
    }
}

export default Dashboard;