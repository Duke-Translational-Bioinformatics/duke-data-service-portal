import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import ProjectList from '../components/projectComponents/projectList.jsx';
import AccountOverview from '../components/globalComponents/accountOverview.jsx';
import ListItems from '../components/navigatorComponents/listItems.jsx';

@observer
class Home extends React.Component {

    componentDidMount() {
        this.loadProjects();
    }

    componentDidUpdate() {
        this.loadProjects();
    }

    loadProjects() {
        const { projects } = mainStore;
        if(!projects.length) mainStore.getProjects(null, null, true);
    }

    render() {
        const { toggleListStyle } = mainStore;
        return (
            <div>
                <AccountOverview { ...this.props } />
                {!toggleListStyle ? <ProjectList { ...this.props } /> : <ListItems { ...this.props }/>}
            </div>
        );
    }
}

export default Home;