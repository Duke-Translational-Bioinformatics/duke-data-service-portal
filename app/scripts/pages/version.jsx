import React from 'react'
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import provenanceStore from '../stores/provenanceStore';
import { Path } from '../util/urlEnum';
import Provenance from '../components/globalComponents/provenance.jsx';
import VersionDetails from '../components/fileComponents/versionDetails.jsx';

@observer
class Version extends React.Component {

    componentDidMount() {
        provenanceStore.resetGeneratedByActivity();
        this._loadVersion();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.params.id !== this.props.params.id) {
            this._loadVersion();
        }
    }

    componentWillReceiveProps(nextProps) {
        const routeChanged = nextProps.location !== this.props.location;
        mainStore.toggleBackButtonVisibility(routeChanged);
    }

    _loadVersion() {
        const id = this.props.params.id;
        const {drawerLoading, generatedByActivity} = provenanceStore;
        if(!drawerLoading && !generatedByActivity) {
            provenanceStore.getGeneratedByActivity(id);
        }
        mainStore.setSelectedEntity(null, null);
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