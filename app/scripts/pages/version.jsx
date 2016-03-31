import React from 'react'
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import VersionDetails from '../components/fileComponents/versionDetails.jsx';
import Header from '../components/globalComponents/header.jsx';

class Version extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: ProjectStore.error,
            errorModal: ProjectStore.errorModal,
            loading: false,
            project: ProjectStore.project,
            moveModal: ProjectStore.moveModal,
            moveErrorModal: ProjectStore.moveErrorModal
        };
    }

    componentDidMount() {
        let id = this.props.params.id;
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        this._loadVersion(id);
    }

    componentDidUpdate(prevProps) {
        let id = this.props.params.id;
        if(prevProps.params.id !== this.props.params.id) {
            this._loadVersion(id);
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _loadVersion(id) {
        let kind = 'file_versions';
        ProjectActions.getEntity(id, kind);
    }

    render() {
        return (
            <div>
                <VersionDetails {...this.props} {...this.state}/>
            </div>
        );
    }
}

export default Version;