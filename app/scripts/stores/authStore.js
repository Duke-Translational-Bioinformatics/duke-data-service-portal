import React from 'react';
import mainStore from '../stores/mainStore';
import { observable, computed, action } from 'mobx';
import transportLayer from '../transportLayer';
import { UrlGen, Path } from '../util/urlEnum';
import { checkStatus, getFetchParams } from '../util/fetchUtil';
import appConfig from '../config';
import cookie from 'react-cookie';

export class AuthStore {
    @observable appConfig
    @observable authServiceLoading
    @observable currentUser
    @observable userKey
    @observable redirectUrl

    constructor() {
        this.appConfig = appConfig;
        this.authServiceLoading = false;
        this.currentUser = {};
        this.userKey = {};
        this.appConfig.redirectUrl = cookie.load('redirectUrl');
        this.appConfig.apiToken = cookie.load('apiToken');
        this.appConfig.isLoggedIn = cookie.load('isLoggedIn');
    }

    @action setLoadingStatus() {
        this.authServiceLoading = !this.authServiceLoading
    }

    @action setRedirectUrl(url) {
        this.appConfig.redirectUrl = url;
        let expiresAt = new Date(Date.now() + (60 * 60 * 1000));
        cookie.save('redirectUrl', this.appConfig.redirectUrl, {expires: expiresAt});
    }

    @action getAuthProviders() {
        transportLayer.getAuthProviders()
            .then(mainStore.checkResponse)
            .then(response => response.json())
            .then((json) => {
                if (json.results) {
                    let url = json.results.reduce((prev, curr) => {
                        return (curr.is_default) ? curr : prev;
                    }, null);
                    this.appConfig.authServiceUri = url.login_initiation_url;
                    this.appConfig.authServiceName = url.name;
                    this.appConfig.serviceId = url.service_id;
                } else {
                    throw "An error has occurred while trying to authenticate";
                }
            }).catch(ex => mainStore.handleErrors(ex));
    }

    @action getApiToken(accessToken) {
        transportLayer.getApiToken(accessToken, this.appConfig)
            .then(mainStore.checkResponse)
            .then(response => response.json())
            .then((json) => {
                if (json.api_token) {
                    let expiresAt = new Date(Date.now() + (60 * 60 * 2 * 1000));
                    this.appConfig.apiToken = json.api_token;
                    cookie.save('apiToken', this.appConfig.apiToken, {expires: expiresAt});
                } else {
                    throw "An error has occurred while trying to authenticate";
                }
            }).catch(ex => mainStore.handleErrors(ex));
    }

    @action getCurrentUser() {
        transportLayer.getCurrentUser()
            .then(mainStore.checkResponse)
            .then(response => response.json())
            .then(json => this.currentUser = json)
            .catch(ex => mainStore.handleErrors(ex));
    }

    @action getUserKey() {
        transportLayer.getUserKey()
            .then(mainStore.checkResponse)
            .then(response => response.json())
            .then((json) => this.userKey = json)
            .catch(ex =>mainStore.handleErrors(ex))
    }

    @action createUserKey() {
        transportLayer.createUserKey()
            .then(mainStore.checkResponse)
            .then(response => response.json())
            .then((json) => {
                mainStore.addToast('User Key created successfully');
                this.userKey = json;
            }).catch((ex) => {
                mainStore.addToast('Failed to create new User key');
                mainStore.handleErrors(ex)
            })
    }

    @action deleteUserKey() {
        transportLayer.deleteUserKey()
            .then(mainStore.checkResponse)
            .then(response => {})
            .then((json) => {
                mainStore.addToast('User key deleted');
                this.userKey = {};
            }).catch((ex) => {
                mainStore.addToast('Failed to delete user key');
                mainStore.handleErrors(ex)
            });
    }

    @action isLoggedInHandler() {
        let expiresAt = new Date(Date.now() + (60 * 1000));
        this.appConfig.isLoggedIn = true;
        cookie.save('isLoggedIn', this.appConfig.isLoggedIn, {expires: expiresAt});
        this.authServiceLoading = true;
    }

    @action removeLoginCookie() {
        this.appConfig.isLoggedIn = null;
        cookie.remove('isLoggedIn');
    }

    @action handleLogout(status) {
        this.appConfig.apiToken = null;
        cookie.remove('apiToken');
        this.appConfig.isLoggedIn = null;
        cookie.remove('isLoggedIn');
        if(status !== 401) {
            this.appConfig.redirectUrl = null;
            cookie.remove('redirectUrl');
        }
        location.reload();
    }
}

const authStore = new AuthStore();

export default authStore;