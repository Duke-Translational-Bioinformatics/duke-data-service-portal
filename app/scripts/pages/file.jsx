import React from 'react'
import ProjectListActions from '../actions/projectListActions';
import ProjectStore from '../stores/projectStore';
import Header from '../components/header.jsx';

class File extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {

        return (
            <div>
                <h2>This is where a file will be displayed</h2>
            </div>
        );
    }
}

export default File;