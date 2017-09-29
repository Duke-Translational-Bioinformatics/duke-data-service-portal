import React from 'react'
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import { Kind, Path } from '../util/urlEnum';
import AccountTreeList from '../components/globalComponents/accountTreeList.jsx';
import FileGroupDownloader from '../components/globalComponents/fileGroupDownloader.jsx';

@observer
class FileManager extends React.Component {
  render() {
        return (
            <div>
                <AccountTreeList { ...this.props } />
                <FileGroupDownloader { ...this.props } />
            </div>
        );
    }
}

export default FileManager;