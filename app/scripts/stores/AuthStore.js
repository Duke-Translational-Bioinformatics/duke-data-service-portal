import React from 'react';
import mainStore from '../stores/mainStore';
import { observable, computed, action } from 'mobx';
import { UrlGen, Path } from '../../util/urlEnum';
import { checkStatus, getFetchParams } from '../../util/fetchUtil';
import appConfig from '../config';
import cookie from 'react-cookie';

export class AuthStore {
    @observable appConfig
    @observable authServiceLoading
    @observable currentUser

    constructor() {
        this.appConfig = appConfig;
        this.authServiceLoading = false;
        this.currentUser = {};
        this.appConfig.apiToken = cookie.load('apiToken');
        this.appConfig.isLoggedIn = cookie.load('isLoggedIn');
    }

    setLoadingStatus() {
        this.authServiceLoading = !this.authServiceLoading
    }

    @action getAuthProviders() {
        fetch(DDS_PORTAL_CONFIG.baseUrl + UrlGen.routes.apiPrefix + 'auth_providers', getFetchParams('get'))
            .then(mainStore.checkResponse)
            .then((response) => {return response.json()})
            .then((json) => {
                if (json.results) {
                    let url = json.results.reduce((prev, curr) => {
                        return (!curr.is_deprecated) ? curr : prev;
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
        fetch(this.appConfig.baseUrl + UrlGen.routes.apiPrefix + Path.ACCESS_TOKEN + accessToken + '&authentication_service_id=' + this.appConfig.serviceId, getFetchParams('get'))
            .then(mainStore.checkResponse)
            .then((response) => {return response.json()})
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
        fetch(UrlGen.routes.baseUrl + UrlGen.routes.apiPrefix + Path.CURRENT_USER,
            getFetchParams('get', authStore.appConfig.apiToken))
            .then(mainStore.checkResponse)
            .then((response) => { return response.json() })
            .then(json => this.currentUser = json)
            .catch(ex => mainStore.handleErrors(ex));
    }

    isLoggedInHandler() {
        let expiresAt = new Date(Date.now() + (60 * 1000));
        this.appConfig.isLoggedIn = true;
        cookie.save('isLoggedIn', this.appConfig.isLoggedIn, {expires: expiresAt});
        this.authServiceLoading = true;
    }

    removeLoginCookie() {
        this.appConfig.isLoggedIn = null;
        cookie.remove('isLoggedIn');
    }

    handleLogout() {
        this.appConfig.apiToken = null;
        cookie.remove('apiToken');
        this.appConfig.isLoggedIn = null;
        cookie.remove('isLoggedIn');
        localStorage.removeItem('redirectTo');
        location.reload();
    }
}

const authStore = new AuthStore();

export default authStore;