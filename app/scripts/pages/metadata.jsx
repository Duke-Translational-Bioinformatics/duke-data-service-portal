import React from 'react'
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import MetadataTemplateList from '../components/globalComponents/metadataTemplateList.jsx';
import MetadataTemplateManager from '../components/globalComponents/metadataTemplateManager.jsx';

class Metadata extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: ProjectStore.currentUser,
            loading: false,
            screenSize: ProjectStore.screenSize,
            metadataTemplate: ProjectStore.metadataTemplate,
            metaTemplates: ProjectStore.metaTemplates,
            toggleModal: ProjectStore.toggleModal,
            openMetadataManager: ProjectStore.openMetadataManager,
            showPropertyCreator: ProjectStore.showPropertyCreator,
            showTemplateCreator: ProjectStore.showTemplateCreator,
            showTemplateDetails: ProjectStore.showTemplateDetails,
            templateProperties: ProjectStore.templateProperties
        };
    }

    componentDidMount() {
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        if(ProjectStore.openMetadataManager) ProjectActions.toggleMetadataManager();
        this._loadMetadata();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _loadMetadata() {
        ProjectActions.getUser();
        ProjectActions.loadMetadataTemplates(null);
    }

    render() {
        return (
            <div style={styles.container}>
                <MetadataTemplateList {...this.props} {...this.state} />
                <MetadataTemplateManager {...this.props} {...this.state} />
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