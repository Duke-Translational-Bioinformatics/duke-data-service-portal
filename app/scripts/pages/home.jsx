import React from 'react';
import { observer } from 'mobx-react';
import authStore from '../stores/authStore';
import mainStore from '../stores/mainStore';
import ProjectList from '../components/projectComponents/projectList.jsx';
import AccountOverview from '../components/globalComponents/accountOverview.jsx';

@observer
class Home extends React.Component {

    render() {
        return (
            <div>
                <AccountOverview { ...this.props } />
                <ProjectList { ...this.props } />
            </div>
        );
    }
}

export default Home;