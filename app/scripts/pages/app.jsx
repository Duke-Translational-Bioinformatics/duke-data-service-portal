import React from 'react';
import { observer } from 'mobx-react';
import { Color } from '../theme/customTheme';
import authStore from '../stores/authStore';
import mainStore from '../stores/mainStore';
import Header from '../components/globalComponents/header.jsx';
import Footer from '../components/globalComponents/footer.jsx';
import LeftMenu from '../components/globalComponents/leftMenu.jsx';
import RetryUploads from '../components/globalComponents/retryUploads.jsx';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Theme } from '../theme/customTheme';

let zIndex = {
    zIndex: {
        popover: 9999,
        layer: 5000
    }
};

@observer
class App extends React.Component {

    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.$$ = Dom7;
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    };

    getChildContext() {
        return {
            muiTheme: getMuiTheme(Theme, zIndex)
        };
    }

    componentDidMount() {
        authStore.getAuthProviders();
        mainStore.getScreenSize(window.innerHeight, window.innerWidth);
        window.addEventListener('resize', this.handleResize);
        this.showToasts();
        let app = new Framework7();
        new Framework7().addView('.view-main', {dynamicNavbar: true});
        let device = {
            android: app.device.android,
            ipad: app.device.ipad,
            iphone: app.device.iphone
        };
        mainStore.getDeviceType(device);
        if(authStore.appConfig.apiToken) {
            authStore.getCurrentUser();
            mainStore.loadMetadataTemplates(null);
            authStore.removeLoginCookie();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        new Framework7().closePanel();
    }

    componentWillMount() {
        if(!authStore.appConfig.apiToken && !authStore.appConfig.isLoggedIn && this.props.location.pathname !== '/login') {
            if (location.hash !== '' && location.hash !== '#/login' && location.hash !== '#/public_privacy') {
                if(!authStore.redirectUrl) authStore.setRedirectUrl(location.href);
                this.props.router.push('/login');
            }
        }
    }

    componentDidUpdate(prevProps) {
        if(authStore.appConfig.apiToken && !Object.keys(authStore.currentUser).length) authStore.getCurrentUser();
        if(authStore.sessionTimeoutWarning) authStore.setRedirectUrl(location.href);
        if(prevProps.location.pathname !== this.props.location.pathname) this.$$('.page-content').scrollTo(0, 0);
        this.showToasts();
    }

    handleResize() {
        mainStore.getScreenSize(window.innerHeight, window.innerWidth);
    }

    createLoginUrl = () => {
        return authStore.appConfig.authServiceUri+'&state='+authStore.appConfig.serviceId+'&redirect_uri='+window.location.href;
    };

    render() {
        const {errorModals, phiModalOpen, toasts, screenSize} = mainStore;
        const {appConfig} = authStore;
        const {location} = this.props;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let dialogs, tsts = null;
        if (toasts) {
            tsts = toasts.map(obj => {
                return <Snackbar key={obj.ref} ref={obj.ref} message={obj.msg} open={true}/>
            });
        }
        if (appConfig.apiToken && errorModals.length) {
            dialogs = errorModals.map(obj => {
                const actions = <FlatButton
                    key={obj.ref}
                    ref={obj.ref}
                    label="Okay"
                    secondary={true}
                    onTouchTap={() => this.closeErrorModal(obj.ref)}
                />;
                return <Dialog key={obj.ref} ref={obj.ref} message={obj.msg}
                               contentStyle={dialogWidth}
                               title="An Error Occurred"
                               actions={actions}
                               modal={false}
                               open={true}
                               onRequestClose={() => this.closeErrorModal(obj.ref)}
                               style={styles.dialogStyles}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <h3>{obj.response}</h3>
                    <h4>{obj.msg}</h4>
                    <h6>Please try again</h6>
                </Dialog>
            });
        }
        if (authStore.sessionTimeoutWarning) {
            const actions = [
                <FlatButton
                    label="Logout"
                    secondary={true}
                    onTouchTap={() => authStore.handleLogout()}/>,
                <a href={this.createLoginUrl()} className="external">
                    <FlatButton
                        label="Refresh Session"
                        secondary={true}
                        style={styles.refreshBtn}
                        onClick={() => this.handleLoginBtn()}>
                    </FlatButton>
                </a>
            ];
            dialogs = <Dialog title="Your session will expire in 3 minutes"
                              contentStyle={dialogWidth}
                              actions={actions}
                              modal={false}
                              open={true}
                              style={styles.dialogStyles}>
                <i className="material-icons" style={styles.warning}>warning</i>
                <h6>If you want to stay logged in, please refresh your session.</h6>
            </Dialog>
        }
        if (!location.pathname.includes('/login') && (phiModalOpen === undefined || phiModalOpen)) {
            const actions = [
                <FlatButton
                    label="Cancel"
                    secondary={true}
                    onTouchTap={() => this.handleDeclineButton()} />,
                <FlatButton
                    label="ACCEPT"
                    secondary={true}
                    onTouchTap={() => this.handleAcceptButton()} />
            ];
            dialogs = <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Terms of Use - Protected Health Information"
                    actions={actions}
                    autoDetectWindowHeight={true}
                    open={phiModalOpen === undefined ? true : phiModalOpen}
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
        }
        // if (serviceOutageNoticeModalOpen && !location.pathname.includes('/login') && !phiModalOpen) {
        //    const actions = [
        //         <FlatButton
        //             label="Cancel"
        //             secondary={true}
        //             onTouchTap={() => this.handleDeclineButton()} />,
        //         <FlatButton
        //             label="ACCEPT"
        //             secondary={true}
        //             onTouchTap={() => this.handleAcceptButton()} />
        //     ];
        //     dialogs = <Dialog
        //         style={styles.dialogStyles}
        //         contentStyle={dialogWidth}
        //         title="System Maintenance Schedule"
        //         actions={actions}
        //         autoDetectWindowHeight={true}
        //         open={ true }
        //         modal={true}>
        //         <div style={{height: '100px'}}>
        //
        //         </div>
        //     </Dialog>
        //     setTimeout(()=>{ return dialogs },4000)
        // }
        return (
            <span>
                <div className="statusbar-overlay"></div>
                <div className="panel-overlay"></div>
                {!appConfig.apiToken ? '' : <LeftMenu {...this.props}/>}
                <div className="views">
                    <div className="view view-main">
                        <Header {...this.props} {...this.state}/>
                        <div className="pages navbar-through toolbar-through">
                            <div data-page="index" className="page">
                                <div className="searchbar-overlay"></div>
                                <div className="page-content">
                                    {this.props.children}
                                    {tsts}
                                    {dialogs}
                                    <RetryUploads {...this.props} {...this.state}/>
                                    <div className="content-block searchbar-not-found">
                                        <div className="content-block-inner">Nothing Found</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer {...this.props} {...this.state}/>
                </div>
            </span>
        );
    }

    handleAcceptButton() {
        mainStore.closePhiModal();
    }

    handleDeclineButton() {
        authStore.handleLogout();
    }

    closeErrorModal(refId) {
        mainStore.removeErrorModal(refId);
        this.setState({errorModal: false});
        setTimeout(() => this.setState({errorModal: true}), 500);
    }

    showToasts() {
        if (mainStore.toasts) {
            mainStore.toasts.map(obj => {
                setTimeout(() => mainStore.removeToast(obj.ref), 2500);
            });
        }
    }

    handleLoginBtn() {
        authStore.handleLogout(401);
        authStore.isLoggedInHandler();
    }
}

const styles = {
    dialogStyles: {
        marginTop: 0,
        textAlign: 'center',
        fontColor: Color.dkBlue,
        zIndex: '9999'
    },
    main: {
        textAlign: 'left'
    },
    loginWrapper: {
        width: '90vw',
        height: 'auto',
        textAlign: 'center',
        margin: '0 auto',
        marginTop: 50,
        padding: 10
    },
    refreshBtn: {
        backgroundColor: '#E1F5FE',
        margin: '0px 10px 10px 10px'
    },
    toast: {
        position: 'absolute',
        bottom: 20,
        left: 0
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: '#F44336'
    }
};

export default App;