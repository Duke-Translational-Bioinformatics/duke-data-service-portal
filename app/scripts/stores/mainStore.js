import Reflux from 'reflux';
import MainActions from '../actions/mainActions';
import appConfig from '../config';
import cookie from 'react-cookie';

var MainStore = Reflux.createStore({

    listenables: MainActions,


    init() {
        this.currentUser = cookie.load('currentUser');
        this.currentUser = {};
        this.appConfig = appConfig;
        this.asValidateLoading = false;
        this.ddsApiTokenLoading = false;
        this.appConfig.apiToken = cookie.load('apiToken');
        this.apiToken = cookie.load('apiToken');
        this.signedInfo = null;
        this.isLoggingIn = cookie.load('isLoggingIn');
        this.toasts = [];
        this.modalOpen = cookie.load('modalOpen');
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
        MainActions.getCurrentUser(apiToken);
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

    getCurrentUser () {
       
    },

    getCurrentUserSuccess (json, currentUser) {
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
        cookie.save('isLoggingIn', this.isLoggingIn);
        cookie.save('modalOpen', this.modalOpen);
        this.trigger({
            isLoggingIn: this.isLoggingIn,
            modalOpen: this.modalOpen
        });
    },

    handleLogout () {
        this.appConfig.apiToken = null;
        this.isLoggingIn = null;
        cookie.remove('apiToken');
        cookie.remove('currentUser');
        cookie.remove('isLoggingIn');
        this.trigger({
            appConfig: this.appConfig
        });
        location.reload();
    },

    addToast(msg) {
        this.toasts.push({
          msg: msg,
          ref: 'toast' + Math.floor(Math.random()*10000)
        });
        this.trigger({
            toasts: this.toasts
        });
    },

    removeToast(refId) {
        for(let i=0; i < this.toasts.length; i++){
            if (this.toasts[i].ref === refId) {
                this.toasts.splice(i, 1);
                break;
            }
        }
        this.trigger({
            toasts: this.toasts
        })
    },

    closePhiModal() {
        let expiresAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000));
        this.modalOpen = false;
        cookie.save('modalOpen', this.modalOpen, {expires: expiresAt});
        this.trigger({
            modalOpen: this.modalOpen
        })
    },

    addBreadCrumbs(url) {
        this.breadCrumbs.push({
            url: url,
            id: '',
            name: '',
            ref: 'breadCrumb' + Math.floor(Math.random()*10000)
        });
        this.trigger({
            breadCrumbs: this.breadCrumbs
        });
    },

    removeBreadCrumbs(refId) {
        for(let i=0; i < this.breadCrumbs.length; i++){
            if (this.breadCrumbs[i].ref === refId) {
                this.breadCrumbs.splice(i, 1);
                break;
            }
        }
        this.trigger({
            breadCrumbs: this.breadCrumbs
        })
    }

});

export default MainStore;