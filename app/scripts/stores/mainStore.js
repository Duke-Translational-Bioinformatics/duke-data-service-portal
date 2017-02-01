import Reflux from 'reflux';
import MainActions from '../actions/mainActions';
import ProjectStore from '../stores/projectStore';
import BaseUtils from '../../util/baseUtils.js';
import appConfig from '../config';
import cookie from 'react-cookie';

var MainStore = Reflux.createStore({

    init() {
        this.listenToMany(MainActions);
        this.appConfig = appConfig;
        this.appConfig.apiToken = cookie.load('apiToken');
        this.appConfig.isLoggedIn = cookie.load('isLoggedIn');
        this.authServiceLoading = false;
        this.currentUser = {};
        this.error = {};
        this.errorModals = [];
        this.failedUploads = [];
        this.modalOpen = cookie.load('modalOpen');
        this.signedInfo = null;
        this.toasts = [];
    },

    getAuthProvidersSuccess(providers) {
        let url = providers.reduce(function(prev, curr) { return (!curr.is_deprecated) ? curr : prev; }, null);
        this.appConfig.authServiceUri = url.login_initiation_url;
        this.appConfig.authServiceName = url.name;
        this.trigger({
            appConfig: this.appConfig
        })
    },

    getApiToken(appConfig, accessToken) {
        this.authServiceLoading = true;
        this.trigger({
            authServiceLoading: this.authServiceLoading,
            appConfig: this.appConfig
        });
    },

    getApiTokenSuccess (token) {
        this.appConfig.apiToken = token;
        this.authServiceLoading = false;
        this.setApiToken(token);
        this.trigger({
            authServiceLoading: this.authServiceLoading,
            appConfig: this.appConfig
        });

    },

    getApiTokenError (error) {
        let msg = error && error.message ? error.message : 'An error occurred.';
        this.trigger({
            error: msg,
            authServiceLoading: false
        });
    },

    setApiToken (apiToken) {
        let expiresAt = new Date(Date.now() + (60 * 60 * 2 * 1000));
        this.appConfig.apiToken = apiToken;
        cookie.save('apiToken', this.appConfig.apiToken, {expires: expiresAt});
        this.trigger({
            appConfig: this.appConfig
        });
        MainActions.getCurrentUser();
    },

    getCurrentUserSuccess (json) {
        this.currentUser = json;
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
        let expiresAt = new Date(Date.now() + (60 * 1000));
        this.appConfig.isLoggedIn = true;
        cookie.save('isLoggedIn', this.appConfig.isLoggedIn, {expires: expiresAt});
        this.modalOpen = MainStore.modalOpen;
        this.trigger({
            appConfig: this.appConfig,
            modalOpen: this.modalOpen
        });
    },

    removeLoginCookie() {
        this.appConfig.isLoggedIn = null;
        cookie.remove('isLoggedIn');
        this.trigger({
            appConfig: this.appConfig
        });
    },

    handleLogout () {
        this.appConfig.apiToken = null;
        cookie.remove('apiToken');
        this.appConfig.isLoggedIn = null;
        cookie.remove('isLoggedIn');
        localStorage.removeItem('redirectTo');
        this.trigger({
            appConfig: this.appConfig
        });
        location.reload();
    },

    addToast(msg) {
        this.toasts.push({
            msg: msg,
            ref: 'toast' + Math.floor(Math.random() * 10000)
        });
        this.trigger({
            toasts: this.toasts
        });
    },

    removeToast(refId) {
        for (let i = 0; i < this.toasts.length; i++) {
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

    failedUpload(failedUploads) {
        this.failedUploads = failedUploads;
        this.trigger({
            failedUploads: this.failedUploads
        })
    },

    removeFailedUploads() {
        this.failedUploads = [];
        this.trigger({
            failedUploads: this.failedUploads
        })
    },

    displayErrorModals(error) {
        let err = error && error.message ? {msg: error.message, response: error.response ? error.response.status : null} : null;
        if(err.response === null) {
            this.errorModals.push({
                msg: error.message,
                response: 'Folders can not be uploaded',
                ref: 'modal' + Math.floor(Math.random() * 10000)
            });
        } else {
            if (error && error.response.status !== 404) {
                this.errorModals.push({
                    msg: error.response.status === 403 ? error.message + ': You don\'t have permissions to view or change' +
                    ' this resource' : error.message,
                    response: error.response.status,
                    ref: 'modal' + Math.floor(Math.random() * 10000)
                });
            }
        }
        this.error = err;
        this.trigger({
            error: this.error,
            errorModals: this.errorModals
        })
    },

    clearErrors(error) {
        this.error = {};
        this.trigger({
            error: this.error
        })
    },

    removeErrorModal(refId) {
        for (let i = 0; i < this.errorModals.length; i++) {
            if (this.errorModals[i].ref === refId) {
                this.errorModals.splice(i, 1);
                break;
            }
        }
        this.error = {};
        this.trigger({
            error: this.error,
            errorModals: this.errorModals
        })
    }

});

export default MainStore;
