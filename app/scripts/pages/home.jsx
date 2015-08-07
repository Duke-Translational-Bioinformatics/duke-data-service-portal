import React from 'react';
import ProjectList from '../components/projectList.jsx';
import AccountOverview from '../components/accountOverview.jsx';
import ProjectStore from '../stores/projectStore';
import ProjectListActions from '../actions/projectListActions';
let mui = require('material-ui');


class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            loading: false
        };
    }

    componentDidMount() {
        this.unsubscribe = ProjectStore.listen(this.onStatusChange.bind(this));
        ProjectListActions.loadProjects();
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
                <AccountOverview {...this.state} />
                <ProjectList { ...this.state } />
            </div>
        );
    }
}


export default Home;