import React from 'react';
import ProjectList from '../components/projectComponents/projectList.jsx';
import AccountOverview from '../components/globalComponents/accountOverview.jsx';
import ProjectStore from '../stores/projectStore';
import ProjectActions from '../actions/projectActions';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions';
import cookie from 'react-cookie';

let mui = require('material-ui'),
    Snackbar = mui.Snackbar,
    Dialog = mui.Dialog;

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: ProjectStore.projects,
            files: ProjectStore.files,
            folders: ProjectStore.folders,
            loading: false,
            modalOpen: MainStore.modalOpen
        };
    }


    componentDidMount() {
        let id = this.props.params.id;
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        ProjectActions.loadProjects(id);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        let standardActions = [
            {text: 'ACCEPT', onTouchTap: this.handleAcceptButton.bind(this)},
            {text: 'DECLINE', onTouchTap: this.handleDeclineButton.bind(this)}
        ];
        let modal = (
                <Dialog
                    style={styles.dialogStyles}
                    title="Terms of Use - Protected Health Information"
                    actions={standardActions}
                    ref="phi"
                    openImmediately={this.state.modalOpen}
                    modal={true}>
                    <div style={{height: '300px'}}>
                        <p style={styles.main}><b>The Health Insurance Portability and Accountability Act of 1996 (HIPAA) established standards
                            for health information that must be kept private and secure, called Protected Health Information
                            (PHI).</b><br/>The use of PHI within Duke Data Service is prohibited. By clicking “accept” below, you
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
        this.refs.phi.dismiss(MainActions.closePhiModal());
    }
    handleDeclineButton() {
        MainStore.handleLogout();
    }
}

var styles = {
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F'
    },
    main: {
        textAlign: 'left'
    }
};


export default Home;