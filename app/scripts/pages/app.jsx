import React from 'react';
import { observer, inject } from 'mobx-react';
import authStore from '../stores/authStore';
import mainStore from '../stores/mainStore';
import ProjectActions from '../actions/projectActions';
import projectStore from '../stores/projectStore';
import Header from '../components/globalComponents/header.jsx';
import Footer from '../components/globalComponents/footer.jsx';
import LeftMenu from '../components/globalComponents/leftMenu.jsx';
import RetryUploads from '../components/globalComponents/retryUploads.jsx';
import Search from '../components/globalComponents/search.jsx';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Theme from '../theme/customTheme.js';

let zIndex = {
    zIndex: {
        popover: 9999,
        layer: 5000
    }
};

@inject('authStore', 'mainStore', 'projectStore') @observer
class App extends React.Component {

    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
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
        if (authStore.appConfig.apiToken) {
            authStore.getCurrentUser();
            ProjectActions.loadMetadataTemplates(null);
        }
        this.checkError();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        new Framework7().closePanel();
    }

    componentWillMount() {
        if(authStore.appConfig.apiToken && !Object.keys(authStore.currentUser).length) authStore.getCurrentUser();
        if (!authStore.appConfig.apiToken && !authStore.appConfig.isLoggedIn && this.props.location.pathname !== '/login') {
            if (location.hash !== '' && location.hash !== '#/login' && location.hash !== '#/public_privacy') {
                let redUrl = location.href;
                if (typeof(Storage) !== 'undefined') {
                    localStorage.setItem('redirectTo', redUrl);
                } else {
                    this.props.router.push('/login')
                }
            }
            let routeTo = this.props.location.pathname === '/public_privacy' ? '/public_privacy' : '/login';
            this.props.router.push(routeTo);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(authStore.appConfig.apiToken && !Object.keys(authStore.currentUser).length) authStore.getCurrentUser();
        this.showToasts();
        this.checkError();
    }

    checkError() {
        if (mainStore.error && mainStore.error.response){
            if(mainStore.error.response === 404) {
                mainStore.clearErrors();
                setTimeout(()=>this.props.router.push('/404'),1000);
            }
            mainStore.error.response != 404 ? console.log(mainStore.error.msg) : null;
        }
    }

    handleResize(e) {
        this.setState({windowWidth: window.innerWidth});
        mainStore.getScreenSize(window.innerHeight, window.innerWidth);
    }

    createLoginUrl() {
        return authStore.appConfig.authServiceUri + "/authenticate?client_id=" +
            authStore.appConfig.serviceId + "&state=" + authStore.appConfig.securityState;
    }

    render() {
        const {errorModals, screenSize, toasts} = mainStore;
        const {appConfig} = authStore;
        let dialogs, tsts = null;
        if (appConfig.apiToken) {
            if (localStorage.getItem('redirectTo') !== null) {
                setTimeout(() => {
                    localStorage.removeItem('redirectTo');
                }, 10000);
            }
        }
        if (toasts) {
            tsts = toasts.map(obj => {
                return <Snackbar key={obj.ref} ref={obj.ref} message={obj.msg} open={true}/>
            });
        }
        if (appConfig.apiToken && errorModals) {
            dialogs = errorModals.map(obj => {
                let actions = <FlatButton
                    key={obj.ref}
                    ref={obj.ref}
                    label="Okay"
                    secondary={true}
                    onTouchTap={() => this.closeErrorModal(obj.ref)}
                    />;
                return <Dialog key={obj.ref} ref={obj.ref} message={obj.msg}
                               title="An Error Occurred"
                               actions={actions}
                               modal={false}
                               open={mainStore.errorModal}
                               onRequestClose={() => this.closeErrorModal(obj.ref)}
                               style={styles.dialogStyles}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <h3>{obj.response}</h3>
                    <h4>{obj.msg}</h4>
                    <h6>Please try again</h6>
                </Dialog>
            });
        }
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
                                {Object.keys(screenSize).length !== 0 && screenSize.width < 680 ? !appConfig.apiToken ? '' : <Search {...this.props} {...this.state} /> : null}
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
}

var styles = {
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '9999'
    },
    loginWrapper: {
        width: '90vw',
        height: 'auto',
        textAlign: 'center',
        margin: '0 auto',
        marginTop: 50,
        padding: 10
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