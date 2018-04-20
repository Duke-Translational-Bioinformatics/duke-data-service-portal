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
import { UrlGen, Path } from '../util/urlEnum';

@observer
class Dashboard extends React.Component {
    componentDidMount() {
        const { leftMenuDrawer, openTagManager, selectedEntity } = mainStore;
        const { selectedItem } = dashboardStore;
        let params = this.props.params
        mainStore.getProjects(null, null, true);
        
        if(leftMenuDrawer.get('open')) mainStore.toggleLeftMenuDrawer();
        if(params && params.id) {
            dashboardStore.clearListItems();
        };
        this.loadItems();
    }

    componentDidUpdate(prevProps) {
        const { projects } = mainStore;
        const { downloadedItems, selectedItem } = dashboardStore;
        let params = this.props.params;
        if(params && prevProps && prevProps.params && prevProps.params.id !== params.id) {
            dashboardStore.clearListItems();
            this.loadItems();
        };
    }

    // HelperFunctions
    listKind() {
        let pathname = this.props.router.location.pathname
        if (pathname === UrlGen.pathname.home()) {
            return 'Projects';
        } else if (pathname === UrlGen.pathname.dashboardHome()) {
            return 'Projects';
        } else if (pathname.includes(UrlGen.pathname.agents())) {
            return 'Agents';
        } else if (pathname.includes(UrlGen.pathname.dashboardProject())) {
            return 'ProjectChildren'
        } else if (pathname.includes(UrlGen.pathname.dashboardFolder())) {
            return 'FolderChildren'
        }
    }

    isListKind(listKindQuery) {
        if (listKindQuery === 'FoldersFiles') {
            return this.listKind() === 'ProjectChildren' || this.listKind() === 'FolderChildren';
        } else {
            return listKindQuery === this.listKind();
        }
    }

    loadItems() {
        let pathname = this.props.router.location.pathname
        if (pathname === UrlGen.pathname.home()) {
            this._loadProjects();
        } else if (pathname === UrlGen.pathname.dashboardHome()) {
            this._loadProjects();
        } else if (pathname.includes(UrlGen.pathname.dashboardProject())) {
            this._loadProjectChildren();
        } else if (pathname.includes(UrlGen.pathname.dashboardFolder())) {
            this._loadFolderChildren();
        } else if (pathname.includes(UrlGen.pathname.agents())) {
            this._loadAgents();
        }
    }

    _loadAgents() {
        if(authStore.userKey.key) authStore.getUserKey();
        if(!authStore.currentUser) authStore.getCurrentUser();
        agentStore.getAgents();
    }

    _loadProjects() {
        dashboardStore.setSelectedItem(null);
    }

    _loadProjectChildren() {
        let path = Path.PROJECT;
        let params = this.props.params;
        mainStore.getEntity(params.id, path);
        dashboardStore.setSelectedItem(params.id, path);
        dashboardStore.getChildren(params.id, path);
        mainStore.clearSelectedItems(); // Clear checked files and folders from list
        mainStore.getUser(params.id);
    }

    _loadFolderChildren() {
        let path = Path.FOLDER;
        let params = this.props.params;
        mainStore.getEntity(params.id, path);
        dashboardStore.setSelectedItem(params.id, path);
        dashboardStore.getChildren(params.id, path);
        mainStore.clearSelectedItems(); // Clear checked files and folders from list
        if(mainStore.filesChecked || mainStore.foldersChecked) mainStore.handleBatch([],[]);
    }

    render() {
      
        return (
            <div style={styles.main}>
                <TreeList {...this.props} />
                <div style={this.bodyStyle()}>
                    <Breadcrumbs {...this.props} />
                    <ListItems {...this.props} />
                    {this.isListKind('FoldersFiles') && <FileOptions {...this.props} />}
                    {this.isListKind('FolderChildren') && <FolderOptions {...this.props} />}
                    {this.isListKind('Projects') && <ProjectOptions {...this.props} />}
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
        marginTop: '-20px'
    }
};

export default Dashboard;