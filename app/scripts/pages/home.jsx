import React from 'react';
import ProjectList from '../components/projectList.jsx';
import AccountOverview from '../components/accountOverview.jsx';
import ProjectStore from '../stores/projectStore';
import ProjectListActions from '../actions/projectListActions';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions';
let mui = require('material-ui');


class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            files: [],
            folders: [],
            loading: false
        };
    }

    componentDidMount() {
        let id = this.props.params.id;
        this.unsubscribe = ProjectStore.listen(this.onStatusChange.bind(this));
        ProjectListActions.loadProjects(id);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange(state) {
        this.setState(state);
    }

    render() {
        return (
            <div>
                <AccountOverview { ...this.state } { ...this.props } />
                <ProjectList { ...this.state } { ...this.props } />
            </div>
        );
    }
}


export default Home;