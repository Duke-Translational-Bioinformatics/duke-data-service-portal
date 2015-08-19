import React from 'react';
import { RouteHandler } from 'react-router';
import Header from '../components/header.jsx';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions';

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
            appConfig: MainStore.appConfig
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
        new Framework7().addView('.view-main', { dynamicNavbar: true });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    createLoginUrl() {
        return this.state.appConfig.authServiceUri + "/authenticate?client_id=" + this.state.appConfig.serviceId + "&state=" + this.state.appConfig.securityState;
    }

    render() {
        this.state.appConfig.apiToken = "FAKE"; // TODO : remove this !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        this.state.appConfig.currentUser = "John Doe"; // TODO : remove this !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        let content = <RouteHandler {...this.props} {...this.state}/>;
        if (!this.state.appConfig.apiToken && this.props.routerPath!=='/login') {
            this.props.appRouter.transitionTo('/login');
        }
        else if (this.state.appConfig.apiToken) {
            this.props.appRouter.transitionTo('/home');
        }
        return (
            <span>
                <div className="statusbar-overlay"></div>
                <div className="panel-overlay"></div>
                <div className="panel panel-left panel-reveal">
                    <div className="content-block">
                        <p>Left panel content goes here</p>
                    </div>
                </div>
                <div className="views">
                    <div className="view view-main">
                        <Header />
                        <div className="pages navbar-through toolbar-through">
                            <div data-page="index" className="page">
                                <div className="page-content">
                                    {content}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        );
    }

}

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default App;