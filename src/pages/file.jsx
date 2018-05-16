import React from 'react'
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import provenanceStore from '../stores/provenanceStore';
import { Kind, Path } from '../util/urlEnum';
import FileDetails from '../components/fileComponents/fileDetails.jsx';
import Provenance from '../components/globalComponents/provenance.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx';

@observer
class File extends React.Component {

    componentDidMount() {
        if(mainStore.leftMenuDrawer.get('open')) mainStore.toggleLeftMenuDrawer();
        this._loadFile();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.params.id !== this.props.params.id) {
            this._loadFile();
        }
    }

    componentWillReceiveProps(nextProps) {
        const routeChanged = nextProps.location !== this.props.location;
        mainStore.toggleBackButtonVisibility(routeChanged);
    }

    _loadFile() {
        let id = this.props.params.id;
        provenanceStore.resetGeneratedByActivity();
        mainStore.clearTags();
        mainStore.setSelectedEntity(null, null);
        mainStore.getEntity(id, Path.FILE);
        mainStore.getFileVersions(id);
        mainStore.getObjectMetadata(id, Kind.DDS_FILE);
        mainStore.getTags(id, Kind.DDS_FILE);
        mainStore.getTagLabels();
        if(mainStore.filesChecked || mainStore.foldersChecked) mainStore.handleBatch([],[]);
    }

    render() {
        return (
            <div>
                <Provenance {...this.props} />
                <FileDetails {...this.props} />
                <TagManager {...this.props} />
            </div>
        );
    }
}

export default File;