import React from 'react';
import { observer } from 'mobx-react';
import authStore from '../stores/authStore';
import mainStore from '../stores/mainStore';
import ProjectList from '../components/projectComponents/projectList.jsx';
import AccountOverview from '../components/globalComponents/accountOverview.jsx';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

@observer
class Home extends React.Component {

    componentDidMount() {
        if(authStore.appConfig.apiToken) {
            mainStore.getProjects();
            mainStore.getUsageDetails();
        } else {
            this.props.router.push('/login');
        }
    }

    render() {
        const {modalOpen, screenSize} = mainStore;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let standardActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleDeclineButton.bind(this)} />,
            <FlatButton
                label="ACCEPT"
                secondary={true}
                onTouchTap={this.handleAcceptButton.bind(this)} />
        ];
        let modal = (
            <Dialog
                style={styles.dialogStyles}
                contentStyle={dialogWidth}
                title="Terms of Use - Protected Health Information"
                actions={standardActions}
                autoDetectWindowHeight={true}
                open={modalOpen === undefined ? true : modalOpen}
                modal={true}>
                <div style={{height: '300px'}}>
                    <p style={styles.main}><b>The Health Insurance Portability and Accountability Act of 1996 (HIPAA)
                        established standards
                        for health information that must be kept private and secure, called Protected Health Information
                        (PHI).</b><br/>The use of PHI within the Duke Data Service is prohibited in this Alpha release. By clicking “accept”
                        below, you
                        attest that you will not enter PHI. If you are unclear about what constitutes PHI, or are
                        uncertain about the nature of the data you use, click “decline” and contact the Duke University
                        IT Security Office (security@duke.edu) for further information.</p>
                </div>
            </Dialog>
        );

        return (
            <div>
                <AccountOverview { ...this.props } />
                <ProjectList { ...this.props } />
                {modal}
            </div>
        );
    }

    handleAcceptButton() {
        mainStore.closePhiModal();
    }

    handleDeclineButton() {
        authStore.handleLogout();
    }
}

var styles = {
    dialogStyles: {
        marginTop: 0,
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '9999'
    },
    main: {
        textAlign: 'left'
    }
};

export default Home;