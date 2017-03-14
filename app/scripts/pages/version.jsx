import React from 'react'
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import { Path } from '../../util/urlEnum';
import provenanceStore from '../stores/provenanceStore';
import Provenance from '../components/globalComponents/provenance.jsx';
import VersionDetails from '../components/fileComponents/versionDetails.jsx';

@observer
class Version extends React.Component {

    componentWillMount() {
        this._loadVersion();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.params.id !== this.props.params.id) {
            this._loadVersion();
        }
    }

    _loadVersion() {
        let id = this.props.params.id;
        mainStore.getEntity(id, Path.FILE_VERSION);
        provenanceStore.getWasGeneratedByNode(id);
    }

    render() {
        return (
            <div>
                <Provenance {...this.props} />
                <VersionDetails {...this.props} />
            </div>
        );
    }
}

export default Version;