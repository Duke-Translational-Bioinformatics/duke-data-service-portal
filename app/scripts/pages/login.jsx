import React from 'react';
import { observer, inject } from 'mobx-react';
import Header from '../components/globalComponents/header.jsx';
import authStore from '../stores/authStore.js';
import mainStore from '../stores/mainStore.js';
import CircularProgress from 'material-ui/CircularProgress';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import {UrlGen} from '../../util/urlEnum';

@observer
class Login extends React.Component {

    componentDidMount() {
        if(this.props.location.pathname !== '/404' && authStore.appConfig.apiToken ) this.props.router.push('/');
    }

    componentDidUpdate(prevProps) {
        if(prevProps.location.pathname !== '/login' && !authStore.authServiceLoading) authStore.setLoadingStatus();
        if(authStore.appConfig.apiToken) {
            if (localStorage.getItem('redirectTo') !== null) {
                let redUrl = localStorage.getItem('redirectTo');
                document.location.replace(redUrl);
            } else {
                this.props.router.push('/');
            }
        }
    }

    createLoginUrl = () => {
        return authStore.appConfig.authServiceUri+'&state='+authStore.appConfig.serviceId+'&redirect_uri='+window.location.href;
    }

    render() {
        let content = '';
        const {error} = mainStore;
        const {appConfig, authServiceLoading} = authStore;
        if (!appConfig.apiToken) {
            let url = window.location.hash.split('&');
            let accessToken = url[0].split('=')[1];
            content = (
                <div className="mdl-cell mdl-cell--12-col mdl-shadow--2dp" style={styles.loginWrapper}>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--white">
                        <img src="images/dukeDSLogo.png" style={styles.logo}/>
                        <h2 style={{fontWeight: '100'}}>Duke Data Service</h2>
                        {!authServiceLoading ? <a href={this.createLoginUrl()} className="external">
                            <RaisedButton
                                label="Log In" labelStyle={{fontWeight: '400'}} labelColor={'#f9f9f9'}
                                backgroundColor={'#0680CD'} style={{marginBottom: 40, width: 150}}
                                onClick={() => this.handleLoginBtn()}>
                            </RaisedButton>
                        </a> : <CircularProgress size={70} thickness={5} color="#fff"/>}
                        <div className="mdl-cell mdl-cell--12-col mdl-color-text--white">
                            <a href={UrlGen.routes.publicPrivacy()} className="external mdl-color-text--white" style={{float: 'right', fontSize: 10, margin: -10}}>
                                <i className="material-icons" style={styles.privacyIcon}>lock</i>Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>
            );
            if (accessToken && appConfig.serviceId !== null) authStore.getApiToken(accessToken);
            if (error !== null) content = error
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
        authStore.isLoggedInHandler();
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
    privacyIcon: {
        fontSize: 16,
        verticalAlign: -2
    }
};

export default Login;
