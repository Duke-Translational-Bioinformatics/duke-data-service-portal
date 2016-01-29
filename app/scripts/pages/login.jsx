import React from 'react';
import { Link } from 'react-router';
import Header from '../components/globalComponents/header.jsx';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions.js';

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
                <div className="mdl-cell mdl-cell--12-col mdl-shadow--2dp" style={styles.loginWrapper}>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--white">
                        <img src="images/dukeDSLogo.png" style={styles.logo}/>
                        <h1>Duke Data Service</h1>
                        <a href={this.createLoginUrl()} className="external" onClick={MainActions.isLoggedInHandler}>
                            <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdl-color-text--white" style={styles.loginButton}>
                                LOGIN
                            </button>
                        </a>
                    </div>
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
        height: 'auto',
        textAlign: 'center',
        padding: 20,
        overflow: 'auto',
        backgroundColor: '#03a9f4',
        fontColor: '#f9f9f9'
    },
    logo: {
        maxWidth: '10%'
    },
    loginButton: {
        width: 100,
        backgroundColor: '#1976D2',
        marginBottom: 10
    },
    loader: {
        margin: '0 auto'
    }
};

export default Login;