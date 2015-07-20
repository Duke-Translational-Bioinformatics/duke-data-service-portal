import React from 'react';
import ProjectList from '../components/projectList.jsx';
import ProjectStore from '../stores/projectStore';
import ProjectListActions from '../actions/projectListActions';

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
                <h4 style={styles.pageTitle}>Projects</h4>
                <ProjectList { ...this.state } />
            </div>
        );
    }
}

var styles = {
    pageTitle: {
        padding: 30,
        margin: 20
    }
};

export default Home;