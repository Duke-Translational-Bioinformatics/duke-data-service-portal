import Reflux from 'reflux';
import { observable, computed, autorun, action } from 'mobx';
import MainActions from '../actions/mainActions';
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import BaseUtils from '../../util/baseUtils.js';
import {UrlGen, Path} from '../../util/urlEnum';
import { checkStatus, getFetchParams } from '../../util/fetchUtil';
import appConfig from '../config';
import cookie from 'react-cookie';

export class MainStore {
    @observable appConfig
    @observable authServiceLoading
    @observable currentUser
    @observable error
    @observable errorModals
    @observable failedUploads
    @observable toasts
    @observable modalOpen

    constructor() {
        this.appConfig = appConfig;
        this.authServiceLoading = false;
        this.currentUser = {};
        this.error = null;
        this.errorModals = [];
        this.failedUploads = [];
        this.toasts = [];
        this.appConfig.apiToken = cookie.load('apiToken');
        this.appConfig.isLoggedIn = cookie.load('isLoggedIn');
        this.modalOpen = cookie.load('modalOpen');
    }

    getError = (error) => {
        this.error = error && error.message ? error.message : 'An error occurred.';
    }

    @action getCurrentUserSuccess(user) {
        this.currentUser = user;
    }

    @action getAuthProvidersSuccess(providers) {
        let url = providers.reduce((prev, curr) => { return (!curr.is_deprecated) ? curr : prev; }, null);
        this.appConfig.authServiceUri = url.login_initiation_url;
        this.appConfig.authServiceName = url.name;
        this.appConfig.serviceId = url.service_id;
    }

    @action getApiTokenSuccess(apiToken) {
        this.appConfig.apiToken = apiToken;
        this.setApiToken(apiToken);
        this.authServiceLoading = false;
    }

    setApiToken = (apiToken) => {
        let expiresAt = new Date(Date.now() + (60 * 60 * 2 * 1000));
        this.appConfig.apiToken = apiToken;
        cookie.save('apiToken', this.appConfig.apiToken, {expires: expiresAt});
        this.getCurrentUser();
    }

    isLoggedInHandler() { //Todo: probably don't need this with Mobx. This was a hack to get around the
    // multiple extraneous renders caused by Reflux wierdness
        let expiresAt = new Date(Date.now() + (60 * 1000));
        this.appConfig.isLoggedIn = true;
        cookie.save('isLoggedIn', this.appConfig.isLoggedIn, {expires: expiresAt});
        this.modalOpen = mainStore.modalOpen;
        this.authServiceLoading = true;
    }

    removeLoginCookie() {
        this.appConfig.isLoggedIn = null;
        cookie.remove('isLoggedIn');
    }

    handleLogout () {
        this.appConfig.apiToken = null;
        cookie.remove('apiToken');
        this.appConfig.isLoggedIn = null;
        cookie.remove('isLoggedIn');
        localStorage.removeItem('redirectTo');
        location.reload();
    }

    addToast(msg) {
        this.toasts.push({
            msg: msg,
            ref: 'toast' + Math.floor(Math.random() * 10000)
        });
    }

    removeToast(refId) {
        for (let i = 0; i < this.toasts.length; i++) {
            if (this.toasts[i].ref === refId) {
                this.toasts.splice(i, 1);
                break;
            }
        }
    }

    closePhiModal() {
        let expiresAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000));
        this.modalOpen = false;
        cookie.save('modalOpen', this.modalOpen, {expires: expiresAt});
    }

    failedUpload(failedUploads) {
        this.failedUploads = failedUploads;
    }

    removeFailedUploads() {
        this.failedUploads = [];
    }

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
    }

    clearErrors(error) {
        this.error = {};
    }

    removeErrorModal(refId) {
        for (let i = 0; i < this.errorModals.length; i++) {
            if (this.errorModals[i].ref === refId) {
                this.errorModals.splice(i, 1);
                break;
            }
        }
        this.error = {};
    }

}

const mainStore = new MainStore();

export default mainStore;
