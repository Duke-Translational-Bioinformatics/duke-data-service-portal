import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import ProjectList from '../components/projectComponents/projectList.jsx';
import AccountOverview from '../components/globalComponents/accountOverview.jsx';
import DashboardListItems from '../components/dashboardComponents/dashboardListItems.jsx';

@observer
class Home extends React.Component {

    componentDidMount() {
        mainStore.getProjects(null, null, true);
    }
    
    componentDidUpdate() {
        mainStore.getProjects(null, null, true);
    }

    render() {
        const { toggleListStyle } = mainStore;
        return (
            <div>
                <AccountOverview { ...this.props } />
                {!toggleListStyle ? <ProjectList { ...this.props } /> : <DashboardListItems { ...this.props }/>}
            </div>
        );
    }
}

export default Home;