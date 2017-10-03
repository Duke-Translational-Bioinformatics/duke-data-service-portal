import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import TreeList from '../components/globalComponents/treeList.jsx';
// import AccountTreeList from '../components/globalComponents/accountTreeList.jsx';
import FileGroupDownloader from '../components/globalComponents/fileGroupDownloader.jsx';

@observer
class FileManager extends React.Component {
  componentDidMount() {
      if (mainStore.treeListItemsCustom.length == 0) {
        mainStore.getTreeListProjects(null, null);
      };
  }

    render() {
        return (
            <div>
                {/* <AccountTreeList {...this.props} /> */}
                <TreeList {...this.props} />
                <FileGroupDownloader {...this.props} />
            </div>
        );
    }
}

export default FileManager;