import React from 'react';
import { RouteHandler, Link } from 'react-router';
import Header from '../components/header.jsx';
import LeftMenu from '../components/leftMenu.jsx';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions';
import cookie from 'react-cookie';

let mui = require('material-ui');
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
        new Framework7().addView('.view-main', {dynamicNavbar: true});
    }

    componentWillUnmount() {
        this.unsubscribe();
        new Framework7().closePanel();

    }

    createLoginUrl() {
        return this.state.appConfig.authServiceUri + "/authenticate?client_id=" + this.state.appConfig.serviceId + "&state=" + this.state.appConfig.securityState;
    }


    render() {
        let content = <RouteHandler {...this.props} {...this.state}/>;
        if (!this.state.appConfig.apiToken && this.state.isLoggingIn == false && this.props.routerPath !== '/login') {
            this.props.appRouter.transitionTo('/login');
        }
        return (
            <span>
                <div className="statusbar-overlay"></div>
                <div className="panel-overlay"></div>
                {!this.state.appConfig.apiToken ? '' : <LeftMenu />}
                <div className="views">
                    <div className="view view-main">
                            <Header />
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
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        );
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

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default App;