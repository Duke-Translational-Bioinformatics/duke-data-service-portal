import React from 'react';
import { RouteHandler } from 'react-router';
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import ProjectChildren from '../components/projectComponents/projectChildren.jsx';
import MemberManagement from '../components/projectComponents/memberManagement.jsx';
import Header from '../components/globalComponents/header.jsx';


class Members extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {

        };
    }

    componentDidMount() {
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        ProjectActions.getProjectMembers(id);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <div>
                <MemberManagement {...this.props} {...this.state} />
            </div>
        );
    }
}

export default Members;