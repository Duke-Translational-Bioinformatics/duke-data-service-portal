import React from 'react';
import Header from '../components/globalComponents/header.jsx';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions.js';
import CircularProgress from 'material-ui/lib/circular-progress';
import LinearProgress from 'material-ui/lib/linear-progress';
import RaisedButton from 'material-ui/lib/raised-button';
import {UrlGen} from '../../util/urlEnum';

class Login extends React.Component {

    constructor() {
        this.state = {
            appConfig: MainStore.appConfig,
            loading: false
        }
    }

    componentDidMount() {
        this.unsubscribe = MainStore.listen(state => this.setState(state));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    createLoginUrl() {
        return this.state.appConfig.authServiceUri+'&state='+this.state.appConfig.serviceId+'&redirect_uri='+window.location.href;
    }

    render() {
        let content = '';
        if (!this.state.appConfig.apiToken) {
            content = (
                <div className="mdl-cell mdl-cell--12-col mdl-shadow--2dp" style={styles.loginWrapper}>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--white">
                        <img src="images/dukeDSLogo.png" style={styles.logo}/>
                        <h2 style={{fontWeight: '100'}}>Duke Data Service</h2>
                        {!this.state.loading ? <a href={this.createLoginUrl()} className="external">
                            <RaisedButton label="Log In" labelStyle={{fontWeight: '400'}} labelColor={'#f9f9f9'}
                                          backgroundColor={'#0680CD'} style={{marginBottom: 40, width: 150}}
                                          onClick={() => this.handleLoginBtn()}>
                            </RaisedButton>
                        </a> : <CircularProgress color="#fff"/>}
                        <div className="mdl-cell mdl-cell--12-col mdl-color-text--white">
                            <a href={UrlGen.routes.publicPrivacy()} className="external mdl-color-text--white" style={{float: 'right', fontSize: 10, margin: -10}}>
                                <i className="material-icons" style={{fontSize: 16, verticalAlign: -2}}>lock</i>Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>
            );
            let url = window.location.hash.split('&');
            let accessToken = url[0].split('=')[1];
            if (this.state.error) {
                content = this.state.error
            }
            else if (this.state.authServiceLoading) {
                content = (<LinearProgress mode="indeterminate" color={'#EC407A'} style={styles.loader}/>);
            }
            else if (accessToken) {
                MainActions.getApiToken(this.state.appConfig, accessToken);
            }
        } else {
            if (localStorage.getItem('redirectTo') !== null) {
                let redUrl = localStorage.getItem('redirectTo');
                document.location.replace(redUrl);
            } else {
                if(this.props.routerPath !== '/notFound') this.props.appRouter.transitionTo('/');
            }
        }
        return (
            <div>
                <div className="content">
                    {content}
                </div>
            </div>
        );
    }
    handleLoginBtn() {
        MainActions.isLoggedInHandler();
        this.setState({
            loading: true
        });
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
        margin: '0 auto',
        width: '95%'
    }
};

export default Login;
