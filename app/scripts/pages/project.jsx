import React from 'react';
import { RouteHandler } from 'react-router';
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import ProjectChildren from '../components/projectComponents/projectChildren.jsx';
import ProjectDetails from '../components/projectComponents/projectDetails.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx'

class Project extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            children: ProjectStore.children,
            currentUser: ProjectStore.currentUser,
            error: ProjectStore.error,
            errorModal: ProjectStore.errorModal,
            filesChecked: ProjectStore.filesChecked,
            foldersChecked: ProjectStore.foldersChecked,
            loading: false,
            objectTags: ProjectStore.objectTags,
            openTagManager: ProjectStore.openTagManager,
            openUploadManager: ProjectStore.openUploadManager,
            projects: ProjectStore.projects,
            project: ProjectStore.project,
            screenSize: ProjectStore.screenSize,
            tagAutoCompleteList: ProjectStore.tagAutoCompleteList,
            tagLabels: ProjectStore.tagLabels,
            searchText: ProjectStore.searchText,
            uploads: ProjectStore.uploads,
            users: ProjectStore.users
        };
    }

    componentDidMount() {
        if(this.state.searchText !== '') ProjectActions.setSearchText('');
        let id = this.props.params.id;
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        if(ProjectStore.openTagManager) ProjectActions.toggleTagManager();
        ProjectActions.getChildren(id, 'projects/');
        ProjectActions.showDetails(id);
        ProjectActions.getProjectMembers(id);
        ProjectActions.getUser(id);
        ProjectActions.getTagLabels(); // Used to generate a list of tag labels
        ProjectActions.clearSelectedItems(); // Clear checked files and folders from list
    }

    componentDidUpdate(prevProps) {
        let id = this.props.params.id;
        if(prevProps.objectTags !== this.props.objectTags) {
            ProjectActions.getTags(id, 'dds-file');
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <div>
                <ProjectDetails {...this.props} {...this.state} />
                <ProjectChildren {...this.props} {...this.state} />
                <TagManager {...this.props} {...this.state} />
            </div>
        );
    }
}

export default Project;