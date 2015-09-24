import Reflux from 'reflux';
import MainActions from '../actions/mainActions';
import appConfig from '../../lib/config';
import cookie from 'react-cookie';

var MainStore = Reflux.createStore({

    listenables: MainActions,


    init() {
        this.currentUser = cookie.load('currentUser');
        this.appConfig = appConfig;
        this.asValidateLoading = false;
        this.ddsApiTokenLoading = false;
        this.appConfig.apiToken = cookie.load('apiToken');
        this.signedInfo = null;
        this.isLoggingIn = false;
        this.dialog = null;
    },

    authenticationServiceValidate(appConfig, accessToken) {
        this.asValidateLoading = true;
        this.trigger({
            asValidateLoading: this.asValidateLoading,
            appConfig: this.appConfig
        });
    },
    authenticationServiceValidateSuccess (signedInfo) {
        this.signedInfo = signedInfo;
        this.asValidateLoading = false;
        this.trigger({
            asValidateLoading: this.asValidateLoading,
            signedInfo: signedInfo
        });

    },
    authenticationServiceValidateError (error) {
        let msg = error && error.message ? error.message : 'An error occurred.';
        this.trigger({
            error: msg,
            asValidateLoading: false
        });
    },

    getDdsApiToken(appConfig, signedInfo) {
        this.ddsApiTokenLoading = true;
        this.trigger({
            ddsApiTokenLoading: this.ddsApiTokenLoading
        });
    },

    getDdsApiTokenSuccess (apiToken) {
        this.appConfig.apiToken = apiToken;
        this.ddsApiTokenLoading = false;
        this.trigger({
            ddsApiTokenLoading: this.ddsApiTokenLoading,
            appConfig: this.appConfig
        });
    },
    getDdsApiTokenError (error) {
        let msg = error && error.message ? error.message : 'An error occurred.';
        this.trigger({
            error: msg,
            ddsValidateLoading: false
        });
    },
    setApiToken (apiToken) {
        this.appConfig.apiToken = apiToken;
        cookie.save('apiToken', this.appConfig.apiToken);
        this.trigger({
            appConfig: this.appConfig
        });
    },
    getCurrentUser (currentUser) {
        this.appConfig.currentUser = currentUser;
        this.trigger({
            appConfig: this.appConfig,
        });
    },
    getCurrentUserSuccess (currentUser) {
        this.currentUser = currentUser;
        cookie.save('currentUser', this.currentUser);
        this.trigger({
            currentUser: this.currentUser
        });
    },
    getCurrentUserError (error) {
        let msg = error && error.message ? error.message : 'An error occurred.';
        this.trigger({
            error: msg
        });
    },
    isLoggedInHandler() {
        this.isLoggingIn = true;
        this.trigger({
            isLoggingIn: this.isLoggingIn
        });
    },
    handleLogout () {
        this.appConfig.apiToken = null;
        this.isLoggingIn = false;
        cookie.remove('apiToken');
        cookie.remove('currentUser');
        this.trigger({
            appConfig: this.appConfig,
            isLoggingIn: this.isLoggingIn
        });
        location.reload();
    },
    showDialog (dialog) {
        this.dialog = dialog
        //console.log(dialog);
        this.trigger({
           dialog: this.dialog
        });
    }

});

export default MainStore;