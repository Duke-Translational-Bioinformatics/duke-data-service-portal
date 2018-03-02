import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import dashboardStore from '../stores/dashboardStore';
import TreeList from '../components/dashboardComponents/treeList.jsx';
import Breadcrumbs from '../components/dashboardComponents/breadcrumbs.jsx';
import DashboardListItems from '../components/dashboardComponents/dashboardListItems.jsx';
import FileOptions from '../components/fileComponents/fileOptions.jsx';
import FolderOptions from '../components/folderComponents/folderOptions.jsx';
import ProjectOptions from '../components/projectComponents/projectOptions.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx'
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
        dashboardStore.setRouter(this.props.router);
    }

    render() {
        return (
            <div style={styles.main}>
                <TreeList {...this.props} />
                <Breadcrumbs {...this.props} />
                <DashboardListItems {...this.props} />
                <FileOptions {...this.props} />
                <FolderOptions {...this.props} />
                <ProjectOptions {...this.props} />
                <TagManager {...this.props} />
                <VersionUpload {...this.props} />
            </div>
        );
    }
}

const styles = {
    main: {
        marginTop: -20
    }
};

export default Dashboard;