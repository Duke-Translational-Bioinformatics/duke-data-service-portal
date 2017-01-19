import React from 'react';
import { RouteHandler } from 'react-router';
import Header from '../components/globalComponents/header.jsx';
import Footer from '../components/globalComponents/footer.jsx';
import LeftMenu from '../components/globalComponents/leftMenu.jsx';
import RetryUploads from '../components/globalComponents/retryUploads.jsx';
import Search from '../components/globalComponents/search.jsx';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions';
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Snackbar from 'material-ui/lib/snackbar';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import Theme from '../theme/customTheme.js';

let zIndex = {
    zIndex: {
        popover: 9999,
        layer: 5000
    }
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appConfig: MainStore.appConfig,
            windowWidth: window.innerWidth,
            error: MainStore.error,
            errorModal: true,
            errorModals: MainStore.errorModals,
            failedUploads: MainStore.failedUploads
        };
        this.handleResize = this.handleResize.bind(this);
    }

    getChildContext() {
        return {
            muiTheme: getMuiTheme(Theme, zIndex)
        };
    }

    componentDidMount() {
        ProjectActions.getScreenSize(window.innerHeight, window.innerWidth);
        window.addEventListener('resize', this.handleResize);
        this.unsubscribe = MainStore.listen(state => this.setState(state));
        this.showToasts();
        let app = new Framework7();
        new Framework7().addView('.view-main', {dynamicNavbar: true});
        let device = {
            android: app.device.android,
            ipad: app.device.ipad,
            iphone: app.device.iphone
        };
        if (this.state.appConfig.apiToken) MainActions.getCurrentUser();
        ProjectActions.getDeviceType(device);
        ProjectActions.loadMetadataTemplates(null);
        this.checkError();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        this.unsubscribe();
        new Framework7().closePanel();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.routerPath === '/login' && this.state.appConfig.apiToken) MainActions.getCurrentUser();
        this.showToasts();
        this.checkError();
    }

    checkError() {
        if (this.state.error && this.state.error.response){
            this.state.error.response === 404 ? this.props.appRouter.transitionTo('/notFound') : null;
            this.state.error.response != 404 ? console.log(this.state.error.msg) : null;
        }
    }

    handleResize(e) {
        this.setState({windowWidth: window.innerWidth});
        ProjectActions.getScreenSize(window.innerHeight, window.innerWidth);
    }

    createLoginUrl() {
        return this.state.appConfig.authServiceUri + "/authenticate?client_id=" +
            this.state.appConfig.serviceId + "&state=" + this.state.appConfig.securityState;
    }

    render() {
        let content = <RouteHandler {...this.props} {...this.state}/>;
        let toasts = null;
        let dialogs = null;
        if (this.state.appConfig.apiToken) {
            if (localStorage.getItem('redirectTo') !== null) {
                setTimeout(() => {
                    localStorage.removeItem('redirectTo');
                }, 10000);
            }
        }
        if (this.state.toasts) {
            toasts = this.state.toasts.map(obj => {
                return <Snackbar key={obj.ref} ref={obj.ref} message={obj.msg} open={true}/>
            });
        }
        if (this.state.appConfig.apiToken && this.state.errorModals) {
            dialogs = this.state.errorModals.map(obj => {
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
                               open={this.state.errorModal}
                               onRequestClose={() => this.closeErrorModal(obj.ref)}
                               style={styles.dialogStyles}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <h3>{obj.response}</h3>
                    <h4>{obj.msg}</h4>
                    <h6>Please try again</h6>
                </Dialog>
            });
        }
        if (!this.state.appConfig.apiToken && !this.state.appConfig.isLoggedIn && this.props.routerPath !== '/login') {
            if (location.hash !== '' && location.hash !== '#/login' && location.hash !== '#/public_privacy') {
                let redUrl = location.href;
                if (typeof(Storage) !== 'undefined') {
                    localStorage.setItem('redirectTo', redUrl);
                } else {
                    this.props.appRouter.transitionTo('/login')
                }
            }
            let routeTo = this.props.routerPath === '/public_privacy' ? '/public_privacy' : '/login';
            this.props.appRouter.transitionTo(routeTo);
        }
        return (
            <span>
                <div className="statusbar-overlay"></div>
                <div className="panel-overlay"></div>
                {!this.state.appConfig.apiToken ? '' : <LeftMenu {...this.props}/>}
                <div className="views">
                    <div className="view view-main">
                        <Header {...this.props} {...this.state}/>
                        <div className="pages navbar-through toolbar-through">
                            <div data-page="index" className="page">
                                {this.state.windowWidth < 680 ? !this.state.appConfig.apiToken ? '' : <Search {...this.props} {...this.state} /> : null}
                                <div className="searchbar-overlay"></div>
                                <div className="page-content">
                                    {content}
                                    {toasts}
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
        MainActions.removeErrorModal(refId);
        this.setState({errorModal: false});
        setTimeout(() => this.setState({errorModal: true}), 500);
    }

    showToasts() {
        if (this.state.toasts) {
            this.state.toasts.map(obj => {
                setTimeout(() => MainActions.removeToast(obj.ref), 2500);
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

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default App;