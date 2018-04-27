import React from 'react'
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import {Path} from '../util/urlEnum';
import FolderPath from '../components/folderComponents/folderPath.jsx';
import ListItems from '../components/globalComponents/listItems.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx'
import VersionUpload from '../components/fileComponents/versionUpload.jsx';

@observer
class Folder extends React.Component {

    componentDidMount() {
        if(mainStore.openTagManager) mainStore.toggleTagManager();
        mainStore.leftMenuDrawer.get('open') ? mainStore.toggleLeftMenuDrawer() : null;
        this._loadFolder();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.params.id !== this.props.params.id) {
            this._loadFolder();
        }
    }

    componentWillReceiveProps(nextProps) {
        const routeChanged = nextProps.location !== this.props.location;
        mainStore.toggleBackButtonVisibility(routeChanged);
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
            <div>
                <FolderPath {...this.props} />
                <ListItems {...this.props} />
                <TagManager {...this.props} />
                <VersionUpload {...this.props} />
            </div>
        );
    }
}

export default Folder;