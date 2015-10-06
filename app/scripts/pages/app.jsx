import React from 'react';
import { RouteHandler, Link } from 'react-router';
import Header from '../components/globalComponents/header.jsx';
import LeftMenu from '../components/globalComponents/leftMenu.jsx';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions';
import cookie from 'react-cookie';

let mui = require('material-ui'),
    Snackbar = mui.Snackbar;
let ThemeManager = new mui.Styles.ThemeManager();
let appPalette = {
    primary1Color: "#303F9F",
    primary2Color: "#3F51B5",
    primary3Color: "#C5CAE9",
    accent1Color: "#448AFF",
    accent2Color: "#ED2B2B",
    accent3Color: "#F58C8C"
};

class App extends React.Component {
    constructor() {
        this.state = {
            appConfig: MainStore.appConfig,
            apiToken: cookie.load('apiToken'),
            currentUser: cookie.load('currentUser'),
            isLoggingIn: cookie.load('isLoggingIn'),
        }
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    }

    componentWillMount() {
        ThemeManager.setPalette(appPalette);
    }

    componentDidMount() {
        this.unsubscribe = MainStore.listen(state => this.setState(state));
        this.showToasts();
        new Framework7().addView('.view-main', {dynamicNavbar: true});
    }

    componentWillUnmount() {
        this.unsubscribe();
        new Framework7().closePanel();
    }

    componentDidUpdate(prevProps, prevState) {
        this.showToasts();
    }


    createLoginUrl() {
        return this.state.appConfig.authServiceUri + "/authenticate?client_id=" + this.state.appConfig.serviceId + "&state=" + this.state.appConfig.securityState;
    }


    render() {
        let toasts = null;
        if (this.state.toasts) {
            toasts = this.state.toasts.map(obj => {
                return <Snackbar key={obj.ref} ref={obj.ref} message={obj.msg} autoHideDuration={1500} openOnMount={true}/>
            });
        }
        let content = <RouteHandler {...this.props} {...this.state}/>;
        if (!this.state.appConfig.apiToken && !this.state.isLoggingIn && this.props.routerPath !== '/login') {
            this.props.appRouter.transitionTo('/login');
        }
        return (
            <span>
                <div className="statusbar-overlay"></div>
                <div className="panel-overlay"></div>
                {!this.state.appConfig.apiToken ? '' : <LeftMenu />}
                <div className="views">
                    <div className="view view-main">
                        <Header {...this.props} {...this.state}/>

                        <div className="pages navbar-through toolbar-through">
                            <div data-page="index" className="page">
                                {!this.state.appConfig.apiToken ? '' : <form className="searchbar" action="#">
                                    <div className="searchbar-input">
                                        <input type="search" placeholder="Search" style={styles.searchBar}/>
                                        <a href="#" className="searchbar-clear"></a>
                                    </div>
                                    <a href="#" className="searchbar-cancel">Cancel</a>
                                </form>}
                                <div className="searchbar-overlay"></div>
                                <div className="page-content">
                                    {content}
                                    {toasts}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        );
    }

    showToasts() {
        if (this.state.toasts) {
            this.state.toasts.map(obj => {
                console.log('show toast: '+ obj.ref);
                setTimeout(() => MainActions.removeToast(obj.ref), 1500);
            });
        }

    }
}

var styles = {
    searchBar: {
        width: '50vw',
        margin: '0 auto'
    },
    loginWrapper: {
        width: '90vw',
        height: 'auto',
        textAlign: 'center',
        margin: '0 auto',
        marginTop: 50,
        padding: 10
    }
}

App
    .
    childContextTypes = {
    muiTheme: React.PropTypes.object
};

export
default
App;