import React from 'react'
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import FolderPath from '../components/folderComponents/folderPath.jsx';
import FolderChildren from '../components/folderComponents/folderChildren.jsx';

class Folder extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            children: ProjectStore.children,
            project: ProjectStore.project,
            loading: false
        };
    }

    componentDidMount() {
        let id = this.props.params.id;
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        this._loadFolder(id);
    }

    componentDidUpdate(prevProps, prevState) {
        let id = this.props.params.id;
        if(prevProps.params.id !== this.props.params.id)
            this._loadFolder(id);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _loadFolder(id) {
        ProjectActions.loadFolderChildren(id);
        ProjectActions.getContainer(id);
    }

    render() {
        return (
            <div>
                <FolderPath {...this.state} {...this.props} />
                <FolderChildren {...this.state} {...this.props} />
            </div>
        );
    }
}

var styles = {
    container: {
        marginTop: 20,
        padding: '10px 0px 10px 0px'
    },
    arrow: {
        textAlign: 'left'
    },
    detailsTitle: {
        textAlign: 'left',
        float: 'left'
    },
    breadcrumbs: {
        fontSize: 24
    },
    folderName: {
        fontSize: 14
    },
    moreIcon: {
        fontSize: 36,
        verticalAlign: -11
    },
    backIcon: {
        fontSize: 24,
        verticalAlign: -6
    }
};

export default Folder;