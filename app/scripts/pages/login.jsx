import React from 'react';
import { Link } from 'react-router';
import Header from '../components/globalComponents/header.jsx';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions.js';
var mui = require('material-ui'),
    Paper = mui.Paper;

class Login extends React.Component {

    constructor() {
        this.state = {
            appConfig: MainStore.appConfig
        }
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
        let content = '';
        if (!this.state.appConfig.apiToken) {
            content = (
                <div className="mdl-card mdl-shadow--2dp mdl-color-text--grey-700" style={styles.loginWrapper}>
                    <div style={styles.loginMessage}>
                        <h2>Welcome to Duke Data Service</h2>

                        <h3>Please Login</h3>
                    </div>
                    <a href={this.createLoginUrl()} className="external" onClick={MainActions.isLoggedInHandler}>
                        <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored">
                            LOGIN
                        </button>
                    </a>
                </div>
            );
            let splitUrl = window.location.hash.split('&');//Todo //////Need to fix this to be more defensive////////////
            let accessToken = splitUrl[0].split('=')[1];
            if (this.state.error) {
                content = this.state.error
            }
            else if (this.state.asValidateLoading || this.state.ddsApiTokenLoading) {
                content = (<div className="mdl-progress mdl-js-progress mdl-progress__indeterminate loader"
                                style={styles.loader}></div>);
            }
            else if (this.state.signedInfo) {
                MainActions.getDdsApiToken(this.state.appConfig, this.state.signedInfo);
            }
            else if (accessToken) {
                MainActions.authenticationServiceValidate(this.state.appConfig, accessToken);
            }
        } else {
            this.props.appRouter.transitionTo('/home');
        }
        return (
            <div>
                <div className="content">
                    {content}
                </div>
            </div>
        );
    }

}

var styles = {
    loginWrapper: {
        width: '90vw',
        height: 'auto',
        textAlign: 'center',
        margin: '0 auto',
        padding: 10,
        marginTop: 80
    },
    loader: {
        margin: '0 auto'
    }
};


export default Login;