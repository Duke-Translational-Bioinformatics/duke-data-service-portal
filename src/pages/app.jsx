import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Color } from '../theme/customTheme';
import authStore from '../stores/authStore';
import mainStore from '../stores/mainStore';
import Framework7 from 'framework7';
import Header from '../components/globalComponents/header.jsx';
import Footer from '../components/globalComponents/footer.jsx';
import LeftMenu from '../components/globalComponents/leftMenu.jsx';
import ProjectOptions from '../components/projectComponents/projectOptions.jsx';
import FileOptions from '../components/fileComponents/fileOptions.jsx';
import FolderOptions from '../components/folderComponents/folderOptions.jsx';
import RetryUploads from '../components/globalComponents/retryUploads.jsx';
import UploadManager from '../components/globalComponents/uploadManager.jsx';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Theme } from '../theme/customTheme';
const { object } = PropTypes;

let zIndex = {
    zIndex: {
        popover: 9999,
        layer: 5000,
        tooltip: 9999
    }
};

@observer
class App extends React.Component {

    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.app = new Framework7();
    }

    static childContextTypes = {
        muiTheme: object,
    };

    getChildContext() {
        return {
            muiTheme: getMuiTheme(Theme, zIndex)
        };
    }

    componentDidMount() {
        const { appConfig } = authStore;
        authStore.getAuthProviders();
        mainStore.getScreenSize(window.innerHeight, window.innerWidth);
        window.addEventListener('resize', this.handleResize);
        this.showToasts();
        let device = {
            android: this.app.device.android,
            ipad: this.app.device.ipad,
            iphone: this.app.device.iphone
        };
        mainStore.getDeviceType(device);
        if(appConfig.apiToken) {
            authStore.getCurrentUser();
            mainStore.getUsageDetails();
            mainStore.loadMetadataTemplates(null);
            authStore.removeLoginCookie();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        this.app.closePanel();
    }

    componentWillMount() {
        const { appConfig, redirectUrl } = authStore;
        let loc = window.location;
        if(!appConfig.apiToken && !appConfig.isLoggedIn && this.props.location.pathname !== '/login') {
            if (loc && loc.hash !== '' && loc.hash !== '#/login' && loc.hash !== '#/public_privacy') {
                if(!redirectUrl) authStore.setRedirectUrl(loc.href);
                this.props.router.push('/login');
            }
        }
    }

    componentDidUpdate(prevProps) {
        const { appConfig, currentUser, sessionTimeoutWarning } = authStore;
        const { params } = this.props;
        const { pathname } = this.props.location;
        if(appConfig.apiToken && !Object.keys(currentUser).length) authStore.getCurrentUser();
        if(sessionTimeoutWarning) authStore.setRedirectUrl(window.location.href);
        if(prevProps.location.pathname !== pathname || mainStore.currentLocation === null) {
            mainStore.setCurrentRouteLocation({path: pathname, id: params.id});
        }
        this.showToasts();
    }

    componentWillReceiveProps(nextProps) {
        const routeChanged = nextProps.location !== this.props.location;
        mainStore.toggleBackButtonVisibility(routeChanged, this.props.location);
    }

    handleResize() {
        mainStore.getScreenSize(window.innerHeight, window.innerWidth);
    }

    createLoginUrl = () => {
        const { appConfig } = authStore;
        return appConfig.authServiceUri+'&state='+appConfig.serviceId+'&redirect_uri='+window.location.href;
    };

    render() {
        const {errorModals, leftMenuDrawer, phiModalOpen, toasts, showFilters, screenSize, serviceOutageNoticeModalOpen} = mainStore;
        const {appConfig} = authStore;
        const {location} = this.props;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let dialogs, tsts = null;
        let slideContentClass = leftMenuDrawer.get('open') ? 'page-content slide-right' : showFilters ? 'page-content slide-left' : 'page-content';
        if (toasts) {
            tsts = toasts.map(obj => {
                return <Snackbar key={obj.ref} ref={obj.ref} message={obj.msg} open={true} bodyStyle={{height: 'auto'}}/>
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
                    label="I Don't Agree"
                    secondary={true}
                    onTouchTap={() => this.handleDeclineButton()} />,
                <FlatButton
                    label="I Agree"
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
        if (!location.pathname.includes('/login') && !phiModalOpen && (serviceOutageNoticeModalOpen === undefined || serviceOutageNoticeModalOpen)) {
           const actions = [
                <FlatButton
                    label="Don't Show This Again"
                    keyboardFocused={true}
                    secondary={true}
                    onTouchTap={() => this.handleDontShowButton(true)} />,
                <FlatButton
                    label="Remind Me Later"
                    secondary={true}
                    onTouchTap={() => this.handleDontShowButton(false)} />
            ];
            dialogs = <Dialog
                style={styles.dialogStyles}
                contentStyle={dialogWidth}
                titleStyle={{padding: '24px 24px 4px 24px'}}
                title="System Maintenance Schedule"
                actions={actions}
                autoDetectWindowHeight={true}
                open={true}
                modal={true}>
                <i className="material-icons" style={styles.icon}>info_outline</i>
                <div style={{height: '80px', textAlign: 'left'}}>
                    The Data Service at Duke development team is working to improve performance and provide new features,
                    more frequently. <br/> To allow for these updates and upgrades, the Service may be unavailable during a
                    one-hour period every Wednesday from 8:30pm-9:30pm EST.
                </div>
            </Dialog>
            setTimeout(()=>{ return dialogs },4000)
        }
        return (
            <span>
                <div className="views">
                    <div className="view view-main">
                        {!appConfig.apiToken ? '' : <LeftMenu {...this.props}/>}
                        <Header {...this.props} {...this.state}/>
                        <div className="pages">
                            <div data-page="index" className="page">
                                <div className={slideContentClass}>
                                    {this.props.children}
                                    {tsts}
                                    {dialogs}
                                    <UploadManager {...this.props}/>
                                    <RetryUploads {...this.props} {...this.state}/>
                                    <FileOptions {...this.props}/>
                                    <FolderOptions {...this.props}/>
                                    <ProjectOptions {...this.props}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer {...this.props} {...this.state}/>
                </div>
            </span>
        );
    }

    handleDontShowButton(bool) {
        mainStore.serviceWarningModal(bool);
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
            mainStore.toasts.map(obj => setTimeout(() => mainStore.removeToast(obj.ref), 3500));
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
    icon: {
    fontSize: 48,
        textAlign: 'center',
        color: Color.green
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