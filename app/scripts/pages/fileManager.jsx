import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import TreeList from '../components/globalComponents/treeList.jsx';
import FileGroupDownloader from '../components/globalComponents/fileGroupDownloader.jsx';
import UploadManager from '../components/globalComponents/uploadManager.jsx';
import FileOptions from '../components/fileComponents/fileOptions.jsx';
import FolderOptions from '../components/folderComponents/folderOptions.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx'
import VersionUpload from '../components/fileComponents/versionUpload.jsx';

@observer
class FileManager extends React.Component {
    componentDidMount() {
        if (mainStore.projects.length === 0) {
            mainStore.getProjects(null, null);
        };
        if(mainStore.openTagManager) mainStore.toggleTagManager();
        mainStore.getTagLabels(); // Used to generate a list of tag labels
        mainStore.setDrawer();
    }

    render() {
        return (
            <div>
                <TreeList {...this.props} />
                <FileGroupDownloader {...this.props} />
                <UploadManager {...this.props} />
                <FileOptions {...this.props} />
                <FolderOptions {...this.props} />
                <TagManager {...this.props} />
                <VersionUpload {...this.props} />
            </div>
        );
    }
}

export default FileManager;