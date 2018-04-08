import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import dashboardStore from '../stores/dashboardStore';
import TreeList from '../components/dashboardComponents/treeList.jsx';
import Breadcrumbs from '../components/dashboardComponents/breadcrumbs.jsx';
import ListItems from '../components/dashboardComponents/listItems.jsx';
import FileOptions from '../components/fileComponents/fileOptions.jsx';
import FolderOptions from '../components/folderComponents/folderOptions.jsx';
import ProjectOptions from '../components/projectComponents/projectOptions.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx'
import VersionUpload from '../components/fileComponents/versionUpload.jsx';
import { Path } from '../util/urlEnum';

@observer
class Dashboard extends React.Component {
    componentDidMount() {
        if (mainStore.projects.length === 0) {
            mainStore.getProjects(null, null);
        };
        dashboardStore.setRouter(this.props.router);

        if(mainStore.openTagManager) mainStore.toggleTagManager();
        mainStore.leftMenuDrawer.get('open') ? mainStore.toggleLeftMenuDrawer() : null;
        this.loadView();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.params.id !== this.props.params.id) {
            this.loadView();
        }
    }

    loadView() {
        let {id, path} = this.props.params;
        
        switch (path) {
        case 'projects':
            this._loadProject();
            break;
        case 'folders':
            this._loadFolder();
            break;
        default:
            this._loadHome();
        }
    }

    _loadHome() {
        mainStore.getProjects(null, null, true);
    }

    _loadProject() {
        let path = Path.PROJECT;
        let id = this.props.params.id;
        mainStore.getChildren(id, path);
        mainStore.getProjectDetails(id);
        mainStore.getProjectMembers(id);
        mainStore.getTagLabels(); // Used to generate a list of tag labels
        mainStore.clearSelectedItems(); // Clear checked files and folders from list
        mainStore.getUser(id);
    }

    _loadFolder() {
        let path = Path.FOLDER;
        let id = this.props.params.id;
        mainStore.getChildren(id, path);
        mainStore.getEntity(id, path);
        mainStore.getTagLabels(); // Used to generate a list of tag labels
        if(mainStore.filesChecked || mainStore.foldersChecked) mainStore.handleBatch([],[]);
    }

    render() {
        return (
            <div style={styles.main}>
                <TreeList {...this.props} />
                <div style={this.bodyStyle()}>
                    <Breadcrumbs {...this.props} />
                    <ListItems {...this.props} />
                    <FileOptions {...this.props} />
                    <FolderOptions {...this.props} />
                    <ProjectOptions {...this.props} />
                    <TagManager {...this.props} />
                    <VersionUpload {...this.props} />
                </div>
            </div>
        );
    }
    
    bodyStyle() {
        const {drawer} = dashboardStore;
        let style = {}
        if(window.innerWidth > 720) {
            style.marginLeft = drawer.get('open') ? drawer.get('width') : 0
        };
        return style;
    };
}

const styles = {
    main: {
        marginTop: -20
    }
};

export default Dashboard;