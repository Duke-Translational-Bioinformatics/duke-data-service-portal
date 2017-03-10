import React from 'react'
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import provenanceStore from '../stores/provenanceStore';
import { Kind, Path } from '../../util/urlEnum';
import FileDetails from '../components/fileComponents/fileDetails.jsx';
import FileOptions from '../components/fileComponents/fileOptions.jsx';
import Provenance from '../components/globalComponents/provenance.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx';

@observer
class File extends React.Component {

    componentDidMount() {
        this._loadFile();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.params.id !== this.props.params.id) {
            this._loadFile();
        }
        //if(prevProps.objectTags !== this.props.objectTags) {
        //    mainStore.getTags(id, Kind.DDS_FILE);
        //}
    }

    _loadFile() {
        let id = this.props.params.id;
        mainStore.getEntity(id, Path.FILE);
        mainStore.getFileVersions(id);
        mainStore.getObjectMetadata(id, Kind.DDS_FILE);
        mainStore.getTags(id, Kind.DDS_FILE);
        mainStore.getTagLabels(); // Used to generate a list of tag labels
        if(mainStore.filesChecked || mainStore.foldersChecked) mainStore.handleBatch([],[]);
    }

    render() {
        return (
            <div>
                <Provenance {...this.props} {...this.state}/>
                <FileDetails {...this.props} />
                <FileOptions {...this.props} />
                <TagManager {...this.props} />
            </div>
        );
    }
}

export default File;