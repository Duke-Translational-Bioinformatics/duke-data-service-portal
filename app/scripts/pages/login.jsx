import React from 'react';
import { Link } from 'react-router';
import Header from '../components/globalComponents/header.jsx';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions.js';
import RaisedButton from 'material-ui/lib/raised-button';

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
                        <h2 style={{fontWeight: '100'}}>Duke Data Service</h2>
                        <a href={this.createLoginUrl()} className="external">
                            <RaisedButton label="Login" labelStyle={{fontWeight: '400'}} labelColor={'#f9f9f9'}
                                          backgroundColor={'#0680CD'} style={{marginBottom: 10, width: 150}}
                                          onClick={MainActions.isLoggedInHandler}>
                            </RaisedButton>
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
        maxWidth: 600,
        height: 'auto',
        textAlign: 'center',
        margin: '0 auto',
        padding: 20,
        overflow: 'auto',
        backgroundColor: '#235F9C',
        fontColor: '#f9f9f9'
    },
    logo: {
        maxWidth: '26.333%'
    },
    loader: {
        margin: '0 auto'
    }
};

export default Login;