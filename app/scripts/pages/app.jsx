import React from 'react';
import { RouteHandler } from 'react-router';
import Header from '../components/header.jsx';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions';
var queryString = require('query-string');

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
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    createLoginUrl() {
        return this.state.appConfig.authServiceUri + "/authenticate?client_id=" + this.state.appConfig.serviceId + "&state=" + this.state.appConfig.securityState;
    }

    render() {
        let content = <RouteHandler {...this.props} {...this.state}/>;
        if (!this.state.appConfig.apiToken) {
            // check url for parameters
            // - if there, show "logging you in" and emit authenticationServiceValidate(this.state.appConfig, <the values>) action
            var splitUrl = window.location.hash.split('&');//Need to fix this to be more defensive
            var accessToken = splitUrl[0].split('=')[1];
            //console.log(accessToken);
            if (this.state.error) {
                content = this.state.error
            }
            else if (this.state.asValidateLoading || this.state.ddsApiTokenLoading) {
                //show content loading
                content = (<div className="mdl-progress mdl-js-progress mdl-progress__indeterminate loader"></div>);
            }
            else if (this.state.signedInfo) {
                console.log(this.state.signedInfo);
                MainActions.getDdsApiToken(this.state.appConfig, this.state.signedInfo);
                //(this.state.apiToken) then emit the getDdsJwt(apiToken) action, also render "Logging you in"
            }
            else if (accessToken) {
                MainActions.authenticationServiceValidate(this.state.appConfig, accessToken);
            }
            else {
                content = (
                    <a href={this.createLoginUrl()}>
                        <button className="mdl-button mdl-js-button">
                            LOGIN
                        </button>
                    </a>
                );
            }
        }
        if (this.state.appConfig.apiToken) {
            content = "api token exists: " + this.state.appConfig.apiToken;
            console.log('jwt exists');
        }
        return (
            <div>
                <Header />

                <div className="content">
                    {content}
                </div>
            </div>
        );
    }

}

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default App;