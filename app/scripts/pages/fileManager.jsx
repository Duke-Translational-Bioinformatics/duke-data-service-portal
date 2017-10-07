import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import TreeList from '../components/globalComponents/treeList.jsx';
import FileGroupDownloader from '../components/globalComponents/fileGroupDownloader.jsx';

@observer
class FileManager extends React.Component {
    componentDidMount() {
        if (mainStore.projects.length === 0) {
            mainStore.getProjects(null, null);
        };
    }

    render() {
        return (
            <div>
                <TreeList {...this.props} />
                <FileGroupDownloader {...this.props} />
            </div>
        );
    }
}

export default FileManager;