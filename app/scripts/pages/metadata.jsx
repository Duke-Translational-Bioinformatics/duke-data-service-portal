import React from 'react'
import { observer } from 'mobx-react';
import authStore from '../stores/authStore';
import mainStore from '../stores/mainStore';
import MetadataTemplateList from '../components/globalComponents/metadataTemplateList.jsx';
import MetadataTemplateManager from '../components/globalComponents/metadataTemplateManager.jsx';

@observer
class Metadata extends React.Component {

    componentDidMount() {
        if(mainStore.openMetadataManager) mainStore.toggleMetadataManager();
        this._loadMetadata();
    }

    _loadMetadata() {
        authStore.getCurrentUser();
        mainStore.loadMetadataTemplates(null);
    }

    render() {
        return (
            <div style={styles.container}>
                <MetadataTemplateList {...this.props} />
                <MetadataTemplateManager {...this.props} />
            </div>
        );
    }
}

const styles = {
    container: {
        marginTop: 85
    }
};

export default Metadata;