import React from 'react'
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import Provenance from '../components/globalComponents/provenance.jsx';
import VersionDetails from '../components/fileComponents/versionDetails.jsx';

@observer
class Version extends React.Component {

    componentDidMount() {
        this._loadVersion();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.params.id !== this.props.params.id) {
            this._loadVersion();
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _loadVersion() {
        let id = this.props.params.id;
        let kind = 'file_versions';
        mainStore.getEntity(id, kind);
        mainStore.getWasGeneratedByNode(id);
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