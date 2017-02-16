import React from 'react';
import ProjectList from '../components/projectComponents/projectList.jsx';
import AccountOverview from '../components/globalComponents/accountOverview.jsx';
import ProjectStore from '../stores/projectStore';
import ProjectActions from '../actions/projectActions';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appConfig: MainStore.appConfig,
            projects: ProjectStore.projects,
            loading: false,
            modalOpen: MainStore.modalOpen === undefined ? true : MainStore.modalOpen,
            responseHeaders: ProjectStore.responseHeaders,
            screenSize: ProjectStore.screenSize
        };
    }

    componentDidMount() {
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        if(this.state.appConfig.apiToken) {
            ProjectActions.getProjects();
            ProjectActions.getUsageDetails();
            MainActions.removeLoginCookie();
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        let dialogWidth = this.state.screenSize.width < 580 ? {width: '100%'} : {};
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
                open={this.state.modalOpen}
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
                <AccountOverview { ...this.state } { ...this.props } />
                <ProjectList { ...this.state } { ...this.props } />
                {modal}
            </div>
        );
    }

    handleAcceptButton() {
        MainActions.closePhiModal();
        this.setState({modalOpen:false})
    }

    handleDeclineButton() {
        MainStore.handleLogout();
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